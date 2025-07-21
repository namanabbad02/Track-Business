const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const cookieParser = require("cookie-parser"); //modifies

const app = express();
// app.use(cors());


app.use(cors({
  // origin: "http://localhost:3000",  // React frontend
  origin: ['http://localhost:3000', 'http://192.168.0.80:3000'],
  credentials: true,  // Allow cookies
}));


app.use(cookieParser()); // Required for reading cookies
app.use(express.json());  // This is to parse JSON data sent in POST requests

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'n0a2m0a6n2j0a0i4n'; // Replace with a secure key stored in your environment variables
const profileRoutes = require('./routes/profileRoutes');


const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const User = require('./models/user');
const Admin = require('./models/admin');
const OTP = require('./models/otp');
const authRoutes = require('./routes/authRoutes');



app.use(express.json());

app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
// sequelize.sync({ force: true }).then(() => {
//   console.log('Database & tables created!');
// });
const path = require('path');

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


sequelize.sync().then(() => {
  console.log('Database & tables created!');
});

// const nodemailer = require('nodemailer');
// require('dotenv').config();




// const authRoutes = require('./routes/auth'); // Adjust the path if needed
// app.use('/auth', authRoutes); // Make sure this line exists and is correctly placed

//-------------------------------------------------------------
// const dotenv = require('dotenv');
// const userRoutes = require('./routes/user');
// const authRoutes = require('./routes/auth');

// dotenv.config(); // Load environment variables from .env


// // Middleware
// app.use(cors());
// app.use(express.json()); // Parse incoming JSON requests

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/user', userRoutes); // Add the user routes here

// // Port
// const PORT = process.env.PORT || 5000;
//-----------------------------------------------

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'naman@2',
    database: 'ST',
    multipleStatements: true,
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database.');
});

// Helper function to execute SQL queries
const queryDatabase = (sql, params) => {
  return new Promise((resolve, reject) => {
      db.query(sql, params, (err, results) => {
          if (err) reject(err);
          resolve(results);
      });
  });
};



// Get Data by LotNumber
// app.get('/api/data/:LotNumber', (req, res) => {
//     const LotNumber = req.params.LotNumber;

//     const purchaserQuery = `SELECT PurchaserName, NumberOfBales, Quantity, Rate, Amount, GST_Percent, GST, Category, LotNumber, Hamali, Payment, ShopExpenses, Cartage, PaymentDate 
//                             FROM Purchaser
//                             WHERE LotNumber = ?`;
//     const sellerQuery = `SELECT SellerName, NumberOfBales, Quantity, Rate, Amount, GST_Percent, GST, Category, LotNumber, Hamali, Payment, ShopExpenses, LorryFright, PaymentReceived 
//                                FROM Seller WHERE LotNumber = ?`;


//     db.query(purchaserQuery, [LotNumber], (purchaserError, purchaserResults) => {
//         if (purchaserError) return res.status(500).json({ error: purchaserError.message });

//         db.query(sellerQuery, [LotNumber], (sellerError, sellerResults) => {
//             if (sellerError) return res.status(500).json({ error: sellerError.message });

//             if (purchaserResults.length === 0 && sellerResults.length === 0) {
//                 return res.status(404).json({ error: "No data found for this Lot Number" });
//             }
//             res.json({
//                 purchaser: purchaserResults,
//                 seller: sellerResults
//             });
//         });
//     });
// });

//endpoint: Fetches all the Lot Numbers from the Lots table.

app.get('/api/lots', (req, res) => {
    const query = 'SELECT LotNumber FROM Lots'; // Query to get Lot Numbers from the Lots table
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching Lot Numbers:', err);
            return res.status(500).json({ error: 'Database error while fetching Lot Numbers.' });
        }
        // Send only the Lot Numbers from the query result
        res.status(200).json(results);
    });
});

// app.get("/api/lot", (req, res) => {
//   const query = `
//     SELECT l.LotNumber, p.PurchaserName, p.PurchaseDate, s.SellerName, s.SellDate
//     FROM Lots l
//     LEFT JOIN Purchaser p ON l.LotNumber = p.LotNumber
//     LEFT JOIN Seller s ON l.LotNumber = s.LotNumber
//   `;
  
//   db.query(query, (err, results) => {
//     if (err) {
//       console.error("Error fetching lots:", err);
//       res.status(500).send("Error fetching lot data");
//     } else {
//       res.json(results);
//     }
//   });
// });
app.get("/api/lot", (req, res) => {
  const adminId = parseInt(req.query.adminId); // Read adminId from query parameters

  if (!adminId) {
    return res.status(400).json({ error: "adminId is required" });
  }

  const query = `
    SELECT l.LotNumber, p.PurchaserName, p.PurchaseDate, s.SellerName, s.SellDate
    FROM Lots l
    LEFT JOIN Purchaser p ON l.LotNumber = p.LotNumber AND p.adminId = ?
    LEFT JOIN Seller s ON l.LotNumber = s.LotNumber AND s.adminId = ?
    WHERE l.adminId = ?
  `;

  db.query(query, [adminId, adminId, adminId], (err, results) => {
    if (err) {
      console.error("Error fetching lots:", err);
      res.status(500).send("Error fetching lot data");
    } else {
      res.json(results);
    }
  });
});


app.get('/api/data/:LotNumber', (req, res) => {
  const LotNumber = req.params.LotNumber;

  // SQL queries
  const purchaserQuery = `
      SELECT Company, PurchaserName, NumberOfBales, Quantity, Rate, Amount, GST_Percent, GST, Category, LotNumber, Hamali, Payment_status, ShopExpenses, OtherExpenses, Cartage, PaymentDate, PurchaseDate
      FROM Purchaser
      WHERE LotNumber = ?`;
  const sellerQuery = `
      SELECT Company, SellerName, NumberOfBales, Quantity, Rate, Amount, GST_Percent, GST, LotNumber, Hamali, Payment_status, ShopExpenses, OtherExpenses, LorryFright, PaymentReceived, SellDate 
      FROM Seller 
      WHERE LotNumber = ?`;
  const purchaserPaymentsQuery = `
      SELECT LotNumber, PurchaserName, Amount, SubPayments, PaymentsDate, InterestAmount, BalanceAfterPayment
      FROM PurchaserPayments
      WHERE LotNumber = ?`;
  const sellerPaymentsQuery = `
      SELECT LotNumber, SellerName, Amount, SubPayments, PaymentDate, InterestAmount, BalanceAfterPayment
      FROM SellerPayments
      WHERE LotNumber = ?`;
  const purchaserNoteQuery = `
      SELECT LotNumber, NoteType, PurchaserName, Nbales, Nquantity, Nrate, Namount, NGST_Percent, NGST
      FROM PurchaserNote
      WHERE LotNumber = ?`;
  const sellerNoteQuery = `
      SELECT LotNumber, NoteType, SellerName, Nbales, Nquantity, Nrate, Namount, NGST_Percent, NGST
      FROM SellerNote
      WHERE LotNumber = ?`;

  // Query the Purchaser table
  db.query(purchaserQuery, [LotNumber], (purchaserError, purchaserResults) => {
      if (purchaserError) {
          console.error("Error querying Purchaser table:", purchaserError.message);
          return res.status(500).json({ error: "Database error while fetching purchaser data.", details: purchaserError.message });
      }

      // Query the Seller table
      db.query(sellerQuery, [LotNumber], (sellerError, sellerResults) => {
          if (sellerError) {
              console.error("Error querying Seller table:", sellerError.message);
              return res.status(500).json({ error: "Database error while fetching seller data.", details: sellerError.message });
          }

          // Query the PurchaserPayments table
          db.query(purchaserPaymentsQuery, [LotNumber], (purchaserPaymentsError, purchaserPaymentsResults) => {
              if (purchaserPaymentsError) {
                  console.error("Error querying PurchaserPayments table:", purchaserPaymentsError.message);
                  return res.status(500).json({ error: "Database error while fetching purchaser payments.", details: purchaserPaymentsError.message });
              }

              // Query the SellerPayments table
              db.query(sellerPaymentsQuery, [LotNumber], (sellerPaymentsError, sellerPaymentsResults) => {
                  if (sellerPaymentsError) {
                      console.error("Error querying SellerPayments table:", sellerPaymentsError.message);
                      return res.status(500).json({ error: "Database error while fetching seller payments.", details: sellerPaymentsError.message });
                  }

                  // Query the PurchaserNote table
                  db.query(purchaserNoteQuery, [LotNumber], (purchaserNoteError, purchaserNoteResults) => {
                      if (purchaserNoteError) {
                          console.error("Error querying PurchaserNote table:", purchaserNoteError.message);
                          return res.status(500).json({ error: "Database error while fetching purchaser notes.", details: purchaserNoteError.message });
                      }

                      // Query the SellerNote table
                      db.query(sellerNoteQuery, [LotNumber], (sellerNoteError, sellerNoteResults) => {
                          if (sellerNoteError) {
                              console.error("Error querying SellerNote table:", sellerNoteError.message);
                              return res.status(500).json({ error: "Database error while fetching seller notes.", details: sellerNoteError.message });
                          }

                          // Check if data is found
                          if (
                              purchaserResults.length === 0 &&
                              sellerResults.length === 0 &&
                              purchaserPaymentsResults.length === 0 &&
                              sellerPaymentsResults.length === 0 &&
                              purchaserNoteResults.length === 0 &&
                              sellerNoteResults.length === 0
                          ) {
                              console.warn(`No data found for Lot Number: ${LotNumber}`);
                              return res.status(404).json({ error: "No data found for the provided Lot Number." });
                          }

                          // Send response
                          res.status(200).json({
                              purchaser: purchaserResults,
                              seller: sellerResults,
                              purchaserpayments: purchaserPaymentsResults,
                              sellerpayments: sellerPaymentsResults,
                              purchasernote: purchaserNoteResults,
                              sellernote: sellerNoteResults
                          });
                      });
                  });
              });
          });
      });
  });
});

//--------------------------------------------------------------------------------------
// app.get('/api/inventory-data/:LotNumber?', (req, res) => {
//     const LotNumber = req.params.LotNumber;
//     console.log('Received LotNumber:', LotNumber); // Log the received LotNumber
  
//     let query;
//     const params = [];
  
//     if (LotNumber) {
//       console.log('Fetching inventory data for Lot Number:', LotNumber);
//       query = `
//         SELECT 
//           i.LotNumber,
//           i.BalanceBales,
//           i.BalanceQuantity
//         FROM Inventory i
//         WHERE i.LotNumber = ?;
//       `;
//       params.push(LotNumber);
//     } else {
//       console.log('Fetching overall inventory data');
//       query = `
//         SELECT 
//           SUM(i.BalanceBales) AS TotalBalanceBales,
//           SUM(i.BalanceQuantity) AS TotalBalanceQuantity
//         FROM Inventory i;
//       `;
//     }
  
//     db.query(query, params, (error, results) => {
//       if (error) {
//         console.error('Error fetching inventory data:', error.message);
//         return res.status(500).json({ error: 'Error fetching inventory data.' });
//       }
  
//       console.log('Query Results:', results); // Log the results
  
//       if (results.length === 0) {
//         return res.status(200).json(LotNumber ? { inventory: [] } : { overallInventory: {} });
//       }
  
//       res.status(200).json(LotNumber ? { inventory: results } : { overallInventory: results[0] });
//     });
//   });
  



//-------------------------------------------------------------------------------------
// /// Fetch data for a given LotNumber
// app.get("/api/fetch-data/:LotNumber", (req, res) => {
//   const { LotNumber } = req.params;

//   const query = `
//     SELECT * FROM Purchaser WHERE LotNumber = ?;
//     SELECT * FROM Seller WHERE LotNumber = ?;
//   `;

