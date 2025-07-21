// import React, { useState } from "react";
// import "./AuthForm.css";

// const ForgotPasswordModal = ({ onClose }) => {
//   const [email, setEmail] = useState("");
//   const [error, setError] = useState("");
//   const [otpSent, setOtpSent] = useState(false);

//   const handleSendOtp = () => {
//     if (!/\S+@\S+\.\S+/.test(email)) {
//       setError("Please enter a valid email address.");
//     } else {
//       setError("");
//       setOtpSent(true);
//       // Call API to send OTP
//       console.log("OTP sent to:", email);
//     }
//   };

//   const handleClose = () => {
//     setOtpSent(false);
//     setEmail("");
//     onClose();
//   };

//   return (
//     <div className="modal-backdrop show">
//       <div className="modal">
//         <button className="modal-close" onClick={handleClose}>
//           &times;
//         </button>
//         <div className="modal-header">
//           {otpSent ? "OTP Sent" : "Forgot Password"}
//         </div>
//         <div className="modal-body">
//           {!otpSent ? (
//             <>
//               <p>
//                 Enter your registered email to receive an OTP for password
//                 reset.
//               </p>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="Enter your email"
//                 className={error ? "error" : ""}
//               />
//               {error && <small>{error}</small>}
//             </>
//           ) : (
//             <p>
//               An OTP has been sent to <strong>{email}</strong>. Please check your
//               inbox.
//             </p>
//           )}
//         </div>
//         <div className="modal-footer">
//           {!otpSent && (
//             <button onClick={handleSendOtp}>Send OTP</button>
//           )}
//           <button onClick={handleClose}>Close</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ForgotPasswordModal;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Use useNavigate instead
import "./AuthForm.css";

const ForgotPasswordModal = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate(); // ✅ Correct way in React Router v6

  const handleSendOtp = () => {
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
    } else {
      setError("");
      setOtpSent(true);
      console.log("OTP sent to:", email);
      
      // Redirect after sending OTP (if needed)
      // navigate("/otp-verification");
    }
  };

  const handleClose = () => {
    setOtpSent(false);
    setEmail("");
    onClose();
  };

  return (
    <div className="modal-backdrop show">
      <div className="modal">
        <button className="modal-close" onClick={handleClose}>&times;</button>
        <div className="modal-header">{otpSent ? "OTP Sent" : "Forgot Password"}</div>
        <div className="modal-body">
          {!otpSent ? (
            <>
              <p>Enter your registered email to receive an OTP for password reset.</p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={error ? "error" : ""}
              />
              {error && <small>{error}</small>}
            </>
          ) : (
            <p>An OTP has been sent to <strong>{email}</strong>. Please check your inbox.</p>
          )}
        </div>
        <div className="modal-footer">
          {!otpSent && <button onClick={handleSendOtp}>Send OTP</button>}
          <button onClick={handleClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
