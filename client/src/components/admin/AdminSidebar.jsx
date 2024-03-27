import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiArrowSmRight, HiUser } from "react-icons/hi";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { RiDashboardFill } from "react-icons/ri";

export default function AdminSidebar() {
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
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to="/admin-dashboard?tab=dashboard">
            <Sidebar.Item
              active={tab === "dashboard"}
              icon={RiDashboardFill}
              label={"Admin"}
              labelColor="light"
            >
              Dashboard
            </Sidebar.Item>
          </Link>
          <Link to="/admin-dashboard?tab=user">
            <Sidebar.Item
              active={tab === "user"}
              icon={HiUser}
              labelColor="light"
            >
              Users
            </Sidebar.Item>
          </Link>
          <Sidebar.Item icon={HiArrowSmRight} className="cursor-pointer">
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
