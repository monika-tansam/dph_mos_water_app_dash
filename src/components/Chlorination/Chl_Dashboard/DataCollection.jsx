import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import DashboardLayout from "./DashboardLayout";
import {
  Box,
  IconButton,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";

export default function ChlorinationStateData() {
  const [openImg, setOpenImg] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
  const [openMap, setOpenMap] = useState(false);
  const [mapCoords, setMapCoords] = useState({ lat: 0, lng: 0 });

  const rows = [
    {
      id: 1,
      userId: "U001",
      username: "Johndoe",
      hub: "Chennai",
      district: "Tirupattur",
      userGeo: "13.0827, 80.2707",
      image: "https://via.placeholder.com/150",
      geo: "13.0827, 80.2707",
      lat: 13.0827,
      lng: 80.2707,
    },
    {
      id: 2,
      userId: "U002",
      username: "SitaRani",
      hub: "Krishnagiri",
      district: "Coimbatore",
      userGeo: "11.0168, 76.9558",
      image: "https://via.placeholder.com/150",
      geo: "11.0168, 76.9558",
      lat: 11.0168,
      lng: 76.9558,
    },
    {
      id: 3,
      userId: "U003",
      username: "Ramkumar",
      hub: "Thiruchirapalli",
      district: "Karur",
      userGeo: "9.9252, 78.1198",
      image: "https://via.placeholder.com/150",
      geo: "9.9252, 78.1198",
      lat: 9.9252,
      lng: 78.1198,
    },
  ];

  const columns = [
    { field: "id", headerName: "S.No", width: 80 },
    { field: "userId", headerName: "User ID", width: 120 },
    { field: "username", headerName: "Username", width: 130 },
    { field: "hub", headerName: "Hub", width: 130 },
    { field: "district", headerName: "District", width: 130 },
    { field: "userGeo", headerName: "User Geolocation", width: 160 },
    {
      field: "image",
      headerName: "Image",
      width: 100,
      renderCell: (params) => (
        <IconButton
          onClick={() => {
            setImgSrc(params.value);
            setOpenImg(true);
          }}
        >
          <VisibilityIcon />
        </IconButton>
      ),
    },
    { field: "geo", headerName: "Geolocation", width: 160 },
    {
      field: "map",
      headerName: "Map",
      width: 100,
      renderCell: (params) => (
        <IconButton
          onClick={() => {
            setMapCoords({ lat: params.row.lat, lng: params.row.lng });
            setOpenMap(true);
          }}
        >
          <VisibilityIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <Box p={2}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: 600, color: "#2A2F5B", fontFamily: "Nunito, sans-serif" }}
        >
          DATA COLLECTION
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

        {/* Image Dialog */}
        <Dialog open={openImg} onClose={() => setOpenImg(false)} maxWidth="sm">
          <DialogTitle sx={{ fontFamily: "Nunito, sans-serif" }}>
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
            <img
              src={imgSrc}
              alt="Preview"
              style={{ maxWidth: "100%", maxHeight: "400px" }}
            />
          </DialogContent>
        </Dialog>

        {/* Map Dialog */}
        <Dialog open={openMap} onClose={() => setOpenMap(false)} maxWidth="md">
          <DialogTitle sx={{ fontFamily: "Nunito, sans-serif" }}>
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
      </Box>
    </DashboardLayout>
  );
}
