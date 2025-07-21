// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const Admin = require('../models/admin');
// const authMiddleware = require('../Middleware/authMiddleware'); // Adjust the import path as necessary

// const router = express.Router();

// const upload = require('../Middleware/multerConfig'); // Import Multer config

// // Get admin profile
// router.get('/profile', authMiddleware, async (req, res) => {
//   try {
//     const adminId = req.admin.id;
//     const admin = await Admin.findByPk(adminId);

//     if (!admin) {
//       return res.status(404).json({ error: 'Admin not found' });
//     }

//     res.status(200).json({ admin });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Update admin profile

// router.put('/profile-picture', authMiddleware, upload.single('profilePicture'), async (req, res) => {
//     try {
//       console.log('Received file:', req.file); // Debugging
//       console.log('Received body:', req.body); // Debugging
  
//       const { fullName, companyName, companyMail, personalMail, bio } = req.body;
//       const adminId = req.admin.id;
  
//       const admin = await Admin.findByPk(adminId);
//       if (!admin) {
//         return res.status(404).json({ error: 'Admin not found' });
//       }
  
//       let profilePictureUrl = admin.profilePicture;
//       if (req.file) {
//         profilePictureUrl = `/uploads/${req.file.filename}`;
//       } else {
//         console.log('No file received in request');
//       }
  
//       await admin.update({
//         fullName,
//         companyName,
//         companyMail,
//         personalMail,
//         bio,
//         profilePicture: profilePictureUrl, // Ensure it's updated
//       });
  
//       res.status(200).json({ message: 'Profile updated successfully', admin });
//     } catch (error) {
//       console.error('Error updating profile:', error);
//       res.status(500).json({ error: error.message });
//     }
//   });
// module.exports = router;

// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const Admin = require('../models/admin');
// const User = require('../models/user'); // Assuming you have a User model
// const authMiddleware = require('../Middleware/authMiddleware'); // Adjust the import path as necessary

// const router = express.Router();

// const upload = require('../Middleware/multerConfig'); // Import Multer config
// // Get Profile (Admin or User)
// router.get('/profile', authMiddleware, async (req, res) => {
//   try {
//     let profile;
//     let role;

//     if (req.admin) {
//       profile = await Admin.findByPk(req.admin.id);
//       role = 'admin';
//     } else if (req.user) {
//       profile = await User.findByPk(req.user.id);
//       role = 'user';
//     } else {
//       return res.status(401).json({ error: 'Unauthorized' });
//     }

//     if (!profile) {
//       return res.status(404).json({ error: `${role} not found` });
//     }

//     res.status(200).json({ profile, role });
//   } catch (error) {
//     console.error('Error fetching profile:', error);
//     res.status(500).json({ error: error.message });
//   }
// });

// // Update Profile & Profile Picture (Admin or User)
// router.put('/profile-picture', authMiddleware, upload.single('profilePicture'), async (req, res) => {
//   try {
//     console.log('Received file:', req.file); // Debugging
//     console.log('Received body:', req.body); // Debugging

//     let profile;
//     let updateFields = {};
//     let role;

//     if (req.admin) {
//       profile = await Admin.findByPk(req.admin.id);
//       role = 'admin';
//     } else if (req.user) {
//       profile = await User.findByPk(req.user.id);
//       role = 'user';
//     } else {
//       return res.status(401).json({ error: 'Unauthorized' });
//     }

//     if (!profile) {
//       return res.status(404).json({ error: `${role} not found` });
//     }

//     if (role === 'admin') {
//       const { fullName, companyName, companyMail, personalMail, bio } = req.body;
//       updateFields = { fullName, companyName, companyMail, personalMail, bio };
//     } else {
//       const { firstName, lastName, email, phone, bio } = req.body;
//       updateFields = { firstName, lastName, email, phone, bio };
//     }

//     // Ensure the role isn't updated manually
//     delete updateFields.role;

//     // Handle Profile Picture Upload
//     let profilePictureUrl = profile.profilePicture;
//     if (req.file) {
//       profilePictureUrl = `/uploads/${req.file.filename}`;
//     }

//     updateFields.profilePicture = profilePictureUrl;

//     // Update the profile
//     await profile.update(updateFields);

//     res.status(200).json({ message: 'Profile updated successfully', profile });
//   } catch (error) {
//     console.error('Error updating profile:', error);
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;


const express = require('express');
const multer = require('multer');
const path = require('path');
const Admin = require('../models/admin');
const User = require('../models/user'); // Assuming you have a User model
const authMiddleware = require('../Middleware/authMiddleware'); // Adjust the import path as necessary

const router = express.Router();

const upload = require('../Middleware/multerConfig'); // Import Multer config
// Get Profile (Admin or User)
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    let profile = null;
    let role = null;

    if (req.admin) {
      profile = await Admin.findOne({ where: { id: req.admin.id } });
      role = 'admin';
    } else if (req.user) {
      profile = await User.findOne({ where: { id: req.user.id } });
      role = 'user';
    } else {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!profile) {
      return res.status(404).json({ error: `${role} not found` });
    }

    res.status(200).json({ profile: { ...profile.toJSON(), role } }); // Ensure role is sent correctly
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: error.message });
  }
});


// Update Profile & Profile Picture (Admin or User)
const { body, validationResult } = require('express-validator');

router.put(
  '/profile-picture',
  authMiddleware,
  upload.single('profilePicture'),
  [
    body('fullName').optional().isString(),
    body('companyName').optional().isString(),
    body('companyMail').optional().isEmail(),
    body('personalMail').optional().isEmail(),
    body('bio').optional().isString(),
    body('firstName').optional().isString(),
    body('lastName').optional().isString(),
    body('email').optional().isEmail(),
    body('phone').optional().isString(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      let profile;
      let updateFields = {};
      let role;

      if (req.admin) {
        profile = await Admin.findByPk(req.admin.id);
        role = 'admin';
      } else if (req.user) {
        profile = await User.findByPk(req.user.id);
        role = 'user';
      } else {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (!profile) {
        return res.status(404).json({ error: `${role} not found` });
      }

      if (role === 'admin') {
        const { fullName, companyName, companyMail, personalMail, bio } = req.body;
        updateFields = { fullName, companyName, companyMail, personalMail, bio };
      } else {
        const { firstName, lastName, email, phone, bio } = req.body;
        updateFields = { firstName, lastName, email, phone, bio };
      }

      // Ensure the role isn't updated manually
      delete updateFields.role;

      // Handle Profile Picture Upload
      let profilePictureUrl = profile.profilePicture;
      if (req.file) {
        profilePictureUrl = `/uploads/${req.file.filename}`;
      }

      updateFields.profilePicture = profilePictureUrl;

      // Update the profile
      await profile.update(updateFields);

      res.status(200).json({ message: 'Profile updated successfully', profile });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
