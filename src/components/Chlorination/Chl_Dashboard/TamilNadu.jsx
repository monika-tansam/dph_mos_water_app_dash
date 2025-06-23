import React, { useState, useEffect, useRef } from "react";
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

// Hub Locations
const pinLocations = [
  { lat: 13.0827, lng: 80.2707, label: "Chennai", isHub: true },
  { lat: 11.0168, lng: 76.9558, label: "Coimbatore", isHub: true },
  { lat: 10.7905, lng: 78.7047, label: "Tiruchirapalli", isHub: true },
  { lat: 8.7378, lng: 77.7081, label: "Tirunelveli", isHub: true },
];

// Bounds for Tamil Nadu
const BOUNDS = [
  [8, 75],
  [15, 82],
];

// Crop map to TN bounds
function FitToTN() {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(BOUNDS);
    map.setMaxBounds(BOUNDS);
  }, [map]);
  return null;
}

// Zoom Buttons
function ZoomControls() {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());

  const zoomIn = () => {
    const z = Math.min(zoom + 1, map.getMaxZoom());
    map.setZoom(z); setZoom(z);
  };
  const zoomOut = () => {
    const z = Math.max(zoom - 1, map.getMinZoom());
    map.setZoom(z); setZoom(z);
  };

  return (
    <div style={{
      position: "absolute", top: 10, left: 10,
      zIndex: 1000, display: "flex", gap: "5px"
    }}>
      <button onClick={zoomIn} style={buttonStyle}>+</button>
      <button onClick={zoomOut} style={buttonStyle}>−</button>
    </div>
  );
}
const buttonStyle = {
  background: "#fff",
  border: "1px solid #ccc",
  width: 30, height: 30,
  borderRadius: 4, cursor: "pointer",
  boxShadow: "0 1px 4px rgba(0,0,0,0.3)"
};

// Zoom & highlight in-child component
const HubZoomHandler = ({ selectedHub }) => {
  const map = useMap();
  useEffect(() => {
    const hub = pinLocations.find(h => h.label === selectedHub);
    if (hub) {
      map.flyTo([hub.lat, hub.lng], 10, { duration: 1.5 });
    }
  }, [selectedHub, map]);
  return null;
};

// Toast UI
const Toast = ({ message, onClose }) => (
  <div style={{
    position: "absolute", bottom: 20, left: "50%",
    transform: "translateX(-50%)",
    background: "#333", color: "#fff",
    padding: "10px 20px", borderRadius: 8,
    fontFamily: "Nunito, sans-serif", zIndex: 9999
  }}>
    {message}
    <button onClick={onClose} style={{
      marginLeft: 10, background: "none",
      border: "none", color: "#fff",
      cursor: "pointer", fontWeight: "bold"
    }}>✕</button>
  </div>
);

// Main Component
const TamilNaduMap = () => {
  const [geoData, setGeoData] = useState(null);
  const [selectedHub, setSelectedHub] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    fetch("/maps/tamil-nadu.geojson")
      .then(res => res.json())
      .then(setGeoData)
      .catch(err => console.error("GeoJSON load error:", err));
  }, []);

  const onEachDistrict = feature => ({
    fillColor: "#" + Math.floor(Math.random() * 16777215).toString(16),
    weight: 1, color: "#666", fillOpacity: 0.4,
  });

  const handleHubSelect = (label) => {
    setSelectedHub(label);
    setToastMessage(`Zoomed to ${label}`);
  };

  return (
    <div style={{ height: 400, position: "relative" }}>
      <div style={{ position: "absolute", top: 10, right: 10, zIndex: 1000 }}>
        <select onChange={(e) => handleHubSelect(e.target.value)}
                style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #ccc", fontFamily: "Nunito, sans-serif" }}>
          <option value="">Select Hub</option>
          {pinLocations.map((h, i) => <option key={i} value={h.label}>{h.label}</option>)}
        </select>
      </div>

      <MapContainer
        center={[11, 78]} zoom={7}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false} attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FitToTN />
        <ZoomControls />
        {selectedHub && <HubZoomHandler selectedHub={selectedHub} />}
        {geoData && <GeoJSON data={geoData} style={onEachDistrict} />}
        {pinLocations.map((loc, i) => (
          <Marker key={i} position={[loc.lat, loc.lng]} icon={customIcon}>
            <Popup>
              <div style={{ textAlign: "center" }}>
                <h3>{loc.label}</h3>
                <p>Latitude: {loc.lat}</p>
                <p>Longitude: {loc.lng}</p>
              </div>
            </Popup>
            {selectedHub === loc.label && (
              <Circle
                center={[loc.lat, loc.lng]} radius={8000}
                pathOptions={{ color: "#007BFF", fillOpacity: 0.2 }}
              />
            )}
          </Marker>
        ))}
      </MapContainer>

      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage("")} />}
    </div>
  );
};

export default TamilNaduMap;
