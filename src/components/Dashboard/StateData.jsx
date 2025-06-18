import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import DashboardLayout from "./DashboardLayout";
import {
  Box,
  IconButton,
  Paper,
  Typography,
  MenuItem,
  FormControl,
  Select,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

export default function UserTable() {
  const [filter, setFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [rows, setRows] = useState([]);
  const [openImg, setOpenImg] = useState(false);
  const [imgSrcs, setImgSrcs] = useState([]);
  const [imgIndex, setImgIndex] = useState(0);
  const [openMap, setOpenMap] = useState(false);
  const [mapCoords, setMapCoords] = useState({ lat: 0, lng: 0 });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const username = "karthi@example.com"; // change if dynamic

  useEffect(() => {
    const getData = async () => {
      try {
        const resp = await fetch("http://localhost:3000/dashboard", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
        });
        if (!resp.ok) {
          console.error("Fetch error", await resp.json());
          return;
        }
        const data = await resp.json();
        const formatted = data.map((d, i) => ({
          id: i + 1,
          district: d.district,
          userId: d.user_id,
          name: d.user_name,
          userGeo: `Lat: ${d.user_lat}, Lng: ${d.user_lng}`,
          date: d.date,
          time: d.time,
          pictures: d.pictures,
          geo: `Lat: ${d.lat}, Lng: ${d.lng}`,
          lat: d.lat,
          lng: d.lng,
        }));
        setRows(formatted);
      } catch (e) {
        console.error("Error fetching dashboard data", e);
      }
    };
    getData();
  }, [username]);

  const districts = Array.from(new Set(rows.map((row) => row.district)));

  const filteredRows = rows.filter((row) => {
    const matchesFilter = filter ? row.name.toLowerCase().includes(filter.toLowerCase()) : true;
    const matchesDistrict = districtFilter ? row.district === districtFilter : true;
    return matchesFilter && matchesDistrict;
  });

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "district", headerName: "District", width: 130 },
    { field: "userId", headerName: "User ID", width: 130 },
    { field: "name", headerName: "UserName", width: 130 },
    { field: "userGeo", headerName: "User Geolocation", width: 200 },
    { field: "date", headerName: "Date", width: 130 },
    { field: "time", headerName: "Time", width: 130 },
    { field: "geo", headerName: "Geolocation", width: 200 },
    {
      field: "pictures",
      headerName: "Images",
      width: 100,
      renderCell: (params) => (
        <IconButton
          onClick={() => {
            setImgSrcs(params.value || []);
            setImgIndex(0);
            setOpenImg(true);
          }}
        >
          <VisibilityIcon />
        </IconButton>
      ),
    },
    {
      field: "mapView",
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
        <Typography variant="h5" gutterBottom>
          DATA COLLECTION (District-Wise Information)
        </Typography>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <Select
            displayEmpty
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
          >
            <MenuItem value="">
              <em>All Districts</em>
            </MenuItem>
            {districts.map((district, index) => (
              <MenuItem key={index} value={district}>
                {district}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box style={{ height: 600, width: "100%" }}>
          <DataGrid rows={filteredRows} columns={columns} pageSize={10} />
        </Box>

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
            {imgSrcs.length > 0 ? (
              <img
                src={imgSrcs[imgIndex]}
                alt={`img-${imgIndex}`}
                style={{ maxWidth: "100%", maxHeight: "70vh" }}
              />
            ) : (
              <Typography>No Image Available</Typography>
            )}
          </DialogContent>
        </Dialog>

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
              title="Map View"
              width="100%"
              height="400"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src={`https://www.google.com/maps?q=${mapCoords.lat},${mapCoords.lng}&z=15&output=embed`}
            ></iframe>
          </DialogContent>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
}
