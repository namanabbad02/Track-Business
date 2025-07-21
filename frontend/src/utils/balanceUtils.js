export const calculateBalances = (purchaserData, sellerData) => {
    const purchaserBales = purchaserData.NumberOfBales || 0;
    const sellerBales = sellerData.NumberOfBales || 0;
    const purchaserQuantity = purchaserData.Quantity || 0;
    const sellerQuantity = sellerData.Quantity || 0;
    const purchaserAmount = purchaserData.Amount || 0;
    const sellerAmount = sellerData.Amount || 0;
    const expenses =
      (purchaserData.Hamali || 0) +
      (purchaserData.ShopExpenses || 0) +
      (purchaserData.Cartage || 0) +
      (purchaserData.OtherExpenses || 0) +
      (sellerData.Hamali || 0) +
      (sellerData.ShopExpenses || 0) +
      (sellerData.LorryFright || 0) +
      (sellerData.OtherExpenses || 0);
  
    const grossPL = sellerAmount - purchaserAmount;
    const netPL = grossPL - expenses;
  
    return {
      bales: purchaserBales - sellerBales,
      quantity: purchaserQuantity - sellerQuantity,
      grossPL,
      expenses,
      netPL,
    };
  };
  