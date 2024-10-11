import { Table } from "flowbite-react";
import { useSelector } from "react-redux";
import { MdOutlineAccessTime } from "react-icons/md";
import { FcOk } from "react-icons/fc";
import { FcCancel } from "react-icons/fc";
import { MoonLoader } from "react-spinners";
import SearchBar from "../SearchBar";
import { useState } from "react";
import { Pagination } from "flowbite-react";

export default function UserBooking() {
  const { bookings } = useSelector((state) => state.booking);
  const { totalUserBooksCount } = useSelector((state) => state.booking);
  const { currentUser } = useSelector((state) => state.user);
  const { loading } = useSelector((state) => state.booking);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationBookings, setPaginationBookings] = useState(bookings);
  const [dataLoading, setDataLoading] = useState(false);

  const bookingPerPage = 8;

  const onPageChange = async (page) => {
    try {
      setDataLoading(true);
      setCurrentPage(page);
      const startIndex = (page - 1) * bookingPerPage;
      const res = await fetch(
        `/server/booking/getuserbookings/${currentUser._id}?limit=${bookingPerPage}&startIndex=${startIndex}`
      );
      const data = await res.json();
      setPaginationBookings(data.userBookings);
      setDataLoading(false);
    } catch (error) {
      setDataLoading(false);
      console.error("An error occurred while fetching booking details:", error);
    }
  };

  return (
    <>
      <div
        className={`flex-1 table-auto md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 ${
          paginationBookings && paginationBookings.length > 0
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
            <MoonLoader color="#10ebd8" loading={dataLoading} size={50} />
          </div>
        ) : paginationBookings && paginationBookings.length > 0 ? (
          <>
            <h1 className="px-2 text-2xl text-gray font-bold mb-4">
              Your Bookings :
            </h1>
            {!dataLoading ? (
              <div className="mb-16 md:mb-0">
                <Table
                  hoverable
                  className="shadow-md w-full max-h-full overflow-y-auto"
                >
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
                  {paginationBookings.map((bookingDetails) => (
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
                <Pagination
                  className="mt-4"
                  totalPages={Math.ceil(totalUserBooksCount / bookingPerPage)}
                  currentPage={currentPage}
                  onPageChange={onPageChange}
                />
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "70vh",
                }}
              >
                <MoonLoader color="#10ebd8" loading={dataLoading} size={50} />
              </div>
            )}
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