//   db.query(query, [LotNumber, LotNumber], (err, results) => {
//     if (err) {
//       console.error("Error fetching data: ", err);
//       return res.status(500).json({ message: "Error fetching data" });
//     }

//     const purchaserData = results[0]; // Purchaser data from the first query
//     const sellerData = results[1]; // Seller data from the second query

//     res.json({
//       purchaserData: purchaserData.length > 0 ? purchaserData : [],
//       sellerData: sellerData.length > 0 ? sellerData : [],
//     });
//   });
// });


//-----------------------------------------------------------------------------------------
// app.get("/api/fetch-data/:LotNumber", (req, res) => {
//   const LotNumber = req.params.LotNumber;

//   // Queries to fetch data
//   const purchaserQuery = `SELECT * FROM Purchaser WHERE LotNumber = ?`;
//   const sellerQuery = `SELECT * FROM Seller WHERE LotNumber = ?`;
//   const sellerPaymentsQuery = `SELECT * FROM SellerPayments WHERE LotNumber = ?`;
//   const purchaserPaymentsQuery = `SELECT * FROM PurchaserPayments WHERE LotNumber = ?`;
//   const purchaserNotesQuery = `SELECT * FROM PurchaserNote WHERE LotNumber = ?`;
//   const sellerNotesQuery = `SELECT * FROM SellerNote WHERE LotNumber = ?`;

  

//   // Fetch Purchaser Data
//   db.query(purchaserQuery, [LotNumber], (err, purchasers) => {
//     if (err) return res.status(500).json({ error: "Error fetching purchaser data" });

//     // Fetch Purchaser Payments Data
//     db.query(purchaserPaymentsQuery, [LotNumber], (err, purchaserPayments) => {
//       if (err) return res.status(500).json({ error: "Error fetching purchaser payments data", details: err });

//       // Fetch Purchaser Notes Data
//       db.query(purchaserNotesQuery, [LotNumber], (err, purchaserNotes) => {
//         if (err) return res.status(500).json({ error: "Error fetching purchaser notes data", details: err });

//         // Fetch Seller Data
//         db.query(sellerQuery, [LotNumber], (err, sellers) => {
//           if (err) return res.status(500).json({ error: "Error fetching seller data", details: err });

//           // Fetch Seller Payments Data
//           db.query(sellerPaymentsQuery, [LotNumber], (err, sellerPayments) => {
//             if (err) return res.status(500).json({ error: "Error fetching seller payments data", details: err });

//             // Fetch Seller Notes Data
//             db.query(sellerNotesQuery, [LotNumber], (err, sellerNotes) => {
//               if (err) return res.status(500).json({ error: "Error fetching seller notes data", details: err });

//               // Map Seller Data and Include Payments and Notes
//               const sellerResult = sellers.map(seller => {
//                 const associatedSellerPayments = sellerPayments
//                   .filter(payment => payment.LotNumber === seller.LotNumber)
//                   .map(payment => ({
//                     amount: parseFloat(payment.SubPayments) || null,
//                     date: payment.PaymentDate || null,
//                   }));

//                 const associatedSellerNotes = sellerNotes
//                   .filter(note => note.LotNumber === seller.LotNumber)
//                   .map(note => ({
//                     Nbales: note.Nbales || null,
//                     Nquantity: note.Nquantity || null,
//                     Nrate: note.Nrate || null,
//                     Namount: note.Namount || null,
//                     NGST: note.NGST || null,
//                     NGST_Percent: note.NGST_Percent || null,
//                   }));

//                 return {
//                   BillNumber: seller.BillNumber,
//                   SellerName: seller.SellerName,
//                   SellerAddress: seller.SellerAddress,
//                   GSTNumber: seller.GSTNumber,
//                   NumberOfBales: parseInt(seller.NumberOfBales, 10) || 0,
//                   Quantity: parseFloat(seller.Quantity) || 0,
//                   Rate: parseFloat(seller.Rate) || 0,
//                   Amount: parseFloat(seller.Amount) || 0,
//                   GST_Percent: parseFloat(seller.GST_Percent) || 0,
//                   GST: parseFloat(seller.GST) || 0,
//                   Hamali: parseFloat(seller.Hamali) || 0,
//                   Payment_status: seller.Payment_status || "No",
//                   ShopExpenses: parseFloat(seller.ShopExpenses) || 0,
//                   LorryFright: parseFloat(seller.LorryFright) || 0,
//                   OtherExpenses: parseFloat(seller.OtherExpenses) || 0,
//                   paymentReceived: parseFloat(seller.PaymentAmount) || 0,
//                   SellDate: seller.SellDate || null,
//                   payments: associatedSellerPayments, // Include the seller payments
//                   NoteType: seller.NoteType || "None",
//                   sellerNotes: associatedSellerNotes,       // Include the seller notes
//                 };
//               });

//               // Map Purchaser Data and Include Payments and Notes
//               const purchaserResult = purchasers.map(purchaser => {
//                 const associatedPurchaserPayments = purchaserPayments
//                   .filter(payment => payment.LotNumber === purchaser.LotNumber)
//                   .map(payment => ({
//                     amount: parseFloat(payment.SubPayments) || 0,
//                     date: formatDate(payment.PaymentsDate) || null,
//                   }));

//                 const associatedPurchaserNotes = purchaserNotes
//                   .filter(note => note.LotNumber === purchaser.LotNumber)
//                   .map(note => ({
//                     Nbales: note.Nbales || null,
//                     Nquantity: note.Nquantity || null,
//                     Nrate: note.Nrate || null,
//                     Namount: note.Namount || null,
//                     NGST: note.NGST || null,
//                     NGST_Percent: note.NGST_Percent || null,
//                   }));

//                 return {
//                   BillNumber: purchaser.BillNumber,
//                   PurchaserName: purchaser.PurchaserName,
//                   PurchaserAddress: purchaser.PurchaserAddress,
//                   GSTNumber: purchaser.GSTNumber,
//                   NumberOfBales: parseInt(purchaser.NumberOfBales, 10) || 0,
//                   Quantity: parseFloat(purchaser.Quantity) || 0,
//                   Rate: parseFloat(purchaser.Rate) || 0,
//                   Amount: parseFloat(purchaser.Amount) || 0,
//                   GST_Percent: parseFloat(purchaser.GST_Percent) || 0,
//                   GST: parseFloat(purchaser.GST) || 0,
//                   Hamali: parseFloat(purchaser.Hamali) || 0,
//                   Payment_status: purchaser.Payment_status || "No",
//                   ShopExpenses: parseFloat(purchaser.ShopExpenses) || 0,
//                   Cartage: parseFloat(purchaser.Cartage) || 0,
//                   OtherExpenses: parseFloat(purchaser.OtherExpenses) || 0,
//                   paymenttobeMade: parseFloat(purchaser.Amount) - parseFloat(purchaser.PaymentAmount) || 0,
//                   PaymentDate: purchaser.PaymentDate || null,
//                   PurchaseDate: purchaser.PurchaseDate || null,
//                   paymentts: associatedPurchaserPayments, // Include the purchaser payments
//                   NoteType: purchaser.NoteType || "None",
//                   purchaserNotes: associatedPurchaserNotes,        // Include the purchaser notes
//                 };
//               });

//               // Respond with the combined data
//               res.json({
//                 purchaser: purchaserResult, // Purchaser data including payments and notes
//                 sellers: sellerResult,      // Seller data including payments and notes
//               });
//             });
//           });
//         });
//       });
//     });
//   });
// });
//------------------------------------------------------------------------------------------------------
app.get("/api/fetch-data/:LotNumber", (req, res) => {
  const LotNumber = req.params.LotNumber;
  const adminId = req.query.adminId || req.query.id;

  if (!adminId) {
    return res.status(400).json({ error: "Missing adminId or id in query" });
  }

  const purchaserQuery = `SELECT * FROM Purchaser WHERE LotNumber = ? AND adminId = ?`;
  const sellerQuery = `SELECT * FROM Seller WHERE LotNumber = ? AND adminId = ?`;
  const sellerPaymentsQuery = `SELECT * FROM SellerPayments WHERE LotNumber = ? AND adminId = ?`;
  const purchaserPaymentsQuery = `SELECT * FROM PurchaserPayments WHERE LotNumber = ? AND adminId = ?`;
  const purchaserNotesQuery = `SELECT * FROM PurchaserNote WHERE LotNumber = ? AND adminId = ?`;
  const sellerNotesQuery = `SELECT * FROM SellerNote WHERE LotNumber = ? AND adminId = ?`;

  db.query(purchaserQuery, [LotNumber, adminId], (err, purchasers) => {
    if (err) return res.status(500).json({ error: "Error fetching purchaser data" });

    db.query(purchaserPaymentsQuery, [LotNumber, adminId], (err, purchaserPayments) => {
      if (err) return res.status(500).json({ error: "Error fetching purchaser payments data", details: err });

      db.query(purchaserNotesQuery, [LotNumber, adminId], (err, purchaserNotes) => {
        if (err) return res.status(500).json({ error: "Error fetching purchaser notes data", details: err });

        db.query(sellerQuery, [LotNumber, adminId], (err, sellers) => {
          if (err) return res.status(500).json({ error: "Error fetching seller data", details: err });

          db.query(sellerPaymentsQuery, [LotNumber, adminId], (err, sellerPayments) => {
            if (err) return res.status(500).json({ error: "Error fetching seller payments data", details: err });

            db.query(sellerNotesQuery, [LotNumber, adminId], (err, sellerNotes) => {
              if (err) return res.status(500).json({ error: "Error fetching seller notes data", details: err });

              const sellerResult = sellers.map(seller => {
                const associatedSellerPayments = sellerPayments
                  .filter(payment => payment.LotNumber === seller.LotNumber)
                  .map(payment => ({
                    amount: parseFloat(payment.SubPayments) || null,
                    date: payment.PaymentDate || null,
                  }));

                const associatedSellerNotes = sellerNotes
                  .filter(note => note.LotNumber === seller.LotNumber)
                  .map(note => ({
                    Nbales: note.Nbales || null,
                    Nquantity: note.Nquantity || null,
                    Nrate: note.Nrate || null,
                    Namount: note.Namount || null,
                    NGST: note.NGST || null,
                    NGST_Percent: note.NGST_Percent || null,
                  }));

                return {
                  CompanyName: seller.CompanyName || "N/A",
                  BillNumber: seller.BillNumber,
                  SellerName: seller.SellerName,
                  SellerAddress: seller.SellerAddress,
                  GSTNumber: seller.GSTNumber,
                  NumberOfBales: parseInt(seller.NumberOfBales, 10) || 0,
                  Quantity: parseFloat(seller.Quantity) || 0,
                  Rate: parseFloat(seller.Rate) || 0,
                  Amount: parseFloat(seller.Amount) || 0,
                  GST_Percent: parseFloat(seller.GST_Percent) || 0,
                  GST: parseFloat(seller.GST) || 0,
                  Hamali: parseFloat(seller.Hamali) || 0,
                  Payment_status: seller.Payment_status || "No",
                  ShopExpenses: parseFloat(seller.ShopExpenses) || 0,
                  LorryFright: parseFloat(seller.LorryFright) || 0,
                  OtherExpenses: parseFloat(seller.OtherExpenses) || 0,
                  paymentReceived: parseFloat(seller.PaymentAmount) || 0,
                  SellDate: seller.SellDate || null,
                  payments: associatedSellerPayments,
                  NoteType: seller.NoteType || "None",
                  sellerNotes: associatedSellerNotes,
                };
              });

              const purchaserResult = purchasers.map(purchaser => {
                const associatedPurchaserPayments = purchaserPayments
                  .filter(payment => payment.LotNumber === purchaser.LotNumber)
                  .map(payment => ({
                    amount: parseFloat(payment.SubPayments) || 0,
                    date: formatDate(payment.PaymentsDate) || null,
                  }));

                const associatedPurchaserNotes = purchaserNotes
                  .filter(note => note.LotNumber === purchaser.LotNumber)
                  .map(note => ({
                    Nbales: note.Nbales || null,
                    Nquantity: note.Nquantity || null,
                    Nrate: note.Nrate || null,
                    Namount: note.Namount || null,
                    NGST: note.NGST || null,
                    NGST_Percent: note.NGST_Percent || null,
                  }));

                return {
                  CompanyName: purchaser.CompanyName || "N/A",
                  BillNumber: purchaser.BillNumber,
                  PurchaserName: purchaser.PurchaserName,
                  PurchaserAddress: purchaser.PurchaserAddress,
                  GSTNumber: purchaser.GSTNumber,
                  NumberOfBales: parseInt(purchaser.NumberOfBales, 10) || 0,
                  Quantity: parseFloat(purchaser.Quantity) || 0,
                  Rate: parseFloat(purchaser.Rate) || 0,
                  Amount: parseFloat(purchaser.Amount) || 0,
                  GST_Percent: parseFloat(purchaser.GST_Percent) || 0,
                  GST: parseFloat(purchaser.GST) || 0,
                  Hamali: parseFloat(purchaser.Hamali) || 0,
                  Payment_status: purchaser.Payment_status || "No",
                  ShopExpenses: parseFloat(purchaser.ShopExpenses) || 0,
                  Cartage: parseFloat(purchaser.Cartage) || 0,
                  OtherExpenses: parseFloat(purchaser.OtherExpenses) || 0,
                  paymenttobeMade: parseFloat(purchaser.Amount) - parseFloat(purchaser.PaymentAmount) || 0,
                  PaymentDate: purchaser.PaymentDate || null,
                  PurchaseDate: purchaser.PurchaseDate || null,
                  paymentts: associatedPurchaserPayments,
                  NoteType: purchaser.NoteType || "None",
                  purchaserNotes: associatedPurchaserNotes,
                };
              });

              res.json({
                purchaser: purchaserResult,
                sellers: sellerResult,
              });
            });
          });
        });
      });
    });
  });
});



