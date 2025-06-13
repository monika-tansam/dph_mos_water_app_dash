import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/Authentication/Login';
import ForgetPassword from './components/Authentication/ForgetPassword';
import TamilNaduMap from './components/Dashboard/Dashboard';
import State from './components/Dashboard/State';
import StateData from './components/Dashboard/StateData';
import DashboardLayout from './components/Dashboard/DashboardLayout';
import MapPage from './components/Dashboard/Map'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/forgetpass" element={<ForgetPassword />} />
        <Route path="/dashboard" element={<DashboardLayout />} />
        <Route path="/home" element={<TamilNaduMap />} />
        <Route path="/state" element={<State />} />
        <Route path="/data" element={<StateData />} />
        <Route path="/map/:lat/:lng" element={<MapPage />} />
      </Routes>
    </Router>
  );
}

export default App;


