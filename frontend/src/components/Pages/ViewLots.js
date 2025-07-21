import React, { useEffect, useState } from "react";
import axios from "axios";
import { DatePicker, InputNumber, Button, notification } from "antd";
import moment from "moment";
import "./ViewLots.css";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


const LotCards = ({ setCurrentPage }) => {
  const [lotsData, setLotsData] = useState([]);
  const [filteredLots, setFilteredLots] = useState([]);
  const [lotRange, setLotRange] = useState([0, 1000]); // Lot Number range
  const [dateRange, setDateRange] = useState([null, null]); // Date range for Purchase or Sell
  const [filtersApplied, setFiltersApplied] = useState(false); // Track if filters are applied

  // useEffect(() => {
  //   axios
  //     .get("http://localhost:5000/api/lot")
  //     .then((response) => {
  //       setLotsData(response.data);
  //       setFilteredLots(response.data);
  //     })
  //     .catch((error) => console.error("Error fetching lot data:", error));
  // }, []);
  


  useEffect(() => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      console.error("Token not found in local storage");
      return;
    }
  
    try {
      const decoded = jwtDecode(token);
      const userId = decoded.adminId || decoded.id; // Use adminId if present, else id
  
      axios
        .get(`http://localhost:5000/api/lot?adminId=${userId}`)
        .then((response) => {
          setLotsData(response.data);
          setFilteredLots(response.data);
        })
        .catch((error) => console.error("Error fetching lot data:", error));
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, []);
  
  
  

  const formatDate = (datee) => {
    if (!datee) return "Yet to Purchase/Sell";
    const date = new Date(datee);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };



  const navigate = useNavigate();
  
  const handleLotClick = (lotNumber) => {
    localStorage.setItem("selectedLotNumber", lotNumber);
    navigate(`/retrieve-lots/${lotNumber}`); // Redirect to RetrieveData page
  };
  const handleFilterChange = () => {
    // Validate lot range
    if (lotRange[0] > lotRange[1]) {
      notification.error({
        message: 'Invalid Lot Range',
        description: 'The start of the lot range cannot be greater than the end.',
        placement: 'topRight',
      });
      return;
    }

    const filtered = lotsData.filter(lot => {
      const lotNumberInRange = lot.LotNumber >= lotRange[0] && lot.LotNumber <= lotRange[1];

      const isWithinDateRange = (date) => {
        if (!date || !dateRange[0] || !dateRange[1]) return true;
        const selectedStart = moment(dateRange[0]);
        const selectedEnd = moment(dateRange[1]);
        const lotDate = moment(date);
        return lotDate.isBetween(selectedStart, selectedEnd, null, "[]");
      };

      return lotNumberInRange && (isWithinDateRange(lot.PurchaseDate) || isWithinDateRange(lot.SellDate));
    });

    setFilteredLots(filtered);
    setFiltersApplied(true);
  };

  const resetFilters = () => {
    setLotRange([0, 1000]);
    setDateRange([null, null]);
    setFilteredLots(lotsData);
    setFiltersApplied(false);
  };

  return (
    <div className="lot-cards-container">
      <div className="filters">
        <div className="lot-range-filter">
          <span>Lot Number Range:</span>
          <InputNumber
            min={0}
            value={lotRange[0]}
            onChange={(value) => setLotRange([value, lotRange[1]])}
            className="lot-range-input"
          />
          <span>to</span>
          <InputNumber
            min={0}
            value={lotRange[1]}
            onChange={(value) => setLotRange([lotRange[0], value])}
            className="lot-range-input"
          />
        </div>

        <div className="date-range-filter">
          <span>Date Range:</span>
          <DatePicker.RangePicker
            value={dateRange}
            onChange={(dates) => setDateRange(dates)}
            format="YYYY-MM-DD"
          />
        </div>

        <Button type="primary" onClick={handleFilterChange}>Apply Filters</Button>

        {filtersApplied && (
          <Button type="default" onClick={resetFilters} className="reset-btn">
            Reset Filters
          </Button>
        )}
      </div>

      <div className="lot-cards">
        {filteredLots.map((lot) => (
          <div
            key={lot.LotNumber}
            className="lot-card"
            onClick={() => handleLotClick(lot.LotNumber)}
          >
            <h2 className="lot-number">Lot Number: {lot.LotNumber}</h2>
            <div className="lot-info">
              <p><strong>Purchaser:</strong> {lot.PurchaserName}</p>
              <p><strong>Purchase Date:</strong> {formatDate(lot.PurchaseDate)}</p>
              <p><strong>Seller:</strong> {lot.SellerName}</p>
              <p><strong>Sell Date:</strong> {formatDate(lot.SellDate)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LotCards;


