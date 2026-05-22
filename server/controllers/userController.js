// controllers/userController.js — Admin User Management
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// GET /api/users — Admin: get all users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json({ success: true, data: users });
});

// GET /api/users/:id — Admin: get single user
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) { res.status(404); throw new Error('User not found'); }
  res.json({ success: true, data: user });
});

// PUT /api/users/:id — Admin: update user role / status
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) { res.status(404); throw new Error('User not found'); }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.role = req.body.role || user.role;
  if (typeof req.body.isActive !== 'undefined') user.isActive = req.body.isActive;

  const updated = await user.save();
  res.json({ success: true, message: 'User updated', data: { ...updated.toObject(), password: undefined } });
});

// DELETE /api/users/:id — Admin: delete user
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) { res.status(404); throw new Error('User not found'); }
  if (user.role === 'admin') { res.status(400); throw new Error('Cannot delete admin user'); }
  await user.deleteOne();
  res.json({ success: true, message: 'User deleted' });
});

// POST /api/users/wishlist/:productId — Toggle wishlist
const toggleWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const productId = req.params.productId;
  const idx = user.wishlist.indexOf(productId);

  if (idx > -1) {
    user.wishlist.splice(idx, 1);
  } else {
    user.wishlist.push(productId);
  }

  await user.save();
  res.json({ success: true, message: idx > -1 ? 'Removed from wishlist' : 'Added to wishlist', wishlist: user.wishlist });
});

// GET /api/users/stats — Admin dashboard user stats
const getUserStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments({ role: 'user' });
  const newUsersThisMonth = await User.countDocuments({
    role: 'user',
    createdAt: { $gte: new Date(new Date().setDate(1)) },
  });
  res.json({ success: true, data: { totalUsers, newUsersThisMonth } });
});

module.exports = { getAllUsers, getUserById, updateUser, deleteUser, toggleWishlist, getUserStats };
