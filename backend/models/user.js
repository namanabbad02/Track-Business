// // backend/models/userModel.js
// const { DataTypes } = require('sequelize');
// const sequelize = require('../Config/database');

// // Define the User model
// const User = sequelize.define('User', {
//   UserID: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   Username: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   CompanyName: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   Email: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true,
//     validate: {
//       isEmail: true,
//     },
//   },
//   PasswordHash: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   Role: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     defaultValue: 'user',
//   },
//   OTP: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
//   OTP_Expiry: {
//     type: DataTypes.DATE,
//     allowNull: true,
//   },
// });

// // Sync the model with the database (creates the table if it doesn't exist)
// User.sync()
//   .then(() => console.log('User model synced successfully'))
//   .catch(err => console.log('Error syncing User model:', err));

// module.exports = User;

// backend/models/user.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'user',
  },
  lastSeen: {
    type: DataTypes.DATE,
  },
  adminId: { // Foreign key to reference the Admin model
    type: DataTypes.INTEGER,
    references: {
      model: 'Admins', // Assuming the table name is 'Admins'
      key: 'id',
    },
  },
});

module.exports = User;