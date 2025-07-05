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

const columns = [
{
  field: "id",
  headerName: "S.No",
  width: 80,
  renderCell: (params) => (
    <Typography
      sx={{
        fontWeight: "bold",
        width: "100%",
        textAlign: "center",
        display: "flex",
        justifyContent: "center",
      }}
    >
      {params.value}
    </Typography>
  ),
  headerAlign: "center",
  align: "center",
},

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
      .then((userData) => {
        const currentUser = userData.find((u) => u.username === loggedInUsername);
        if (!currentUser?.hub_id) return;

        const userHubId = currentUser.hub_id;
        const userHubName = currentUser.hub_name;
        setUserHubName(userHubName);

        fetch("http://localhost:3000/dashboard/chl-hub-master-data")
          .then((res) => res.json())
          .then((rows) => {
            const filtered = rows.filter((row) => row.hub_id === userHubId);

            const totals = {
              corporation: 0,
              municipalities: 0,
              townPanchayats: 0,
              govtHospitals: 0,
              railwayStations: 0,
              approvedHomes: 0,
              prisons: 0,
              govtInstitutions: 0,
              educationalInstitutions: 0,
              pwdPoondi: 0,
              templeCamp: 0,
              total: 0,
            };

            filtered.forEach((row) => {
              for (const key in totals) {
                totals[key] += row[key] || 0;
              }
            });

            const totalRow = {
              id: "Total",
              district: "TOTAL",
              corporation: totals.corporation,
              municipalities: totals.municipalities,
              townPanchayats: totals.townPanchayats,
              govtHospitals: totals.govtHospitals,
              railwayStations: totals.railwayStations,
              approvedHomes: totals.approvedHomes,
              prisons: totals.prisons,
              govtInstitutions: totals.govtInstitutions,
              educationalInstitutions: totals.educationalInstitutions,
              pwdPoondi: totals.pwdPoondi,
              templeCamp: totals.templeCamp,
              total: totals.total,
              cycle1Status: "",
              cycle2Status: "",
            };

            setFilteredRows([...filtered, totalRow]);
          });
      });
  }, []);

  return (
    <DashboardLayout>
        <div style={{ paddingLeft: "28px" }}>
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

        <Box style={{ height: "100%", width: "100%" }}>
<DataGrid
  rows={filteredRows}
  columns={columns}
  getRowId={(row) => row.id}
  pageSize={5}
  rowsPerPageOptions={[5, 10]}
  sx={{
    fontFamily: "Nunito, sans-serif",
    // border: "2px solid #2A2F5B",
    borderRadius: 2,
    boxShadow: 2,
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: "#2A2F5B",
    },
    "& .MuiDataGrid-columnHeaderTitle": {
      fontWeight: "bold",
      color: "black", // optional for contrast against dark blue
      fontSize: "16px",
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
    "& .MuiDataGrid-row[data-id='total']": {
      backgroundColor: "#e0f7fa",
      fontWeight: "bold",
    },
  }}
/>

        </Box>
      </Box>
      </div>
    </DashboardLayout>
  );
}
