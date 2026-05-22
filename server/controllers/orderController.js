// controllers/orderController.js — Order Operations
const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// ─── Create Order ─────────────────────────────
// POST /api/orders
const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod, notes } = req.body;

  // Get user's cart
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error('Cart is empty');
  }

  // Build order items & verify stock
  const orderItems = [];
  for (const item of cart.items) {
    const product = item.product;
    if (!product) {
      res.status(404);
      throw new Error('A product in your cart no longer exists');
    }
    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for "${product.title}"`);
    }
    orderItems.push({
      product: product._id,
      title: product.title,
      image: product.images[0]?.url || '',
      price: product.price,
      quantity: item.quantity,
    });
  }

  // Calculate prices
  const itemsPrice = orderItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const shippingPrice = itemsPrice > 999 ? 0 : 99; // Free shipping above ₹999
  const taxPrice = Math.round(itemsPrice * 0.18 * 100) / 100; // 18% GST
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  // Create the order
  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod: paymentMethod || 'cod',
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    notes,
    isPaid: paymentMethod === 'cod' ? false : false,
  });

  // Decrease product stock
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
  }

  // Clear cart after order
  await Cart.findOneAndDelete({ user: req.user._id });

  res.status(201).json({
    success: true,
    message: 'Order placed successfully',
    data: order,
  });
});

// ─── Get My Orders ────────────────────────────
// GET /api/orders/my
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, data: orders });
});

// ─── Get Single Order ─────────────────────────
// GET /api/orders/:id
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Allow access only to the owner or admin
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }

  res.json({ success: true, data: order });
});

// ─── Get All Orders (Admin) ───────────────────
// GET /api/orders
const getAllOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const query = {};
  if (req.query.status) query.orderStatus = req.query.status;

  const total = await Order.countDocuments(query);
  const orders = await Order.find(query)
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.json({
    success: true,
    data: orders,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

// ─── Update Order Status (Admin) ─────────────
// PUT /api/orders/:id
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const { orderStatus, trackingNumber } = req.body;

  order.orderStatus = orderStatus || order.orderStatus;
  if (trackingNumber) order.trackingNumber = trackingNumber;

  if (orderStatus === 'delivered') {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.isPaid = true;
    order.paidAt = Date.now();
  }

  const updated = await order.save();
  res.json({ success: true, message: 'Order status updated', data: updated });
});

// ─── Admin Dashboard Stats ────────────────────
// GET /api/orders/stats
const getOrderStats = asyncHandler(async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });
  const deliveredOrders = await Order.countDocuments({ orderStatus: 'delivered' });

  const revenueData = await Order.aggregate([
    { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } },
  ]);

  const totalRevenue = revenueData[0]?.totalRevenue || 0;

  // Last 7 days orders
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentOrders = await Order.find({ createdAt: { $gte: sevenDaysAgo } })
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(10);

  res.json({
    success: true,
    data: { totalOrders, pendingOrders, deliveredOrders, totalRevenue, recentOrders },
  });
});

module.exports = { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus, getOrderStats };
