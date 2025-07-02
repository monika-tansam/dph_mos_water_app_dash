import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, IconButton, Menu, MenuItem, Tooltip, useMediaQuery } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "../../Styles/main.css";

const HubHeader = ({ toggleSidebar }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:600px)");

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
        
        <img
          src="/Logo2.png"
          alt="Logo 1"
          className="header-logo main-logo"
          style={{
            height: isMobile ? 36 : 60,
            width: "auto",
            transition: "height 0.2s"
          }}
        />
     
        <div className="flex-grow-1 text-center header-color header-title-wrap">
          <h3 className="gov-title">Directorate of Public Health and Preventive Medicine</h3>
          <h4 className="mb-0 dph-title">Water Analysis Hub Dashboard</h4>
        </div>
        
        <div className="d-flex align-items-center gap-3">
          <img src="/DPH_Logo.webp" alt="Logo 2" className="header-logo dph-logo" />
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleClick}
              sx={{
                ml: 2,
                p: 0.3,
                background: "rgba(255,255,255,0.25)",
                backdropFilter: "blur(6px)",
                border: "2px solid #1976d2",
                boxShadow: "0 4px 24px 0 rgba(25, 118, 210, 0.15)",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  background: "rgba(33,150,243,0.15)",
                  transform: "scale(1.10)",
                  boxShadow: "0 8px 32px 0 rgba(25, 118, 210, 0.25)",
                },
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "transparent",
                  width: isMobile ? 26 : 32,
                  height: isMobile ? 26 : 32,
                  fontSize: isMobile ? 18 : 22,
                  color: "#1976d2",
                  transition: "all 0.2s"
                }}
              >
                <AccountCircleIcon fontSize="inherit" />
              </Avatar>
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

export default HubHeader;
