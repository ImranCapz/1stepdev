import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiArrowSmRight } from "react-icons/hi";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { RiDashboardFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../../redux/user/userSlice";
import { providerOut } from "../../redux/provider/providerSlice";
import { MdManageAccounts, MdSupervisorAccount } from "react-icons/md";
import { IoIosChatboxes } from "react-icons/io";

export default function DashSidebar() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const [active, setActive] = useState("dashboard");
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
        dispatch(providerOut());
        dispatch(signOut());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const bottomNav = [
    {
      name: "Dashboard",
      icon: RiDashboardFill,
      link: "/dashboard?tab=dashboard",
    },
    {
      name: "Providers",
      icon: MdSupervisorAccount,
      link: "/dashboard?tab=providers",
    },
    {
      name: "Messages",
      icon: IoIosChatboxes,
      link: "/dashboard?tab=messages",
    },
    {
      name: "Profile",
      icon: MdManageAccounts,
      link: "/dashboard?tab=profile",
    },
    {
      name: "Sign Out",
      icon: HiArrowSmRight,
      link: "/",
    },
  ];

  return (
    <div>
      <Sidebar className="w-full hidden md:flex">
        <Sidebar.Items>
          <Sidebar.ItemGroup className="flex flex-row gap-2 items-center">
            <Link to="/dashboard?tab=dashboard">
              <Sidebar.Item
                active={tab === "dashboard"}
                className="mt-2"
                icon={RiDashboardFill}
                // label={currentUser.isParent ? "Patient" : "User"}
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
      <div className="flex h-20 w-full fixed bottom-0 bg-slate-200 md:hidden z-10">
        <div className="flex flex-row items-center justify-around w-full">
          {bottomNav.map((item, index) => (
            <div key={index}>
              <Link to={item.link}>
                <p
                  className={`text-2xl ${
                    active === item.name
                      ? "provideritem-name -translate-y-2 transition-all duration-500"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActive(item.name)}
                >
                  <div className="flex flex-col items-center">
                    <p>{item.icon()}</p>
                    <p className="text-xs">{item.name}</p>
                  </div>
                </p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
