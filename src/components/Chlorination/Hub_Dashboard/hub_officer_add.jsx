import React, { useState, useEffect } from "react";
import DashboardLayout from "./DashboardLayout";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  InputAdornment,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function HubOfficerAdd() {
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [users, setUsers] = useState([]);
  const [hubId, setHubId] = useState("");
  const [hubName, setHubName] = useState("");
  const [formData, setFormData] = useState({
    userId: "",
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  const username = localStorage.getItem("username");

  const abbreviateHubName = (name) => {
    return name?.toUpperCase().replace(/\s+/g, "").slice(0, 3) || "XXX";
  };

  const generateUserId = async (hubId, hubName) => {
    try {
      const abbrev = abbreviateHubName(hubName);
      const res = await fetch(`http://localhost:3000/chl-data-users?hub_id=${hubId}`);
      const data = await res.json();
      const nextNumber = String(data.length + 1).padStart(3, "0");
      return `${hubId}${abbrev}USR${nextNumber}`;
    } catch (err) {
      console.error("Error generating userId:", err);
      return `${hubId}XXXUSR999`;
    }
  };

  useEffect(() => {
    if (!username) return;

    fetch(`http://localhost:3000/chl-hubusers?username=${username}`)
      .then((res) => res.json())
      .then(async (data) => {
        if (data?.hub_id) {
          setHubId(data.hub_id);
          setHubName(data.hub_name);
          const newUserId = await generateUserId(data.hub_id, data.hub_name);
          setFormData((prev) => ({ ...prev, userId: newUserId }));
          fetchUsers(data.hub_id);
        }
      })
      .catch((err) => console.error("Error fetching hub officer info:", err));
  }, [username]);

  const fetchUsers = async (hubId) => {
    try {
      const res = await fetch(`http://localhost:3000/chl-data-users?hub_id=${hubId}`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/chl-data-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: formData.userId,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          phone_number: formData.phone,
          hub_id: hubId,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        await fetchUsers(hubId);
        const newUserId = await generateUserId(hubId, hubName);
        setFormData({
          userId: newUserId,
          username: "",
          email: "",
          phone: "",
          password: "",
        });
        setOpen(false);
      } else {
        alert(result.message || "Failed to add user");
      }
    } catch (error) {
      console.error("Error submitting user:", error);
    }
  };

  return (
    <DashboardLayout>
      <Stack spacing={2}>
        <h1>Add Data Collection User</h1>
        <Button
          variant="contained"
          onClick={async () => {
            const newUserId = await generateUserId(hubId, hubName);
            setFormData((prev) => ({
              ...prev,
              userId: newUserId,
              username: "",
              email: "",
              phone: "",
              password: "",
            }));
            setOpen(true);
          }}
        >
          Add User
        </Button>

        {users.length > 0 && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Hub ID</TableCell>
                  <TableCell>Hub Name</TableCell>
                  <TableCell>User ID</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user, index) => (
                  <TableRow key={index}>
                    <TableCell>{user.hub_id}</TableCell>
                    <TableCell>{user.hub_name || hubName}</TableCell>
                    <TableCell>{user.user_id}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone_number}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle>Add New Data User</DialogTitle>
          <DialogContent>
            <Stack spacing={2} mt={1}>
              <TextField label="User ID" value={formData.userId} InputProps={{ readOnly: true }} fullWidth />
              <TextField label="Username" name="username" value={formData.username} onChange={handleChange} fullWidth required />
              <TextField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} fullWidth required />
              <TextField label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleChange} fullWidth required />
              <TextField
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                fullWidth
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="secondary">Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">Save</Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </DashboardLayout>
  );
}
