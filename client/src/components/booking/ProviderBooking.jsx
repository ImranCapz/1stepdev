import { Button } from "@material-tailwind/react";
import { Table } from "flowbite-react";
import { useState, useEffect } from "react";
import { FcCancel, FcOk } from "react-icons/fc";
import { MdOutlineAccessTime } from "react-icons/md";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  approveBooking,
  rejectBooking,
  getProviderBookingStart,
  getProviderBookingSuccess,
  getProviderBookingFailure,
  setTotalProviderBooksCount,
} from "../../redux/booking/bookingSlice";
import toast from "react-hot-toast";
import { Pagination } from "flowbite-react";
import { MoonLoader } from "react-spinners";

export default function ProviderBooking() {
  const { providerBooking, loading } = useSelector((state) => state.booking);
  const { currentProvider } = useSelector((state) => state.provider);
  const { totalProviderBooksCount } = useSelector((state) => state.booking);
  const [paginationAppointment, setPaginationAppointment] =
    useState(providerBooking);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataLoading, setDataLoading] = useState(false);
  const appointmentPerPage = 8;
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProviderBooking = async () => {
      if (!currentProvider) {
        return;
      }
      try {
        setDataLoading(true);
        dispatch(getProviderBookingStart());
        const res = await fetch(
          `/server/booking/getbookings/${currentProvider._id}`
        );
        const data = await res.json();
        if (data.success === false) {
          return;
        }
        console.log(data);
        const sortedData = data.bookingDetails.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        console.log(sortedData);
        dispatch(getProviderBookingSuccess(sortedData));
        dispatch(setTotalProviderBooksCount(data.providerCount));
        setDataLoading(false);
      } catch (error) {
        console.log(error);
        dispatch(getProviderBookingFailure(error));
        setDataLoading(false);
      }
    };
    fetchProviderBooking();
  }, [currentProvider, dispatch]);

  const onPageChange = async (page) => {
    try {
      setDataLoading(true);
      setCurrentPage(page);
      const startIndex = (page - 1) * appointmentPerPage;
      const res = await fetch(
        `/server/booking/getbookings/${currentProvider._id}?limit=${appointmentPerPage}&startIndex=${startIndex}`
      );
      const data = await res.json();
      setPaginationAppointment(data.bookingDetails);
      setDataLoading(false);
    } catch (error) {
      setDataLoading(false);
      console.error("An error occurred while fetching booking details:", error);
    }
  };

  const handleApprove = async (bookingId, patientName) => {
    if (!currentProvider) {
      return;
    }
    dispatch(approveBooking(bookingId)).then(async () => {
      toast.error(`${patientName} Appointment Rejected`, {
        position: "bottom-left",
      });
      setPaginationAppointment((prev) =>
        prev.map((booking) => {
          if (bookingId === booking._id) {
            return {
              ...booking,
              status: "approved",
            };
          }
          return booking;
        })
      );
      //
      // const booking = providerBooking.find(
      //   (booking) => booking._id === bookingId
      // );

      // const res = await fetch("/server/booking/emailbookingAccept", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     email: booking.patientDetails.email,
      //     subject: "1Step Appointment Approved",
      //     providerName: currentProvider.fullName,
      //     service: booking.service.join(", "),
      //     name: currentUser.username,
      //     providerProfile: currentProvider.profilePicture,
      //     slot: booking.scheduledTime.slot,
      //     date: booking.scheduledTime.date,
      //   }),
      // });
      // const data = await res.json();
      // if (data.success === false) {
      //   console.log("Email not sent");
      //   return;
      // }
      // if (data.success === true) {
      //   console.log("Email sent");
      // }
    });
  };

  const handleReject = async (bookingId, patientName) => {
    dispatch(rejectBooking(bookingId)).then(() => {
      toast.error(`${patientName} Appointment Rejected`, {
        position: "bottom-left",
      });
    });
    setPaginationAppointment((prev) =>
      prev.map((booking) => {
        if (bookingId === booking._id) {
          return {
            ...booking,
            status: "rejected",
          };
        }
        return booking;
      })
    );
  };

  return (
    <>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "70vh",
          }}
        >
          <MoonLoader color="#10ebd8" loading={loading} size={50} />
        </div>
      ) : (
        <>
          {" "}
          <div
            className={`table-auto md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 ${
              paginationAppointment && paginationAppointment.length > 0
                ? "overflow-x-scroll md:overflow-x-scroll"
                : ""
            }`}
          >
            {paginationAppointment && paginationAppointment.length > 0 ? (
              <>
                <h1 className="text-2xl text-gray font-bold mb-5">
                  Your Appointments :
                </h1>
                {!dataLoading ? (
                  <div className="mb-16 md:mb-0">
                    <Table
                      hoverable
                      className="shadow-md w-full max-h-full overflow-y-auto"
                    >
                      <Table.Head>
                        <Table.HeadCell>Patient Name</Table.HeadCell>
                        <Table.HeadCell>Services they Need</Table.HeadCell>
                        <Table.HeadCell>Scheduled Time</Table.HeadCell>
                        <Table.HeadCell>Session Type</Table.HeadCell>
                        <Table.HeadCell>Note</Table.HeadCell>
                        <Table.HeadCell>Status</Table.HeadCell>
                        <Table.HeadCell>Action</Table.HeadCell>
                        {/* <Table.HeadCell>Edit</Table.HeadCell> */}
                      </Table.Head>
                      {paginationAppointment.map((bookingDetails) => (
                        <Table.Body
                          className="divide-y"
                          key={bookingDetails._id}
                        >
                          <Table.Row className="bg-white text-gray-600">
                            <Table.Cell>
                              {bookingDetails.patientDetails.username}
                            </Table.Cell>
                            <Table.Cell>
                              {bookingDetails.service.join(", ")}
                            </Table.Cell>
                            <Table.Cell>
                              {new Date(
                                bookingDetails.scheduledTime.date
                              ).toDateString()}
                              , {bookingDetails.scheduledTime.slot}
                            </Table.Cell>
                            <Table.Cell>
                              {bookingDetails.sessionType}
                            </Table.Cell>
                            <Table.Cell>{bookingDetails.note}</Table.Cell>
                            <Table.Cell>
                              {bookingDetails.status === "pending" ? (
                                <div className="flex justify-center items-center">
                                  <MdOutlineAccessTime />
                                </div>
                              ) : (
                                ""
                              )}
                              {bookingDetails.status === "approved" ? (
                                <div className="flex justify-center items-center">
                                  <FcOk />
                                </div>
                              ) : (
                                ""
                              )}
                              {bookingDetails.status === "rejected" ? (
                                <div className="flex justify-center items-center">
                                  <FcCancel />
                                </div>
                              ) : (
                                ""
                              )}
                            </Table.Cell>
                            <Table.Cell className="flex flex-row gap-2">
                              {bookingDetails.status === "approved" ? (
                                <>
                                  <Button className="bg-emerald-600" disabled>
                                    Accepted
                                  </Button>
                                  <Button
                                    className="bg-red-500"
                                    onClick={() =>
                                      handleReject(
                                        bookingDetails._id,
                                        bookingDetails.patientDetails.username
                                      )
                                    }
                                  >
                                    Reject
                                  </Button>
                                </>
                              ) : bookingDetails.status === "pending" ? (
                                <>
                                  <Button
                                    className="bg-emerald-600"
                                    onClick={() =>
                                      handleApprove(
                                        bookingDetails._id,
                                        bookingDetails.patientDetails.username
                                      )
                                    }
                                  >
                                    Accept
                                  </Button>
                                  <Button
                                    className="bg-red-500"
                                    onClick={() =>
                                      handleReject(
                                        bookingDetails._id,
                                        bookingDetails.patientDetails.username
                                      )
                                    }
                                  >
                                    Reject
                                  </Button>
                                </>
                              ) : (
                                bookingDetails.status === "rejected" && (
                                  <>
                                    <Button
                                      className="bg-emerald-600"
                                      onClick={() =>
                                        handleApprove(
                                          bookingDetails._id,
                                          bookingDetails.patientDetails.username
                                        )
                                      }
                                    >
                                      Accept Again
                                    </Button>
                                    <Button className="bg-red-500" disabled>
                                      Rejected
                                    </Button>
                                  </>
                                )
                              )}
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
                      totalPages={Math.ceil(
                        totalProviderBooksCount / appointmentPerPage
                      )}
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
                    <MoonLoader
                      color="#10ebd8"
                      loading={dataLoading}
                      size={50}
                    />
                  </div>
                )}
              </>
            ) : (
              <h1 className="text-2xl text-gray font-bold mb-5">
                No Appointment Yet
              </h1>
            )}
          </div>
        </>
      )}
    </>
  );
}
