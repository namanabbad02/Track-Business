// frontend/src/pages/UserDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserDashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/auth/user-dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserDashboard();
  }, []);

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

  return (
    <div>
      <h2>User Dashboard</h2>
      <p>Welcome, {user ? user.firstName : ''}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default UserDashboard;