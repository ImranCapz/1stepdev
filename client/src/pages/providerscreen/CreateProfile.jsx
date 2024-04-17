import { Button } from "flowbite-react";
import profileImage from "../providerscreen/createprovider.png";
import { useState } from "react";
import { Link } from "react-router-dom";
import ProviderLogin from "./ProviderLogin";

function NewComponent() {
  const [providerLogin, setproviderLogin] = useState(false);
  return (
    <div className="flex flex-col items-center justify-center w-full">
      {!providerLogin && (
        <div>
          <div className="flex flex-col items-center w-full">
            <h1 className="text-sky-700 font-bold mb-6 mt-4 text-xl">
              Create a 1Step Health Profile
            </h1>
            <p className="text-zinc-800 font-semibold mb-6 text-3xl">
              Ready to create a 1Step Profile.?
            </p>
            <p className="text-zinc-800 font-semibold mb-4 text-center md:w-1/2">
              To create a profile, you&apos;ll need the following information
              regarding your practice or organization.
            </p>
          </div>
          <div className="flex flex-col items-start mt-4 md:pl-96">
            <h1 className="text-zinc-500 font-bold">For medical providers</h1>
            <p className="text-zinc-500 font-normal md:w-2/4">
              If your provider ABA Therapy, Speech Therapy, Pediatrics,
              Diagnostic Evalutions,or Occupational Therapy, you&apos;ll need:
            </p>
          </div>
          <div className="flex flex-col items-center mt-6 focus:ring-0">
            <div className="text-zinc-500 text-sm">
              <div className="">
                <label className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    className="focus:outline-none focus:ring-0" defaultChecked
                  />
                  <h1>Your Clinic&apos;s NPI number</h1>
                </label>
                <label className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    className="focus:outline-none focus:ring-0" defaultChecked
                  />
                  <h1>Your lead clinician&apos;s name</h1>
                </label>
                <label className="flex items-center gap-2 ">
                  <input
                    type="checkbox"
                    className="focus:outline-none focus:ring-0" defaultChecked
                  />
                  <h1>Your lead clinician&apos;s NPI number</h1>
                </label>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start mt-4 md:pl-96">
            <h1 className="text-zinc-500 font-bold">
              For all other organizations
            </h1>
            <p className="text-zinc-500 font-normal md:w-2/4">
              If your provider Camps,After-School Activites,Special Ed Advocacy
              or other non-clinical services,you&apos;ll need:
            </p>
          </div>
          <div className="flex flex-col items-center mt-6 focus:ring-0">
            <div className="text-zinc-500 text-sm">
              <label
                className="flex items-center gap-2 mb-2"
                style={{ marginRight: "80px" }}
              >
                <input
                  type="checkbox"
                  className="focus:outline-none focus:ring-0" defaultChecked
                />
                <h1>Proof of Ownership</h1>
              </label>
            </div>
          </div>
          <div className="flex flex-col items-start mt-4 md:pl-96">
            <h1 className="text-zinc-500 text-sm font-bold">
              What&apos;s Proof of Ownership?
            </h1>
            <p className="text-zinc-500 font-normal md:w-2/4 text-sm">
              {" "}
              we&apos;re asking for a document that verifies your organzition.
              This could be a tax document, business license, third-party
              accreditation, or smiliar document. It should include th official
              name of your organization.
            </p>
          </div>
          <div className="flex flex-row mt-4 items-center gap-4 justify-center">
            <Link to="/">
              <Button color="gray">No,I&apos;ll Come Back Later</Button>
            </Link>
            <Button onClick={() => setproviderLogin(true)}>
              Yes, I Have These Items Ready
            </Button>
          </div>
        </div>
      )}
      {providerLogin && <ProviderLogin />}
    </div>
  );
}

export default function CreateProfile() {
  const [showComponent, setShowComponent] = useState(false);

  return (
    <div className="flex flex-col items-center min-h-screen w-full">
      {!showComponent && (
        <div className="flex flex-col justify-center mt-60 outline outline-offset-2 outline-1 outline-gray-300 bg-sky-100 rounded-lg ">
          <div className="">
            <div className="flex flex-col sm:flex-row items-center p-4">
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
