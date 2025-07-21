// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import './HomePage.css'; // Add custom styles here
// // import RetrieveData from './RetrieveData';
// // import AddData from './AddData';
// // import Inventory from './Inventory';
// // import Report from './ReportPage';

// const HomePage = ({ setCurrentPage }) => {
//   const [overallInventory, setOverallInventory] = useState({ TotalBalanceBales: 0, TotalBalanceQuantity: 0 });
//   const [loading, setLoading] = useState(false);

//   const fetchInventoryData = async () => {
//     setLoading(true);
//     try {
//       const endpoint = `http://localhost:5000/api/inventory-data`;
//       const response = await axios.get(endpoint);

//       if (response.status === 200 && response.data.overallInventory) {
//         setOverallInventory(response.data.overallInventory);
//       }
//     } catch (error) {
//       console.error('Error fetching inventory data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };
//   const [pendingPayments, setPendingPayments] = useState(0);

//   const fetchPendingPayments = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/pending-payments');
//       if (response.status === 200) {
//         setPendingPayments(response.data.totalPendingPayments);
//       }
//     } catch (error) {
//       console.error('Error fetching pending payments:', error);
//     }
//   };

//   const [receivingPayments, setrecevingPayments] = useState(0);

//   const fetchrecevingPayments = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/receiving-payments');
//       if (response.status === 200) {
//         setrecevingPayments(response.data.totalReceivablePayments);
//       }
//     } catch (error) {
//       console.error('Error fetching Receivable payments:', error);
//     }
//   };

//   const [netProfitLoss, setNetProfitLoss] = useState(0);
//   const fetchNetProfitLoss = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/net-profit');
//       if (response.status === 200) {
//         setNetProfitLoss(response.data.netProfitLoss);
//       }
//     } catch (error) {
//       console.error('Error fetching net profit/loss:', error);
//     }
//   };

//   useEffect(() => {
//     fetchInventoryData();
//     fetchPendingPayments();
//     fetchNetProfitLoss();
//     fetchrecevingPayments();
//   }, []);

  

//   const formatCurrencyLakhs = (value) => {
//     if (value == null || isNaN(value)) return "₹0.00L";
  
//     // Convert to lakhs
//     const valueInLakhs = value / 100000;
  
//     return `₹${new Intl.NumberFormat("en-IN", {
//       maximumFractionDigits: 2, // Show up to 2 decimal places
//     }).format(valueInLakhs)}L`;
//   };
  
  


//   function formatToIndianNumberingSystem(number) {
  
  
//     const [integerPart, decimalPart] = number.toString().split('.');
  
//     // Format the integer part
//     const lastThreeDigits = integerPart.slice(-3);
//     const otherDigits = integerPart.slice(0, -3);
  
//     const formattedInteger =
//       otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + (otherDigits ? ',' : '') + lastThreeDigits;
  
//     // Append decimal part if it exists
//     return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
//   }
  

//   return (
//     <div className="homepage-container">
//       {/* Header Section */}
//        {/* <header className="header">
//         <div className="logo">ST Project</div>
//         <nav className="navbar">
//            <a href="#" onClick={() => setCurrentPage('home')} className="nav-item">Dashboard</a>
//           <a href="#" onClick={() => setCurrentPage('View Lots')} className="nav-item">Lots Management</a>
//           <a href="#" onClick={() => setCurrentPage('add-data')} className="nav-item">Add Data</a>
//           <a href="#" onClick={() => setCurrentPage('inventory')} className="nav-item">Inventory</a>
//           <a href="#" onClick={() => setCurrentPage('report')} className="nav-item">Reports</a>
//         </nav>
//         <div className="user-profile">👤</div>
//       </header> */} 

//       {/* Main Section */}
//       <main className="main-content">
//         {/* Welcome Banner */}
//         <section className="welcome-banner">
//           <h1>Welcome to the Track Business</h1>
//           <p>Simplifying Financial and Inventory Management</p>
//         </section>

