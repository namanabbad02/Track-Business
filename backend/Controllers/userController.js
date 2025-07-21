// userController.js
const User = require('../models/userModel');
const bcrypt = require('bcrypt');

// Get User Profile
exports.getUserProfile = async (req, res) => {
  const userId = req.user.userId;  // From the decoded JWT token

  try {
    const user = await User.findOne({
      where: { UserID: userId },
      attributes: ['Username', 'CompanyName', 'Email', 'Role'],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Update User Profile
exports.updateUserProfile = async (req, res) => {
  const userId = req.user.userId;  // From the decoded JWT token
  const { username, companyName, email, password } = req.body;

  try {
    // Check if the email is already taken by another user
    const existingUser = await User.findOne({ where: { Email: email } });
    if (existingUser && existingUser.UserID !== userId) {
      return res.status(400).json({ message: "Email already in use." });
    }

    const updatedFields = { Username: username, CompanyName: companyName, Email: email };

    // If password is provided, hash it before saving
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updatedFields.PasswordHash = hashedPassword;
    }

    // Update the user profile
    const [updated] = await User.update(updatedFields, {
      where: { UserID: userId },
    });

    if (updated) {
      const updatedUser = await User.findOne({ where: { UserID: userId } });
      return res.status(200).json({ message: "Profile updated successfully.", user: updatedUser });
    }

    res.status(400).json({ message: "No changes detected." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Delete User Account
exports.deleteUserAccount = async (req, res) => {
  const userId = req.user.userId;  // From the decoded JWT token

  try {
    // Delete user from the database
    const deleted = await User.destroy({
      where: { UserID: userId },
    });

    if (deleted) {
      return res.status(200).json({ message: "Account deleted successfully." });
    }

    res.status(400).json({ message: "Failed to delete account." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};
