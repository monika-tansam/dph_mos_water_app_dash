import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Header = ({ toggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-light bg-light px-3 shadow-sm">
      <div className="container-fluid d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-outline-secondary d-md-none me-2"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            &#9776;
          </button>
          <img
            src="/DPH_Logo.webp"
            alt="Logo 1"
            style={{ height: "50px", width: "50px" }}
          />
          <img
            src="/Logo2.png"
            alt="Logo 2"
            style={{ height: "50px", width: "70px" }}
          />
        </div>

        <div className="flex-grow-1 text-center">
          <h4 className="mb-0">DPH Dashboard</h4>
        </div>

        <div ref={dropdownRef} className="position-relative">
             <button
                 className="btn btn-secondary dropdown-toggle d-flex align-items-center"
                 onClick={() => setDropdownOpen(!dropdownOpen)}
                 aria-expanded={dropdownOpen}
               >
             <i className="bi bi-person-circle fs-5"></i>
             </button>

          {dropdownOpen && (
            <ul
              className="dropdown-menu dropdown-menu-end show"
              style={{ position: "absolute", right: 0 }}
            >
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => navigate("/edit-user")}
                >
                  Edit User
                </button>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <button
                  className="dropdown-item text-danger"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
