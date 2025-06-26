// src/components/hub_officer_add.jsx
import React, { useState, useEffect } from "react";
import DashboardLayout from "./DashboardLayout";
import {
  Box,
  Typography,
  Button,
  Stack,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const HubOfficerAdd = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [hubId, setHubId] = useState("");

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    hub_id: "",
    phone_number: "",
    address: "",
    status: "Active",
  });

  useEffect(() => {
    fetchHubInfoAndUsers();
  }, []);

  const fetchHubInfoAndUsers = async () => {
    try {
      const res = await fetch("http://localhost:3000/dashboard/hub-officer-info?username=aravindh"); // replace as needed

      const contentType = res.headers.get("content-type");
      if (!res.ok || !contentType.includes("application/json")) {
        throw new Error("Invalid hub-officer-info response");
      }

      const data = await res.json();
      setHubId(data.hub_id);
      setForm((prev) => ({ ...prev, hub_id: data.hub_id }));

      const userRes = await fetch(
        `http://localhost:3000/dashboard/chl-hubusers?hub_id=${data.hub_id}`
      );
      const userData = await userRes.json();
      const collectors = userData.filter((u) => u.role === "data_collector");
      setUsers(collectors);
    } catch (err) {
      console.error("Failed to fetch users or hub info:", err);
    }
  };

  const validatePassword = (value) =>
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{8,}$/.test(value);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      setPasswordError(
        validatePassword(value)
          ? ""
          : "Password must be 8+ chars, 1 uppercase, 1 number, 1 special char"
      );
    }
  };

  const handleSubmit = async () => {
    if (!validatePassword(form.password)) {
      setPasswordError(
        "Password must be 8+ chars, 1 uppercase, 1 number, 1 special char"
      );
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/dashboard/chl-datacollector", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const { user_id } = await response.json();
      alert(`Data Collector created: ${user_id}`);
      fetchHubInfoAndUsers();
      setForm({
        username: "",
        email: "",
        password: "",
        hub_id: hubId,
        phone_number: "",
        address: "",
        status: "Active",
      });
      setPasswordError("");
      setOpen(false);
    } catch (err) {
      console.error("Submission error:", err);
      alert("Error submitting user data");
    }
  };

  return (
    <DashboardLayout>
      <Box mt={4} sx={{ background: "#fff", borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)", p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: "#2A2F5B", mb: 2 }}>
          ADD DATA COLLECTORS
        </Typography>

        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
            sx={{
              background: "linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)",
              color: "#fff",
              borderRadius: 2,
              fontWeight: 700,
              px: 3,
              "&:hover": {
                background: "linear-gradient(90deg, #1565c0 0%, #64b5f6 100%)",
              },
            }}
          >
            Add Collector
          </Button>
        </Box>

        <DataGrid
          rows={users}
          columns={[
            { field: "user_id", headerName: "User ID", width: 160 },
            { field: "username", headerName: "Username", width: 150 },
            { field: "email", headerName: "Email", width: 180 },
            { field: "hub_id", headerName: "Hub ID", width: 120 },
            { field: "hub_name", headerName: "Hub Name", width: 180 },
            { field: "phone_number", headerName: "Phone", width: 130 },
            { field: "address", headerName: "Address", width: 200 },
            { field: "status", headerName: "Status", width: 100 },
            { field: "role", headerName: "Role", width: 120 },
          ]}
          getRowId={(row) => row.user_id}
          pageSize={5}
          sx={{ height: 480 }}
        />

        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle>Add Data Collector</DialogTitle>
          <DialogContent>
            <Stack spacing={2} mt={1}>
              <TextField
                label="Username"
                name="username"
                value={form.username}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                fullWidth
              />
              <TextField
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                error={!!passwordError}
                helperText={passwordError}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword((prev) => !prev)}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Phone Number"
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
                inputProps={{ maxLength: 10, inputMode: "numeric" }}
                fullWidth
              />
              <TextField
                label="Address"
                name="address"
                value={form.address}
                onChange={handleChange}
                fullWidth
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="error" variant="outlined">
              Cancel
            </Button>
            <Button onClick={handleSubmit} variant="contained">
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
};

export default HubOfficerAdd;
