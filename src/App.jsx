import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/Authentication/Login';
import ForgetPassword from './components/Authentication/ForgetPassword';
import TamilNaduMap from './components/Dashboard/Dashboard';
import DashboardLayout from './components/Dashboard/DashboardLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/forgetpass" element={<ForgetPassword />} />
        <Route path="/dashboard" element={<DashboardLayout/>} />
         <Route path="/home" element={< TamilNaduMap/>} />
      </Routes>
    </Router>
  );
}

export default App;


