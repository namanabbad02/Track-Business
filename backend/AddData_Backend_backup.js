app.post("/api/submit-data", (req, res) => {
  const { purchaser, sellers } = req.body;
  console.log("Request received:", req.body);

  if (!purchaser || purchaser.length === 0 || !sellers || sellers.length === 0) {
    return res.status(400).json({ error: "Purchaser and Sellers data are required." });
  }

  // Start the transaction
  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ error: "Error starting database transaction", details: err });
    }

    // Insert Lots (assuming LotNumber is the same for all entries)
    const lotNumber = purchaser[0].LotNumber;
    const lotQuery = `INSERT IGNORE INTO Lots (LotNumber) VALUES (?)`;

    db.query(lotQuery, [lotNumber], (err) => {
      if (err) {
        return db.rollback(() => {
          res.status(500).json({ error: "Error inserting LotNumber", details: err });
        });
      }

      // Insert Purchaser data
      const purchaserQuery = `
        INSERT INTO Purchaser (
          BillNumber, PurchaserName, PurchaserAddress, GSTNumber, NumberOfBales, Quantity, Rate, Amount, GST_Percent, GST, 
          LotNumber, Hamali, Payment_status, ShopExpenses, Cartage, OtherExpenses, 
          Category, PaymentDate, PurchaseDate
        ) VALUES ?`;

      const purchaserValues = purchaser.map((item) => [
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
        item.LotNumber,
        item.Hamali,
        item.Payment_status,
        item.ShopExpenses,
        item.Cartage,
        item.OtherExpenses,
        item.Category,
        item.PaymentDate,
        item.PurchaseDate,
      ]);

      db.query(purchaserQuery, [purchaserValues], (err) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json({ error: "Error inserting Purchaser data", details: err });
          });
        }

        // Insert Seller data
        const sellerQuery = `
          INSERT INTO Seller (
            BillNumber, SellerName, SellerAddress, GSTNumber, NumberOfBales, Quantity, Rate, Amount, GST_Percent, GST, 
            LotNumber, Hamali, Payment_status, ShopExpenses, LorryFright, OtherExpenses, 
            SellDate
          ) VALUES ?`;

        const sellerValues = sellers.map((seller) => [
          seller.BillNumber,
          seller.SellerName,
          seller.SellerAddress,
          seller.GSTNumber,
          seller.NumberOfBales,
          seller.Quantity,
          seller.Rate,
          seller.Amount,
          seller.GST_Percent,
          seller.GST,
          lotNumber,
          seller.Hamali ,
          seller.Payment_status,
          seller.ShopExpenses,
          seller.LorryFright,
          seller.OtherExpenses,
          seller.SellDate,
        ]);

        db.query(sellerQuery, [sellerValues], (err) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json({ error: "Error inserting Seller data", details: err });
            });
          }

          // Insert SellerPayments data
          const sellerPaymentsQuery = `
            INSERT INTO SellerPayments (
              LotNumber, SubPayments, PaymentDate
            ) VALUES ?`;

          const sellerPaymentsValues = sellers.flatMap((seller) =>
            seller.payments.map((payment) => [
              lotNumber,
              payment.amount || null,
              payment.date || null,
            ])
          );

          if (sellerPaymentsValues.length > 0) {
            db.query(sellerPaymentsQuery, [sellerPaymentsValues], (err) => {
              if (err) {
                return db.rollback(() => {
                  res.status(500).json({ error: "Error inserting SellerPayments data", details: err });
                });
              }

              // Commit the transaction
              db.commit((err) => {
                if (err) {
                  return db.rollback(() => {
                    res.status(500).json({ error: "Error committing transaction", details: err });
                  });
                }
                res.status(200).json({ message: "Data successfully added to all tables" });
              });
            });
          } else {
            // Commit the transaction if there are no SellerPayments
            db.commit((err) => {
              if (err) {
                return db.rollback(() => {
                  res.status(500).json({ error: "Error committing transaction", details: err });
                });
              }
              res.status(200).json({ message: "Data successfully added to Lots, Purchaser, and Seller tables" });
            });
          }
        });
      });
    });
  });
});


app.get("/api/fetch-data/:LotNumber", (req, res) => {
    const LotNumber = req.params.LotNumber;
  
    // Queries to fetch data
    const purchaserQuery = `SELECT * FROM Purchaser WHERE LotNumber = ?`;
    const sellerQuery = `SELECT * FROM Seller WHERE LotNumber = ?`;
    const sellerPaymentsQuery = `SELECT * FROM SellerPayments WHERE LotNumber = ?`;
    const purchaserPaymentsQuery = `SELECT * FROM PurchaserPayments WHERE LotNumber = ?`;
  
    // Fetch Purchaser Data
    db.query(purchaserQuery, [LotNumber], (err, purchasers) => {
      if (err) return res.status(500).json({ error: "Error fetching purchaser data" });
  
      // Fetch Purchaser Payments Data
      db.query(purchaserPaymentsQuery, [LotNumber], (err, purchaserPayments) => {
        if (err) return res.status(500).json({ error: "Error fetching purchaser payments data", details: err });
  
        // Fetch Seller Data
        db.query(sellerQuery, [LotNumber], (err, sellers) => {
          if (err) return res.status(500).json({ error: "Error fetching seller data", details: err });
  
          // Fetch Seller Payments Data
          db.query(sellerPaymentsQuery, [LotNumber], (err, sellerPayments) => {
            if (err) return res.status(500).json({ error: "Error fetching seller payments data", details: err });
  
            // Map Seller Data and Include Payments
            const sellerResult = sellers.map(seller => {
              // Filter seller-specific payments
              const associatedSellerPayments = sellerPayments
                .filter(payment => payment.SellerName === seller.SellerName)
                .map(payment => ({
                  amount: parseFloat(payment.SubPayments) || 0,
                  date: payment.PaymentDate || null,
                }));
  
              return {
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
                payments: associatedSellerPayments, // Include the seller payments
              };
            });
  
            // Map Purchaser Data and Include Payments
            const purchaserResult = purchasers.map(purchaser => {
              // Filter purchaser-specific payments
              const associatedPurchaserPayments = purchaserPayments
                .filter(payment => payment.PurchaserName === purchaser.PurchaserName)
                .map(payment => ({
                  amount: parseFloat(payment.SubPayments) || 0,
                  date: payment.PaymentsDate || null,
                }));
  
              return {
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
                payments: associatedPurchaserPayments, // Include the purchaser payments
              };
            });
  
            // Respond with the combined data
            res.json({
              purchaser: purchaserResult, // Purchaser data including payments
              sellers: sellerResult,      // Seller data including payments
            });
          });
        });
      });
    });
  });
  



// 17-01

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