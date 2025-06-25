// ✅ TamilNaduMap.jsx — Full code with highlight on selected district

import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
  useMap,
  Circle,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom Marker Icon
const customIcon = new L.Icon({
  iconUrl: "/keepPing.svg",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const pinLocations = [
  { lat: 13.0827, lng: 80.2707, label: "Chennai" },
  { lat: 11.0168, lng: 76.9558, label: "Coimbatore" },
  { lat: 10.7905, lng: 78.7047, label: "Tiruchirapalli" },
  { lat: 8.7378, lng: 77.7081, label: "Tirunelveli" },
];

const BOUNDS = [
  [8, 75],
  [15, 82],
];

const chennaiHubDistricts = [
  "Chennai", "Tirupathur", "Viluppuram", "Kallakurichi",
  "Chengalpattu", "Vellore", "Ranipet",
  "Thiruvallur", "Tiruvannamalai", "Kancheepuram", "Cuddalore"
];
const chennaiHubColor = "#4CAF50";

const coimbatoreHubDistricts = [
  "Coimbatore", "Erode", "Tiruppur", "Nilgiris", "Salem", "Namakkal", "Karur"
];
const coimbatoreHubColor = "#FF8C00";

const trichyHubDistricts = [
  "Tiruchirappalli", "Perambalur", "Ariyalur", "Thanjavur", "Thiruvarur", "Nagapattinam", "Pudukkottai"
];
const trichyHubColor = "#DC143C";

const tirunelveliHubDistricts = [
  "Tirunelveli", "Thoothukkudi", "Tenkasi", "Kanyakumari", "Virudhunagar", "Ramanathapuram"
];
const tirunelveliHubColor = "#BA55D3";

const districtColors = {
  "Chennai": "#00bfff",
  "Coimbatore": "#00bfff",
  "Tiruchirappalli": "#00bfff",
  "Tirunelveli": "#00bfff"
};

const getDistrictsByHub = (hubName) => {
  const hubs = {
    "Chennai": chennaiHubDistricts,
    "Coimbatore": coimbatoreHubDistricts,
    "Tiruchirapalli": trichyHubDistricts,
    "Tirunelveli": tirunelveliHubDistricts,
  };
  return hubs[hubName] || [];
};

const FitToTN = () => {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(BOUNDS);
    map.setMaxBounds(BOUNDS);
  }, [map]);
  return null;
};

const ZoomControls = () => {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());

  const zoomIn = () => {
    const z = Math.min(zoom + 1, map.getMaxZoom());
    map.setZoom(z);
    setZoom(z);
  };
  const zoomOut = () => {
    const z = Math.max(zoom - 1, map.getMinZoom());
    map.setZoom(z);
    setZoom(z);
  };

  return (
    <div style={{ position: "absolute", top: 10, left: 10, zIndex: 1000, display: "flex", gap: "5px" }}>
      <button onClick={zoomIn} style={buttonStyle}>+</button>
      <button onClick={zoomOut} style={buttonStyle}>−</button>
    </div>
  );
};

const buttonStyle = {
  background: "#fff", border: "1px solid #ccc",
  width: 30, height: 30, borderRadius: 4, cursor: "pointer",
  boxShadow: "0 1px 4px rgba(0,0,0,0.3)"
};

const HubZoomHandler = ({ selectedHub }) => {
  const map = useMap();
  useEffect(() => {
    const hub = pinLocations.find(h => h.label === selectedHub);
    if (hub) map.flyTo([hub.lat, hub.lng], 10, { duration: 1.5 });
  }, [selectedHub, map]);
  return null;
};

const DistrictZoomHandler = ({ selectedDistrict, geoData }) => {
  const map = useMap();
  useEffect(() => {
    if (!selectedDistrict || !geoData) return;
    const feature = geoData.features.find(f => f.properties.district?.toLowerCase().trim() === selectedDistrict.toLowerCase().trim());
    if (feature) {
      const layer = L.geoJSON(feature);
      map.fitBounds(layer.getBounds(), { maxZoom: 11 });
    }
  }, [selectedDistrict, geoData, map]);
  return null;
};

