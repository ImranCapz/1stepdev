import { Table } from "flowbite-react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { MdOutlineAccessTime } from "react-icons/md";
import { FcOk } from "react-icons/fc";
import { FcApproval } from "react-icons/fc";
import { FcCancel } from "react-icons/fc";
import { Button } from "@material-tailwind/react";


export default function UserBooking() {
  const [booking, setBooking] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchBooking = async () => {
      const url = `/server/booking/getuserbookings/${currentUser._id}`;
      console.log("Fetching bookings from URL:", url);
      try {
        const response = await fetch(url);
        console.log("Response status:", response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Booking data:", data);
        setBooking(data);
      } catch (error) {
        console.error(
          "An error occurred while fetching booking details:",
          error
        );
      }
    };

    fetchBooking();
  }, [currentUser._id]);

  return (
    <>
      <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300">
        {booking && booking.length > 0 ? (
          <>
            <h1 className="text-2xl text-gray font-bold mb-5">Your Bookings :</h1>
            <Table hoverable className="shadow-md w-full">
              <Table.Head>
                <Table.HeadCell>Provider Name</Table.HeadCell>
                <Table.HeadCell>Services</Table.HeadCell>
                <Table.HeadCell>Scheduled Time</Table.HeadCell>
                <Table.HeadCell>Session Type</Table.HeadCell>
                <Table.HeadCell>Note</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                {/* <Table.HeadCell>Edit</Table.HeadCell> */}
              </Table.Head>
              {booking.map((bookingDetails) => (
                <Table.Body className="divide-y" key={bookingDetails._id}>
                  <Table.Row className="bg-white text-gray-600">
                  <Table.Cell>{bookingDetails.providerDetails.fullName}</Table.Cell>
                  <Table.Cell>{bookingDetails.service.join(", ")}</Table.Cell>
                  <Table.Cell>
                    {new Date(
                      bookingDetails.scheduledTime
                    ).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>{bookingDetails.sessionType}</Table.Cell>
                  <Table.Cell>{bookingDetails.note}</Table.Cell>
                  <Table.Cell className=
                  "flex justify-center items-center">
                    {bookingDetails.status === "pending" ? <p><MdOutlineAccessTime/></p> : ''}
                    {bookingDetails.status === "approved" ? <p><FcOk/></p> : ''}
                    {bookingDetails.status === "rejected" ? <p><FcCancel /></p> : ''}
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
          <h1 className="text-2xl text-gray font-bold mb-5">No Bookings Yet</h1>
        )}
      </div>
    </>
  );
}
