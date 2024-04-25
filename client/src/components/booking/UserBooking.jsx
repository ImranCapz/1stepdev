import { Table } from "flowbite-react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

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
        {booking && (
          <>
            <Table hoverable className="shadow-md w-full">
              <Table.Head>
                <Table.HeadCell>What Provider</Table.HeadCell>
                <Table.HeadCell>Services</Table.HeadCell>
                <Table.HeadCell>ScheduledTime</Table.HeadCell>
                <Table.HeadCell>SessionType</Table.HeadCell>
                <Table.HeadCell>Note</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
              </Table.Head>
              {booking.map((bookingDetails) => (
                <Table.Body className="divide-y" key={bookingDetails._id}>
                  <Table.Row className="bg-white">
                  <Table.Cell>{bookingDetails.providerDetails.fullName}</Table.Cell>
                  <Table.Cell>{bookingDetails.service.join(", ")}</Table.Cell>
                  <Table.Cell>
                    {new Date(
                      bookingDetails.scheduledTime
                    ).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>{bookingDetails.sessionType}</Table.Cell>
                  <Table.Cell>{bookingDetails.note}</Table.Cell>
                  <Table.Cell>{bookingDetails.status}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
            </Table>
          </>
        )}
      </div>
    </>
  );
}
