import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Container, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import "./SignUp.css";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    companyMail: '',
    personalMail: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false); // State to track loading status
  const [error, setError] = useState(''); // State to track error messages
  const navigate = useNavigate(); // Hook for navigation

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true); // Start loading
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      setLoading(false); // Stop loading
      alert('Registration successful');
      navigate('/login'); // Redirect to login page
    } catch (error) {
      setLoading(false); // Stop loading
      setError(`Registration failed: ${error.response?.data?.message || 'Unknown error'}`); // Set specific error message
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Register Company
        </Typography>
        {error && <Alert severity="error">{error}</Alert>} {/* Display error message */}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Admin Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Company Name"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Company Mail"
            name="companyMail"
            type="email"
            value={formData.companyMail}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Personal Mail"
            name="personalMail"
            type="email"
            value={formData.personalMail}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            margin="normal"
          />
          <Button type="submit" className='signup-button' variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Sign Up'}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default SignupForm;