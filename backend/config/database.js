// // backend/config/database.js
// const { Sequelize } = require('sequelize');

// // Set up a new Sequelize instance for connecting to MySQL
// const sequelize = new Sequelize(
//   process.env.DB_NAME,    // Database name
//   process.env.DB_USER,    // Database username
//   process.env.DB_PASSWORD, // Database password
//   {
//     host: process.env.DB_HOST || 'localhost',
//     dialect: 'mysql',
//   }
// );

// // Test the connection
// sequelize.authenticate()
//   .then(() => {
//     console.log('Database connected successfully');
//   })
//   .catch(err => {
//     console.error('Error connecting to database:', err);
//   });

// module.exports = sequelize;

// backend/config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
});

module.exports = sequelize;