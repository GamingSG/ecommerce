// controllers/productController.js — Product CRUD & Search
const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// ─── Get All Products (with search, filter, sort, paginate) ──
// GET /api/products
const getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  const query = {};

  // Text search
  if (req.query.search) {
    query.$text = { $search: req.query.search };
  }

  // Filter by category
  if (req.query.category && req.query.category !== 'All') {
    query.category = req.query.category;
  }

  // Filter by brand
  if (req.query.brand) {
    query.brand = { $regex: req.query.brand, $options: 'i' };
  }

  // Filter by price range
  if (req.query.minPrice || req.query.maxPrice) {
    query.price = {};
    if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice);
    if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice);
  }

  // Filter featured products
  if (req.query.featured === 'true') {
    query.isFeatured = true;
  }

  // Sorting
  let sortOption = {};
  switch (req.query.sort) {
    case 'price-asc':   sortOption = { price: 1 };      break;
    case 'price-desc':  sortOption = { price: -1 };     break;
    case 'rating':      sortOption = { ratings: -1 };   break;
    case 'newest':      sortOption = { createdAt: -1 }; break;
    case 'oldest':      sortOption = { createdAt: 1 };  break;
    default:            sortOption = { createdAt: -1 };
  }

  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(limit)
    .select('-reviews');

  res.json({
    success: true,
    data: products,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// ─── Get Single Product ───────────────────────
// GET /api/products/:id
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('reviews.user', 'name avatar');

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json({ success: true, data: product });
});

// ─── Create Product (Admin) ───────────────────
// POST /api/products
const createProduct = asyncHandler(async (req, res) => {
  const { title, description, category, brand, price, discountPrice, stock, isFeatured, tags } = req.body;

  // Handle images from body or uploaded files
  let images = [];
  if (req.body.images) {
    images = Array.isArray(req.body.images)
      ? req.body.images.map((url) => ({ url }))
      : [{ url: req.body.images }];
  }
  if (req.files && req.files.length > 0) {
    images = req.files.map((file) => ({ url: `/uploads/${file.filename}` }));
  }

  if (images.length === 0) {
    images = [{ url: 'https://placehold.co/400x400?text=No+Image' }];
  }

  const product = await Product.create({
    title,
    description,
    images,
    category,
    brand,
    price,
    discountPrice: discountPrice || 0,
    stock,
    isFeatured: isFeatured || false,
    tags: tags ? tags.split(',').map((t) => t.trim()) : [],
    seller: req.user._id,
  });

  res.status(201).json({ success: true, message: 'Product created successfully', data: product });
});

// ─── Update Product (Admin) ───────────────────
// PUT /api/products/:id
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const updates = { ...req.body };

  // Handle image update
  if (req.files && req.files.length > 0) {
    updates.images = req.files.map((file) => ({ url: `/uploads/${file.filename}` }));
  }

  if (updates.tags && typeof updates.tags === 'string') {
    updates.tags = updates.tags.split(',').map((t) => t.trim());
  }

  const updated = await Product.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  res.json({ success: true, message: 'Product updated successfully', data: updated });
});

// ─── Delete Product (Admin) ───────────────────
// DELETE /api/products/:id
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  await product.deleteOne();
  res.json({ success: true, message: 'Product deleted successfully' });
});

// ─── Add Review ───────────────────────────────
// POST /api/products/:id/reviews
const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check if already reviewed
  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );
  if (alreadyReviewed) {
    res.status(400);
    throw new Error('You have already reviewed this product');
  }

  product.reviews.push({ user: req.user._id, name: req.user.name, rating: Number(rating), comment });
  product.calculateAverageRating();
  await product.save();

  res.status(201).json({ success: true, message: 'Review added successfully' });
});

// ─── Get Top-Rated Products ───────────────────
// GET /api/products/top
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ ratings: -1 }).limit(8).select('-reviews');
  res.json({ success: true, data: products });
});

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, addReview, getTopProducts };
