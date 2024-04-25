import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function ProviderBooking() {
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
      <div className="">
        <div className="">
          {booking.map((bookingDetails, index) => {
            return (
              <div key={index}>
                <h4>Booking ID: {bookingDetails._id}</h4>
                <p>Patient ID: {bookingDetails.patient}</p>
                <p>Provider ID: {bookingDetails.provider}</p>
                <p>
                  Booking Date:{" "}
                  {new Date(bookingDetails.scheduledTime).toLocaleDateString()}
                </p>
                <p>Services: {bookingDetails.service.join(", ")}</p>
                <p>Session Type: {bookingDetails.sessionType}</p>
                <p>Status: {bookingDetails.status}</p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
