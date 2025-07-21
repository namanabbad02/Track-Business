// models/Blacklist.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TokenBlacklist = sequelize.define('TokenBlacklist', {
  token: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

module.exports = TokenBlacklist;