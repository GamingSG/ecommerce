// controllers/cartController.js — Cart Operations
const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// ─── Get Cart ─────────────────────────────────
// GET /api/cart
const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    'items.product', 'title images price stock'
  );

  if (!cart) {
    return res.json({ success: true, data: { items: [], totalPrice: 0 } });
  }

  res.json({ success: true, data: cart });
});

// ─── Add / Update Cart Item ───────────────────
// POST /api/cart
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (product.stock < quantity) {
    res.status(400);
    throw new Error(`Only ${product.stock} items available in stock`);
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (existingItem) {
    const newQty = existingItem.quantity + quantity;
    if (newQty > product.stock) {
      res.status(400);
      throw new Error(`Cannot add more. Only ${product.stock} items available.`);
    }
    existingItem.quantity = newQty;
  } else {
    cart.items.push({ product: productId, quantity, price: product.price });
  }

  await cart.save();

  const populated = await Cart.findById(cart._id).populate(
    'items.product', 'title images price stock'
  );

  res.json({ success: true, message: 'Cart updated', data: populated });
});

// ─── Update Cart Item Quantity ────────────────
// PUT /api/cart/:productId
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const { productId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  const item = cart.items.find((i) => i.product.toString() === productId);
  if (!item) {
    res.status(404);
    throw new Error('Item not in cart');
  }

  if (quantity <= 0) {
    cart.items = cart.items.filter((i) => i.product.toString() !== productId);
  } else {
    item.quantity = quantity;
  }

  await cart.save();

  const populated = await Cart.findById(cart._id).populate(
    'items.product', 'title images price stock'
  );

  res.json({ success: true, message: 'Cart updated', data: populated });
});

// ─── Remove Cart Item ─────────────────────────
// DELETE /api/cart/:productId
const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== req.params.productId
  );

  await cart.save();
  res.json({ success: true, message: 'Item removed from cart' });
});

// ─── Clear Cart ───────────────────────────────
// DELETE /api/cart
const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  res.json({ success: true, message: 'Cart cleared' });
});

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
