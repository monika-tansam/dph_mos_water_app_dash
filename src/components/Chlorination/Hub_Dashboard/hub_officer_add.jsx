import React, { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

export default function HubOfficerAdd() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    user_id: "",
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewUser({
      user_id: "",
      username: "",
      email: "",
      phone: "",
      password: "",
    });
  };

  // Fetch logged-in hub officer
  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const response = await fetch("http://localhost:3000/dashboard/chl-hubusers");
        const data = await response.json();
        const loggedInUsername = localStorage.getItem("loggedInUsername");

        if (data && loggedInUsername) {
          const matchedUser = data.find((u) => u.username === loggedInUsername);
          setUser(matchedUser);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchLoggedInUser();
  }, []);

  // Auto-generate user_id when username is typed
  useEffect(() => {
    if (user && newUser.username) {
      const prefix = user.hub_name?.substring(0, 3).toUpperCase() || "XXX";
      const sequence = Math.floor(Math.random() * 900 + 100); // fallback random 3-digit
      const userId = `${user.hub_id}${prefix}USE${sequence}`;
      setNewUser((prev) => ({ ...prev, user_id: userId }));
    }
  }, [newUser.username, user]);

  // Handle input changes
  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  // Submit new user to backend
  const handleSubmit = async () => {
    if (!user) return;

    const payload = {
      hub_id: user.hub_id,
      hub_name: user.hub_name,
      username: newUser.username,
      email: newUser.email,
      phone_number: newUser.phone,
      password: newUser.password,
    };

    try {
      const res = await fetch("http://localhost:3000/dashboard/add-chl-datacollector", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        alert(`User added successfully with ID: ${result.user_id}`);
        handleClose();
      } else {
        alert(result.message || "Failed to add user");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Network error");
    }
  };

  return (
    <DashboardLayout>
      {user && (
        <Card sx={{ maxWidth: 500, mt: 3, position: "relative" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Logged In Hub Officer
            </Typography>
            <Box sx={{ mb: 1 }}>
              <strong>Hub Name:</strong> {user.hub_name}
            </Box>
            <Box sx={{ mb: 1 }}>
              <strong>Hub ID:</strong> {user.hub_id}
            </Box>
            <Box sx={{ position: "absolute", top: 16, right: 16 }}>
              <Button variant="contained" onClick={handleOpen}>
                Add User
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Add User Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Add Data Collection User</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 2 }}>
            <strong>Hub ID:</strong> {user?.hub_id}
            <br />
            <strong>Hub Name:</strong> {user?.hub_name}
          </Box>
          <TextField
            fullWidth
            margin="dense"
            label="User ID"
            name="user_id"
            value={newUser.user_id}
            InputProps={{ readOnly: true }}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Username"
            name="username"
            value={newUser.username}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Email"
            name="email"
            value={newUser.email}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Phone Number"
            name="phone"
            value={newUser.phone}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Password"
            name="password"
            type="password"
            value={newUser.password}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}
