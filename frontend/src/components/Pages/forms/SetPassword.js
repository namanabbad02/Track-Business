import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SetPassword = () => {
  const [token, setToken] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const path = window.location.pathname;
    const token = path.split('/').pop(); // Extract the last part of the path
    setToken(token);
    console.log('Token from URL:', token); // Debugging log
  }, []);

  useEffect(() => {
    console.log('SetPassword component mounted');
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    console.log('Submitting data:', { token, password, firstName, lastName }); // Debugging log
  
    try {
      const response = await axios.post('http://localhost:5000/api/auth/set-password', {
        token,
        password,
        firstName,
        lastName,
        phone,
      });
  
      console.log('Response from backend:', response.data); // Debugging log
  
      if (response.status === 200) {
        alert('Password set successfully. You can now log in.');
        window.location.href = 'http://localhost:3000/login'; // Redirect to login page
      } else {
        alert('Failed to set password. Please try again.');
      }
    } catch (error) {
      console.error('Error setting password:', error);
      alert('Failed to set password. Please try again.');
    }
  };

  return (
    <div>
      <h1>Set Your Password</h1>
      <form onSubmit={handleSubmit}>
        <label>
          First Name:
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Last Name:
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Phone Number:
          <input
            type="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Set Password</button>
      </form>
    </div>
  );
};

export default SetPassword;