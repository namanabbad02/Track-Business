
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import './HomePage.css'; // Add custom styles here
import AdminDashboard from './AdminDashBoard'; // Import AdminDashboard
import UserDashboard from './UserDashBoard'; // Import UserDashboard

const HomePage = ({ setCurrentPage }) => {
  const [overallInventory, setOverallInventory] = useState({ TotalBalanceBales: 0, TotalBalanceQuantity: 0 });
  const [loading, setLoading] = useState(false);
  const [pendingPayments, setPendingPayments] = useState(0);
  const [receivingPayments, setReceivingPayments] = useState(0);
  const [netProfitLoss, setNetProfitLoss] = useState(0);
  const [userRole, setUserRole] = useState(null); // To store the user's role

  const fetchInventoryData = async () => {
    setLoading(true);
    try {
      const endpoint = `http://localhost:5000/api/inventory-data`;
      const response = await axios.get(endpoint);

      if (response.status === 200 && response.data.overallInventory) {
        setOverallInventory(response.data.overallInventory);
      }
    } catch (error) {
      console.error('Error fetching inventory data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingPayments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/pending-payments');
      if (response.status === 200) {
        setPendingPayments(response.data.totalPendingPayments);
      }
    } catch (error) {
      console.error('Error fetching pending payments:', error);
    }
  };

  const fetchReceivingPayments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/receiving-payments');
      if (response.status === 200) {
        setReceivingPayments(response.data.totalReceivablePayments);
      }
    } catch (error) {
      console.error('Error fetching Receivable payments:', error);
    }
  };

  const fetchNetProfitLoss = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/net-profit');
      if (response.status === 200) {
        setNetProfitLoss(response.data.netProfitLoss);
      }
    } catch (error) {
      console.error('Error fetching net profit/loss:', error);
    }
  };

  const fetchUserRole = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/auth/user-role', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserRole(response.data.role);
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  useEffect(() => {
    fetchInventoryData();
    fetchPendingPayments();
    fetchNetProfitLoss();
    fetchReceivingPayments();
    fetchUserRole();
  }, []);

  const formatCurrencyLakhs = (value) => {
    if (value == null || isNaN(value)) return "₹0.00L";

    const valueInLakhs = value / 100000;

    return `₹${new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 2,
    }).format(valueInLakhs)}L`;
  };

  function formatToIndianNumberingSystem(number) {
    const [integerPart, decimalPart] = number.toString().split('.');

    const lastThreeDigits = integerPart.slice(-3);
    const otherDigits = integerPart.slice(0, -3);

    const formattedInteger =
      otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + (otherDigits ? ',' : '') + lastThreeDigits;

    return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
  }

  const navigate = useNavigate();
  
  return (
    <div className="homepage-container">
      {/* Main Section */}
      <main className="main-content">
        {/* Welcome Banner */}
        <section className="welcome-banner">
          <h1>Welcome to the Track Business</h1>
          <p>Simplifying Financial and Inventory Management</p>
        </section>

        {/* Quick Access Panels */}
        <section className="quick-access">
          <h2>Quick Access</h2>
          <div className="tile-container">
            <div onClick={() => navigate("/add-data")} className="tile">
                <div className="icon">➕</div>
                <p>Add New Lot</p>
            </div>
            <div onClick={() => navigate("/view-lots")} className="tile">
                <div className="icon">📋</div>
                <p>View Lots</p>
            </div>
            <div onClick={() => navigate("/inventory")} className="tile">
                <div className="icon">📦</div>
                <p>Check Inventory</p>
            </div>
            <div onClick={() => navigate("/report")} className="tile">
                <div className="icon">📊</div>
                <p>Generate Reports</p>
            </div>
            <div onClick={() => navigate("/activity")} className="tile">
                <div className="icon">🔍</div>
                <p>Recent Activity</p>
            </div>
        </div>
        </section>

        {/* Analytics Overview */}
        <section className="analytics-overview">
          <h2>Analytics Overview</h2>
          <div className="analytics-container">
            <div className="analytics-card">
              <h3>Total Bales</h3>
              <p>{formatToIndianNumberingSystem(overallInventory.TotalBalanceBales) || 0}</p>
            </div>
            <div className="analytics-card">
              <h3>Receivable Payments</h3>
              <p>{formatCurrencyLakhs(receivingPayments)}</p>
            </div>
            <div className="analytics-card">
              <h3>Pending Payments</h3>
              <p>{formatCurrencyLakhs(pendingPayments)}</p>
            </div>
            <div className="analytics-card">
              <h3>Net P & L</h3>
              <p>{formatCurrencyLakhs(netProfitLoss)}</p>
            </div>
            <div className="analytics-card">
              <h3>Upcoming Deadlines</h3>
              <p>5 Payments Due</p>
            </div>
          </div>
        </section>

        {/* Conditional Dashboard Rendering */}
        {userRole === 'admin' ? <AdminDashboard /> : userRole === 'user' ? <UserDashboard /> : null}
      </main>

      {/* Footer Section */}
      <footer className="footer">
        <p>© 2024 Track Business. All rights reserved.</p>
        <div className="footer-links">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
          <Link to="/help">Help</Link>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;