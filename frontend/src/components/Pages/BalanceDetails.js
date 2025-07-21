// import React, { useState, useEffect } from "react";
// import { Card, Row, Col, Button, Form } from "react-bootstrap";
// import NumberFormat from "react-number-format";

// const BalanceDetails = ({ purchaserData, sellerData }) => {
//   const [balanceDetails, setBalanceDetails] = useState({
//     balanceBales: 0,
//     balanceQuantity: 0,
//     grossProfitLoss: 0,
//     expenses: 0,
//     netProfitLoss: 0,
//     interest: 0,
//   });

//   // Helper function to calculate the balance details
//   const calculateBalances = () => {
//     const balanceBales = purchaserData.NumberOfBales - sellerData.NumberOfBales;
//     const balanceQuantity = purchaserData.Quantity - sellerData.Quantity;
//     const grossProfitLoss = purchaserData.Amount - sellerData.Amount;
//     const expenses =
//       purchaserData.Hamali +
//       purchaserData.ShopExpenses +
//       purchaserData.Cartage +
//       purchaserData.OtherExpenses +
//       sellerData.Hamali +
//       sellerData.ShopExpenses +
//       sellerData.LorryFright +
//       sellerData.OtherExpenses;
//     const netProfitLoss = grossProfitLoss - expenses;
//     const interest = calculateInterest(sellerData.PaymentAmount, sellerData.SellDate);

//     setBalanceDetails({
//       balanceBales,
//       balanceQuantity,
//       grossProfitLoss,
//       expenses,
//       netProfitLoss,
//       interest,
//     });
//   };

//   // Function to calculate interest on payments exceeding 30 days from SellDate
//   const calculateInterest = (paymentAmount, sellDate) => {
//     const interestRate = 0.02; // 2% per day
//     const paymentDates = paymentAmount.map((payment) => payment.date);
//     let totalInterest = 0;

//     paymentDates.forEach((date) => {
//       const diffTime = new Date(date) - new Date(sellDate);
//       const diffDays = diffTime / (1000 * 3600 * 24); // converting ms to days
//       if (diffDays > 30) {
//         const daysExceed = diffDays - 30;
//         totalInterest += (paymentAmount[paymentDates.indexOf(date)].amount || 0) * interestRate * daysExceed;
//       }
//     });

//     return totalInterest;
//   };

//   // UseEffect to recalculate when any data changes
//   useEffect(() => {
//     if (purchaserData && sellerData) {
//       calculateBalances();
//     }
//   }, [purchaserData, sellerData]);

//   return (
//     <Card className="balance-details-card">
//       <Card.Body>
//         <h4>Balance Details</h4>
//         <Row>
//           <Col>
//             <h5>Balance Information</h5>
//             <p>
//               <strong>Bales:</strong> {balanceDetails.balanceBales}
//             </p>
//             <p>
//               <strong>Quantity:</strong> {balanceDetails.balanceQuantity}
//             </p>
//             <p>
//               <strong>Gross P&L:</strong>{" "}
//               <NumberFormat
//                 value={balanceDetails.grossProfitLoss}
//                 displayType="text"
//                 thousandSeparator={true}
//                 prefix={"₹ "}
//               />
//             </p>
//             <p>
//               <strong>Expenses:</strong>{" "}
//               <NumberFormat
//                 value={balanceDetails.expenses}
//                 displayType="text"
//                 thousandSeparator={true}
//                 prefix={"₹ "}
//               />
//             </p>
//             <p>
//               <strong>Net P&L:</strong>{" "}
//               <NumberFormat
//                 value={balanceDetails.netProfitLoss}
//                 displayType="text"
//                 thousandSeparator={true}
//                 prefix={"₹ "}
//               />
//             </p>
//             <p>
//               <strong>Interest:</strong>{" "}
//               <NumberFormat
//                 value={balanceDetails.interest}
//                 displayType="text"
//                 thousandSeparator={true}
//                 prefix={"₹ "}
//               />
//             </p>
//           </Col>
//         </Row>

