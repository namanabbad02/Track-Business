import React from "react";

const BalanceDetails = ({ purchaserData, sellerData, sellerPayments = [] }) => {
  // Calculate fields
  const calculateBales = () => {
    const purchaserBales = parseFloat(purchaserData?.numberOfBales || 0);
    const sellerBales = parseFloat(sellerData?.numberOfBales || 0);
    return purchaserBales - sellerBales;
  };

  const calculateQuantity = () => {
    const purchaserQuantity = parseFloat(purchaserData?.quantity || 0);
    const sellerQuantity = parseFloat(sellerData?.quantity || 0);
    return purchaserQuantity - sellerQuantity;
  };

  const calculateGrossProfitLoss = () => {
    const purchaserAmount = parseFloat(purchaserData?.amount || 0);
    const sellerAmount = parseFloat(sellerData?.amount || 0);
    return sellerAmount - purchaserAmount;
  };

  const calculateExpenses = () => {
    const purchaserExpenses =
      parseFloat(purchaserData?.hamali || 0) +
      parseFloat(purchaserData?.shopExpenses || 0) +
      parseFloat(purchaserData?.cartage || 0) +
      parseFloat(purchaserData?.otherExpenses || 0);

    const sellerExpenses =
      parseFloat(sellerData?.hamali || 0) +
      parseFloat(sellerData?.shopExpenses || 0) +
      parseFloat(sellerData?.lorryFright || 0) +
      parseFloat(sellerData?.otherExpenses || 0);

    return purchaserExpenses + sellerExpenses;
  };

  const calculateNetProfitLoss = () => {
    const grossProfitLoss = calculateGrossProfitLoss();
    const expenses = calculateExpenses();
    return grossProfitLoss - expenses;
  };

  const calculateInterest = () => {
    const interestRate = 0.12; // 12% annually
    let totalInterest = 0;

    // Ensure sellerPayments is an array
    sellerPayments.forEach((payment) => {
      const paymentDate = new Date(payment.paymentDate);
      const sellDate = new Date(sellerData?.sellDate || null);

      if (paymentDate > sellDate) {
        const daysLate = Math.ceil((paymentDate - sellDate) / (1000 * 60 * 60 * 24)) - 30;
        if (daysLate > 0) {
          const interest = ((sellerData?.amount || 0) * interestRate * daysLate) / 365;
          totalInterest += interest;
        }
      }
    });

    return parseFloat(totalInterest.toFixed(2));
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "20px",
        marginTop: "20px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h3>Balance Details</h3>
      <div style={{ marginBottom: "10px" }}>
        <strong>Bales Difference:</strong> {calculateBales()} bales
      </div>
      <div style={{ marginBottom: "10px" }}>
        <strong>Quantity Difference:</strong> {calculateQuantity()} units
      </div>
      <div style={{ marginBottom: "10px" }}>
        <strong>Gross Profit/Loss:</strong> ₹{calculateGrossProfitLoss().toFixed(2)}
      </div>
      <div style={{ marginBottom: "10px" }}>
        <strong>Total Expenses:</strong> ₹{calculateExpenses().toFixed(2)}
      </div>
      <div style={{ marginBottom: "10px" }}>
        <strong>Net Profit/Loss:</strong> ₹{calculateNetProfitLoss().toFixed(2)}
      </div>
      <div>
        <strong>Total Interest:</strong> ₹{calculateInterest()}
      </div>
    </div>
  );
};

export default BalanceDetails;
