// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import PurchaserCard from "./PurchaserCard";
// import SellerCard from "./SellerCard";
// import BalanceDetails from "./BalanceDetails";
// import { Modal, Button } from "react-bootstrap";
// import "./AddData.css";
// import { formatCurrency, calculateInterest } from "../../utils/formatINR";
// import { calculateBalances } from "../../utils/balanceUtils";

// const AddData = () => {
//   const [LotNumber, setLotNumber] = useState("");
//   const [purchaserData, setPurchaserData] = useState({});
//   const [sellerData, setSellerData] = useState({});
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [showWarning, setShowWarning] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);

//   const handleLotNumberChange = async (e) => {
//     const LotNumber = e.target.value;
//     setLotNumber(LotNumber);
  
//     // Clear data if input is invalid (less than 4 digits)
//     if (!/^\d{4}$/.test(LotNumber)) {
//       setPurchaserData({
//         BillNumber: "",
//         PurchaserName: "",
//         PurchaserAddress: "",
//         GSTNumber: "",
//         NumberOfBales: "",
//         Quantity: "",
//         Rate: "",
//         Amount: "",
//         GST_Percent: "",
//         GST: "",
//         Hamali: "",
//         Payment_status: "",
//         ShopExpenses: "",
//         Cartage: "",
//         OtherExpenses: "",
//         Category: "",
//         PurchaseDate: "",
//         NoteType: "None",
//         purchaserNotes: [{ Nbales: "", Nquantity: "", Namount: "", Nrate: "", NGST_Percent: "", NGST: "" }],
//         paymentts: [{ amount: "", date: "" }],
//       });
  
//       setSellerData({
//         BillNumber: "",
//         SellerName: "",
//         SellerAddress: "",
//         GSTNumber: "",
//         NumberOfBales: "",
//         Quantity: "",
//         Rate: "",
//         Amount: "",
//         GST_Percent: "",
//         GST: "",
//         Hamali: "",
//         Payment_status: "",
//         ShopExpenses: "",
//         LorryFright: "",
//         OtherExpenses: "",
//         SellDate: "",
//         NoteType: "None",
//         sellerNotes: [{ Nbales: "", Nquantity: "", Namount: "", Nrate: "", NGST_Percent: "", NGST: "" }],
//         payments: [{ amount: "", date: "" }],
//       });
  
//       setIsEditMode(false); // Reset edit mode
//       return; // Exit the function early
//     }
  
//     // Fetch data if input is exactly 4 digits
//     if (/^\d{4}$/.test(LotNumber)) {
//       try {
//         const response = await fetch(`http://localhost:5000/api/fetch-data/${LotNumber}`);
//         if (response.ok) {
//           const data = await response.json();
  
//           if (data.purchaser.length>0 || data.sellers.length>0) {
//             setIsEditMode(true); // Enable edit mode if data exists
//           } else {
//             setIsEditMode(false); // Disable edit mode for new data
//           }
  