// app.post("/api/submit-data", (req, res) => {
//   const { purchaser, sellers } = req.body;

//   if (!purchaser || purchaser.length === 0 || !sellers || sellers.length === 0) {
//     return res.status(400).json({ error: "Purchaser and Sellers data are required." });
//   }

//   // Insert Lots (assuming LotNumber is the same for all entries)
//   const lotNumber = purchaser[0].LotNumber;
//   const lotQuery = `INSERT IGNORE INTO Lots (LotNumber) VALUES (?)`;
//   db.query(lotQuery, [lotNumber], (err) => {
//     if (err) {
//       return res.status(500).json({ error: "Error inserting LotNumber", details: err });
//     }

//     // Insert Purchaser data
//     const purchaserQuery = `
//       INSERT INTO Purchaser (
//         PurchaserName, NumberOfBales, Quantity, Rate, Amount, GST_Percent, GST, 
//         LotNumber, Hamali, Payment_status, ShopExpenses, Cartage, OtherExpenses, 
//         Category, PaymentDate, PurchaseDate
//       ) VALUES ?`;

//     const purchaserValues = purchaser.map((item) => [
//       item.PurchaserName,
//       item.NumberOfBales,
//       item.Quantity,
//       item.Rate,
//       item.Amount,
//       item.GST_Percent,
//       item.GST,
//       item.LotNumber,
//       item.Hamali,
//       item.Payment_status,
//       item.ShopExpenses,
//       item.Cartage,
//       item.OtherExpenses,
//       item.Category,
//       item.PaymentDate,
//       item.PurchaseDate,
//     ]);

//     db.query(purchaserQuery, [purchaserValues], (err) => {
//       if (err) {
//         return res.status(500).json({ error: "Error inserting Purchaser data", details: err });
//       }

//       // Insert Seller data
//       const sellerQuery = `
//         INSERT INTO Seller (
//           SellerName, NumberOfBales, Quantity, Rate, Amount, GST_Percent, GST, 
//           LotNumber, Hamali, Payment_status, ShopExpenses, LorryFright, OtherExpenses, 
//           PaymentReceived, SellDate
//         ) VALUES ?`;

//       const sellerValues = sellers.map((seller) => [
//         seller.SellerName,
//         seller.NumberOfBales,
//         seller.Quantity,
//         seller.Rate,
//         seller.Amount,
//         seller.GST_Percent,
//         seller.GST,
//         lotNumber,
//         seller.Hamali,
//         seller.Payment_status,
//         seller.ShopExpenses,
//         seller.LorryFright,
//         seller.OtherExpenses,
//         seller.paymentReceived,
//         seller.SellDate,
//       ]);

//       db.query(sellerQuery, [sellerValues], (err, sellerResult) => {
//         if (err) {
//           return res.status(500).json({ error: "Error inserting Seller data", details: err });
//         }

//         // Insert SellerPayments data
//         const sellerPaymentsQuery = `
//           INSERT INTO SellerPayments (
//             LotNumber, SellerName, SubPayments, PaymentDate
//           ) VALUES ?`;

//         const sellerPaymentsValues = sellers.flatMap((seller) =>
//           seller.payments.map((payment) => [
//             lotNumber,
//             seller.SellerName,
//             payment.amount,
//             payment.date,
//           ])
//         );

//         if (sellerPaymentsValues.length > 0) {
//           db.query(sellerPaymentsQuery, [sellerPaymentsValues], (err) => {
//             if (err) {
//               return res.status(500).json({ error: "Error inserting SellerPayments data", details: err });
//             }

//             res.status(200).json({ message: "Data successfully added to all tables" });
//           });
//         } else {
//           res.status(200).json({ message: "Data successfully added to Lots, Purchaser, and Seller tables" });
//         }
//       });
//     });
//   });
// });

// app.post("/api/submit-data", (req, res) => {
//   console.log('Received data:', req.body);  // Log incoming data

//   const { purchaser, sellers } = req.body;
//   const purchaserData = purchaser[0];
//   const sellerData = sellers[0];

//   // Log purchaser and seller data
//   console.log('Purchaser Data:', purchaserData);
//   console.log('Seller Data:', sellerData);

//   const purchaserQuery = `
//     INSERT INTO Purchaser (PurchaserName, NumberOfBales, Quantity, Rate, Amount, GST_Percent, GST, LotNumber, Hamali, Payment_status, ShopExpenses, Cartage, OtherExpenses, Category, PaymentDate, PurchaseDate)
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//   `;
//   const purchaserValues = [
//     purchaserData.PurchaserName,
//     purchaserData.NumberOfBales,
//     purchaserData.Quantity,
//     purchaserData.Rate,
//     purchaserData.Amount,
//     purchaserData.GST_Percent,
//     purchaserData.GST,
//     purchaserData.LotNumber,
//     purchaserData.Hamali,
//     purchaserData.Payment_status,
//     purchaserData.ShopExpenses,
//     purchaserData.Cartage,
//     purchaserData.OtherExpenses,
//     purchaserData.Category,
//     purchaserData.PaymentDate || null,
//     purchaserData.PurchaseDate,
//   ];

//   // Log the purchaser query and values
//   console.log('Purchaser Query:', purchaserQuery);
//   console.log('Purchaser Values:', purchaserValues);

//   db.query(purchaserQuery, purchaserValues, (err, result) => {
//     if (err) {
//       console.error("Error inserting purchaser data:", err);  // Log the error
//       return res.status(500).json({ error: "Error inserting purchaser data" });
//     }

//     console.log('Purchaser data inserted successfully:', result);  // Log successful insertion

//     // Seller query and insertion here (similar to the purchaser query)
//     const sellerQuery = `
//       INSERT INTO Seller (SellerName, NumberOfBales, Quantity, Rate, Amount, GST_Percent, GST, Hamali, Payment_status, ShopExpenses, LorryFright, OtherExpenses, SellDate)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `;
//     const sellerValues = [
//       sellerData.SellerName,
//       sellerData.NumberOfBales,
//       sellerData.Quantity,
//       sellerData.Rate,
//       sellerData.Amount,
//       sellerData.GST_Percent,
//       sellerData.GST,
//       sellerData.Hamali,
//       sellerData.Payment_status,
//       sellerData.ShopExpenses,
//       sellerData.LorryFright,
//       sellerData.OtherExpenses,
//       sellerData.SellDate,
//     ];

//     // Log the seller query and values
//     console.log('Seller Query:', sellerQuery);
//     console.log('Seller Values:', sellerValues);

//     db.query(sellerQuery, sellerValues, (err, result) => {
//       if (err) {
//         console.error("Error inserting seller data:", err);  // Log the error
//         return res.status(500).json({ error: "Error inserting seller data" });
//       }

//       console.log('Seller data inserted successfully:', result);  // Log successful insertion

//       // Insert payments if any
//       if (sellerData.payments && sellerData.payments.length > 0) {
//         sellerData.payments.forEach((payment) => {
//           const sellerPaymentsQuery = `
//             INSERT INTO SellerPayments (LotNumber, SellerName, Amount, SubPayments, PaymentDate, InterestAmount, BalanceAfterPayment)
//             VALUES (?, ?, ?, ?, ?, ?, ?)
//           `;
//           const sellerPaymentsValues = [
//             purchaserData.LotNumber,
//             sellerData.SellerName,
//             payment.amount,
//             payment.amount,
//             payment.date || null,
//             0,  // InterestAmount (can be updated if needed)
//             payment.amount,  // BalanceAfterPayment (can be adjusted if needed)
//           ];

//           // Log the seller payments query and values
//           console.log('Seller Payments Query:', sellerPaymentsQuery);
//           console.log('Seller Payments Values:', sellerPaymentsValues);

//           db.query(sellerPaymentsQuery, sellerPaymentsValues, (err, result) => {
//             if (err) {
//               console.error("Error inserting seller payment:", err);  // Log the error
//             } else {
//               console.log('Seller payment inserted successfully:', result);  // Log successful payment insertion
//             }
//           });
//         });
//       }

//       // Log the successful response
//       console.log('Sending response:', { message: "Data saved successfully" });
//       res.status(200).json({ message: "Data saved successfully" });
//     });
//   });
// });
//----------------------------------------------------------------------------------------------------
// app.post("/api/submit-data", (req, res) => {
//   const { purchaser, sellers } = req.body;
//   console.log("Request received:", req.body)


//   if (!purchaser || purchaser.length === 0 || !sellers || sellers.length === 0) {
//     return res.status(400).json({ error: "Purchaser and Sellers data are required." });
//   }

//   // Insert Lots (assuming LotNumber is the same for all entries)
//   const lotNumber = purchaser[0].LotNumber;
//   const lotQuery = `INSERT IGNORE INTO Lots (LotNumber) VALUES (?)`;

//   db.query(lotQuery, [lotNumber], (err) => {
//     if (err) {
//       return res.status(500).json({ error: "Error inserting LotNumber", details: err });
//     }

//     // Insert Purchaser data
//     const purchaserQuery = `
//       INSERT INTO Purchaser (
//         BIllNumber, PurchaserName,PurchaserAddress, GSTNumber, NumberOfBales, Quantity, Rate, Amount, GST_Percent, GST, 
//         LotNumber, Hamali, Payment_status, ShopExpenses, Cartage, OtherExpenses, 
//         Category, PaymentDate, PurchaseDate
//       ) VALUES ?`;

