// const express = require('express');
// const { body, validationResult } = require('express-validator');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const mysql = require('mysql2');
// const cors = require('cors');

// const app = express();
// app.use(cors());
// app.use(express.json()); 


// const router = express.Router();
// const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Add this to your .env file

// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'naman@2',
//     database: 'ST',
//     multipleStatements: true,
// }).promise();
// // Sign-Up Route
// router.post('/signup', [
//     body('username').notEmpty().withMessage('Username is required'),
//     body('email').isEmail().withMessage('Valid email is required'),
//     body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
// ], async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { username, email, password } = req.body;
//     try {
//         // Check if email already exists
//         const [user] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
//         if (user.length > 0) {
//             return res.status(400).json({ message: 'Email already in use' });
//         }

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Save user to the database
//         await db.query('INSERT INTO Users (username, email, password) VALUES (?, ?, ?)', 
//             [username, email, hashedPassword]);
//         res.status(201).json({ message: 'User registered successfully' });
//     } catch (error) {
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// // Login Route
// router.post('/login', [
//     body('email').isEmail().withMessage('Valid email is required'),
//     body('password').notEmpty().withMessage('Password is required'),
// ], async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { email, password } = req.body;
//     try {
//         const [user] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
//         if (user.length === 0) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         const isMatch = await bcrypt.compare(password, user[0].password);
//         if (!isMatch) {
//             return res.status(401).json({ message: 'Invalid credentials' });
//         }

//         const token = jwt.sign({ userId: user[0].id }, JWT_SECRET, { expiresIn: '1h' });
//         res.json({ token, username: user[0].username });
//     } catch (error) {
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// // Forgot Password Route (To Be Implemented Later)
// router.post('/forgot-password', async (req, res) => {
//     // Placeholder for password recovery
//     res.status(501).json({ message: 'Feature under construction' });
// });

// module.exports = router;

// backend/routes/authRoutes.js
// backend/routes/authRoutes.js
// backend/routes/authRoutes.js
// const express = require('express');
// const {
//   registerAdmin = null,
//   loginAdmin = null,
//   createUser = null,
//   userRegister = null,
//   sendOTP = null,
//   verifyOTP = null,
//   resetPassword = null,
//   getAdminDashboard = null,
//   getUserDashboard = null,
// } = require('../Controllers/authController');

// const router = express.Router();

// if (registerAdmin) router.post('/register', registerAdmin);
// if (loginAdmin) router.post('/login', loginAdmin);
// if (createUser) router.post('/create-user', createUser);
// if (userRegister) router.post('/user-register', userRegister);
// if (sendOTP) router.post('/send-otp', sendOTP);
// if (verifyOTP) router.post('/verify-otp', verifyOTP);
// if (resetPassword) router.post('/reset-password', resetPassword);
// if (getAdminDashboard) router.get('/dashboard', getAdminDashboard);
// if (getUserDashboard) router.get('/user-dashboard', getUserDashboard);

// module.exports = router;

const express = require('express');
const {
  registerAdmin = null,
  loginAdmin = null,
  createUser = null,
  setPassword = null,
  userRegister = null,
  sendOTP = null,
  verifyOTP = null,
  resetPassword = null,
  getAdminDashboard = null,
  sendRegistrationEmails = null,
  getUserDashboard = null,
  loginUser = null, // Add loginUser controller
  login = null, // Add combined login controller
  deleteAccount = null, // Add delete account controller
  logout = null, // Add logout controller
  logoutUser = null, // Add logout user controller
  deleteAdminAccount = null, // Add delete admin account controller
  getAdminProfile = null, // Add get admin profile controller
  changeAdminPassword = null, // Add change admin password controller
  // updateAdminProfile = null, // Add update admin profile controller
  getUserRole = null, // Add get user role controller
  getCurrentUser = null, // Add get current user controller
} = require('../Controllers/authController');
const authMiddleware = require('../Middleware/authMiddleware');
const router = express.Router();

// Admin Registration
if (registerAdmin) router.post('/register', registerAdmin);

// Admin Login
if (loginAdmin) router.post('/login-admin', loginAdmin);

// User Registration
if (userRegister) router.post('/user-register', userRegister);

// Set Password (Admin action)
if (setPassword) router.post('/set-password', setPassword);

// Create User (Admin action)
if (createUser) router.post('/create-user', createUser);

// Combined Login for Admin and User
if (login) router.post('/login', login);

// Forgot Password: Send OTP
if (sendOTP) router.post('/send-otp', sendOTP);

// Forgot Password: Verify OTP
if (verifyOTP) router.post('/verify-otp', verifyOTP);

// Forgot Password: Reset Password
if (resetPassword) router.post('/reset-password', resetPassword);

// Admin Dashboard
if (getAdminDashboard) router.get('/dashboard', authMiddleware, getAdminDashboard);

// Send Registration Emails
if (sendRegistrationEmails) router.post('/send-registration-emails', sendRegistrationEmails);

// User Dashboard
if (getUserDashboard) router.get('/user-dashboard', authMiddleware, getUserDashboard);

// Logot
if (logout) router.post('/logout', authMiddleware, logout);

//delete account
if (deleteAccount) router.delete('/delete-account/:id', authMiddleware, deleteAccount);

// Logout User
if (logoutUser) router.post('/logout-user/:id', authMiddleware, logoutUser);

// Delete Admin Account
if (deleteAdminAccount) router.delete('/delete-admin-account/:id', authMiddleware, deleteAdminAccount);

// Get Admin Profile
if (getAdminProfile) router.get('/admin-profile', authMiddleware, getAdminProfile);

// Change Admin Password
if (changeAdminPassword) router.put('/change-admin-password', authMiddleware, changeAdminPassword);

// Userrole
if (getUserRole) router.get('/user-role', authMiddleware, getUserRole);

// Get Current User
if (getCurrentUser) router.get('/me', authMiddleware, getCurrentUser);

module.exports = router;