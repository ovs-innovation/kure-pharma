const axios = require('axios');
const Order = require('../models/Order');

const getShiprocketToken = async () => {
  try {
    const response = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
      email:process.env.SHIPROCKET_EMAIL,
      password:process.env.SHIPROCKET_PASSWORD
    });
    console.log("The data is : ",response.data);
    return response.data.token;
  } catch (error) {
    console.error('Shiprocket Authentication Failed:', error.response?.data || error.message);
    throw new Error('Failed to authenticate with Shiprocket');
  }
};

const createShiprocketOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).send({ message: 'Order not found' });
    }

    if (order.shiprocketOrderId) {
      return res.status(400).send({ message: 'Shiprocket order already created' });
    }

    const token = await getShiprocketToken();

    const orderItems = order.cart.map(item => ({
      name: item.title,
      sku: item.sku || 'N/A',
      units: item.quantity,
      selling_price: item.price,
      discount: item.discount || 0,
      tax: item.tax || 0,
      hsn: item.hsnCode || item.hsn || ''
    }));

    // Example payload based on Shiprocket specs
    const shiprocketData = {
      order_id: order.orderId || order._id,
      order_date: new Date(order.createdAt).toISOString().split('T')[0],
      pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION || 'Primary',
      billing_customer_name: order.user_info.name.split(' ')[0] || 'Customer',
      billing_last_name: order.user_info.name.split(' ')[1] || '',
      billing_address: order.user_info.address || 'N/A',
      billing_address_2: '',
      billing_city: order.user_info.city || 'N/A',
      billing_pincode: order.user_info.zipCode || '000000',
      billing_state: order.user_info.country || 'N/A',
      billing_country: 'India', // Usually India for local Shiprocket
      billing_email: order.user_info.email || 'customer@example.com',
      billing_phone: order.user_info.contact || '0000000000',
      shipping_is_billing: true,
      order_items: orderItems,
      payment_method: order.paymentMethod === 'Cash' || order.paymentMethod === 'COD' ? 'COD' : 'Prepaid',
      shipping_charges: order.shippingCost || 0,
      total_discount: order.discount || 0,
      sub_total: order.subTotal || 0,
      length: 10,
      breadth: 15,
      height: 20,
      weight: 1 // Example fixed weight, in real scenario fetch from products
    };

    const response = await axios.post(
      'https://apiv2.shiprocket.in/v1/external/orders/create/adhoc',
      shiprocketData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    );
   
    if (response.data && response.data.order_id) {
      // Save Shiprocket ID and details in your database
      order.shiprocketOrderId = response.data.order_id;
      order.shiprocketShipmentId = response.data.shipment_id;
      order.shiprocketStatus = response.data.status;
      order.deliveryStatus = "Shipped";
      await order.save();

      res.status(200).send({
        message: 'Order created successfully on Shiprocket',
        shiprocketData: response.data
      });
    } else {
      res.status(400).send({ message: 'Failed to create Shiprocket order', data: response.data });
    }
  } catch (err) {
    console.error('Create Shiprocket Error:', err.response?.data || err.message);
    res.status(500).send({ message: err.message, errorDetails: err.response?.data });
  }
};

const handleShiprocketWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.SHIPROCKET_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return res.status(503).send({ message: "Shiprocket webhook secret is not configured." });
    }

    const providedSecret =
      req.headers["x-shiprocket-token"] ||
      req.headers["x-webhook-secret"] ||
      req.body?.webhook_secret;

    if (providedSecret !== webhookSecret) {
      return res.status(401).send({ message: "Unauthorized webhook request." });
    }

    const { order_id, shipment_id, status } = req.body;
    console.log('Shiprocket Webhook received:', { order_id, shipment_id, status });

    // Look up by shipment_id or order_id
    const order = await Order.findOne({
      $or: [
        { shiprocketShipmentId: shipment_id },
        { shiprocketOrderId: order_id }
      ]
    });

    if (!order) {
      return res.status(404).send({ message: 'Order not found for this shipment' });
    }

    // Update internal tracking status
    order.shiprocketStatus = status;

    // Map Shiprocket statuses to internal Delivery Status
    const statusMap = {
      'shipped': 'Shipped',
      'in transit': 'In Transit',
      'delivered': 'Delivered',
      'canceled': 'Cancelled',
      'returned': 'Returned'
    };

    const newDeliveryStatus = statusMap[status.toLowerCase()];
    if (newDeliveryStatus) {
      order.deliveryStatus = newDeliveryStatus;
    }

    await order.save();

    res.status(200).send({ message: 'Webhook processed successfully' });
  } catch (err) {
    console.error('Shiprocket Webhook Error:', err.message);
    res.status(500).send({ message: err.message });
  }
};

module.exports = {
  createShiprocketOrder,
  handleShiprocketWebhook
};
