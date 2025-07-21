import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./SellerCard.css"; // Include styles for a clean UI
import { formatCurrency, calculateInterest } from "../../utils/formatINR"; // Helper functions
import { isValidDateFormat, convertDateFormat } from "../../utils/formatCurrency";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const SellerCard = ({ data, setData }) => {
  const [sellerData, setSellerData] = useState({
    Company: "",
    BillNumber: "",
    SellerName: "",
    SellerAddress: "",
    GSTNumber: "",
    NumberOfBales: "",
    Quantity: "",
    Rate: "",
    Amount: "",
    GST_Percent: "",
    GST: "",
    SellDate: "", // Added SellDate field
    LotNumber: "",
    Hamali: "",
    ShopExpenses: "",
    LorryFright: "",
    OtherExpenses: "",
    Payment_status: "Yes",
    PaymentReceived: "",
    NoteType: "",
    sellerNotes: [{ Nbales: "", Nquantity: "", Namount: "", Nrate: "", NGST_Percent: "", NGST: "" }],
    payments: [{ amount: "", date: "" }], // Start with one payment field
  });

  const [balanceAmount, setBalanceAmount] = useState(0);

  const [suggestions, setSuggestions] = useState([]);

  // Fetch suggestions based on input
  const [highlightIndex, setHighlightIndex] = useState(-1);

  // Fetch suggestions based on input
  
  const suggestionsRef = useRef(null); // Reference to the suggestions list for scrolling

  // Fetch suggestions based on input
  const handleNameChange = async (e) => {
    const inputName = e.target.value;
    setSellerData((prev) => ({ ...prev, SellerName: inputName }));

    if (inputName.length > 1) {
      try {
        const response = await axios.get(`http://localhost:5000/api/purchasers?name=${inputName}`);
        setSuggestions(response.data);
      } catch (error) {
        console.error("Error fetching purchaser suggestions:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion) => {
    setSellerData((prev) => ({
      ...prev,
      SellerName: suggestion.Name,
      SellerAddress: suggestion.Address,
      GSTNumber: suggestion.GST_Number,
    }));
    setSuggestions([]);
    setHighlightIndex(-1);
  };

  // Handle keyboard navigation and scroll behavior
  const handleKeyDown = (e) => {
    if (suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        setHighlightIndex((prevIndex) =>
          prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0
        );
        // Scroll down the list
        if (suggestionsRef.current) {
          suggestionsRef.current.scrollTop += 30; // Adjust scroll speed
        }
        e.preventDefault(); // Prevent moving the cursor in the textarea
      } else if (e.key === "ArrowUp") {
        setHighlightIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1
        );
        // Scroll up the list
        if (suggestionsRef.current) {
          suggestionsRef.current.scrollTop -= 30; // Adjust scroll speed
        }
        e.preventDefault(); // Prevent moving the cursor in the textarea
      } else if (e.key === "Enter" && highlightIndex >= 0) {
        handleSuggestionSelect(suggestions[highlightIndex]);
        e.preventDefault(); // Prevent form submission or textarea behavior
      }
    }
  };

  // Scroll the highlighted suggestion into view (optional, to smoothen the experience)
  useEffect(() => {
    if (highlightIndex >= 0 && suggestionsRef.current) {
      const highlightedItem = suggestionsRef.current.children[highlightIndex];
      if (highlightedItem) {
        highlightedItem.scrollIntoView({
          behavior: "smooth",
          block: "nearest", // Ensure the item is visible within the list
        });
      }
    }
  }, [highlightIndex, suggestions]);

  const getAutocompletedName = (suggestion, inputValue) => {
    const matchedPart = suggestion.Name.slice(0, inputValue.length);
    const autocompletedPart = suggestion.Name.slice(inputValue.length);

    return (
      <>
        <span className="matched-part">{matchedPart}</span>
        <span className="autocompleted-part">{autocompletedPart}</span>
      </>
    );
  };
  const getSuggestedText = (input, suggestion) => {
    const index = suggestion.Name.toLowerCase().indexOf(input.toLowerCase());
    if (index === -1) return suggestion.Name; // No match found
    const preText = suggestion.Name.slice(0, index);
    const matchText = suggestion.Name.slice(index, index + input.length);
    const postText = suggestion.Name.slice(index + input.length);
    return (
      <>
        {preText}
        <span style={{ color: "blue" }}>{matchText}</span>
        {postText}
      </>
    );
  };





  // Populate fields if data exists
  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      setSellerData({ ...data });
      calculateBalance(data);
    }

  }, [data]);

  // Handle field changes
  const [editingSellerAmount, setEditingSellerAmount] = useState(false); // Track edit mode for Seller Amount
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedData = { ...sellerData, [name]: value };

    // Calculate Amount dynamically
    if (name === "Rate" || name === "Quantity") {
      const rate = parseFloat(updatedData.Rate || 0);
      const quantity = parseFloat(updatedData.Quantity || 0);

      if (!updatedData.manualAmount) {
        const calculatedAmount = (rate * 0.2812 * quantity * 10).toFixed(2);
        updatedData.Amount = calculatedAmount;
      }
    }

    // Handle manual Amount editing
    if (name === "Amount") {
      updatedData.manualAmount = true; // Indicate manual editing
      updatedData.Amount = value; // Store raw value
    }

    // Calculate GST dynamically when related fields change
    if (name === "Rate" || name === "Quantity" || name === "Amount" || name === "GST_Percent") {
      const amount = parseFloat(updatedData.Amount || 0);
      const gstPercent = parseFloat(updatedData.GST_Percent || 0);
      updatedData.GST = ((amount * gstPercent) / 100).toFixed(2);
    }

    setSellerData(updatedData);
    setData(updatedData);
    calculateBalance(updatedData); // Recalculate balance after any change
  };


  const handleSellerAmountFocus = () => {
    setEditingSellerAmount(true); // Switch to raw value on focus
  };

  const handleSellerAmountBlur = () => {
    setEditingSellerAmount(false); // Format value on blur
  };

  // Calculate balance amount based on payments
  // const calculateBalance = (updatedData) => {
  //   const totalPayments = updatedData.payments.reduce(
  //     (total, payment) => total + parseFloat(payment.amount || 0),
  //     0
  //   );
  //   const balance = parseFloat(updatedData.Amount || 0) - totalPayments;
  //   setBalanceAmount(balance);
  // };
  // const calculateBalance = (updatedData) => {
  //   // Check if payments is a valid array, default to an empty array if not
  //   const payments = Array.isArray(updatedData?.payments) ? updatedData.payments : [];

  //   // Calculate total payments
  //   const totalPayments = payments.reduce(
  //     (total, payment) => total + parseFloat(payment.amount || 0),
  //     0
  //   );

  //   // Calculate balance
  //   const balance = parseFloat(updatedData?.Amount || 0) - totalPayments;

  //   // Set the calculated balance
  //   setBalanceAmount(balance);
  // };

  const calculateBalance = (updatedData) => {
    const payments = Array.isArray(updatedData?.payments) ? updatedData.payments : [];
  
    // Step 1: Base amount and GST
    const baseAmount = parseFloat(updatedData?.Amount || 0);
    const baseGST = parseFloat(updatedData?.GST || 0);
    let adjustedAmount = baseAmount + baseGST;
  
    // Step 2: Apply Credit/Debit Note logic with GST
    if (Array.isArray(updatedData?.sellerNotes)) {
      updatedData.sellerNotes.forEach(note => {
        const nAmount = parseFloat(note.Namount || 0);
        const nGST = parseFloat(note.NGST || 0);
  
        if (updatedData.NoteType === "Credit") {
          adjustedAmount += (nAmount + nGST);
        } else if (updatedData.NoteType === "Debit") {
          adjustedAmount -= (nAmount + nGST);
        }
      });
    }
  
    // Step 3: Subtract total payments received
    const totalPayments = payments.reduce(
      (total, payment) => total + parseFloat(payment.amount || 0),
      0
    );
  
    const balance = adjustedAmount - totalPayments;
    setBalanceAmount(balance);
  };
  
  


  // Add new payment entry
  const addPayment = () => {
    const updatedPayments = [...sellerData.payments, { amount: "", date: "" }];
    setSellerData({ ...sellerData, payments: updatedPayments });
  };

  // Remove a payment entry
  const removePayment = (index) => {
    const updatedPayments = sellerData.payments.filter((_, idx) => idx !== index);
    setSellerData({ ...sellerData, payments: updatedPayments });
    calculateBalance({ ...sellerData, payments: updatedPayments });
  };

  // Update payment entry working
  // const handlePaymentChange = (index, field, value) => {
  //   const updatedPayments = sellerData.payments.map((payment, idx) =>
  //     idx === index ? { ...payment, [field]: value } : payment
  //   );
  //   const totalPayments = updatedPayments.reduce(
  //     (total, payment) => total + parseFloat(payment.amount || 0),
  //     0
  //   );

  //   if (totalPayments <= parseFloat(sellerData.Amount)) {
  //     setSellerData({ ...sellerData, payments: updatedPayments });
  //     calculateBalance({ ...sellerData, payments: updatedPayments });
  //   } else {
  //     alert("Total payments cannot exceed the Amount");
  //   }
  // };

  // updated on 04/03
  const handlePaymentChange = (index, field, value) => {
    console.log(`Updating payment at index ${index} with field ${field} and value ${value}`);
    const updatedPayments = sellerData.payments.map((payment, idx) =>
      idx === index ? { ...payment, [field]: value } : payment
    );
    const totalPayments = updatedPayments.reduce(
      (total, payment) => total + parseFloat(payment.amount || 0),
      0
    );
  
    if (totalPayments <= parseFloat(sellerData.Amount)) {
      setSellerData({ ...sellerData, payments: updatedPayments });
      setData({ ...sellerData, payments: updatedPayments });
      calculateBalance({ ...sellerData, payments: updatedPayments });
    } else {
      alert("Total payments cannot exceed the Amount");
    }
  };

  

  const handleNoteChange = (e, index, field) => {
    const { value } = e.target;
    const updatedNotes = [...sellerData.sellerNotes];
    const note = updatedNotes[index];
  
    // Update the specific field
    note[field] = value;
  
    // Auto-calculate Amount and GST
    if (field === "Nrate" || field === "Nquantity") {
      const rate = parseFloat(note.Nrate || 0);
      const quantity = parseFloat(note.Nquantity || 0);
  
      if (!note.manualAmount) {
        const calculatedAmount = (rate * 0.2812 * quantity * 10).toFixed(2);
        note.Namount = calculatedAmount;
      }
    }
  
    if (field === "Namount") {
      note.manualAmount = true;
      note.Namount = value; // Store raw value
    }
  
    if (field === "Nrate" || field === "Nquantity" || field === "Namount" || field === "NGST_Percent") {
      const amount = parseFloat(note.Namount || 0);
      const gstPercent = parseFloat(note.NGST_Percent || 0);
      note.NGST = ((amount * gstPercent) / 100).toFixed(2);
    }
  
    // Update the main state
    setSellerData({ ...sellerData, sellerNotes: updatedNotes });
  };

  const handleAmountFocus = () => {
    setEditingSellerAmount(true); // Switch to raw value on focus
  };

  const handleAmountBlur = () => {
    setEditingSellerAmount(false); // Format value on blur
  };
  

  // Calculate individual interest for each subpayment
  const calculateIndividualInterest = (paymentDate) => {
    const sellDate = new Date(sellerData.SellDate);
    const paymentReceivedDate = new Date(paymentDate);
    const timeDiff = paymentReceivedDate - sellDate;
    const daysPast = timeDiff / (1000 * 3600 * 24); // Convert time difference to days
    const interestRate = 0.012; // 2% interest rate
    if (daysPast > 30) {
      const interest = ((parseFloat(sellerData.Amount || 0) * interestRate * daysPast) / 365).toFixed(2);
      return formatCurrency(interest);
    }
    return "0.00";
  };

  const handleDateInput = (e) => {
    const { name, value } = e.target;

    // Allow only digits and dashes
    const formattedValue = value.replace(/[^0-9-]/g, "");

    // Automatically format to dd-mm-yyyy as the user types
    let updatedValue = formattedValue;
    if (formattedValue.length === 2 || formattedValue.length === 5) {
      updatedValue += "-";
    } else if (formattedValue.length > 10) {
      updatedValue = formattedValue.slice(0, 10); // Restrict length to 10 characters
    }

    // Update state
    handleChange({
      target: { name, value: updatedValue },
    });
  };
  const handleDateChange = (date) => {
    // Update the date in purchaserData as a string (if needed for backend)
    handleChange({ target: { name: "SellDate", value: date ? date.toISOString() : "" } });
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };
  const handledateChange = (index, date) => {
    const formattedDate = date ? date.toISOString().split('T')[0] : "";
    const updatedPayments = sellerData.payments.map((payment, idx) =>
      idx === index ? { ...payment, date: formattedDate } : payment
    );
  
    setSellerData({ ...sellerData, payments: updatedPayments });
    setData({ ...sellerData, payments: updatedPayments });
    calculateBalance({ ...sellerData, payments: updatedPayments });
  };
  


  return (
    <div className="seller-card">
      <h3 className="seller">Seller Details</h3>

      <div className="form-group">
        <label>Select Company:</label>
        <select
          name="Company"
          value={sellerData.Company}
          onChange={handleChange}
        >Select Company
          <option value="">Select Company</option>
          <option value="Varsha Cotton Company">Varsha Cotton Company</option>
          <option value="Sampat Traders">Sampat Traders</option>
          <option value="Madan Traders">Madan Traders</option>
        </select>
      </div>

      <div className="form-group">
        <label>Sell Date:</label>
        <ReactDatePicker
                selected={
                  sellerData.SellDate
                    ? new Date(sellerData.SellDate) // Convert string to Date
                    : null // Handle empty or invalid date
                }
                onChange={handleDateChange}
                dateFormat="dd-MM-yyyy" // Adjust date format
                placeholderText="Select a date"
                className="form-control" // Add styling if needed
                isClearable // Optional: Adds a clear button
              />
      </div>
      <div className="form-group">
        <label>Bill Number</label>
        <input
          type="text"
          name="BillNumber"
          value={sellerData.BillNumber}
          onChange={handleChange}
          placeholder="Enter Bill Number"
        />
      </div>

      {/* <div className="input-group">
        <label>Seller Name</label>
        <textarea
          name="SellerName"
          value={data.SellerName || ""}
          onChange={handleChange}
          placeholder="Enter seller name"
          rows="2"
        />
      </div>
      <div className="input-group">
        <label>Seller Address</label>
        <textarea
          name="SellerAddress"
          value={data.SellerAddress || ""}
          onChange={handleChange}
          placeholder="Enter seller address"
          rows="4"
        />
      </div>
      <div className="form-group">
        <label>GST Number</label>
        <input
          type="text"
          name="GSTNumber"
          value={sellerData.GSTNumber}
          onChange={handleChange}
          placeholder="Enter GST Number"
        />
      </div> */}

      <div className="input-group">
        <label>Seller Name</label>
        <textarea
          name="SellerName"
          value={sellerData.SellerName || ""}
          onChange={handleNameChange}
          onKeyDown={handleKeyDown}
          placeholder="Enter seller name"
          rows="2"
          
        />
        {suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((suggestion, index) => (
              <li
                key={suggestion.master_ID}
                onClick={() => handleSuggestionSelect(suggestion)}
                className={index === highlightIndex ? "highlight" : ""}
              >
                {/* {getAutocompletedName(suggestion, sellerData.SellerName)} */}
                <strong>{suggestion.Name}</strong>
                <br />
                <small>{suggestion.Address}</small>
                {/* {getSuggestedText(sellerData.SellerName, suggestion)} */}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="input-group">
        <label>Seller Address</label>
        <textarea
          name="SellerAddress"
          value={sellerData.SellerAddress || ""}
          onChange={handleChange}
          placeholder="Enter seller address"
          rows="4"
        />
      </div>
      <div className="form-group">
        <label>GST Number</label>
        <input
          type="text"
          name="GSTNumber"
          value={sellerData.GSTNumber}
          onChange={handleChange}
          placeholder="Enter GST Number"
        />
      </div>

      <div className="form-group">
        <label>Number of Bales:</label>
        <input
          type="text"
          name="NumberOfBales"
          value={sellerData.NumberOfBales}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value)) {
              handleChange(e); // Call the existing handleChange function only for valid input
            }
          }}
          placeholder="Enter Number of Bales"
          inputMode="numeric"
        />
      </div>
      <div className="form-group">
        <label>Quantity:</label>
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type="text"
            name="Quantity"
            value={sellerData.Quantity}
            // onChange={(e) => {
            //   const value = e.target.value;
            //   // Allow decimals with a regular expression
            //   // if (/^\d+(\.\d+)?$/.test(value)) {
            //   if (/^\d*\.?\d+$/.test(value)) {
            //     handleChange(e); // Call the existing handleChange function only for valid input
            //   }
            // }}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*\.?\d*$/.test(value)) { // Allow only digits and an optional single decimal point
                handleChange(e);
              }
            }}
            placeholder="Enter Quantity"
            style={{ flex: 1, marginRight: "10px" }}
          />
          <span style={{ fontWeight: "bold" }}>Tons</span> {/* Change "kg" to the desired metric */}
        </div>
      </div>


      <div className="form-group">
        <label>Rate:</label>
        <input
          type="text"
          name="Rate"
          value={sellerData.Rate}
          // onChange={(e) => {
          //   const value = e.target.value;
          //   if (/^\d*$/.test(value)) {
          //     handleChange(e); // Call the existing handleChange function only for valid input
          //   }
          // }}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value)) {
              handleChange(e); // Call the existing handleChange function only for valid input
            }
          }}
          placeholder="Enter Rate"
        />
      </div>
      <div className="form-group">
        <label>Amount:</label>
        <input
          type="text"
          name="Amount"
          value={
            editingSellerAmount
              ? sellerData.Amount // Show raw value while editing
              : formatCurrency(sellerData.Amount) // Show formatted value when not editing
          }
          onChange={handleChange}
          onFocus={handleSellerAmountFocus}
          onBlur={handleSellerAmountBlur}
        />
      </div>
      <div className="form-group">
        <label>GST Percent:</label>
        <select
          name="GST_Percent"
          value={sellerData.GST_Percent}
          onChange={handleChange}
        >
          <option value="1.5">1.5%</option>
          <option value="2.5">2.5%</option>
          <option value="3">3%</option>
          <option value="5">5%</option>
          <option value="6">6%</option>
          <option value="9">9%</option>
          <option value="12">12%</option>
        </select>
      </div>
      <div className="form-group">
        <label>GST Amount:</label>
        <input
          type="text"
          name="GST"
          value={formatCurrency(sellerData.GST)}
          readOnly
        />
      </div>

      {/* NoteType Field */}
      <div className="form-group">
        <label>Credit/Debit Note</label>
        <select
          name="NoteType"
          value={sellerData.NoteType || ""}
          onChange={handleChange}
        >
          <option value="None">Select Note Type</option>
          <option value="Credit">Credit</option>
          <option value="Debit">Debit</option>
        </select>
      </div>

      {(sellerData.NoteType === "Credit" || sellerData.NoteType === "Debit") && (
        <div className="payment-sub-card">
          <h4>{sellerData.NoteType} Note</h4>
          {(sellerData.sellerNotes || []).map((note, index) => (
            <div key={index} className="note-entry">
              <div className="form-group">
                <label>Bales:</label>
                <input
                  type="text"
                  name={`Nbales-${index}`}
                  value={note.Nbales || ""}
                  onChange={(e) => handleNoteChange(e, index, "Nbales")}
                  placeholder="Enter Number of Bales"
                />
              </div>
              <div className="form-group">
                <label>Quantity:</label>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type="text"
                    name={`Nquantity-${index}`}
                    value={note.Nquantity || ""}
                    onChange={(e) => handleNoteChange(e, index, "Nquantity")}
                    placeholder="Enter Quantity"
                    style={{ flex: 1, marginRight: "10px" }}
                  />
                  <span style={{ fontWeight: "bold" }}>Tons</span>
                </div>
              </div>
              <div className="form-group">
                <label>Rate:</label>
                <input
                  type="text"
                  name={`Nrate-${index}`}
                  value={note.Nrate || ""}
                  onChange={(e) => handleNoteChange(e, index, "Nrate")}
                  placeholder="Enter Rate"
                />
              </div>
              <div className="form-group">
                <label>Amount:</label>
                <input
                  type="text"
                  name={`Namount-${index}`}
                  value={
                    editingSellerAmount
                      ? note.Namount // Show raw value while editing
                      : formatCurrency(note.Namount) // Show formatted value otherwise
                  }
                  onChange={(e) => handleNoteChange(e, index, "Namount")}
                  onFocus={handleAmountFocus}
                  onBlur={handleAmountBlur}
                />
              </div>
              <div className="form-group">
                <label>GST Percent:</label>
                <select
                  name={`NGST_Percent-${index}`}
                  value={note.NGST_Percent || ""}
                  onChange={(e) => handleNoteChange(e, index, "NGST_Percent")}
                >
                  <option value="1.5">1.5%</option>
                  <option value="2.5">2.5%</option>
                  <option value="3">3%</option>
                  <option value="5">5%</option>
                  <option value="6">6%</option>
                  <option value="9">9%</option>
                  <option value="12">12%</option>
                </select>
              </div>
              <div className="form-group">
                <label>GST Amount:</label>
                <input
                  type="text"
                  name={`NGST-${index}`}
                  value={formatCurrency(note.NGST || 0)}
                  readOnly
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="form-group">
        <label>Hamali:</label>
        <input
          type="value"
          name="Hamali"
          value={sellerData.Hamali}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value)) {
              handleChange(e); // Call the existing handleChange function only for valid input
            }
          }}
          inputMode="numeric"
          placeholder="Enter Hamali"
        />
      </div>
      <div className="form-group">
        <label>Shop Expenses:</label>
        <input
          type="text"
          name="ShopExpenses"
          value={sellerData.ShopExpenses}
          // onChange={(e) => {
          //   const value = e.target.value;
          //   if (/^\d*$/.test(value)) {
          //     handleChange(e); // Call the existing handleChange function only for valid input
          //   }
          // }}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value)) {
              handleChange(e); // Call the existing handleChange function only for valid input
            }
          }}
          placeholder="Enter Shop Expenses"
        />
      </div>
      <div className="form-group">
        <label>Lorry Fright:</label>
        <input
          type="text"
          name="LorryFright"
          value={sellerData.LorryFright}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value)) {
              handleChange(e); // Call the existing handleChange function only for valid input
            }
          }}
          placeholder="Enter Lorry Fright"
        />
      </div>
      <div className="form-group">
        <label>Other Expenses:</label>
        <input
          type="text"
          name="OtherExpenses"
          value={sellerData.OtherExpenses}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value)) {
              handleChange(e); // Call the existing handleChange function only for valid input
            }
          }}
          placeholder="Enter Other Expenses"
        />
      </div>
      {/* <div className="form-group">
        <label>Sell Date:</label>
        <input
          type="text"
          name="SellDate"
          value={sellerData.SellDate ? formatDate(sellerData.SellDate) : ""}
          onChange={handleDateInput}
          placeholder="Enter Sell Date (dd-mm-yyyy)"
          maxLength="10" // Ensures user cannot enter more than 10 characters
        />
      </div> */}

      <div className="form-group">
        <label>Payment Status:</label>
        <select
          name="Payment_status"
          value={sellerData.Payment_status}
          onChange={handleChange}
        >
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      {/* <div className="payment-sub-card">
          <h4>Payment Details</h4>
          {sellerData.payments.map((payment, index) => (
            <div key={index} className="payment-entry">
              <input
                type="number"
                placeholder="Payment Amount"
                value={payment.amount}
                onChange={(e) =>
                  handlePaymentChange(index, "amount", e.target.value)
                }
                disabled={sellerData.Payment_status.toLowerCase() !== "yes"}
              />
              <input
                type="date"
                placeholder="Payment Date"
                value={payment.date}
                onChange={(e) =>
                  handlePaymentChange(index, "date", e.target.value)
                }
                disabled={sellerData.Payment_status.toLowerCase() !== "yes"}
              />
              
              <button
                type="button"
                className="remove-payment"
                onClick={() => removePayment(index)}
              >
                X
              </button>
              <div className="interest">
                Interest: {calculateIndividualInterest(payment.date)}
              </div>
            </div>
          ))}
          <button className="add-payment" onClick={addPayment} disabled={sellerData.Payment_status.toLowerCase() !== "yes"}>
            Add Payment
          </button>
        </div> */}
      {/* Only show the payments section if Payment_status is 'Yes' */}
      {(sellerData?.Payment_status || "").toLowerCase() === "yes" && (
        <div className="payment-sub-card">
          <h4>Payment Details</h4>
          { (sellerData.payments || []).map((payment, index) => (
          // {sellerData.payments.map((payment, index) => (
            <div key={index} className="payment-entry">
              <input
                type="text"
                placeholder="Payment Amount"
                value={payment.amount}
                // onChange={(e) =>
                //   handlePaymentChange(index, "amount", e.target.value)
                // }
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*\.?\d*$/.test(value)) { // Allow only digits and an optional single decimal point
                    handlePaymentChange(index, "amount", value);
                  }
                }}
              />
              {/* <input
                type="date"
                placeholder="Payment Date"
                value={payment.date}
                onChange={(e) =>
                  handlePaymentChange(index, "date", e.target.value)
                }
              /> */}
              <ReactDatePicker
                                  selected={payment.date ? new Date(payment.date) : null}
                                  onChange={(date) => handledateChange(index,date)}
                                  dateFormat="dd/MM/yyyy" // Adjust date format for display
                                  placeholderText="Select a date"
                                  className="form-control"
                                  isClearable
                                />
              {/* Remove payment entry button */}
              <button
                type="button"
                className="remove-payment"
                onClick={() => removePayment(index)}
              >
                X
              </button>
              <div className="interest">
                Interest: {calculateIndividualInterest(payment.date)}
              </div>
            </div>
          ))}
          <button className="add-payment" onClick={addPayment}>
            Add Payment
          </button>
        </div>
      )}


      <div className="form-group">
        <label>Balance Amount:</label>
        <input
          type="text"
          value={formatCurrency(balanceAmount)}
          readOnly
        />
      </div>
    </div>
  );
};

export default SellerCard;
