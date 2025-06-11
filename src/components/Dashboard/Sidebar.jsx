import React from "react";

const Sidebar = ({ isOpen, closeSidebar }) => {
  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? "show" : ""}`}
        onClick={closeSidebar}
      ></div>

      <aside
        className={`sidebar bg-white shadow-sm ${
          isOpen ? "sidebar-open" : ""
        }`}
      >
        <div className="p-3">
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <a href="/home" className="nav-link text-dark">
                Home
              </a>
            </li>
            <li className="nav-item mb-2">
              <a href="#profile" className="nav-link text-dark">
                Profile
              </a>
            </li>
            <li className="nav-item mb-2">
              <a href="#settings" className="nav-link text-dark">
                Settings
              </a>
            </li>
          </ul>
        </div>
      </aside>

      <style jsx="true">{`
        .sidebar {
          position: fixed;
          margin-top:27px;
          top: 56px;
          left: 0;
          width: 250px;
          height: calc(100vh - 56px);
          overflow-y: auto;
          background: white;
          box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
          transform: translateX(-100%);
          transition: transform 0.3s ease-in-out;
          z-index: 1050;
        }
        .sidebar-open {
          transform: translateX(0);
        }
        .sidebar-overlay {
          position: fixed;
          top: 56px;
          left: 0;
          width: 100vw;
          height: calc(100vh - 56px);
          background: rgba(0, 0, 0, 0.3);
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s ease-in-out;
          z-index: 1040;
        }
        .sidebar-overlay.show {
          opacity: 1;
          visibility: visible;
        }
        @media (min-width: 768px) {
          .sidebar {
            transform: translateX(0);
            position: fixed;
            top: 56px;
            left: 0;
            height: calc(100vh - 56px);
            z-index: 1050;
          }
          .sidebar-overlay {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default Sidebar;
