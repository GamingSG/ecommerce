// controllers/authController.js — Authentication Logic
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { generateToken } = require('../middleware/authMiddleware');

// ─── Register User ────────────────────────────
// POST /api/auth/register
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email, and password');
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User with this email already exists');
  }

  // Create user (password hashed via pre-save hook)
  const user = await User.create({ name, email, password });

  if (user) {
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        token: generateToken(user._id),
      },
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// ─── Login User ───────────────────────────────
// POST /api/auth/login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  // Find user and include password for comparison
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  if (!user.isActive) {
    res.status(401);
    throw new Error('Account has been deactivated. Contact support.');
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      address: user.address,
      token: generateToken(user._id),
    },
  });
});

// ─── Get Current User Profile ─────────────────
// GET /api/auth/profile
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist', 'title images price');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json({ success: true, data: user });
});

// ─── Update User Profile ──────────────────────
// PUT /api/auth/profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.avatar = req.body.avatar || user.avatar;
  if (req.body.address) user.address = { ...user.address.toObject?.() || {}, ...req.body.address };
  if (req.body.password) user.password = req.body.password;

  const updatedUser = await user.save();

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
      address: updatedUser.address,
      token: generateToken(updatedUser._id),
    },
  });
});

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };
