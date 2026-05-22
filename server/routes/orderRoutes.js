// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const {
  createOrder, getMyOrders, getOrderById,
  getAllOrders, updateOrderStatus, getOrderStats,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/stats', protect, admin, getOrderStats);
router.get('/my', protect, getMyOrders);
router.post('/', protect, createOrder);
router.get('/:id', protect, getOrderById);
router.get('/', protect, admin, getAllOrders);
router.put('/:id', protect, admin, updateOrderStatus);

module.exports = router;
