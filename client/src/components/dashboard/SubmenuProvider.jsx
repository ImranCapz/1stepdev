import { Link, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import CreateProvider from "../../pages/CreateProvider";
import ProviderBooking from "../booking/ProviderBooking";
import ProviderMessageDash from "./ProviderMessageDash";
import { useSelector } from "react-redux";

export default function SubmenuProvider() {
  const [activeComponent, setActiveComponent] = useState("Providers");
  const { currentProvider } = useSelector((state) => state.provider);
  const location = useLocation();

  const submenuNav = useMemo(() => {
    const NavItems = [{ title: "Providers" }];
    if (currentProvider) {
      NavItems.push({ title: "Message" }, { title: "Appointment" });
    }
    return NavItems;
  }, [currentProvider]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tagFromUrl = urlParams.get("tag");
    if (tagFromUrl) {
      const validTag = submenuNav.find((item) => item.title === tagFromUrl);
      if (validTag) {
        setActiveComponent(tagFromUrl);
      }
    }
  }, [location.search, submenuNav]);

  return (
    <div className="flex flex-col transition-all duration-500">
      <div className="flex flex-row">
        {submenuNav.map((item, idx) => (
          <nav key={idx}>
            <div
              className={`border-b-2 hover:text-amber-500 hover:bg-amber-100 duration-150 ${
                activeComponent === item.title ? "border-amber-500 " : ""
              }`}
            >
              <ul className="flex max-w-screen-2xl overflow-x-auto lg:px-4">
                <li key={idx} className="py-1">
                  <Link
                    to={`?tag=${item.title}`}
                    className={`block py-1.5 px-2 rounded-t-lg md:text-base text-sm text-gray-700`}
                  >
                    <span className="">{item.title}</span>
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        ))}
      </div>

      {activeComponent === "Providers" && (
        <div className="w-full transition-all duration-500">
          <CreateProvider />
        </div>
      )}
      {currentProvider && (
        <>
          {activeComponent === "Message" && (
            <div className="w-full transition-all duration-500 h-screen">
              <h1 className="flex flex-col font-bold text-2xl text-zinc-800"></h1>
              <ProviderMessageDash />
            </div>
          )}
          {activeComponent === "Appointment" && (
            <div className="w-full transition-all duration-500">
              <h1 className="flex flex-col p-2 font-bold text-2xl text-zinc-800"></h1>
              <ProviderBooking />
            </div>
          )}
        </>
      )}

      {/* Other components... */}
    </div>
  );
}
