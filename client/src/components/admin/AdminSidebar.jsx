import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiArrowSmRight, HiUser } from "react-icons/hi";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { RiDashboardFill } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { signOut } from "../../redux/user/userSlice";

export default function AdminSidebar() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch("/server/auth/signout", {
        method: "GET",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOut());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-2">
          <Link to="/admin-dashboard?tab=dashboard">
            <Sidebar.Item
              active={tab === "dashboard"}
              icon={RiDashboardFill}
              label={"Admin"}
              labelColor="light"
              as="div"
            >
              Dashboard
            </Sidebar.Item>
          </Link>
          <Link to="/admin-dashboard?tab=users">
            <Sidebar.Item
              active={tab === "users"}
              icon={HiUser}
              labelColor="light"
              as="div"
            >
              Users
            </Sidebar.Item>
          </Link>
          <Link to="/admin-dashboard?tab=createprovider">
            <Sidebar.Item
              active={tab === "createprovider"}
              icon={HiUser}
              labelColor="light"
              as="div"
            >
              Provider
            </Sidebar.Item>
          </Link>
          <Sidebar.Item
            icon={HiArrowSmRight}
            className="cursor-pointer"
            onClick={handleSignout}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