//         {/* Quick Access Panels */}
//         <section className="quick-access">
//           <h2>Quick Access</h2>
//           <div className="tiles-container">
//             <a href="#" onClick={() => setCurrentPage('add-data')} className="tile">
//               <div className="icon">➕</div>
//               <p>Add New Lot</p>
//             </a>
//             <a href="#" onClick={() => setCurrentPage('View Lots')} className="tile">
//               <div className="icon">📋</div>
//               <p>View Lots</p>
//             </a>
//             <a href="#" onClick={() => setCurrentPage('inventory')} className="tile">
//               <div className="icon">📦</div>
//               <p>Check Inventory</p>
//             </a>
//             <a href="#" onClick={() => setCurrentPage('report')} className="tile">
//               <div className="icon">📊</div>
//               <p>Generate Reports</p>
//             </a>
//             <a href="#" onClick={() => setCurrentPage('activity')} className="tile">
//               <div className="icon">🔍</div>
//               <p>Recent Activity</p>
//             </a>
//           </div>
//         </section>

//         {/* Analytics Overview */}
//         <section className="analytics-overview">
//           <h2>Analytics Overview</h2>
//           <div className="analytics-container">
//             <div className="analytics-card">
//               <h3>Total Bales</h3>
//               <p>{formatToIndianNumberingSystem(overallInventory.TotalBalanceBales) || 0}</p>
//             </div>
//             <div className="analytics-card">
//               <h3>Receivable Payments</h3>
//               <p>{formatCurrencyLakhs(receivingPayments)}</p>
//             </div>
//             <div className="analytics-card">
//               <h3>Pending Payments</h3>
//               <p>{formatCurrencyLakhs(pendingPayments)}</p>
//             </div>
//             <div className="analytics-card">
//               <h3>Net P & L</h3>
//               <p>{formatCurrencyLakhs(netProfitLoss)}</p>
//             </div>
//             <div className="analytics-card">
//               <h3>Upcoming Deadlines</h3>
//               <p>5 Payments Due</p>
//             </div>
//           </div>
//         </section>
//       </main>

