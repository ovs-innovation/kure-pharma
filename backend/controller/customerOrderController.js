require("dotenv").config();
const stripe = require("stripe");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const MailChecker = require("mailchecker");

const mongoose = require("mongoose");

const Order = require("../models/Order");
const Setting = require("../models/Setting");
const { sendEmail } = require("../lib/email-sender/sender");
const { formatAmountForStripe } = require("../lib/stripe/stripe");
const customerInvoiceEmailBody = require("../lib/email-sender/templates/order-to-customer");
const { handleCreateInvoice } = require("../lib/email-sender/create");
const {
  queueOrderInvoiceEmail,
} = require("../lib/email-sender/sendOrderInvoiceEmail");
const { queueOrderNotificationEmail } = require("../lib/email-sender/adminNotificationEmail");
const { handleProductQuantity } = require("../lib/stock-controller/others");
const {
  calculateOrderTotals,
  roundMoney,
} = require("../lib/order/calculateOrderTotals");

const generateOrderId = () =>
  "ORD-" + crypto.randomBytes(4).toString("hex").toUpperCase();

const getRazorpayCredentials = async () => {
  const razorpayKeyIdEnv = process.env.RAZORPAY_KEY_ID;
  const razorpaySecretEnv = process.env.RAZORPAY_KEY_SECRET;

  const storeSetting =
    !razorpayKeyIdEnv || !razorpaySecretEnv
      ? await Setting.findOne({ name: "storeSetting" })
      : null;

  const key_id = razorpayKeyIdEnv || storeSetting?.setting?.razorpay_id;
  const key_secret =
    razorpaySecretEnv || storeSetting?.setting?.razorpay_secret;

  return { key_id, key_secret };
};

const buildOrderPayload = async (req, { paymentMethod, status }) => {
  const {
    cart,
    user_info,
    shippingOption,
    couponCode,
    discount,
  } = req.body || {};

  const totals = await calculateOrderTotals({
    cart,
    couponCode,
    shippingOption,
    discount,
  });

  return {
    user_info,
    cart: totals.cart,
    subTotal: totals.subTotal,
    shippingCost: totals.shippingCost,
    discount: totals.discount,
    total: totals.total,
    shippingOption: totals.shippingOption,
    paymentMethod,
    status,
    user: req.user._id,
    orderId: req.body?.orderId || generateOrderId(),
  };
};

const addOrder = async (req, res) => {
  try {
    const orderPayload = await buildOrderPayload(req, {
      paymentMethod: "Cash",
      status: "Pending",
    });

    const newOrder = new Order(orderPayload);
    const order = await newOrder.save();
    await handleProductQuantity(order.cart);
    res.status(201).send(order);
    queueOrderInvoiceEmail(order);
    queueOrderNotificationEmail(order);
  } catch (err) {
    res.status(err.message?.includes("cart") ? 400 : 500).send({
      message: err.message,
    });
  }
};

const createPaymentIntent = async (req, res) => {
  try {
    const totals = await calculateOrderTotals({
      cart: req.body?.cart || [],
      couponCode: req.body?.couponCode,
      shippingOption: req.body?.shippingOption,
      discount: req.body?.discount,
    });
    const amount = totals.total;
    const { cardInfo: existingPaymentIntent } = req.body;

    if (!(amount >= process.env.MIN_AMOUNT && amount <= process.env.MAX_AMOUNT)) {
      return res.status(500).json({ message: "Invalid amount." });
    }

    const storeSetting = await Setting.findOne({ name: "storeSetting" });
    const stripeSecret = storeSetting?.setting?.stripe_secret;
    const stripeInstance = stripe(stripeSecret);

    if (existingPaymentIntent?.id) {
      try {
        const current_intent = await stripeInstance.paymentIntents.retrieve(
          existingPaymentIntent.id
        );
        if (current_intent) {
          const updated_intent = await stripeInstance.paymentIntents.update(
            existingPaymentIntent.id,
            {
              amount: formatAmountForStripe(amount, "usd"),
            }
          );
          return res.send(updated_intent);
        }
      } catch (err) {
        if (err.code !== "resource_missing") {
          const errorMessage =
            err instanceof Error ? err.message : "Internal server error";
          return res.status(500).send({ message: errorMessage });
        }
      }
    }

    const params = {
      amount: formatAmountForStripe(amount, "usd"),
      currency: "usd",
      description: process.env.STRIPE_PAYMENT_DESCRIPTION || "",
      automatic_payment_methods: {
        enabled: true,
      },
    };
    const newPaymentIntent = await stripeInstance.paymentIntents.create(params);
    res.send(newPaymentIntent);
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Internal server error";
    res.status(500).send({ message: errorMessage });
  }
};

