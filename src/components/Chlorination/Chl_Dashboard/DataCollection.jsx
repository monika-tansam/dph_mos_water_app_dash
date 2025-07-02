import React, { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import DashboardLayout from "./DashboardLayout";
import { DataGrid } from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";

export default function ChlorinationStateData() {
  const [rows, setRows] = useState([]);
  const [hubFilter, setHubFilter] = useState("");
  const [openMap, setOpenMap] = useState(false);
  const [mapCoords, setMapCoords] = useState({ lat: 0, lng: 0 });
  const [openImg, setOpenImg] = useState(false);
  const [imgSrcs, setImgSrcs] = useState([]);
  const [imgIndex, setImgIndex] = useState(0);

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:3000/dashboard/chl_datacollection");
        const result = await res.json();

        if (Array.isArray(result.data)) {
          const formatted = result.data.map((item, index) => ({
            id: index + 1,
            ...item,
          }));
          setRows(formatted);
        } else {
          console.error("Invalid data format:", result);
        }
      } catch (err) {
        console.error("Failed to fetch chlorination data:", err);
      }
    };

    fetchData();
  }, []);

  const hubs = [...new Set(rows.map((r) => r.hub_name))];
  const filteredRows = hubFilter
    ? rows.filter((row) => row.hub_name === hubFilter)
    : rows;

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
        } else if (ppm > 2.05) {
          text = "Over Chlorinated";
          color = "orange";
        }

        return (
          <Typography
            variant="body2"
            style={{
              fontWeight: 600,
              color: color,
              fontFamily: "Nunito, sans-serif",
            }}
          >
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
        const lat = params.row.latitude;
        const lng = params.row.longitude;
        const valid = lat != null && lng != null;
        return valid ? (
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
        const isChlorineImage = src && src.includes("chlorine_image_");

        return isChlorineImage ? (
          <IconButton
            onClick={() => {
              const cleanPath = src.replace(/\\/g, "/").replace(/^\/?/, "");
              setImgSrcs([`http://localhost:3000/${cleanPath}`]);
              setImgIndex(0);
              setOpenImg(true);
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
  ];

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
          CHLORINATION DATA COLLECTION
        </Typography>

        {/* Filter */}
        <Box display="flex" gap={2} alignItems="center" mb={2}>
          <FormControl sx={{ minWidth: 200 }} size="small">
            <Select
              displayEmpty
              value={hubFilter}
              onChange={(e) => setHubFilter(e.target.value)}
              sx={{ fontFamily: "Nunito, sans-serif" }}
            >
              <MenuItem value="">
                <em>All Hubs</em>
              </MenuItem>
              {hubs.map((hub, index) => (
                <MenuItem key={index} value={hub}>
                  {hub}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Data Grid */}
        <Box style={{ height: 500, width: "100%" }}>
          <DataGrid
            rows={filteredRows}
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

        {/* Image Viewer */}
       <Dialog open={openImg} onClose={() => setOpenImg(false)} maxWidth="md" fullWidth>
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
<Dialog open={openImg} onClose={() => setOpenImg(false)} maxWidth="md" fullWidth>
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
   <DialogContent sx={{ p: 2, backgroundColor: "#f5f5f5" }}>
  {imgSrcs.length > 0 ? (
    <Box
      sx={{
        backgroundColor: "#fff",
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: 2,
        position: "relative",
        width: "100%",
        maxWidth: "100%",
      }}
    >
      {/* Image */}
      <Box
        sx={{
          width: "100%",
          height: "45vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000",
        }}
      >
        <img
          src={imgSrcs[imgIndex]}
          alt={`img-${imgIndex}`}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
          }}
        />
      </Box>

      {/* Overlay Metadata */}
      <Box
        sx={{
          position: "absolute",
          bottom: 10,
          left: 10,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          color: "#fff",
          padding: "8px 12px",
          borderRadius: 2,
          fontSize: "0.85rem",
          fontFamily: "Nunito, sans-serif",
          maxWidth: "85%",
        }}
      >
        <Typography><strong>Lat:</strong> {filteredRows[imgIndex]?.latitude}</Typography>
        <Typography><strong>Lng:</strong> {filteredRows[imgIndex]?.longitude}</Typography>
        <Typography><strong>Timestamp:</strong> {filteredRows[imgIndex]?.timestamp}</Typography>
        <Typography><strong>Hub:</strong> {filteredRows[imgIndex]?.hub_name}</Typography>
      </Box>
    </Box>
  ) : (
    <Typography sx={{ fontFamily: "Nunito, sans-serif", p: 2 }}>
      No Image Available
    </Typography>
  )}       
</DialogContent>


</Dialog>

</Dialog>

      </Box>
    </DashboardLayout>
  );
}
