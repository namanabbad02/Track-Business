
export const formatCurrency = (value) => {
  if (value == null) return "₹0.00";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(value);
};


export const calculateInterest = (sellDate, payments, interestRate) => {
  const sellDateObj = new Date(sellDate);
  let totalInterest = 0;

  payments.forEach((payment) => {
    const paymentDateObj = new Date(payment.date);
    const daysOverdue = (paymentDateObj - sellDateObj) / (1000 * 60 * 60 * 24);

    if (daysOverdue > 30) {
      const interest = (payment.amount * interestRate * daysOverdue) / 100;
      totalInterest += interest;
    }
  });

  return formatCurrency(totalInterest);
};
