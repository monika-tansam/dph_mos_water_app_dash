import React from 'react';
import '../Styles/Authentication/AuthHeader.css'
const Header = () => {
  return (
    <header className="custom-header">
      <div className="logo-section">
        <img src="/Logo2.png" alt="Left Logo" className="logo_1" />
      </div>
      <h1 className="header-title">Directorate of Public Health and Preventive Medicine</h1>
      <div className="logo-section">
        <img src="/DPH_Logo.webp" alt="Right Logo" className="logo_2" />
      </div>
    </header>
  );
};

export default Header;
