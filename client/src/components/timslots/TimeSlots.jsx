import { Kbd, Modal } from "flowbite-react";
import PropTypes from "prop-types";
import { useState } from "react";
import toast from "react-hot-toast";
import { useMemo } from "react";

function TimeSlots({ data, setData, setModifiedSlot, timeSlotSaved }) {
  const [selectedDays, setSelectedDays] = useState("Monday");
  const [multiSelectedDays, setMultiSelectedDays] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [startTime2, setStartTime2] = useState("");
  const [endTime2, setEndTime2] = useState("");
  const [session, setSession] = useState(30);

  const { morningSlots, afternoonSlots, eveningSlots, nightSlots } =
    useMemo(() => {
      const morningSlots = [];
      const afternoonSlots = [];
      const eveningSlots = [];
      const nightSlots = [];
      for (let hours = 7; hours < 24; hours++) {
        for (let minute = 0; minute < 60; minute += session) {
          const period = hours < 12 ? "AM" : "PM";
          const hour12 = hours % 12 === 0 ? 12 : hours % 12;
          const time = `${String(hour12).padStart(2, "0")}:${String(
            minute
          ).padStart(2, "0")} ${period}`;
          if (hours < 12) {
            morningSlots.push(time);
          } else if (hours < 16) {
            afternoonSlots.push(time);
          } else if (hours < 20) {
            eveningSlots.push(time);
          } else {
            nightSlots.push(time);
          }
        }
      }
      return { morningSlots, afternoonSlots, eveningSlots, nightSlots };
    }, [session]);

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleSessionChange = (e) => {
    setSession(Number(e.target.value));
  };

  const handleDayClick = (day) => {
    setSelectedDays(day);
  };
  const handleAllDayClick = (day) => {
    if (multiSelectedDays.includes(day)) {
      setMultiSelectedDays(multiSelectedDays.filter((d) => d !== day));
    } else {
      setMultiSelectedDays([...multiSelectedDays, day]);
    }
  };

  const handleTimeSlotToggle = (day, time) => {
    const updateTimeSlot = data.timeSlots[day].includes(time)
      ? data.timeSlots[day].filter((slot) => slot !== time)
      : [...data.timeSlots[day], time];
    setData({
      ...data,
      timeSlots: { ...data.timeSlots, [day]: updateTimeSlot },
    });
    setModifiedSlot((prevState) => ({
      ...prevState,
      [day]: updateTimeSlot,
    }));
    timeSlotSaved(true);
  };

  //timevalidation

  const validateTime = (time) => {
    const [hour, minute] = time.split(":").map(Number);
    if (hour < 7 || hour > 23) {
      return toast.error("Please select a time between 7:00 AM to 11:45 PM");
    }
    const roundedMinute = minute < 30 ? "00" : "30";
    return `${String(hour).padStart(2, "0")}:${roundedMinute}`;
  };

  const convertToFormat = (time) => {
    const [partTime, modifier] = time.split(" ");
    let [hours, minutes] = partTime.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) {
      hours += 12;
    } else if (modifier === "AM" && hours === 12) {
      hours = 0;
    }
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}`;
  };

  const handleStartTimeChange = (e) => {
    const validatedTime = validateTime(e.target.value);
    if (validateTime) {
      setStartTime(validatedTime);
      if (endTime && validatedTime > endTime) {
        setEndTime("");
      }
    } else {
      toast.error("Please select a time between 7:00 AM and 11:00 PM");
    }
  };

  const handleEndTimeChange = (e) => {
    const validatedTime = validateTime(e.target.value);
    if (validatedTime >= startTime) {
      setEndTime(validatedTime);
    }
  };

  const handleStartTimeChange2 = (e) => {
    const validatedTime = validateTime(e.target.value);
    if (validateTime) {
      setStartTime2(validatedTime);
      if (endTime2 && validatedTime > endTime2) {
        setEndTime2("");
      }
    } else {
      toast.error("Please select a time between 7:00 AM and 11:00 PM");
    }
  };

  const handleEndTimeChange2 = (e) => {
    const validatedTime = validateTime(e.target.value);
    if (validatedTime >= startTime2) {
      setEndTime2(validatedTime);
    }
  };

  const FilterTimeSlot = (slots, startTime, endTime) => {
    const start = convertToFormat(startTime);
    const end = convertToFormat(endTime);

    return slots.filter((slots) => {
      const slot = convertToFormat(slots);
      return slot >= start && slot <= end;
    });
  };

  const handleTimeApply = () => {
    if (!startTime || !endTime) {
      toast.error("Please select start and end time");
      return;
    }
    if (multiSelectedDays.length === 0) {
      toast.error("Please select atleast one day");
      return;
    }
    const allSlots = [
      ...morningSlots,
      ...afternoonSlots,
      ...eveningSlots,
      ...nightSlots,
    ];
    const filteredSlots = FilterTimeSlot(allSlots, startTime, endTime);
    const filteredSlots2 = FilterTimeSlot(allSlots, startTime2, endTime2);
    setData((prevData) => {
      const updatedTimeSlots = { ...prevData.timeSlots };
      multiSelectedDays.forEach((day) => {
        updatedTimeSlots[day] = [
          ...(updatedTimeSlots[day] || []),
          ...filteredSlots,
          ...filteredSlots2,
        ];
      });
      return { ...prevData, timeSlots: updatedTimeSlots };
    });
    setModifiedSlot((prevState) => {
      const updatedTimeSlots = { ...prevState };
      multiSelectedDays.forEach((day) => {
        updatedTimeSlots[day] = [
          ...(updatedTimeSlots[day] || []),
          ...filteredSlots,
          ...filteredSlots2,
        ];
      });
      return { ...prevState, ...updatedTimeSlots };
    });
    setOpenTimeRangeModal(false);
    timeSlotSaved(true);
  };

  //modal for time range
  const [openTimeRangeModal, setOpenTimeRangeModal] = useState(false);

  function openModal() {
    setOpenTimeRangeModal(true);
    setMultiSelectedDays([selectedDays]);
  }

  return (
    <div>
      <div className="relative z-50">
        <Modal
          size={"md"}
          show={openTimeRangeModal}
          onClose={() => setOpenTimeRangeModal(false)}
          zindex={40}
        >
          <Modal.Header>
            Choose for {multiSelectedDays.join(", ")},
          </Modal.Header>
          <div className="p-4 z-50">
            <div className="flex flex-row items-center justify-center">
              {daysOfWeek.map((day) => (
                <button
                  type="button"
                  key={day}
                  className={`px-2 py-2 border-primary-60 font-semibold ${
                    multiSelectedDays.includes(day)
                      ? "text-primary-60 bg-primary-50 transition-all duration-300"
                      : "bg-slate-200 text-gray"
                  }`}
                  onClick={() => handleAllDayClick(day)}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
            <div className="p-4 flex gap-2 items-center mt-2 justify-center">
              <h1 className="text-base">Session 1 *</h1>
              <div className="flex flex-col">
                <label style={{ fontSize: "11px" }}>Start Time</label>
                <input
                  type="time"
                  id="startTime"
                  className="rounded-lg text-xs mt-1"
                  value={startTime}
                  onChange={handleStartTimeChange}
                />
              </div>
              <div className="flex flex-col">
                <label style={{ fontSize: "11px" }}>End Time</label>
                <input
                  type="time"
                  id="endTime"
                  className="rounded-lg text-xs mt-1"
                  value={endTime}
                  onChange={handleEndTimeChange}
                />
              </div>
            </div>
            <div className="p- flex gap-2 items-center justify-center">
              <h1 className="text-base">Session 2 &nbsp;</h1>
              <div className="flex flex-col">
                <label style={{ fontSize: "11px" }}>Start Time</label>
                <input
                  type="time"
                  id="startTime2"
                  className="rounded-lg text-xs mt-1"
                  value={startTime2}
                  onChange={handleStartTimeChange2}
                />
              </div>
              <div className="flex flex-col">
                <label style={{ fontSize: "11px" }}>End Time</label>
                <input
                  type="time"
                  id="endTime2"
                  className="rounded-lg text-xs mt-1"
                  value={endTime2}
                  onChange={handleEndTimeChange2}
                />
              </div>
            </div>
            <div className="mb-6 mt-6 flex items-center justify-center gap-4">
              <button
                onClick={() => setOpenTimeRangeModal(false)}
                className="px-6 py-1 bg-slate-200 rounded-md font-medium text-slate-700 hover:bg-slate-300 duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleTimeApply}
                className="px-7 py-1 card-btn rounded-md "
              >
                Apply
              </button>
            </div>
          </div>
          <Modal.Footer>
            {" "}
            <h1 className="text-gray">
              <Kbd style={{ backgroundColor: "#e5e7c7" }}>Note :</Kbd> Select
              multiple days if the session time remains the same.
            </h1>
          </Modal.Footer>
        </Modal>
      </div>

      <div className="p-3 md:p-6 bg-purple-50 rounded-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-gray md:text-xl text-sm font-bold">
            Pick your TimeSlot
          </h1>
          <div className="flex flex-row gap-2 items-center">
            <h1 className="text-xs text-gray">Session Gap</h1>
            <select
              className="text-xs rounded-m md:w-24 border-2 focus:border-purple-400 outline outline-none focus:ring-0"
              onChange={handleSessionChange}
              value={session}
            >
              <option value={15}>15 min</option>
              <option value={30}>30 min</option>
              <option value={45}>45 min</option>
            </select>
          </div>
        </div>
        <div className="flex md:justify-center mt-4 overflow-auto overflow-x-auto">
          {daysOfWeek.map((day) => (
            <div key={day} className="flex flex-col items-center gap-2">
              <button
                type="button"
                className={`px-3 py-2 border-primary-60 font-semibold text-sm md:text-base ${
                  selectedDays === day
                    ? "text-primary-60 bg-primary-50 transition-all duration-300"
                    : "bg-slate-200 text-gray"
                }`}
                onClick={() => handleDayClick(day)}
              >
                {day.slice(0, 3)}
              </button>
              <div className="flex flex-col text-center items-center">
                <p className="text-[11px] md:text-[14px] text-gray-900">
                  {data.timeSlots[day].length}
                </p>
                <p className="text-[9px]  md:text-[14px]">Slots</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex mt-2">
          <button
            onClick={openModal}
            type="button"
            className="p-1 px-2 text-xs rounded-xl btn-color text-white font-semibold text-center hover:opacity-95"
          >
            Select Time Range
          </button>
        </div>
        {selectedDays && (
          <>
            <h1 className="mt-2 text-gray font-medium">Morning Slots</h1>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 overflow-auto mt-2">
              {morningSlots.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => handleTimeSlotToggle(selectedDays, time)}
                  className={`py-2 text-xs rounded-md border border-slate-200 hover:border-primary-50 hover:text-primary-60 duration-200 ${
                    data.timeSlots[selectedDays].includes(time) ||
                    (setModifiedSlot[selectedDays] &&
                      setModifiedSlot[selectedDays].includes(time))
                      ? "bg-primary-50 text-primary-60 border border-purple-200"
                      : "bg-slate-100 border border-slate-300"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
            <h1 className="mt-2 text-gray font-medium">Afternoon Slots</h1>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 overflow-auto mt-2">
              {afternoonSlots.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => handleTimeSlotToggle(selectedDays, time)}
                  className={`py-2 text-xs  rounded-md  hover:border-primary-50 hover:text-primary-60 duration-200 ${
                    data.timeSlots[selectedDays].includes(time)
                      ? "bg-primary-50 text-primary-60 border border-purple-200"
                      : "bg-slate-100 border border-slate-300"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
            <h1 className="mt-2 text-gray font-medium">Evening Slots</h1>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 overflow-auto mt-2">
              {eveningSlots.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => handleTimeSlotToggle(selectedDays, time)}
                  className={`py-2 text-xs rounded-md  hover:border-primary-50 hover:text-primary-60 duration-200 ${
                    data.timeSlots[selectedDays].includes(time)
                      ? "bg-primary-50 text-primary-60 border border-purple-200"
                      : "bg-slate-100 border border-slate-300"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
            <h1 className="mt-2 text-gray font-medium">Night Slots</h1>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 overflow-auto mt-2">
              {nightSlots.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => handleTimeSlotToggle(selectedDays, time)}
                  className={`py-2 text-xs rounded-md  hover:border-primary-50 hover:text-primary-60 duration-200 ${
                    data.timeSlots[selectedDays].includes(time)
                      ? "bg-primary-50 text-primary-60 border border-purple-200"
                      : "bg-slate-100 border border-slate-300"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TimeSlots;

TimeSlots.propTypes = {
  daysOfWeek: PropTypes.array,
  session: PropTypes.number,
  setModifiedSlot: PropTypes.func,
  timeSlotSaved: PropTypes.func,
  selectedDays: PropTypes.string,
  setSelectedDays: PropTypes.func,
  data: PropTypes.object,
  setData: PropTypes.func,
  handleSessionChange: PropTypes.func,
  handleDayClick: PropTypes.func,
  handleTimeSlotToggle: PropTypes.func,
  openModal: PropTypes.func,
};
