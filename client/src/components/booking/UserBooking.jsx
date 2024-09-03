import { Table } from "flowbite-react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { MdOutlineAccessTime } from "react-icons/md";
import { FcOk } from "react-icons/fc";
import { FcCancel } from "react-icons/fc";
import { useDispatch } from "react-redux";
import {
  getBookingsStart,
  getBookingSuccess,
  getBookingFailure,
} from "../../redux/booking/bookingSlice";
import { BeatLoader } from "react-spinners";
import SearchBar from "../SearchBar";

export default function UserBooking() {
  const [booking, setBooking] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const { loading } = useSelector((state) => state.booking);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchBooking = async () => {
      const url = `/server/booking/getuserbookings/${currentUser._id}`;
      console.log("Fetching bookings from URL:", url);
      try {
        dispatch(getBookingsStart());
        const response = await fetch(url);
        console.log("Response status:", response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        dispatch(getBookingSuccess(data));
        console.log("Booking data:", data);
        const sortedBookings = data
          .map((obj) => ({ ...obj }))
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        setBooking(sortedBookings);
      } catch (error) {
        dispatch(getBookingFailure(error));
        console.error(
          "An error occurred while fetching booking details:",
          error
        );
      }
    };

    fetchBooking();
  }, [currentUser._id, dispatch]);

  return (
    <>
      <div
        className={`table-auto md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 max-h-screen ${
          booking && booking.length > 0
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
        ) : booking && booking.length > 0 ? (
          <>
            <h1 className="px-2 text-2xl text-gray font-bold mb-4">
              Your Bookings :
            </h1>
            <Table hoverable className="shadow-md w-full">
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
              {booking.map((bookingDetails) => (
                <Table.Body className="divide-y" key={bookingDetails._id}>
                  <Table.Row className="bg-white text-gray-600">
                    <Table.Cell>
                      {bookingDetails.providerDetails.fullName}
                    </Table.Cell>
                    <Table.Cell>{bookingDetails.service.join(", ")}</Table.Cell>
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
