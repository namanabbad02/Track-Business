
// ForgotPasswordForm.js
import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Container, Link } from '@mui/material';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleSendOtp = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/api/auth/send-otp`, { email });
      alert(response.data.message);
      setStep(2);
    } catch (error) {
      alert(error.response.data.error);
      console.error(error);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/api/auth/verify-otp`, { email, otp });
      alert(response.data.message);
      setStep(3);
    } catch (error) {
      alert(error.response.data.error);
      console.error(error);
    }
  };

  const handleResetPassword = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/api/auth/reset-password`, { email, newPassword });
      alert(response.data.message);
      setStep(1);
    } catch (error) {
      alert(error.response.data.error);
      console.error(error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Forgot Password
        </Typography>
        {step === 1 && (
          <form onSubmit={(e) => { e.preventDefault(); handleSendOtp(); }}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              margin="normal"
            />
            <Button type="submit" variant="contained" color="primary">
              Send OTP
            </Button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={(e) => { e.preventDefault(); handleVerifyOtp(); }}>
            <TextField
              fullWidth
              label="OTP"
              name="otp"
              type="text"
              value={otp}
              onChange={handleOtpChange}
              margin="normal"
            />
            <Button type="submit" variant="contained" color="primary">
              Verify OTP
            </Button>
          </form>
        )}
        {step === 3 && (
          <form onSubmit={(e) => { e.preventDefault(); handleResetPassword(); }}>
            <TextField
              fullWidth
              label="New Password"
              name="newPassword"
              type="password"
              value={newPassword}
              onChange={handleNewPasswordChange}
              margin="normal"
            />
            <Button type="submit" variant="contained" color="primary">
              Reset Password
            </Button>
          </form>
        )}
        <Typography variant="body2" sx={{ mt: 2 }}>
          Remember your password? <Link href="/login">Login</Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default ForgotPassword;


// // ForgotPasswordForm.js
// import React, { useState } from 'react';
// import { Box, TextField, Button, Typography, Container, Link } from '@mui/material';
// import axios from 'axios';
// import { useHistory } from 'react-router-dom'; // Import useHistory

// const ForgotPassword = () => {
//   const [email, setEmail] = useState('');
//   const [otp, setOtp] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [step, setStep] = useState(1);
//   const history = useHistory(); // Initialize useHistory

//   const handleEmailChange = (e) => {
//     setEmail(e.target.value);
//   };

//   const handleOtpChange = (e) => {
//     setOtp(e.target.value);
//   };

//   const handleNewPasswordChange = (e) => {
//     setNewPassword(e.target.value);
//   };

//   const handleSendOtp = async () => {
//     try {
//       const response = await axios.post(`http://localhost:5000/api/auth/send-otp`, { email });
//       alert(response.data.message);
//       setStep(2);
//     } catch (error) {
//       alert(error.response.data.error);
//       console.error(error);
//     }
//   };

//   const handleVerifyOtp = async () => {
//     try {
//       const response = await axios.post(`http://localhost:5000/api/auth/verify-otp`, { email, otp });
//       alert(response.data.message);
//       setStep(3);
//     } catch (error) {
//       alert(error.response.data.error);
//       console.error(error);
//     }
//   };

//   const handleResetPassword = async () => {
//     try {
//       const response = await axios.post(`http://localhost:5000/api/auth/reset-password`, { email, newPassword });
//       alert(response.data.message);
//       history.push('/login'); // Redirect to login page
//     } catch (error) {
//       alert(error.response.data.error);
//       console.error(error);
//     }
//   };

//   return (
//     <Container maxWidth="sm">
//       <Box sx={{ my: 4 }}>
//         <Typography variant="h4" gutterBottom>
//           Forgot Password
//         </Typography>
//         {step === 1 && (
//           <form onSubmit={(e) => { e.preventDefault(); handleSendOtp(); }}>
//             <TextField
//               fullWidth
//               label="Email"
//               name="email"
//               type="email"
//               value={email}
//               onChange={handleEmailChange}
//               margin="normal"
//             />
//             <Button type="submit" variant="contained" color="primary">
//               Send OTP
//             </Button>
//           </form>
//         )}
//         {step === 2 && (
//           <form onSubmit={(e) => { e.preventDefault(); handleVerifyOtp(); }}>
//             <TextField
//               fullWidth
//               label="OTP"
//               name="otp"
//               type="text"
//               value={otp}
//               onChange={handleOtpChange}
//               margin="normal"
//             />
//             <Button type="submit" variant="contained" color="primary">
//               Verify OTP
//             </Button>
//           </form>
//         )}
//         {step === 3 && (
//           <form onSubmit={(e) => { e.preventDefault(); handleResetPassword(); }}>
//             <TextField
//               fullWidth
//               label="New Password"
//               name="newPassword"
//               type="password"
//               value={newPassword}
//               onChange={handleNewPasswordChange}
//               margin="normal"
//             />
//             <Button type="submit" variant="contained" color="primary">
//               Reset Password
//             </Button>
//           </form>
//         )}
//         <Typography variant="body2" sx={{ mt: 2 }}>
//           Remember your password? <Link href="/login">Login</Link>
//         </Typography>
//       </Box>
//     </Container>
//   );
// };

// export default ForgotPassword;