//       {/* Footer Section */}
//       <footer className="footer">
//         <p>© 2024 Track Business. All rights reserved.</p>
//         <div className="footer-links">
//           <Link to="/privacy">Privacy Policy</Link>
//           <Link to="/terms">Terms of Service</Link>
//           <Link to="/help">Help</Link>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default HomePage;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import './HomePage2.css'; // Add custom styles here
import AdminDashboard from './AdminDashBoard'; // Import AdminDashboard
import UserDashboard from './UserDashBoard'; // Import UserDashboard
import ImageCarousel from './ImageCarousel';
import {jwtDecode} from 'jwt-decode';

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
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
      const adminId = decoded.adminId || decoded.id;
  
      if (!adminId) {
        throw new Error('Admin ID not found in token.');
      }
  
      const endpoint = `http://localhost:5000/api/inventory-data?adminId=${adminId}`;
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

  // const fetchInventoryData = async () => {
  //   setLoading(true);
  //   try {
  //     const endpoint = `http://localhost:5000/api/inventory-data`;
  //     const response = await axios.get(endpoint);

  //     if (response.status === 200 && response.data.overallInventory) {
  //       setOverallInventory(response.data.overallInventory);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching inventory data:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const fetchPendingPayments = async () => {
  //   try {
  //     const response = await axios.get('http://localhost:5000/api/pending-payments');
  //     if (response.status === 200) {
  //       setPendingPayments(response.data.totalPendingPayments);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching pending payments:', error);
  //   }
  // };
  // const fetchPendingPayments = async () => {
  //   try {
  //     const response = await axios.get('http://localhost:5000/api/pending-payments');
  //     if (response.status === 200) {
  //       setPendingPayments(response.data.totalPendingPayments);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching pending payments:', error);
  //   }
  // };

  // const fetchReceivingPayments = async () => {
  //   try {
  //     const response = await axios.get('http://localhost:5000/api/receiving-payments');
  //     if (response.status === 200) {
  //       setReceivingPayments(response.data.totalReceivablePayments);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching Receivable payments:', error);
  //   }
  // };
  const fetchPendingPayments = async () => {
    try {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
      const adminId = decoded.adminId || decoded.id;
  
      if (!adminId) {
        throw new Error('Admin ID not found in token.');
      }
  
      const response = await axios.get(`http://localhost:5000/api/pending-payments?adminId=${adminId}`);
      if (response.status === 200) {
        setPendingPayments(response.data.totalPendingPayments);
      }
    } catch (error) {
      console.error('Error fetching pending payments:', error);
    }
  };
  
  const fetchReceivingPayments = async () => {
    try {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
      const adminId = decoded.adminId || decoded.id;
  
      if (!adminId) {
        throw new Error('Admin ID not found in token.');
      }
  
      const response = await axios.get(`http://localhost:5000/api/receiving-payments?adminId=${adminId}`);
      if (response.status === 200) {
        setReceivingPayments(response.data.totalReceivablePayments);
      }
    } catch (error) {
      console.error('Error fetching receivable payments:', error);
    }
  };

  // const fetchNetProfitLoss = async () => {
  //   try {
  //     const response = await axios.get('http://localhost:5000/api/net-profit');
  //     if (response.status === 200) {
  //       setNetProfitLoss(response.data.netProfitLoss);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching net profit/loss:', error);
  //   }
  // };
  const fetchNetProfitLoss = async () => {
    try {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
      const adminId = decoded.adminId || decoded.id;
  
      if (!adminId) {
        throw new Error('Admin ID not found in token.');
      }
  
      const response = await axios.get(`http://localhost:5000/api/net-profit?adminId=${adminId}`);
      if (response.status === 200) {
        setNetProfitLoss(response.data.netProfitLoss);
      }
    } catch (error) {
      console.error('Error fetching net profit/loss payments:', error);
    }
  };


  useEffect(() => {
    fetchInventoryData();
    fetchPendingPayments();
    fetchNetProfitLoss();
    fetchReceivingPayments();

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
  const images = [
    'TB1.png',
    'CLE ARA NCE.png',
    'TB1.png',
  ];

  
  return (
    <div className="homepage-container">
      {/* Main Section */}
      <main className="main-content">
        {/* Welcome Banner */}
        {/* <section className="slider">
          <img src="/welcome.jpg" />
        </section> */}
        <section className="welcome-banner">
        {/* <img className='slider' src="/welcome.jpg" /> */}
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
            {/* <div onClick={() => navigate("/activity")} className="tile">
                <div className="icon">🔍</div>
                <p>Recent Activity</p>
            </div> */}
        </div>
        </section>

        {/* Analytics Overview */}
        <section className="analytics-overview">
          <h2>Analytics Overview</h2>
          <div className="analytics-container">
          <div className="analytics-card">
              <h3>Stock Quantity</h3>
              <p>{formatToIndianNumberingSystem(overallInventory.TotalBalanceQuantity) || 0}</p>
            </div>
            <div className="analytics-card">
              <h3>Bales in Stock</h3>
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
            {/* <div className="analytics-card">
              <h3>Upcoming Deadlines</h3>
              <p>5 Payments Due</p>
            </div> */}
          </div>
        </section>

        {/* */} </main> 

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


//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import './HomePage.css'; // Add custom styles here
// import RetrieveData from './RetrieveData';
// import AddData from './AddData';
// import Inventory from './Inventory';
// import Report from './ReportPage';

// import Chart from 'chart.js/auto'; // Example for chart implementation

// const HomePage = ({ setCurrentPage }) => {
//   const [overallInventory, setOverallInventory] = useState({ TotalBalanceBales: 0, TotalBalanceQuantity: 0 });
//   const [loading, setLoading] = useState(false);
//   const [pendingPayments, setPendingPayments] = useState(0);
//   const [netProfitLoss, setNetProfitLoss] = useState(0);
//   const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');

//   const fetchInventoryData = async () => {
//     setLoading(true);
//     try {
//       const endpoint = `http://localhost:5000/api/inventory-data`;
//       const response = await axios.get(endpoint);

//       if (response.status === 200 && response.data.overallInventory) {
//         setOverallInventory(response.data.overallInventory);
//       }
//     } catch (error) {
//       console.error('Error fetching inventory data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchPendingPayments = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/pending-payments');
//       if (response.status === 200) {
//         setPendingPayments(response.data.totalPendingPayments);
//       }
//     } catch (error) {
//       console.error('Error fetching pending payments:', error);
//     }
//   };

//   const fetchNetProfitLoss = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/net-profit');
//       if (response.status === 200) {
//         setNetProfitLoss(response.data.netProfitLoss);
//       }
//     } catch (error) {
//       console.error('Error fetching net profit/loss:', error);
//     }
//   };

//   const fetchUpcomingDeadlines = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/upcoming-deadlines');
//       if (response.status === 200) {
//         setUpcomingDeadlines(response.data.deadlines);
//       }
//     } catch (error) {
//       console.error('Error fetching deadlines:', error);
//     }
//   };

//   useEffect(() => {
//     fetchInventoryData();
//     fetchPendingPayments();
//     fetchNetProfitLoss();
//     fetchUpcomingDeadlines();
//   }, []);

//   const formatCurrencyLakhs = (value) => {
//     if (value == null || isNaN(value)) return "₹0.00L";
//     const valueInLakhs = value / 100000;
//     return `₹${new Intl.NumberFormat("en-IN", {
//       maximumFractionDigits: 2,
//     }).format(valueInLakhs)}L`;
//   };

//   const formatToIndianNumberingSystem = (number) => {
//     const [integerPart, decimalPart] = number.toString().split('.');
//     const lastThreeDigits = integerPart.slice(-3);
//     const otherDigits = integerPart.slice(0, -3);
//     const formattedInteger =
//       otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + (otherDigits ? ',' : '') + lastThreeDigits;
//     return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
//   };

//   const handleSearch = (event) => {
//     setSearchQuery(event.target.value);
//   };

//   return (
//     <div className="homepage-container">
//       <header className="header">
//         <div className="logo">ST Project</div>
//         <input
//           type="text"
//           placeholder="Search..."
//           value={searchQuery}
//           onChange={handleSearch}
//           className="search-bar"
//         />
//         <div className="user-profile">🔔 {upcomingDeadlines.length} Pending</div>
//       </header>

//       <main className="main-content">
//         <section className="welcome-banner">
//           <h1>Welcome to the Track Business</h1>
//           <p>Simplifying Financial and Inventory Management</p>
//         </section>

//         <section className="quick-access">
//           <h2>Quick Access</h2>
//           <div className="tiles-container">
//             <a href="#" onClick={() => setCurrentPage('add-data')} className="tile">
//               <div className="icon">➕</div>
//               <p>Add New Lot</p>
//             </a>
//             <a href="#" onClick={() => setCurrentPage('View Lots')} className="tile">
//               <div className="icon">📋</div>
//               <p>View Lots</p>
//             </a>
//             <a href="#" onClick={() => setCurrentPage('inventory')} className="tile">
//               <div className="icon">📦</div>
//               <p>Check Inventory</p>
//             </a>
//             <a href="#" onClick={() => setCurrentPage('report')} className="tile">
//               <div className="icon">📊</div>
//               <p>Generate Reports</p>
//             </a>
//             <a href="#" onClick={() => setCurrentPage('activity')} className="tile">
//               <div className="icon">🔍</div>
//               <p>Recent Activity</p>
//             </a>
//           </div>
//         </section>

//         <section className="analytics-overview">
//           <h2>Analytics Overview</h2>
//           {loading ? (
//             <p>Loading...</p>
//           ) : (
//             <div className="analytics-container">
//               <div className="analytics-card">
//                 <h3>Total Bales</h3>
//                 <p>{formatToIndianNumberingSystem(overallInventory.TotalBalanceBales) || 0}</p>
//               </div>
//               <div className="analytics-card">
//                 <h3>Receivable Payments</h3>
//                 <p>{formatCurrencyLakhs(pendingPayments)}</p>
//               </div>
//               <div className="analytics-card">
//                 <h3>Pending Payments</h3>
//                 <p>{formatCurrencyLakhs(pendingPayments)}</p>
//               </div>
//               <div className="analytics-card">
//                 <h3>Net P & L</h3>
//                 <p>{formatCurrencyLakhs(netProfitLoss)}</p>
//               </div>
//               <div className="analytics-card">
//                 <h3>Upcoming Deadlines</h3>
//                 <p>{upcomingDeadlines.length} Payments Due</p>
//               </div>
//             </div>
//           )}
//         </section>
//       </main>

//       <footer className="footer">
//         <p>© 2024 Track Business. All rights reserved.</p>
//         <div className="footer-links">
//           <Link to="/privacy">Privacy Policy</Link>
//           <Link to="/terms">Terms of Service</Link>
//           <Link to="/help">Help</Link>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default HomePage;
