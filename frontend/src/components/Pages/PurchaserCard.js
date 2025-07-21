import React, { useState, useEffect, useRef } from "react";
import "./PurchaserCard.css"; // Include styles for a clean UI
import { formatCurrency } from "../../utils/formatINR"; // Helper for INR formatting
import axios from "axios";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const PurchaserCard = ({ data, setData, isMandatory }) => {
  
  const [purchaserData, setPurchaserData] = useState({
    Company: "", 
    BillNumber: "",
    PurchaserName: "",
    PurchaserAddress: "",
    GSTNumber: "",
    NumberOfBales: "",
    Quantity: "",
    Rate: "",
    Amount: "",
    GST_Percent: "",
    GST: "",
    PurchaseDate: "",
    Hamali: "",
    ShopExpenses: "",
    Cartage: "",
    OtherExpenses: "",
    Category: "",
    Payment_status: "No",
    LotNumber: "",
    //-----------------
    NoteType: "",
    purchaserNotes: [{ Nbales: "", Nquantity: "", Namount: "", Nrate: "", NGST_Percent: "", NGST: "" }],
    paymentts: [{ amount: "", date: "" }],
    //-----------------
  });
  //-----------------------
  const [balanceAmount, setBalanceAmount] = useState(0);
//-----------------------------

  const [suggestions, setSuggestions] = useState([]);

  // Fetch suggestions based on input
  const [highlightIndex, setHighlightIndex] = useState(-1);

  // Fetch suggestions based on input
  
  const suggestionsRef = useRef(null); // Reference to the suggestions list for scrolling

  // Fetch suggestions based on input
  const handleNameChange = async (e) => {
    const inputName = e.target.value;
    setPurchaserData((prev) => ({ ...prev, PurchaserName: inputName }));

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
    setPurchaserData((prev) => ({
      ...prev,
      PurchaserName: suggestion.Name,
      PurchaserAddress: suggestion.Address,
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
      setPurchaserData({ ...data });
      //-----------------
      calculateBalance(data);
      //-----------------
    }
  }, [data]);

  useEffect(() => {
    console.log("Suggestions updated:", suggestions);
  }, [suggestions]);
  

  // Handle field changes
  const [editingAmount, setEditingAmount] = useState(false); // Track edit mode
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedData = { ...purchaserData, [name]: value };
  
    if (name === "Rate" || name === "Quantity") {
      const rate = parseFloat(updatedData.Rate || 0);
      const quantity = parseFloat(updatedData.Quantity || 0);
  
      if (!updatedData.manualAmount) {
        const calculatedAmount = (rate * 0.2812 * quantity * 10).toFixed(2);
        updatedData.Amount = calculatedAmount;
      }
    }
  
    if (name === "Amount") {
      updatedData.manualAmount = true;
      updatedData.Amount = value; // Store raw value
    }
  
    if (name === "Rate" || name === "Quantity" || name === "Amount" || name === "GST_Percent") {
      const amount = parseFloat(updatedData.Amount || 0);
      const gstPercent = parseFloat(updatedData.GST_Percent || 0);
      updatedData.GST = ((amount * gstPercent) / 100).toFixed(2);
    }
  
    setPurchaserData(updatedData);
    setData(updatedData);
    //-----------------
    calculateBalance(updatedData);
    //-----------------
  };
  

  const handleAmountFocus = () => {
    setEditingAmount(true); // Switch to raw value on focus
  };

  const handleAmountBlur = () => {
    setEditingAmount(false); // Format value on blur
  };

  //--------------------------------------------------------------------
  // const calculateBalance = (updatedData) => {
  //   // Ensure `paymentts` is a valid array
  //   const paymentts = Array.isArray(updatedData?.paymentts) ? updatedData.paymentts : [];

  //   // Calculate total payments
  //   const totalPayments = paymentts.reduce(
  //     (total, payment) => total + parseFloat(payment.amount || 0),
  //     0
  //   );

  //   // Calculate the adjusted Amount, considering purchaserNotes (Credit adds, Debit subtracts)
  //   let adjustedAmount = parseFloat(updatedData?.Amount || 0);

  //   if (Array.isArray(updatedData?.purchaserNotes)) {
  //     updatedData.purchaserNotes.forEach(note => {
  //       const nAmount = parseFloat(note.NAmount || 0);
  //       if (purchaserData.NoteType === "Credit") {
  //         adjustedAmount += nAmount;  // Add for Credit
  //       } else if (purchaserData.NoteType === "Debit") {
  //         adjustedAmount -= nAmount;  // Subtract for Debit
  //       }
  //     });
  //   }

  //   // Calculate balance
  //   const balance = adjustedAmount - totalPayments;

  //   // Set the calculated balance
  //   setBalanceAmount(balance);
  // };
  const calculateBalance = (updatedData) => {
    const paymentts = Array.isArray(updatedData?.paymentts) ? updatedData.paymentts : [];
  
    // Step 1: Base Amount + GST
    const baseAmount = parseFloat(updatedData?.Amount || 0);
    const baseGST = parseFloat(updatedData?.GST || 0);
    let adjustedAmount = baseAmount + baseGST;
  
    // Step 2: Add/Subtract Note Amounts + GST
    if (Array.isArray(updatedData?.purchaserNotes)) {
      updatedData.purchaserNotes.forEach(note => {
        const nAmount = parseFloat(note.Namount || 0); // ✅ fixed casing here
        const nGST = parseFloat(note.NGST || 0);
  
        if (updatedData.NoteType === "Credit") {
          adjustedAmount += (nAmount + nGST);
        } else if (updatedData.NoteType === "Debit") {
          adjustedAmount -= (nAmount + nGST);
        }
      });
    }
  
    // Step 3: Subtract payments
    const totalPayments = paymentts.reduce(
      (total, payment) => total + parseFloat(payment.amount || 0),
      0
    );
  
    const balance = adjustedAmount - totalPayments;
    setBalanceAmount(balance);
  };
  
  



  // Add new payment entry
  const addPayment = () => {
    const updatedpaymentts = [...purchaserData.paymentts, { amount: "", date: "" }];
    setPurchaserData({ ...purchaserData, paymentts: updatedpaymentts });
  };

  // Remove a payment entry
  const removePayment = (index) => {
    const updatedpaymentts = purchaserData.paymentts.filter((_, idx) => idx !== index);
    setPurchaserData({ ...purchaserData, paymentts: updatedpaymentts });
    calculateBalance({ ...purchaserData, paymentts: updatedpaymentts });
  };

  // Update payment entry
  // const handlePaymentChange = (index, field, value) => {
  //   const updatedpaymentts = purchaserData.paymentts.map((paymentt, idx) =>
  //     idx === index ? { ...paymentt, [field]: value } : paymentt
  //   );
  //   const totalpaymentts = updatedpaymentts.reduce(
  //     (total, paymentt) => total + parseFloat(paymentt.amount || 0),
  //     0
  //   );

  //   if (totalpaymentts <= parseFloat(purchaserData.Amount)) {
  //     setPurchaserData({ ...purchaserData, paymentts: updatedpaymentts });
  //     calculateBalance({ ...purchaserData, paymentts: updatedpaymentts });
  //   } else {
  //     alert("Total payments cannot exceed the Amount");
  //   }
  // };
  const handlePaymentChange = (index, field, value) => {
    const updatedpaymentts = purchaserData.paymentts.map((paymentt, idx) =>
      idx === index ? { ...paymentt, [field]: value } : paymentt
    );
    const totalpaymentts = updatedpaymentts.reduce(
      (total, paymentt) => total + parseFloat(paymentt.amount || 0),
      0
    );
  
    if (totalpaymentts <= parseFloat(purchaserData.Amount)) {
      setPurchaserData({ ...purchaserData, paymentts: updatedpaymentts });
      setData({ ...purchaserData, paymentts: updatedpaymentts }); // Propagate the updated paymentts to AddData.js
      calculateBalance({ ...purchaserData, paymentts: updatedpaymentts });
    } else {
      alert("Total payments cannot exceed the Amount");
    }
  };


  const calculateIndividualInterest = (paymentDate) => {
    const PurchaseDate = new Date(purchaserData.PurchaseDate);
    const paymentReceivedDate = new Date(paymentDate);
    const timeDiff = paymentReceivedDate - PurchaseDate;
    const daysPast = timeDiff / (1000 * 3600 * 24); // Convert time difference to days
    const interestRate = 0.012; // 2% interest rate
    if (daysPast > 30) {
      const interest = ((parseFloat(purchaserData.Amount || 0) * interestRate * daysPast) / 365).toFixed(2);
      return formatCurrency(interest);
    }
    return "0.00";
  };
  //-----------------------------

  
  const handleBlur = (e) => {
    const { name, value } = e.target;
  
    if (name === "Amount") {
      let updatedData = { ...purchaserData };
      updatedData.Amount = formatCurrency(parseFloat(value || 0));
      setPurchaserData(updatedData);
      setData(updatedData);
    }
  };

  const handleNoteChange = (e, index, field) => {
    const { value } = e.target;
    const updatedNotes = [...purchaserData.purchaserNotes];
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
    setPurchaserData({ ...purchaserData, purchaserNotes: updatedNotes });

  };
  
  
  
  
  const handleDateChange = (date) => {
    // Format the date to YYYY-MM-DD
    const formattedDate = date ? date.toISOString().split('T')[0] : "";
    // Update the date in purchaserData
    handleChange({ target: { name: "PurchaseDate", value: formattedDate } });
  };
  const handledateChange = (index, date) => {
    const formattedDate = date ? date.toISOString().split('T')[0] : "";
    const updatedpaymentts = purchaserData.paymentts.map((paymentt, idx) =>
      idx === index ? { ...paymentt, date: formattedDate } : paymentt
    );
  
    setPurchaserData({ ...purchaserData, paymentts: updatedpaymentts });
    setData({ ...purchaserData, paymentts: updatedpaymentts }); // propagate the changes
    calculateBalance({ ...purchaserData, paymentts: updatedpaymentts });
  };
  
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear();
  
    return `${day}/${month}/${year}`;
  };
  

  return (
    
    <div className="purchaser-card">
      
      <h3 className="purchaser">Purchaser Details {isMandatory && <span className="mandatory">*</span>}</h3>
      
      {/* <div className="form-group">
      <label>Purchase Date:</label>
      <ReactDatePicker
        selected={
          purchaserData.PurchaseDate
            ? new Date(formatDate(purchaserData.PurchaseDate)) // Convert string to Date
            : null // Handle empty or invalid date
        }
        onChange={handleDateChange}
        dateFormat="dd-MM-yyyy" // Adjust date format
        placeholderText="Select a date"
        className="form-control" // Add styling if needed
        isClearable // Optional: Adds a clear button
      />
    </div> */}
      
      <div className="form-group">
        <label>Select Company:</label>
        <select
          name="Company"
          value={purchaserData.Company}
          onChange={handleChange}
        >Select Company
          <option value="">Select Company</option>
          <option value="Varsha Cotton Company">Varsha Cotton Company</option>
          <option value="Sampat Traders">Sampat Traders</option>
          <option value="Madan Traders">Madan Traders</option>
        </select>
      </div>
      
      <div className="form-group">
        <label>Purchase Date:</label>
        <ReactDatePicker
          selected={purchaserData.PurchaseDate ? new Date(purchaserData.PurchaseDate) : null}
          onChange={(date) => handleDateChange(date)}
          dateFormat="dd/MM/yyyy" // Adjust date format for display
          placeholderText="Select a date"
          className="form-control"
          isClearable
        />
      </div>
      
      
      
      <div className="form-group">
        <label>Bill Number</label>
        <input
          type="text"
          name="BillNumber"
          value={purchaserData.BillNumber}
          onChange={handleChange}
          // onChange={(e) => {
          //   const value = e.target.value;
            
          //   // Convert input to uppercase (allows both text and numbers)
          //   handleChange({
          //     ...e,
          //     target: {
          //       ...e.target,
          //       value: value.toUpperCase(),
          //     },
          //   });
          // }}
          placeholder="Enter Bill Number"
        />
      </div>
      <div className="input-group">
      <label>Purchaser Name</label>
      <textarea
        name="PurchaserName"
        value={purchaserData.PurchaserName || ""}
        onChange={handleNameChange}
        onKeyDown={handleKeyDown}
        placeholder="Enter purchaser name"
        rows="2"
        required={isMandatory}
      />
      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion.master_ID}
              onClick={() => handleSuggestionSelect(suggestion)}
              className={index === highlightIndex ? "highlight" : ""}
            >
              {/* {getAutocompletedName(suggestion, purchaserData.PurchaserName)} */}
              <strong>{suggestion.Name}</strong>
              <br />
              <small>{suggestion.Address}</small>
              {/* {getSuggestedText(purchaserData.PurchaserName, suggestion)} */}
            </li>
          ))}
        </ul>
      )}
    </div>

      <div className="input-group">
        <label>Purchaser Address</label>
        <textarea
          name="PurchaserAddress"
          value={purchaserData.PurchaserAddress || ""}
          onChange={handleChange}
          placeholder="Enter purchaser address"
          rows="4"
          required={isMandatory}
        />
      </div>

      <div className="form-group">
        <label>GST Number</label>
        <input
          type="text"
          name="GSTNumber"
          value={purchaserData.GSTNumber || ""}
          onChange={handleChange}
          placeholder="Enter GST Number"
        />
      </div>

      <div className="form-group">
        <label>Bales:</label>
        <input
          type="text"
          name="NumberOfBales"
          value={purchaserData.NumberOfBales}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value)) {
              handleChange(e); // Call the existing handleChange function only for valid input
            }
          }}
          placeholder="Enter Number of Bales"
        />
      </div>
      <div className="form-group">
        <label>Quantity:</label>
        <div style={{ display: "flex", alignItems: "center" }}>
        <input
          type="text"
          name="Quantity"
          value={purchaserData.Quantity}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*\.?\d*$/.test(value)) { // Allow only digits and an optional single decimal point
              handleChange(e);
            }
          }}
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
          name="Rate"
          value={purchaserData.Rate}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*\.?\d*$/.test(value)) { // Allow only digits and an optional single decimal point
              handleChange(e);
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
            editingAmount
              ? purchaserData.Amount // Show raw value while editing
              : formatCurrency(purchaserData.Amount) // Show formatted value when not editing
          }
          onChange={handleChange}
          onFocus={handleAmountFocus}
          onBlur={handleAmountBlur}
        />
      </div>
      <div className="form-group">
        <label>GST Percent:</label>
        <select
          name="GST_Percent"
          value={purchaserData.GST_Percent}
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
          value={formatCurrency(purchaserData.GST)}
          readOnly
        />
      </div>

      {/* NoteType Field */}
      <div className="form-group">
        <label>Credit/Debit Note</label>
        <select
          name="NoteType"
          value={purchaserData.NoteType || ""}
          onChange={handleChange}
        >
          <option value="None">Select Note Type</option>
          <option value="Credit">Credit</option>
          <option value="Debit">Debit</option>
        </select>
      </div>

      {(purchaserData.NoteType === "Credit" || purchaserData.NoteType === "Debit") && (
        <div className="payment-sub-card">
          <h4>{purchaserData.NoteType} Note</h4>
          {(purchaserData.purchaserNotes || []).map((note, index) => (
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
                    editingAmount
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
          type="text"
          name="Hamali"
          value={purchaserData.Hamali}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*\.?\d*$/.test(value)) { // Allow only digits and an optional single decimal point
              handleChange(e);
            }
          }}
          placeholder="Enter Hamali"
        />
      </div>
      <div className="form-group">
        <label>Shop Expenses:</label>
        <input
          type="text"
          name="ShopExpenses"
          value={purchaserData.ShopExpenses}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*\.?\d*$/.test(value)) { // Allow only digits and an optional single decimal point
              handleChange(e);
            }
          }}
          placeholder="Enter Shop Expenses"
        />
      </div>
      <div className="form-group">
        <label>Cartage:</label>
        <input
          type="text"
          name="Cartage"
          value={purchaserData.Cartage}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*\.?\d*$/.test(value)) { // Allow only digits and an optional single decimal point
              handleChange(e);
            }
          }}
          placeholder="Enter Cartage"
        />
      </div>
      <div className="form-group">
        <label>Other Expenses:</label>
        <input
          type="text"
          name="OtherExpenses"
          value={purchaserData.OtherExpenses}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*\.?\d*$/.test(value)) { // Allow only digits and an optional single decimal point
              handleChange(e);
            }
          }}
          placeholder="Enter Other Expenses"
        />
      </div>
      {/* <div className="form-group">
        <label>Purchase Date:</label>
        <input
          type="date"
          name="PurchaseDate"
          value={purchaserData.PurchaseDate}
          onChange={handleChange}
        />
      </div> */}
      <div className="form-group">
        <label>Payment Status:</label>
        <select
          name="Payment_status"
          value={purchaserData.Payment_status}
          onChange={handleChange}
        >
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
      {/* {purchaserData.Payment_status === "Yes" && (
        <div className="form-group">
          <label>Payment Date:</label>
          <input
            type="date"
            name="PaymentDate"
            value={purchaserData.PaymentDate}
            onChange={handleChange}
          />
        </div>
      )} */}

      {(purchaserData?.Payment_status || "").toLowerCase() === "yes"
        && (
          <div className="payment-sub-card">
            <h4>Payment Details</h4>
            {purchaserData.paymentts.map((paymentt, index) => (
              <div key={index} className="payment-entry">
                <input
                  type="text"
                  placeholder="Payment Amount"
                  value={paymentt.amount}
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
                <div>
                  {/* <input
                  type="date"
                  placeholder="Payment Date"
                  value={paymentt.date}

                  onChange={(e) =>
                    handlePaymentChange(index, "date", e.target.value)
                  }
                /> */}
                  <ReactDatePicker
                    selected={paymentt.date ? new Date(paymentt.date) : null}
                    onChange={(date) => handledateChange(index,date)}
                    dateFormat="dd/MM/yyyy" // Adjust date format for display
                    placeholderText="Select a date"
                    className="form-control"
                    isClearable
                  />
                </div>
                {/* <div>
                <ReactDatePicker
                  selected={paymentt.date ? new Date(paymentt.date) : null} // Convert to Date object or null if empty
                  onChange={(date) => handleDateChange(index, "date", date ? date.toISOString() : "")} // Update the date in ISO string format
                  dateFormat="dd-MM-yyyy"
                  placeholderText="Select Payment Date"
                  className="form-control" // Add any custom styling here
                  isClearable // Allow clearing the date
                /></div> */}
                {/* Remove payment entry button */}
                <button
                  type="button"
                  className="remove-payment"
                  onClick={() => removePayment(index)}
                >
                  X
                </button>
                <div className="interest">
                  Interest: {calculateIndividualInterest(paymentt.date)}
                </div>
              </div>
            ))}
            <button className="add-payment" onClick={addPayment}>
              Add Payment
            </button>
          </div>
        )}


      {/* <div className="form-group">
        <label>Payment Date:</label>
        <input
          type="date"
          name="PaymentDate"
          value={purchaserData.PaymentDate}
          onChange={handleChange}
          disabled={purchaserData.Payment_status !== "Yes"} // Disable if Payment_status is not "Yes"
        />
      </div> */}

      <div className="form-group">
        <label>Balance Amount:</label>
        <input
          type="text"
          value={formatCurrency(balanceAmount)}
          readOnly
        />
      </div>
      
      <div className="form-group">
        <label>Category</label>
        <select
          name="Category"
          value={purchaserData.Category}
          onChange={handleChange}
          placeholder="Enter Category"
        >
          <option value="none">None</option>
          <option value="stock in godown">Stock in Godown</option>
        </select>
      </div>
      {/* <div className="form-group">
        <label>Purchase Date:</label>
        <input
          type="text"
          name="PurchaseDate"
          value={formatDate(purchaserData.PurchaseDate) || ""}
          onChange={handleChange}
          placeholder={!purchaserData.PurchaseDate ? "dd-mm-yyyy" : ""} // Set placeholder only if no value exists
          onFocus={(e) => (e.target.type = "date")} // Switch to date input on focus
          onBlur={(e) => !e.target.value && (e.target.type = "text")} // Revert to text if empty
        />
      </div> */}
      {/* <div className="form-group">
        <label>Purchase Date:</label>
        <input
          type="text" // Use text input for a placeholder-like effect
          name="PurchaseDate"
          value={formatDate(purchaserData.PurchaseDate) || ""}
          onChange={handleChange}
          placeholder="dd-mm-yyyy"
          onFocus={(e) => (e.target.type = "date")} // Switch to date input on focus
          onBlur={(e) => !e.target.value && (e.target.type = "text")} // Revert to text if empty
        />
      </div> */}

    </div>
  );
};

export default PurchaserCard;
