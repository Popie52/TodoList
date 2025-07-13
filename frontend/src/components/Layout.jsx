import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 min-h-screen">
        <Navbar setSidebarOpen={setSidebarOpen} />
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
