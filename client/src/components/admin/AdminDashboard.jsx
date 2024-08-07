import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import DashUsers from "./DashUsers";
import Overview from "./Overview";
import AdminProviderCreate from "./AdminProviderCreate";

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
      <div>{tab === "dashboard" && <Overview />}</div> 
        
        {tab === "users" && <DashUsers />}
        {tab === "createprovider" && <AdminProviderCreate />}
    </div>
  );
}
