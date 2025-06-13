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
  InputAdornment
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

const COLORS = ["#27ae60", "#e53935"]; // Neat green for Active, red for Inactive

const sampleData = {
  Today: { active: 30, inactive: 10 },
  Week: { active: 120, inactive: 40 },
  Month: { active: 500, inactive: 150 },
};

const allUsers = Array.from({ length: 40 }, (_, i) => ({
  id: i + 1,
  userId: `U${(i + 1).toString().padStart(3, "0")}`,
  district: [
    "Chennai", "Madurai", "Salem", "Coimbatore", "Trichy",
    "Erode", "Thanjavur", "Tirunelveli", "Kanyakumari", "Dindigul",
    "Thoothukudi", "Vellore", "Tiruvallur", "Karur", "Cuddalore",
    "Namakkal", "Tiruppur", "Nagapattinam", "Villupuram", "Perambalur",
    "Ramanathapuram", "Sivaganga", "Pudukkottai", "Ariyalur", "Krishnagiri",
    "Dharmapuri", "Tenkasi", "Ranipet", "Chengalpattu", "Kallakurichi",
    "Tirupathur", "Nilgiris", "Mayiladuthurai", "Theni", "Sivakasi",
    "Virudhunagar", "Thiruvarur", "Thiruvannamalai", "Tiruchengode", "Sankarankoil"
  ][i],
  name: [
    "Monika", "Ajay", "Keerthana", "Ravi", "Anu", "Kumar", "Meena", "Vikram", "Latha", "Naveen",
    "Divya", "Sathish", "Sneha", "Raj", "Geetha", "Arjun", "Lakshmi", "Deepak", "Nisha", "Muthu",
    "Harish", "Priya", "Suresh", "Sandhya", "Vimal", "Preethi", "Gokul", "Shalini", "Manoj", "Aarthi",
    "Vasanth", "Kavya", "Pradeep", "Shree", "Yamini", "Saravanan", "Jaya", "Vijay", "Renu", "Karthik"
  ][i],
  status: i % 2 === 0 ? "Active" : "Inactive"
}));

const userColumns = [
  { field: "userId", headerName: "User ID", flex: 1 },
  { field: "district", headerName: "District", flex: 1 },
  { field: "name", headerName: "Username", flex: 1 },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    renderCell: (params) => (
      <Typography
        sx={{
          color: params.value === "Active" ? "#27ae60" : "#e53935", // Royal green for Active, red for Inactive
          fontWeight: "bold"
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

  const active = sampleData[filter].active;
  const inactive = sampleData[filter].inactive;
  const total = active + inactive;

  const pieData = [
    { name: "Active", value: active },
    { name: "Inactive", value: inactive }
  ];

  const filteredUsers = allUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.userId.toLowerCase().includes(search.toLowerCase()) ||
      user.district.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || user.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const paginatedUsers = filteredUsers.slice(
    page * pageSize,
    page * pageSize + pageSize
  );

  return (
    <DashboardLayout>
      <Card sx={{ p: 3, borderRadius: 3, backgroundColor: "#f9f9f9", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", fontFamily: "Poppins, sans-serif" }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: "#333" }}>
                State Users Statistics
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
        <Typography variant="h6" sx={{ fontFamily: "Poppins", fontWeight: 600, mb: 2 }}>
          State Users List
        </Typography>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by name, district, or user ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Select
              fullWidth
              size="small"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </Grid>
        </Grid>

        <div style={{ height: 480, width: "100%" }}>
          <DataGrid
            rows={paginatedUsers}
            columns={userColumns}
            rowCount={filteredUsers.length}
            page={page}
            onPageChange={(newPage) => setPage(newPage)}
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            pagination
            paginationMode="client"
            rowsPerPageOptions={[5, 10, 20, 50]}
            disableSelectionOnClick
            slots={{
              pagination: (props) => (
                <CustomPagination
                  {...props}
                  page={page}
                  setPage={setPage}
                  pageCount={Math.ceil(filteredUsers.length / pageSize)}
                />
              ),
              toolbar: CustomToolbar
            }}
            sx={{
              fontFamily: "Poppins",
              borderRadius: 2,
              backgroundColor: "#fff",
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: "#f1f1f1",
                fontWeight: "bold",
                fontSize: "0.95rem",
                color: "#333",
              },
              '& .MuiDataGrid-cell': {
                fontSize: "0.9rem",
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
    </DashboardLayout>
  );
};

export default UserStats;