//         {/* Display balance and submit button */}
//         <Row className="justify-content-end">
//           <Col xs="auto">
//             <Button variant="primary" onClick={() => alert("Form Submitted")}>
//               Submit
//             </Button>
//           </Col>
//         </Row>
//       </Card.Body>
//     </Card>
//   );
// };

// export default BalanceDetails;
// import React from 'react';

// // Utility function to format numbers as INR currency
// const formatCurrency = (value) => {
//   return `₹ ${value.toLocaleString()}`;
// };

// // Interest calculation function
// const calculateInterest = (paymentDate, sellDate, paymentAmount) => {
//   const timeDiff = new Date(paymentDate) - new Date(sellDate);
//   const daysPast = timeDiff / (1000 * 3600 * 24);
//   const interestRate = 0.02; // 2% interest per day
//   if (daysPast > 30) {
//     const interest = (paymentAmount * interestRate * daysPast).toFixed(2);
//     return interest;
//   }
//   return "0.00";
// };

// const BalanceDetails = ({ purchaserData = {}, sellerData = {} }) => {
//   // Default values for when the data is undefined
//   const bales = purchaserData.NumberOfBales ? purchaserData.NumberOfBales - sellerData.NumberOfBales : 0;
//   const quantity = purchaserData.Quantity ? purchaserData.Quantity - sellerData.Quantity : 0;
//   const grossPnL = purchaserData.Amount ? purchaserData.Amount - sellerData.Amount : 0;
//   const expenses = (
//     parseFloat(purchaserData.Hamali || 0) +
//     parseFloat(purchaserData.ShopExpenses || 0) +
//     parseFloat(purchaserData.Cartage || 0) +
//     parseFloat(purchaserData.OtherExpenses || 0) +
//     parseFloat(sellerData.Hamali || 0) +
//     parseFloat(sellerData.ShopExpenses || 0) +
//     parseFloat(sellerData.LorryFrigt || 0) +
//     parseFloat(sellerData.OtherExpenses || 0)
//   );
//   const netPnL = grossPnL - expenses;

//   return (
//     <div className="balance-details">
//       <h3>Balance Details</h3>
      
//       <div className="details">
//         <div className="detail">
//           <span>Bales: </span>
//           <span>{bales}</span>
//         </div>
        
//         <div className="detail">
//           <span>Quantity: </span>
//           <span>{quantity}</span>
//         </div>

//         <div className="detail">
//           <span>Gross P & L: </span>
//           <span>{formatCurrency(grossPnL)}</span>
//         </div>

//         <div className="detail">
//           <span>Expenses: </span>
//           <span>{formatCurrency(expenses)}</span>
//         </div>

//         <div className="detail">
//           <span>Net P & L: </span>
//           <span>{formatCurrency(netPnL)}</span>
//         </div>

//         <div className="interest">
//           <h4>Interest on Late Payments:</h4>
//           {sellerData.Payments && sellerData.Payments.length > 0 ? (
//             sellerData.Payments.map((payment, index) => {
//               const interest = calculateInterest(payment.PaymentDate, sellerData.SellDate, payment.PaymentAmount);
//               return (
//                 <div key={index} className="payment-detail">
//                   <span>Payment {index + 1} - Amount: {formatCurrency(payment.PaymentAmount)}</span>
//                   <span>Interest: {formatCurrency(interest)}</span>
//                 </div>
//               );
//             })
//           ) : (
//             <div>No payments made yet</div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BalanceDetails;

//18/12
// import React from 'react';

// // Utility function to format numbers as INR currency
// const formatCurrency = (value) => {
//   return `₹ ${value.toLocaleString()}`;
// };

// // Interest calculation function
// const calculateInterest = (paymentDate, sellDate, paymentAmount) => {
//   const timeDiff = new Date(paymentDate) - new Date(sellDate);
//   const daysPast = timeDiff / (1000 * 3600 * 24);
//   const interestRate = 0.02; // 2% interest per day
//   if (daysPast > 30) {
//     const interest = (paymentAmount * interestRate * daysPast).toFixed(2);
//     return parseFloat(interest);
//   }
//   return 0;
// };

