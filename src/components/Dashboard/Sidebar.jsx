import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";

const Sidebar = ({ isOpen, closeSidebar }) => {
  const navItems = [
    { text: "Home", icon: <HomeIcon />, href: "/home" },
    { text: "State", icon: <DashboardIcon />, href: "#profile" },
    { text: "Settings", icon: <SettingsIcon />, href: "#settings" },
  ];

  const drawerStyles = {
    boxSizing: "border-box",
    width: 250,
    marginTop: "67px",
    backgroundColor: "#f9f9f9", // light gray for better contrast on white
    color: "#333",
    borderRight: "1px solid #e0e0e0",
  };

  const listItemButtonStyle = {
    "&:hover": {
      backgroundColor: "#e3f2fd", // light blue hover
      color: "#1976d2", // primary blue text on hover
      "& .MuiListItemIcon-root": {
        color: "#1976d2",
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
        <List>
          {navItems.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton
                component="a"
                href={item.href}
                onClick={closeSidebar}
                sx={listItemButtonStyle}
              >
                <ListItemIcon sx={{ color: "#666" }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

     
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            ...drawerStyles,
            marginTop: "82px",
          },
        }}
      >
        <List>
          {navItems.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton component="a" href={item.href} sx={listItemButtonStyle}>
                <ListItemIcon sx={{ color: "#666" }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Sidebar;
