// utils/seeder.js — Seed DB with admin user & sample products
// Run: node utils/seeder.js
require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';

const sampleProducts = [
  { title: 'Premium Wireless Headphones', description: 'High-fidelity audio with active noise cancellation, 30-hour battery life, and premium comfort for extended listening sessions.', category: 'Electronics', brand: 'SoundMax', price: 4999, stock: 50, isFeatured: true, tags: ['audio', 'wireless', 'headphones'], images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400' }] },
  { title: 'Smart Running Shoes', description: 'Lightweight and breathable running shoes with smart cushioning technology for maximum comfort on any terrain.', category: 'Sports', brand: 'RunPro', price: 3499, stock: 30, isFeatured: true, tags: ['shoes', 'running', 'sports'], images: [{ url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' }] },
  { title: 'Minimalist Leather Watch', description: 'Elegant timepiece with genuine leather strap, Japanese quartz movement, and scratch-resistant sapphire glass.', category: 'Jewelry', brand: 'TimeCraft', price: 8999, stock: 20, isFeatured: true, tags: ['watch', 'leather', 'luxury'], images: [{ url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400' }] },
  { title: 'Ergonomic Office Chair', description: 'Full lumbar support, adjustable armrests, breathable mesh back, and tilt mechanism for all-day comfort.', category: 'Home & Garden', brand: 'ErgoSeat', price: 12999, stock: 15, isFeatured: false, tags: ['chair', 'office', 'ergonomic'], images: [{ url: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400' }] },
  { title: 'Vitamin C Face Serum', description: 'Brightening vitamin C serum with hyaluronic acid and niacinamide for glowing, even-toned skin.', category: 'Beauty', brand: 'GlowLab', price: 999, stock: 100, isFeatured: true, tags: ['skincare', 'serum', 'vitamin-c'], images: [{ url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400' }] },
  { title: 'Mechanical Keyboard', description: 'Tactile RGB mechanical keyboard with Cherry MX switches, full N-key rollover, and aircraft-grade aluminum frame.', category: 'Electronics', brand: 'KeyMaster', price: 6499, stock: 25, isFeatured: false, tags: ['keyboard', 'mechanical', 'gaming'], images: [{ url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400' }] },
  { title: 'Yoga Mat Pro', description: 'Eco-friendly non-slip yoga mat, 6mm thick with alignment lines, carrying strap, and moisture-wicking surface.', category: 'Sports', brand: 'ZenFit', price: 1499, stock: 60, isFeatured: false, tags: ['yoga', 'fitness', 'mat'], images: [{ url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400' }] },
  { title: 'Stainless Steel Water Bottle', description: 'Double-wall vacuum insulated bottle keeps drinks cold 24hrs / hot 12hrs. BPA-free, leak-proof, 750ml.', category: 'Sports', brand: 'HydroLife', price: 799, stock: 80, isFeatured: false, tags: ['bottle', 'water', 'insulated'], images: [{ url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400' }] },
];

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@store.com',
      password: 'admin123',
      role: 'admin',
    });

    // Create regular user
    await User.create({
      name: 'Test User',
      email: 'user@store.com',
      password: 'user123',
      role: 'user',
    });

    // Create products
    const products = sampleProducts.map((p) => ({ ...p, seller: adminUser._id }));
    await Product.insertMany(products);

    console.log('✅ Seeded successfully!');
    console.log('👤 Admin: admin@store.com / admin123');
    console.log('👤 User:  user@store.com / user123');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
};

seed();
