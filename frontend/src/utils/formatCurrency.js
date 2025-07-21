// utils/formatCurrency.js
export const formatCurrency = (amount) => {
    if (!amount) return "₹ 0.00";
    return "₹ " + Number(amount).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  
// Utility to validate date format
export const isValidDateFormat = (date, format) => {
  if (format === "dd-mm-yyyy") {
    return /^\d{2}-\d{2}-\d{4}$/.test(date);
  } else if (format === "yyyy-mm-dd") {
    return /^\d{4}-\d{2}-\d{2}$/.test(date);
  }
  return false;
};

// Utility to convert date formats
export const convertDateFormat = (date, fromFormat, toFormat) => {
  let [year, month, day] = fromFormat === "yyyy-mm-dd" ? date.split("-") : [];
  if (fromFormat === "dd-mm-yyyy") {
    [day, month, year] = date.split("-");
  }
  return toFormat === "dd-mm-yyyy" ? `${day}-${month}-${year}` : `${year}-${month}-${day}`;
};
