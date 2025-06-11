import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import '../Styles/Dashboard/ForgetPassword.css';
import Header from './AuthHeader';
const ForgetPassword = () => {
  const [step, setStep] = useState("otp"); 
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error] =useState("");
  const [message] = useState("");
 
  useEffect(()=> {
    toast.warn("OTP sent to your mail");
  },[]);

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (otp === "123456") {
      setStep("reset");
      toast.success("OTP verified! Please set your new password.");
      
    } else {
      toast.error("Invalid OTP. Please try again.");
      
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
   const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\[\]{};':"\\|,.<>\/?]).{8,}$/;

  if (!passwordRegex.test(newPassword)) {
    toast.error("Password must be at least 8 characters long and include at least one uppercase letter, one digit, and one special character.");
    return;
  }

  if (newPassword !== confirmPassword) {
    toast.error("Passwords do not match.");
    return;
  }

  toast.success("Password reset successful!");
  };

  return (
    <div
      style={{
        backgroundImage: "url('/loginbg1.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        width: '100%',
      }}
    >
    <div>
      <Header/>
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h3 className="text-center mb-4">Forgot Password</h3>

      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      {step === "otp" && (
        <form onSubmit={handleOtpSubmit}>
          <div className="mb-3">
            <label htmlFor="otp" className="form-label">
              Enter OTP
            </label>
            <input
              type="text"
              id="otp"
              className="form-control"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Verify OTP
          </button>
        </form>
      )}

      {step === "reset" && (
        <form onSubmit={handlePasswordSubmit}>
          <div className="mb-3">
            <label className="form-label">New Password</label>
            <input
              type="password"
              className="form-control"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100">
            Set Password
          </button>
        </form>
      )}
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
    </div>
    </div>
  );
};

export default ForgetPassword;
