import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton, Menu, MenuItem, Avatar, Tooltip } from "@mui/material";
import { Menu as MenuIcon, AccountCircle } from "@mui/icons-material";

const Header = ({ toggleSidebar }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditUser = () => {
    navigate("/edit-user");
    handleClose();
  };

  return (
    <nav className="navbar navbar-light bg-light px-3 shadow-sm">
      <div
        className="d-flex align-items-center justify-content-between w-100 px-3"
        style={{ height: "60px" }}
      >
        <div className="d-flex align-items-center gap-2">
          <IconButton
            onClick={toggleSidebar}
            className="d-md-none"
            aria-label="Toggle sidebar"
          >
            <MenuIcon />
          </IconButton>
        </div>

        <img src="/Logo2.png" alt="Logo 1" style={{ height: "64px", width: "90px" }} />

        <div className="flex-grow-1 text-center">
          <h4 className="mb-0">DPH Dashboard</h4>
        </div>

        <div className="d-flex align-items-center gap-3">
          <img src="/DPH_Logo.webp" alt="Logo 2" style={{ height: "63px", width: "70px" }} />

          <Tooltip title="Account settings">
            <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }}>
              <AccountCircle sx={{ fontSize: 36, color: "#1976d2" }} />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem onClick={handleEditUser}>Profile</MenuItem>
           
          </Menu>
        </div>
      </div>
    </nav>
  );
};

export default Header;
