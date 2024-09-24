import { Button } from "@material-tailwind/react";
import { Table } from "flowbite-react";
import { useState, useEffect, useCallback } from "react";
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
} from "../../redux/booking/bookingSlice";
import toast from "react-hot-toast";

export default function ProviderBooking() {
  const { providerBooking, loading } = useSelector((state) => state.booking);
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { currentProvider } = useSelector((state) => state.provider);
  console.log(providerBooking);
  useEffect(() => {
    const fetchProviderBooking = async () => {
      if (!currentProvider) {
        return;
      }
      try {
        dispatch(getProviderBookingStart());
        const res = await fetch(
          `/server/booking/getbookings/${currentProvider._id}`
        );
        const data = await res.json();
        if (data.success === false) {
          return;
        }
        console.log(data);
        const sortedData = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        console.log(sortedData);
        dispatch(getProviderBookingSuccess(sortedData));
      } catch (error) {
        console.log(error);
        dispatch(getProviderBookingFailure());
      }
    };
    fetchProviderBooking();
  }, [currentProvider, dispatch]);

  // const fetchBooking = useCallback(async (providerId) => {
  //   const res = await fetch(`/server/booking/getbookings/${providerId}`);
  //   const bookingData = await res.json();
  //   if (bookingData.success === false) {
  //     return;
  //   }
  //   const sortedBookings = bookingData.sort(
  //     (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  //   );
  //   setAppointment(sortedBookings);
  // }, []);

  const handleApprove = async (bookingId) => {
    dispatch(approveBooking(bookingId)).then(async () => {
      toast.success("Appointment Approved", {
        position: "bottom-left",
      });
      if (provider[0]) {
        fetchBooking(provider[0]._id);
      }

      const booking = appointment.find((booking) => booking._id === bookingId);

      const res = await fetch("/server/booking/emailbookingAccept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: booking.patientDetails.email,
          subject: "1Step Appointment Approved",
          providerName: provider[0].fullName,
          service: booking.service.join(", "),
          name: currentUser.username,
          providerProfile: provider[0].profilePicture,
          slot: booking.scheduledTime.slot,
          date: booking.scheduledTime.date,
        }),
      });
      const data = await res.json();
      if (data.success === false) {
        console.log("Email not sent");
        return;
      }
      if (data.success === true) {
        console.log("Email sent");
      }
    });
  };

  const handleReject = async (bookingId) => {
    dispatch(rejectBooking(bookingId)).then(() => {
      toast.error("Appointment Rejected", {
        position: "bottom-left",
      });
      if (provider[0]) {
        fetchBooking(provider[0]._id);
      }
    });
  };

  return (
    <>
      <div
        className={`table-auto md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 ${
          providerBooking ? "overflow-x-scroll" : ""
        }`}
      >
        {providerBooking && providerBooking.length > 0 ? (
          <>
            <h1 className="text-2xl text-gray font-bold mb-5">
              Your Appointments :
            </h1>
            <Table hoverable className="shadow-md w-full">
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
              {providerBooking.map((bookingDetails) => (
                <Table.Body className="divide-y" key={bookingDetails._id}>
                  <Table.Row className="bg-white text-gray-600">
                    <Table.Cell>
                      {bookingDetails.patientDetails.username}
                    </Table.Cell>
                    <Table.Cell>{bookingDetails.service.join(", ")}</Table.Cell>
                    <Table.Cell>{bookingDetails.scheduledTime.slot}</Table.Cell>
                    <Table.Cell>{bookingDetails.sessionType}</Table.Cell>
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
                          <Button
                            className="bg-emerald-600"
                            disabled={bookingDetails.status === "approved"}
                          >
                            Accepted
                          </Button>
                          <Button
                            className="bg-red-500"
                            onClick={() => handleReject(bookingDetails._id)}
                          >
                            Reject
                          </Button>
                        </>
                      ) : bookingDetails.status === "pending" ? (
                        <>
                          <Button
                            className="bg-emerald-600"
                            onClick={() => handleApprove(bookingDetails._id)}
                          >
                            Accept
                          </Button>
                          <Button
                            className="bg-red-500"
                            onClick={() => handleReject(bookingDetails._id)}
                            disabled={bookingDetails.status === "rejected"}
                          >
                            Reject
                          </Button>
                        </>
                      ) : bookingDetails.status === "rejected" ? (
                        <>
                          <Button
                            className="bg-emerald-600"
                            onClick={() => handleApprove(bookingDetails._id)}
                          >
                            Accepted
                          </Button>
                          <Button
                            className="bg-red-500"
                            onClick={() => handleReject(bookingDetails._id)}
                            disabled={bookingDetails.status === "rejected"}
                          >
                            Rejected
                          </Button>
                        </>
                      ) : (
                        ""
                      )}
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
          <h1 className="text-2xl text-gray font-bold mb-5">
            No Appointment Yet
          </h1>
        )}
      </div>
    </>
  );
}
