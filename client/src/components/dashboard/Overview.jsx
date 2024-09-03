import { useSelector } from "react-redux";
import profileImage from "../../pages/providerscreen/createprovider.png";
import { Button, Table } from "flowbite-react";
import { Link } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { FcCancel, FcOk } from "react-icons/fc";
import { MdOutlineAccessTime } from "react-icons/md";

export default function Overview() {
  const { currentUser } = useSelector((state) => state.user);
  const { bookings } = useSelector((state) => state.booking);
  return (
    <div className="flex bg-slate-100 justify-center">
      <div className="p-4 flex flex-row gap-4">
        <div className="flex flex-col gap-2">
          <div className="border border-slate-200 rounded-md bg-white">
            <div className="relative flex flex-col items-center">
              <Link to={"/dashboard?tab=profile"}>
                <CiEdit className="size-6 right-3 top-3 absolute cursor-pointer text-gray hover:text-slate-400 transition-all duration-200 ease-in" />
              </Link>
              <div className="p-10 flex flex-col items-center">
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
          <div className="border border-slate-200 rounded-md bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            <div className="p-4 flex flex-col items-start">
              <h1 className="text-white">Become A 1Step Pro</h1>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex border border-slate-200 bg-white p-1 rounded-md">
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
                  can create a profile for free!
                </h4>
              </div>
              <Link to={"/dashboard?tab=providers"}>
                <Button>Create Profile</Button>
              </Link>
            </div>
          </div>
          <div className="flex border border-slate-200 bg-white p-2 rounded-md">
            {bookings && bookings.length > 0 ? (
              <>
                <Table hoverable className="w-full">
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
                  {bookings.map((bookingDetails) => (
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