const TamilNaduMap = () => {
  const [geoData, setGeoData] = useState(null);
  const [selectedHub, setSelectedHub] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [filterEnabled, setFilterEnabled] = useState(false);

  useEffect(() => {
    fetch("/maps/tamil-nadu.geojson")
      .then(res => res.json())
      .then(setGeoData)
      .catch(err => console.error("GeoJSON load error:", err));
  }, []);

  const styleDistrict = (feature) => {
    const name = feature.properties.district;
    const isSelected = selectedDistrict?.toLowerCase().trim() === name?.toLowerCase().trim();
    const isInHub = getDistrictsByHub(selectedHub).includes(name);

    if (filterEnabled && selectedHub && !isInHub) {
      return { fillOpacity: 0, weight: 0, color: "transparent" };
    }

    let fillColor = isSelected ? "#ffd54f" : districtColors[name] || "#FFCC00";
    if (selectedHub === "Chennai" && chennaiHubDistricts.includes(name)) fillColor = chennaiHubColor;
    else if (selectedHub === "Coimbatore" && coimbatoreHubDistricts.includes(name)) fillColor = coimbatoreHubColor;
    else if (selectedHub === "Tiruchirapalli" && trichyHubDistricts.includes(name)) fillColor = trichyHubColor;
    else if (selectedHub === "Tirunelveli" && tirunelveliHubDistricts.includes(name)) fillColor = tirunelveliHubColor;

    return {
      fillColor,
      weight: isSelected ? 3 : 1,
      color: isSelected ? "#ff5722" : "#666",
      fillOpacity: isInHub || isSelected ? 0.6 : 0.4,
    };
  };

  return (
    <div style={{ height: 400, position: "relative" }}>
      <div style={{ position: "absolute", top: 10, right: 10, zIndex: 1000 }}>
        <select onChange={(e) => setSelectedHub(e.target.value)} value={selectedHub} style={selectStyle}>
          <option value="">Select Hub</option>
          {pinLocations.map((h, i) => (
            <option key={i} value={h.label}>{h.label}</option>
          ))}
        </select>

        <label style={{ marginLeft: 10 }}>
          <input type="checkbox" checked={filterEnabled} onChange={(e) => setFilterEnabled(e.target.checked)} />
          Filter districts
        </label>

        {selectedHub && (
          <select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} style={{ ...selectStyle, marginTop: 6 }}>
            <option value="">Select District</option>
            {getDistrictsByHub(selectedHub).map((d, i) => (
              <option key={i} value={d}>{d}</option>
            ))}
          </select>
        )}
      </div>

      <MapContainer center={[11, 78]} zoom={7} style={{ height: "100%" }} zoomControl={false}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FitToTN />
        <ZoomControls />
        {selectedHub && <HubZoomHandler selectedHub={selectedHub} />}
        {selectedDistrict && <DistrictZoomHandler selectedDistrict={selectedDistrict} geoData={geoData} />}

        {geoData && (
          <GeoJSON
            key={selectedDistrict}
            data={geoData}
            style={styleDistrict}
          />
        )}

        {pinLocations.map((loc, i) => (
          <Marker key={i} position={[loc.lat, loc.lng]} icon={customIcon}>
            <Popup>
              <div><strong>{loc.label}</strong><br />Lat: {loc.lat}<br />Lng: {loc.lng}</div>
            </Popup>
            {selectedHub === loc.label && (
              <Circle center={[loc.lat, loc.lng]} radius={8000} pathOptions={{ color: "#007BFF", fillOpacity: 0.2 }} />
            )}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

const selectStyle = {
  padding: "6px 12px",
  borderRadius: 6,
  border: "1px solid #ccc",
  fontFamily: "Nunito, sans-serif",
  width: "100%"
};

export default TamilNaduMap;