//     const purchaserValues = purchaser.map((item) => [
//       item.BillNumber,
//       item.PurchaserName,
//       item.PurchaserAddress,
//       item.GSTNumber,
//       item.NumberOfBales,
//       item.Quantity,
//       item.Rate,
//       item.Amount,
//       item.GST_Percent,
//       item.GST,
//       item.LotNumber,
//       item.Hamali,
//       item.Payment_status,
//       item.ShopExpenses,
//       item.Cartage,
//       item.OtherExpenses,
//       item.Category,
//       item.PaymentDate || null,
//       item.PurchaseDate || null,
//     ]);

//     db.query(purchaserQuery, [purchaserValues], (err) => {
//       if (err) {
//         return res.status(500).json({ error: "Error inserting Purchaser data", details: err });
//       }

//       // Insert Seller data
//       const sellerQuery = `
//         INSERT INTO Seller (
//           BillNumber, SellerName, SellerAddress, GSTNumber, NumberOfBales, Quantity, Rate, Amount, GST_Percent, GST, 
//           LotNumber, Hamali, Payment_status, ShopExpenses, LorryFright, OtherExpenses, 
//            SellDate
//         ) VALUES ?`;

//       const sellerValues = sellers.map((seller) => [
//         seller.BillNumber,
//         seller.SellerName,
//         seller.SellerAddress,
//         seller.GSTNumber,
//         seller.NumberOfBales,
//         seller.Quantity,
//         seller.Rate,
//         seller.Amount,
//         seller.GST_Percent,
//         seller.GST,
//         lotNumber,
//         seller.Hamali,
//         seller.Payment_status,
//         seller.ShopExpenses,
//         seller.LorryFright,
//         seller.OtherExpenses,
//         // seller.paymentReceived || 0,
//         seller.SellDate || null,
//       ]);

//       db.query(sellerQuery, [sellerValues], (err) => {
//         if (err) {
//           return res.status(500).json({ error: "Error inserting Seller data", details: err });
//         }

//         // Insert SellerPayments data
//         const sellerPaymentsQuery = `
//           INSERT INTO SellerPayments (
//             LotNumber, SubPayments, PaymentDate
//           ) VALUES ?`;

//         const sellerPaymentsValues = sellers.flatMap((seller) =>
//           seller.payments.map((payment) => [
//             lotNumber,
//             payment.amount || null,
//             payment.date || null,
//           ])
//         );

//         if (sellerPaymentsValues.length > 0) {
//           db.query(sellerPaymentsQuery, [sellerPaymentsValues], (err) => {
//             if (err) {
//               return res.status(500).json({ error: "Error inserting SellerPayments data", details: err });
//             }

//             res.status(200).json({ message: "Data successfully added to all tables" });
//           });
//         } else {
//           res.status(200).json({ message: "Data successfully added to Lots, Purchaser, and Seller tables" });
//         }
//       });
//     });
//   });
// });
//-----------------------------------------------------------------------------------------------------

// app.post("/api/submit-data", (req, res) => {
//   const { purchaser, sellers } = req.body;
//   console.log("Request received:", req.body);

//   if (!purchaser || purchaser.length === 0 || !sellers || sellers.length === 0) {
//     return res.status(400).json({ error: "Purchaser and Sellers data are required." });
//   }

//   // Start the transaction
//   db.beginTransaction((err) => {
//     if (err) {
//       return res.status(500).json({ error: "Error starting database transaction", details: err });
//     }

//     // Insert Lots (assuming LotNumber is the same for all entries)
//     const lotNumber = purchaser[0].LotNumber;
//     const lotQuery = `INSERT IGNORE INTO Lots (LotNumber) VALUES (?)`;

//     db.query(lotQuery, [lotNumber], (err) => {
//       if (err) {
//         return db.rollback(() => {
//           res.status(500).json({ error: "Error inserting LotNumber", details: err });
//         });
//       }

//       // Insert Purchaser data
//       const purchaserQuery = `
//         INSERT INTO Purchaser (
//           BillNumber, PurchaserName, PurchaserAddress, GSTNumber, NumberOfBales, Quantity, Rate, Amount, GST_Percent, GST, 
//           LotNumber, Hamali, Payment_status, ShopExpenses, Cartage, OtherExpenses, 
//           Category, PaymentDate, PurchaseDate
//         ) VALUES ?`;

//       const purchaserValues = purchaser.map((item) => [
//         item.BillNumber,
//         item.PurchaserName,
//         item.PurchaserAddress,
//         item.GSTNumber,
//         item.NumberOfBales,
//         item.Quantity,
//         item.Rate,
//         item.Amount,
//         item.GST_Percent,
//         item.GST,
//         item.LotNumber,
//         item.Hamali,
//         item.Payment_status,
//         item.ShopExpenses,
//         item.Cartage,
//         item.OtherExpenses,
//         item.Category,
//         item.PaymentDate,
//         item.PurchaseDate,
//       ]);

//       db.query(purchaserQuery, [purchaserValues], (err) => {
//         if (err) {
//           return db.rollback(() => {
//             res.status(500).json({ error: "Error inserting Purchaser data", details: err });
//           });
//         }

//         // Insert Seller data
//         const sellerQuery = `
//           INSERT INTO Seller (
//             BillNumber, SellerName, SellerAddress, GSTNumber, NumberOfBales, Quantity, Rate, Amount, GST_Percent, GST, 
//             LotNumber, Hamali, Payment_status, ShopExpenses, LorryFright, OtherExpenses, 
//             SellDate
//           ) VALUES ?`;

//         const sellerValues = sellers.map((seller) => [
//           seller.BillNumber,
//           seller.SellerName,
//           seller.SellerAddress,
//           seller.GSTNumber,
//           seller.NumberOfBales,
//           seller.Quantity,
//           seller.Rate,
//           seller.Amount,
//           seller.GST_Percent,
//           seller.GST,
//           lotNumber,
//           seller.Hamali ,
//           seller.Payment_status,
//           seller.ShopExpenses,
//           seller.LorryFright,
//           seller.OtherExpenses,
//           seller.SellDate,
//         ]);

//         db.query(sellerQuery, [sellerValues], (err) => {
//           if (err) {
//             return db.rollback(() => {
//               res.status(500).json({ error: "Error inserting Seller data", details: err });
//             });
//           }

//           // Insert SellerPayments data
//           const sellerPaymentsQuery = `
//             INSERT INTO SellerPayments (
//               LotNumber, SubPayments, PaymentDate
//             ) VALUES ?`;

//           const sellerPaymentsValues = sellers.flatMap((seller) =>
//             seller.payments.map((payment) => [
//               lotNumber,
//               payment.amount || null,
//               payment.date || null,
//             ])
//           );

//           if (sellerPaymentsValues.length > 0) {
//             db.query(sellerPaymentsQuery, [sellerPaymentsValues], (err) => {
//               if (err) {
//                 return db.rollback(() => {
//                   res.status(500).json({ error: "Error inserting SellerPayments data", details: err });
//                 });
//               }

//               // Commit the transaction
//               db.commit((err) => {
//                 if (err) {
//                   return db.rollback(() => {
//                     res.status(500).json({ error: "Error committing transaction", details: err });
//                   });
//                 }
//                 res.status(200).json({ message: "Data successfully added to all tables" });
//               });
//             });
//           } else {
//             // Commit the transaction if there are no SellerPayments
//             db.commit((err) => {
//               if (err) {
//                 return db.rollback(() => {
//                   res.status(500).json({ error: "Error committing transaction", details: err });
//                 });
//               }
//               res.status(200).json({ message: "Data successfully added to Lots, Purchaser, and Seller tables" });
//             });
//           }
//         });
//       });
//     });
//   });
// });


// app.post("/api/submit-data", (req, res) => {
//   const { purchaser, sellers } = req.body;
//   console.log("Request received:", req.body);

//   if (!purchaser || purchaser.length === 0 || !sellers || sellers.length === 0) {
//     return res.status(400).json({ error: "Purchaser and Sellers data are required." });
//   }

//   // Start the transaction
//   db.beginTransaction((err) => {
//     if (err) {
//       return res.status(500).json({ error: "Error starting database transaction", details: err });
//     }

//     // Insert Lots (assuming LotNumber is the same for all entries)
//     const lotNumber = purchaser[0].LotNumber;
//     const lotQuery = `INSERT IGNORE INTO Lots (LotNumber) VALUES (?)`;

//     db.query(lotQuery, [lotNumber], (err) => {
//       if (err) {
//         return db.rollback(() => {
//           res.status(500).json({ error: "Error inserting LotNumber", details: err });
//         });
//       }

//       // Insert Purchaser data
//       const purchaserQuery = `
//         INSERT INTO Purchaser (
//           BillNumber, PurchaserName, PurchaserAddress, GSTNumber, NumberOfBales, Quantity, Rate, Amount, GST_Percent, GST, 
//           LotNumber, Hamali, Payment_status, ShopExpenses, Cartage, OtherExpenses, 
//           Category, PaymentDate, PurchaseDate
//         ) VALUES ?`;

//       const purchaserValues = purchaser.map((item) => [
//         item.BillNumber,
//         item.PurchaserName,
//         item.PurchaserAddress,
//         item.GSTNumber,
//         item.NumberOfBales,
//         item.Quantity,
//         item.Rate,
//         item.Amount,
//         item.GST_Percent,
//         item.GST,
//         item.LotNumber,
//         item.Hamali,
//         item.Payment_status,
//         item.ShopExpenses,
//         item.Cartage,
//         item.OtherExpenses,
//         item.Category,
//         item.PaymentDate,
//         item.PurchaseDate,
//       ]);

//       db.query(purchaserQuery, [purchaserValues], (err) => {
//         if (err) {
//           return db.rollback(() => {
//             res.status(500).json({ error: "Error inserting Purchaser data", details: err });
//           });
//         }

//         // Insert PurchaserPayments data
//         const purchaserPaymentsQuery = `
//           INSERT INTO PurchaserPayments (
//             LotNumber, SubPayments, PaymentsDate
//           ) VALUES ?`;

//         const purchaserPaymentsValues = purchaser.flatMap((item) =>
//           item.paymentts.map((paymentt) => [
//             lotNumber,
//             paymentt.amount || null,
//             paymentt.date || null,
//           ])
//         );

//         // Insert Seller data
//         const sellerQuery = `
//           INSERT INTO Seller (
//             BillNumber, SellerName, SellerAddress, GSTNumber, NumberOfBales, Quantity, Rate, Amount, GST_Percent, GST, 
//             LotNumber, Hamali, Payment_status, ShopExpenses, LorryFright, OtherExpenses, 
//             SellDate
//           ) VALUES ?`;

//         const sellerValues = sellers.map((seller) => [
//           seller.BillNumber,
//           seller.SellerName,
//           seller.SellerAddress,
//           seller.GSTNumber,
//           seller.NumberOfBales,
//           seller.Quantity,
//           seller.Rate,
//           seller.Amount,
//           seller.GST_Percent,
//           seller.GST,
//           lotNumber,
//           seller.Hamali,
//           seller.Payment_status,
//           seller.ShopExpenses,
//           seller.LorryFright,
//           seller.OtherExpenses,
//           seller.SellDate,
//         ]);

//         db.query(sellerQuery, [sellerValues], (err) => {
//           if (err) {
//             return db.rollback(() => {
//               res.status(500).json({ error: "Error inserting Seller data", details: err });
//             });
//           }

//           // Insert SellerPayments data
//           const sellerPaymentsQuery = `
//             INSERT INTO SellerPayments (
//               LotNumber, SubPayments, PaymentDate
//             ) VALUES ?`;

