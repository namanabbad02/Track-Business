import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RetrieveData.css';

import { useParams } from "react-router-dom";


const RetrieveData = () => {
    // Get the selected lot number from localStorage
    // const lotNumber = localStorage.getItem("selectedLotNumber");
    const { lotNumber } = useParams(); 
    const [data, setData] = useState({ purchaser: null, seller: null, purchaserpayments: null, sellerpayments: null, purchasernote: null, sellernote: null });
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!lotNumber) {
                    setError("No lot number provided.");
                    return;
                }
                const response = await axios.get(`http://localhost:5000/api/data/${lotNumber}`);
                setData(response.data);
                setError(null);
            } catch (error) {
                console.error("Error retrieving data:", error);
                setError("Failed to retrieve data. Please try again later.");
            }
        };

        fetchData();
    }, [lotNumber]);

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!data.purchaser && !data.seller) {
        return <div className="loading-message">Loading lot data...</div>;
    }



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

        const bales = purchaser.NumberOfBales - (seller?.NumberOfBales || 0);
        const quantity = purchaser.Quantity - (seller?.Quantity || 0);
    
        // Adjusted values
        let adjustedBales = bales;
        let adjustedQuantity = quantity;
    
        // Adjust bales and quantity based on purchaserNotes
        if (data.purchasernote) {
            data.purchasernote.forEach(note => {
                if (note.Nbales && note.Nquantity) {
                    // Check NoteType for adjustments
                    if (note.NoteType === 'Credit') {
                        adjustedBales += parseFloat(note.Nbales) || 0;
                        adjustedQuantity += parseFloat(note.Nquantity) || 0;
                    } else if (note.NoteType === 'Debit') {
                        adjustedBales -= parseFloat(note.Nbales) || 0;
                        adjustedQuantity -= parseFloat(note.Nquantity) || 0;
                    }
                }
            });
        }
    
        // Adjust bales and quantity based on sellerNotes
        if (data.sellernote) {
            data.sellernote.forEach(note => {
                if (note.Nbales && note.Nquantity) {
                    // Check NoteType for adjustments
                    if (note.NoteType === 'Credit') {
                        adjustedBales += parseFloat(note.Nbales) || 0;
                        adjustedQuantity += parseFloat(note.Nquantity) || 0;
                    } else if (note.NoteType === 'Debit') {
                        adjustedBales -= parseFloat(note.Nbales) || 0;
                        adjustedQuantity -= parseFloat(note.Nquantity) || 0;
                    }
                }
            });
        }
        
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
            bales: adjustedBales,
            quantity: adjustedQuantity,
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
            <h1>Details for Lot Number: {lotNumber}</h1>
            {error && <p className="error-message">{error}</p>}
            {/* Existing details rendering logic */}
            {/* <input
                type="text"
                value={lotNumber}
                onChange={(e) => setLotNumber(e.target.value)}
                placeholder="Enter Lot Number"
            />
            <div className="button-container">
                <button onClick={handleRetrieveData}>Retrieve</button>
            </div> */}

            {error && <p className="error-message">{error}</p>}  {/* Display error message */}

            {/* Details Section */}
            {/* <div className="flex-container">
                {data.purchaser && (
                    <div className="card card-left">
                        <h2>Purchasered Company</h2>
                        {data.purchaser.map((purchaser, index) => (
                            <div key={index}>
                                <p className="company-name">{purchaser.Company}</p>
                            </div>
                        ))}
                    </div>
                )}

                {data.seller && (
                    <div className="card card-right">
                        <h2>Seller Company</h2>
                        {data.seller.map((seller, index) => (
                            <div key={index}>
                                <p className="company-name">{seller.Company}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div> */}
            <div className="company-header">
  {data.purchaser && (
    <div className="purchaser-company">
      <h2>Purchaser Company:</h2>
      {data.purchaser.map((purchaser, index) => (
        <p key={index} className="company-name">{purchaser.Company}</p>
      ))}
    </div>
  )}
  {data.seller && (
    <div className="seller-company">
      <h2>Seller Company:</h2>
      {data.seller.map((seller, index) => (
        <p key={index} className="company-name">{seller.Company}</p>
      ))}
    </div>
  )}
