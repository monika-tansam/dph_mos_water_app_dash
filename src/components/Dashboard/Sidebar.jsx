import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  Typography,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import BarChartIcon from "@mui/icons-material/BarChart";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = ({ isOpen, closeSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { text: "Home", icon: <HomeIcon />, href: "/home" },
    { text: "State", icon: <DashboardIcon />, href: "/state" },
    { text: "Data Collection", icon: <BarChartIcon />, href: "/data" },
  ];

  const handleLogout = () => {
    navigate("/"); // Navigate to home
  };

  const drawerStyles = {
    boxSizing: "border-box",
    width: 250,
    backgroundColor: "#f5f5f5",
    color: "#333",
    borderRight: "1px solid #e0e0e0",
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    paddingTop: "97px",
  };

  const listItemButtonStyle = {
    "&:hover": {
      backgroundColor: "#e3f2fd",
      color: "#1976d2",
      "& .MuiListItemIcon-root": {
        color: "#1976d2",
      },
    },
  };

  const logoutButtonStyle = {
    color: "#d32f2f",
    "& .MuiListItemIcon-root": {
      color: "#d32f2f",
    },
    "&:hover": {
      backgroundColor: "#ffebee",
      color: "#b71c1c",
      "& .MuiListItemIcon-root": {
        color: "#b71c1c",
      },
    },
  };

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={isOpen}
        onClose={closeSidebar}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": drawerStyles,
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <List>
            {navItems.map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  component="a"
                  href={item.href}
                  onClick={closeSidebar}
                  sx={listItemButtonStyle}
                  selected={location.pathname === item.href}
                >
                  <ListItemIcon sx={{ color: "#666" }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
        <Divider />
        <Box>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout} sx={logoutButtonStyle}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </Box>
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": drawerStyles,
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <List>
            {navItems.map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  component="a"
                  href={item.href}
                  sx={listItemButtonStyle}
                  selected={location.pathname === item.href}
                >
                  <ListItemIcon sx={{ color: "#666" }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
        <Divider />
        <Box>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout} sx={logoutButtonStyle}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </Box>
      </Drawer>

      {/* Header with Hamburger Menu Icon */}
      <Box
        sx={{
          display: "flex", // Always flex, so always visible
          alignItems: "center",
          mb: 2,
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={() => {
            // Add your drawer/menu open logic here
            alert("Hamburger menu clicked!");
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Dashboard
        </Typography>
      </Box>
    </>
  );
};

export default Sidebar;
