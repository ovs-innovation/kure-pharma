const mongoose = require("mongoose");
const Product = require("../../models/Product");
const Coupon = require("../../models/Coupon");
const {
  clampQuantity,
  getUnitPriceForQuantity,
  roundMoney: roundQtyMoney,
} = require("../pricing/quantityPricing");
const { assertSufficientStock } = require("../stock/inventory");

const roundMoney = (value) => Math.round((Number(value) || 0) * 100) / 100;

const resolveVariant = (product, cartVariant = {}) => {
  if (!product?.isCombination || !Array.isArray(product.variants)) {
    return null;
  }

  const variantProductId = cartVariant?.productId;
  const variantId = cartVariant?._id;

  if (variantProductId) {
    const match = product.variants.find(
      (variant) => variant?.productId === variantProductId
    );
    if (match) return match;
  }

  if (variantId) {
    const match = product.variants.find(
      (variant) => String(variant?._id) === String(variantId)
    );
    if (match) return match;
  }

  return product.variants[0] || null;
};

const resolveLinePricing = (product, cartItem) => {
  const variant = resolveVariant(product, cartItem?.variant);

  if (product.isCombination && variant) {
    return {
      price: roundMoney(variant.price ?? product.price ?? 0),
      basePrice: roundMoney(
        variant.basePrice ?? variant.originalPrice ?? product.basePrice ?? variant.price ?? 0
      ),
      gstPercentage: roundMoney(
        variant.gstPercentage ?? product.gstPercentage ?? 0
      ),
      deliveryCharge: roundMoney(product.deliveryCharge ?? 0),
      sku: variant.sku || product.sku || "",
      barcode: variant.barcode || product.barcode || "",
      variant,
      isCombination: true,
    };
  }

  return {
    price: roundMoney(product.price ?? 0),
    basePrice: roundMoney(product.basePrice ?? product.price ?? 0),
    gstPercentage: roundMoney(product.gstPercentage ?? 0),
    deliveryCharge: roundMoney(product.deliveryCharge ?? 0),
    sku: product.sku || "",
    barcode: product.barcode || "",
    variant: cartItem?.variant || {},
    isCombination: Boolean(product.isCombination),
  };
};

const calculateCouponDiscount = async ({ couponCode, subTotal }) => {
  if (!couponCode) {
    return 0;
  }

  const coupon = await Coupon.findOne({
    couponCode: String(couponCode).trim(),
    status: "show",
  });

  if (!coupon) {
    throw new Error("Invalid coupon code.");
  }

  const now = new Date();
  if (coupon.startTime && now < new Date(coupon.startTime)) {
    throw new Error("Coupon is not active yet.");
  }
  if (coupon.endTime && now > new Date(coupon.endTime)) {
    throw new Error("Coupon has expired.");
  }

  const minimumAmount = Number(coupon.minimumAmount) || 0;
  if (subTotal < minimumAmount) {
    throw new Error(
      `Order subtotal must be at least ${minimumAmount} to use this coupon.`
    );
  }

  const discountType = coupon.discountType?.type;
  const discountValue = Number(coupon.discountType?.value) || 0;

  if (discountType === "percentage") {
    return roundMoney((subTotal * discountValue) / 100);
  }

  return roundMoney(Math.min(discountValue, subTotal));
};

const calculateOrderTotals = async ({
  cart = [],
  couponCode,
  shippingOption,
  discount: clientDiscount,
}) => {
  if (!Array.isArray(cart) || cart.length === 0) {
    throw new Error("Cart is empty.");
  }

  const productIds = [
    ...new Set(
      cart
        .map((item) => item?.id || item?._id)
        .filter((id) => mongoose.Types.ObjectId.isValid(id))
    ),
  ];

  const products = await Product.find({
    _id: { $in: productIds },
    status: "show",
  });

  const productMap = new Map(products.map((product) => [String(product._id), product]));

  const normalizedCart = [];
  let subTotal = 0;
  let shippingCost = 0;

  for (const cartItem of cart) {
    const productId = String(cartItem?.id || cartItem?._id || "");
    const product = productMap.get(productId);

    if (!product) {
      throw new Error("One or more products in the cart are unavailable.");
    }

    const quantity = clampQuantity(
      product,
      parseInt(cartItem?.quantity, 10) || 0
    );

    const titleHint =
      cartItem?.title?.en ||
      cartItem?.title ||
      product?.title?.en ||
      "Product";
    assertSufficientStock(product, quantity, titleHint);

    const pricing = resolveLinePricing(product, cartItem);
    const unitPrice = roundQtyMoney(
      getUnitPriceForQuantity(product, quantity) || pricing.price
    );
    const itemTotal = roundMoney(unitPrice * quantity);
    const lineDelivery = roundMoney(pricing.deliveryCharge * quantity);

    subTotal += itemTotal;
    shippingCost += lineDelivery;

    normalizedCart.push({
      id: product._id,
      _id: product._id,
      title: cartItem?.title || product.title,
      image: cartItem?.image || product.image?.[0],
      price: unitPrice,
      quantity,
      itemTotal,
      minQty: clampQuantity(product, 1),
      maxQty: parseInt(product.maxOrderQuantity, 10) || 0,
      variant: pricing.variant,
      gstPercentage: pricing.gstPercentage,
      basePrice: pricing.basePrice,
      sku: pricing.sku,
      barcode: pricing.barcode,
      hsn: product.hsnCode || cartItem?.hsn || "",
      hsnCode: product.hsnCode || cartItem?.hsnCode || "",
      deliveryCharge: pricing.deliveryCharge,
      isCombination: pricing.isCombination,
    });
  }

  subTotal = roundMoney(subTotal);
  shippingCost = roundMoney(shippingCost);

  let discount = 0;
  if (couponCode) {
    discount = await calculateCouponDiscount({ couponCode, subTotal });
  } else if (clientDiscount) {
    // Never trust client discount unless a valid coupon code is supplied.
    discount = 0;
  }

  discount = roundMoney(Math.min(discount, subTotal));
  const total = roundMoney(Math.max(subTotal + shippingCost - discount, 0));

  return {
    cart: normalizedCart,
    subTotal,
    shippingCost,
    discount,
    total,
    shippingOption: shippingOption || "Product Delivery",
  };
};

module.exports = {
  calculateOrderTotals,
  roundMoney,
};
