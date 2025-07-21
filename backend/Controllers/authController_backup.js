
// backend/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const User = require('../models/user');
const OTP = require('../models/otp');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const TokenBlacklist = require('../models/TokenBlacklist');
// exports.registerAdmin = async (req, res) => {
//   try {
//     const { fullName, companyName, companyMail, personalMail, password, confirmPassword } = req.body;

//     if (password !== confirmPassword) {
//       return res.status(400).json({ error: 'Passwords do not match' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newAdmin = await Admin.create({
//       fullName,
//       companyName,
//       companyMail,
//       personalMail,
//       password: hashedPassword,
//     });

//     const token = jwt.sign({ id: newAdmin.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

//     res.status(201).json({ token, message: 'Admin registered successfully' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


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

exports.registerAdmin = async (req, res) => {
  try {
    const { fullName, companyName, companyMail, personalMail, password, confirmPassword } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin
    const newAdmin = await Admin.create({
      fullName,
      companyName,
      companyMail,
      personalMail,
      password: hashedPassword,
    });

    // Generate a JWT token
    const token = jwt.sign({ id: newAdmin.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send registration emails
    await sendRegistrationEmails(companyMail, personalMail, companyName);

    // Respond with success message and token
    res.status(201).json({ token, message: 'Admin registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { companyMail, password } = req.body;

    const admin = await Admin.findOne({ where: { companyMail } });

    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, message: 'Admin logged in successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.loginUser = async (req, res) => {
  try {
    const { userMail, password } = req.body;

    const user = await User.findOne({ where: { email: userMail } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Update last seen
    user.lastSeen = new Date();
    await user.save();

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, message: 'User logged in successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// exports.login = async (req, res) => {
//   try {
//     const { email, password, role } = req.body;

//     let user;
//     let userRole; // Get role from the database

//     if (role === 'admin') {
//       user = await Admin.findOne({ where: { companyMail: email } });
//       userRole = 'admin'; // Ensure correct role assignment
//     } else if (role === 'user') {
//       user = await User.findOne({ where: { email } });
//       userRole = 'user'; // Ensure correct role assignment
//     } else {
//       return res.status(400).json({ error: 'Invalid role' });
//     }

//     if (!user) {
//       return res.status(404).json({ error: `${role === 'admin' ? 'Admin' : 'User'} not found` });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(400).json({ error: 'Invalid credentials' });
//     }

//     // Update last seen
//     user.lastSeen = new Date();
//     await user.save();

//     // Use role from the database, NOT from req.body
//     const token = jwt.sign({ id: user.id, role: userRole }, process.env.JWT_SECRET, { expiresIn: '1h' });

//     res.json({ token, role: userRole, message: `${userRole === 'admin' ? 'Admin' : 'User'} logged in successfully` });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    let user;
    let userRole;
    let adminId = null;

    if (role === 'admin') {
      user = await Admin.findOne({ where: { companyMail: email } });
      userRole = 'admin';
    } else if (role === 'user') {
      user = await User.findOne({ where: { email } });
      userRole = 'user';
      adminId = user ? user.adminId : null; // Fetch associated adminId
    } else {
      return res.status(400).json({ error: 'Invalid role' });
    }

    if (!user) {
      return res.status(404).json({ error: `${role === 'admin' ? 'Admin' : 'User'} not found` });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Update last seen
    user.lastSeen = new Date();
    await user.save();

    const token = jwt.sign(
      { id: user.id, role: userRole, adminId: adminId }, // Include adminId in token
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, role: userRole, userId: user.id, adminId, message: `${userRole === 'admin' ? 'Admin' : 'User'} logged in successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




// backend/controllers/authController.js
// exports.createUser = async (req, res) => {
//   try {
//     const { userName, mailId, adminPassword } = req.body;

//     const admin = await Admin.findByPk(req.admin.id);

//     if (!admin) {
//       return res.status(404).json({ error: 'Admin not found' });
//     }

//     const isMatch = await bcrypt.compare(adminPassword, admin.password);

//     if (!isMatch) {
//       return res.status(400).json({ error: 'Invalid admin password' });
//     }

//     const newUser = await User.create({
//       firstName: userName,
//       email: mailId,
//       role: 'user',
//     });

//     // Send email to user with account details and password reset link
//     // This part will be implemented later

//     res.status(201).json({ message: 'User created successfully' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.createUser = async (req, res) => {
//   try {
//     console.log('Received createUser request:', req.body);

//     const { userName, userMail, adminPassword } = req.body; // Ensure adminPassword is included

//     const admin = await Admin.findByPk(req.admin.id);

//     if (!admin) {
//       return res.status(404).json({ error: 'Admin not found' });
//     }

//     const isMatch = await bcrypt.compare(adminPassword, admin.password);

//     if (!isMatch) {
//       return res.status(400).json({ error: 'Invalid admin password' });
//     }

//     // Generate a unique token for the new user
//     const token = jwt.sign({ email: userMail }, process.env.JWT_SECRET, { expiresIn: '1h' });

//     // Save user to database with a temporary password and token
//     const newUser = await User.create({
//       firstName: userName,
//       email: userMail,
//       password: bcrypt.hashSync('temporary', 10), // Temporary password
//       role: 'user',
//       verificationToken: token,
//     });

//     // Create a transporter object using the default SMTP transport
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     // Email options
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: userMail,
//       subject: 'Welcome to the Platform',
//       text: `Hello ${userName}, you have been registered. Please click the link below to set your password: http://localhost:3000/set-password/${token}`,
//       html: `<p>Hello ${userName}, you have been registered. Please click the link below to set your password: <a href="http://localhost:3000/set-password/${token}">Set Password</a></p>`,
//     };

//     // Send email
//     await transporter.sendMail(mailOptions);

//     res.status(201).json({ message: 'User created successfully' });
//   } catch (error) {
//     console.error('Error in createUser:', error);
//     res.status(500).json({ error: error.message });
//   }
// };

exports.createUser = async (req, res) => {
  try {
    console.log('Received createUser request:', req.body);

    const { userName, userMail, adminId } = req.body; // Get adminId from request body

    // Generate a unique token for the new user
    const token = jwt.sign({ email: userMail }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Save user to database with a temporary password and token
    const newUser = await User.create({
      firstName: userName,
      email: userMail,
      password: bcrypt.hashSync('temporary', 10), // Temporary password
      role: 'user',
      verificationToken: token,
      adminId: adminId, // Associate the user with the admin
    });

    // Create a transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userMail,
      subject: 'Welcome to the Platform',
      text: `Hello ${userName}, you have been registered. Please click the link below to set your password: http://localhost:3000/set-password/${token}`,
      html: `<p>Hello ${userName}, you have been registered. Please click the link below to set your password: <a href="http://localhost:3000/set-password/${token}">Set Password</a></p>`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error in createUser:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.setPassword = async (req, res) => {
  try {
    console.log('Received setPassword request:', req.body); // Debugging log

    const { token, password, firstName, lastName, phone } = req.body;

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ where: { email: decoded.email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user details
    user.password = hashedPassword;
    user.firstName = firstName;
    user.lastName = lastName;
    user.phone = phone;
    user.verificationToken = null; // Clear the token
    await user.save();

    res.status(200).json({ message: 'Password set successfully' });
  } catch (error) {
    console.error('Error in setPassword:', error);
    res.status(500).json({ error: error.message });
  }
};


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    const admin = await Admin.findOne({ where: { companyMail: email } });

    if (!user && !admin) {
      return res.status(404).json({ error: 'No Account found for this Mail ID' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 2);

    await OTP.create({
      email,
      otp: otp.toString(),
      expiresAt,
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP for Password Reset',
      text: `Your OTP is ${otp}. This OTP will expire in 2 minutes.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send OTP', details: error.message });
      } else {
        console.log('Email sent: ' + info.response);
        res.json({ message: 'OTP sent successfully' });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const otpRecord = await OTP.findOne({ where: { email } });

    if (!otpRecord || otpRecord.otp !== otp || new Date() > otpRecord.expiresAt) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const otpRecord = await OTP.findOne({ where: { email } });

    if (!otpRecord || new Date() > otpRecord.expiresAt) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    const user = await User.findOne({ where: { email } });
    const admin = await Admin.findOne({ where: { companyMail: email } });

    if (!user && !admin) {
      return res.status(404).json({ error: 'User or Admin not found' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    if (user) {
      await user.update({ password: hashedPassword });
    } else if (admin) {
      await admin.update({ password: hashedPassword });
    }

    await OTP.destroy({ where: { email } });

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// backend/controllers/authController.js
// exports.getAdminDashboard = async (req, res) => {
//   try {
//     const admin = await Admin.findByPk(req.admin.id);

//     if (!admin) {
//       return res.status(404).json({ error: 'Admin not found' });
//     }

//     const users = await User.findAll();

//     res.json({ admin, users });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

exports.getAdminDashboard = async (req, res) => {
  try {
    // Check if the request is from an admin
    if (!req.admin) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Fetch admin details using the admin ID from the request
    const admin = await Admin.findByPk(req.admin.id);
    const adminId = req.admin.id;

    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    // Fetch all users
    const users = await User.findAll({
      where: { adminId: adminId }, // Filter users by adminId
    });

    // Return admin details and user list
    res.json({ admin, users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// backend/controllers/authController.js
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
    const token = req.headers.authorization.split(' ')[1];
    await TokenBlacklist.create({ token });

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error in logout:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const { id } = req.params; // Assuming the user/admin ID is passed in the URL
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role === 'admin') {
      // Admin can delete any user account
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      await user.destroy();
      res.status(200).json({ message: 'User account deleted successfully' });
    } else if (decoded.role === 'user' && decoded.id.toString() === id) {
      // User can only delete their own account
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      await user.destroy();
      res.status(200).json({ message: 'Your account has been deleted' });
    } else {
      return res.status(403).json({ error: 'Unauthorized' });
    }
  } catch (error) {
    console.error('Error in deleteAccount:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.logoutUser = async (req, res) => {
  try {
    const { userId } = req.params; // Assuming the user ID is passed in the URL
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Fetch the user's token (assuming you store tokens in the database)
    const userToken = await User.findByPk(userId);
    if (!userToken) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Blacklist the user's token
    await TokenBlacklist.create({ token: userToken.token });

    res.status(200).json({ message: 'User logged out successfully' });
  } catch (error) {
    console.error('Error in logoutUser:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteAdminAccount = async (req, res) => {
  try {
    const { id } = req.params; // Assuming the admin ID is passed in the URL
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'admin' || decoded.id.toString() !== id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Find the admin
    const admin = await Admin.findByPk(id);
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    // Delete all users associated with this admin
    await User.destroy({ where: { adminId: admin.id } });

    // Delete the admin
    await admin.destroy();

    res.status(200).json({ message: 'Admin account and all associated users deleted successfully' });
  } catch (error) {
    console.error('Error in deleteAdminAccount:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAdminProfile = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const admin = await Admin.findByPk(adminId);

    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    res.status(200).json({ admin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// exports.updateAdminProfile = async (req, res) => {
//   try {
//     const { fullName, companyName, companyMail, personalMail } = req.body;
//     const adminId = req.admin.id;

//     // Find the admin by ID
//     const admin = await Admin.findByPk(adminId);
//     if (!admin) {
//       return res.status(404).json({ error: 'Admin not found' });
//     }

//     // Update the admin profile
//     await admin.update({
//       fullName,
//       companyName,
//       companyMail,
//       personalMail
//     });

//     // Fetch the updated admin data
//     const updatedAdmin = await Admin.findByPk(adminId);

//     res.status(200).json({ message: 'Profile updated successfully', admin: updatedAdmin });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

exports.changeAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const adminId = req.admin.id;

    const admin = await Admin.findByPk(adminId);

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

// router.get('/user-role', authMiddleware, async (req, res) => {
//   try {
//     let user;
    
//     if (req.admin) {
//       user = await User.findOne({ where: { id: req.admin.id } });
//     } else if (req.user) {
//       user = await User.findOne({ where: { id: req.user.id } });
//     } else {
//       return res.status(401).json({ error: 'Unauthorized' });
//     }
    
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     res.json({ role: user.role });
//   } catch (error) {
//     console.error('Error fetching user role:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

exports.getUserRole = async (req, res) => {
  try {
    let user;
    let roleType = 'user'; // Default to 'user'

    if (req.admin) {
      user = await User.findOne({ where: { id: req.admin.id } });
      roleType = 'admin'; // If req.admin exists, assign 'admin'
    } else if (req.user) {
      user = await User.findOne({ where: { id: req.user.id } });
    } else {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ role: user.role, userType: roleType });
  } catch (error) {
    console.error('Error fetching user role:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
