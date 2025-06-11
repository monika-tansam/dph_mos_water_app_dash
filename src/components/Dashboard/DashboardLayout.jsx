import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />
      <main className="p-4 content-with-sidebar ">{children}</main>

      <style jsx="true">{`
        @media (min-width: 768px) {
          .content-with-sidebar {
            margin-left: 250px;
            transition: margin-left 0.3s ease-in-out;
          }
        }
      `}</style>
    </>
  );
};

export default DashboardLayout;
