import React from "react";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import DashboardLayout from "./DashboardLayout";
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const MapPage = () => {
  const { lat, lng } = useParams();
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);

  if (isNaN(latitude) || isNaN(longitude)) {
    return <div>Invalid coordinates provided.</div>;
  }

  return (
    <DashboardLayout>
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer center={[latitude, longitude]} zoom={13} scrollWheelZoom style={{ height: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude]}>
          <Popup>
            Selected Location: <br />
            Lat: {latitude}, Lng: {longitude}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
    </DashboardLayout>
  );
};

export default MapPage;
