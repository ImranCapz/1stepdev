import { Link, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import CreateProvider from "../../pages/CreateProvider";
import ProviderBooking from "../booking/ProviderBooking";

export default function SubmenuProvider() {
  const [activeComponent, setActiveComponent] = useState("Providers");
  const location = useLocation();

  const submenuNav = useMemo(() => [
    { title: "Providers" },
    { title: "Provider Message"},
    { title: "Appointment" },
  ], []);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tagFromUrl = urlParams.get("tag");
    if (tagFromUrl) {
      const validTag = submenuNav.find(item => item.title === tagFromUrl);
      if(validTag){
        setActiveComponent(tagFromUrl);
      }
    }
  }, [location.search, submenuNav]);

  return (
    <div className="flex flex-col w-full transition-all duration-500">
      <nav className="block border-b items-start">
        <ul className=" flex items-center gap-x-3 max-w-screen-2xl mx-auto px-4 overflow-x-auto lg:px-8 mt-4">
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
        <div className="w-full min-h-screen transition-all duration-500">
          <CreateProvider />
        </div>
      )}
      {activeComponent === "Appointment" &&(
        <div className="w-full">
          <h1 className="flex flex-col mt-6 p-2 pl-6 font-bold text-2xl text-zinc-800">
            {" "}
            {/* {currentUser.isParent ? "Your Parent Details :" : 'Fill the form for Parent Profile :'} */}
          </h1>
          <ProviderBooking />
        </div>
      )}
      {/* Other components... */}
    </div>
  );
}
