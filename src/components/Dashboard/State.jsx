import React, { useState, useEffect } from "react";
import DashboardLayout from "./DashboardLayout";
import {
  Box, Typography, Button, Stack, TextField, Dialog, 
  DialogTitle, DialogContent, DialogActions, FormControl, 
  InputLabel, Select, MenuItem, CircularProgress
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Search as SearchIcon } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";

const UserStats = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    user_id: "",
    username: "",
    password: "",
    district_code: "",
    phone_number: "",
    status: "Active"
  });

  const [errors, setErrors] = useState({
    password: "",
    district: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [districtsRes, usersRes] = await Promise.all([
          fetch('http://localhost:3000/dashboard/mos-district'),
          fetch('http://localhost:3000/dashboard/district-officers')
        ]);
        
        const districtsData = await districtsRes.json();
        const usersData = await usersRes.json();
        
        setDistricts(districtsData);
        setUsers(usersData);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

const handleDistrictChange = async (e) => {
  const district_code = e.target.value;
  if (!district_code) {
    setForm(prev => ({ ...prev, district_code: "", user_id: "" }));
    return;
  }

  try {
    // Verify district exists
    const district = districts.find(d => d.district_code === district_code);
    if (!district) {
      setErrors(prev => ({ ...prev, district: 'Invalid district selected' }));
      return;
    }

    // Get count of existing officers for this district
    const response = await fetch(`http://localhost:3000/dashboard/officer-count?district=${encodeURIComponent(district_code)}`, {
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch officer count');
    }
    
    const data = await response.json();
    const count = data.count || 0;

    // Generate user_id
    const prefix = district_code.substring(0, 5).toUpperCase();
    const user_id = `${prefix}${String(count + 1).padStart(3, '0')}`;

    setForm(prev => ({
      ...prev,
      district_code,
      user_id,
    }));
    setErrors(prev => ({ ...prev, district: "" }));

  } catch (err) {
    console.error('Error generating user ID:', err);
    setErrors(prev => ({ 
      ...prev, 
      district: 'Failed to generate user ID. Please try again.' 
    }));
  }
};

  const validatePassword = (value) => {
    if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{8,}$/.test(value)) {
      return 'Password must be 8+ chars with 1 uppercase, 1 number, 1 special char';
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    if (name === 'password') {
      setErrors(prev => ({ ...prev, password: validatePassword(value) }));
    }
  };

  const handleSubmit = async () => {
    if (errors.password || !form.district_code || !form.username || !form.password) {
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/login/add-district-officer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add officer');
      }
      
      const newUser = await response.json();
      setUsers(prev => [...prev, newUser]);
      setOpen(false);
      setForm({
        user_id: "",
        username: "",
        password: "",
        district_code: "",
        phone_number: "",
        status: "Active"
      });
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <DashboardLayout>
      <Box mt={4} sx={{ background: "#fff", borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)", p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>DISTRICT OFFICERS</Typography>

        <Box display="flex" gap={1} mb={2}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search officers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 220 }}
            InputProps={{ startAdornment: <SearchIcon color="action" /> }}
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
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
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Add Officer'}
          </Button>
        </Box>

        <div style={{ height: 480, width: '100%' }}>
          <DataGrid
            rows={users.filter(user => 
              (user.username?.toLowerCase().includes(search.toLowerCase()) ||
               user.user_id?.toLowerCase().includes(search.toLowerCase())) &&
              (statusFilter === "All" || user.status === statusFilter)
            )}
            columns={[
              { field: "user_id", headerName: "Officer ID", width: 150 },
              { field: "username", headerName: "Username", width: 180 },
              { field: "district_name", headerName: "District", width: 200 },
              { field: "phone_number", headerName: "Phone", width: 150 },
              { 
                field: "status", 
                headerName: "Status", 
                width: 120,
                renderCell: (params) => (
                  <Typography color={params.value === "Active" ? "success.main" : "error.main"}>
                    {params.value}
                  </Typography>
                )
              }
            ]}
            loading={loading}
            pageSize={5}
            getRowId={(row) => row.user_id}
          />
        </div>

        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add District Officer</DialogTitle>
          <DialogContent>
            <Stack spacing={2} mt={1}>
              <FormControl fullWidth error={!!errors.district}>
                <InputLabel>District *</InputLabel>
                <Select
                  name="district_code"
                  value={form.district_code}
                  label="District *"
                  onChange={handleDistrictChange}
                  required
                >
                  <MenuItem value="">Select District</MenuItem>
                  {districts.map((district) => (
                    <MenuItem key={district.district_code} value={district.district_code}>
                      {district.district_name} ({district.district_code})
                    </MenuItem>
                  ))}
                </Select>
                {errors.district && <Typography color="error" variant="caption">{errors.district}</Typography>}
              </FormControl>

              <TextField 
                label="Officer ID" 
                value={form.user_id}
                disabled
                fullWidth
                helperText="Auto-generated based on district"
              />

              <TextField
                label="Username *"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                fullWidth
              />

              <TextField
                label="Password *"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                required
                fullWidth
              />

              <TextField
                label="Phone Number"
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
                fullWidth
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="error">Cancel</Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained"
              disabled={!form.district_code || !form.username || !form.password || !!errors.password}
            >
              Add Officer
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
};

export default UserStats;