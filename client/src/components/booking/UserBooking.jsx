import { Table } from "flowbite-react";
import { useSelector } from "react-redux";
import { MdOutlineAccessTime } from "react-icons/md";
import { FcOk } from "react-icons/fc";
import { FcCancel } from "react-icons/fc";
import { BeatLoader } from "react-spinners";
import SearchBar from "../SearchBar";

export default function UserBooking() {
  const { bookings } = useSelector((state) => state.booking);
  const { isUserBookingFetched } = useSelector((state) => state.booking);
  console.log("isUserBookingFetched:", isUserBookingFetched);
  const { loading } = useSelector((state) => state.booking);

  return (
    <>
      <div
        className={`table-auto md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 max-h-screen ${
          bookings && bookings.length > 0
            ? "overflow-x-scroll md:overflow-x-auto"
            : ""
        }`}
      >
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "70vh",
            }}
          >
            <BeatLoader color="#10ebd8" loading={loading} size={15} />
          </div>
        ) : bookings && bookings.length > 0 ? (
          <>
            <h1 className="px-2 text-2xl text-gray font-bold mb-4">
              Your Bookings :
            </h1>
            <Table hoverable className="shadow-md w-full">
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
                      "border-l-4 border-amber-300 bg-amber-50 hover:bg-amber-100"
                    } ${
                      bookingDetails.status === "approved" &&
                      "border-l-4 border-emerald-400 bg-emerald-50 hover:bg-emerald-100"
                    }  ${
                      bookingDetails.status === "rejected" &&
                      "border-l-4 border-red-500 bg-red-50 hover:bg-red-100"
                    }`}
                  >
                    <Table.Cell>
                      {bookingDetails.providerDetails.fullName}
                    </Table.Cell>
                    <Table.Cell>{bookingDetails.service.join(", ")}</Table.Cell>
                    <Table.Cell>
                      {new Date(
                        bookingDetails.scheduledTime.date
                      ).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>{bookingDetails.scheduledTime.slot}</Table.Cell>
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
          </>
        ) : (
          <div>
            <h1 className="text-2xl text-gray font-bold mb-5 max-h-screen">
              No Bookings Yet
            </h1>
            <div className="flex flex-col mx-auto items-center">
              <SearchBar />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
