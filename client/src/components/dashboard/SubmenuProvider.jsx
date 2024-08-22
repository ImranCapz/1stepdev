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
    <div className="flex flex-col w-full transition-all duration-500">
      <nav className="block border-b items-start">
        <ul className=" flex items-center gap-x-3 max-w-screen-2xl mx-auto px-4">
          {submenuNav.map((item, idx) => (
            <li key={idx} className="py-1">
              <Link
                to={`?tag=${item.title}`}
                className={`block py-2 px-3 rounded-lg md:text-base text-sm text-gray-700 hover:text-amber-500 hover:bg-amber-100 duration-150 ${
                  activeComponent === item.title
                    ? "border-b-2 border-amber-500"
                    : ""
                }`}
              >
                <span className="">{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

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
