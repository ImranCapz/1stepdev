import { Button } from "flowbite-react";
import profileImage from "../providerscreen/createprovider.png";
import { Link } from "react-router-dom";
import { useState } from "react";

// This is your new component
function NewComponent() {
  return <div>This is a new component</div>;
}

export default function CreateProfile() {
  const [showComponent, setShowComponent] = useState(false);

  return (
    <div className="flex flex-col items-center mt-20 min-h-screen">
      {!showComponent && (
        <div className="flex flex-col justify-center mt-16 outline outline-offset-2 outline-1 outline-gray-300 bg-sky-100 rounded-lg ">
          <div className="">
            <div className="flex flex-row items-center p-4">
              <img
                src={profileImage}
                alt="profile"
                className="flex items-center h-24 w-24 rounded-full bg-gray-400 p-1"
              />
              <div className="p-5">
                <p className="text-2xl font-semibold text-gray-800">
                  Can&apos;t find a profile for your practice?
                </p>
                <h4 className="text-sm font-semibold text-gray-600">
                  we might not have a profile for you yet. The good news - you{" "}
                  <br />
                  can create a profile for free!
                </h4>
              </div>

              <Button onClick={() => setShowComponent(true)}>
                Create Profile
              </Button>
            </div>
          </div>
        </div>
      )}

      {showComponent && <NewComponent />}
    </div>
  );
}
