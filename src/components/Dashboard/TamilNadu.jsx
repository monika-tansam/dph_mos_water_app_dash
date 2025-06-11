import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
  useMap,
} from "react-leaflet";
import L from "leaflet";

// Custom Marker Icon
const customIcon = new L.Icon({
  iconUrl: "/keepPing.svg",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

// Pin locations
const pinLocations = [
  { lat: 13.0827, lng: 80.2707, label: "Chennai" },
  { lat: 10.7905, lng: 78.7047, label: "Trichy" },
  { lat: 8.7378, lng: 77.7081, label: "Tirunelveli" },
];

// Bounds for Tamil Nadu
const BOUNDS = [
  [8, 75],
  [15, 82],
];

// Component to fit and restrict map to bounds
function FitToTN() {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(BOUNDS);
    map.setMaxBounds(BOUNDS);
    map.scrollWheelZoom.enable();
    map.dragging.enable();
    map.doubleClickZoom.enable();
    map.boxZoom.enable();
    map.keyboard.enable();
  }, [map]);
  return null;
}

// Zoom In/Out Controls Component
function ZoomControls() {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());

  const zoomIn = () => {
    const newZoom = Math.min(zoom + 1, map.getMaxZoom());
    map.setZoom(newZoom);
    setZoom(newZoom);
  };

  const zoomOut = () => {
    const newZoom = Math.max(zoom - 1, map.getMinZoom());
    map.setZoom(newZoom);
    setZoom(newZoom);
  };

  return (
    <div style={{
      position: "absolute",
      top: 10,
      left: 10,
      zIndex: 1000,
      display: "flex",
      flexDirection: "column",
      gap: "5px",
    }}>
      <button onClick={zoomIn} style={zoomButtonStyle}>+</button>
      <button onClick={zoomOut} style={zoomButtonStyle}>−</button>
    </div>
  );
}

const zoomButtonStyle = {
  backgroundColor: "#fff",
  border: "1px solid #ccc",
  borderRadius: "4px",
  width: "30px",
  height: "30px",
  fontSize: "20px",
  cursor: "pointer",
  boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
};

// Main Map Component
const TamilNaduMap = () => {
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    fetch("/maps/tamil-nadu.geojson")
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch((err) => console.error("Failed to load GeoJSON:", err));
  }, []);

  const tamilStyle = {
    fillColor: "#FFCC00",
    weight: 1,
    fillOpacity: 0.6,
    color: "#D35400",
  };

  return (
    <div style={{ height: "400px", position: "relative" }}>
      <MapContainer
        center={[11, 78]}
        zoom={7}
        style={{ height: "100%", width: "100%", borderRadius: "0.25rem" }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FitToTN />
        <ZoomControls />
        {geoData && <GeoJSON data={geoData} style={tamilStyle} />}
        {pinLocations.map((loc, i) => (
          <Marker key={i} position={[loc.lat, loc.lng]} icon={customIcon}>
            <Popup>
              <div style={{ textAlign: "center" }}>
                <h3>{loc.label}</h3>
                <p>Latitude: {loc.lat}</p>
                <p>Longitude: {loc.lng}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default TamilNaduMap;
