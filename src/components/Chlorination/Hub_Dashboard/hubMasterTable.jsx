import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DashboardLayout from "./DashboardLayout";

const getStatusStyle = (status) => ({
  color: status === "Completed" ? "green" : "red",
  fontWeight: 600,
  fontFamily: "Nunito, sans-serif",
});

const allRows = [
  {
    id: 1,
    hub_id: "HUB001",
    district: "Chennai",
    corporation: 1,
    municipalities: 1,
    townPanchayats: 0,
    govtHospitals: 32,
    railwayStations: 2,
    approvedHomes: 7,
    prisons: 2,
    govtInstitutions: 4,
    educationalInstitutions: 3,
    pwdPoondi: 0,
    templeCamp: 0,
    total: 51,
    cycle1Status: "Completed",
    cycle2Status: "In Progress",
  },
  {
    id: 2,
    hub_id: "HUB002",
    district: "Erode",
    corporation: 1,
    municipalities: 5,
    townPanchayats: 5,
    govtHospitals: 8,
    railwayStations: 1,
    approvedHomes: 2,
    prisons: 1,
    govtInstitutions: 1,
    educationalInstitutions: 1,
    pwdPoondi: 0,
    templeCamp: 0,
    total: 24,
    cycle1Status: "In Progress",
    cycle2Status: "In Progress",
  },
  {
    id: 3,
    hub_id: "HUB003",
    district: "Perambalur",
    corporation: 1,
    municipalities: 6,
    townPanchayats: 14,
    govtHospitals: 9,
    railwayStations: 1,
    approvedHomes: 2,
    prisons: 1,
    govtInstitutions: 1,
    educationalInstitutions: 0,
    pwdPoondi: 0,
    templeCamp: 0,
    total: 34,
    cycle1Status: "Completed",
    cycle2Status: "Completed",
  },
  {
    id: 4,
    hub_id: "HUB004",
    district: "Thoothukudi",
    corporation: 0,
    municipalities: 3,
    townPanchayats: 5,
    govtHospitals: 5,
    railwayStations: 1,
    approvedHomes: 1,
    prisons: 0,
    govtInstitutions: 0,
    educationalInstitutions: 0,
    pwdPoondi: 0,
    templeCamp: 0,
    total: 13,
    cycle1Status: "In Progress",
    cycle2Status: "In Progress",
  },
  {
    id: 5,
    hub_id: "HUB001",
    district: "Kallakurichi",
    corporation: 1,
    municipalities: 1,
    townPanchayats: 0,
    govtHospitals: 32,
    railwayStations: 2,
    approvedHomes: 7,
    prisons: 2,
    govtInstitutions: 4,
    educationalInstitutions: 3,
    pwdPoondi: 0,
    templeCamp: 0,
    total: 51,
    cycle1Status: "Completed",
    cycle2Status: "In Progress",
  },
];

const columns = [
  { field: "id", headerName: "S.No", width: 80 },
  { field: "district", headerName: "District", width: 150 },
  { field: "corporation", headerName: "Corporation", width: 110 },
  { field: "municipalities", headerName: "Municipalities", width: 130 },
  { field: "townPanchayats", headerName: "Town Panchayats", width: 140 },
  { field: "govtHospitals", headerName: "Govt. Hospitals", width: 130 },
  { field: "railwayStations", headerName: "Railway Stations", width: 140 },
  { field: "approvedHomes", headerName: "Approved Homes", width: 130 },
  { field: "prisons", headerName: "Prisons", width: 100 },
  { field: "govtInstitutions", headerName: "Govt. Institutions", width: 140 },
  { field: "educationalInstitutions", headerName: "Educational Inst.", width: 150 },
  { field: "pwdPoondi", headerName: "PWD (Poondi)", width: 120 },
  { field: "templeCamp", headerName: "Temple Camp", width: 120 },
  { field: "total", headerName: "Total", width: 100 },
  {
    field: "cycle1Status",
    headerName: "Cycle 1 Status",
    width: 140,
    renderCell: (params) => (
      <Typography style={getStatusStyle(params.value)}>{params.value}</Typography>
    ),
  },
  {
    field: "cycle2Status",
    headerName: "Cycle 2 Status",
    width: 140,
    renderCell: (params) => (
      <Typography style={getStatusStyle(params.value)}>{params.value}</Typography>
    ),
  },
];

export default function ChlBlockTable() {
  const [filteredRows, setFilteredRows] = useState([]);
  const [userHubName, setUserHubName] = useState("");

  useEffect(() => {
    const loggedInUsername = localStorage.getItem("loggedInUsername");
    if (!loggedInUsername) return;

    fetch("http://localhost:3000/dashboard/chl-hubusers")
      .then((res) => res.json())
      .then((data) => {
        const currentUser = data.find((u) => u.username === loggedInUsername);
        if (currentUser?.hub_id) {
          const userHubId = currentUser.hub_id;
          const userHubName = currentUser.hub_name;
          const filtered = allRows.filter((row) => row.hub_id === userHubId);
          setFilteredRows(filtered);
          setUserHubName(userHubName);
        }
      });
  }, []);

  return (
    <DashboardLayout>
      <Box p={2}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: "#2A2F5B",
            fontFamily: "Nunito, sans-serif",
          }}
        >
          {userHubName
            ? `${userHubName.toUpperCase()} – HUB MASTER DATA`
            : "HUB MASTER DATA"}
        </Typography>

        <Box style={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10]}
            sx={{
              fontFamily: "Nunito, sans-serif",
              border: "2px solid #2A2F5B",
              borderRadius: 2,
              boxShadow: 2,
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#2A2F5B",
                color: "black",
                fontWeight: "bold",
                fontSize: "1rem",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid #ddd",
                fontSize: "0.95rem",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#f0f4ff",
              },
              "& .MuiDataGrid-footerContainer": {
                backgroundColor: "#f9f9f9",
              },
              "& .MuiDataGrid-columnSeparator": {
                visibility: "hidden",
              },
            }}
          />
        </Box>
      </Box>
    </DashboardLayout>
  );
}