//           // Fetch and set Purchaser data
//           if (data.purchaser && data.purchaser.length > 0) {
//             const fetchedPurchaser = data.purchaser[0];
//             setPurchaserData({
//               BillNumber: fetchedPurchaser.BillNumber || "",
//               PurchaserName: fetchedPurchaser.PurchaserName || "",
//               PurchaserAddress: fetchedPurchaser.PurchaserAddress || "",
//               GSTNumber: fetchedPurchaser.GSTNumber || "",
//               NumberOfBales: fetchedPurchaser.NumberOfBales || "",
//               Quantity: fetchedPurchaser.Quantity || "",
//               Rate: fetchedPurchaser.Rate || "",
//               Amount: fetchedPurchaser.Amount || "",
//               GST_Percent: fetchedPurchaser.GST_Percent || "",
//               GST: fetchedPurchaser.GST || "",
//               Hamali: fetchedPurchaser.Hamali || "",
//               Payment_status: fetchedPurchaser.Payment_status || "",
//               ShopExpenses: fetchedPurchaser.ShopExpenses || "",
//               Cartage: fetchedPurchaser.Cartage || "",
//               OtherExpenses: fetchedPurchaser.OtherExpenses || "",
//               Category: fetchedPurchaser.Category || "",
//               PurchaseDate: fetchedPurchaser.PurchaseDate || "",
//               NoteType: fetchedPurchaser.NoteType || "None",
//               purchaserNotes: fetchedPurchaser.NoteType === "Credit" || fetchedPurchaser.NoteType === "Debit"
//                 ? fetchedPurchaser.purchaserNotes.map((note) => ({
//                   Nbales: note.Nbales || "",
//                   Nquantity: note.Nquantity || "",
//                   Nrate: note.Nrate || "",
//                   Namount: note.Namount || "",
//                   NGST: note.NGST || "",
//                   NGST_Percent: note.NGST_Percent || "",
//                 }))
//                 : [],
//               paymentts: fetchedPurchaser.paymentts.map((paymentt) => ({
//                 amount: paymentt.amount || "",
//                 date: paymentt.date || "",
//               })),
//             });
//           }
  
//           // Fetch and set Seller data
//           if (data.sellers && data.sellers.length > 0) {
//             const fetchedSeller = data.sellers[0];
//             setSellerData({
//               BillNumber: fetchedSeller.BillNumber || "",
//               SellerName: fetchedSeller.SellerName || "",
//               SellerAddress: fetchedSeller.SellerAddress || "",
//               GSTNumber: fetchedSeller.GSTNumber || "",
//               NumberOfBales: fetchedSeller.NumberOfBales || "",
//               Quantity: fetchedSeller.Quantity || "",
//               Rate: fetchedSeller.Rate || "",
//               Amount: fetchedSeller.Amount || "",
//               GST_Percent: fetchedSeller.GST_Percent || "",
//               GST: fetchedSeller.GST || "",
//               Hamali: fetchedSeller.Hamali || "",
//               Payment_status: fetchedSeller.Payment_status || "",
//               ShopExpenses: fetchedSeller.ShopExpenses || "",
//               LorryFright: fetchedSeller.LorryFright || "",
//               OtherExpenses: fetchedSeller.OtherExpenses || "",
//               SellDate: fetchedSeller.SellDate || "",
//               NoteType: fetchedSeller.NoteType || "None",
//               sellerNotes: fetchedSeller.NoteType === "Credit" || fetchedSeller.NoteType === "Debit"
//                 ? fetchedSeller.sellerNotes.map((note) => ({
//                   Nbales: note.Nbales || "",
//                   Nquantity: note.Nquantity || "",
//                   Nrate: note.Nrate || "",
//                   Namount: note.Namount || "",
//                   NGST: note.NGST || "",
//                   NGST_Percent: note.NGST_Percent || "",
//                 }))
//                 : [],
//               payments: fetchedSeller.payments.map((payment) => ({
//                 amount: payment.amount || "",
//                 date: payment.date || "",
//               })),
//             });
//           }
//         } else {
//           console.error("Failed to fetch data");
//         }
//       } catch (error) {
//         console.error("Error:", error);
//       }
//     }
//   };
    

//   const resetCards = () => {
//     setPurchaserData({
//       BillNumber: "",
//       PurchaserName: "",
//       PurchaserAddress: "",
//       GSTNumber: "",
//       NumberOfBales: "",
//       Quantity: "",
//       Rate: "",
//       Amount: "",
//       GST_Percent: "",
//       GST: "",
//       Hamali: "",
//       Payment_status: "",
//       ShopExpenses: "",
//       Cartage: "",
//       OtherExpenses: "",
//       Category: "",
//       PurchaseDate: "",
//       NoteType: "None",
//       purchaserNotes: [{ Nbales: "", Nquantity: "", Namount: "", Nrate: "", NGST_Percent: "", NGST: "" }],
//       paymentts: [{ amount: "", date: "" }],
//     });
//     setSellerData({
//       BillNumber: "",
//       SellerName: "",
//       SellerAddress: "",
//       GSTNumber: "",
//       NumberOfBales: "",
//       Quantity: "",
//       Rate: "",
//       Amount: "",
//       GST_Percent: "",
//       GST: "",
//       Hamali: "",
//       Payment_status: "",
//       ShopExpenses: "",
//       LorryFright: "",
//       OtherExpenses: "",
//       SellDate: "",
//       NoteType: "None",
//       sellerNotes: [{ Nbales: "", Nquantity: "", Namount: "", Nrate: "", NGST_Percent: "", NGST: "" }],
//       payments: [{ amount: "", date: "" }],
//     });
//   };

