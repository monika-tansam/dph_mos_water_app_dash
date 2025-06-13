import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import DashboardLayout from "./DashboardLayout";
import {
  Box,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";

export default function UserTable() {
  const [filter, setFilter] = React.useState("");
  const navigate = useNavigate();

  const columns = [
    { field: "id", headerName: "S.No", width: 80 },
    { field: "district", headerName: "District Name", width: 180 },
    { field: "userId", headerName: "User ID", width: 130 },
    { field: "name", headerName: "Username", width: 160 },
    { field: "geo", headerName: "Geolocation", width: 220 },
    {
      field: "action",
      headerName: "View",
      sortable: false,
      width: 100,
      renderCell: (params) => (
        <IconButton
          onClick={() =>  window.open(`https://www.google.com/maps?q=${params.row.lat},${params.row.lng}`, '_blank')}
          color="primary"
        >
          <VisibilityIcon />
        </IconButton>
      ),
    },
  ];

  const rows = [
    { id: 1, district: "Chennai", userId: "U001", name: "Ram", geo: "Lat: 13.0827, Lng: 80.2707", lat: 13.0827, lng: 80.2707 },
    { id: 2, district: "Coimbatore", userId: "U002", name: "Kumar", geo: "Lat: 11.0168, Lng: 76.9558", lat: 11.0168, lng: 76.9558 },
    { id: 3, district: "Madurai", userId: "U003", name: "Priya", geo: "Lat: 9.9252, Lng: 78.1198", lat: 9.9252, lng: 78.1198 },
    { id: 4, district: "Tiruchirappalli", userId: "U004", name: "Suresh", geo: "Lat: 10.7905, Lng: 78.7047", lat: 10.7905, lng: 78.7047 },
    { id: 5, district: "Salem", userId: "U005", name: "Meena", geo: "Lat: 11.6643, Lng: 78.1460", lat: 11.6643, lng: 78.1460 },
    { id: 6, district: "Erode", userId: "U006", name: "Gopal", geo: "Lat: 11.3410, Lng: 77.7172", lat: 11.3410, lng: 77.7172 },
    { id: 7, district: "Tirunelveli", userId: "U007", name: "Divya", geo: "Lat: 8.7139, Lng: 77.7567", lat: 8.7139, lng: 77.7567 },
    { id: 8, district: "Thoothukudi", userId: "U008", name: "Arun", geo: "Lat: 8.7642, Lng: 78.1348", lat: 8.7642, lng: 78.1348 },
    { id: 9, district: "Dindigul", userId: "U009", name: "Nisha", geo: "Lat: 10.3673, Lng: 77.9803", lat: 10.3673, lng: 77.9803 },
    { id: 10, district: "Vellore", userId: "U010", name: "Ravi", geo: "Lat: 12.9165, Lng: 79.1325", lat: 12.9165, lng: 79.1325 },
    { id: 11, district: "Thanjavur", userId: "U011", name: "Lakshmi", geo: "Lat: 10.7867, Lng: 79.1378", lat: 10.7867, lng: 79.1378 },
    { id: 12, district: "Kanyakumari", userId: "U012", name: "John", geo: "Lat: 8.0883, Lng: 77.5385", lat: 8.0883, lng: 77.5385 },
    { id: 13, district: "Cuddalore", userId: "U013", name: "Radha", geo: "Lat: 11.7456, Lng: 79.7681", lat: 11.7456, lng: 79.7681 },
    { id: 14, district: "Sivaganga", userId: "U014", name: "Hari", geo: "Lat: 9.8477, Lng: 78.4806", lat: 9.8477, lng: 78.4806 },
    { id: 15, district: "Virudhunagar", userId: "U015", name: "Deepa", geo: "Lat: 9.5850, Lng: 77.9623", lat: 9.5850, lng: 77.9623 },
    { id: 16, district: "Tiruvannamalai", userId: "U016", name: "Bala", geo: "Lat: 12.2253, Lng: 79.0747", lat: 12.2253, lng: 79.0747 },
    { id: 17, district: "Namakkal", userId: "U017", name: "Anu", geo: "Lat: 11.2229, Lng: 78.1652", lat: 11.2229, lng: 78.1652 },
    { id: 18, district: "Nagapattinam", userId: "U018", name: "Muthu", geo: "Lat: 10.7630, Lng: 79.8424", lat: 10.7630, lng: 79.8424 },
    { id: 19, district: "Karur", userId: "U019", name: "Seetha", geo: "Lat: 10.9601, Lng: 78.0766", lat: 10.9601, lng: 78.0766 },
    { id: 20, district: "Krishnagiri", userId: "U020", name: "Vimal", geo: "Lat: 12.5186, Lng: 78.2137", lat: 12.5186, lng: 78.2137 },
  ];

  const filteredRows = rows.filter((row) =>
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes(filter.toLowerCase())
    )
  );

  return (
     <DashboardLayout>
    <Paper elevation={3} sx={{ p: 3, m: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Data Collected (District-wise Information)
      </Typography>
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <Box sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 30]}
          pagination
          disableRowSelectionOnClick
        />
      </Box>
    </Paper>
    </DashboardLayout>
  );
}