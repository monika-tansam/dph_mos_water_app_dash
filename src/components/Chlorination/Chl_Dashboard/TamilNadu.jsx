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

const customIcon = new L.Icon({
  iconUrl: "/keepPing.svg",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const BOUNDS = [
  [8, 75],
  [15, 82],
];

const pinLocations = [
  { lat: 13.0827, lng: 80.2707, label: "Chennai", code: "hub001" },
  { lat: 11.0168, lng: 76.9558, label: "Coimbatore", code: "hub002" },
  { lat: 10.7905, lng: 78.7047, label: "Tiruchirapalli", code: "hub003" },
  { lat: 8.7378, lng: 77.7081, label: "Tirunelveli", code: "hub004" },
];

const chennaiHubDistricts = [
  "Chennai", "Tirupathur", "Viluppuram", "Kallakurichi", "Chengalpattu", "Vellore", "Ranipet",
  "Thiruvallur", "Tiruvannamalai", "Kancheepuram", "Cuddalore"
];
const coimbatoreHubDistricts = ["Coimbatore", "Erode", "Tiruppur", "Nilgiris", "Salem", "Namakkal", "Karur"];
const trichyHubDistricts = ["Tiruchirappalli", "Perambalur", "Ariyalur", "Thanjavur", "Thiruvarur", "Nagapattinam", "Pudukkottai"];
const tirunelveliHubDistricts = ["Tirunelveli", "Thoothukkudi", "Tenkasi", "Kanyakumari", "Virudhunagar", "Ramanathapuram"];

const hubColors = {
  Chennai: "#4CAF50",
  Coimbatore: "#FF8C00",
  Tiruchirapalli: "#DC143C",
  Tirunelveli: "#BA55D3",
};

const hubDistrictMap = {
  hub001: chennaiHubDistricts,
  hub002: coimbatoreHubDistricts,
  hub003: trichyHubDistricts,
  hub004: tirunelveliHubDistricts,
};

const districtHubMap = Object.entries(hubDistrictMap).reduce((acc, [hubCode, districts]) => {
  districts.forEach((d, idx) => {
    const distCode = `${d.slice(0, 5).toUpperCase()}${String(idx + 1).padStart(3, "0")}`;
    acc[d] = { code: distCode, hub: hubCode };
  });
  return acc;
}, {});

const getDistrictsByHub = (hubName) => {
  const match = pinLocations.find(h => h.label === hubName);
  return match ? hubDistrictMap[match.code] : [];
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
    const feature = geoData.features.find(f =>
      f.properties.district?.toLowerCase().trim() === selectedDistrict.toLowerCase().trim());
    if (feature) {
      const layer = L.geoJSON(feature);
      map.fitBounds(layer.getBounds(), { maxZoom: 11 });
    }
  }, [selectedDistrict, geoData, map]);
  return null;
};

const blockColorMap = {
  "Corporation": "#1f77b4",
  "Municipality": "#2ca02c",
  "Town Panchayat": "#ff7f0e",
  "Government Hospital": "#d62728",
  "Railway Station": "#9467bd",
  "Approved Home": "#8c564b",
  "Prison": "#e377c2",
  "Government Institution": "#7f7f7f",
  "Educational Institution": "#bcbd22",
  "PWD (Poondi)": "#17becf",
  "Temple (Festival Camp)": "#ffbb78"
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
    const hubInfo = districtHubMap[name];
    const inSelectedHub = getDistrictsByHub(selectedHub).includes(name);

    if (filterEnabled && selectedHub && !inSelectedHub) {
      return { fillOpacity: 0, weight: 0, color: "transparent" };
    }

    const fillColor = isSelected
      ? "#ffd54f"
      : (hubInfo ? hubColors[pinLocations.find(h => h.code === hubInfo.hub)?.label] : "#FFCC00");

    return {
      fillColor,
      weight: isSelected ? 3 : 1,
      color: isSelected ? "#ff5722" : "#666",
      fillOpacity: inSelectedHub || isSelected ? 0.6 : 0.4,
    };
  };

  return (
    <div style={{ height: 400, position: "relative" }}>
        <div style={{
  position: "absolute",
  top: 10,
  right: 10,
  zIndex: 1000,
  background: "#fff",
  padding: "12px 14px",
  borderRadius: "8px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
  fontFamily: "Nunito, sans-serif",
  minWidth: "220px"
}}>
  <label style={{ display: "flex", alignItems: "center", marginBottom: "10px", fontSize: "14px", fontWeight: "500", color: "#333" }}>
    <input
      type="checkbox"
      checked={filterEnabled}
      onChange={(e) => setFilterEnabled(e.target.checked)}
      style={{ marginRight: "8px" }}
    />
    Filter districts
  </label>

  <select
    onChange={(e) => setSelectedHub(e.target.value)}
    value={selectedHub}
    style={{ ...selectStyle, marginBottom: 10 }}
  >
    <option value="">Select Hub</option>
    {pinLocations.map((h, i) => (
      <option key={i} value={h.label}>{h.label}</option>
    ))}
  </select>

  {selectedHub && (
    <select
      value={selectedDistrict}
      onChange={(e) => setSelectedDistrict(e.target.value)}
      style={selectStyle}
    >
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
            onEachFeature={(feature, layer) => {
              const name = feature.properties.district;
              const code = districtHubMap[name]?.code || "N/A";
              layer.on('mouseover', function (e) {
                const lat = e.latlng.lat.toFixed(4);
                const lng = e.latlng.lng.toFixed(4);
                const popupContent = `
                  <div style="font-family: Nunito, sans-serif; border-radius: 6px; padding: 6px; background: white; box-shadow: 0 2px 6px rgba(0,0,0,0.2); min-width: 140px;">
                    <div style="font-size: 13px; font-weight: bold; margin-bottom: 2px; color: #2c3e50;">${name}</div>
                    <div style="font-size: 12px; color: #555;">
                      <strong>Code:</strong> ${code}<br/>
                      <strong>Latitude:</strong> ${lat}<br/>
                      <strong>Longitude:</strong> ${lng}
                    </div>
                  </div>
                `;
                layer.bindPopup(popupContent).openPopup(e.latlng);
              });
              layer.on('mouseout', function () {
                layer.closePopup();
              });
            }}
          />
        )}

        {pinLocations.map((loc, i) => (
          <Marker key={i} position={[loc.lat, loc.lng]} icon={customIcon}>
            <Popup>
              <div style={{
                fontFamily: "Nunito, sans-serif",
                borderRadius: "8px",
                padding: "10px",
                background: "white",
                boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                minWidth: "180px"
              }}>
                <div style={{ fontSize: "16px", fontWeight: "bold", color: "#2c3e50", marginBottom: 4 }}>
                  {loc.label} Hub
                </div>
                <div style={{ fontSize: "14px", color: "#555" }}>
                  <strong>Latitude:</strong> {loc.lat.toFixed(4)}<br />
                  <strong>Longitude:</strong> {loc.lng.toFixed(4)}
                </div>
              </div>
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