//   const handleSubmit = async () => {
//     // Validate mandatory fields
//     if (!purchaserData.PurchaserName || !purchaserData.Quantity) {
//       alert("Purchaser details are mandatory for a new Lot Number.");
//       return;
//     }

//     console.log("Seller Data Before Submission:", sellerData);
    
//     // Prepare payload for submission
//     const payload = {
//       purchaser: purchaserData.PurchaserName
//         ? [
//           {
//             BillNumber: purchaserData.BillNumber,
//             PurchaserName: purchaserData.PurchaserName,
//             PurchaserAddress: purchaserData.PurchaserAddress,
//             GSTNumber: purchaserData.GSTNumber,
//             NumberOfBales: purchaserData.NumberOfBales,
//             Quantity: purchaserData.Quantity,
//             Rate: purchaserData.Rate,
//             Amount: purchaserData.Amount,
//             GST_Percent: purchaserData.GST_Percent,
//             GST: purchaserData.GST,
//             LotNumber: LotNumber,
//             Hamali: purchaserData.Hamali || null,
//             Payment_status: purchaserData.Payment_status,
//             ShopExpenses: purchaserData.ShopExpenses || null,
//             Cartage: purchaserData.Cartage || null,
//             OtherExpenses: purchaserData.OtherExpenses || null,
//             Category: purchaserData.Category || "None",
//             PurchaseDate: purchaserData.PurchaseDate,
//             NoteType: purchaserData.NoteType || "None",
//             purchaserNotes:
//               purchaserData.NoteType === "Credit" || purchaserData.NoteType === "Debit"
//                 ? purchaserData.purchaserNotes.map((note) => ({
//                   Nbales: note.Nbales || null,
//                   Nquantity: note.Nquantity || null,
//                   Nrate: note.Nrate || null,
//                   Namount: note.Namount || null,
//                   NGST: note.NGST || null,
//                   NGST_Percent: note.NGST_Percent || null,
//                 }))
//                 : [],
//             paymentts:
//               purchaserData.Payment_status === "Yes"
//                 ? purchaserData.paymentts.map((paymentt) => ({
//                   amount: paymentt.amount,
//                   date: paymentt.date,
//                 }))
//                 : [],
//             // paymentts:
//             //   purchaserData.Payment_status === "Yes"
//             //     ? purchaserData.paymentts
//             //       .filter((paymentt) => paymentt.amount && paymentt.date) // Remove empty entries
//             //       .map((paymentt) => ({
//             //         amount: paymentt.amount,
//             //         date: paymentt.date,
//             //       }))
//             //     : [],