// const BalanceDetails = ({ purchaserData = {}, sellerData = {} }) => {
//   // Default values for when the data is undefined
//   const bales = purchaserData.NumberOfBales ? purchaserData.NumberOfBales - sellerData.NumberOfBales : 0;
//   const quantity = purchaserData.Quantity ? purchaserData.Quantity - sellerData.Quantity : 0;
//   const grossPnL = purchaserData.Amount ? purchaserData.Amount - sellerData.Amount : 0;
//   const expenses = (
//     parseFloat(purchaserData.Hamali || 0) +
//     parseFloat(purchaserData.ShopExpenses || 0) +
//     parseFloat(purchaserData.Cartage || 0) +
//     parseFloat(purchaserData.OtherExpenses || 0) +
//     parseFloat(sellerData.Hamali || 0) +
//     parseFloat(sellerData.ShopExpenses || 0) +
//     parseFloat(sellerData.LorryFrigt || 0) +
//     parseFloat(sellerData.OtherExpenses || 0)
//   );
//   const netPnL = grossPnL - expenses;

//   // Ensure Payments is an array before using reduce
//   const totalInterest = Array.isArray(sellerData.Payments)
//     ? sellerData.Payments.reduce((total, payment) => {
//       const interest = calculateInterest(payment.PaymentDate, sellerData.SellDate, payment.PaymentAmount);
//       return total + interest;
//     }, 0)
//     : 0;
  

//   return (
//     <div className="balance-details">
//       <h3>Balance Details</h3>
      
//       <div className="details">
//         <div className="detail">
//           <span>Bales: </span>
//           <span>{bales}</span>
//         </div>
        
//         <div className="detail">
//           <span>Quantity: </span>
//           <span>{quantity}</span>
//         </div>

//         <div className="detail">
//           <span>Gross P & L: </span>
//           <span>{formatCurrency(grossPnL)}</span>
//         </div>

//         <div className="detail">
//           <span>Expenses: </span>
//           <span>{formatCurrency(expenses)}</span>
//         </div>

//         <div className="detail">
//           <span>Net P & L: </span>
//           <span>{formatCurrency(netPnL)}</span>
//         </div>

//         <div className="detail">
//           <span>Overall Interest: </span>
//           <span>{formatCurrency(totalInterest)}</span>
//         </div>

//         {/* <div className="interest">
//           <h4>Interest on Late Payments:</h4>
//           {sellerData.Payments && sellerData.Payments.length > 0 ? (
//             sellerData.Payments.map((payment, index) => {
//               const interest = calculateInterest(payment.PaymentDate, sellerData.SellDate, payment.PaymentAmount);
//               return (
//                 <div key={index} className="payment-detail">
//                   <span>Payment {index + 1} - Amount: {formatCurrency(payment.PaymentAmount)}</span>
//                   <span>Interest: {formatCurrency(interest)}</span>
//                 </div>
//               );
//             })
//           ) : (
//             <div>No payments made yet</div>
//           )}
//         </div> */}
//       </div>
//     </div>
//   );
// };

// export default BalanceDetails;

import React from 'react';
import './BalanceDetails.css';

