// // AdminDashboard.js
// import React, { useState, useEffect } from 'react';

// const AdminDashboard = () => {
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       const response = await fetch('/admin/users', {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//       });
//       const data = await response.json();
//       setUsers(data);
//     };

//     fetchUsers();
//   }, []);

//   const handleCreateUser = async () => {
//     const name = prompt('Enter user name');
//     const username = prompt('Enter user username');
//     const userMail = prompt('Enter user mail');
//     const password = prompt('Enter user password');
//     const companyID = prompt('Enter company ID');

//     const response = await fetch('/admin/create-user', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
//       body: JSON.stringify({ name, username, userMail, password, companyID }),
//     });
//     const data = await response.json();
//     alert(data.message);
//     window.location.reload();
//   };

//   return (
//     <div>
//       <h1>Admin Dashboard</h1>
//       <button onClick={handleCreateUser}>Create User</button>
//       <ul>
//         {users.map((user) => (
//           <li key={user.userID}>{user.username} - {user.userMail}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default AdminDashboard;


// frontend/src/pages/AdminDashboard.js
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Outlet } from 'react-router-dom';

// const AdminDashboard = () => {
//   const [admin, setAdmin] = useState(null);
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     const fetchAdminDashboard = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const response = await axios.get('/api/auth/dashboard', {
//           headers: { Authorization: token },
//         });
//         setAdmin(response.data.admin);
//         setUsers(response.data.users);
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     fetchAdminDashboard();
//   }, []);

//   return (
//     <div>
//       <h2>Admin Dashboard</h2>
//       <Outlet />
//       <p>Welcome, {admin ? admin.fullName : ''}</p>
//       <h3>Users</h3>
//       <ul>
//         {users.map((user) => (
//           <li key={user.id}>{user.firstName} {user.lastName}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default AdminDashboard;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Outlet } from 'react-router-dom';
import "./AdminDashboard.css";
import ProfilePage from './ProfilePage';

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);
  const [users, setUsers] = useState([]);
  const [userName, setUserName] = useState('');
  const [userMail, setUserMail] = useState('');

  useEffect(() => {
    const fetchAdminDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token not found in localStorage');
          return;
        }
        const response = await axios.get('http://localhost:5000/api/auth/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdmin(response.data.admin);
        setUsers(response.data.users);
      } catch (error) {
        console.error('Failed to fetch admin dashboard:', error);
      }
    };
  
    fetchAdminDashboard();
  }, []);

  const handleCreateUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const adminId = admin.id; // Assuming admin object contains the adminId

      const response = await axios.post(
        'http://localhost:5000/api/auth/create-user',
        {
          userName,
          userMail,
          adminId, // Pass adminId along with user details
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      alert('User created successfully');
      setUserName('');
      setUserMail('');
  
      // Check if the response contains the updated list of users
      if (response.data && response.data.users) {
        setUsers(response.data.users);
      } else {
        // If not, fetch the users again
        const usersResponse = await axios.get('http://localhost:5000/api/auth/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(usersResponse.data.users);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data.error); // Show specific error message
      } else {
        alert('Failed to create user');
      }
      console.error('Failed to create user:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/auth/logout', null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem('token');
      alert('Logged out successfully');
      window.location.href = '/login'; // Redirect to login page
    } catch (error) {
      console.error('Failed to logout:', error);
      alert('Failed to logout');
    }
  };

  const handleDeleteAdminAccount = async () => {
    try {
      const token = localStorage.getItem('token');
      const adminId = admin.id; // Assuming admin object contains the adminId
      await axios.delete(`http://localhost:5000/api/auth/delete-admin-account/${adminId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem('token');
      alert('Admin account and all associated users deleted successfully');
      window.location.href = '/login'; // Redirect to login page
    } catch (error) {
      console.error('Failed to delete admin account:', error);
      alert('Failed to delete admin account');
    }
  };

  const handleLogoutUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/auth/logout-user/${userId}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('User logged out successfully');
      // Optionally, refresh the user list
      const usersResponse = await axios.get('http://localhost:5000/api/auth/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(usersResponse.data.users);
    } catch (error) {
      console.error('Failed to log out user:', error);
      alert('Failed to log out user');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/auth/delete-account/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('User account deleted successfully');
      // Optionally, refresh the user list
      const usersResponse = await axios.get('http://localhost:5000/api/auth/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(usersResponse.data.users);
    } catch (error) {
      console.error('Failed to delete user account:', error);
      alert('Failed to delete user account');
    }
  };

  return (
    // <div className="admin-dashboard">
    //   <h2>Admin Dashboard</h2>
    //   <Outlet />
    //   <p>Welcome, {admin ? admin.fullName : ''}</p>
    //   <section className="user-management">
    //     <h3>Create New User</h3>
    //     <form className="create-user-form">
    //       <div className="input-group">
    //         <label htmlFor="username">User Name</label>
    //         <input
    //           type="text"
    //           id="username"
    //           placeholder="User Name"
    //           value={userName}
    //           onChange={(e) => setUserName(e.target.value)}
    //         />
    //       </div>
    //       <div className="input-group">
    //         <label htmlFor="usermail">User Mail</label>
    //         <input
    //           type="email"
    //           id="usermail"
    //           placeholder="User Mail"
    //           value={userMail}
    //           onChange={(e) => setUserMail(e.target.value)}
    //         />
    //       </div>
    //       <button type="button" onClick={handleCreateUser}>Create User</button>
    //     </form>
    //     <h3>Active Users</h3>
    //     <ul className="user-list">
    //       {users.map((user) => (
    //         <li key={user.id} className="user-item">
    //           <div className="user-details">
    //             <span>{user.firstName} {user.lastName}</span>
    //             <span>Last Seen: {new Date(user.lastSeen).toLocaleString()}</span>
    //           </div>
    //           <div className="user-actions">
    //             <button onClick={() => handleLogoutUser(user.id)}>Logout User</button>
    //             <button onClick={() => handleDeleteUser(user.id)}>Delete User</button>
    //           </div>
    //         </li>
    //       ))}
    //     </ul>
    //     <div className="admin-actions">
    //       <button onClick={handleLogout}>Logout</button>
    //       <button onClick={handleDeleteAdminAccount}>Delete Admin Account</button>
    //     </div>
    //   </section>
    // </div>
<div className="dashboard-container">
  <h2 className="dashboard-title">Admin Dashboard</h2>
  <Outlet />
  <p className="welcome-message">Welcome, {admin ? admin.fullName : ''}</p>
  <section className="user-management">
    <h3 className="section-title">Create New User</h3>
    <div className="create-user-form">
      <input
        type="text"
        placeholder="User Name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        className="input-field"
      />
      <input
        type="email"
        placeholder="User Mail"
        value={userMail}
        onChange={(e) => setUserMail(e.target.value)}
        className="input-field"
      />
      <button onClick={handleCreateUser} className="action-button create">
        Create User
      </button>
    </div>
    <h3 className="section-title">Active Users</h3>
    <ul className="user-list">
      {users.map((user) => (
        <li key={user.id} className="user-item">
          {user.firstName} {user.lastName} - Last Seen: {new Date(user.lastSeen).toLocaleString()}
          <button onClick={() => handleLogoutUser(user.id)} className="action-button logout">
            Logout User
          </button>
          <button onClick={() => handleDeleteUser(user.id)} className="action-button delete">
            Delete User
          </button>
        </li>
      ))}
    </ul>
    <div className="admin-actions">
      <button onClick={handleLogout} className="action-button logout">
        Logout
      </button>
      <button onClick={handleDeleteAdminAccount} className="action-button delete">
        Delete Admin Account
      </button>
    </div>
  </section>
</div>
  );
};

export default AdminDashboard;


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import { BrowserRouter as Router, useNavigate } from "react-router-dom";
// import './HomePage.css'; // Add custom styles here
// import UserDashboard from './UserDashBoard'; // Import UserDashboard

// const AdminDashboard = () => {
//   const [overallInventory, setOverallInventory] = useState({ TotalBalanceBales: 0, TotalBalanceQuantity: 0 });
//   const [loading, setLoading] = useState(false);
//   const [pendingPayments, setPendingPayments] = useState(0);
//   const [receivingPayments, setReceivingPayments] = useState(0);
//   const [netProfitLoss, setNetProfitLoss] = useState(0);
//   const [userRole, setUserRole] = useState(null); // To store the user's role
//   const [admin, setAdmin] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [userName, setUserName] = useState('');
//   const [userMail, setUserMail] = useState('');

//   useEffect(() => {
//     const fetchAdminDashboard = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           console.error('Token not found in localStorage');
//           return;
//         }
//         const response = await axios.get('http://localhost:5000/api/auth/dashboard', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setAdmin(response.data.admin);
//         setUsers(response.data.users);
//       } catch (error) {
//         console.error('Failed to fetch admin dashboard:', error);
//       }
//     };
  
//     fetchAdminDashboard();
//   }, []);

//   const handleCreateUser = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const adminId = admin.id; // Assuming admin object contains the adminId

//       const response = await axios.post(
//         'http://localhost:5000/api/auth/create-user',
//         {
//           userName,
//           userMail,
//           adminId, // Pass adminId along with user details
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
  
//       alert('User created successfully');
//       setUserName('');
//       setUserMail('');
  
//       // Check if the response contains the updated list of users
//       if (response.data && response.data.users) {
//         setUsers(response.data.users);
//       } else {
//         // If not, fetch the users again
//         const usersResponse = await axios.get('http://localhost:5000/api/auth/dashboard', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setUsers(usersResponse.data.users);
//       }
//     } catch (error) {
//       if (error.response && error.response.status === 400) {
//         alert(error.response.data.error); // Show specific error message
//       } else {
//         alert('Failed to create user');
//       }
//       console.error('Failed to create user:', error);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.post('http://localhost:5000/api/auth/logout', null, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       localStorage.removeItem('token');
//       alert('Logged out successfully');
//       window.location.href = '/login'; // Redirect to login page
//     } catch (error) {
//       console.error('Failed to logout:', error);
//       alert('Failed to logout');
//     }
//   };

//   const handleDeleteAdminAccount = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const adminId = admin.id; // Assuming admin object contains the adminId
//       await axios.delete(`http://localhost:5000/api/auth/delete-admin-account/${adminId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       localStorage.removeItem('token');
//       alert('Admin account and all associated users deleted successfully');
//       window.location.href = '/login'; // Redirect to login page
//     } catch (error) {
//       console.error('Failed to delete admin account:', error);
//       alert('Failed to delete admin account');
//     }
//   };

//   const handleLogoutUser = async (userId) => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.post(`http://localhost:5000/api/auth/logout-user/${userId}`, null, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       alert('User logged out successfully');
//       // Optionally, refresh the user list
//       const usersResponse = await axios.get('http://localhost:5000/api/auth/dashboard', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUsers(usersResponse.data.users);
//     } catch (error) {
//       console.error('Failed to log out user:', error);
//       alert('Failed to log out user');
//     }
//   };

//   const handleDeleteUser = async (userId) => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.delete(`http://localhost:5000/api/auth/delete-account/${userId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       alert('User account deleted successfully');
//       // Optionally, refresh the user list
//       const usersResponse = await axios.get('http://localhost:5000/api/auth/dashboard', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUsers(usersResponse.data.users);
//     } catch (error) {
//       console.error('Failed to delete user account:', error);
//       alert('Failed to delete user account');
//     }
//   };

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

//   const fetchReceivingPayments = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/receiving-payments');
//       if (response.status === 200) {
//         setReceivingPayments(response.data.totalReceivablePayments);
//       }
//     } catch (error) {
//       console.error('Error fetching Receivable payments:', error);
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

//   const fetchUserRole = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get('http://localhost:5000/api/auth/user-role', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUserRole(response.data.role);
//     } catch (error) {
//       console.error('Error fetching user role:', error);
//     }
//   };

//   useEffect(() => {
//     fetchInventoryData();
//     fetchPendingPayments();
//     fetchNetProfitLoss();
//     fetchReceivingPayments();
//     fetchUserRole();
//   }, []);

//   const formatCurrencyLakhs = (value) => {
//     if (value == null || isNaN(value)) return "₹0.00L";

//     const valueInLakhs = value / 100000;

//     return `₹${new Intl.NumberFormat("en-IN", {
//       maximumFractionDigits: 2,
//     }).format(valueInLakhs)}L`;
//   };

//   function formatToIndianNumberingSystem(number) {
//     const [integerPart, decimalPart] = number.toString().split('.');

//     const lastThreeDigits = integerPart.slice(-3);
//     const otherDigits = integerPart.slice(0, -3);

//     const formattedInteger =
//       otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + (otherDigits ? ',' : '') + lastThreeDigits;

//     return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
//   }

//   const navigate = useNavigate();
  
//   return (
//     <div className="homepage-container">
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
//           <div className="tile-container">
//             <div onClick={() => navigate("/add-data")} className="tile">
//                 <div className="icon">➕</div>
//                 <p>Add New Lot</p>
//             </div>
//             <div onClick={() => navigate("/view-lots")} className="tile">
//                 <div className="icon">📋</div>
//                 <p>View Lots</p>
//             </div>
//             <div onClick={() => navigate("/inventory")} className="tile">
//                 <div className="icon">📦</div>
//                 <p>Check Inventory</p>
//             </div>
//             <div onClick={() => navigate("/report")} className="tile">
//                 <div className="icon">📊</div>
//                 <p>Generate Reports</p>
//             </div>
//             <div onClick={() => navigate("/activity")} className="tile">
//                 <div className="icon">🔍</div>
//                 <p>Recent Activity</p>
//             </div>
//         </div>
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

//         {/* Conditional Dashboard Rendering */}
//         {userRole === 'admin' ? <AdminDashboard /> : userRole === 'user' ? <UserDashboard /> : null}
//       </main>
//        {/* User Management Section */}
//        <section className="user-management">
//           <h3>Create New User</h3>
//           <div>
//             <input
//               type="text"
//               placeholder="User Name"
//               value={userName}
//               onChange={(e) => setUserName(e.target.value)}
//             />
//             <input
//               type="email"
//               placeholder="User Mail"
//               value={userMail}
//               onChange={(e) => setUserMail(e.target.value)}
//             />
//             <button onClick={handleCreateUser}>Create User</button>
//           </div>
//           <h3>Active Users</h3>
//           <ul>
//             {users.map((user) => (
//               <li key={user.id}>
//                 {user.firstName} {user.lastName} - Last Seen: {new Date(user.lastSeen).toLocaleString()}
//                 <button onClick={() => handleLogoutUser(user.id)}>Logout User</button>
//                 <button onClick={() => handleDeleteUser(user.id)}>Delete User</button>
//               </li>
//             ))}
//           </ul>
//           <div>
//             <button onClick={handleLogout}>Logout</button>
//             <button onClick={handleDeleteAdminAccount}>Delete Admin Account</button>
//           </div>
//         </section>

       

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

// export default AdminDashboard;