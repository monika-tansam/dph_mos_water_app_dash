import React, { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import DashboardLayout from "./DashboardLayout";
import { DataGrid } from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";

export default function HubStateData() {
  const [rows, setRows] = useState([]);
  const [openMap, setOpenMap] = useState(false);
  const [mapCoords, setMapCoords] = useState({ lat: 0, lng: 0 });
  const [openImg, setOpenImg] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
  const [imgMeta, setImgMeta] = useState({
    timestamp: "",
    latitude: "",
    longitude: "",
    hub_name: "",
  });

  // Get user_id and derive hub_id
  const userId = localStorage.getItem("user_id"); // e.g., "HUB001USR002"
  const hubId = userId ? userId.substring(0, 6).toUpperCase() : null;
useEffect(() => {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!user || !user.hub_id) {
    toast.error("Hub ID missing. Please log in again.");
    return;
  }

  console.log("Fetching data for hub_id:", user.hub_id);

  fetch(`http://localhost:3000/dashboard/chl_datacollection/hubid?hub_id=${user.hub_id}`, {
    credentials: "include"
  })
    .then((res) => res.json())
    .then((data) => {
      // console.log("API Response:", data); --->Debugging line to check API response
      // Try this:
      if (Array.isArray(data)) {
        setRows(data); // ✅ if your backend returns array directly
      } else if (Array.isArray(data.data)) {
        setRows(data.data); // ✅ if your backend returns { status: 'success', data: [...] }
      } else {
        toast.error("Unexpected API response");
      }
    })
    .catch((err) => {
      console.error(err);
      toast.error("Network error");
    });
}, []);

  const columns = [
    { field: "id", headerName: "S.No", width: 80 },
    { field: "user_id", headerName: "User ID", width: 180 },
    { field: "username", headerName: "Username", width: 140 },
    { field: "hub_id", headerName: "Hub ID", width: 120 },
    { field: "hub_name", headerName: "Hub Name", width: 140 },
    { field: "ppm", headerName: "PPM Value", width: 100 },
    {
      field: "chlorine_status",
      headerName: "Status",
      width: 200,
      renderCell: (params) => {
        const ppm = parseFloat(params.row.ppm);
        let text = "";
        let color = "";

        if (ppm >= 1.95 && ppm <= 2.05) {
          text = "Perfectly Chlorinated";
          color = "green";
        } else if (ppm < 1.95) {
          text = "Needs More Chlorine";
          color = "red";
        } else {
          text = "Over Chlorinated";
          color = "orange";
        }

        return (
          <Typography variant="body2" style={{ fontWeight: 600, color }}>
            {text}
          </Typography>
        );
      },
    },
    { field: "timestamp", headerName: "Timestamp", width: 200 },
    { field: "latitude", headerName: "Latitude", width: 120 },
    { field: "longitude", headerName: "Longitude", width: 120 },
    {
      field: "map",
      headerName: "Map",
      width: 100,
      renderCell: (params) => {
        const { latitude: lat, longitude: lng } = params.row;
        return lat && lng ? (
          <IconButton
            onClick={() => {
              setMapCoords({ lat, lng });
              setOpenMap(true);
            }}
          >
            <VisibilityIcon />
          </IconButton>
        ) : (
          <Typography variant="body2" color="text.secondary">
            N/A
          </Typography>
        );
      },
    },
    {
      field: "images",
      headerName: "Images",
      width: 100,
      renderCell: (params) => {
        const src = params.row.image_path;
        if (!src) return <Typography color="text.secondary">N/A</Typography>;

        const cleanPath = src.replace(/\\/g, "/").replace(/^\/+/, "");
        const fullPath = `http://localhost:3000/${cleanPath}`;

        return (
          <IconButton
            onClick={() => {
              setImgSrc(fullPath);
              setImgMeta({
                timestamp: params.row.timestamp,
                latitude: params.row.latitude,
                longitude: params.row.longitude,
                hub_name: params.row.hub_name,
              });
              setOpenImg(true);
            }}
          >
            <VisibilityIcon />
          </IconButton>
        );
      },
    },
  ];

  return (
    <DashboardLayout>
      <div style={{ paddingLeft: "28px" }}>
      <Box p={2}>
        <Typography variant="h5" gutterBottom fontWeight={600}>
          HUB DATA COLLECTION
        </Typography>

        <Box style={{ height: 500, width: "100%" }}>
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

        {/* Map Dialog */}
        <Dialog open={openMap} onClose={() => setOpenMap(false)} maxWidth="md">
          <DialogTitle>
            Location Map
            <IconButton
              aria-label="close"
              onClick={() => setOpenMap(false)}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <iframe
              title="Map"
              width="100%"
              height="400"
              frameBorder="0"
              style={{ border: 0 }}
              src={`https://maps.google.com/maps?q=${mapCoords.lat},${mapCoords.lng}&z=15&output=embed`}
              allowFullScreen
            ></iframe>
          </DialogContent>
        </Dialog>

        {/* Image Dialog */}
        <Dialog open={openImg} onClose={() => setOpenImg(false)} maxWidth="md">
          <DialogTitle>
            Image Viewer
            <IconButton
              aria-label="close"
              onClick={() => setOpenImg(false)}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Box position="relative">
              <img
                src={imgSrc}
                alt="Preview"
                style={{ maxWidth: "100%", maxHeight: "400px" }}
              />
              <Box mt={2}>
                <Typography variant="body2">
                  <strong>Timestamp:</strong> {imgMeta.timestamp || "N/A"}
                </Typography>
                <Typography variant="body2">
                  <strong>Location:</strong> {imgMeta.latitude}, {imgMeta.longitude}
                </Typography>
                <Typography variant="body2">
                  <strong>Hub:</strong> {imgMeta.hub_name || "N/A"}
                </Typography>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
      </div>
    </DashboardLayout>
  );
}