//           },
//         ]
//         : [],
//       sellers: sellerData.SellerName
//         ? [
//           {
//             BillNumber: sellerData.BillNumber,
//             SellerName: sellerData.SellerName,
//             SellerAddress: sellerData.SellerAddress,
//             GSTNumber: sellerData.GSTNumber,
//             NumberOfBales: sellerData.NumberOfBales,
//             Quantity: sellerData.Quantity,
//             Rate: sellerData.Rate,
//             Amount: sellerData.Amount,
//             GST_Percent: sellerData.GST_Percent,
//             GST: sellerData.GST,
//             LotNumber: LotNumber,
//             Hamali: sellerData.Hamali || null,
//             Payment_status: sellerData.Payment_status,
//             ShopExpenses: sellerData.ShopExpenses || null,
//             LorryFright: sellerData.LorryFright || null,
//             OtherExpenses: sellerData.OtherExpenses || null,
//             SellDate: formatDate(sellerData.SellDate),
//             NoteType: sellerData.NoteType || "None",
//             sellerNotes:
//               sellerData.NoteType === "Credit" || sellerData.NoteType === "Debit"
//                 ? sellerData.sellerNotes.map((note) => ({
//                   Nbales: note.Nbales || null,
//                   Nquantity: note.Nquantity || null,
//                   Nrate: note.Nrate || null,
//                   Namount: note.Namount || null,
//                   NGST: note.NGST || null,
//                   NGST_Percent: note.NGST_Percent || null,
//                 }))
//                 : [],
//             payments:
//               sellerData.Payment_status === "Yes"
//                 ? sellerData.payments.map((payment) => ({
//                   amount: payment.amount || null,
//                   date: payment.date || null,
//                 }))
//                 : [],
//           },
//         ]
//         : [],
//     };

//     console.log("Payload:", payload);

//     // Ensure at least purchaser or seller data is sent
//     if (payload.purchaser.length === 0 && payload.sellers.length === 0) {
//       alert("No data to submit.");
//       return;
//     }

//     try {
//       // Determine API endpoint and method based on edit mode
//       const endpoint = isEditMode
//         ? `http://localhost:5000/api/update-data/${LotNumber}`
//         : "http://localhost:5000/api/submit-data";
//       const method = isEditMode ? "PUT" : "POST";

//       // API call to backend
//       const response = await axios({
//         method,
//         url: endpoint,
//         data: payload,
//       });

//       if (response.status === 200) {
//         const message = isEditMode
//           ? "Data updated successfully!"
//           : "Data saved successfully!";
//         alert(message);
//         resetCards();
//         setLotNumber("");
//         setIsEditMode(false); // Reset edit mode after successful submission
//       }
//     } catch (error) {
//       alert("An error occurred. Please try again.");
//       console.error("Error details:", error);
//     }
//   };
//   const formatDate = (date) => {
//     if (!date) return null;
//     const jsDate = new Date(date);
//     const year = jsDate.getFullYear();
//     const month = String(jsDate.getMonth() + 1).padStart(2, "0");
//     const day = String(jsDate.getDate()).padStart(2, "0");
//     return `${year}-${month}-${day}`;
//   };
  

//   const handleWarningConfirm = () => {
//     setShowWarning(false);
//     setShowConfirm(true);
//   };

//   return (
//     <div className="add-data-container">.
//       <h2 className="Manage">Manage Lot Data</h2>
//       <div className="lot-number-section">
//         <label>Enter Lot Number:</label>
//         <input
//           type="text"
//           value={LotNumber}
//           onChange={handleLotNumberChange}
//           maxLength={4}
//           placeholder="Enter a 4 digit Lot Number"
//         />
//       </div>
//       <p>
//   {isEditMode 
//     ? "You can update the existing data for this Lot Number."
//     : "Enter the details to add a new record for this Lot Number."
//   }
// </p>
      
//       <div className="cards-container">
//         <PurchaserCard
//           data={purchaserData}
//           setData={setPurchaserData}
//           isMandatory={true}
//         />
        
//         <SellerCard
//           data={sellerData}
//           setData={setSellerData}
//         />
//       </div>

//       <BalanceDetails
//         purchaserData={purchaserData}
//         sellerData={sellerData}
//         NoteType={purchaserData.NoteType} // Or wherever NoteType is coming from
//         purchaserNotes={purchaserData.purchaserNotes}
//         sellerNotes={sellerData.sellerNotes}
//       />


//       <div className="actions">
//         <button onClick={() => {
//             setShowWarning(true);
//           }}className="submit-button">
//           {isEditMode ? "Update Details" : "Add Details"}
//         </button>

//       </div>
      

