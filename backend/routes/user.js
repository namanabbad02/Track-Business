// userRoutes.js
const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, deleteUserAccount } = require('../Controllers/userController');
const { verifyToken } = require('../Controllers/authController');

// Middleware to verify JWT token
router.use(verifyToken);  // Protect all user routes by verifying the token

// Get User Profile
router.get('/profile', getUserProfile);

// Update User Profile
router.put('/profile', updateUserProfile);

// Delete User Account
router.delete('/profile', deleteUserAccount);

module.exports = router;
