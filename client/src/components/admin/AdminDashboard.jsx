import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import Profile from "../Profile";
import DashUsers from "./DashUsers";

export default function AdminDashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div className="min-h-screen flex flex-col md:flex-row ">
      <div className="md:w-56">
        <AdminSidebar />
      </div>

      <div className="flex flex-col">{tab === "Dashboard" && <Profile />}</div>
      <div className="flex flex-col">{tab === "User" && <DashUsers />}</div>
    </div>
  );
}
