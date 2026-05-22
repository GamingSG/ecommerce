// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, updateUser, deleteUser, toggleWishlist, getUserStats } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/stats', protect, admin, getUserStats);
router.get('/', protect, admin, getAllUsers);
router.get('/:id', protect, admin, getUserById);
router.put('/:id', protect, admin, updateUser);
router.delete('/:id', protect, admin, deleteUser);
router.post('/wishlist/:productId', protect, toggleWishlist);

module.exports = router;