//           const sellerPaymentsValues = sellers.flatMap((seller) =>
//             seller.payments.map((payment) => [
//               lotNumber,
//               payment.amount || null,
//               payment.date || null,
//             ])
//           );

//           // Insert PurchaserPayments and SellerPayments if present
//           const insertPayments = () => {
//             const queries = [];

//             if (purchaserPaymentsValues.length > 0) {
//               queries.push(new Promise((resolve, reject) => {
//                 db.query(purchaserPaymentsQuery, [purchaserPaymentsValues], (err) => {
//                   if (err) reject({ message: "Error inserting PurchaserPayments data", details: err });
//                   resolve();
//                 });
//               }));
//             }

//             if (sellerPaymentsValues.length > 0) {
//               queries.push(new Promise((resolve, reject) => {
//                 db.query(sellerPaymentsQuery, [sellerPaymentsValues], (err) => {
//                   if (err) reject({ message: "Error inserting SellerPayments data", details: err });
//                   resolve();
//                 });
//               }));
//             }

//             return Promise.all(queries);
//           };

//           insertPayments()
//             .then(() => {
//               // Commit the transaction
//               db.commit((err) => {
//                 if (err) {
//                   return db.rollback(() => {
//                     res.status(500).json({ error: "Error committing transaction", details: err });
//                   });
//                 }
//                 res.status(200).json({ message: "Data successfully added to all tables" });
//               });
//             })
//             .catch((err) => {
//               db.rollback(() => {
//                 res.status(500).json(err);
//               });
//             });
//         });
//       });
//     });
//   });
// });


app.post("/api/submit-data", (req, res) => {
  // const { purchaser, sellers } = req.body;
  // console.log("Request received:", req.body);
  // if (!purchaser || purchaser.length === 0) {
  //   return res.status(400).json({ error: "Purchaser data is required." });
  // }

  // db.beginTransaction((err) => {
  //   if (err) {
  //     return res.status(500).json({ error: "Error starting database transaction", details: err });
  //   }

  //   const lotNumber = purchaser[0].LotNumber;
  //   // const lotQuery = `INSERT IGNORE INTO Lots (LotNumber) VALUES (?)`;

  //   // db.query(lotQuery, [lotNumber], (err) => {
  //   //   if (err) {
  //   //     return db.rollback(() => {
  //   //       res.status(500).json({ error: "Error inserting LotNumber", details: err });
  //   //     });
  //   //   }
  //   const lotQuery = `INSERT IGNORE INTO Lots (LotNumber) VALUES (?)`;

  //   db.query(lotQuery, [lotNumber], (err) => {
  //     if (err) {
  //       return db.rollback(() => {
  //         res.status(500).json({ error: "Error inserting LotNumber", details: err });
  //       });
  //     }
  //     console.log(`LotNumber ${lotNumber} inserted or already exists.`);
    
  //     // const adminID = req.admin ? req.admin.id : (req.user ? req.user.adminId : null);

  const { purchaser, sellers, adminId } = req.body;
  // const adminId = req.admin ? req.admin.id : (req.user ? req.user.adminId : null);
  // const formattedDate = (date) => {
  //   if (!date) return null;
  //   const jsDate = new Date(date);
  //   const year = jsDate.getFullYear();
  //   const month = String(jsDate.getMonth() + 1).padStart(2, "0");
  //   const day = String(jsDate.getDate()).padStart(2, "0");
  //   return `${year}-${month}-${day}`;
  // };
  if (!adminId) {
    return res.status(401).json({ error: "Unauthorized: Admin ID missing." });
  }

  if (!purchaser || purchaser.length === 0) {
    return res.status(400).json({ error: "Purchaser data is required." });
  }

  const lotNumber = purchaser[0].LotNumber;

  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ error: "Error starting database transaction", details: err });
    }

    // Insert LotNumber + adminId composite key (ignore if exists)
    const lotQuery = `INSERT IGNORE INTO Lots (LotNumber, adminId) VALUES (?, ?)`;

    db.query(lotQuery, [lotNumber, adminId], (err) => {
      if (err) {
        return db.rollback(() => {
          res.status(500).json({ error: "Error inserting LotNumber", details: err });
        });
      }
      console.log(`LotNumber ${lotNumber} for admin ${adminId} inserted or already exists.`);



      // Insert Purchaser data
      const purchaserQuery = `
        INSERT INTO Purchaser (
          Company, BillNumber, adminId, PurchaserName, PurchaserAddress, GSTNumber, NumberOfBales, Quantity, Rate, Amount, GST_Percent, GST, NoteType, 
          LotNumber, Hamali, Payment_status, ShopExpenses, Cartage, OtherExpenses, 
          Category, PurchaseDate
        ) VALUES ?`;
      
      // const adminId = req.body.adminId;
      const purchaserValues = purchaser.map((item) => [
        item.Company || "Not Selected",
        item.BillNumber,
        adminId,
        item.PurchaserName,
        item.PurchaserAddress,
        item.GSTNumber,
        item.NumberOfBales,
        item.Quantity,
        item.Rate,
        item.Amount,
        item.GST_Percent,
        item.GST,
        item.NoteType,
        item.LotNumber,
        item.Hamali,
        item.Payment_status,
        item.ShopExpenses,
        item.Cartage,
        item.OtherExpenses,
        item.Category,
        // item.PurchaseDate,
        item.PurchaseDate && !isNaN(new Date(item.PurchaseDate))
          ? new Date(item.PurchaseDate).toISOString().split('T')[0]
          : null

      ]);

      db.query(purchaserQuery, [purchaserValues], (err) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json({ error: "Error inserting Purchaser data", details: err });
          });
        }

        const handlePurchaserExtras = () => {
          const promises = [];

          // Insert Purchaser Notes if available
          if (purchaser.some((item) => item.purchaserNotes?.length > 0)) {
            const purchaserNoteQuery = `
              INSERT INTO PurchaserNote (
                LotNumber, NoteType, PurchaserName, Nbales, Nquantity, Nrate, Namount, NGST, NGST_Percent
              ) VALUES ?`;

            const purchaserNoteValues = purchaser.flatMap((item) =>
              (item.purchaserNotes || []).map((note) => [
                item.LotNumber,
                item.NoteType || "None",
                item.PurchaserName,
                note.Nbales,
                note.Nquantity,
                note.Nrate,
                note.Namount,
                note.NGST,
                note.NGST_Percent,
              ])
            );

            promises.push(
              new Promise((resolve, reject) => {
                db.query(purchaserNoteQuery, [purchaserNoteValues], (err) => {
                  if (err) return reject(err);
                  resolve();
                });
              })
            );
          }

          // Insert Purchaser Payments if available
          if (purchaser.some((item) => item.paymentts?.length > 0)) {
            const purchaserPaymentsQuery = `
              INSERT INTO PurchaserPayments (
                LotNumber, SubPayments, PaymentsDate, PurchaserName, Amount
              ) VALUES ?`;

            const purchaserPaymentsValues = purchaser.flatMap((item) =>
              (item.paymentts || []).map((paymentt) => [
                item.LotNumber,
                paymentt.amount,
                paymentt.date,
                item.PurchaserName,
                item.Amount,
              ])
            );

            promises.push(
              new Promise((resolve, reject) => {
                db.query(purchaserPaymentsQuery, [purchaserPaymentsValues], (err) => {
                  if (err) return reject(err);
                  resolve();
                });
              })
            );
          }

          return Promise.all(promises);
        };

        const handleSellerData = () => {
          if (sellers && sellers.length > 0) {
            return new Promise((resolve, reject) => {
              const sellerQuery = `
                INSERT INTO Seller (
                  Company, BillNumber, adminId, SellerName, SellerAddress, GSTNumber, NumberOfBales, Quantity, Rate, Amount, GST_Percent, GST, NoteType, 
                  LotNumber, Hamali, Payment_status, ShopExpenses, LorryFright, OtherExpenses, SellDate
                ) VALUES ?`;

              const sellerValues = sellers.map((item) => [
                item.Company || "Not Selected",
                item.BillNumber,
                adminId,
                item.SellerName,
                item.SellerAddress,
                item.GSTNumber,
                item.NumberOfBales,
                item.Quantity,
                item.Rate,
                item.Amount,
                item.GST_Percent,
                item.GST,
                item.NoteType,
                // lotNumber,
                item.LotNumber || lotNumber,
                item.Hamali,
                item.Payment_status,
                item.ShopExpenses,
                item.LorryFright,
                item.OtherExpenses,
                // item.SellDate,
                item.SellDate && !isNaN(new Date(item.SellDate))
                  ? new Date(item.SellDate).toISOString().split('T')[0]
                  : null
              ]);

              db.query(sellerQuery, [sellerValues], (err) => {
                if (err) return reject(err);

                const sellerExtrasPromises = [];

                // Insert Seller Notes if available
                if (sellers.some((item) => item.sellerNotes?.length > 0)) {
                  const sellerNoteQuery = `
                    INSERT INTO SellerNote (
                      LotNumber, NoteType, SellerName, Nbales, Nquantity, Nrate, Namount, NGST, NGST_Percent
                    ) VALUES ?`;

                  const sellerNoteValues = sellers.flatMap((item) =>
                    (item.sellerNotes || []).map((note) => [
                      lotNumber,
                      item.NoteType || "None",
                      item.SellerName,
                      note.Nbales,
                      note.Nquantity,
                      note.Nrate,
                      note.Namount,
                      note.NGST,
                      note.NGST_Percent,
                    ])
                  );

                  sellerExtrasPromises.push(
                    new Promise((resolve, reject) => {
                      db.query(sellerNoteQuery, [sellerNoteValues], (err) => {
                        if (err) return reject(err);
                        resolve();
                      });
                    })
                  );
                }

                // Insert Seller Payments if available
                if (sellers.some((item) => item.payments?.length > 0)) {
                  const sellerPaymentsQuery = `
                    INSERT INTO SellerPayments (
                      LotNumber, SubPayments, PaymentDate, SellerName, Amount
                    ) VALUES ?`;

                  const sellerPaymentsValues = sellers.flatMap((item) =>
                    (item.payments || []).map((payment) => [
                      lotNumber,
                      payment.amount,
                      payment.date,
                      item.SellerName,
                      item.Amount,
                    ])
                  );

                  sellerExtrasPromises.push(
                    new Promise((resolve, reject) => {
                      db.query(sellerPaymentsQuery, [sellerPaymentsValues], (err) => {
                        if (err) return reject(err);
                        resolve();
                      });
                    })
                  );
                }

                Promise.all(sellerExtrasPromises)
                  .then(resolve)
                  .catch(reject);
              });
            });
          }

          return Promise.resolve();
        };

        handlePurchaserExtras()
          .then(handleSellerData)
          .then(() => {
            db.commit((err) => {
              if (err) {
                return db.rollback(() => {
                  res.status(500).json({ error: "Error committing transaction", details: err });
                });
              }
              res.status(200).json({ message: "Data submitted successfully!" });
            });
          })
          .catch((err) => {
            db.rollback(() => {
              console.error("Error during transaction:", err);
              res.status(500).json({ error: "Error during transaction", details: err });
            });
          });
      });
    });
  });
});