const createOrderByRazorPay = async (req, res) => {
  try {
    const { key_id, key_secret } = await getRazorpayCredentials();

    if (!key_id || !key_secret) {
      return res.status(500).send({
        message:
          "Razorpay credentials not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to backend .env.",
      });
    }

    const totals = await calculateOrderTotals({
      cart: req.body?.cart || [],
      couponCode: req.body?.couponCode,
      shippingOption: req.body?.shippingOption,
      discount: req.body?.discount,
    });

    const instance = new Razorpay({
      key_id,
      key_secret,
    });

    const options = {
      amount: Math.round(totals.total * 100),
      currency: "INR",
    };
    const order = await instance.orders.create(options);

    if (!order) {
      return res.status(500).send({
        message: "Error occurred when creating order!",
      });
    }

    res.send({
      ...order,
      calculatedTotal: totals.total,
    });
  } catch (err) {
    res.status(err.message?.includes("cart") ? 400 : 500).send({
      message: err.message,
    });
  }
};

const addRazorpayOrder = async (_req, res) => {
  return res.status(410).send({
    message:
      "This endpoint is disabled. Complete payment and use /order/verify/razorpay instead.",
  });
};

const verifyRazorpaySignature = (secret, orderId, paymentId, signature) => {
  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  const generatedBuffer = Buffer.from(generatedSignature, "hex");
  const providedBuffer = Buffer.from(signature, "hex");

  if (generatedBuffer.length !== providedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(generatedBuffer, providedBuffer);
};

const verifyRazorpayPaymentAndAddOrder = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      cart,
      user_info,
      shippingOption,
      couponCode,
      discount,
    } = req.body || {};

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).send({
        message:
          "Missing Razorpay payment details (order_id/payment_id/signature).",
      });
    }

    const existingOrder = await Order.findOne({
      razorpayPaymentId: razorpay_payment_id,
    });
    if (existingOrder) {
      return res.status(200).send(existingOrder);
    }

    const { key_id, key_secret } = await getRazorpayCredentials();
    if (!key_secret) {
      return res.status(500).send({
        message:
          "Razorpay secret not configured. Add RAZORPAY_KEY_SECRET to backend .env.",
      });
    }

    if (
      !verifyRazorpaySignature(
        key_secret,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      )
    ) {
      return res.status(400).send({
        message: "Invalid Razorpay signature.",
      });
    }

    const totals = await calculateOrderTotals({
      cart,
      couponCode,
      shippingOption,
      discount,
    });

    const instance = new Razorpay({
      key_id,
      key_secret,
    });
    const razorpayOrder = await instance.orders.fetch(razorpay_order_id);
    const paidAmount = roundMoney(Number(razorpayOrder.amount) / 100);

    if (paidAmount !== totals.total) {
      return res.status(400).send({
        message: "Payment amount does not match the calculated order total.",
      });
    }

    const newOrder = new Order({
      user_info,
      cart: totals.cart,
      subTotal: totals.subTotal,
      shippingCost: totals.shippingCost,
      discount: totals.discount,
      total: totals.total,
      shippingOption: totals.shippingOption,
      user: req.user._id,
      orderId: req.body?.orderId || generateOrderId(),
      paymentMethod: "Razorpay",
      status: "Processing",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
    });

    const order = await newOrder.save();
    await handleProductQuantity(order.cart);
    queueOrderInvoiceEmail(order);
    queueOrderNotificationEmail(order);

    res.status(201).send(order);
  } catch (err) {
    res.status(err.message?.includes("cart") ? 400 : 500).send({
      message: err.message,
    });
  }
};

