// routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect, admin } = require('../middleware/authMiddleware');
const path = require('path');

// POST /api/upload — single image upload
router.post('/', protect, admin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  res.json({
    success: true,
    message: 'File uploaded successfully',
    url: `/uploads/${req.file.filename}`,
    filename: req.file.filename,
  });
});

// POST /api/upload/multiple — multiple image upload
router.post('/multiple', protect, admin, upload.array('images', 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'No files uploaded' });
  }
  const urls = req.files.map((file) => `/uploads/${file.filename}`);
  res.json({ success: true, message: 'Files uploaded', urls });
});

module.exports = router;
