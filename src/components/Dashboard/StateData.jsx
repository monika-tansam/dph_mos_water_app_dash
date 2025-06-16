import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import DashboardLayout from "./DashboardLayout";
import {
  Box,
  IconButton,
  Paper,
  TextField,
  Typography,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

export default function UserTable() {
  const [filter, setFilter] = React.useState("");
  const [districtFilter, setDistrictFilter] = React.useState("");
  const [openImg, setOpenImg] = React.useState(false);
  const [imgSrcs, setImgSrcs] = React.useState([]);
  const [imgIndex, setImgIndex] = React.useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const districts = [
    "Chennai",
    "Coimbatore",
    "Madurai",
    "Tiruchirappalli",
    "Salem",
    "Erode",
    "Tirunelveli",
    "Thoothukudi",
    "Dindigul",
    "Vellore",
    "Thanjavur",
    "Kanyakumari",
    "Cuddalore",
    "Sivaganga",
    "Virudhunagar",
    "Tiruvannamalai",
    "Namakkal",
    "Nagapattinam",
    "Karur",
    "Krishnagiri",
  ];

  const columns = [
    { field: "id", headerName: "S.No", width: 80 },
    { field: "district", headerName: "District Name", flex: 1, hide: isMobile },
    { field: "userId", headerName: "User ID", flex: 1 },
    { field: "userGeo", headerName: "User Geolocation", flex: 1.5 },
    { field: "name", headerName: "Username", flex: 1 },
    { field: "date", headerName: "Date", flex: 1 },
    { field: "time", headerName: "Time", flex: 1 },
    {
      field: "picture",
      headerName: "Picture",
      flex: 1.5,
      renderCell: (params) =>
        params.row.pictures && params.row.pictures.length > 0 ? (
          <Box sx={{ display: "flex", gap: 1 }}>
            {params.row.pictures.map((pic, idx) => (
              <img
                key={idx}
                src={pic}
                alt={`User ${idx + 1}`}
                style={{
                  width: 64,
                  height: 64,
                  objectFit: "cover",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
                onClick={() => {
                  setImgSrcs(params.row.pictures);
                  setImgIndex(idx);
                  setOpenImg(true);
                }}
              />
            ))}
          </Box>
        ) : (
          <span>No Image</span>
        ),
    },
    { field: "geo", headerName: "Geolocation", flex: 1.2, hide: isMobile },
    {
      field: "action",
      headerName: "Action",
      sortable: false,
      width: 100,
      renderCell: (params) => (
        <IconButton
          onClick={() =>
            window.open(
              `https://www.google.com/maps?q=${params.row.lat},${params.row.lng}`,
              "_blank"
            )
          }
          color="primary"
        >
          <VisibilityIcon />
        </IconButton>
      ),
    },
  ];

  const rows = [
    {
      id: 1,
      district: "Chennai",
      userId: "U001",
      name: "Ram",
      userGeo: "Lat: 13.0800, Lng: 80.2700",
      date: "2025-06-13",
      time: "10:00",
      pictures: ["/images/Street_img1_dist1.jpg"],
      geo: "Lat: 13.0827, Lng: 80.2707",
      lat: 13.0827,
      lng: 80.2707,
    },
    {
      id: 2,
      district: "Chennai",
      userId: "U002",
      name: "Kumar",
      userGeo: "Lat: 13.0810, Lng: 80.2710",
      date: "2025-06-13",
      time: "10:15",
      pictures: ["/images/Street_img3_city3.webp"],
      geo: "Lat: 13.0827, Lng: 80.2707",
      lat: 13.0827,
      lng: 80.2707,
    },
    {
      id: 3,
      district: "Madurai",
      userId: "U003",
      name: "Priya",
      userGeo: "Lat: 9.9250, Lng: 78.1200",
      date: "2025-06-13",
      time: "10:30",
      pictures: ["/images/Street_img4_city4.webp"],
      geo: "Lat: 9.9252, Lng: 78.1198",
      lat: 9.9252,
      lng: 78.1198,
    },
    {
      id: 4,
      district: "Tiruchirappalli",
      userId: "U004",
      name: "Suresh",
      userGeo: "Lat: 10.7900, Lng: 78.7050",
      date: "2025-06-13",
      time: "10:45",
      pictures: ["/images/Street_img5_city5.webp"],
      geo: "Lat: 10.7905, Lng: 78.7047",
      lat: 10.7905,
      lng: 78.7047,
    },
    {
      id: 5,
      district: "Salem",
      userId: "U005",
      name: "Meena",
      userGeo: "Lat: 11.6640, Lng: 78.1465",
      date: "2025-06-13",
      time: "11:00",
      pictures: ["/images/Street_img6_city6.webp"],
      geo: "Lat: 11.6643, Lng: 78.1460",
      lat: 11.6643,
      lng: 78.1460,
    },
    {
      id: 6,
      district: "Erode",
      userId: "U006",
      name: "Gopal",
      userGeo: "Lat: 10.7900, Lng: 78.7050",
      date: "2025-06-12",
      time: "11:15",
      pictures: [
        "https://via.placeholder.com/48/2196f3",
      
      ],
      geo: "Lat: 11.3410, Lng: 77.7172",
      lat: 11.3410,
      lng: 77.7172,
    },
    {
      id: 7,
      district: "Tirunelveli",
      userId: "U007",
      name: "Divya",
      userGeo: "Lat: 8.7145, Lng: 77.7572",
      date: "2025-06-10",
      time: "11:30",
      pictures: ["https://via.placeholder.com/48/2196f3"],
      geo: "Lat: 8.7139, Lng: 77.7567",
      lat: 8.7139,
      lng: 77.7567,
    },
    {
      id: 8,
      district: "Thoothukudi",
      userId: "U008",
      name: "Arun",
      userGeo: "Lat: 8.7650, Lng: 78.1355",
      date: "2025-06-13",
      time: "11:45",
      pictures: ["https://via.placeholder.com/48/2196f3"],
      geo: "Lat: 8.7642, Lng: 78.1348",
      lat: 8.7642,
      lng: 78.1348,
    },
    {
      id: 9,
      district: "Dindigul",
      userId: "U009",
      name: "Nisha",
      userGeo: "Lat: 10.3680, Lng: 77.9810",
      date: "2025-06-13",
      time: "12:00",
      pictures: ["https://via.placeholder.com/48/2196f3"],
      geo: "Lat: 10.3673, Lng: 77.9803",
      lat: 10.3673,
      lng: 77.9803,
    },
    {
      id: 10,
      district: "Vellore",
      userId: "U010",
      name: "Ravi",
      userGeo: "Lat: 12.9170, Lng: 79.1330",
      date: "2025-06-13",
      time: "12:15",
      pictures: ["https://via.placeholder.com/48/2196f3"],
      geo: "Lat: 12.9165, Lng: 79.1325",
      lat: 12.9165,
      lng: 79.1325,
    },
    {
      id: 11,
      district: "Thanjavur",
      userId: "U011",
      name: "Lakshmi",
      userGeo: "Lat: 10.7872, Lng: 79.1383",
      date: "2025-06-13",
      time: "12:30",
      pictures: ["https://via.placeholder.com/48/2196f3"],
      geo: "Lat: 10.7867, Lng: 79.1378",
      lat: 10.7867,
      lng: 79.1378,
    },
    {
      id: 12,
      district: "Kanyakumari",
      userId: "U012",
      name: "John",
      userGeo: "Lat: 8.0890, Lng: 77.5390",
      date: "2025-06-13",
      time: "12:45",
      pictures: ["https://via.placeholder.com/48/2196f3"],
      geo: "Lat: 8.0883, Lng: 77.5385",
      lat: 8.0883,
      lng: 77.5385,
    },
    {
      id: 13,
      district: "Cuddalore",
      userId: "U013",
      name: "Radha",
      userGeo: "Lat: 11.7462, Lng: 79.7687",
      date: "2025-06-13",
      time: "13:00",
      pictures: ["https://via.placeholder.com/48/2196f3"],
      geo: "Lat: 11.7456, Lng: 79.7681",
      lat: 11.7456,
      lng: 79.7681,
    },
    {
      id: 14,
      district: "Sivaganga",
      userId: "U014",
      name: "Hari",
      userGeo: "Lat: 9.8483, Lng: 78.4812",
      date: "2025-06-13",
      time: "13:15",
      pictures: ["https://via.placeholder.com/48/2196f3"],
      geo: "Lat: 9.8477, Lng: 78.4806",
      lat: 9.8477,
      lng: 78.4806,
    },
    {
      id: 15,
      district: "Virudhunagar",
      userId: "U015",
      name: "Deepa",
      userGeo: "Lat: 9.5857, Lng: 77.9630",
      date: "2025-06-13",
      time: "13:30",
      pictures: ["https://via.placeholder.com/48/2196f3"],
      geo: "Lat: 9.5850, Lng: 77.9623",
      lat: 9.5850,
      lng: 77.9623,
    },
    {
      id: 16,
      district: "Tiruvannamalai",
      userId: "U016",
      name: "Bala",
      userGeo: "Lat: 12.2259, Lng: 79.0753",
      date: "2025-06-13",
      time: "13:45",
      pictures: ["https://via.placeholder.com/48/2196f3"],
      geo: "Lat: 12.2253, Lng: 79.0747",
      lat: 12.2253,
      lng: 79.0747,
    },
    {
      id: 17,
      district: "Namakkal",
      userId: "U017",
      name: "Anu",
      userGeo: "Lat: 11.2235, Lng: 78.1658",
      date: "2025-06-13",
      time: "14:00",
      pictures: ["https://via.placeholder.com/48/2196f3"],
      geo: "Lat: 11.2229, Lng: 78.1652",
      lat: 11.2229,
      lng: 78.1652,
    },
    {
      id: 18,
      district: "Nagapattinam",
      userId: "U018",
      name: "Muthu",
      userGeo: "Lat: 10.7636, Lng: 79.8430",
      date: "2025-06-13",
      time: "14:15",
      pictures: ["https://via.placeholder.com/48/2196f3"],
      geo: "Lat: 10.7630, Lng: 79.8424",
      lat: 10.7630,
      lng: 79.8424,
    },
    {
      id: 19,
      district: "Karur",
      userId: "U019",
      name: "Seetha",
      userGeo: "Lat: 10.9607, Lng: 78.0772",
      date: "2025-06-13",
      time: "14:30",
      pictures: [
        "https://via.placeholder.com/48/2196f3",
        
      ],
      geo: "Lat: 10.9601, Lng: 78.0766",
      lat: 10.9601,
      lng: 78.0766,
    },
    {
      id: 20,
      district: "Krishnagiri",
      userId: "U020",
      name: "Vimal",
      userGeo: "Lat: 10.7900, Lng: 78.7050",
      date: "2025-06-13",
      time: "14:45",
      pictures: [
        "https://via.placeholder.com/48/2196f3",
        
      ],
      geo: "Lat: 12.5186, Lng: 78.2137",
      lat: 12.5186,
      lng: 78.2137,
    },
  ];

  const filteredRows = rows.filter(
    (row) =>
      (districtFilter === "" || row.district === districtFilter) &&
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(filter.toLowerCase())
      )
  );

  return (
    <DashboardLayout>
      <Paper
        elevation={3}
        sx={{
          fontFamily: '"Nunito Sans", sans-serif',
          p: { xs: 1, sm: 3 },
          m: { xs: 0, sm: 2 },
          width: "100%",
          minHeight: { xs: 600, sm: 1200 },
          boxSizing: "border-box",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontWeight:600,
            color: "#1976d2",
            fontSize: { xs: 16, sm: 20 },
            textAlign: { xs: "center"},
          }}
        >
          DATA COLLECTED (District-wise Information)
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mb: 2,
            alignItems: { xs: "stretch", sm: "center" },
          }}
        >
          <Box
            sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, mb: 2 }}
          >
            <Typography
              sx={{
                display: "flex",
                alignItems: "center",
                fontWeight: 500,
                fontSize: { xs: 16, sm: 18 },
                minWidth: 120,
              }}
            >
              Select Districts :
            </Typography>
            <FormControl sx={{ minWidth: 180, minHeight: 30 }}>
              <Select
                sx={{ minHeight: 30, height: 30, padding: 0 }}
                labelId="district-select-label"
                value={districtFilter}
                label="District"
                placeholder="Select District"
                onChange={(e) => setDistrictFilter(e.target.value)}
              >
                <MenuItem value="">All Districts</MenuItem>
                {districts.map((district) => (
                  <MenuItem key={district} value={district}>
                    {district}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
        <Box
          sx={{
            width: "100%",
            overflowX: "auto",
            height: { xs: 400, sm: 1100 },
          }}
        >
          <DataGrid
            rows={filteredRows}
            columns={columns}
            pageSize={20}
            rowsPerPageOptions={[20, 30, 50]}
            pagination
            disableRowSelectionOnClick
            disableColumnMenu
            hideFooterSelectedRowCount
            sx={{
              fontFamily: '"Nunito Sans", sans-serif',
              fontSize: { xs: 12, sm: 14 },
            }}
          />
        </Box>
        <Dialog open={openImg} onClose={() => setOpenImg(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            Picture
            <IconButton
              aria-label="close"
              onClick={() => setOpenImg(false)}
              sx={{ ml: 2 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {imgSrcs.length > 0 && (
              <>
                <img
                  src={imgSrcs[imgIndex]}
                  alt={`User Large ${imgIndex + 1}`}
                  style={{ maxWidth: "100%", maxHeight: 500, marginBottom: 16 }}
                />
                <Box sx={{ display: "flex", gap: 1 }}>
                  {imgSrcs.map((src, idx) => (
                    <img
                      key={idx}
                      src={src}
                      alt={`Thumb ${idx + 1}`}
                      style={{
                        width: 40,
                        height: 40,
                        objectFit: "cover",
                        borderRadius: 4,
                        border: imgIndex === idx ? "2px solid #1976d2" : "2px solid transparent",
                        cursor: "pointer",
                      }}
                      onClick={() => setImgIndex(idx)}
                    />
                  ))}
                </Box>
              </>
            )}
          </DialogContent>
        </Dialog>
      </Paper>
    </DashboardLayout>
  );
}