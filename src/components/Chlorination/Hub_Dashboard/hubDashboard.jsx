import React, { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";
import TamilNaduMap from "./hubTamilNadu";

const staticDistrictCount = {
  "CHENNAI HUB": 11,
  "COIMBATORE HUB": 7,
  "TIRUCHIRAPALLI HUB": 7,
  "TIRUNELVELI HUB": 6,
};

const HubDashboard = () => {
  const [user, setUser] = useState(null);
  const [cycle1Count, setCycle1Count] = useState(0);
  const [cycle2Count, setCycle2Count] = useState(0);
  const [userListCount, setUserListCount] = useState(0);
  const [travelAssignments, setTravelAssignments] = useState({});
  const [loadingAssignments, setLoadingAssignments] = useState(true);

  const today = new Date();
  const formatDate = (date) => date.toISOString().split("T")[0];
  const nextMonthDate = new Date(today);
  nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState(formatDate(nextMonthDate));
  const [downloadDropdownOpen, setDownloadDropdownOpen] = useState(false);

  useEffect(() => {
    const loggedInUsername = localStorage.getItem("loggedInUsername");
    if (!loggedInUsername) return;

    fetch("http://localhost:3000/dashboard/chl-hubusers")
      .then((res) => res.json())
      .then((data) => {
        const currentUser = data.find((u) => u.username === loggedInUsername);
        if (currentUser) {
          setUser(currentUser);
          fetchUserCount(currentUser.hub_id);
          fetchCycleCounts(currentUser.hub_id);
        }
      });

    fetch("http://localhost:3000/dashboard/predict-travel")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.status === "ok") {
          fetch("http://localhost:3000/dashboard/predict-travel-data")
            .then((res) => res.json())
            .then((assignments) => {
              setTravelAssignments(assignments);
              setLoadingAssignments(false);
            });
        } else {
          setLoadingAssignments(false);
        }
      })
      .catch((err) => {
        console.error("Error fetching travel assignments:", err);
        setLoadingAssignments(false);
      });
  }, []);

  const fetchUserCount = async (hub_id) => {
    try {
      const res = await fetch("http://localhost:3000/dashboard/chl-datacollector");
      const data = await res.json();
      const filtered = data.filter((d) => d.hub_id === hub_id);
      setUserListCount(filtered.length);
    } catch (err) {
      console.error("User count fetch error:", err);
    }
  };

  const fetchCycleCounts = async (hub_id) => {
    try {
      const res = await fetch("http://localhost:3000/dashboard/chl_datacollection");
      const result = await res.json();

      if (Array.isArray(result.data)) {
        const filtered = result.data.filter(item => item.hub_id === hub_id);

        const cycle1 = filtered.filter(item => item.cycle === "1").length;
        const cycle2 = filtered.filter(item => item.cycle === "2").length;

        setCycle1Count(cycle1);
        setCycle2Count(cycle2);
      } else {
        console.error("Expected 'data' to be an array, but got:", result.data);
      }
    } catch (error) {
      console.error("Cycle count fetch error:", error);
    }
  };

  const toggleDownloadDropdown = () => setDownloadDropdownOpen((prev) => !prev);

  const handleDownload = (format) => {
    setDownloadDropdownOpen(false);
    alert(`Downloading as ${format.toUpperCase()} for range ${fromDate || "N/A"} to ${toDate}`);
  };

  const formatField = (fieldType) => {
    return fieldType
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (s) => s.toUpperCase());
  };

  const hubName = user?.hub_name?.toUpperCase() || "UNKNOWN HUB";
  const districtCount = staticDistrictCount[hubName] || 0;

  const dataBoxes = [
    { title: user?.hub_name || "Hub", districtCount },
    { title: "Users List", count: userListCount },
    { title: "Cycle 1", count: cycle1Count },
    { title: "Cycle 2", count: cycle2Count },
  ];

  return (
    <DashboardLayout>
      <div style={{ paddingLeft: "40px" }}>
        {/* Hub Heading */}
        <div className="mb-4">
          <h2 style={{
            fontWeight: "bold",
            color: "#2A2F5B",
            fontFamily: "Nunito, sans-serif",
            textAlign: "center"
          }}>
            {hubName}
          </h2>
        </div>

        {/* Summary Cards */}
        <div className="row mb-4">
          {dataBoxes.map(({ title, districtCount, count }, idx) => (
            <div key={idx} className="col-12 col-sm-6 col-md-3 mb-3 d-flex">
              <div className="card text-center w-100" style={{
                height: "148px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "18px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                transition: "box-shadow 0.2s, transform 0.2s"
              }}>
                <div className="card-body d-flex flex-column justify-content-center align-items-center p-2">
                  <h5 className="card-title" style={{
                    fontWeight: 700,
                    color: "steelblue",
                    marginBottom: 8
                  }}>{title}</h5>
                  {districtCount !== undefined && idx === 0 && (
                    <div className="card-text" style={{ color: "#007556", fontWeight: 600 }}>
                      Districts: {districtCount}
                    </div>
                  )}
                  {count !== undefined && idx !== 0 && (
                    <div className="card-text" style={{ color: "#333", fontWeight: 600 }}>
                      Count: {count}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Map Section */}
        <div className="mb-4" style={{
          height: "400px",
          overflow: "hidden",
          borderRadius: "18px",
          backgroundColor: "#f9f9f9"
        }}>
          <TamilNaduMap />
        </div>

        {/* Date Filter and Download */}
        <div className="d-flex align-items-center mb-4 gap-3 flex-wrap">
          <div>
            <label htmlFor="fromDate" className="form-label me-2">From:</label>
            <input
              type="date"
              id="fromDate"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="form-control"
            />
          </div>

          <div>
            <label htmlFor="toDate" className="form-label me-2">To:</label>
            <input
              type="date"
              id="toDate"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="form-control"
            />
          </div>

          <div className="dropdown mt-4">
            <button className="btn dropdown-toggle" onClick={toggleDownloadDropdown}>
              Download Report
            </button>
            {downloadDropdownOpen && (
              <ul className="dropdown-menu dropdown-menu-end show">
                {["csv", "pdf", "excel", "doc"].map((format) => (
                  <li key={format}>
                    <button
                      className="dropdown-item"
                      onClick={() => handleDownload(format)}
                    >
                      {format.toUpperCase()}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Travel Assignments Section */}
        <div className="mt-4" style={{ padding: "20px", backgroundColor: "#f5f7fa", borderRadius: "14px" }}>
          <h4 style={{ color: "#2A2F5B", fontWeight: "bold", marginBottom: "20px", textAlign: "center" }}>
            🧭 Travel Assignments
          </h4>

          {loadingAssignments ? (
            <p>Loading assignments...</p>
          ) : Object.keys(travelAssignments).length === 0 ? (
            <p>No travel assignments found.</p>
          ) : (
            Object.entries(travelAssignments).map(([hubId, tasks]) => (
              <div key={hubId} className="mb-4">
                <h5 style={{ color: "#004080", fontWeight: "bold", borderLeft: "4px solid #007bff", paddingLeft: "10px" }}>
                  {tasks[0]?.hub_name || hubId}
                </h5>
                <div className="d-flex flex-wrap gap-3 mt-2">
                  {tasks.map((task, index) => (
                    <div key={index} style={{
                      backgroundColor: "#ffffff",
                      borderRadius: "14px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      padding: "15px 20px",
                      width: "260px"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "600", marginBottom: "10px" }}>
                        <span>{task.username}</span>
                        <span>{task.district}</span>
                      </div>
                      <div>
                        <span style={{
                          backgroundColor: "#e0f7fa",
                          color: "#00796b",
                          padding: "6px 12px",
                          borderRadius: "20px",
                          fontSize: "14px",
                          fontWeight: "500"
                        }}>
                          {formatField(task.field_type)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HubDashboard;
