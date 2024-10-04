import { useEffect, useState, useRef, useMemo } from "react";
import PropTypes from "prop-types";
import { Button } from "@material-tailwind/react";
import { useSelector } from "react-redux";
import Select from "react-select";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaAngleLeft } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa";
import noslot from "../assets/noslot.png";

export default function BookingContact({ provider }) {
  const [booking, setBooking] = useState();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [selectedDays, setSelectedDays] = useState("");
  const [selectedDate, setSeletedDate] = useState("");
  const [nameOption, setNameOption] = useState("you");
  const [formData, setFormData] = useState({
    patientName: "",
    scheduledTime: {
      slot: "",
      date: "",
    },
    email: "",
    note: "",
    service: "",
    sessionType: "",
    status: "pending",
  });

  const scrollRef = useRef(null);
  console.log(formData);
  
  const formattedDate = (date) => {
    const options = {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    return date.toLocaleString("en-IN", options);
  };

  useEffect(() => {
    const fetchbooking = async () => {
      try {
        const res = await fetch(`/server/user/${provider.userRef}`);
        const data = await res.json();
        setBooking(data);
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
    if (!formData.scheduledTime.slot) {
      toast.error("Please select a slot");
      return;
    }
    if (
      !formData.service ||
      formData.patientName === "" ||
      formData.email === "" ||
      formData.note === "" ||
      formData.sessionType === ""
    ) {
      toast.error("Please fill all the fields");
      return;
    }
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

  const handleSlotClick = (slot) => {
    setFormData((prevState) => ({
      ...prevState,
      scheduledTime: {
        slot: slot,
        date: formattedDate(selectedDate),
      },
    }));
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

  const getDayName = (date) => {
    return date.toLocaleString("en-US", { weekday: "long" });
  };

  useEffect(() => {
    const today = new Date();
    const dayofWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const currentDay = dayofWeek[today.getDay()];

    setSelectedDays(currentDay);
    const formatdate = formattedDate(today);
    setSeletedDate(formatdate);
  }, []);

  const morningTime = ["7:00 AM", "11:59 AM"];
  const afternoonTime = ["12:00 PM", "03:59 PM"];
  const eveningTime = ["04:00 PM", "11:59 PM"];

  const handleDayClick = (dayName, formattedDate) => {
    setSelectedDays(dayName);
    setSeletedDate(formattedDate);
  };

  const convertTo24Hour = (time) => {
    const [hours, minutes] = time.split(":");
    const period = time.slice(-2);
    let hours24 = parseInt(hours, 10);
    if (period === "PM" && hours24 < 12) hours24 += 12;
    if (period === "AM" && hours24 === 12) hours24 = 0;
    return `${String(hours24).padStart(2, 0)}:${minutes.slice(0, 2)}`;
  };

  const getfilteredSlots = (slots, start, end, selectDate) => {
    if (!slots) return { filterdSlots: [], availableCount: 0 };
    const start24 = convertTo24Hour(start);
    const end24 = convertTo24Hour(end);
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, 0)}:${now
      .getMinutes()
      .toString()
      .padStart(2, 0)}`;

    let availableCount = 0;

    const filteredSlots = slots.filter((slot) => {
      const slot24 = convertTo24Hour(slot);
      const slotDate = new Date(selectDate);

      //booked slots
      const currentDay = new Date();
      const bookedSlots = `${selectDate}-${slot}`;
      const isBooked =
        provider.bookedSlots && bookedSlots in provider.bookedSlots;

      if (slotDate.toLocaleDateString() === currentDay.toLocaleDateString()) {
        const isAvailable =
          slot24 >= start24 &&
          slot24 <= end24 &&
          slot24 > currentTime &&
          !isBooked;
        if (isAvailable) availableCount++;
        return slot24 >= start24 && slot24 <= end24 && slot24 > currentTime;
      }
      const isAvailable = slot24 >= start24 && slot24 <= end24 && !isBooked;
      if (isAvailable) availableCount++;
      return slot24 >= start24 && slot24 <= end24;
    });
    return { filteredSlots, availableCount };
  };

  //count slots for day
  const countSlotsForDay = (dayName, formattedDate) => {
    const morningSlots = getfilteredSlots(
      provider.timeSlots[dayName],
      morningTime[0],
      morningTime[1],
      formattedDate
    );
    const afternoonSlots = getfilteredSlots(
      provider.timeSlots[dayName],
      afternoonTime[0],
      afternoonTime[1],
      formattedDate
    );
    const eveningSlots = getfilteredSlots(
      provider.timeSlots[dayName],
      eveningTime[0],
      eveningTime[1],
      formattedDate
    );

    return (
      morningSlots.availableCount +
      afternoonSlots.availableCount +
      eveningSlots.availableCount
    );
  };

  const todayName = formattedDate(new Date());
  const tomorrowName = formattedDate(
    new Date(new Date().setDate(new Date().getDate() + 1))
  );

  const getNext10Days = () => {
    const day = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      day.push({
        dayName: getDayName(date),
        formattedDate: formattedDate(date),
      });
    }
    return day;
  };

  const next10Days = getNext10Days();

  const scrollLeft = () => {
    if (scrollRef.current) {
      const scrollValue = window.innerWidth > 768 ? 426 : 359;
      scrollRef.current.scrollBy({
        left: -scrollValue,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      const scrollValue = window.innerWidth > 768 ? 426 : 359;
      scrollRef.current.scrollBy({
        left: scrollValue,
        behavior: "smooth",
      });
    }
  };

  const isBooked = (formattedDate, slot) => {
    if (!provider.bookedSlot || !Array.isArray(provider.bookedSlot))
      return false;

    const isSlotBooked = provider.bookedSlot.some((bookedSlot) => {
      const { date, slot: bookedSlotTime } = bookedSlot.bookedSlots;
      if (date === formattedDate && bookedSlotTime === slot) {
        console.log(`Slot booked for date: ${formattedDate} and slot: ${slot}`);
        return true;
      }
      return false;
    });

    return isSlotBooked;
  };

  const memoizedIsBooked = useMemo(() => {
    const cache = {};
    return (formattedDate, slot) => {
      const key = `${formattedDate}-${slot}`;
      if (cache[key] !== undefined) {
        return cache[key];
      }
      const result = isBooked(formattedDate, slot);
      cache[key] = result;
      return result;
    };
  }, [provider.bookedSlot]);

  return (
    <>
      {booking && (
        <div className="flex flex-col gap-4 mt-4">
          <form>
            <div className="relative">
              <button
                type="button"
                className="absolute left-0 top-1/3 ml-1 text-purple-500 text-xl"
                onClick={scrollLeft}
              >
                <FaAngleLeft />
              </button>
              <div
                ref={scrollRef}
                className="flex flex-row border bg-white px-2 md:px-2 2xl:px-7 gap-2 md:gap-8 border-slate-300 overflow-x-auto md:overflow-hidden justify-between"
              >
                {next10Days.map((day, index) => {
                  const totalCount = countSlotsForDay(
                    day.dayName,
                    day.formattedDate
                  );
                  return (
                    <button
                      type="button"
                      className={`p-2 rounded-t-lg font-semibold text-sm text-gray-500 transition duration-300 ease-in-out ${
                        selectedDate === day.formattedDate
                          ? "border-b-2 border-purple-500 text-gray-700"
                          : "text-gray-500"
                      }`}
                      key={index}
                      onClick={() =>
                        handleDayClick(day.dayName, day.formattedDate)
                      }
                    >
                      <div className="w-24 whitespace-nowarp">
                        {day.formattedDate === todayName ? (
                          <>
                            <p>Today</p>
                            {totalCount > 0 ? (
                              <p className="text-[11px] text-green-500 whitespace-nowrap">
                                {totalCount} Slots
                              </p>
                            ) : (
                              <p className="text-[11px] text-slate-500">
                                No Slots Available
                              </p>
                            )}
                          </>
                        ) : day.formattedDate === tomorrowName ? (
                          <div className="w-24 whitespace-nowarp">
                            <p>Tomorrow</p>
                            {totalCount > 0 ? (
                              <p className="text-[11px] text-green-500">
                                {totalCount} Slots
                              </p>
                            ) : (
                              <p className="text-[11px] text-slate-500">
                                No Slots Available
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="w-24 whitespace-nowarp">
                            <p>{day.formattedDate.slice(0, 11)}</p>
                            {totalCount > 0 ? (
                              <p className="text-[11px] text-green-500">
                                {totalCount} Slots
                              </p>
                            ) : (
                              <p className="text-[11px] text-gray-500">
                                No Slots Available
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={scrollRight}
                className="absolute right-0 top-1/3 mr-1 text-purple-500 text-xl"
              >
                <FaAngleRight />
              </button>
            </div>

            {selectedDays && (
              <div className="px-4 h-48 overflow-auto">
                {(() => {
                  const morningSlots = getfilteredSlots(
                    provider.timeSlots[selectedDays],
                    morningTime[0],
                    morningTime[1],
                    selectedDate
                  );
                  const afternoonSlots = getfilteredSlots(
                    provider.timeSlots[selectedDays],
                    afternoonTime[0],
                    afternoonTime[1],
                    selectedDate
                  );
                  const eveningSlots = getfilteredSlots(
                    provider.timeSlots[selectedDays],
                    eveningTime[0],
                    eveningTime[1],
                    selectedDate
                  );
                  if (
                    morningSlots.availableCount === 0 &&
                    afternoonSlots.availableCount === 0 &&
                    eveningSlots.availableCount === 0
                  ) {
                    return (
                      <>
                        <div className="flex flex-col items-center justify-center mx-auto mt-4">
                          <img
                            src={noslot}
                            className="w-20 h-20 object cover"
                          />
                          <p className="flex flex-col items-center text-gray-500">
                            There are no slots available.
                          </p>{" "}
                          <button
                            type="button"
                            className="card-btn mt-2 p-2.5 rounded-md font-semibold"
                          >
                            Message Now for Quick Response
                          </button>
                        </div>
                      </>
                    );
                  }
                  return (
                    <>
                      {morningSlots.filteredSlots.length > 0 && (
                        <div>
                          <h1 className="mt-2 text-gray text-sm font-medium mb-2">
                            Morning Slots{" "}
                            <span className="text-slate-500 text-xs">
                              ({morningSlots.availableCount} slots)
                            </span>
                          </h1>
                          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                            {morningSlots.filteredSlots.map((slot, index) => (
                              <button
                                type="button"
                                className={`py-2 text-xs rounded-md text-primary-60  duration-100
                      ${
                        formData.scheduledTime.slot === slot
                          ? "border bg-primary-70 text-white border-purple-200"
                          : isBooked(selectedDate, slot)
                          ? "border-2 bg-primary-80 text-white"
                          : "border-2 border-primary-50  hover:bg-primary-50"
                      }`}
                                key={index}
                                onClick={() => handleSlotClick(slot)}
                                disabled={memoizedIsBooked(selectedDate, slot)}
                              >
                                {memoizedIsBooked(selectedDate, slot)
                                  ? "Booked"
                                  : slot}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      {afternoonSlots.filteredSlots.length > 0 && (
                        <div>
                          <h1 className="mt-2 text-gray text-sm font-medium mb-2">
                            Afternoon Slots{" "}
                            <span className="text-slate-500 text-xs">
                              ({afternoonSlots.availableCount} slots)
                            </span>
                          </h1>
                          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                            {afternoonSlots.filteredSlots.map((slot, index) => (
                              <button
                                type="button"
                                className={`py-2 text-xs rounded-md text-primary-60  duration-100
                      ${
                        formData.scheduledTime.slot === slot
                          ? "border bg-primary-70 text-white border-purple-200"
                          : isBooked(selectedDate, slot)
                          ? "border-2 bg-primary-80 text-white"
                          : "border-2 border-primary-50  hover:bg-primary-50"
                      }`}
                                key={index}
                                onClick={() => handleSlotClick(slot)}
                                disabled={memoizedIsBooked(selectedDate, slot)}
                              >
                                {memoizedIsBooked(selectedDate, slot)
                                  ? "Booked"
                                  : slot}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      {eveningSlots.filteredSlots.length > 0 && (
                        <div>
                          <h1 className="mt-2 text-gray text-sm font-medium mb-2">
                            Evening Slots{" "}
                            <span className="text-slate-500 text-xs">
                              ({eveningSlots.availableCount} slots)
                            </span>
                          </h1>
                          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                            {eveningSlots.filteredSlots.map((slot, index) => (
                              <button
                                type="button"
                                className={`py-2 text-xs rounded-md text-primary-60  duration-100
                      ${
                        formData.scheduledTime.slot === slot
                          ? "border bg-primary-70 text-white border-purple-200"
                          : isBooked(selectedDate, slot)
                          ? "border-2 bg-primary-80 text-white"
                          : "border-2 border-primary-50  hover:bg-primary-50"
                      }`}
                                key={index}
                                onClick={() => handleSlotClick(slot)}
                                disabled={memoizedIsBooked(selectedDate, slot)}
                              >
                                {memoizedIsBooked(selectedDate, slot)
                                  ? "Booked"
                                  : slot}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}
            <div className="flex flex-row justify-center gap-1 items-center mt-4">
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
            <div className="px-4">
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
                className="border-2 p-0.5 rounded-lg bg-white focus:border-amber-700  hover:border-amber-500"
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
                  className="w-full border-2 p-0.5 rounded-lg bg-white focus:border-amber-700  hover:border-amber-500"
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
            </div>
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
    timeSlots: PropTypes.object.isRequired,
    therapytype: PropTypes.arrayOf(PropTypes.string).isRequired,
    bookedSlot: PropTypes.array,
  }).isRequired,
};
