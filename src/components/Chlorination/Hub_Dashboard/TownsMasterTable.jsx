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
  Snackbar,
  Alert,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DashboardLayout from "../Hub_Dashboard/DashboardLayout";

const initialForm = {
  name: "",
  district: "",
};

export default function TownPanchayatsMasterTable() {
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [userHub, setUserHub] = useState("");
  const [userHubName, setUserHubName] = useState("");
  const [districtOptions, setDistrictOptions] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const loggedInUsername = localStorage.getItem("loggedInUsername");
    if (!loggedInUsername) return;

    fetch("http://localhost:3000/dashboard/chl-hubusers")
      .then((res) => res.json())
      .then((data) => {
        const currentUser = data.find((u) => u.username === loggedInUsername);
        if (currentUser) {
          setUserHub(currentUser.hub_id);
          setUserHubName(currentUser.hub_name);

          // 1. Fetch districts for this hub
          fetch(`http://localhost:3000/dashboard/chl-districts-by-hub?hub_id=${currentUser.hub_id}`)
            .then((res) => res.json())
            .then((districts) => {
              setDistrictOptions(districts);

              // 2. Fetch town panchayats (all, filter in FE)
              return fetch("http://localhost:3000/dashboard/townpanchayat-master");
            })
            .then((res) => res.json())
            .then((towns) => {
              const filtered = towns.filter((t) => t.hub_id === currentUser.hub_id);
              const formattedRows = filtered.map((item, index) => ({
                id: index + 1,
                name: item.townpanchayat_name,
                district: item.district_name,
              }));
              setRows(formattedRows);
            });
        }
      })
      .catch((err) => console.error("Error during setup:", err));
  }, []);

  const columns = [
    { field: "id", headerName: "S.No", width: 80 },
    { field: "name", headerName: "Town Panchayat Name", width: 500 },
    { field: "district", headerName: "District", width: 200 },
  ];

  const handleAdd = () => {
    const payload = {
      hub_id: userHub,
      hub_name: userHubName,
      district_name: formData.district,
      townpanchayat_name: formData.name,
    };

    fetch("http://localhost:3000/dashboard/townpanchayat-master", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then(() => {
        const newRow = {
          id: rows.length + 1,
          name: payload.townpanchayat_name,
          district: payload.district_name,
        };
        setRows([...rows, newRow]);
        setOpenDialog(false);
        setFormData(initialForm);
        setOpenSnackbar(true);
      })
      .catch((err) => {
        console.error("Error saving town panchayat:", err);
        alert("Error saving data");
      });
  };

  return (
    <DashboardLayout>
      <Box p={2}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 600, color: "#2A2F5B", fontFamily: "Nunito, sans-serif" }}
          >
            {userHubName
              ? `${userHubName.toUpperCase()} – TOWN PANCHAYAT MASTER DATA`
              : "TOWN PANCHAYAT MASTER DATA"}
          </Typography>

          <Button variant="contained" onClick={() => setOpenDialog(true)}>
            Add Town Panchayat
          </Button>
        </Box>

        <Box sx={{ height: 400, width: "100%", margin: "0 auto" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
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

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontFamily: "Nunito, sans-serif" }}>Add Town Panchayat</DialogTitle>
          <DialogContent dividers>
            <Box display="flex" flexDirection="column" gap={2} mt={1}>
              <TextField label="Hub" value={userHub} fullWidth disabled />
              <TextField
                select
                label="District"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                fullWidth
              >
                {districtOptions.map((district) => (
                  <MenuItem key={district.district_code} value={district.district_name}>
                    {district.district_name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Town Panchayat Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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

        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            Town Panchayat added successfully!
          </Alert>
        </Snackbar>
      </Box>
    </DashboardLayout>
  );
}
