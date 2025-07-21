// import React, { useState } from 'react';
// import { Box, TextField, Button, Typography, Container, Tabs, Tab, Link } from '@mui/material';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../AuthContext';
// import './login.css';

// const Login = () => {
//   const navigate = useNavigate();
//   const { login } = useAuth();
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     role: 'admin',
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(`http://localhost:5000/api/auth/login`, {
//         email: formData.email,
//         password: formData.password,
//         role: formData.role,
//       });

//       console.log("Login Response Data:", response.data); // Debug log

//       login(response.data.token, response.data.role);

//       if (response.data.role === 'admin') {
//         localStorage.setItem('adminId', response.data.adminId); // Store admin ID
//       } else if (response.data.role === 'user') {
//         localStorage.setItem('userId', response.data.userId); // Store user ID
//         localStorage.setItem('adminId', response.data.adminId); // Store associated admin ID
//       }

//       navigate('/');

//       alert(response.data.message);
//     } catch (error) {
//       alert('Login failed');
//       console.error(error);
//     }
//   };

//   const handleRoleChange = (event, newValue) => {
//     setFormData({ ...formData, role: newValue });
//   };

//   return (
//     <div className='login-page'>
//       <Container maxWidth="sm">
//         <Box sx={{ my: 4, backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '10px', padding: '20px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
//           <Typography variant="h4" gutterBottom>
//             Login
//           </Typography>
//           <Tabs value={formData.role} onChange={handleRoleChange} aria-label="login role">
//             <Tab label="Admin" value="admin" />
//             <Tab label="User" value="user" />
//           </Tabs>
//           <form onSubmit={handleSubmit}>
//             <TextField
//               fullWidth
//               label={formData.role === 'admin' ? 'Company Mail' : 'User Mail'}
//               name="email"
//               type="email"
//               value={formData.email}
//               onChange={handleChange}
//               margin="normal"
//               InputProps={{
//                 classes: {
//                   root: 'login-input',
//                 },
//               }}
//             />
//             <TextField
//               fullWidth
//               label="Password"
//               name="password"
//               type="password"
//               value={formData.password}
//               onChange={handleChange}
//               margin="normal"
//               InputProps={{
//                 classes: {
//                   root: 'login-input',
//                 },
//               }}
//             />
//             <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, mb: 2 }}>
//               Login
//             </Button>
//           </form>
//           {formData.role === 'admin' && (
//             <Typography variant="body2" sx={{ mt: 2 }}>
//               Don't have an account? <Link href="/signup">Sign Up</Link>
//             </Typography>
//           )}
//           <Typography variant="body2">
//             Forgot your password? <Link href="/forgot-password">Reset Password</Link>
//           </Typography>
//         </Box>
//       </Container>
//     </div>
//   );
// };

// export default Login;


//-------------------------------------------------------------------------------------upper code is the final code for login.js file-----------------------------------------------------------------------------------

import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Container, Tabs, Tab, Link } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'admin',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:5000/api/auth/login`, {
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      
      console.log("Login Response Data:", response.data); // Debug log

      login(response.data.token, response.data.role);

      if (response.data.role === 'admin') {
        localStorage.setItem('adminId', response.data.adminId); // Store admin ID
      } else if (response.data.role === 'user') {
        localStorage.setItem('userId', response.data.userId); // Store user ID
        localStorage.setItem('adminId', response.data.adminId); // Store associated admin ID
      }

      navigate('/');

      alert(response.data.message);
    } catch (error) {
      alert('Login failed');
      console.error(error);
    }
  };

  const handleRoleChange = (event, newValue) => {
    setFormData({ ...formData, role: newValue });
  };

  useEffect(() => {
    const savedData = localStorage.getItem('formData');
    if (savedData) {
      const data = JSON.parse(savedData);
      setFormData(data);
    }
  }, []);

  return (
    <div className='login-page'>
      <Container maxWidth="sm">
        <Box sx={{ my: 4, backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '10px', padding: '20px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
          <Typography variant="h4" gutterBottom>
            Login
          </Typography>
          <Tabs value={formData.role} onChange={handleRoleChange} aria-label="login role">
            <Tab label="Admin" value="admin" />
            <Tab label="User" value="user" />
          </Tabs>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label={formData.role === 'admin' ? 'Company Mail' : 'User Mail'}
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              InputProps={{
                classes: {
                  root: 'login-input',
                },
              }}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              InputProps={{
                classes: {
                  root: 'login-input',
                },
              }}
            />
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, mb: 2 }}>
              Login
            </Button>
          </form>
          {formData.role === 'admin' && (
            <Typography variant="body2" sx={{ mt: 2 }}>
              Don't have an account? <Link href="/signup">Sign Up</Link>
            </Typography>
          )}
          <Typography variant="body2">
            Forgot your password? <Link href="/forgot-password">Reset Password</Link>
          </Typography>
        </Box>
      </Container>
    </div>
  );
};

export default Login;

//-----------------------------------------------------------------------------------------------

// import React, { useState } from 'react';
// import { Box, TextField, Button, Typography, Container, Tabs, Tab, Link } from '@mui/material';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const Login = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     role: 'admin',
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         `http://localhost:5000/api/auth/login`,
//         {
//           email: formData.email,
//           password: formData.password,
//           role: formData.role,
//         },
//         { withCredentials: true } // Ensures cookies are sent and received
//       );

//       console.log("Login Response Data:", response.data); // Debugging

//       if (response.data.role === 'admin') {
//         navigate('/');
//       } else if (response.data.role === 'user') {
//         navigate('/');
//       }

//       alert(response.data.message);
//     } catch (error) {
//       alert('Login failed');
//       console.error("Login Error:", error.response?.data || error.message);
//     }
//   };

//   const handleRoleChange = (event, newValue) => {
//     setFormData({ ...formData, role: newValue });
//   };

//   return (
//     <Container maxWidth="sm">
//       <Box sx={{ my: 4 }}>
//         <Typography variant="h4" gutterBottom>
//           Login
//         </Typography>
//         <Tabs value={formData.role} onChange={handleRoleChange} aria-label="login role">
//           <Tab label="Admin" value="admin" />
//           <Tab label="User" value="user" />
//         </Tabs>
//         <form onSubmit={handleSubmit}>
//           <TextField
//             fullWidth
//             label={formData.role === 'admin' ? 'Company Mail' : 'User Mail'}
//             name="email"
//             type="email"
//             value={formData.email}
//             onChange={handleChange}
//             margin="normal"
//           />
//           <TextField
//             fullWidth
//             label="Password"
//             name="password"
//             type="password"
//             value={formData.password}
//             onChange={handleChange}
//             margin="normal"
//           />
//           <Button type="submit" variant="contained" color="primary">
//             Login
//           </Button>
//         </form>
//         <Typography variant="body2" sx={{ mt: 2 }}>
//           Don't have an account? <Link href="/signup">Sign Up</Link>
//         </Typography>
//         <Typography variant="body2">
//           Forgot your password? <Link href="/forgot-password">Reset Password</Link>
//         </Typography>
//       </Box>
//     </Container>
//   );
// };

// export default Login;