</div>


            {/* Details Section */}
            <div className="flex-container">
                {data.purchaser && (
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
                                <p><strong>Other Expenses:</strong> {purchaser.OtherExpenses}</p>
                                <p><strong>Purchase Date:</strong> {formatDate(purchaser.PurchaseDate)}</p>
                                <p><strong>Payment Status:</strong> {purchaser.Payment_status}</p>
                                <p><strong>Payment Date:</strong> {formatDate(purchaser.PaymentDate)}</p>
                                <p><strong>Total Expenses:</strong> {formatCurrencyINR(calculatePurchaserExpense(purchaser.Hamali, purchaser.ShopExpenses, purchaser.Cartage))}</p>
                            </div>
                        ))}
                    </div>
                )}

                {data.seller && (
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
                                <p><strong>Other Expenses:</strong> {seller.OtherExpenses}</p>
                                <p><strong>Sell Date:</strong> {formatDate(seller.SellDate)}</p>
                                <p><strong>Payment Status:</strong> {seller.Payment_status}</p>
                                <p><strong>Payment Received:</strong> {formatDate(seller.PaymentReceived)}</p>
                                <p><strong>Total Expenses:</strong> {formatCurrencyINR(calculateSellerExpense(seller.Hamali, seller.ShopExpenses, seller.LorryFright))}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Payments Section */}
            <div className="flex-container">

                {/* Purchaser Payments Section */}
                {data.purchaserpayments && data.purchaserpayments.length > 0 && (
                    <div className="card card-left">
                        <h2>Purchaser Payments</h2>

                        {/* Header: Purchaser Name and Total Amount */}
                        <div className="payment-summary">
                            <p><strong>Purchaser Name:</strong> {data.purchaserpayments[0]?.PurchaserName}</p>
                            <p><strong>Total Amount:</strong> {formatCurrencyINR(data.purchaserpayments[0]?.Amount)}</p>
                        </div>

                        {/* Table for Subpayments */}
                        <table className="subpayments-table">
                            <thead>
                                <tr>
                                    <th>Payment Amount</th>
                                    <th>Payment Date</th>
                                    <th>Interest Amount</th>
                                    <th>Balance Payment</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.purchaserpayments.map((payment, index) => (
                                    <tr key={index}>
                                        <td>{formatCurrencyINR(payment.SubPayments)}</td>
                                        <td>{formatDate(payment.PaymentsDate)}</td>
                                        <td>{formatCurrencyINR(payment.InterestAmount)}</td>
                                        <td>{formatCurrencyINR(payment.BalanceAfterPayment)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Seller Payments Section */}
                {data.sellerpayments && data.sellerpayments.length > 0 && (
                    <div className="card card-right">
                        <h2>Seller Payments</h2>

                        {/* Header: Seller Name and Total Amount */}
                        <div className="payment-summary">
                            <p><strong>Seller Name:</strong> {data.sellerpayments[0]?.SellerName}</p>
                            <p><strong>Total Amount:</strong> {formatCurrencyINR(data.sellerpayments[0]?.Amount)}</p>
                        </div>

                        {/* Table for Subpayments */}
                        <table className="subpayments-table">
                            <thead>
                                <tr>
                                    <th>Payment Amount</th>
                                    <th>Payment Date</th>
                                    <th>Interest Amount</th>
                                    <th>Balance Payment</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.sellerpayments.map((payment, index) => (
                                    <tr key={index}>
                                        <td>{formatCurrencyINR(payment.SubPayments)}</td>
                                        <td>{formatDate(payment.PaymentDate)}</td>
                                        <td>{formatCurrencyINR(payment.InterestAmount)}</td>
                                        <td>{formatCurrencyINR(payment.BalanceAfterPayment)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

            </div>


            {/* Notes Section */}
            <div className="flex-container">
                {data.purchasernote && data.purchasernote.length>0 && (
                    <div className="card card-left">
                        <h2>Purchaser Notes</h2>
                        {data.purchasernote.map((note, index) => (
                            <div key={index}>
                                <p><strong>Note Type:</strong> {note.NoteType}</p>
                                <p><strong>Purchaser Name:</strong> {note.PurchaserName}</p>
                                <p><strong>Number of Bales:</strong> {note.Nbales}</p>
                                <p><strong>Quantity:</strong> {note.Nquantity}</p>
                                <p><strong>Rate:</strong> {formatCurrencyINR(note.Nrate)}</p>
                                <p><strong>Amount:</strong> {formatCurrencyINR(note.Namount)}</p>
                                <p><strong>GST Percent:</strong> {note.NGST_Percent}%</p>
                                <p><strong>GST:</strong> {formatCurrencyINR(note.NGST)}</p>
                            </div>
                        ))}
                    </div>
                )}

                {data.sellernote && data.sellernote.length>0 &&(
                    <div className="card card-right">
                        <h2>Seller Notes</h2>
                        {data.sellernote.map((note, index) => (
                            <div key={index}>
                                <p><strong>Note Type:</strong> {note.NoteType}</p>
                                <p><strong>Seller Name:</strong> {note.SellerName}</p>
                                <p><strong>Number of Bales:</strong> {note.Nbales}</p>
                                <p><strong>Quantity:</strong> {note.Nquantity}</p>
                                <p><strong>Rate:</strong> {formatCurrencyINR(note.Nrate)}</p>
                                <p><strong>Amount:</strong> {formatCurrencyINR(note.Namount)}</p>
                                <p><strong>GST Percent:</strong> {note.NGST_Percent}%</p>
                                <p><strong>GST:</strong> {formatCurrencyINR(note.NGST)}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="balance-details">
                <h3>Balance Details</h3>

                <div className="details">
                    <div className="detail">
                        <span>Bales: </span>
                        <span className={`value-box ${getColor(balanceDetails.bales)}`}>{balanceDetails.bales}</span>
                    </div>

                    <div className="detail">
                        <span>Quantity: </span>
                        <span className={`value-box ${getColor(balanceDetails.quantity)}`}>{balanceDetails.quantity.toFixed(2)}</span>
                    </div>

                    <div className="detail">
                        <span>Gross P & L: </span>
                        <span className={`value-box ${getColor(balanceDetails.grossPL)}`}>{formatCurrencyINR(balanceDetails.grossPL)}</span>
                    </div>

                    <div className="detail">
                        <span>Expenses: </span>
                        <span className={`value-box ${getColor(balanceDetails.totalExpenses)}`}>{formatCurrencyINR(balanceDetails.totalExpenses)}</span>
                    </div>

                    <div className="detail">
                        <span>Net P & L: </span>
                        <span className={`value-box ${getColor(balanceDetails.netPL)}`}>{formatCurrencyINR(balanceDetails.netPL)}</span>
                    </div>


                </div>
            </div>

            {/* Balance Details Section */}
            {/* {balanceDetails && (
                <div className="balance-section">
                    <h2>Balance Details</h2>
                    <p><strong>Bales:</strong> {balanceDetails.bales}</p>
                    <p><strong>Quantity:</strong> {balanceDetails.quantity.toFixed(2)}</p>
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
            )} */}
            {data.purchaser && data.seller && (
                <div className="print-button-container">
                    <button onClick={handlePrint} className="print-button">Print</button>
                </div>
            )}

        </div>
    );
}

export default RetrieveData;
