import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "./DashSiderbar";
import Overview from "./Overview";
import SubmenuProfile from "./SubmenuProfile";
import SubmenuProvider from "./SubmenuProvider";


export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("dashboard");
 

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (["dashboard", "createprovider","profile"].includes(tabFromUrl)) {
      setTab(tabFromUrl);
    }
  }, [location.search]); 
  return (
    <div className="min-h-screen flex flex-col md:flex-row ">
      <div className="md:w-56">
        <DashSidebar />
      </div>
        {tab === "dashboard" && <Overview /> }
        {tab === "createprovider" && <SubmenuProvider />}
        {tab === "profile" && < SubmenuProfile/>}
       
    </div>
  );
}
