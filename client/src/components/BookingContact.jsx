import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default function BookingContact({ provider }) {
  const [booking, setBooking] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchbooking = async () => {
      try {
        const res = await fetch(`/server/user/${provider.userRef}`);
        const data = await res.json();
        setBooking(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchbooking();
  }, [provider.userRef]);

  const onChange = (e) => {
    setMessage(e.target.value);
  };
  return (
    <>
      {booking && (
        <div className="flex flex-col gap-4">
          <p>
            Contact <span className="font-semibold">{booking.username}</span>{" "}
            for{" "}
            <span className="font-semibold">{provider.name.toLowerCase()}</span>
          </p>
          <textarea
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={onChange}
            className="w-full border p-3 rounded-lg"
            placeholder="Enter you Message here..."
          ></textarea>
          <Link
            to={`mailto:${booking.email}?subject=Regarding ${provider.name}&body=${message}`}
            className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
}

BookingContact.propTypes = {
  provider: PropTypes.shape({
    userRef: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};
