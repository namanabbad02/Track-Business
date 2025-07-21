import React, { useState } from 'react';
import axios from 'axios';
import './RetrieveData.css';

function RetrieveData() {
    const [lotNumber, setLotNumber] = useState('');
    const [data, setData] = useState({ purchaser: null, seller: null,  }); // To store fetched data
    const [error, setError] = useState(null); // To handle errors

    const handleRetrieveData = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/data/${lotNumber}`);
            setData(response.data);
            setError(null);  // Reset error on successful fetch
        } catch (error) {
            console.error("Error retrieving data", error);
            setError("Failed to retrieve data. Please check the Lot Number or try again later.");
        }
    };

    const handlePrint = () => {
        window.print();
    };
    
    

    const formatCurrencyINR = (value) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
    };

    const formatDate = (datee) => {
        if (!datee) return "Yet to receive";  // If date is null or undefined, return "Yet to receive"
        
        const formattedDate = new Date(datee);
        if (isNaN(formattedDate)) return "Yet to receive";  // If invalid date, return "Yet to receive"
        
        // const options = { year: 'numeric', month: 'short', day: 'numeric' };
        // return formattedDate.toLocaleDateString('en-GB', options);  // 'en-GB' gives '10 Oct 2024'
        const date = new Date(datee);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' }); // Get abbreviated month name
        const year = date.getFullYear();
        return `${day} ${month} ${year}`; // Returns in "1 Oct 2024" format
    };


    const calculatePurchaserExpense = (hamali, shopExpenses, cartage) => {
        const validHamali = parseFloat(hamali) || 0;
        const validShopExpenses = parseFloat(shopExpenses) || 0;
        const validCartage = parseFloat(cartage) || 0;
        return validHamali + validShopExpenses + validCartage;
    };

    const calculateSellerExpense = (hamali, shopExpenses, LorryFright) => {
        const validHamali = parseFloat(hamali) || 0;
        const validShopExpenses = parseFloat(shopExpenses) || 0;
        const validCartage = parseFloat(LorryFright) || 0;
        return validHamali + validShopExpenses + validCartage;
    };

    // const calculateBalanceDetails = () => {
    //     if (!data.purchaser || !data.seller) return null;

    //     const purchaser = data.purchaser[0];
    //     const seller = data.seller[0];

    //     const bales = purchaser.NumberOfBales - seller.NumberOfBales;
    //     const quantity = purchaser.Quantity - seller.Quantity;
    //     const grossPL = seller.Amount - purchaser.Amount;
        
    //     const purchaserExpense = calculatePurchaserExpense(purchaser.Hamali, purchaser.ShopExpenses, purchaser.Cartage);
    //     const sellerExpense = calculateSellerExpense(seller.Hamali, seller.ShopExpenses, seller.LorryFright);
    //     const totalExpenses = purchaserExpense + sellerExpense;
        
    //     const netPL = grossPL - totalExpenses;

    //     return {
    //         bales,
    //         quantity,
    //         grossPL,
    //         totalExpenses,
    //         netPL,
    //     };
    // };
    const calculateBalanceDetails = () => {
        if (!data.purchaser) return null; // Return null if purchaser data doesn't exist
    
        const purchaser = data.purchaser[0];
        const seller = data.seller ? data.seller[0] : null; // Default to null if seller doesn't exist
    
        const bales = purchaser.NumberOfBales - (seller?.NumberOfBales || 0); // Use 0 if seller doesn't exist
        const quantity = purchaser.Quantity - (seller?.Quantity || 0); // Use 0 if seller doesn't exist
        const grossPL = (seller?.Amount || 0) - purchaser.Amount; // Use 0 for seller.Amount if seller doesn't exist
    
        // Calculate purchaser expenses
        const purchaserExpense = calculatePurchaserExpense(
            purchaser.Hamali,
            purchaser.ShopExpenses,
            purchaser.Cartage
        );
    
        // Calculate seller expenses, default to 0 if seller doesn't exist
        const sellerExpense = seller
            ? calculateSellerExpense(seller.Hamali, seller.ShopExpenses, seller.LorryFright)
            : 0;
    
        const totalExpenses = purchaserExpense + sellerExpense;
    
        // Calculate net P & L
        const netPL = grossPL - totalExpenses;
    
        return {
            bales,
            quantity,
            grossPL,
            totalExpenses,
            netPL,
        };
    };
    

    const balanceDetails = calculateBalanceDetails();

    const getColor = (value) => {
        return value < 0 ? 'negative' : 'positive';
    };

    return (
        <div className="container">
            <h1>Purchaser And Seller Information</h1>
            <input
                type="text"
                value={lotNumber}
                onChange={(e) => setLotNumber(e.target.value)}
                placeholder="Enter Lot Number"
            />
            <div className="button-container">
                <button onClick={handleRetrieveData}>Retrieve</button>
            </div>

            {error && <p className="error-message">{error}</p>}  {/* Display error message */}

            {data.purchaser && data.seller && (
                <div className="flex-container">
                    {/* Purchaser Details */}
                    <div className="card card-left">
                        <h2>Purchaser Details</h2>
                        {data.purchaser.map((purchaser, index) => (
                            <div key={index}>
                                <p><strong>Purchaser Name:</strong> {purchaser.PurchaserName}</p>
                                <p><strong>Number Of Bales:</strong> {purchaser.NumberOfBales}</p>
                                <p><strong>Quantity:</strong> {purchaser.Quantity}</p>
                                <p><strong>Rate:</strong> {formatCurrencyINR(purchaser.Rate)}</p>
                                <p><strong>Amount:</strong> {formatCurrencyINR(purchaser.Amount)}</p>
                                <p><strong>GST Percent:</strong> {purchaser.GST_Percent}</p>
                                <p><strong>GST:</strong> {formatCurrencyINR(purchaser.GST)}</p>
                                <p><strong>Hamali:</strong> {purchaser.Hamali}</p>
                                
                                <p><strong>Shop Expenses:</strong> {purchaser.ShopExpenses}</p>
                                <p><strong>Cartage:</strong> {purchaser.Cartage}</p>
                                <p><strong>OtherExpenses:</strong> {purchaser.OtherExpenses}</p>
                                <p><strong>Purchase Date:</strong> {formatDate(purchaser.PurchaseDate)}</p>
                                <p><strong>Payment Status:</strong> {purchaser.Payment_status}</p>
                                <p><strong>Payment Date:</strong> {formatDate(purchaser.PaymentDate)}</p>
                                <p><strong>Total Expenses:</strong> {formatCurrencyINR(calculatePurchaserExpense(purchaser.Hamali, purchaser.ShopExpenses, purchaser.Cartage))}</p>
                            </div>
                        ))}
                    </div>

                    

                    {/* Seller Details */}
                    <div className="card card-right">
                        <h2>Seller Details</h2>
                        {data.seller.map((seller, index) => (
                            <div key={index}>
                                <p><strong>Seller Name:</strong> {seller.SellerName}</p>
                                <p><strong>Number Of Bales:</strong> {seller.NumberOfBales}</p>
                                <p><strong>Quantity:</strong> {seller.Quantity}</p>
                                <p><strong>Rate:</strong> {formatCurrencyINR(seller.Rate)}</p>
                                <p><strong>Amount:</strong> {formatCurrencyINR(seller.Amount)}</p>
                                <p><strong>GST Percent:</strong> {seller.GST_Percent}</p>
                                <p><strong>GST:</strong> {formatCurrencyINR(seller.GST)}</p>
                                <p><strong>Hamali:</strong> {seller.Hamali}</p>
                                <p><strong>Shop Expenses:</strong> {seller.ShopExpenses}</p>
                                <p><strong>Lorry Fright:</strong> {seller.LorryFright}</p>
                                <p><strong>OtherExpenses:</strong> {seller.OtherExpenses}</p>
                                <p><strong>Sell Date:</strong> {formatDate(seller.SellDate)}</p>
                                <p><strong>Payment Status:</strong> {seller.Payment_status}</p>
                                <p><strong>Payment Received:</strong> {formatDate(seller.PaymentReceived)}</p>
                                <p><strong>Total Expenses:</strong> {formatCurrencyINR(calculateSellerExpense(seller.Hamali, seller.ShopExpenses, seller.LorryFright))}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Balance Details Section */}
            {balanceDetails && (
                <div className="balance-section">
                    <h2>Balance Details</h2>
                    <p><strong>Bales:</strong> {balanceDetails.bales}</p>
                    <p><strong>Quantity:</strong> {balanceDetails.quantity}</p>
                    <p>
                        <strong>Gross P & L:</strong>
                        <span className={getColor(balanceDetails.grossPL)}>
                            {formatCurrencyINR(balanceDetails.grossPL)}
                        </span>
                    </p>
                    <p><strong>Total Expenses:</strong> {formatCurrencyINR(balanceDetails.totalExpenses)}</p>
                    <p>
                        <strong>Net P & L:</strong>
                        <span className={getColor(balanceDetails.netPL)}>
                            {formatCurrencyINR(balanceDetails.netPL)}
                        </span>
                    </p>
                </div>
            )}
            {data.purchaser && data.seller && (
                <div className="print-button-container">
                    <button onClick={handlePrint} className="print-button">Print</button>
                </div>
            )}

        </div>
    );
}

export default RetrieveData;
