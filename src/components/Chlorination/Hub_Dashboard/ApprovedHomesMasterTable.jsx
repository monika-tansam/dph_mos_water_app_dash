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

const hubDistrictMap = {
  HUB001: [
    "Chennai", "Tirupathur", "Viluppuram", "Kallakurichi", "Chengalpattu",
    "Vellore", "Ranipet", "Thiruvallur", "Tiruvannamalai", "Kancheepuram", "Cuddalore"
  ],
  HUB002: ["Coimbatore", "Tiruppur", "Erode"],
  HUB003: ["Salem", "Namakkal"],
  HUB004: ["Madurai", "Dindigul"],
};

const initialForm = {
  name: "",
  district: "",
};

export default function ApprovedHomesMasterTable() {
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [userHub, setUserHub] = useState("");
  const [userHubName, setUserHubName] = useState("");

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
        }
      });
  }, []);

  const columns = [
    { field: "id", headerName: "S.No", width: 80 },
    { field: "name", headerName: "Home Name", width: 500 },
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
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: "#2A2F5B",
              fontFamily: "Nunito, sans-serif",
            }}
          >
            {userHubName
              ? `${userHubName.toUpperCase()} – APPROVED HOMES MASTER DATA`
              : "APPROVED HOMES MASTER DATA"}
          </Typography>

          <Button variant="contained" onClick={() => setOpenDialog(true)}>
            Add Home
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
            Add Approved Home
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
                {(hubDistrictMap[userHub] || []).map((districtName) => (
                  <MenuItem key={districtName} value={districtName}>
                    {districtName}
                  </MenuItem>
                ))}
              </TextField>
               <TextField
                label="Home Name"
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
