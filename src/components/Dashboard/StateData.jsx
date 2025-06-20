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
  const [areaFilter, setAreaFilter] = useState("");
  const [rows, setRows] = useState([]);
  const [openImg, setOpenImg] = useState(false);
  const [imgSrcs, setImgSrcs] = useState([]);
  const [imgIndex, setImgIndex] = useState(0);
  const [openMap, setOpenMap] = useState(false);
  const [mapCoords, setMapCoords] = useState({ lat: 0, lng: 0 });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const username = "karthi@example.com";

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
        console.log("Raw API data:", data); // Debug log
        const formatted = data.map((d, i) => {
          // Parse user_geolocation (format: "lat, lng")
          let userLat = null;
          let userLng = null;
          if (d.user_geolocation) {
            const [lat, lng] = d.user_geolocation.split(",").map((coord) => parseFloat(coord.trim()));
            userLat = lat;
            userLng = lng;
          }

          // Parse geolocation (JSON string with latitude/longitude)
          let lat = null;
          let lng = null;
          if (d.geolocation) {
            try {
              const geoObj = JSON.parse(d.geolocation);
              lat = geoObj.latitude;
              lng = geoObj.longitude;
            } catch (e) {
              // fallback or leave as null
            }
          }

          return {
            id: i + 1,
            district_name: d.district_name,
            userId: d.user_id,
            username: d.username,
            userGeo: userLat && userLng ? `Lat: ${userLat}, Lng: ${userLng}` : "N/A",
            date: d.date,
            time: d.time,
            pictures: d.image_base64 ? [`http://localhost:3000/${d.image_base64.replace(/\\/g, '/')}`] : [],
            geo: lat && lng ? `Lat: ${lat}, Lng: ${lng}` : "N/A",
            lat: lat || 0,
            lng: lng || 0,
            areaType: d.areaType || "",
          };
        });

        setRows(formatted);
      } catch (e) {
        console.error("Error fetching dashboard data", e);
      }
    };
    getData();
  }, [username]);

  const districts = [
    "Chennai",
    "Coimbatore",
    "Madurai",
    "Tiruchirappalli",
    "Thiruvallur",
    "Krishnagiri",
    "Salem",
    "Tirunelveli",
    "Vellore",
    "Erode",
    "Thoothukudi",
    "Thanjavur",
    "Dindigul",
    "Cuddalore",
    "Kanchipuram",
    "Kanyakumari",
    "Karur",
    "Nagapattinam",
    "Namakkal",
    "Perambalur",
    "Pudukkottai",
    "Ramanathapuram",
    "Sivaganga",
    "Theni",
    "The Nilgiris",
    "Thiruvallur",
    "Thiruvarur",
    "Tiruppur",
    "Tiruvannamalai",
    "Villupuram",
    "Virudhunagar",
  ];

  const filteredRows = rows.filter((row) => {
    const matchesFilter = filter ? row.username.toLowerCase().includes(filter.toLowerCase()) : true;
    const matchesDistrict = districtFilter ? row.district_name === districtFilter : true;
    const matchesArea = areaFilter ? (row.area_type || "").toLowerCase() === areaFilter.toLowerCase() : true;
    return matchesFilter && matchesDistrict && matchesArea;
  });

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "district_name", headerName: "District", width: 130 },
    { field: "userId", headerName: "User ID", width: 130 },
    { field: "username", headerName: "UserName", width: 130 },
    { field: "areaType", headerName: "Area Type", width: 120 }, // <-- Added column
    // { field: "userGeo", headerName: "User Geolocation", width: 200 },
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
      <Box p={2} sx={{ fontFamily: "Nunito, Poppins, sans-serif" }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: 550, color: "#2A2F5B", fontFamily: "Nunito, sans-serif" }}
        >
          DATA COLLECTION (District-Wise Information)
        </Typography>
        <Box display="flex" gap={2} alignItems="center" mb={2}>
          <FormControl sx={{ minWidth: 120 }} size="small">
            <Select
              displayEmpty
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              sx={{ fontFamily: "Nunito, sans-serif" }}
            >
              <MenuItem value="">
                <em>All Districts</em>
              </MenuItem>
              {districts.map((district, index) => (
                <MenuItem key={index} value={district} sx={{ fontFamily: "Nunito, sans-serif" }}>
                  {district}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 120 }} size="small">
            <Select
              displayEmpty
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              sx={{ fontFamily: "Nunito, sans-serif" }}
            >
              <MenuItem value="">
                <em>All Areas</em>
              </MenuItem>
              <MenuItem value="Urban">Urban</MenuItem>
              <MenuItem value="Rural">Rural</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box style={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            pageSize={10}
            sx={{
              fontFamily: "Nunito, Poppins, sans-serif",
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f5f5f5",
                fontWeight: 400,
                fontSize: "1.08rem",
                color: "#222",
                fontFamily: "Nunito, sans-serif",
              },
              "& .MuiDataGrid-cell": {
                fontSize: "1.08rem",
                fontWeight: 500,
                color: "#425466",
                fontFamily: "Nunito, sans-serif",
              },
            }}
          />
        </Box>

        <Dialog open={openImg} onClose={() => setOpenImg(false)} maxWidth="md">
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
            {imgSrcs.length > 0 ? (
              <img
                src={imgSrcs[imgIndex]}
                alt={`img-${imgIndex}`}
                style={{ maxWidth: "100%", maxHeight: "70vh" }}
              />
            ) : (
              <Typography sx={{ fontFamily: "Nunito, sans-serif" }}>No Image Available</Typography>
            )}
          </DialogContent>
        </Dialog>

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
            {mapCoords.lat !== 0 && mapCoords.lng !== 0 ? (
              <iframe
                title="Map View"
                width="100%"
                height="400"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={`https://www.google.com/maps?q=${mapCoords.lat},${mapCoords.lng}&z=15&output=embed`}
              ></iframe>
            ) : (
              <Typography sx={{ fontFamily: "Nunito, sans-serif" }}>Invalid Coordinates</Typography>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
}
