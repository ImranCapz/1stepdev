import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button } from "@material-tailwind/react";
import { useSelector } from "react-redux";
import Select from "react-select";
import toast from "react-hot-toast";

export default function BookingContact({ provider }) {
  const [booking, setBooking] = useState();
  const [success, setSuccess] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    patientName: "",
    scheduledTime: "",
    email: "",
    note: "",
    service: "",
    sessionType: "",
    status: "pending",
  });
  console.log(formData);

  useEffect(() => {
    const fetchbooking = async () => {
      try {
        
        const res = await fetch(`/server/user/${provider.userRef}`);
        const data = await res.json();
        setBooking(data);
        setFormData((preState) => ({
          ...preState,
          email: currentUser.email,
          patientName: currentUser.fullName,
        }));
      } catch (error) {
        console.log(error);
      }
    };
    fetchbooking();
  }, [provider.userRef, currentUser.email, currentUser.fullName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSuccess(false); 
      const { patientName, email, ...rest } = formData;
      const res = await fetch("/server/booking/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...rest,
          patient: currentUser._id,
          provider: provider._id,
        }),
      });
      const data = await res.json();
      if (data.success === false) {
        console.log("Booking failed");
      }
      if (data.success === true) {
        setSuccess(true);
        toast.success("Booking successful");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
      setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <>
      {booking && (
        <div className="flex flex-col gap-4 mt-4">
          <form onSubmit={handleSubmit}>
            <div className=""></div>
            <h2 className="text-gray-600 mt-2">Name* </h2>
            <input
              type="text"
              name="patientName"
              id="patientName"
              value={formData.patientName}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full p-3 border-2 border-transparent rounded-lg mb-1 focus:outline-none focus:shadow-inner focus:ring-0 focus:border-amber-500 hover:border-amber-500"
              required
            />
            <h2 className="text-gray-600 mt-2">
              How can we help your family?*{" "}
            </h2>
            <Select
              id="name"
              options={provider.name.map((name) => {
                return { value: name, label: name };
              })}
              isMulti
              required
              placeholder="What service do you need?"
              touchUi={false}
              className="border-2 p-2 rounded-lg bg-white focus:border-amber-700  hover:border-amber-500"
              onChange={(selectedOptions) => {
                setFormData((preState) => ({
                  ...preState,
                  service: selectedOptions.map((option) => option.value),
                }));
              }}
              styles={{
                control: (provided) => ({
                  ...provided,
                  backgroundColor: "transparent",
                  minWidth: "160px",
                  border: "none",
                  outline: "none",
                  boxShadow: "none",
                  transition: "all 0.3s ease",
                }),
              }}
            />
            <h2 className="text-gray-600 mt-2">Email* </h2>
            <input
              type="email"
              value={formData.email}
              name="email"
              id="email"
              onChange={handleChange}
              className="w-full p-3 border-2 border-transparent rounded-lg mb-1 focus:outline-none focus:shadow-inner focus:ring-0 focus:border-amber-500 hover:border-amber-500"
              required
            />
            <h2 className="text-gray-600 mt-2">Note* </h2>
            <textarea
              type="text"
              name="note"
              id="note"
              rows="2"
              onChange={handleChange}
              className="w-full border-2 p-3 rounded-lg mb-1 border-transparent focus:outline-none focus:ring-0 focus:ring-amber-500 focus:border-amber-500 hover:border-amber-500"
              placeholder="Enter you Message here..."
              required
            ></textarea>

            <h2 className="text-gray-600 mt-2">Scheduled* </h2>
            <div className="flex flex-row gap-2">
              <input
                type="datetime-local"
                name="scheduledTime"
                id="scheduledTime"
                onChange={handleChange}
                className="w-full border-2 p-3 rounded-lg border-transparent focus:outline-none focus:ring-0 focus:ring-amber-500 focus:border-amber-500 hover:border-amber-500"
                required
              />
              <select
                type="select"
                name="sessionType"
                id="sessionType"
                onChange={handleChange}
                required
                className="w-full border-2 p-3 rounded-lg border-transparent focus:outline-none focus:ring-0 focus:ring-amber-500 focus:border-amber-500 hover:border-amber-500"
              >
                <option value="">Select session type</option>
                <option value="in-person">In-Clinic</option>
                <option value="online">Virtual</option>
              </select>
            </div>
            <Button
            type="submit"
            className="w-full mt-4 blue-button h-14 text-slate-800 font-bold text-center p-3 uppercase rounded-lg hover:opacity-95"
          >
            Book a Slot
          </Button>
          </form>
        </div>
      )}
      {success && (
        <>
          <button
            className="select-none rounded-lg bg-gradient-to-tr from-gray-900 to-gray-800 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            data-ripple-light="true"
            data-dialog-target="animated-dialog"
          >
            Open Dialog
          </button>
          <div
            data-dialog-backdrop="animated-dialog"
            data-dialog-backdrop-close="true"
            className="pointer-events-none fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 opacity-0 backdrop-blur-sm transition-opacity duration-300"
          >
            <div
              data-dialog="animated-dialog"
              data-dialog-mount="opacity-100 translate-y-0 scale-100"
              data-dialog-unmount="opacity-0 -translate-y-28 scale-90 pointer-events-none"
              data-dialog-transition="transition-all duration-300"
              className="relative m-4 w-2/5 min-w-[40%] max-w-[40%] rounded-lg bg-white font-sans text-base font-light leading-relaxed text-blue-gray-500 antialiased shadow-2xl"
            >
              <div className="flex items-center p-4 font-sans text-2xl antialiased font-semibold leading-snug shrink-0 text-blue-gray-900">
                Its a simple dialog.
              </div>
              <div className="relative p-4 font-sans text-base antialiased font-light leading-relaxed border-t border-b border-t-blue-gray-100 border-b-blue-gray-100 text-blue-gray-500">
                The key to more success is to have a lot of pillows. Put it this
                way, it took me twenty five years to get these plants, twenty
                five years of blood sweat and tears, and I'm never giving up,
                I'm just getting started. I'm up to something. Fan luv.
              </div>
              <div className="flex flex-wrap items-center justify-end p-4 shrink-0 text-blue-gray-500">
                <button
                  data-ripple-dark="true"
                  data-dialog-close="true"
                  className="px-6 py-3 mr-1 font-sans text-xs font-bold text-red-500 uppercase transition-all rounded-lg middle none center hover:bg-red-500/10 active:bg-red-500/30 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                >
                  Cancel
                </button>
                <button
                  data-ripple-light="true"
                  data-dialog-close="true"
                  className="middle none center rounded-lg bg-gradient-to-tr from-green-600 to-green-400 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-green-500/20 transition-all hover:shadow-lg hover:shadow-green-500/40 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

BookingContact.propTypes = {
  provider: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.array.isRequired,
    userRef: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
  }).isRequired,
};
