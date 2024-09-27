import { useSelector } from "react-redux";
import profileImage from "../../pages/providerscreen/createprovider.png";
import { Button, Modal, Table } from "flowbite-react";
import { Link } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { FcCancel, FcOk } from "react-icons/fc";
import { MdOutlineAccessTime, MdVerified } from "react-icons/md";
import { IoMdAlert } from "react-icons/io";
import OtpInput from "react-otp-input";
import { useState } from "react";
import toast from "react-hot-toast";
import SearchBar from "../SearchBar";
import { FcApproval } from "react-icons/fc";
import { Stepper, Step } from "@material-tailwind/react";
import { MdVerifiedUser } from "react-icons/md";
import { MdOutlineSettings } from "react-icons/md";
import { VscLightbulbSparkle } from "react-icons/vsc";
import { FaLightbulb } from "react-icons/fa";
import { HiMiniUserGroup } from "react-icons/hi2";

export default function Overview() {
  const { currentUser } = useSelector((state) => state.user);
  const { currentProvider } = useSelector((state) => state.provider);
  const [otpOpen, setOtpOpen] = useState(false);
  const [otp, setOtp] = useState(0);
  const { bookings } = useSelector((state) => state.booking);

  const handleVerifyProfile = async () => {
    try {
      setOtpOpen(true);
      const res = await fetch("/server/provider/sendotp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: currentProvider.email,
        }),
      });
      const data = await res.json();
      if (data.success === false) {
        console.log("Error:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await fetch("/server/provider/verifyotp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: currentProvider.email,
          otp: otp,
        }),
      });
      const data = await res.json();
      console.log("verified Data", data);
      if (data.success === false) {
        console.log("Error:", data.message);
        toast.error(data.message);
        return;
      }
      if (data.success === true) {
        // setprovider((prev) => ({ ...prev, verified: true }));
        toast.success("Profile Verified");
        setOtpOpen(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while verifying the OTP.");
    }
  };

  function onCloseModal() {
    setOtpOpen(false);
  }
  const steps = [
    {
      label: "New",
      description: "Details about your account.",
      icon: FaLightbulb,
    },
    {
      label: "Claim Profile",
      description: "Details about your account.",
      icon: MdVerified,
    },
    {
      label: "Experience & Skills",
      description: "Verify your information.",
      icon: MdVerifiedUser,
    },
    {
      label: "Skilled Provider",
      description: "Complete your setup.",
      icon: HiMiniUserGroup,
    },
    {
      label: "1Step Pro",
      description: "Complete your setup.",
      icon: VscLightbulbSparkle,
    },
  ];

  return (
    <div className="w-full flex bg-slate-100 justify-center items-center mx-auto mb-16 md:mb-0">
      <div className="p-4 flex flex-col lg:flex-row gap-2 w-full">
        <div className="flex flex-col gap-2 lg:w-auto">
          <div className="border border-slate-200 rounded-md bg-white">
            <h1 className="text-gray font-semibold text-xl p-2.5 border-b">
              Profile
            </h1>
            <div className="relative flex flex-col items-center">
              <Link to={"/dashboard?tab=profile"}>
                <CiEdit className="size-6 right-3 top-3 absolute cursor-pointer text-gray hover:text-slate-400 transition-all duration-200 ease-in" />
              </Link>
              <div className="p-4 w-[280px] flex flex-col items-center">
                <img
                  src={
                    currentUser.profilePicture ||
                    "https://i.ibb.co/tKQH4zp/defaultprofile.jpg"
                  }
                  alt="profile"
                  className="w-28 h-28 object-cover rounded-full"
                />
                <h1 className="text-gray text-base font-semibold mt-2">
                  {currentUser.username}
                </h1>
              </div>
            </div>
          </div>
          <div className="border border-slate-200 rounded-md bg-gradient-to-r from-purple-600 via-purple-600 to-rose-500">
            <div className="p-4 flex flex-col items-start">
              <h1 className="text-white">Become A 1Step Pro</h1>
            </div>
          </div>
          <div className=""></div>
        </div>
        <div className="flex flex-col gap-2 flex-grow">
          {currentProvider ? (
            <>
              <div className="relative flex flex-col border border-slate-200 bg-white p-1 rounded-md">
                <h1 className="p-2 border-b text-gray font-semibold text-xl">
                  Provider Status
                </h1>
                <Link to={"/dashboard?tab=providers"}>
                  <CiEdit className="size-6 right-3 top-3 absolute cursor-pointer text-gray hover:text-slate-400 transition-all duration-200 ease-in" />
                </Link>
                <div className="w-full mt-2">
                  <div className="w-full flex items-center md:px-24 py-4 p-6 mb-20">
                    <Stepper activeStep={Number(currentProvider.status)}>
                      {steps.map((step, index) => (
                        <Step key={index} className="h-8 w-8 bg-blue-200">
                          <p className="text-[15px] mt-2 ml-2">{step.icon()}</p>
                          <div
                            className={`flex text-gray items-center justify-center mt-8 md:text-base text-[10px]`}
                          >
                            {step.label === "Claim Profile" ? (
                              <>
                                {currentProvider.status === 0 ? (
                                  <p>Claim Profile</p>
                                ) : (
                                  <p className="text-green-600">
                                    Profile Claimed
                                  </p>
                                )}
                              </>
                            ) : step.label === "Experience & Skills" ? (
                              <>
                                {currentProvider.status === 1 ? (
                                  <p className="text-gray-600">
                                    Experience & Skills
                                  </p>
                                ) : (
                                  <p className="text-gray-400">
                                    Experience & Skills
                                  </p>
                                )}
                              </>
                            ) : step.label === "Skilled Provider" ? (
                              <>
                                {currentProvider.status === 2 ? (
                                  <p className="text-gray-600">Skilled Provider</p>
                                ) : (
                                  <p className="text-gray-600">
                                    Skilled Provider
                                  </p>
                                )}
                              </>
                            ) : step.label === "1Step Pro" ? (
                              <>
                                {currentProvider.status === 3 ? (
                                  <p className="text-gray-600">1Step Pro</p>
                                ) : (
                                  <p className="text-gray-600">1Step Pro</p>
                                )}
                              </>
                            ) : (
                              <p>
                                {step.label === "New" ? (
                                  <p className="">New</p>
                                ) : (
                                  <></>
                                )}
                              </p>
                            )}
                          </div>
                        </Step>
                      ))}
                    </Stepper>
                  </div>
                  <div className="border-t p-4">
                    {currentProvider.status === 0 &&
                      currentProvider.verified === false && (
                        <div>
                          <div>
                            <h2 className="flex flex-row items-center gap-2 text-xl font-semibold text-slate-800">
                              Benefit of claiming profile
                              <FcApproval className="size-6" />
                            </h2>
                            <ul className="list-disc list-inside mt-2 text-gray-800 mb-4">
                              <li>Get verified badge on your profile.</li>
                              <li>Get more visibility and attract more.</li>
                            </ul>
                          </div>
                          <div className="flex justify-center border border-slate-200 p-4 rounded-lg bg-sky-100">
                            <button
                              className="flex flex-row space-x-2 items-center"
                              onClick={handleVerifyProfile}
                            >
                              <IoMdAlert className="text-amber-500" />
                              <p className="flex flex-row items-center underline text-gray font-semibold">
                                Claim Your Profile Now
                              </p>
                            </button>
                          </div>
                        </div>
                      )}
                    {currentProvider.status === 1 && (
                      <div>
                        <div>
                          <h2 className="flex flex-row items-center gap-1 text-xl font-semibold text-slate-800">
                            Experienced Provider
                            <MdVerifiedUser className="size-5" />
                          </h2>
                          <ul className="list-disc list-inside mt-2 text-gray-800 mb-4">
                            <li>With this status, you gain visibility x2</li>
                            <li>Expert care, backed by years of experience.</li>
                            <li>
                              Your well-being is our top priority, shaped by
                              years of experience.
                            </li>
                          </ul>
                        </div>
                        <div className="flex justify-center border border-slate-200 p-4 rounded-lg bg-sky-100">
                          <button className="flex flex-row space-x-2 items-center">
                            <IoMdAlert className="text-amber-500" />
                            <p className="flex flex-row items-center underline text-gray font-semibold">
                              Verify your Experience
                            </p>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <Modal show={otpOpen} onClose={onCloseModal} popup>
                    <Modal.Header></Modal.Header>
                    <Modal.Body>
                      <div className="flex flex-col text-xl font-semibold text-gray gap-4">
                        OTP Sended to your {currentProvider.email}
                        <div className="flex flex-col gap-4 p-10">
                          <label>Enter OTP</label>
                          <div className="flex flex-row items-center justify-center">
                            <OtpInput
                              value={otp}
                              onChange={setOtp}
                              numInputs={6}
                              renderInput={(props) => (
                                <input
                                  {...props}
                                  style={{
                                    width: "2.5rem",
                                    height: "3rem",
                                    margin: "0 0.5rem",
                                    fontSize: "1.5rem",
                                    borderRadius: "4px",
                                    border: "1px solid rgba(0,0,0,0.3)",
                                    color: "black",
                                    backgroundColor: "white",
                                  }}
                                />
                              )}
                            />
                          </div>
                          <Button onClick={handleVerifyOtp}>Verify OTP</Button>
                        </div>
                      </div>
                    </Modal.Body>
                  </Modal>
                </div>
              </div>
            </>
          ) : (
            <div className="flex border border-slate-200 bg-white p-1 rounded-md w-full">
              <div className="flex flex-col sm:flex-row items-center p-4 w-full">
                <img
                  src={profileImage}
                  alt="profile"
                  className="flex items-center h-24 w-24 rounded-full bg-gray-400 p-1"
                />
                <div className="p-5 flex flex-col md:flex-row md:justify-between items-center w-full md:gap-6">
                  <div className="text-center md:text-left">
                    <p className="text-2xl font-semibold text-gray-800">
                      Can&apos;t find a profile for your practice?
                    </p>
                    <h4 className="text-sm font-semibold text-gray-600">
                      we might not have a profile for you yet. The good news -
                      you can create a profile for free!
                    </h4>
                  </div>
                  <div className="mt-4">
                    <Link to={"/dashboard?tab=providers"}>
                      <Button>Create Profile</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
          {bookings && bookings.length > 0 ? (
            <div className="flex flex-col border border-slate-200 bg-white p-2 rounded-md">
              <div className="flex flex-row justify-between border-b mb-4">
                <h1 className="p-3 font-semibold text-xl text-gray">
                  Your Recent Bookings
                </h1>
                <button className="p-3 md:text-sm text-xs font-bold text-gray hover:text-gray-500 transition-all duration-200 ease-in-out">
                  <Link to={"/dashboard?tag=Bookings"}>View All</Link>
                </button>
              </div>
              <div className="overflow-auto w-full">
                <Table hoverable>
                  <Table.Head>
                    <Table.HeadCell>Provider Name</Table.HeadCell>
                    <Table.HeadCell>Services</Table.HeadCell>
                    <Table.HeadCell>Scheduled Time</Table.HeadCell>
                    <Table.HeadCell>Slot Time</Table.HeadCell>
                    <Table.HeadCell>Session Type</Table.HeadCell>
                    <Table.HeadCell>Note</Table.HeadCell>
                    <Table.HeadCell>Status</Table.HeadCell>
                    <Table.HeadCell>Process</Table.HeadCell>
                    {/* <Table.HeadCell>Edit</Table.HeadCell> */}
                  </Table.Head>
                  {bookings.map((bookingDetails) => (
                    <Table.Body className="divide-y" key={bookingDetails._id}>
                      <Table.Row
                        className={`text-gray-600 rounded-lg ${
                          bookingDetails.status === "pending" &&
                          "border-l-4 border-amber-300 bg-amber-100"
                        } ${
                          bookingDetails.status === "approved" &&
                          "border-l-4 border-emerald-400 bg-emerald-100"
                        }  ${
                          bookingDetails.status === "rejected" &&
                          "border-l-4 border-red-500 bg-red-100"
                        }`}
                      >
                        <Table.Cell>
                          {bookingDetails.providerDetails.fullName}
                        </Table.Cell>
                        <Table.Cell>
                          {bookingDetails.service.join(", ")}
                        </Table.Cell>
                        <Table.Cell>
                          {new Date(
                            bookingDetails.scheduledTime.date
                          ).toLocaleDateString()}
                        </Table.Cell>
                        <Table.Cell>
                          {bookingDetails.scheduledTime.slot}
                        </Table.Cell>
                        <Table.Cell>{bookingDetails.sessionType}</Table.Cell>
                        <Table.Cell>{bookingDetails.note}</Table.Cell>
                        <Table.Cell>
                          {bookingDetails.status === "pending" ? (
                            <p className="">
                              <MdOutlineAccessTime />
                            </p>
                          ) : (
                            ""
                          )}
                          {bookingDetails.status === "approved" ? (
                            <p>
                              <FcOk />
                            </p>
                          ) : (
                            ""
                          )}
                          {bookingDetails.status === "rejected" ? (
                            <p className="justify-center items-center">
                              <FcCancel />
                            </p>
                          ) : (
                            ""
                          )}
                        </Table.Cell>
                        <Table.Cell>
                          <p>{bookingDetails.status}</p>
                        </Table.Cell>
                        {/* <Table.Cell>
                      <Button>EDIT</Button>
                    </Table.Cell> */}
                      </Table.Row>
                    </Table.Body>
                  ))}
                </Table>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center border border-slate-200 bg-white p-4 rounded-md w-full">
              <h1 className="text-gray-800 text-xl font-semibold mb-4">
                No Bookings
              </h1>
              <div className="flex items-center justify-center w-full">
                <SearchBar />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