const getOrderCustomer = async (req, res) => {
  try {
    const { page, limit } = req.query;

    const pages = Number(page) || 1;
    const limits = Number(limit) || 8;
    const skip = (pages - 1) * limits;

    const totalDoc = await Order.countDocuments({ user: req.user._id });

    const totalPendingOrder = await Order.aggregate([
      {
        $match: {
          status: "Pending",
          user: mongoose.Types.ObjectId(req.user._id),
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    const totalProcessingOrder = await Order.aggregate([
      {
        $match: {
          status: "Processing",
          user: mongoose.Types.ObjectId(req.user._id),
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    const totalDeliveredOrder = await Order.aggregate([
      {
        $match: {
          status: "Delivered",
          user: mongoose.Types.ObjectId(req.user._id),
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    const orders = await Order.find({ user: req.user._id })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limits);

    res.send({
      orders,
      limits,
      pages,
      pending: totalPendingOrder.length === 0 ? 0 : totalPendingOrder[0].count,
      processing:
        totalProcessingOrder.length === 0 ? 0 : totalProcessingOrder[0].count,
      delivered:
        totalDeliveredOrder.length === 0 ? 0 : totalDeliveredOrder[0].count,

      totalDoc,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).send({
        message: "Order not found.",
      });
    }

    if (String(order.user) !== String(req.user._id)) {
      return res.status(403).send({
        message: "You are not authorized to view this order.",
      });
    }

    res.send(order);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const sendEmailInvoiceToCustomer = async (req, res) => {
  try {
    const user = req.body.user_info;
    const isAdmin = req.user?.type === "admin";

    if (!isAdmin) {
      if (
        !user?.email ||
        String(user.email).toLowerCase() !== String(req.user.email).toLowerCase()
      ) {
        return res.status(403).send({
          message: "You can only send invoices to your own email address.",
        });
      }

      if (req.body?._id) {
        const order = await Order.findById(req.body._id);
        if (!order || String(order.user) !== String(req.user._id)) {
          return res.status(403).send({
            message: "You are not authorized to send this invoice.",
          });
        }
      }
    }

    if (!MailChecker.isValid(user?.email)) {
      return res.status(400).send({
        message:
          "Invalid or disposable email address. Please provide a valid email.",
      });
    }

    const pdf = await handleCreateInvoice(req.body, `${req.body.invoice}.pdf`);

    const option = {
      date: req.body.date,
      invoice: req.body.invoice,
      status: req.body.status,
      method: req.body.paymentMethod,
      subTotal: req.body.subTotal,
      total: req.body.total,
      discount: req.body.discount,
      shipping: req.body.shippingCost,
      currency: req.body.company_info.currency,
      company_name: req.body.company_info.company,
      company_address: req.body.company_info.address,
      company_phone: req.body.company_info.phone,
      company_email: req.body.company_info.email,
      company_website: req.body.company_info.website,
      vat_number: req.body?.company_info?.vat_number,
      name: user?.name,
      email: user?.email,
      phone: user?.phone,
      address: user?.address,
      cart: req.body.cart,
    };

    const body = {
      from: req.body.company_info?.from_email || "sales@Elecmoon.com",
      to: user.email,
      subject: `Your Order - ${req.body.invoice} at ${req.body.company_info.company}`,
      html: customerInvoiceEmailBody(option),
      attachments: [
        {
          filename: `${req.body.invoice}.pdf`,
          content: pdf,
        },
      ],
    };
    const message = `Invoice successfully sent to the customer ${user.name}`;
    sendEmail(body, res, message);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
  addOrder,
  getOrderById,
  getOrderCustomer,
  createPaymentIntent,
  createOrderByRazorPay,
  addRazorpayOrder,
  verifyRazorpayPaymentAndAddOrder,
  sendEmailInvoiceToCustomer,
};
