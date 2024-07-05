import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiArrowSmRight } from "react-icons/hi";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { RiDashboardFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../../redux/user/userSlice";
import { MdManageAccounts , MdSupervisorAccount } from "react-icons/md";
import { IoIosChatboxes } from "react-icons/io";

export default function DashSidebar() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

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
          <Link to="/dashboard?tab=dashboard">
            <Sidebar.Item
              active={tab === "dashboard"}
              icon={RiDashboardFill}
              label={currentUser.isParent ? "Patient" : "User"}
              labelColor="light"
              as="div"
            >
              Dashboard
            </Sidebar.Item>
          </Link>

          <Link to="/dashboard?tab=providers">
            <Sidebar.Item
              active={tab === "providers"}
              icon={MdSupervisorAccount}
              labelColor="light"
              as="div"
            >
              Providers
            </Sidebar.Item>
          </Link>
          <Link to="/dashboard?tab=messages">
            <Sidebar.Item
              active={tab === "messages"}
              icon={IoIosChatboxes}
              labelColor="light"
              as="div"
            >
              Message
            </Sidebar.Item>
          </Link>
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={MdManageAccounts}
              labelColor="light"
              as="div"
            >
              Profile
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
