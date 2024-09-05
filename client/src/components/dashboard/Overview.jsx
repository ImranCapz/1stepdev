import { useSelector } from "react-redux";
import profileImage from "../../pages/providerscreen/createprovider.png";
import { Button, Modal, Table } from "flowbite-react";
import { Link } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { FcCancel, FcOk } from "react-icons/fc";
import { MdOutlineAccessTime } from "react-icons/md";
import { IoMdAlert } from "react-icons/io";
import OtpInput from "react-otp-input";
import { useState } from "react";
import toast from "react-hot-toast";
import ProgressBar from "../../components/dashboard/ProgressBar";

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
  return (
    <div className="flex bg-slate-100 justify-center">
      <div className="p-4 flex flex-row gap-4">
        <div className="flex flex-col gap-2">
          <div className="border border-slate-200 rounded-md bg-white">
            <h1 className="text-gray font-semibold text-xl p-2.5 border-b">
              Profile
            </h1>
            <div className="relative flex flex-col items-center">
              <Link to={"/dashboard?tab=profile"}>
                <CiEdit className="size-6 right-3 top-3 absolute cursor-pointer text-gray hover:text-slate-400 transition-all duration-200 ease-in" />
              </Link>
              <div className="px-16 p-4 flex flex-col items-center">
                <img
                  src={currentUser.profilePicture}
                  alt="profile"
                  className="w-28 h-28 object-cover rounded-full"
                />
                <h1 className="text-gray text-xl font-semibold mt-2">
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
        </div>

        <div className="flex flex-col gap-4">
          {currentProvider ? (
            <>
              <div className="relative flex flex-col border border-slate-200 bg-white p-1 rounded-md">
                <h1 className="p-2 border-b text-gray font-semibold text-xl">
                  Provider Status
                </h1>
                <Link to={"/dashboard?tab=providers"}>
                  <CiEdit className="size-6 right-3 top-3 absolute cursor-pointer text-gray hover:text-slate-400 transition-all duration-200 ease-in" />
                </Link>
                <div className="w-full px-20 mt-2">
                  <div>
                    <ProgressBar currentStep={2} />
                    {}
                    {currentProvider.verified === false && (
                      <div className="flex justify-center border border-slate-200 p-4 rounded-lg bg-sky-100">
                        <button
                          className="flex flex-row space-x-2 items-center"
                          onClick={handleVerifyProfile}
                        >
                          <IoMdAlert className="text-amber-500" />
                          {/* <span className="text-slate-700">
                            is this your profile
                          </span> */}
                          <p className="flex flex-row items-center underline text-gray font-semibold">
                            Claim Your Profile
                          </p>
                        </button>
                      </div>
                    )}
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
                            <Button onClick={handleVerifyOtp}>
                              Verify OTP
                            </Button>
                          </div>
                        </div>
                      </Modal.Body>
                    </Modal>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex border border-slate-200 bg-white p-1 rounded-md">
              <div className="flex flex-col sm:flex-row items-center p-4 w-full">
                <img
                  src={profileImage}
                  alt="profile"
                  className="flex items-center h-24 w-24 rounded-full bg-gray-400 p-1"
                />
                <div className="p-5 flex flex-row justify-between w-full">
                  <div>
                    <p className="text-2xl font-semibold text-gray-800">
                      Can&apos;t find a profile for your practice?
                    </p>
                    <h4 className="text-sm font-semibold text-gray-600">
                      we might not have a profile for you yet. The good news -
                      you can create a profile for free!
                    </h4>
                  </div>
                  <div>
                    <Link to={"/dashboard?tab=providers"}>
                      <Button>Create Profile</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="flex flex-col border border-slate-200 bg-white p-2 rounded-md">
            <div className="flex flex-row w-full justify-between border-b mb-4">
              <h1 className="p-3 font-semibold text-xl text-gray">
                {bookings && bookings.length === 0 ? "No Bookings" : "Your Recent Bookings"}
              </h1>
              <button className="p-3 text-sm font-bold text-gray hover:text-gray-500 transition-all duration-200 ease-in-out">
                <Link to={"/dashboard?tag=Bookings"}>View All</Link>
              </button>
            </div>

            {bookings && bookings.length > 0 ? (
              <>
                <Table hoverable className="w-ful l">
                  <Table.Head>
                    <Table.HeadCell>Provider Name</Table.HeadCell>
                    <Table.HeadCell>Services</Table.HeadCell>
                    <Table.HeadCell>Scheduled Time</Table.HeadCell>
                    <Table.HeadCell>Session Type</Table.HeadCell>
                    <Table.HeadCell>Note</Table.HeadCell>
                    <Table.HeadCell>Status</Table.HeadCell>
                    <Table.HeadCell>Process</Table.HeadCell>
                    {/* <Table.HeadCell>Edit</Table.HeadCell> */}
                  </Table.Head>
                  {bookings.slice(0, 3).map((bookingDetails) => (
                    <Table.Body className="divide-y" key={bookingDetails._id}>
                      <Table.Row className="text-gray-600">
                        <Table.Cell>
                          {bookingDetails.providerDetails.fullName}
                        </Table.Cell>
                        <Table.Cell>
                          {bookingDetails.service.join(", ")}
                        </Table.Cell>
                        <Table.Cell>
                          {new Date(
                            bookingDetails.scheduledTime
                          ).toLocaleDateString()}
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
                        <Table.Cell>{bookingDetails.status}</Table.Cell>
                        {/* <Table.Cell>
                      <Button>EDIT</Button>
                    </Table.Cell> */}
                      </Table.Row>
                    </Table.Body>
                  ))}
                </Table>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