//       {/* Warning Modal */}
//       <Modal show={showWarning} onHide={() => setShowWarning(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Warning: Modify Existing Data</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           You are about to modify existing data. Do you wish to continue?
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowWarning(false)}>
//             Cancel
//           </Button>
//           <Button variant="primary" onClick={handleWarningConfirm}>
//             Proceed
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Confirmation Modal */}
//       <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Confirm Submission</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>Are you sure you want to submit the data?</Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowConfirm(false)}>
//             Cancel
//           </Button>
//           <Button variant="primary" onClick={handleSubmit}>
//             Confirm
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
    
//   );
// };

// // Utility functions for defaults
// const defaultPurchaserValues = () => ({
//   numberOfBales: "",
//   quantity: "",
//   rate: "",
//   amount: "",
//   gstPercent: 0,
//   gst: 0,
//   hamali: 0,
//   paymentStatus: "No",
//   shopExpenses: 0,
//   cartage: 0,
//   otherExpenses: 0,
//   paymentDate: "",
//   purchaseDate: "",
// });

// const defaultSellerValues = () => ({
//   numberOfBales: "",
//   quantity: "",
//   rate: "",
//   amount: "",
//   gstPercent: 0,
//   gst: 0,
//   hamali: 0,
//   paymentReceived: "",
//   paymentDate: "",
//   lorryFright: 0,
//   otherExpenses: 0,
//   shopExpenses: 0,
//   paymentStatus: "No",
// });

// export default AddData;

import React, { useState, useEffect } from "react";
import axios from "axios";
import PurchaserCard from "./PurchaserCard";
import SellerCard from "./SellerCard";
import BalanceDetails from "./BalanceDetails";
import { Modal, Button } from "react-bootstrap";
import "./AddData.css";
import { formatCurrency, calculateInterest } from "../../utils/formatINR";
import { calculateBalances } from "../../utils/balanceUtils";
import Autosave from "./forms/AutoSave";
import { jwtDecode } from "jwt-decode";

