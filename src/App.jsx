import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/Authentication/Login';
import ForgetPassword from './components/Authentication/ForgetPassword';
import Mos_Dashboard from './components/Dashboard/Dashboard';
import State from './components/Dashboard/State';
import StateData from './components/Dashboard/StateData';

import ChlorinationDashboard from './components/Chlorination/Chl_Dashboard/ChlorinationDashboard';
import ChlorinationStateData from './components/Chlorination/Chl_Dashboard/DataCollection';
import ChlorinationUser from './components/Chlorination/Chl_Dashboard/ChlorinationUser';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/forgetpass" element={<ForgetPassword />} />
        <Route path="/mosquito-admin-dashboard" element={<Mos_Dashboard />} />
        <Route path="/state" element={<State />} />
        <Route path="/data" element={<StateData />} />
       

          <Route path="/chl-admin-dashboard" element={<ChlorinationDashboard />} />
          <Route path="/chlorination-state" element={<ChlorinationUser />} />
          <Route path="/chlorination-data" element={<ChlorinationStateData />} /> 
         
      </Routes>
      
    </Router>
  );
}

export default App;


