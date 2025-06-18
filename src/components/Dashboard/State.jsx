import React, { useState, useEffect } from "react";
import DashboardLayout from "./DashboardLayout";
import {
  Box,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Select,
  Typography,
  Button,
  Stack,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer
} from "recharts";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExportContainer,
  GridCsvExportMenuItem,
  GridPrintExportMenuItem
} from "@mui/x-data-grid";
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  FirstPage,
  LastPage,
  Search as SearchIcon
} from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";

const COLORS = ["#007556", "#e53935"];

const UserStats = () => {
  const [filter, setFilter] = useState("Today");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [users, setUsers] = useState([]);
  // const [districts, setDistricts] = useState([]);
  const [form, setForm] = useState({
    user_id: "",
    username: "",
    district_name: "",
    phone_number: "",
    address: "",
    aadhar_number: "",
    status: "Active"
  });
  const [editForm, setEditForm] = useState({
    user_id: "",
    username: "",
    district_name: "",
    phone_number: "",
    address: "",
    aadhar_number: "",
    status: "Active"
  });

  const [adhaarError, setAdhaarError] = useState('');

  // Fetch districts and users on component mount
  useEffect(() => {
    // const fetchDistricts = async () => {
    //   try {
    //     const response = await fetch('http://localhost:3000/dashboard/district', {
    //       credentials: 'include'
    //     });
    //     if (!response.ok) throw new Error('Failed to fetch districts');
    //     const data = await response.json();
    //     setDistricts(data);
    //   } catch (err) {
    //     console.error('Error fetching districts:', err);
    //   }
    // };

    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3000/dashboard/district-officers', {
          credentials: 'include'
        });
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        const normalizedUsers = data.map(user => ({
          ...user,
          phone_number: user.phone_number || "",
          address: user.address || "",
          aadhar_number: user.aadhar_number || "",
          status: user.status || "Active"
        }));
        setUsers(normalizedUsers);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    // fetchDistricts();
    fetchUsers();
  }, []);

  const active = users.filter(u => u.status === "Active").length;
  const inactive = users.filter(u => u.status === "Inactive").length;
  const total = users.length;

  const pieData = [
    { name: "Active", value: active },
    { name: "Inactive", value: inactive }
  ];

  const filteredUsers = users.filter((user) => {
    const searchValue = search.toLowerCase();
    const matchesSearch =
      (user.username || "").toLowerCase().includes(searchValue) ||
      (String(user.user_id) || "").toLowerCase().includes(searchValue) ||
      (user.district_name || "").toLowerCase().includes(searchValue);

    const matchesStatus =
      statusFilter === "All" || user.status === statusFilter;

    return matchesSearch && matchesStatus;
  });


  const validateAdhaar = (value) => /^\d{12}$/.test(value);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === 'aadhar_number') {
      setAdhaarError(validateAdhaar(e.target.value) ? '' : 'Adhaar must be 12 digits');
    }
  };

  const handleSubmit = () => {
    if (!validateAdhaar(form.aadhar_number)) {
      setAdhaarError('Adhaar must be 12 digits');
      return;
    }
    setUsers([
      ...users,
      {
        ...form,
      },
    ]);
    setOpen(false);
    setForm({
      user_id: "",
      username: "",
      district_name: "",
      phone_number: "",
      address: "",
      aadhar_number: "",
      status: "Active"
    });
  };

  const handleEditClick = (row) => {
    setEditForm({ ...row });
    setEditOpen(true);
  };

  const handleEditFormChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    try {
      const response = await fetch(`http://localhost:3000/dashboard/district-officers/${editForm.user_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
        credentials: "include"
      });
      if (!response.ok) throw new Error("Failed to update");
      // Optionally update local state or refetch data here
    } catch {
      alert("Failed to update user");
    }
  };

  return (
    <DashboardLayout>
      <Card sx={{ p: 3, borderRadius: 3, backgroundColor: "#f9f9f9", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", fontFamily: "Poppins, sans-serif" }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: "#333" }}>
              Active / In-active Users List
            </Typography>
            <Select
              size="small"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              sx={{ fontWeight: 500, fontFamily: "Poppins" }}
            >
              <MenuItem value="Today">Today</MenuItem>
              <MenuItem value="Week">This Week</MenuItem>
              <MenuItem value="Month">This Month</MenuItem>
            </Select>
          </Box>

          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
              >
                {pieData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>

          <Grid container spacing={2} justifyContent="center" sx={{ mt: 3 }}>
            <Grid item xs={12} sm={4}>
              <Typography align="center" sx={{ fontSize: "1rem", color: "#555" }}>
                <strong>Total Users:</strong> {total}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography align="center" sx={{ fontSize: "1rem", color: "#27ae60" }}>
                <strong>Active:</strong> {active}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography align="center" sx={{ fontSize: "1rem", color: "#e53935" }}>
                <strong>Inactive:</strong> {inactive}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box
        mt={4}
        sx={{
          background: "#fff",
          borderRadius: 3,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          p: { xs: 1, sm: 2 },
          overflowX: "auto", // Enable horizontal scroll on small screens
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontFamily: "Roboto,Nunito, Poppins, sans-serif",
            fontWeight: 600,
            color: "#2A2F5B",
            mb: 2,
            fontSize: { xs: "1rem", sm: "1.25rem" },
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          STATE USERS LIST
        </Typography>

        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "stretch", sm: "center" }}
          mb={2}
          gap={1}
        >
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              width: { xs: "100%", sm: 220 },
              background: "#f5f7fa",
              borderRadius: 2,
              fontFamily: "Nunito, Poppins, sans-serif",
              '& .MuiInputBase-input': {
                fontFamily: "Nunito, Poppins, sans-serif",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <FormControl
            size="small"
            sx={{
              minWidth: 120,
              background: "#f5f7fa",
              borderRadius: 2,
              ml: { xs: 0, sm: 1 },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            <InputLabel id="status-filter-label" sx={{ fontFamily: "Nunito, Poppins, sans-serif" }}>
              Status
            </InputLabel>
            <Select
              labelId="status-filter-label"
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ fontFamily: "Nunito, Poppins, sans-serif" }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
            sx={{
              ml: { xs: 0, sm: 'auto' },
              mt: { xs: 1, sm: 0 },
              background: "linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)",
              color: "#fff",
              borderRadius: 2,
              boxShadow: 2,
              fontWeight: 700,
              fontFamily: "Nunito, sans-serif",
              px: 3,
              py: 1,
              textTransform: "none",
              fontSize: "1rem",
              transition: "background 0.2s, box-shadow 0.2s",
              width: { xs: "100%", sm: "auto" },
              "&:hover": {
                background: "linear-gradient(90deg, #1565c0 0%, #64b5f6 100%)",
                boxShadow: 4,
              },
            }}
          >
            Add User
          </Button>
        </Box>

        <Box sx={{ width: "100%", overflowX: "auto" }}>
          <div style={{ minWidth: 700, width: "100%", height: 480 }}>
            <DataGrid
              rows={filteredUsers}
              columns={[
                { field: "user_id", headerName: "User ID", width: 180 },
                { field: "username", headerName: "Username", width: 230 },
                { field: "district_name", headerName: "District", width: 200 },
                { field: "phone_number", headerName: "Phone Number", width: 220 },
                { field: "address", headerName: "Address", width: 260 },
                { field: "aadhar_number", headerName: "Adhaar Number", width: 220 },
                {
                  field: "status",
                  headerName: "Status",
                  width: 160,
                  align: "center",
                  headerAlign: "center",
                  renderCell: (params) => (
                    <Typography
                      sx={{
                        color: params.value === "Active" ? "#007556" : "#e53935",
                        fontWeight: "bold",
                        width: "100%",
                        textAlign: "center",
                      }}
                    >
                      {params.value}
                    </Typography>
                  )
                },
                {
                  field: "edit",
                  headerName: "Edit",
                  width: 80,
                  renderCell: (params) => (
                    <IconButton onClick={() => handleEditClick(params.row)}>
                      <EditIcon />
                    </IconButton>
                  )
                }
              ]}
              pageSize={5}
              getRowId={(row) => row.user_id || row.id}
              sx={{
                fontFamily: "Nunito, Poppins, sans-serif",
                borderRadius: 2,
                backgroundColor: "#fff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: "#f5f5f5",
                  fontWeight: 400,
                  fontSize: "1.08rem",
                  color: "#222",
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                  borderBottom: "2px solid #e0e0e0",
                  letterSpacing: 0.2,
                },
                '& .MuiDataGrid-cell': {
                  fontSize: "1.08rem",
                  fontWeight: 500,
                  color: "#425466",
                  fontFamily: "Nunito, Poppins, sans-serif",
                  borderBottom: "1px solid #e3e8ee",
                  transition: "background 0.2s",
                },
                '& .MuiDataGrid-row': {
                  transition: "background 0.2s",
                },
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: "#f5faff",
                },
                '& .MuiDataGrid-footerContainer': {
                  borderTop: "1px solid #e0e0e0",
                  backgroundColor: "#fafafa"
                },
                '& .MuiDataGrid-virtualScrollerRenderZone': {
                  '& .MuiDataGrid-row:nth-of-type(odd)': {
                    backgroundColor: "#fcfcfc"
                  },
                  '& .MuiDataGrid-row:nth-of-type(even)': {
                    backgroundColor: "#ffffff"
                  }
                }
              }}
            />
          </div>
        </Box>

        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle
            sx={{
              fontWeight: 700,
              fontFamily: "Nunito, sans-serif",
              fontSize: "1.4rem",
              background: "#f5f7fa",
              letterSpacing: 1,
              pb: 1,
            }}
          >
            Add User
          </DialogTitle>
          <Box sx={{ borderBottom: "1px solid #e0e0e0" }} />
          <DialogContent sx={{ background: "#f9f9fb" }}>
            <Stack spacing={2} mt={1}>
              <TextField
                label="User ID"
                name="user_id"
                variant="outlined"
                fullWidth
                value={form.user_id}
                onChange={handleChange}
                sx={{ fontFamily: "Nunito, sans-serif" }}
                InputLabelProps={{ style: { fontFamily: "Nunito, sans-serif" } }}
                inputProps={{ style: { fontFamily: "Nunito, sans-serif" } }}
              />
              <TextField
                label="Username"
                name="username"
                variant="outlined"
                fullWidth
                value={form.username}
                onChange={handleChange}
                sx={{ fontFamily: "Nunito, sans-serif" }}
                InputLabelProps={{ style: { fontFamily: "Nunito, sans-serif" } }}
                inputProps={{ style: { fontFamily: "Nunito, sans-serif" } }}
              />
              <FormControl fullWidth margin="dense">
                <InputLabel id="district-label">District</InputLabel>
                <Select
                  labelId="district-label"
                  name="district_name"
                  value={form.district_name}
                  label="District"
                  onChange={handleChange}
                  sx={{ fontFamily: "Nunito, sans-serif" }}
                >
                  <MenuItem value="">Select District</MenuItem>
                  <MenuItem value="Chennai">Chennai</MenuItem>
                  <MenuItem value="Coimbatore">Coimbatore</MenuItem>
                  <MenuItem value="Madurai">Madurai</MenuItem>
                  <MenuItem value="Tiruchirappalli">Tiruchirappalli</MenuItem>
                  <MenuItem value="Salem">Salem</MenuItem>
                  {/* ...add more as needed */}
                </Select>
              </FormControl>
              <TextField
                label="Phone Number"
                name="phone_number"
                variant="outlined"
                fullWidth
                value={form.phone_number}
                onChange={handleChange}
                sx={{ fontFamily: "Nunito, sans-serif" }}
                InputLabelProps={{ style: { fontFamily: "Nunito, sans-serif" } }}
                inputProps={{ style: { fontFamily: "Nunito, sans-serif" } }}
              />
              <TextField
                label="Address"
                name="address"
                variant="outlined"
                fullWidth
                value={form.address}
                onChange={handleChange}
                sx={{ fontFamily: "Nunito, sans-serif" }}
                InputLabelProps={{ style: { fontFamily: "Nunito, sans-serif" } }}
                inputProps={{ style: { fontFamily: "Nunito, sans-serif" } }}
              />
              <TextField
                label="Aadhar Number"
                name="aadhar_number"
                variant="outlined"
                fullWidth
                value={form.aadhar_number}
                onChange={handleChange}
                error={!!adhaarError}
                helperText={adhaarError}
                sx={{ fontFamily: "Nunito, sans-serif" }}
                InputLabelProps={{ style: { fontFamily: "Nunito, sans-serif" } }}
                inputProps={{ style: { fontFamily: "Nunito, sans-serif" } }}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ background: "#f7f9fc" }}>
            <Button
              onClick={() => setOpen(false)}
              variant="outlined"
              sx={{
                color: "#e53935",
                borderColor: "#e53935",
                fontFamily: "Nunito, sans-serif",
                fontWeight: 600,
                "&:hover": { background: "#ffebee", borderColor: "#e53935" }
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              sx={{
                background: "linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)",
                color: "#fff",
                fontWeight: 700,
                fontFamily: "Nunito, sans-serif",
                px: 3,
                "&:hover": {
                  background: "linear-gradient(90deg, #1565c0 0%, #64b5f6 100%)"
                }
              }}
            >
              Add
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <Stack spacing={2} mt={1}>
              <TextField
                label="User ID"
                name="user_id"
                value={editForm.user_id}
                fullWidth
                disabled
              />
              <TextField
                label="Username"
                name="username"
                value={editForm.username}
                onChange={handleEditFormChange}
                fullWidth
              />
              <TextField
                label="District"
                name="district_name"
                value={editForm.district_name}
                onChange={handleEditFormChange}
                fullWidth
              />
              <TextField
                label="Phone Number"
                name="phone_number"
                value={editForm.phone_number}
                onChange={handleEditFormChange}
                fullWidth
                inputProps={{
                  maxLength: 10,
                  pattern: "[0-9]{10}",
                  inputMode: "numeric"
                }}
                error={!!editForm.phone_number && editForm.phone_number.length !== 10}
                helperText={
                  editForm.phone_number && editForm.phone_number.length !== 10
                    ? "Phone number must be 10 digits"
                    : ""
                }
              />
              <TextField
                label="Address"
                name="address"
                value={editForm.address}
                onChange={handleEditFormChange}
                fullWidth
              />
              <TextField
                label="Aadhar Number"
                name="aadhar_number"
                value={editForm.aadhar_number}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, ""); // Remove non-digits
                  value = value.slice(0, 12); // Limit to 12 digits
                  // Insert space after every 4 digits
                  value = value.replace(/(.{4})/g, "$1 ").trim();
                  setEditForm({ ...editForm, aadhar_number: value });
                }}
                fullWidth
                inputProps={{
                  maxLength: 14, // 12 digits + 2 spaces
                  inputMode: "numeric"
                }}
                error={
                  !!editForm.aadhar_number &&
                  editForm.aadhar_number.replace(/\s/g, "").length !== 12
                }
                helperText={
                  editForm.aadhar_number &&
                  editForm.aadhar_number.replace(/\s/g, "").length !== 12
                    ? "Aadhar number must be 12 digits"
                    : ""
                }
              />
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={editForm.status}
                  label="Status"
                  onChange={handleEditFormChange}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditOpen(false)} variant="outlined">Cancel</Button>
            <Button onClick={handleEditSave} variant="contained">Save</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
};

export default UserStats;