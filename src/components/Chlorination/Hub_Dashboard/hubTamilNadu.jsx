import React, { useState, useEffect, useMemo, useRef } from "react";
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

const hubDistrictMap = {
  hub001: ["Chennai", "Tirupathur", "Viluppuram", "Kallakurichi", "Chengalpattu", "Vellore", "Ranipet", "Thiruvallur", "Tiruvannamalai", "Kancheepuram", "Cuddalore"],
  hub002: ["Coimbatore", "Erode", "Tiruppur", "Nilgiris", "Salem", "Namakkal", "Karur"],
  hub003: ["Tiruchirappalli", "Perambalur", "Ariyalur", "Thanjavur", "Thiruvarur", "Nagapattinam", "Pudukkottai"],
  hub004: ["Tirunelveli", "Thoothukkudi", "Tenkasi", "Kanyakumari", "Virudhunagar", "Ramanathapuram"]
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

const BlockZoomHandler = ({ selectedBlockName, groupedBlocks }) => {
  const map = useMap();
  useEffect(() => {
    if (!selectedBlockName || !groupedBlocks) return;
    for (const blocks of Object.values(groupedBlocks)) {
      const block = blocks.find(b => b.name === selectedBlockName);
      if (block) {
        map.flyTo([block.lat, block.lng], 13, { duration: 1.5 });
        break;
      }
    }
  }, [selectedBlockName, groupedBlocks, map]);
  return null;
};

const TamilNaduMap = () => {
  const [geoData, setGeoData] = useState(null);
  const [blocksData, setBlocksData] = useState(null);
  const [selectedHub, setSelectedHub] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [filterEnabled, setFilterEnabled] = useState(false);
  const [selectedBlockName, setSelectedBlockName] = useState("");
  const [chlData, setChlData] = useState([]);
  const [legendType, setLegendType] = useState("block");

  useEffect(() => {
  if (chlData && chlData.length > 0) {
    chlData.forEach((entry, i) => {
      console.log("CHL MARKER:", entry.latitude, entry.longitude, entry.block_name);
    });
  } else {
    console.log("CHL MARKER: No data available or empty array");
  }
}, [chlData]);

  const mapRef = useRef();

  useEffect(() => {
    fetch("/maps/tamil-nadu.geojson")
      .then(res => res.json())
      .then(setGeoData);
  }, []);

  useEffect(() => {
    setSelectedDistrict("");
    setSelectedBlockName("");

    const hubFileMap = {
      hub001: "/maps/chennaihub_blocks.json",
      hub002: "/maps/coimbatorehub.json",
      hub003: "/maps/tiruchirapalli.json",
      hub004: "/maps/tirunelvelihub.json",
    };
    const file = hubFileMap[pinLocations.find(h => h.label === selectedHub)?.code];
    if (file) {
      fetch(file)
        .then(res => res.json())
        .then(setBlocksData)
        .catch(err => {
          console.error(`Failed to load blocks data for ${selectedHub}:`, err);
          setBlocksData(null);
        });
    }
  }, [selectedHub]);

  useEffect(() => {
    setSelectedBlockName("");
  }, [selectedDistrict]);

  const groupedBlocks = useMemo(() => {
    if (!blocksData || !selectedDistrict) return null;
    let foundBlock = null;
    Object.values(blocksData).forEach(hub => {
      Object.values(hub).forEach(district => {
        if (district.district_name?.toLowerCase().trim() === selectedDistrict.toLowerCase().trim()) {
          foundBlock = district.blocks;
        }
      });
    });
    if (!foundBlock) return null;
    const groups = {};
    foundBlock.forEach(block => {
      if (!groups[block.type]) groups[block.type] = [];
      groups[block.type].push(block);
    });
    return groups;
  }, [blocksData, selectedDistrict]);
useEffect(() => {
  if (!selectedHub) {
    setChlData([]);
    return;
  }

  let url = `http://localhost:3000/dashboard/chl_datacollection?hub_id=${encodeURIComponent(
  pinLocations.find(h => h.label === selectedHub)?.code.toUpperCase()
)}`;

  if (selectedDistrict) {
    url += `&district=${encodeURIComponent(selectedDistrict)}`;
  }

  fetch(url)
    .then(res => res.json())
  .then(data => {
  console.log("Fetched chlorine data:", data);
  if (Array.isArray(data.data)) {
    setChlData(data.data);
  } else {
    console.warn("Unexpected data format:", data);
    setChlData([]);
  }
})

}, [selectedHub, selectedDistrict]);

  const styleDistrict = (feature) => {
    const name = feature.properties.district;
    const isSelected = selectedDistrict?.toLowerCase().trim() === name?.toLowerCase().trim();
    const hubInfo = districtHubMap[name];
    const inSelectedHub = getDistrictsByHub(selectedHub).includes(name);

    if (filterEnabled && selectedHub && !inSelectedHub) {
      return { fillOpacity: 0, weight: 0, color: "transparent" };
    }

    const fillColor = isSelected ? "#ffd54f" : (hubInfo ? "#A0C4FF" : "#FFCC00");

    return {
      fillColor,
      weight: isSelected ? 3 : 1,
      color: isSelected ? "#ff5722" : "#666",
      fillOpacity: inSelectedHub || isSelected ? 0.6 : 0.4,
    };
  };

  return (
    <div style={{ height: 400, position: "relative" }}>
      <div style={{ position: "absolute", top: 10, right: 10, zIndex: 1000, background: "#fff", padding: "12px 14px", borderRadius: "8px", boxShadow: "0 2px 6px rgba(0,0,0,0.2)", minWidth: "220px" }}>
        <label style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
          <input type="checkbox" checked={filterEnabled} onChange={(e) => setFilterEnabled(e.target.checked)} style={{ marginRight: "8px" }} />
          Filter districts
        </label>
        <select value={selectedHub} onChange={(e) => setSelectedHub(e.target.value)} style={selectStyle}>
          <option value="">Select Hub</option>
          {pinLocations.map((h, i) => <option key={i} value={h.label}>{h.label}</option>)}
        </select>
        {selectedHub && (
          <select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} style={selectStyle}>
            <option value="">Select District</option>
            {getDistrictsByHub(selectedHub).map((d, i) => <option key={i} value={d}>{d}</option>)}
          </select>
        )}
        {selectedDistrict && groupedBlocks && (
          <select value={selectedBlockName} onChange={(e) => setSelectedBlockName(e.target.value)} style={selectStyle}>
            <option value="">Show All Blocks</option>
            {Object.entries(groupedBlocks).flatMap(([type, blocks]) =>
              blocks.map((block, i) => (
                <option key={`${type}-${i}`} value={block.name}>{block.name}</option>
              ))
            )}
          </select>
        )}
      </div>
      <MapContainer center={[11, 78]} zoom={7} style={{ height: "100%" }} zoomControl={false} whenCreated={(mapInstance) => { mapRef.current = mapInstance }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FitToTN />
        <ZoomControls />
        {selectedHub && <HubZoomHandler selectedHub={selectedHub} />}
        {selectedDistrict && <DistrictZoomHandler selectedDistrict={selectedDistrict} geoData={geoData} />}
        {selectedBlockName && groupedBlocks && <BlockZoomHandler selectedBlockName={selectedBlockName} groupedBlocks={groupedBlocks} />}

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
                layer.bindPopup(`
                  <div style="font-family: Nunito, sans-serif; padding: 6px;">
                    <div style="font-size: 13px; font-weight: bold;">${name}</div>
                    <div style="font-size: 12px;"><strong>Code:</strong> ${code}<br/><strong>Lat:</strong> ${lat}<br/><strong>Lng:</strong> ${lng}</div>
                  </div>
                `).openPopup(e.latlng);
              });
              layer.on('mouseout', () => layer.closePopup());
            }}
          />
        )}

        {pinLocations.map((loc, i) => (
          <Marker key={i} position={[loc.lat, loc.lng]} icon={customIcon}>
            <Popup>
              <div style={{ fontFamily: "Nunito, sans-serif" }}>
                <div style={{ fontWeight: "bold" }}>{loc.label} Hub</div>
                <div>Lat: {loc.lat.toFixed(4)}<br />Lng: {loc.lng.toFixed(4)}</div>
              </div>
            </Popup>
            {selectedHub === loc.label && (
              <Circle center={[loc.lat, loc.lng]} radius={8000} pathOptions={{ color: "#007BFF", fillOpacity: 0.2 }} />
            )}
          </Marker>
        ))}

          {selectedBlockName && groupedBlocks && (() => {
          for (const blocks of Object.values(groupedBlocks)) {
            const block = blocks.find(b => b.name === selectedBlockName);
            if (block && block.lat != null && block.lng != null) {
              return (
                <Circle
                  center={[block.lat, block.lng]}
                  radius={1000}
                  pathOptions={{ color: "#0000FF", weight: 2, fillColor: "#87CEFA", fillOpacity: 0.4 }}
                />
              );
            }
          }
          return null;
        })()}


        {groupedBlocks && Object.entries(groupedBlocks).flatMap(([type, markers]) =>
          markers.filter(block => !selectedBlockName || block.name === selectedBlockName)
            .map((block, idx) => (
              <Marker
                key={`${block.name}-${idx}`}
                position={[block.lat, block.lng]}
                icon={L.divIcon({
                  className: "custom-block-icon",
                  html: ` <div style="
                background: ${blockColorMap[type] || "#999"};
                color: #fff;
                padding: 4px 10px;
                border-radius: 8px;
                font-size: 12px;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                font-weight: bold;
                white-space: nowrap;
              ">${block.name}</div>`
                })}
              >
                <Popup>
                  <div><strong>{block.name}</strong><br /><span>Type: {type}</span></div>
                </Popup>
              </Marker>
            ))
        )}
         {chlData.map((entry, i) => {
        const lat = Number(entry.latitude);
        const lng = Number(entry.longitude);
        const hubId = entry.hub_id?.toUpperCase() || "Unknown"; // ✅ safely extract hub_id

        if (isNaN(lat) || isNaN(lng)) {
          console.warn(`Skipping invalid marker at index ${i}:`, entry);
          return null;
        }

        const timestamp = new Date(entry.timestamp);
        const formattedDate = timestamp.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
        const formattedTime = timestamp.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });

        return (
          <Marker key={`chl-${i}`} position={[lat, lng]} icon={customIcon}>
            <Popup maxWidth={250}>
              <div style={{ fontFamily: "Nunito, sans-serif" }}>
                <div><strong>Collected by:</strong> {entry.username}</div>
                <div>
                  <strong>PPM:</strong>{" "}
                  <span style={{
                    color:
                      entry.ppm < 1.95 ? "red" :
                      entry.ppm > 2.05 ? "orange" :
                      "green",
                    fontWeight: "bold"
                  }}>
                    {entry.ppm}
                  </span>
                </div>
                <div><strong>Date:</strong> {formattedDate}</div>
                <div><strong>Time:</strong> {formattedTime}</div>
                <div><strong>Lat:</strong> {lat}</div>
                <div><strong>Lng:</strong> {lng}</div>
                <div><strong>Hub ID:</strong> {hubId}</div> 
                {entry.image_url && (
                  <div style={{ marginTop: "8px" }}>
                    <img src={entry.image_url} alt="Chlorination" style={{ width: "100%", borderRadius: "6px" }} />
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}


      </MapContainer>
     <div style={{
  position: "absolute",
  bottom: 10,
  right: 10,
  zIndex: 1000,
  background: "#fff",
  padding: "10px 12px",
  borderRadius: "6px",
  boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
  fontSize: "13px",
  fontFamily: "Nunito, sans-serif",
  width: "220px"
}}>
  <select
    value={legendType}
    onChange={(e) => setLegendType(e.target.value)}
    style={{
      width: "100%",
      marginBottom: "10px",
      padding: "6px",
      borderRadius: "4px",
      border: "1px solid #ccc"
    }}
  >
    <option value="block">Block Type Reference</option>
    <option value="ppm">PPM Status </option>
  </select>

  {legendType === "block" && (
     <div
    style={{
      display: "flex",
      flexDirection: "column",       
      gap: "6px",
      maxHeight: "120px",            
      overflowY: "auto",            
      paddingRight: "4px"           
    }}>
      {Object.entries(blockColorMap).map(([type, color], i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "4px", width: "100%" }}>
          <div style={{ width: 12, height: 12, backgroundColor: color, borderRadius: "2px" }} />
          <span>{type}</span>
        </div>
      ))}
    </div>
  )}

  {legendType === "ppm" && (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        <div style={{ width: 12, height: 12, backgroundColor: "red", borderRadius: "2px" }} />
        <span>Under-chlorinated (&lt; 1.95)</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        <div style={{ width: 12, height: 12, backgroundColor: "green", borderRadius: "2px" }} />
        <span>Ideal (1.95–2.05)</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        <div style={{ width: 12, height: 12, backgroundColor: "orange", borderRadius: "2px" }} />
        <span>Over-chlorinated (&gt; 2.05)</span>
      </div>
    </div>
  )}
</div>
 
    </div>
  );
};

const selectStyle = {
  padding: "6px 12px",
  borderRadius: 6,
  border: "1px solid #ccc",
  fontFamily: "Nunito, sans-serif",
  width: "100%",
  marginBottom: "10px"
};

export default TamilNaduMap;