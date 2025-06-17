import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import { Menu as MenuIcon, AccountCircle } from "@mui/icons-material";
import "./../Styles/main.css";

const Header = ({ toggleSidebar }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleEditUser = () => {
    navigate("/edit-user");
    handleClose();
  };

  return (
    <nav className="navbar navbar-light bg-light px-3 shadow-sm header-nav">
      <div className="d-flex align-items-center justify-content-between w-100 px-3" style={{ height: "90px" }}>
        {/* Hamburger for mobile */}
        <div className="d-flex align-items-center gap-2">
          <IconButton
            onClick={toggleSidebar}
            className="d-md-none"
            aria-label="Toggle sidebar"
            sx={{ mr: 1 }}
          >
            <MenuIcon />
          </IconButton>
        </div>
        
        <img src="/Logo2.png" alt="Logo 1" className="header-logo main-logo" />
     
        <div className="flex-grow-1 text-center header-color header-title-wrap">
          <h3 className="gov-title">Government of Tamil Nadu</h3>
          <h4 className="mb-0 dph-title">Directorate of Public Health and Preventive Medicine</h4>
        </div>
        
        <div className="d-flex align-items-center gap-3">
          <img src="/DPH_Logo.webp" alt="Logo 2" className="header-logo dph-logo" />
          <Tooltip title="Account settings">
            <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }}>
              <AccountCircle sx={{ fontSize: 36, color: "#1976d2" }} />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={handleEditUser}>Profile</MenuItem>
          </Menu>
        </div>
      </div>
    </nav>
  );
};

export default Header;