// Utility function to format numbers as INR currency
const formatCurrency = (value) => {
  if (isNaN(value)) return "₹ 0.00"; // Handle invalid inputs gracefully
  return `₹ ${value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};


// Interest calculation function
const calculateInterest = (paymentDate, sellDate, paymentAmount) => {
  const timeDiff = new Date(paymentDate) - new Date(sellDate);
  const daysPast = timeDiff / (1000 * 3600 * 24);
  const interestRate = 0.02; // 2% interest per day
  if (daysPast > 30) {
    const interest = (paymentAmount * interestRate * daysPast).toFixed(2);
    return parseFloat(interest);
  }
  return 0;
};

const BalanceDetails = ({ purchaserData = {}, sellerData = {}, purchaserNotes = [], sellerNotes = [] }) => {
  // Default calculations for balance bales and quantity
  let adjustedBales = (purchaserData.NumberOfBales || 0) - (sellerData.NumberOfBales || 0);
  let adjustedQuantity = (purchaserData.Quantity || 0) - (sellerData.Quantity || 0);
  let adjustedAmount = (purchaserData.Amount || 0) - (sellerData.Amount || 0);

  // Apply purchaser notes adjustments
  purchaserNotes.forEach(note => {
    if (purchaserData.NoteType === "Credit") {
      adjustedBales += parseFloat(note.Nbales) || 0;
      adjustedQuantity += parseFloat(note.Nquantity) || 0;
      adjustedAmount += parseFloat(note.Namount) || 0;
    } else if (note.NoteType === "Debit") {
      adjustedBales -= parseFloat(note.Nbales) || 0;
      adjustedQuantity -= parseFloat(note.Nquantity) || 0;
      adjustedAmount -= parseFloat(note.Namount) || 0;
    }
  });

  // Apply seller notes adjustments
  sellerNotes.forEach(note => {
    if (purchaserData.NoteType === "Credit") {
      adjustedBales -= parseFloat(note.Nbales) || 0;
      adjustedQuantity -= parseFloat(note.Nquantity) || 0;
      adjustedAmount -= parseFloat(note.Namount) || 0;
    } else if (note.NoteType === "Debit") {
      adjustedBales += parseFloat(note.Nbales) || 0;
      adjustedQuantity += parseFloat(note.Nquantity) || 0;
      adjustedAmount += parseFloat(note.Namount) || 0;
    }
  });

  const grossPnL = purchaserData.Amount ? sellerData.Amount - purchaserData.Amount : 0;
  const expenses = (
    parseFloat(purchaserData.Hamali || 0) +
    parseFloat(purchaserData.ShopExpenses || 0) +
    parseFloat(purchaserData.Cartage || 0) +
    parseFloat(purchaserData.OtherExpenses || 0) +
    parseFloat(sellerData.Hamali || 0) +
    parseFloat(sellerData.ShopExpenses || 0) +
    parseFloat(sellerData.LorryFright || 0) +
    parseFloat(sellerData.OtherExpenses || 0)
  );
  const netPnL = grossPnL - expenses;

  // Ensure Payments is an array before using reduce
  const totalInterest = (Array.isArray(sellerData.Payments) ? sellerData.Payments : []).reduce((total, payment) => {
    if (payment.PaymentDate && payment.PaymentAmount) {  // Ensure necessary properties exist
      const interest = calculateInterest(payment.PaymentDate, sellerData.SellDate, payment.PaymentAmount);
      return total + interest;
    }
    return total;
  }, 0);

  const getColor = (value) => {
    if (value < 0) {
      return 'negative';
    } else if (value > 0) {
      return 'positive';
    } else {
      return 'neutral'; // Optional: for value === 0
    }
  };

  const colorr = (value) => {
    // return value > 0 ? "text-red-500" : "text-black"; // Red for positive expenses, black otherwise
    if (value > 0) {
      return 'text-red-500';
    } 
    else {
      return 'text-black'; // Optional: for value === 0
    }
  };
  

  return (
    <div className="balance-details">
      <h3>Balance Details</h3>
      
      <div className="details">
        <div className="detail">
          <span>Bales: </span>
          <span className={`value-box ${getColor(adjustedBales)}`}>{adjustedBales.toFixed(2)}</span>
        </div>
        
        <div className="detail">
          <span>Quantity: </span>
          <span className={`value-box ${getColor(adjustedQuantity)}`}>{adjustedQuantity.toFixed(2)}</span>
        </div>

        <div className="detail">
          <span>Gross P & L: </span>
          <span className={`value-box ${getColor(grossPnL)}`}>{formatCurrency(grossPnL)}</span>
        </div>

        <div className="detail">
          <span>Expenses: </span>
          <span className={`value-box ${colorr(expenses)}`}>{formatCurrency(expenses)}</span>
        </div>

        <div className="detail">
          <span>Net P & L: </span>
          <span className={`value-box ${getColor(netPnL)}`}>{formatCurrency(netPnL)}</span>
        </div>

        <div className="detail">
          <span>Overall Interest: </span>
          <span className={`value-box ${getColor(totalInterest)}`}>{formatCurrency(totalInterest)}</span>
        </div>
      </div>
    </div>
  );
};

export default BalanceDetails;
