import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* Sidebar with default height but extends if needed */}
      <Sidebar />

      {/* Main Content Area (Scrolls if content is longer) */}
      <div className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
