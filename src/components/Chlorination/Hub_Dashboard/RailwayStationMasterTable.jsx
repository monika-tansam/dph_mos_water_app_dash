import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DashboardLayout from "../Hub_Dashboard/DashboardLayout";

const initialForm = {
  name: "",
  district: "",
};

export default function RailwayStationsMasterTable() {
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [userHub, setUserHub] = useState("");
  const [userHubName, setUserHubName] = useState("");
  const [hubDistrictMap, setHubDistrictMap] = useState({}); // dynamic districts

  // Fetch user + hub info
  useEffect(() => {
    const loggedInUsername = localStorage.getItem("loggedInUsername");
    if (!loggedInUsername) return;

    fetch("http://localhost:3000/dashboard/chl-hubusers")
      .then((res) => res.json())
      .then((data) => {
        const currentUser = data.find((u) => u.username === loggedInUsername);
        if (currentUser) {
          setUserHub(currentUser.hub_id);
          setUserHubName(currentUser.hub_name || currentUser.hub_id);
        }
      });
  }, []);

  // Fetch hub-wise districts
  useEffect(() => {
    fetch("http://localhost:3000/dashboard/hubs-districts")
      .then((res) => res.json())
      .then((data) => {
        const districtMap = {};
        data.forEach((hubEntry) => {
          districtMap[hubEntry.hub_id] = hubEntry.districts;
        });
        setHubDistrictMap(districtMap);
      })
      .catch((err) => console.error("Failed to fetch districts", err));
  }, []);

  const columns = [
    { field: "id", headerName: "S.No", width: 80 },
    { field: "name", headerName: "Railway Station Name", width: 500 },
    { field: "district", headerName: "District", width: 200 },
  ];

  const handleAdd = () => {
    const newRow = {
      id: rows.length + 1,
      name: formData.name,
      district: formData.district,
    };
    setRows([...rows, newRow]);
    setOpenDialog(false);
    setFormData(initialForm);
  };

  return (
    <DashboardLayout>
      <div style={{ paddingLeft: "28px" }}>
      <Box p={2}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: "#2A2F5B",
              fontFamily: "Nunito, sans-serif",
            }}
          >
            {userHubName
              ? `${userHubName.toUpperCase()} – RAILWAY STATION MASTER DATA`
              : "RAILWAY STATION MASTER DATA"}
          </Typography>

          <Button variant="contained" onClick={() => setOpenDialog(true)}>
            Add Railway Station
          </Button>
        </Box>

        <Box sx={{ height: 400, width: "100%", margin: "0 auto" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={20}
            rowsPerPageOptions={[5]}
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

        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ fontFamily: "Nunito, sans-serif" }}>
            Add Railway Station
          </DialogTitle>
          <DialogContent dividers>
            <Box display="flex" flexDirection="column" gap={2} mt={1}>
              <TextField label="Hub" value={userHub} fullWidth disabled />

              <TextField
                select
                label="District"
                value={formData.district}
                onChange={(e) =>
                  setFormData({ ...formData, district: e.target.value })
                }
                fullWidth
              >
                {(hubDistrictMap[userHub] || []).map((district) => (
                  <MenuItem
                    key={district.district_code}
                    value={district.district_name}
                  >
                    {district.district_name} ({district.district_code})
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Railway Station Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleAdd} variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      </div>
    </DashboardLayout>
  );
}