const AddData = () => {
  const [LotNumber, setLotNumber] = useState("");
  const [purchaserData, setPurchaserData] = useState({});
  const [sellerData, setSellerData] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleLotNumberChange = async (e) => {
    const LotNumber = e.target.value;
    setLotNumber(LotNumber);

    // Clear data if input is invalid (less than 4 digits)
    if (!/^\d{4}$/.test(LotNumber)) {
      setPurchaserData({
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
        Hamali: "",
        Payment_status: "",
        ShopExpenses: "",
        Cartage: "",
        OtherExpenses: "",
        Category: "",
        PurchaseDate: "",
        NoteType: "None",
        purchaserNotes: [{ Nbales: "", Nquantity: "", Namount: "", Nrate: "", NGST_Percent: "", NGST: "" }],
        paymentts: [{ amount: "", date: "" }],
      });

      setSellerData({
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
        Hamali: "",
        Payment_status: "",
        ShopExpenses: "",
        LorryFright: "",
        OtherExpenses: "",
        SellDate: "",
        NoteType: "None",
        sellerNotes: [{ Nbales: "", Nquantity: "", Namount: "", Nrate: "", NGST_Percent: "", NGST: "" }],
        payments: [{ amount: "", date: "" }],
      });

      setIsEditMode(false); // Reset edit mode
      return; // Exit the function early
    }

    // Fetch data if input is exactly 4 digits
    if (/^\d{4}$/.test(LotNumber)) {
      const token = localStorage.getItem("token");
    
      if (!token) {
        console.error("Token not found in local storage");
        return;
      }
    
      try {
        const decoded = jwtDecode(token);
        const adminId = decoded.adminId || decoded.id;
    
        const response = await fetch(`http://localhost:5000/api/fetch-data/${LotNumber}?adminId=${adminId}`);
        if (response.ok) {
          const data = await response.json();
    
          setIsEditMode(data.purchaser.length > 0 || data.sellers.length > 0);
    
          // Purchaser data
          if (data.purchaser && data.purchaser.length > 0) {
            const fetchedPurchaser = data.purchaser[0];
            setPurchaserData({
              Company: fetchedPurchaser.Company || "",
              BillNumber: fetchedPurchaser.BillNumber || "",
              PurchaserName: fetchedPurchaser.PurchaserName || "",
              PurchaserAddress: fetchedPurchaser.PurchaserAddress || "",
              GSTNumber: fetchedPurchaser.GSTNumber || "",
              NumberOfBales: fetchedPurchaser.NumberOfBales || "",
              Quantity: fetchedPurchaser.Quantity || "",
              Rate: fetchedPurchaser.Rate || "",
              Amount: fetchedPurchaser.Amount || "",
              GST_Percent: fetchedPurchaser.GST_Percent || "",
              GST: fetchedPurchaser.GST || "",
              Hamali: fetchedPurchaser.Hamali || "",
              Payment_status: fetchedPurchaser.Payment_status || "",
              ShopExpenses: fetchedPurchaser.ShopExpenses || "",
              Cartage: fetchedPurchaser.Cartage || "",
              OtherExpenses: fetchedPurchaser.OtherExpenses || "",
              Category: fetchedPurchaser.Category || "",
              PurchaseDate: fetchedPurchaser.PurchaseDate || "",
              NoteType: fetchedPurchaser.NoteType || "None",
              purchaserNotes:
                fetchedPurchaser.NoteType === "Credit" || fetchedPurchaser.NoteType === "Debit"
                  ? fetchedPurchaser.purchaserNotes.map((note) => ({
                      Nbales: note.Nbales || "",
                      Nquantity: note.Nquantity || "",
                      Nrate: note.Nrate || "",
                      Namount: note.Namount || "",
                      NGST: note.NGST || "",
                      NGST_Percent: note.NGST_Percent || "",
                    }))
                  : [],
              paymentts: fetchedPurchaser.paymentts?.map((paymentt) => ({
                amount: paymentt.amount || "",
                date: paymentt.date || "",
              })) || [],
            });
          }
    
          // Seller data
          if (data.sellers && data.sellers.length > 0) {
            const fetchedSeller = data.sellers[0];
            setSellerData({
              Company: fetchedSeller.Company || "",
              BillNumber: fetchedSeller.BillNumber || "",
              SellerName: fetchedSeller.SellerName || "",
              SellerAddress: fetchedSeller.SellerAddress || "",
              GSTNumber: fetchedSeller.GSTNumber || "",
              NumberOfBales: fetchedSeller.NumberOfBales || "",
              Quantity: fetchedSeller.Quantity || "",
              Rate: fetchedSeller.Rate || "",
              Amount: fetchedSeller.Amount || "",
              GST_Percent: fetchedSeller.GST_Percent || "",
              GST: fetchedSeller.GST || "",
              Hamali: fetchedSeller.Hamali || "",
              Payment_status: fetchedSeller.Payment_status || "",
              ShopExpenses: fetchedSeller.ShopExpenses || "",
              LorryFright: fetchedSeller.LorryFright || "",
              OtherExpenses: fetchedSeller.OtherExpenses || "",
              SellDate: fetchedSeller.SellDate || "",
              NoteType: fetchedSeller.NoteType || "None",
              sellerNotes:
                fetchedSeller.NoteType === "Credit" || fetchedSeller.NoteType === "Debit"
                  ? fetchedSeller.sellerNotes.map((note) => ({
                      Nbales: note.Nbales || "",
                      Nquantity: note.Nquantity || "",
                      Nrate: note.Nrate || "",
                      Namount: note.Namount || "",
                      NGST: note.NGST || "",
                      NGST_Percent: note.NGST_Percent || "",
                    }))
                  : [],
              payments: fetchedSeller.payments?.map((payment) => ({
                amount: payment.amount || "",
                date: payment.date || "",
              })) || [],
            });
          }
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };    
  const resetCards = () => {
    setPurchaserData({
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
      Hamali: "",
      Payment_status: "",
      ShopExpenses: "",
      Cartage: "",
      OtherExpenses: "",
      Category: "",
      PurchaseDate: "",
      NoteType: "None",
      purchaserNotes: [{ Nbales: "", Nquantity: "", Namount: "", Nrate: "", NGST_Percent: "", NGST: "" }],
      paymentts: [{ amount: "", date: "" }],
    });
    setSellerData({
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
      Hamali: "",
      Payment_status: "",
      ShopExpenses: "",
      LorryFright: "",
      OtherExpenses: "",
      SellDate: "",
      NoteType: "None",
      sellerNotes: [{ Nbales: "", Nquantity: "", Namount: "", Nrate: "", NGST_Percent: "", NGST: "" }],
      payments: [{ amount: "", date: "" }],
    });
  };

  const handleSubmit = async () => {
    // Validate mandatory fields
    if (!purchaserData.PurchaserName || !purchaserData.Quantity) {
      alert("Purchaser details are mandatory for a new Lot Number.");
      return;
    }
  
    console.log("Seller Data Before Submission:", sellerData);
  
    let endpoint = "http://localhost:5000/api/submit-data";
    let method = "POST";
  
    // Check if purchaser exists but seller is empty
    if (purchaserData.PurchaserName && !sellerData.SellerName) {
      const confirmAddSeller = window.confirm(
        "Purchaser data is present but no seller data. Do you want to add seller data?"
      );
  
      if (!confirmAddSeller) {
        // sellerData = {};
        setSellerData({});
        endpoint = isEditMode
          ? `http://localhost:5000/api/update-data/${LotNumber}`
          : "http://localhost:5000/api/submit-data";
        method = isEditMode ? "PUT" : "POST";
      } else {
        endpoint = `http://localhost:5000/api/insert-seller-data/${LotNumber}`;
        method = "POST";
      }
    }
    const token = localStorage.getItem("token");
    
      if (!token) {
        console.error("Token not found in local storage");
        return;
      }
    const decoded = jwtDecode(token);
    const adminId = decoded.adminId || decoded.id;
    
  
    // Prepare payload for submission
    let payload = {
      
      adminId,
      purchaser: purchaserData.PurchaserName
        ? [{
            Company: purchaserData.Company || "",
            BillNumber: purchaserData.BillNumber,
            PurchaserName: purchaserData.PurchaserName,
            PurchaserAddress: purchaserData.PurchaserAddress,
            GSTNumber: purchaserData.GSTNumber,
            NumberOfBales: purchaserData.NumberOfBales,
            Quantity: purchaserData.Quantity,
            Rate: purchaserData.Rate,
            Amount: purchaserData.Amount,
            GST_Percent: purchaserData.GST_Percent,
            GST: purchaserData.GST,
            LotNumber: LotNumber,
            Hamali: purchaserData.Hamali || null,
            Payment_status: purchaserData.Payment_status,
            ShopExpenses: purchaserData.ShopExpenses || null,
            Cartage: purchaserData.Cartage || null,
            OtherExpenses: purchaserData.OtherExpenses || null,
            Category: purchaserData.Category || "None",
            PurchaseDate: purchaserData.PurchaseDate,
            NoteType: purchaserData.NoteType || "None",
            purchaserNotes:
              purchaserData.NoteType === "Credit" || purchaserData.NoteType === "Debit"
                ? purchaserData.purchaserNotes.map((note) => ({
                    Nbales: note.Nbales || null,
                    Nquantity: note.Nquantity || null,
                    Nrate: note.Nrate || null,
                    Namount: note.Namount || null,
                    NGST: note.NGST || null,
                    NGST_Percent: note.NGST_Percent || null,
                  }))
                : [],
            paymentts:
              purchaserData.Payment_status === "Yes"
                ? purchaserData.paymentts.map((paymentt) => ({
                    amount: paymentt.amount,
                    date: paymentt.date,
                  }))
                : [],
          }]
        : [],
      sellers: sellerData.SellerName
        ? [{
            Company: sellerData.Company || "",
            BillNumber: sellerData.BillNumber,
            SellerName: sellerData.SellerName,
            SellerAddress: sellerData.SellerAddress,
            GSTNumber: sellerData.GSTNumber,
            NumberOfBales: sellerData.NumberOfBales,
            Quantity: sellerData.Quantity,
            Rate: sellerData.Rate,
            Amount: sellerData.Amount,
            GST_Percent: sellerData.GST_Percent,
            GST: sellerData.GST,
            LotNumber: LotNumber,
            Hamali: sellerData.Hamali || null,
            Payment_status: sellerData.Payment_status,
            ShopExpenses: sellerData.ShopExpenses || null,
            LorryFright: sellerData.LorryFright || null,
            OtherExpenses: sellerData.OtherExpenses || null,
            SellDate: formatDate(sellerData.SellDate),
            NoteType: sellerData.NoteType || "None",
            sellerNotes:
              sellerData.NoteType === "Credit" || sellerData.NoteType === "Debit"
                ? sellerData.sellerNotes.map((note) => ({
                    Nbales: note.Nbales || null,
                    Nquantity: note.Nquantity || null,
                    Nrate: note.Nrate || null,
                    Namount: note.Namount || null,
                    NGST: note.NGST || null,
                    NGST_Percent: note.NGST_Percent || null,
                  }))
                : [],
            payments:
              sellerData.Payment_status === "Yes"
                ? sellerData.payments.map((payment) => ({
                    amount: payment.amount || null,
                    date: payment.date || null,
                  }))
                : [],
          }]
        : [],
    };
  
    console.log("Payload:", payload);
  
    // Ensure at least purchaser or seller data is sent
    if (payload.purchaser.length === 0 && payload.sellers.length === 0) {
      alert("No data to submit.");
      return;
    }
  
    try {
      const response = await axios({
        method,
        url: endpoint,
        data: payload,
      });
  
      if (response.status === 200) {
        const message = isEditMode
          ? "Data updated successfully!"
          : "Data saved successfully!";
        alert(message);
        resetCards();
        setLotNumber("");
        setIsEditMode(false);
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
      console.error("Error details:", error);
    }
  };
  

  const formatDate = (date) => {
    if (!date) return null;
    const jsDate = new Date(date);
    const year = jsDate.getFullYear();
    const month = String(jsDate.getMonth() + 1).padStart(2, "0");
    const day = String(jsDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleWarningConfirm = () => {
    setShowWarning(false);
    setShowConfirm(true);
  };

  return (
    <Autosave autosaveKey="formData">
      <div className="add-data-container">
        <h2 className="Manage">Manage Lot Data</h2>
        <div className="lot-number-section">
          <label>Enter Lot Number:</label>
          <input
            type="text"
            value={LotNumber}
            onChange={handleLotNumberChange}
            maxLength={4}
            placeholder="Enter a 4 digit Lot Number"
          />
        </div>
        <p>
          {isEditMode
            ? "You can update the existing data for this Lot Number."
            : "Enter the details to add a new record for this Lot Number."
          }
        </p>

        <div className="cards-container">
          <PurchaserCard
            data={purchaserData}
            setData={setPurchaserData}
            isMandatory={true}
          />

          <SellerCard
            data={sellerData}
            setData={setSellerData}
          />
        </div>

        <BalanceDetails
          purchaserData={purchaserData}
          sellerData={sellerData}
          NoteType={purchaserData.NoteType}
          purchaserNotes={purchaserData.purchaserNotes}
          sellerNotes={sellerData.sellerNotes}
        />

        <div className="actions">
          <button
            onClick={() => {
              setShowWarning(true);
            }}
            className="submit-button"
          >
            {isEditMode ? "Update Details" : "Add Details"}
          </button>
        </div>

        {/* Warning Modal */}
        <Modal show={showWarning} onHide={() => setShowWarning(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Warning: Modify Existing Data</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            You are about to modify existing data. Do you wish to continue?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowWarning(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleWarningConfirm}>
              Proceed
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Confirmation Modal */}
        <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Submission</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to submit the data?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowConfirm(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Autosave>
  );
};

export default AddData;