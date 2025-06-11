import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

function LoginForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', password: '' });
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCaptcha = (value) => {
    setCaptchaVerified(!!value);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const { username, password } = form;

    if (!username || !password) {
      toast.error('All fields are required');
      return;
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\[\]{};':"\\|,.<>\/?]).{8,}$/;

    if (!passwordRegex.test(password)) {
      toast.error(
        'Password must be at least 8 characters long, include one uppercase letter, one number, and one special character'
      );
      return;
    }

    if (!captchaVerified) {
      toast.error('Please verify that you are not a robot');
      return;
    }

    toast.success('Login successful!');
    setTimeout(() => navigate('/home'), 2000);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow-lg" style={{ width: '350px' }}>
        <h4 className="mb-3 text-center">Login</h4>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter username"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
            />
          </div>

          <div className="mb-3 text-end">
            <a href="/forgetpass" className="text-decoration-none small">
              Forgot password?
            </a>
          </div>

          <div className="mb-3 d-flex justify-content-center">
            <ReCAPTCHA sitekey={SITE_KEY} onChange={handleCaptcha} />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}

export default LoginForm;
