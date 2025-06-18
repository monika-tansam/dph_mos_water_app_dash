import React, { useState } from "react";
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
  IconButton,
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
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
  GridToolbarContainer,
  GridToolbarExportContainer,
  GridCsvExportMenuItem,
  GridPrintExportMenuItem
} from "@mui/x-data-grid"; // ✅ Removed GridExcelExportMenuItem
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  FirstPage,
  LastPage,
  Search as SearchIcon
} from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";


const districts = ["Chennai", "Coimbatore", "Madurai"];

const COLORS = ["#007556", "#e53935"];

const sampleData = {
  Today: { active: 30, inactive: 10 },
  Week: { active: 120, inactive: 40 },
  Month: { active: 500, inactive: 150 },
};

const columns = [
  { field: "userid", headerName: "User ID", width: 100 },
  { field: "username", headerName: "Username", width: 150 },
  { field: "district", headerName: "District", width: 130 },
  { field: "phonenumber", headerName: "Phone Number", width: 140 },
  { field: "address", headerName: "Address", width: 180 },
  { field: "adhaarnumber", headerName: "Adhaar Number", width: 150 },
  {
    field: "status",
    headerName: "Status",
    width: 120,
    align: "center",           
    headerAlign: "center",     
    renderCell: (params) => (
      <Typography
        sx={{
          color: params.value === "Active" ? "#007556" : "#e53935",
          fontWeight: "bold",
          width: "100%",
          textAlign: "center", 
          paddingTop:"2px",
        }}
      >
        {params.value}
      </Typography>
    )
  }
];

function CustomPagination({ page, setPage, pageCount }) {
  return (
    <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ py: 2 }}>
      <Button onClick={() => setPage(0)} disabled={page === 0} startIcon={<FirstPage />} />
      <Button onClick={() => setPage(page - 1)} disabled={page === 0} startIcon={<KeyboardArrowLeft />} />
      <Typography sx={{ px: 2 }}>{`Page ${page + 1} of ${pageCount}`}</Typography>
      <Button onClick={() => setPage(page + 1)} disabled={page >= pageCount - 1} endIcon={<KeyboardArrowRight />} />
      <Button onClick={() => setPage(pageCount - 1)} disabled={page >= pageCount - 1} endIcon={<LastPage />} />
    </Stack>
  );
}

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExportContainer>
        <GridCsvExportMenuItem options={{ fileName: "State_Users_Export" }} />
        <GridPrintExportMenuItem />
        {/* Excel export is not available in the free version */}
      </GridToolbarExportContainer>
    </GridToolbarContainer>
  );
}

const UserStats = () => {
  const [filter, setFilter] = useState("Today");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    userid: "",
    username: "",
    district: "",
    phonenumber: "",
    address: "",
    adhaarnumber: "",
  });
  const [adhaarError, setAdhaarError] = useState('');

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
      (user.userid || "").toLowerCase().includes(searchValue) ||
      (user.district || "").toLowerCase().includes(searchValue);

    const matchesStatus =
      statusFilter === "All" || user.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const paginatedUsers = filteredUsers.slice(
    page * pageSize,
    page * pageSize + pageSize
  );

  
  const validateAdhaar = (value) => /^\d{12}$/.test(value);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === 'adhaarnumber') {
      setAdhaarError(validateAdhaar(e.target.value) ? '' : 'Adhaar must be 12 digits');
    }
  };

  const handleSubmit = () => {
    if (!validateAdhaar(form.adhaarnumber)) {
      setAdhaarError('Adhaar must be 12 digits');
      return;
    }
    setUsers([
      ...users,
      {
        id: users.length + 1,
        ...form,
        status: "Active",
      },
    ]);
    setOpen(false);
    setForm({
      userid: "",
      username: "",
      district: "",
      phonenumber: "",
      address: "",
      adhaarnumber: "",
    });
  };

  return (
    <DashboardLayout>
      <Card sx={{ p: 3, borderRadius: 3, backgroundColor: "#f9f9f9", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", fontFamily: "Poppins, sans-serif" }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: "#333" }}>
               STATE USERS STATISTICS
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

      <Box mt={4} sx={{ background: "#fff", borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)", p: 2 }}>
        <Typography
          variant="h6"
          sx={{
            fontFamily: "Nunito, Poppins, sans-serif", 
            fontWeight: 600,
            mb: 2
          }}
        >
          STATE USERS LIST
        </Typography>

        <Box display="flex" alignItems="center" mb={2} gap={1}>
          {/* Search filter on the left */}
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              width: 220,
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

          {/* Status filter dropdown */}
          <FormControl size="small" sx={{ minWidth: 120, background: "#f5f7fa", borderRadius: 2, ml: 1 }}>
            <InputLabel id="status-filter-label" sx={{ fontFamily: "Nunito, Poppins, sans-serif" }}>Status</InputLabel>
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

          {/* Add User button on the right */}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
            sx={{
              ml: 130, // Adds space (margin-left) to the left of the button
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
              "&:hover": {
                background: "linear-gradient(90deg, #1565c0 0%, #64b5f6 100%)",
                boxShadow: 4,
              },
            }}
          >
            Add User
          </Button>
        </Box>

        <div style={{ height: 480, width: "100%" }}>
          <DataGrid
            rows={filteredUsers}
            columns={columns}
            pageSize={5}
            getRowId={(row) => row.userid || row.id}
            sx={{
              fontFamily: "Nunito, Poppins, sans-serif",
              borderRadius: 2,
              backgroundColor: "#fff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: "#f5f5f5",
                fontWeight: 400,         // Not bold
                fontSize: "1.08rem",
                color: "#222",           // Just black
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

        {/* Add User Dialog */}
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
                name="userid"
                variant="outlined"
                fullWidth
                value={form.userid}
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
              <FormControl fullWidth>
                <InputLabel id="district-label" sx={{ fontFamily: "Nunito, sans-serif" }}>District</InputLabel>
                <Select
                  labelId="district-label"
                  name="district"
                  value={form.district || ""}
                  label="District"
                  onChange={handleChange}
                  sx={{ fontFamily: "Nunito, sans-serif" }}
                >
                  <MenuItem value="">Select District</MenuItem>
                  {districts.map((district) => (
                    <MenuItem key={district} value={district} sx={{ fontFamily: "Nunito, sans-serif" }}>
                      {district}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Phone Number"
                name="phonenumber"
                variant="outlined"
                fullWidth
                value={form.phonenumber}
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
                label="Adhaar Number"
                name="adhaarnumber"
                variant="outlined"
                fullWidth
                value={form.adhaarnumber}
                onChange={handleChange}
                error={!!adhaarError}
                helperText={adhaarError}
                sx={{ fontFamily: "Nunito, sans-serif" }}
                InputLabelProps={{ style: { fontFamily: "Nunito, sans-serif" } }}
                inputProps={{ style: { fontFamily: "Nunito, sans-serif" } }}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ background: "#f5f7fa" }}>
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
      </Box>
    </DashboardLayout>
  );
};

export default UserStats;
