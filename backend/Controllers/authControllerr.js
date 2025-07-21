const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const User = require('../models/user');
const OTP = require('../models/otp');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const TokenBlacklist = require('../models/TokenBlacklist');


const sendRegistrationEmails = async (companyMail, personalMail, companyName) => {
    try {
        // Email to company
        const companyEmail = {
            to: companyMail,
            from: process.env.EMAIL_USER,
            subject: 'Thank You for Registering',
            text: `Thank you for registering your company, ${companyName}, on Track Business.`,
            html: `<strong>Thank you for registering your company, ${companyName}, on Track Business.</strong>`,
        };

        // Email to admin
        const adminEmail = {
            to: personalMail,
            from: process.env.EMAIL_USER,
            subject: 'Company Registration Notification',
            text: `You have registered the company ${companyName} on Track Business.`,
            html: `<strong>You have registered the company ${companyName} on Track Business.</strong>`,
        };

        await transporter.sendMail(companyEmail);
        await transporter.sendMail(adminEmail);
    } catch (error) {
        console.error('Error sending emails:', error);
        throw error;
    }
};

// Register Admin
exports.registerAdmin = async (req, res) => {
    try {
        const { fullName, companyName, companyMail, personalMail, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords do not match" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = await Admin.create({
            fullName,
            companyName,
            companyMail,
            personalMail,
            password: hashedPassword,
        });

        // Send registration emails
        await sendRegistrationEmails(companyMail, personalMail, companyName);

        res.status(201).json({ message: "Admin registered successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login Admin
exports.loginAdmin = async (req, res) => {
    try {
        const { companyMail, password } = req.body;

        const admin = await Admin.findOne({ where: { companyMail } });

        if (!admin) {
            return res.status(404).json({ error: "Admin not found" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Generate JWT Token
        const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Set HTTP-only cookie
        res.cookie("authToken", token, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
            maxAge: 3600000, // 1 hour
        });

        res.json({ message: "Admin logged in successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login User
exports.loginUser = async (req, res) => {
    try {
        const { userMail, password } = req.body;

        const user = await User.findOne({ where: { email: userMail } });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        user.lastSeen = new Date();
        await user.save();

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Set HTTP-only cookie
        res.cookie("authToken", token, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
            maxAge: 3600000, // 1 hour
        });

        res.json({ message: "User logged in successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// General Login (Admin/User)
exports.login = async (req, res) => {
    try {
        console.log("Login attempt received:", req.body);

        const { email, password, role } = req.body;

        let user;
        let userRole;
        let adminId = null;

        if (role === "admin") {
            user = await Admin.findOne({ where: { companyMail: email } });
            userRole = "admin";
        } else if (role === "user") {
            user = await User.findOne({ where: { email } });
            userRole = "user";
            adminId = user ? user.adminId : null;
        } else {
            console.log("Invalid role:", role);
            return res.status(400).json({ error: "Invalid role" });
        }

        if (!user) {
            console.log(`${role} not found`);
            return res.status(404).json({ error: `${role === "admin" ? "Admin" : "User"} not found` });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Invalid password attempt");
            return res.status(400).json({ error: "Invalid credentials" });
        }

        user.lastSeen = new Date();
        await user.save();

        const token = jwt.sign({ id: user.id, role: userRole, adminId }, process.env.JWT_SECRET, { expiresIn: "1h" });

        console.log("Token generated:", token);

        // Set HTTP-only cookie (Ensure key is "token" to match authMiddleware.js)
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Only secure in production
            sameSite: "Lax", // Allows API requests from same-origin frontend
            maxAge: 3600000, // 1 hour
        });

        console.log("Cookie set successfully:", req.cookies.token);

        console.log(`${userRole} logged in successfully`);

        res.json({
            role: userRole,
            userId: user.id,
            adminId,
            message: `${userRole === "admin" ? "Admin" : "User"} logged in successfully`,
        });
    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).json({ error: error.message });
    }
};


// Logout (Clears Cookie)
exports.logoutUser = async (req, res) => {
    try {
        res.clearCookie("authToken", {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
        });

        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getCurrentUser = async (req, res) => {
    try {
        const token = req.cookies.token; // Extract token from cookie
        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }

        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ error: "Forbidden: Invalid token" });
            }

            const { id, role, adminId } = decoded;
            res.json({ id, role, adminId });
        });
    } catch (error) {
        console.error("Auth check error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

exports.createUser = async (req, res) => {
    try {
        console.log('Received createUser request:', req.body);

        const { userName, userMail, adminId } = req.body;
        const token = jwt.sign({ email: userMail }, process.env.JWT_SECRET, { expiresIn: '1h' });

        await User.create({
            firstName: userName,
            email: userMail,
            password: bcrypt.hashSync('temporary', 10),
            role: 'user',
            verificationToken: token,
            adminId: adminId,
        });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userMail,
            subject: 'Welcome to the Platform',
            html: `<p>Hello ${userName}, click <a href="http://localhost:3000/set-password/${token}">here</a> to set your password.</p>`
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error in createUser:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.setPassword = async (req, res) => {
    try {
        const { token, password, firstName, lastName, phone } = req.body;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ where: { email: decoded.email } });

        if (!user) return res.status(404).json({ error: 'User not found' });

        user.password = await bcrypt.hash(password, 10);
        user.firstName = firstName;
        user.lastName = lastName;
        user.phone = phone;
        user.verificationToken = null;
        await user.save();

        const authToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('authToken', authToken, { httpOnly: true, secure: true, sameSite: 'Strict', maxAge: 3600000 });

        res.status(200).json({ message: 'Password set successfully' });
    } catch (error) {
        console.error('Error in setPassword:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.logout = async (req, res) => {
    res.clearCookie('authToken', { httpOnly: true, secure: true, sameSite: 'Strict' });
    res.status(200).json({ message: 'Logged out successfully' });
};

exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });
        const admin = await Admin.findOne({ where: { companyMail: email } });

        if (!user && !admin) return res.status(404).json({ error: 'No account found for this email' });

        const otp = Math.floor(100000 + Math.random() * 900000);
        const expiresAt = new Date(Date.now() + 2 * 60000);

        await OTP.create({ email, otp: otp.toString(), expiresAt });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        });

        await transporter.sendMail({ from: process.env.EMAIL_USER, to: email, subject: 'Your OTP', text: `Your OTP is ${otp}` });
        res.json({ message: 'OTP sent successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const otpRecord = await OTP.findOne({ where: { email } });

        if (!otpRecord || otpRecord.otp !== otp || new Date() > otpRecord.expiresAt)
            return res.status(400).json({ error: 'Invalid or expired OTP' });

        res.json({ message: 'OTP verified successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const otpRecord = await OTP.findOne({ where: { email } });

        if (!otpRecord || new Date() > otpRecord.expiresAt)
            return res.status(400).json({ error: 'Invalid or expired OTP' });

        const user = await User.findOne({ where: { email } }) || await Admin.findOne({ where: { companyMail: email } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        await OTP.destroy({ where: { email } });

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getAdminDashboard = async (req, res) => {
    try {
        if (!req.admin) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const admin = await Admin.findByPk(req.admin.id);
        const adminId = req.admin.id;

        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        const users = await User.findAll({ where: { adminId } });
        res.json({ admin, users });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUserDashboard = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.logout = async (req, res) => {
    try {
        res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'strict' });
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        const { id } = req.params;
        if (req.user.id.toString() !== id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        await user.destroy();
        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteAdminAccount = async (req, res) => {
    try {
        const { id } = req.params;
        if (req.admin.id.toString() !== id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        const admin = await Admin.findByPk(id);
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }
        await User.destroy({ where: { adminId: admin.id } });
        await admin.destroy();
        res.status(200).json({ message: 'Admin account deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAdminProfile = async (req, res) => {
    try {
        const admin = await Admin.findByPk(req.admin.id);
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }
        res.status(200).json({ admin });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.changeAdminPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;
        const admin = await Admin.findByPk(req.admin.id);
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }
        const isPasswordValid = await bcrypt.compare(currentPassword, admin.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ error: 'New passwords do not match' });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await admin.update({ password: hashedPassword });
        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUserRole = async (req, res) => {
    try {
        const roleType = req.admin ? 'admin' : 'user';
        const user = await (req.admin ? Admin.findByPk(req.admin.id) : User.findByPk(req.user.id));
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ role: user.role, userType: roleType });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
