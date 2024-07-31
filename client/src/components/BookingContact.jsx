import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button } from "@material-tailwind/react";
import { useSelector } from "react-redux";
import Select from "react-select";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function BookingContact({ provider }) {
  const [booking, setBooking] = useState();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [nameOption, setNameOption] = useState("you");
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
        console.log(data);
        setFormData((preState) => ({
          ...preState,
          email: currentUser.email,
          patientName: currentUser.username,
        }));
      } catch (error) {
        console.log(error);
      }
    };
    fetchbooking();
  }, [provider.userRef, currentUser.email, currentUser.username]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/server/booking/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          patient: currentUser._id,
          provider: provider._id,
        }),
      });
      const data = await res.json();

      if (data.success === true) {
        return;
      }
      toast.success("Successfully Booked");
      navigate("/dashboard?tag=Bookings");
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleToggle = (e, option) => {
    e.preventDefault();
    setNameOption(option);
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hour = String(now.getHours()).padStart(2, "0");
    const minute = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hour}:${minute}`;
  };

  return (
    <>
      {booking && (
        <div className="flex flex-col gap-4 mt-4">
          <form>
            <div className="flex flex-row justify-center gap-1 items-center">
              <button
                onClick={(e) => handleToggle(e, "you")}
                className={`p-2 w-20 rounded-lg font-bold hover:text-slate-700 transition duration-300 ease-in-out  ${
                  nameOption === "you"
                    ? "p-3 bg-emerald-400 text-slate-700"
                    : "bg-slate-300 text-slate-500 hover:text-slate-700"
                }`}
              >
                You
              </button>
              <button
                onClick={(e) => handleToggle(e, "someone else")}
                className={`p-2 w-30 rounded-lg font-bold transition duration-300 ease-in-out ${
                  nameOption === "someone else"
                    ? "p-3 bg-emerald-400 text-slate-700"
                    : "bg-slate-300 text-slate-500 hover:text-slate-700"
                }`}
              >
                Someone Else
              </button>
            </div>
            {nameOption === "you" && (
              <>
                <h2 className="text-gray-600 mt-2">Name* </h2>
                <input
                  type="text"
                  name="patientName"
                  id="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="w-full border-2 border-transparent rounded-lg mb-1 focus:outline-none focus:shadow-inner focus:ring-0 focus:border-amber-500 hover:border-amber-500"
                  required
                />
              </>
            )}
            {nameOption === "someone else" && (
              <>
                <h2 className="text-gray-600 mt-2">Patient Name* </h2>
                <input
                  type="text"
                  name="patientName"
                  id="patientName"
                  onChange={handleChange}
                  placeholder="Someone else"
                  className="w-full border-2 border-transparent rounded-lg mb-1 focus:outline-none focus:shadow-inner focus:ring-0 focus:border-amber-500 hover:border-amber-500"
                  required
                />
              </>
            )}
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
              className="border-2 rounded-lg bg-white focus:border-amber-700  hover:border-amber-500"
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
              className="w-full border-2 border-transparent rounded-lg mb-1 focus:outline-none focus:shadow-inner focus:ring-0 focus:border-amber-500 hover:border-amber-500"
              required
            />
            <h2 className="text-gray-600 mt-2">Note* </h2>
            <textarea
              type="text"
              name="note"
              id="note"
              rows="2"
              onChange={handleChange}
              className="w-full border-2 rounded-lg mb-1 border-transparent focus:outline-none focus:ring-0 focus:ring-amber-500 focus:border-amber-500 hover:border-amber-500"
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
                min={getCurrentDateTime()}
                className="w-[130px] md:w-[170px] border-2 rounded-lg border-transparent focus:outline-none focus:ring-0 focus:ring-amber-500 focus:border-amber-500 hover:border-amber-500"
                required
              />

              <Select
                id="sessionType"
                options={provider.therapytype.map((name) => {
                  return {
                    value: name,
                    label: name,
                  };
                })}
                required
                placeholder="Session Type"
                touchUi={false}
                className="w-full border-2 rounded-lg bg-white focus:border-amber-700  hover:border-amber-500"
                onChange={(selectedOptions) => {
                  setFormData((prevState) => ({
                    ...prevState,
                    sessionType: Array.isArray(selectedOptions)
                      ? selectedOptions.map((option) => option.value)
                      : selectedOptions
                      ? selectedOptions.value
                      : [],
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
            </div>
            <Button
              type="submit"
              onClick={handleSubmit}
              className="w-full mt-4 blue-button h-14 text-slate-800 font-bold text-center p-3 uppercase rounded-lg hover:opacity-95"
            >
              Book a Slot
            </Button>
          </form>
        </div>
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
    therapytype: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};
