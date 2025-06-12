import React, { useState } from "react";
import DashboardLayout from "./DashboardLayout";
import TamilNaduMap from "./TamilNadu";

const dataBoxes = [
  { title: "Overall Report", number: 1200 },
  { title: "DHP Report", number: 300 },
  { title: "Monthly Report", number: 520 },
  { title: "Feedback", number: 48 },
];

const Dashboard = () => {
  const today = new Date();

  const formatDate = (date) => date.toISOString().split("T")[0];

  const nextMonthDate = new Date(today);
  nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);

  // State for 'From' and 'To' dates
  const [fromDate, setFromDate] = useState("");  // no default, user chooses freely
  const [toDate, setToDate] = useState(formatDate(nextMonthDate));

  const [downloadDropdownOpen, setDownloadDropdownOpen] = useState(false);

  const toggleDownloadDropdown = () =>
    setDownloadDropdownOpen((prev) => !prev);

  const handleDownload = (format) => {
    setDownloadDropdownOpen(false);
    alert(`Downloading as ${format.toUpperCase()} for range ${fromDate || "N/A"} to ${toDate}`);
  };

  return (
    <DashboardLayout>
      <div className="row mb-4">
        {dataBoxes.map(({ title, number }, idx) => (
          <div key={idx} className="col-12 col-md-4 col-lg-2 mb-3">
            <div className="card text-center shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{title}</h5>
                <p className="card-text fs-4 fw-bold">{number}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

     <div className="mb-4" style={{ height: "400px", overflow: "hidden", borderRadius: "8px" }}>
       <TamilNaduMap />
     </div>

      
      <div className="d-flex align-items-center mb-4 gap-3">
        <div>
          <label htmlFor="fromDate" className="form-label me-2">
            From:
          </label>
          <input
            type="date"
            id="fromDate"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="form-control"
            style={{ maxWidth: "180px"}}
          />
        </div>

        <div>
          <label htmlFor="toDate" className="form-label me-2">
            To:
          </label>
          <input
            type="date"
            id="toDate"
            value={toDate}
            min={fromDate || undefined}
            max={formatDate(nextMonthDate)}
            onChange={(e) => setToDate(e.target.value)}
            className="form-control"
            style={{ maxWidth: "180px" }}
          />
        </div>

        {/* Download Dropdown */}
        <div className="dropdown mt-4">
          <button
            className="btn btn-primary dropdown-toggle"
            style={{ height: "47px", paddingTop: "2px", paddingBottom: "2px", fontSize: "0.95rem" }}
            onClick={toggleDownloadDropdown}
            aria-expanded={downloadDropdownOpen}
          >
            Download Report
          </button>
          {downloadDropdownOpen && (
            <ul
              className="dropdown-menu dropdown-menu-end show"
              style={{ position: "absolute", 
              }}
            >
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
    </DashboardLayout>
  );
};

export default Dashboard;