const formatDate = (date) => {
  if (!date) return null;
  const jsDate = new Date(date);
  const year = jsDate.getFullYear();
  const month = String(jsDate.getMonth() + 1).padStart(2, "0");
  const day = String(jsDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

app.post("/api/insert-seller-data/:LotNumber", (req, res) => {
  const { sellers } = req.body;
  const lotNumber = req.params.LotNumber;

  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ error: "Error starting transaction", details: err });
    }

    // Check if seller data exists
    const checkSellerQuery = `SELECT COUNT(*) AS count FROM Seller WHERE LotNumber = ?`;
    db.query(checkSellerQuery, [lotNumber], (err, results) => {
      if (err) {
        return db.rollback(() => {
          res.status(500).json({ error: "Error checking seller data", details: err });
        });
      }

      const sellerExists = results[0].count > 0;
      if (sellerExists) {
        return db.rollback(() => {
          res.status(400).json({ error: "Seller data already exists for this LotNumber" });
        });
      }

      // Insert Seller data
      const insertSellerQuery = `
        INSERT INTO Seller (
          LotNumber, BillNumber, SellerName, SellerAddress, GSTNumber, NumberOfBales, Quantity,
          Rate, Amount, GST_Percent, GST, NoteType, Hamali, Payment_status,
          ShopExpenses, LorryFright, OtherExpenses, SellDate
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const sellerPromises = sellers.map((item) => {
        const formattedSellDate = formatDate(item.SellDate);
        return new Promise((resolve, reject) => {
          db.query(
            insertSellerQuery,
            [
              item.LotNumber, item.BillNumber, item.SellerName, item.SellerAddress, item.GSTNumber,
              item.NumberOfBales, item.Quantity, item.Rate, item.Amount, item.GST_Percent,
              item.GST, item.NoteType, item.Hamali, item.Payment_status, item.ShopExpenses,
              item.LorryFright, item.OtherExpenses, formattedSellDate
            ],
            (err) => {
              if (err) return reject(err);
              resolve();
            }
          );
        });
      });

      // Insert Seller Notes
      const insertSellerNotesQuery = `
        INSERT INTO SellerNote (
          LotNumber, NoteType, SellerName, Nbales, Nquantity, Nrate, Namount, NGST, NGST_Percent
        ) VALUES ?
      `;

      const sellerNoteValues = sellers.flatMap((item) =>
        (item.sellerNotes || []).map((note) => [
          item.LotNumber, item.NoteType || "None", item.SellerName,
          note.Nbales, note.Nquantity, note.Nrate, note.Namount, note.NGST, note.NGST_Percent
        ])
      );

      const insertSellerNotesPromise = sellerNoteValues.length > 0
        ? new Promise((resolve, reject) => {
            db.query(insertSellerNotesQuery, [sellerNoteValues], (err) => {
              if (err) return reject(err);
              resolve();
            });
          })
        : Promise.resolve();

      // Insert Seller Payments
      const insertSellerPaymentsQuery = `
        INSERT INTO SellerPayments (
          LotNumber, SubPayments, PaymentDate, SellerName, Amount
        ) VALUES ?
      `;

      const sellerPaymentsValues = sellers.flatMap((item) =>
        (item.payments || []).map((payment) => [
          item.LotNumber, payment.amount, payment.date, item.SellerName, item.Amount
        ])
      );

      const insertSellerPaymentsPromise = sellerPaymentsValues.length > 0
        ? new Promise((resolve, reject) => {
            db.query(insertSellerPaymentsQuery, [sellerPaymentsValues], (err) => {
              if (err) return reject(err);
              resolve();
            });
          })
        : Promise.resolve();

      Promise.all(sellerPromises)
        .then(() => Promise.all([insertSellerNotesPromise, insertSellerPaymentsPromise]))
        .then(() => {
          db.commit((err) => {
            if (err) {
              return db.rollback(() => {
                res.status(500).json({ error: "Error committing transaction", details: err });
              });
            }
            res.status(201).json({ message: "Seller data inserted successfully!" });
          });
        })
        .catch((err) => {
          db.rollback(() => {
            res.status(500).json({ error: "Error during transaction", details: err });
          });
        });
    });
  });
});



app.put("/api/update-data/:LotNumber", (req, res) => {
  
  const { purchaser, sellers } = req.body;
  console.log("Update received:", req.body);


  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ error: "Error starting database transaction", details: err });
    }

    const lotNumber = purchaser[0].LotNumber;

    // Update Purchaser data
    const updatePurchaserQuery = `
      UPDATE Purchaser 
      SET 
        BillNumber = ?, PurchaserName = ?, PurchaserAddress = ?, GSTNumber = ?, NumberOfBales = ?, Quantity = ?, 
        Rate = ?, Amount = ?, GST_Percent = ?, GST = ?, NoteType = ?, Hamali = ?, Payment_status = ?, 
        ShopExpenses = ?, Cartage = ?, OtherExpenses = ?, Category = ?, PurchaseDate = ?
      WHERE LotNumber = ?
    `;

    const purchaserUpdatePromises = purchaser.map((item) => {
      const formattedPurchaseDate = formatDate(item.PurchaseDate);
      return new Promise((resolve, reject) => {
        db.query(
          updatePurchaserQuery,
          [
            item.BillNumber,
            item.PurchaserName,
            item.PurchaserAddress,
            item.GSTNumber,
            item.NumberOfBales,
            item.Quantity,
            item.Rate,
            item.Amount,
            item.GST_Percent,
            item.GST,
            item.NoteType,
            item.Hamali,
            item.Payment_status,
            item.ShopExpenses,
            item.Cartage,
            item.OtherExpenses,
            item.Category,
            formattedPurchaseDate,
            item.LotNumber,
          ],
          (err) => {
            if (err) return reject(err);
            resolve();
          }
        );
      });
    });

    const updatePurchaserExtras = () => {
      const promises = [];

      // Update Purchaser Payments
      if (purchaser.some((item) => item.paymentts?.length > 0)) {
        const deletePurchaserPaymentsQuery = `DELETE FROM PurchaserPayments WHERE LotNumber = ?`;
        const insertPurchaserPaymentsQuery = `
          INSERT INTO PurchaserPayments (
            LotNumber, SubPayments, PaymentsDate, PurchaserName, Amount
          ) VALUES ?
        `;

        const purchaserPaymentsValues = purchaser.flatMap((item) =>
          (item.paymentts || []).map((paymentt) => [
            item.LotNumber,
            paymentt.amount,
            paymentt.date,
            item.PurchaserName,
            item.Amount,
          ])
        );

        promises.push(
          new Promise((resolve, reject) => {
            db.query(deletePurchaserPaymentsQuery, [lotNumber], (err) => {
              if (err) return reject(err);
              db.query(insertPurchaserPaymentsQuery, [purchaserPaymentsValues], (err) => {
                if (err) return reject(err);
                resolve();
              });
            });
          })
        );
      }

      // Update Purchaser Notes
      if (purchaser.some((item) => item.purchaserNotes?.length > 0)) {
        const deletePurchaserNotesQuery = `DELETE FROM PurchaserNote WHERE LotNumber = ?`;
        const insertPurchaserNotesQuery = `
          INSERT INTO PurchaserNote (
            LotNumber, NoteType, PurchaserName, Nbales, Nquantity, Nrate, Namount, NGST, NGST_Percent
          ) VALUES ?
        `;

        const purchaserNoteValues = purchaser.flatMap((item) =>
          (item.purchaserNotes || []).map((note) => [
            item.LotNumber,
            item.NoteType || "None",
            item.PurchaserName,
            note.Nbales,
            note.Nquantity,
            note.Nrate,
            note.Namount,
            note.NGST,
            note.NGST_Percent,
          ])
        );

        promises.push(
          new Promise((resolve, reject) => {
            db.query(deletePurchaserNotesQuery, [lotNumber], (err) => {
              if (err) return reject(err);
              db.query(insertPurchaserNotesQuery, [purchaserNoteValues], (err) => {
                if (err) return reject(err);
                resolve();
              });
            });
          })
        );
      }

      

      return Promise.all(promises);
    };

    const updateSellerData = () => {
      if (sellers && sellers.length > 0) {
        const updateSellerQuery = `
          UPDATE Seller 
          SET 
            BillNumber = ?, SellerName = ?, SellerAddress = ?, GSTNumber = ?, NumberOfBales = ?, Quantity = ?, 
            Rate = ?, Amount = ?, GST_Percent = ?, GST = ?, NoteType = ?, Hamali = ?, Payment_status = ?, 
            ShopExpenses = ?, LorryFright = ?, OtherExpenses = ?, SellDate = ?
          WHERE LotNumber = ?
        `;

        const sellerUpdatePromises = sellers.map((item) => {
          const formattedSellDate = formatDate(item.SellDate);
          return new Promise((resolve, reject) => {
            db.query(
              updateSellerQuery,
              [
                item.BillNumber,
                item.SellerName,
                item.SellerAddress,
                item.GSTNumber,
                item.NumberOfBales,
                item.Quantity,
                item.Rate,
                item.Amount,
                item.GST_Percent,
                item.GST,
                item.NoteType,
                item.Hamali,
                item.Payment_status,
                item.ShopExpenses,
                item.LorryFright,
                item.OtherExpenses,
                formattedSellDate,
                item.LotNumber,
              ],
              (err) => {
                if (err) return reject(err);
                resolve();
              }
            );
          });
        });

        const updateSellerExtras = () => {
          const promises = [];

          // Update Seller Notes
          if (sellers.some((item) => item.sellerNotes?.length > 0)) {
            const deleteSellerNotesQuery = `DELETE FROM SellerNote WHERE LotNumber = ?`;
            const insertSellerNotesQuery = `
              INSERT INTO SellerNote (
                LotNumber, NoteType, SellerName, Nbales, Nquantity, Nrate, Namount, NGST, NGST_Percent
              ) VALUES ?
            `;

            const sellerNoteValues = sellers.flatMap((item) =>
              (item.sellerNotes || []).map((note) => [
                item.LotNumber,
                item.NoteType || "None",
                item.SellerName,
                note.Nbales,
                note.Nquantity,
                note.Nrate,
                note.Namount,
                note.NGST,
                note.NGST_Percent,
              ])
            );

            promises.push(
              new Promise((resolve, reject) => {
                db.query(deleteSellerNotesQuery, [lotNumber], (err) => {
                  if (err) return reject(err);
                  db.query(insertSellerNotesQuery, [sellerNoteValues], (err) => {
                    if (err) return reject(err);
                    resolve();
                  });
                });
              })
            );
          }

          // Update Seller Payments
          if (sellers.some((item) => item.payments?.length > 0)) {
            const deleteSellerPaymentsQuery = `DELETE FROM SellerPayments WHERE LotNumber = ?`;
            const insertSellerPaymentsQuery = `
              INSERT INTO SellerPayments (
                LotNumber, SubPayments, PaymentDate, SellerName, Amount
              ) VALUES ?
            `;

            const sellerPaymentsValues = sellers.flatMap((item) =>
              (item.payments || []).map((payment) => [
                item.LotNumber,
                payment.amount,
                payment.date,
                item.SellerName,
                item.Amount,
              ])
            );

            promises.push(
              new Promise((resolve, reject) => {
                db.query(deleteSellerPaymentsQuery, [lotNumber], (err) => {
                  if (err) return reject(err);
                  db.query(insertSellerPaymentsQuery, [sellerPaymentsValues], (err) => {
                    if (err) return reject(err);
                    resolve();
                  });
                });
              })
            );
          }

          return Promise.all(promises);
        };

        return Promise.all(sellerUpdatePromises).then(updateSellerExtras);
      }

      return Promise.resolve();
    };

    Promise.all(purchaserUpdatePromises)
      .then(updatePurchaserExtras)
      .then(updateSellerData)
      .then(() => {
        db.commit((err) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json({ error: "Error committing transaction", details: err });
            });
          }
          res.status(200).json({ message: "Data updated successfully!" });
        });
      })
      .catch((err) => {
        db.rollback(() => {
          res.status(500).json({ error: "Error during transaction", details: err });
        });
      });
  });
});



app.get("/api/purchasers", async (req, res) => {
  const { name } = req.query;
  try {
    const [results] = await db.promise().query(
      "SELECT master_ID, Name, Address, GST_Number FROM masterdata WHERE Name LIKE ?",
      [`%${name}%`]
    );
    res.json(results);
  } catch (err) {
    res.status(500).json({ 
      error: "Database query failed", 
      details: err.message 
    });
  }
});








//-------------
// app.post("/api/submit-data", (req, res) => {
//   const { purchaser, sellers } = req.body;
//   console.log("Request received:", req.body)

//   if (!purchaser || purchaser.length === 0 || !sellers || sellers.length === 0) {
//     return res.status(400).json({ error: "Purchaser and Sellers data are required." });
//   }

//   // Insert Lots (assuming LotNumber is the same for all entries)
//   const lotNumber = purchaser[0].LotNumber;
//   const lotQuery = `INSERT IGNORE INTO Lots (LotNumber) VALUES (?)`;

//   db.query(lotQuery, [lotNumber], (err, result) => {
//     if (err) {
//       console.error("Error inserting LotNumber:", err);
//       return res.status(500).json({ error: "Error inserting LotNumber", details: err });
//     }

//     // Insert Purchaser data
//     const purchaserQuery = `
//       INSERT INTO Purchaser (
//         PurchaserName, NumberOfBales, Quantity, Rate, Amount, GST_Percent, GST, 
//         LotNumber, Hamali, Payment_status, ShopExpenses, Cartage, OtherExpenses, 
//         Category, PaymentDate, PurchaseDate
//       ) VALUES ?`;

//     const purchaserValues = purchaser.map((item) => [
//       item.PurchaserName,
//       item.NumberOfBales,
//       item.Quantity,
//       item.Rate,
//       item.Amount,
//       item.GST_Percent,
//       item.GST,
//       item.LotNumber,
//       item.Hamali,
//       item.Payment_status,
//       item.ShopExpenses,
//       item.Cartage,
//       item.OtherExpenses,
//       item.Category,
//       item.PaymentDate || null,
//       item.PurchaseDate || null,
//     ]);

//     db.query(purchaserQuery, [purchaserValues], (err, result) => {
//       if (err) {
//         console.error("Error inserting Purchaser data:", err);
//         return res.status(500).json({ error: "Error inserting Purchaser data", details: err });
//       }

//       // Insert Seller data
//       const sellerQuery = `
//         INSERT INTO Seller (
//           SellerName, NumberOfBales, Quantity, Rate, Amount, GST_Percent, GST, 
//           LotNumber, Hamali, Payment_status, ShopExpenses, LorryFright, OtherExpenses, 
//           PaymentReceived, SellDate
//         ) VALUES ?`;

//       const sellerValues = sellers.map((seller) => [
//         seller.SellerName,
//         seller.NumberOfBales,
//         seller.Quantity,
//         seller.Rate,
//         seller.Amount,
//         seller.GST_Percent,
//         seller.GST,
//         lotNumber,
//         seller.Hamali,
//         seller.Payment_status,
//         seller.ShopExpenses,
//         seller.LorryFright,
//         seller.OtherExpenses,
//         seller.paymentReceived || 0,
//         seller.SellDate || null,
//       ]);

//       db.query(sellerQuery, [sellerValues], (err, result) => {
//         if (err) {
//           console.error("Error inserting Seller data:", err);
//           return res.status(500).json({ error: "Error inserting Seller data", details: err });
//         }

//         // Insert SellerPayments data
//         const sellerPaymentsQuery = `
//           INSERT INTO SellerPayments (
//             LotNumber, SubPayments, PaymentDate
//           ) VALUES ?`;

//         const sellerPaymentsValues = sellers.flatMap((seller) =>
//           seller.payments && Array.isArray(seller.payments) ? seller.payments.map((payment) => [
//             lotNumber,
//             payment.amount || null,
//             payment.date || null,
//           ]) : []
//         );

//         if (sellerPaymentsValues.length > 0) {
//           db.query(sellerPaymentsQuery, [sellerPaymentsValues], (err, result) => {
//             if (err) {
//               console.error("Error inserting SellerPayments data:", err);
//               return res.status(500).json({ error: "Error inserting SellerPayments data", details: err });
//             }

//             res.status(200).json({ message: "Data successfully added to all tables" });
//           });
//         } else {
//           res.status(200).json({ message: "Data successfully added to Lots, Purchaser, and Seller tables" });
//         }
//       });
//     });
//   });
// });






// Utility to calculate days between two dates
const calculateDaysDifference = (sellDate, paymentDate) => {
  const sellDateObj = new Date(sellDate);
  const paymentDateObj = new Date(paymentDate);
  const diffTime = paymentDateObj - sellDateObj;
  return Math.ceil(diffTime / (1000 * 3600 * 24)); // Convert ms to days
};



// Fetch overall inventory data

// app.get('/api/receiving-payments', (req, res) => {
//   const query = `
//     SELECT 
//       SUM(BalanceAfterPayment) AS TotalReceivablePayments
//     FROM sellerpayments;
//   `;

//   db.query(query, (err, results) => {
//     if (err) {
//       console.error('Error fetching pending payments:', err);
//       return res.status(500).json({ error: 'Database query failed' });
//     }

//     res.status(200).json({
//       totalReceivablePayments: results[0]?.TotalReceivablePayments || 0,
//     });
//   });
// });

// app.get('/api/pending-payments', (req, res) => {
//   const query = `
//     SELECT 
//       SUM(BalanceAfterPayment) AS TotalPendingPayments
//     FROM purchaserpayments;
//   `;

//   db.query(query, (err, results) => {
//     if (err) {
//       console.error('Error fetching pending payments:', err);
//       return res.status(500).json({ error: 'Database query failed' });
//     }

//     res.status(200).json({
//       totalPendingPayments: results[0]?.TotalPendingPayments || 0,
//     });
//   });
// });

app.get('/api/receiving-payments', (req, res) => {
  const adminId = req.query.adminId || req.query.id;

  if (!adminId) {
    return res.status(400).json({ error: 'Missing adminId in query' });
  }

  const query = `
    SELECT 
      SUM(BalanceAfterPayment) AS TotalReceivablePayments
    FROM sellerpayments
    WHERE adminId = ?;
  `;

  db.query(query, [adminId], (err, results) => {
    if (err) {
      console.error('Error fetching receivable payments:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }

    res.status(200).json({
      totalReceivablePayments: results[0]?.TotalReceivablePayments || 0,
    });
  });
});

app.get('/api/pending-payments', (req, res) => {
  const adminId = req.query.adminId || req.query.id;

  if (!adminId) {
    return res.status(400).json({ error: 'Missing adminId in query' });
  }

  const query = `
    SELECT 
      SUM(BalanceAfterPayment) AS TotalPendingPayments
    FROM purchaserpayments
    WHERE adminId = ?;
  `;

  db.query(query, [adminId], (err, results) => {
    if (err) {
      console.error('Error fetching pending payments:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }

    res.status(200).json({
      totalPendingPayments: results[0]?.TotalPendingPayments || 0,
    });
  });
});


// Fetch overall inventory data

// app.get('/api/inventory-data', (req, res) => {
//   const query = `
//     SELECT 
//       SUM(BalanceBales) AS TotalBalanceBales,
//       SUM(BalanceQuantity) AS TotalBalanceQuantity
//     FROM Inventory;
//   `;

//   const detailedQuery = `
//     SELECT 
//       LotNumber,
//       BalanceBales,
//       BalanceQuantity
//     FROM Inventory;
//   `;

//   db.query(query, (err, overallResults) => {
//     if (err) {
//       console.error('Error fetching overall inventory data:', err);
//       return res.status(500).json({ error: 'Database query failed' });
//     }

//     db.query(detailedQuery, (err, detailedResults) => {
//       if (err) {
//         console.error('Error fetching detailed inventory data:', err);
//         return res.status(500).json({ error: 'Database query failed' });
//       }

//       res.status(200).json({
//         overallInventory: overallResults[0],  // Aggregated totals
//         detailedInventory: detailedResults   // Detailed data
//       });
//     });
//   });
// });
app.get('/api/inventory-data', (req, res) => {
  const adminId = req.query.adminId || req.query.id;

  if (!adminId) {
    return res.status(400).json({ error: 'adminId is required' });
  }

  const query = `
    SELECT 
      SUM(BalanceBales) AS TotalBalanceBales,
      SUM(BalanceQuantity) AS TotalBalanceQuantity
    FROM Inventory
    WHERE adminId = ?;
  `;

  const detailedQuery = `
    SELECT 
      LotNumber,
      BalanceBales,
      BalanceQuantity
    FROM Inventory
    WHERE adminId = ?;
  `;

  db.query(query, [adminId], (err, overallResults) => {
    if (err) {
      console.error('Error fetching overall inventory data:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }

    db.query(detailedQuery, [adminId], (err, detailedResults) => {
      if (err) {
        console.error('Error fetching detailed inventory data:', err);
        return res.status(500).json({ error: 'Database query failed' });
      }

      res.status(200).json({
        overallInventory: overallResults[0],
        detailedInventory: detailedResults
      });
    });
  });
});



// Fetch specific inventory data for a LotNumber
// app.get('/api/inventory-data/:LotNumber', (req, res) => {
//   const { LotNumber } = req.params;

//   const query = `
//     SELECT 
//       LotNumber,
//       BalanceBales,
//       BalanceQuantity
//     FROM Inventory
//     WHERE LotNumber = ?;
//   `;

//   db.query(query, [LotNumber], (err, results) => {
//     if (err) {
//       console.error('Error fetching specific inventory data:', err);
//       return res.status(500).json({ error: 'Database query failed' });
//     }

//     if (results.length === 0) {
//       return res.status(404).json({
//         message: `No inventory data found for Lot Number: ${LotNumber}`,
//       });
//     }

//     res.status(200).json({
//       inventory: results,
//     });
//   });
// });
app.get('/api/inventory-data/:LotNumber', (req, res) => {
  const { LotNumber } = req.params;
  const adminId = req.query.adminId || req.query.id;

  if (!adminId) {
    return res.status(400).json({ error: 'adminId is required' });
  }

  const query = `
    SELECT 
      LotNumber,
      BalanceBales,
      BalanceQuantity
    FROM Inventory
    WHERE LotNumber = ? AND adminId = ?;
  `;

  db.query(query, [LotNumber, adminId], (err, results) => {
    if (err) {
      console.error('Error fetching specific inventory data:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: `No inventory data found for Lot Number: ${LotNumber} and adminId: ${adminId}`,
      });
    }

    res.status(200).json({
      inventory: results,
    });
  });
});





// Route to fetch monthly report data
// Route to fetch monthly report data
// app.get('/api/reports', async (req, res) => {
//   const { month } = req.query; // 'YYYY-MM' format

//   try {
//       // Query Purchases Data
//       const purchasesQuery = `
//           SELECT SUM(Amount) AS PurchasesTotalAmount, SUM(GST) AS TotalGSTCollected
//           FROM Purchaser
//           WHERE DATE_FORMAT(PaymentDate, '%Y-%m') = ?
//       `;
//       const purchasesData = await queryDatabase(purchasesQuery, [month]);

//       // Query Sales Data
//       const salesQuery = `
//           SELECT SUM(Amount) AS SalesTotalAmount, SUM(GST) AS TotalGSTPaid
//           FROM Seller
//           WHERE DATE_FORMAT(PaymentReceived, '%Y-%m') = ?
//       `;
//       const salesData = await queryDatabase(salesQuery, [month]);

//       // Query Expenses Data
//       const expensesQuery = `
//           SELECT SUM(Hamali) AS Hamali, SUM(ShopExpenses) AS ShopExpenses, 
//                  SUM(Cartage) AS Cartage, SUM(OtherExpenses) AS OtherExpenses
//           FROM Purchaser
//           WHERE DATE_FORMAT(PaymentDate, '%Y-%m') = ?
//       `;
//       const expensesData = await queryDatabase(expensesQuery, [month]);

//       // Calculate Net Profit/Loss
//       const netProfitQuery = `
//           SELECT SUM(Amount) AS NetProfitLoss
//           FROM Purchaser
//           WHERE DATE_FORMAT(PaymentDate, '%Y-%m') = ?
//           UNION ALL
//           SELECT SUM(Amount) * -1 AS NetProfitLoss
//           FROM Seller
//           WHERE DATE_FORMAT(PaymentReceived, '%Y-%m') = ?
//       `;
//       const netProfitData = await queryDatabase(netProfitQuery, [month, month]);

//       // Construct the final report data
//       const report = {
//           PurchasesTotalAmount: purchasesData[0].PurchasesTotalAmount || 0,
//           SalesTotalAmount: salesData[0].SalesTotalAmount || 0,
//           NetProfitLoss: netProfitData.reduce((total, row) => total + (row.NetProfitLoss || 0), 0),
//           TotalGSTCollected: purchasesData[0].TotalGSTCollected || 0,
//           TotalGSTPaid: salesData[0].TotalGSTPaid || 0,
//           TotalExpenses: expensesData[0].Hamali + expensesData[0].ShopExpenses + expensesData[0].Cartage + expensesData[0].OtherExpenses,
//           Hamali: expensesData[0].Hamali || 0,
//           ShopExpenses: expensesData[0].ShopExpenses || 0,
//           Cartage: expensesData[0].Cartage || 0,
//           OtherExpenses: expensesData[0].OtherExpenses || 0
//       };

//       // Send the response
//       res.json(report);
//   } catch (error) {
//       console.error('Error fetching report data:', error);
//       res.status(500).json({ error: 'Internal server error' });
//   }
//   console.log('Fetching report for month:', month);

// });

app.get('/api/reports', async (req, res) => {
  const { month } = req.query; // 'YYYY-MM' format

  try {
    // Query Purchases Data (using PaymentDate in Purchaser table)
    const purchasesQuery = `
      SELECT 
        SUM(Amount) AS PurchasesTotalAmount, 
        SUM(GST) AS TotalGSTCollected 
      FROM Purchaser 
      WHERE DATE_FORMAT(PurchaseDate, '%Y-%m') = ?`;
    const purchasesData = await queryDatabase(purchasesQuery, [month]);

    // Query Sales Data (using SellDate in Seller table)
    const salesQuery = `
      SELECT 
        SUM(Amount) AS SalesTotalAmount, 
        SUM(GST) AS TotalGSTPaid 
      FROM Seller 
      WHERE DATE_FORMAT(SellDate, '%Y-%m') = ?`;
    const salesData = await queryDatabase(salesQuery, [month]);

    // Query Expenses Data (using PaymentDate in Purchaser table)
    const expensesQuery = `
  SELECT 
    SUM(Hamali) AS Hamali,
    SUM(ShopExpenses) AS ShopExpenses,
    SUM(Cartage) AS Cartage,
    SUM(LorryFright) AS LorryFright,
    SUM(OtherExpenses) AS OtherExpenses
  FROM (
    SELECT 
      Hamali, 
      ShopExpenses, 
      Cartage, 
      0 AS LorryFright, -- Placeholder for Purchaser, as it doesn't have LorryFright
      OtherExpenses
    FROM Purchaser
    WHERE DATE_FORMAT(PurchaseDate, '%Y-%m') = ?
    UNION ALL
    SELECT 
      Hamali, 
      ShopExpenses, 
      0 AS Cartage, -- Placeholder for Seller, as it doesn't have Cartage
      LorryFright,
      OtherExpenses
    FROM Seller
    WHERE DATE_FORMAT(SellDate, '%Y-%m') = ?
  ) AS CombinedExpenses;
`;

    const expensesData = await queryDatabase(expensesQuery, [month, month]);


    // Calculate Net Profit/Loss (using PaymentDate in Purchaser and SellDate in Seller tables)
    // const netProfitQuery = `
    //   SELECT SUM(Amount) AS NetProfitLoss 
    //   FROM Purchaser 
    //   WHERE DATE_FORMAT(PurchaseDate, '%Y-%m') = ?
    //   UNION ALL
    //   SELECT SUM(Amount) * -1 AS NetProfitLoss 
    //   FROM Seller 
    //   WHERE DATE_FORMAT(SellDate, '%Y-%m') = ?`;
    // const netProfitData = await queryDatabase(netProfitQuery, [month, month]);
    const netProfitQuery = `
    SELECT SUM(Amount) * -1 AS NetProfitLoss 
    FROM Purchaser 
    WHERE DATE_FORMAT(PurchaseDate, '%Y-%m') = ?
    UNION ALL
    SELECT SUM(Amount) AS NetProfitLoss 
    FROM Seller 
    WHERE DATE_FORMAT(SellDate, '%Y-%m') = ?`;
    
    const netProfitData = await queryDatabase(netProfitQuery, [month, month]);


    // Construct the final report data
    const report = {
      PurchasesTotalAmount: purchasesData[0].PurchasesTotalAmount || 0,
      SalesTotalAmount: salesData[0].SalesTotalAmount || 0,
      NetProfitLoss: netProfitData.reduce((total, row) => total + (row.NetProfitLoss || 0), 0),
      TotalGSTCollected: purchasesData[0].TotalGSTCollected || 0,
      TotalGSTPaid: salesData[0].TotalGSTPaid || 0,
      TotalExpenses: expensesData[0].Hamali + expensesData[0].ShopExpenses + expensesData[0].Cartage + expensesData[0].LorryFright + expensesData[0].OtherExpenses,
      Hamali: expensesData[0].Hamali || 0,
      ShopExpenses: expensesData[0].ShopExpenses || 0,
      Cartage: expensesData[0].Cartage || 0,
      LorryFright: expensesData[0].LorryFright || 0,
      OtherExpenses: expensesData[0].OtherExpenses || 0,
    };

    // Send the response
    res.json(report);

  } catch (error) {
    console.error('Error fetching report data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// app.get('/api/net-profit', (req, res) => {
//   const querrry = `
//     SELECT 
//       SUM(
//         (s.Amount - p.Amount) - 
//         (p.Hamali + p.ShopExpenses + p.OtherExpenses + p.Cartage + 
//          s.Hamali + s.ShopExpenses + s.OtherExpenses + s.LorryFright)
//       ) AS TotalNetPL
//     FROM 
//       purchaser p
//     JOIN 
//       seller s;
//   `;

//   const query = `
//     SELECT 
//       ((SUM(s.Amount) - SUM(p.Amount)) - 
//       (SUM(p.Hamali + p.ShopExpenses + p.OtherExpenses + p.Cartage) + 
//         SUM(s.Hamali + s.ShopExpenses + s.OtherExpenses + s.LorryFright))
//       ) AS TotalNetPL
//     FROM 
//       purchaser p
//     JOIN 
//       seller s;
//   `;
//   db.query(query, (err, results) => {
//     if (err) {
//       console.error('Error fetching net profit data:', err);
//       return res.status(500).json({ error: 'Database query failed' });
//     }

//     const netProfitLoss = results[0].TotalNetPL || 0;

//     res.status(200).json({
//       netProfitLoss,
//     });
//   });
// });
app.get('/api/net-profit', (req, res) => {
  const adminId = req.query.adminId || req.query.id;

  if (!adminId) {
    return res.status(400).json({ error: 'adminId is required in the query parameters.' });
  }

  const query = `
    SELECT 
      (
        (SUM(s.Amount) - SUM(p.Amount)) -
        (
          SUM(p.Hamali + p.ShopExpenses + p.OtherExpenses + p.Cartage) +
          SUM(s.Hamali + s.ShopExpenses + s.OtherExpenses + s.LorryFright)
        )
      ) AS TotalNetPL
    FROM 
      purchaser p
    JOIN 
      seller s ON p.LotNumber = s.LotNumber
    WHERE 
      p.adminId = ? AND s.adminId = ?;
  `;

  db.query(query, [adminId, adminId], (err, results) => {
    if (err) {
      console.error('Error fetching net profit data:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }

    const netProfitLoss = results[0]?.TotalNetPL || 0;

    res.status(200).json({
      netProfitLoss,
    });
  });
});




const router = express.Router();

// POST /api/register
// app.post('/api/register', async (req, res) => {
//   const {
//     name,
//     username,
//     userEmail,
//     companyName,
//     companyEmail,
//     password,
//   } = req.body;

//   // Input validation
//   if (!name || !username || !userEmail || !companyName || !companyEmail || !password) {
//     return res.status(400).json({ message: 'All fields are required' });
//   }

//   try {
//     // Check if username or company email already exists
//     const existingUserQuery = `
//       SELECT * FROM Users WHERE UserName = ? OR userEmail = ?
//     `;
//     const existingCompanyQuery = `
//       SELECT * FROM Companies WHERE CompanyMail = ?
//     `;
//     const [existingUser] = await pool.query(existingUserQuery, [username, userEmail]);
//     const [existingCompany] = await pool.query(existingCompanyQuery, [companyEmail]);

//     if (existingUser.length > 0) {
//       return res.status(400).json({ message: 'Username or User Email already exists' });
//     }

//     if (existingCompany.length > 0) {
//       return res.status(400).json({ message: 'Company Email already exists' });
//     }

//     // Hash the password
//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     // Create company and admin user in a single transaction
//     const connection = await pool.getConnection();
//     try {
//       await connection.beginTransaction();

//       // Insert company data
//       const insertCompanyQuery = `
//         INSERT INTO Companies (CompanyName, CompanyMail) VALUES (?, ?)
//       `;
//       const [companyResult] = await connection.query(insertCompanyQuery, [
//         companyName,
//         companyEmail,
//       ]);
//       const companyId = companyResult.insertId;

//       // Insert admin user data
//       const insertUserQuery = `
//         INSERT INTO Users (UserName, userEmail, Password, Role, CompanyID)
//         VALUES (?, ?, ?, ?, ?)
//       `;
//       await connection.query(insertUserQuery, [
//         username,
//         userEmail,
//         hashedPassword,
//         role,
//         companyId,
//       ]);

//       await connection.commit();
//       res.status(201).json({ message: 'Registration successful' });
//     } catch (transactionError) {
//       await connection.rollback();
//       res.status(500).json({ message: 'Error during registration', error: transactionError.message });
//     } finally {
//       connection.release();
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'An error occurred', error: error.message });
//   }
// });

app.post('api/register', async (req, res) => {
  const { name, username, userEmail, companyName, companyMail, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).send('Passwords do not match');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const userQuery = 'INSERT INTO users (name, username, userEmail, password, role) VALUES (?, ?, ?, ?, ?)';
  const companyQuery = 'INSERT INTO companies (companyName, companyMail, adminID) VALUES (?, ?, ?)';

  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (results.length > 0) {
      return res.status(400).send('Username already exists');
    }

    db.query('SELECT * FROM companies WHERE companyMail = ?', [companyMail], async (err, results) => {
      if (results.length > 0) {
        return res.status(400).send('Company Mail already exists');
      }

      db.query(userQuery, [name, username, userEmail, hashedPassword, 'Admin'], (err, results) => {
        if (err) throw err;

        const adminID = results.insertId;
        db.query(companyQuery, [companyName, companyMail, adminID], (err, results) => {
          if (err) throw err;

          res.send({ message: 'User registered successfully' });
        });
      });
    });
  });
});







app.listen(5000,  '0.0.0.0', () => {
    console.log('Server running on port http://0.0.0.0:5000');
});
