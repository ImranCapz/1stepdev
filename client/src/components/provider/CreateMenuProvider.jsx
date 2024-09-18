import { useState } from "react";
import { suggestions, suggestion } from "../suggestions";
import { FaRegSmileBeam } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  selectProvider,
  providerData,
} from "../../redux/provider/providerSlice";
import { useRef } from "react";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import toast from "react-hot-toast";
import { GrStatusGood } from "react-icons/gr";
import Input from "react-phone-number-input/input";
import "./CreateMenu.css";
import { Modal } from "flowbite-react";
import { Kbd } from "flowbite-react";

export default function CreateMenuProvider() {
  const { currentUser } = useSelector((state) => state.user);
  const [value, setValue] = useState("");
  const [buttonLoader, setButtonLoader] = useState(false);

  const [data, setData] = useState({
    imageUrls: [],
    name: [],
    therapytype: [],
    email: "",
    qualification: "",
    fullName: "",
    experience: "",
    phone: value,
    address: {
      addressLine1: "",
      street: "",
      country: "",
      state: "",
      city: "",
      pincode: "",
    },
    regularPrice: "",
    license: "",
    description: "",
    profilePicture: "",
    timeSlots: {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    },
  });
  console.log(data);

  const [step, setStep] = useState(0);
  const [error, setError] = useState({
    email: false,
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileRef = useRef();

  const handleButtonClick = (name, value) => {
    setData((prevData) => {
      const currentSelection = prevData[name] || [];
      const newSelection = currentSelection.includes(value)
        ? currentSelection.filter((item) => item !== value)
        : [...currentSelection, value];
      return { ...prevData, [name]: newSelection };
    });
  };

  const func1 = (e) => {
    const newErrors = { ...error };
    let { name, value } = e.target;
    const keys = name.split(".");

    if (name === "address.pincode") {
      if (value.length > 6) {
        return;
      }
    }
    if (name === "email") {
      const emailPattern = /^[^\s@]+@[^\s@]+\.com$/;
      if (emailPattern.test(value)) {
        newErrors.email = false;
      } else {
        newErrors.email = true;
      }
      setError(newErrors);
    }

    if (name === "regularPrice") {
      if (value.length > 5) {
        return;
      }
    }
    if (name === "experience") {
      if (value.length > 2) {
        return;
      }
    }
    if (name === "fullName") {
      value = value.replace(/[^a-zA-Z\s]/g, "");
    }
    if (keys.length === 2) {
      setData((prevData) => ({
        ...prevData,
        [keys[0]]: {
          ...prevData[keys[0]],
          [keys[1]]: value,
        },
      }));
    } else {
      setData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (step === 0 && data.name.length === 0) {
      newErrors.name = "Please select at least one service";
    }
    if (step === 0 && !data.profilePicture) {
      newErrors.profilePicture = "Profile picture is required";
    }
    if (step === 1 && data.therapytype.length === 0) {
      newErrors.therapytype = "Please select at least one service type";
    }
    if (step === 2 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = "Invalid email format";
    }
    if (step === 3 && !/^[0-9]{6}$/.test(data.address.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }
    if (step === 4 && data.regularPrice <= 100) {
      newErrors.regularPrice = "Fee must be greater than 100";
    }
    if (step === 5 && data.experience < 0) {
      newErrors.experience = "Experience must be greater than or equal to 0";
    }
    if (step === 6 && !/^\+\d{12}$/.test(data.phone)) {
      newErrors.phone =
        "Phone number must have exactly 12 digits with Country Code";
    }
    if (step === 8 && data.description.split(" ").length < 60) {
      newErrors.description = "Biography must be at least 60 words";
    }
    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const submitfn = (e) => {
    e.preventDefault();
    try {
      if (validate()) {
        const width = window.innerWidth <= 768 ? 140 : 240;
        window.scrollTo({ top: width, behavior: "smooth" });
        setStep(step + 1);
      }
    } catch (err) {
      console.log(err);
      console.log("Failed to save data.");
    }
  };
  const handleBack = () => {
    setStep(step - 1);
  };
  const totalstep = 9;
  const progress = (step / totalstep) * 100;
  const getGoodToKnowText = (step) => {
    switch (step) {
      case 0:
        return "Select the primary service you are offering. This helps us tailor the rest of the form to better suit your needs.";
      case 1:
        return "Specify the type of service you provide. This information helps us categorize your expertise accurately.";
      case 2:
        return "Enter your personal details. Accurate information ensures smooth communication and verification.";
      case 3:
        return "Provide your location details. This helps potential clients find and reach you more easily.";
      case 4:
        return "Indicate the fee you charge for your services. Make sure it's competitive and reflects your expertise.";
      case 5:
        return "Share your experience in this field. Clients value providers with a proven track record.";
      case 6:
        return "Enter your licensing details and phone number. This ensures we have the correct contact information and validates your credentials.";
      case 7:
        return "Set your available timings for appointments. This helps clients book sessions at convenient times.";
      case 8:
        return "Write a brief biography and upload a profile picture. A compelling introduction and a professional image can attract more clients.";
      default:
        return "";
    }
  };

  const goodtoknowrules = (step) => {
    switch (step) {
      case 0:
        return "Ensure the service aligns with your expertise and qualifications.Profile picture must be a clear, professional image.";
      case 1:
        return "Provide a detailed and accurate service type to attract the right clients.";
      case 2:
        return "Use your legal name and a valid email address to avoid delays.";
      case 3:
        return "Use your legal name and a valid email address to avoid delays.";
      case 4:
        return "Fees must be reasonable and justified by your experience and service quality.";
      case 5:
        return "Detail your years of experience and significant achievements or qualifications.";
      case 6:
        return " Only provide valid licenses and a contactable phone number.";
      case 7:
        return "Be realistic about your availability to avoid overbooking.";
      case 8:
        return "Your biography should be at least 30 words.";
      default:
        return "";
    }
  };

  const renderRules = (step) => {
    const rulesString = goodtoknowrules(step);
    const rulesArray = rulesString
      .split(".")
      .filter((rule) => rule.trim() !== "");

    return (
      <ul className="menu-subTextColor mt-2 text-xs md:text-lg">
        {rulesArray.map((rule, index) => (
          <li key={index} className="mb-2">
            {rule.trim()}.
          </li>
        ))}
      </ul>
    );
  };
  const ServiceButtons = (options, name) => {
    return options.map((option) => (
      <button
        key={option.value}
        type="button"
        disabled={option.isDisabled}
        className={`w-full h-12 p-3 m-1 rounded-lg border ${
          data[name]?.includes(option.value)
            ? "menu-Button text-white"
            : `bg-blue-100 ${
                option.isDisabled ? "text-gray-400" : "text-gray-700"
              }`
        }`}
        onClick={() => handleButtonClick(name, option.value)}
      >
        {option.value}
      </button>
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/server/provider/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          userRef: currentUser._id,
        }),
      });
      if (data.success) {
        console.log(data.success);
      }
      const ResData = await res.json();
      navigate(`/provider/${ResData._id}`);
      dispatch(selectProvider(ResData._id));
      dispatch(providerData(ResData));
    } catch (error) {
      console.log(error);
    }
  };

  //ProfileImage
  const [uploading, setUploading] = useState(false);
  const [progressProfile, setProgressProfile] = useState(null);
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      setProgressProfile(null);
      setButtonLoader(true);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgressProfile(progress);
          setButtonLoader(false);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((getDownloadURL) => {
            resolve(getDownloadURL);
          });
        }
      );
    });
  };

  const handleImageClick = (e) => {
    e.preventDefault();
    fileRef.current.click();
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      storeImage(file)
        .then((url) => {
          setData((prevData) => ({
            ...prevData,
            profilePicture: url,
          }));
          toast.success("Profile image uploaded successfully");
        })
        .catch(() => {
          toast.error("Profile image upload failed");
        });
    }
  };

  //timeslot

  const [selectedDays, setSelectedDays] = useState("Monday");
  const [multiSelectedDays, setMultiSelectedDays] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [startTime2, setStartTime2] = useState("");
  const [endTime2, setEndTime2] = useState("");
  const [session, setSession] = useState(30);

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

  const generateTimeSlots = () => {
    const morningSlots = [];
    const afternoonSlots = [];
    const eveningSlots = [];

    for (let hour = 7; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += session) {
        const period = hour < 12 ? "AM" : "PM";
        const hour12 = hour % 12 === 0 ? 12 : hour % 12;
        const time = `${String(hour12).padStart(2, "0")}:${String(
          minute
        ).padStart(2, "0")} ${period}`;

        if (hour < 12) {
          morningSlots.push(time);
        } else if (hour < 16) {
          afternoonSlots.push(time);
        } else {
          eveningSlots.push(time);
        }
      }
    }

    return { morningSlots, afternoonSlots, eveningSlots };
  };

  const { morningSlots, afternoonSlots, eveningSlots } = generateTimeSlots();

  const handlleTimeSlotToggle = (day, time) => {
    const updateTimeSlot = data.timeSlots[day].includes(time)
      ? data.timeSlots[day].filter((slot) => slot !== time)
      : [...data.timeSlots[day], time];
    setData({
      ...data,
      timeSlots: { ...data.timeSlots, [day]: updateTimeSlot },
    });
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
    const allSlots = [...morningSlots, ...afternoonSlots, ...eveningSlots];
    const filteredSlots = FilterTimeSlot(allSlots, startTime, endTime);
    const filteredSlots2 = FilterTimeSlot(allSlots, startTime2, endTime2);

    setData((prevData) => {
      const updatedTimeSlots = { ...prevData.timeSlots };
      multiSelectedDays.forEach((day) => {
        updatedTimeSlots[day] = [...filteredSlots, ...filteredSlots2];
      });
      return { ...prevData, timeSlots: updatedTimeSlots };
    });
    setOpenTimeRangeModal(false);
  };

  //modal for time range
  const [openTimeRangeModal, setOpenTimeRangeModal] = useState(false);

  function openModal() {
    setOpenTimeRangeModal(true);
    setMultiSelectedDays([selectedDays]);
  }

  return (
    <div>
      <Modal
        size={"md"}
        show={openTimeRangeModal}
        onClose={() => setOpenTimeRangeModal(false)}
      >
        <Modal.Header>Choose for {multiSelectedDays.join(", ")},</Modal.Header>
        <div className="p-4">
          <div className="flex flex-row items-center justify-center">
            {daysOfWeek.map((day) => (
              <button
                type="button"
                key={day}
                className={`px-2 py-2 border-primary-60 font-semibold  ${
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
          <h1 className="text-gray text-xs">
            <Kbd style={{ backgroundColor: "#e5e7c7" }}>Note :</Kbd> Select
            multiple days if the session time remains the same.
          </h1>
        </Modal.Footer>
      </Modal>
      <div className="fixed progress-bg w-full md:h-1 h-1 top-0 z-50 right-0 left-0">
        <div
          className="progress-bgs h-full transition-width duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="container flex flex-col mx-auto mt-4 mb-16 md:mb-0">
        <div className="flex flex-col md:flex-row md:gap-10 justify-center item-center rounded-lg">
          <div className="flex-col h-auto p-2 max-w-lg text-left">
            <div className="border-l-4 menu-borderColor md:p-6 lg:p-8 p-4 secondary-bg rounded-3xl">
              <h2 className="flex flex-row items-center gap-2 menu-textColor text-2xl font-bold">
                <FaRegSmileBeam /> Good To Know
              </h2>
              <p className="menu-subTextColor mt-2 text-xs md:text-lg justify-between">
                {getGoodToKnowText(step)}
              </p>

              <p className="menu-subTextColor mt-2 text-xs md:text-lg justify-between">
                {renderRules(step)}
              </p>
            </div>
          </div>
          <form onSubmit={submitfn} className="w-full md:w-[500px]">
            {/* <div class=" p-5 rounded-lg shadow-xl"> */}
            {step === 0 && (
              <>
                <input
                  type="file"
                  id="profilePicture"
                  name="profilePicture"
                  ref={fileRef}
                  hidden
                  accept="image/*"
                  onChange={handleProfileImageChange}
                />
                <div className="relative w-24 h-24 mx-auto group">
                  <label
                    htmlFor="profilePicture"
                    className="w-24 h-24 cursor-pointer"
                    onClick={handleImageClick}
                  >
                    <img
                      src={
                        data.profilePicture ||
                        "https://i.ibb.co/tKQH4zp/defaultprofile.jpg"
                      }
                      alt="profile"
                      className={`w-24 h-24 rounded-full object-cover border-4
                      } ${error.profilePicture && "border-red-500"}`}
                    />
                    <div
                      className="border-4 rounded-full w-24 h-24 absolute inset-0 transition-all duration-300"
                      style={{
                        borderColor: `rgba(49, 196, 141, ${
                          progressProfile / 100
                        })`,
                        border: `${progressProfile}%`,
                      }}
                    ></div>
                    <div className="hidden rounded-full group-hover:flex flex-col items-center justify-center absolute inset-0 bg-gray-800 bg-opacity-60">
                      <img
                        src="https://www.svgrepo.com/show/33565/upload.svg"
                        alt="camera"
                        className="w-8 h-8"
                      />
                      <p className="text-white text-xs">Choose Profile</p>
                    </div>
                  </label>
                </div>
                {error.profilePicture && !progressProfile && (
                  <p className="text-center mt-2 text-red-500">
                    {error.profilePicture}
                  </p>
                )}
                {progressProfile === 100 && (
                  <p className="text-center mt-2 text-gray font-semibold">
                    Profile image upload successfully
                  </p>
                )}
                <div className="flex flex-col p-6 rounded-lg">
                  <label className="font-bold menu-headTextColor mb-5 text-left">
                    Please Select your Service
                  </label>
                  <div className="flex flex-col max-h-64 overflow-y-auto">
                    {ServiceButtons(suggestions, "name")}
                  </div>
                  {/* </div> */}

                  {error.name && (
                    <p className="text-red-500 font-serif text-sm mt-1">
                      {error.name}
                    </p>
                  )}
                  <div className="flex mt-4 gap-4 justify-center">
                    <button
                      className="bg-slate-200 p-3 px-8 rounded-xl text-slate-400"
                      type="submit"
                      disabled
                    >
                      Back
                    </button>
                    <button
                      className={`p-3 px-8 rounded-xl btn-color text-white font-semibold text-center hover:opacity-95 ${
                        buttonLoader ? "cursor-not-allowed opacity-50" : ""
                      }`}
                      type="submit"
                      disabled={buttonLoader}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
            {step === 1 && (
              <div className="flex flex-col p-6 rounded-lg">
                <p className="p-1 menu-headTextColor font-bold mb-4 text-left">
                  Please Select your Service Type
                </p>
                <div className="flex flex-col justify-center">
                  {ServiceButtons(suggestion, "therapytype")}
                </div>
                {error.therapytype && (
                  <p className="text-red-500 font-serif text-sm mt-1">
                    {error.therapytype}
                  </p>
                )}

                <div className="flex justify-center mt-4 gap-4">
                  <button
                    className="p-3 px-8 rounded-xl bg-slate-200 text-slate-700"
                    type="submit"
                    onClick={handleBack}
                  >
                    Back
                  </button>
                  <button
                    className="p-3 px-8 rounded-xl btn-color text-white font-semibold text-center hover:opacity-95"
                    type="submit"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="flex flex-col p-6 rounded-lg">
                <p className="text-2xl font-bold menu-headTextColor mb-5">
                  Basic Information
                </p>
                {/* <div className="mb-10 flex items-center"> */}
                <label className="ml-3 menu-headTextColor font-bold text-left mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  className="input border-2 p-2 rounded-lg focus:outline-none focus:ring-0"
                  placeholder="Enter your fullname"
                  onChange={func1}
                  value={data.fullName}
                  name="fullName"
                  maxLength={20}
                  required
                ></input>
                <label className="ml-3 menu-headTextColor font-bold text-left mb-2 mt-2">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className={`w-full border-2 p-2 input rounded-lg focus:outline-none focus:ring-0 ${
                      error.email
                        ? "border-red-500 focus:border-red-500 text-red-700"
                        : "border-green-500 focus:border-green-500 text-green-800"
                    }`}
                    placeholder="Enter your Email"
                    onChange={func1}
                    value={data.email}
                    name="email"
                    id="email"
                    required
                  ></input>
                  {!error.email && (
                    <GrStatusGood className="absolute top-1/2 right-3 transform -translate-y-1/2 text-green-800" />
                  )}
                </div>

                <label className="ml-3 menu-headTextColor font-bold text-left mb-2 mt-2">
                  Qualification
                </label>
                <input
                  type="text"
                  className="input border-2 p-2 rounded-lg focus:outline-none focus:ring-0"
                  placeholder="Enter your Qualification"
                  onChange={func1}
                  value={data.qualification}
                  name="qualification"
                  maxLength={20}
                  required
                ></input>
                <div className="mt-4 flex justify-center gap-4">
                  <button
                    className="p-3 px-8 rounded-xl bg-slate-300 text-slate-700"
                    type="button"
                    onClick={handleBack}
                  >
                    Back
                  </button>
                  <button
                    className="p-3 px-8 rounded-xl btn-color text-white font-semibold text-center hover:opacity-95"
                    type="submit"
                    disabled={error.email}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="flex flex-col p-6 rounded-lg">
                <p className="text-2xl font-bold menu-headTextColor">
                  Location Details
                </p>
                <label className="ml-3 mt-5 menu-headTextColor font-bold text-left mb-2">
                  Address
                </label>
                <input
                  type="text"
                  className="input border-2 p-2 rounded-lg focus:outline-none focus:ring-0"
                  placeholder="Enter Address"
                  onChange={func1}
                  value={data.address.addressLine1}
                  name="address.addressLine1"
                  maxLength={30}
                  required
                ></input>

                <label className="ml-3 mt-5 menu-headTextColor font-bold text-left mb-2">
                  Street
                </label>
                <input
                  type="text"
                  className="input border-2 p-2 rounded-lg focus:outline-none focus:ring-0"
                  placeholder="Enter your Street"
                  onChange={func1}
                  value={data.address.street}
                  name="address.street"
                  maxLength={30}
                  required
                ></input>
                <div className="flex flex-row mt-5 gap-4">
                  <div className="w-full">
                    <label className="ml-3 menu-headTextColor font-bold text-left">
                      Country
                    </label>
                    <input
                      type="text"
                      className="w-full input border-2 p-2 mt-2 rounded-lg focus:outline-none focus:ring-0"
                      placeholder="Enter your Country"
                      onChange={func1}
                      value={data.address.country}
                      name="address.country"
                      maxLength={20}
                      required
                    ></input>
                  </div>
                  <div className="w-full">
                    <label className="ml-3 menu-headTextColor font-bold text-left">
                      State
                    </label>
                    <input
                      type="text"
                      className="w-full input border-2 p-2 mt-2 rounded-lg focus:outline-none focus:ring-0"
                      placeholder="Enter your State"
                      onChange={func1}
                      value={data.address.state}
                      name="address.state"
                      maxLength={20}
                      required
                    ></input>
                  </div>
                </div>
                <div className="flex flex-row mt-5 gap-4">
                  <div className="w-full">
                    <label className="ml-3 menu-headTextColor font-bold text-left ">
                      City
                    </label>
                    <input
                      type="text"
                      className="w-full input border-2 p-2 mt-2 rounded-lg focus:outline-none focus:ring-0"
                      placeholder="Enter your City"
                      onChange={func1}
                      value={data.address.city}
                      name="address.city"
                      maxLength={20}
                      required
                    ></input>
                  </div>
                  <div className="w-full">
                    <label className="ml-3 menu-headTextColor font-bold text-left">
                      Pincode
                    </label>
                    <input
                      type="number"
                      className="w-full input border-2 mt-2 p-2 rounded-lg focus:outline-none focus:ring-0"
                      placeholder="Enter your Pincode"
                      onChange={func1}
                      value={data.address.pincode}
                      name="address.pincode"
                      maxLength="6"
                      required
                    ></input>
                  </div>
                </div>

                {error.pincode && (
                  <p className="text-red-500 font-serif text-sm mt-1">
                    {error.pincode}
                  </p>
                )}
                <div className="mt-6 flex justify-center gap-4">
                  <button
                    className="p-3 px-8 rounded-xl bg-slate-300 text-slate-700"
                    type="button"
                    onClick={handleBack}
                  >
                    Back
                  </button>
                  <button
                    className="p-3 px-8 rounded-xl btn-color text-white font-semibold text-center hover:opacity-95"
                    type="submit"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
            {step === 4 && (
              <div className="flex flex-col p-6 rounded-lg">
                <label className="mb-5 menu-headTextColor font-bold ml-3 text-left">
                  Fee per Appoinment
                </label>
                <input
                  type="number"
                  className="input border-2 p-2 rounded-lg focus:outline-none focus:ring-0"
                  placeholder="Enter your fee"
                  onChange={func1}
                  value={data.regularPrice}
                  name="regularPrice"
                  required
                ></input>
                {error.regularPrice && (
                  <p className="text-red-500 font-serif text-sm mt-1">
                    {error.regularPrice}
                  </p>
                )}
                <div className="flex justify-center mt-4 gap-4">
                  <button
                    className="p-3 px-8 rounded-xl bg-slate-300 text-slate-700"
                    type="button"
                    onClick={handleBack}
                  >
                    Back
                  </button>
                  <button
                    className="p-3 px-8 rounded-xl btn-color text-white font-semibold text-center hover:opacity-95"
                    type="submit"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
            {step === 5 && (
              <div className="flex flex-col p-6  rounded-lg">
                <label className="mb-5 menu-headTextColor font-bold ml-3 text-left">
                  Years of Experience
                </label>
                <input
                  type="number"
                  className="input border-2 p-2 rounded-lg focus:outline-none focus:ring-0"
                  placeholder="Enter your experience"
                  onChange={func1}
                  value={data.experience}
                  name="experience"
                  required
                ></input>
                {error.experience && (
                  <p className="text-red-500 font-serif text-sm mt-1">
                    {error.experience}
                  </p>
                )}

                <div className="flex justify-center mt-4 gap-4">
                  <button
                    className="p-3 px-8 rounded-xl bg-slate-300 text-slate-600"
                    type="button"
                    onClick={handleBack}
                  >
                    Back
                  </button>
                  <button
                    className="p-3 px-8 rounded-xl btn-color text-white font-semibold text-center hover:opacity-95"
                    type="submit"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
            {step === 6 && (
              <div className="flex flex-col p-6  rounded-lg">
                <p className="text-2xl font-bold menu-headTextColor mb-5">
                  Authentication
                </p>
                <label className="menu-headTextColor font-bold ml-3 text-left mb-2">
                  Licensing
                </label>
                <input
                  type="text"
                  className="input border-2 p-2 rounded-lg focus:outline-none focus:ring-0"
                  placeholder="Eg. License Number, Issuing authority"
                  onChange={func1}
                  value={data.license}
                  name="license"
                  maxLength={10}
                  required
                ></input>

                <label className="mb-2 menu-headTextColor font-bold ml-3 mt-3 text-left">
                  Phone Number{" "}
                  <span className="text-xs">(with Country Code)</span>
                </label>

                <Input
                  placeholder="Phone number"
                  className={`border-2 p-2 rounded-lg input focus:outline-none focus:ring-0 border-slate-300 `}
                  id="phone"
                  maxLength="15"
                  onChange={(value) => {
                    setValue(value);
                    setData({
                      ...data,
                      phone: value,
                    });
                  }}
                  value={data.phone}
                />
                {error.phone && (
                  <p className="text-red-500 font-serif text-sm mt-1">
                    {error.phone}
                  </p>
                )}
                <div className="flex justify-center mt-4 gap-4">
                  <button
                    className="p-3 px-8 rounded-xl bg-slate-300 text-slate-600"
                    type="button"
                    onClick={handleBack}
                  >
                    Back
                  </button>
                  <button
                    className="p-3 px-8 rounded-xl btn-color text-white font-semibold text-center hover:opacity-95"
                    type="submit"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === 7 && (
              <>
                <div className="p-3 md:p-6 bg-purple-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <h1 className="text-gray md:text-xl text-sm font-bold">
                      Pick your TimeSlot
                    </h1>
                    <div className="flex flex-row gap-2 items-center">
                      <h1 className="text-sm text-gray">Session Gap</h1>
                      <select
                        className="text-xs rounded-m w-24 border-2 focus:border-purple-400 outline outline-none focus:ring-0"
                        onChange={handleSessionChange}
                        value={session}
                      >
                        <option value={15}>15 min</option>
                        <option value={30}>30 min</option>
                        <option value={45}>45 min</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-center mt-4 overflow-auto ">
                    {daysOfWeek.map((day) => (
                      <div
                        key={day}
                        className="flex flex-col items-center gap-2"
                      >
                        <button
                          type="button"
                          className={`px-3 py-2 border-primary-60 font-semibold  ${
                            selectedDays === day
                              ? "text-primary-60 bg-primary-50 transition-all duration-300"
                              : "bg-slate-200 text-gray"
                          }`}
                          onClick={() => handleDayClick(day)}
                        >
                          {day.slice(0, 3)}
                        </button>
                        <div className="flex flex-col text-center items-center">
                          <p
                            className="text-xs text-gray-900"
                            style={{ fontSize: "11px" }}
                          >
                            {data.timeSlots[day].length}
                          </p>
                          <p style={{ fontSize: "11px" }}>Slots</p>
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
                      <h1 className="mt-2 text-gray font-medium">
                        Morning Slots
                      </h1>
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 overflow-auto mt-2">
                        {morningSlots.map((time) => (
                          <button
                            key={time}
                            type="button"
                            onClick={() =>
                              handlleTimeSlotToggle(selectedDays, time)
                            }
                            className={`py-2 text-xs rounded-md border border-slate-200 hover:border-primary-50 hover:text-primary-60 duration-200 ${
                              data.timeSlots[selectedDays].includes(time)
                                ? "bg-primary-50 text-primary-60 border border-purple-200"
                                : "bg-slate-100 border border-slate-300"
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                      <h1 className="mt-2 text-gray font-medium">
                        Afternoon Slots
                      </h1>
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 overflow-auto mt-2">
                        {afternoonSlots.map((time) => (
                          <button
                            key={time}
                            type="button"
                            onClick={() =>
                              handlleTimeSlotToggle(selectedDays, time)
                            }
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
                      <h1 className="mt-2 text-gray font-medium">
                        Evening Slots
                      </h1>
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 overflow-auto mt-2">
                        {eveningSlots.map((time) => (
                          <button
                            key={time}
                            type="button"
                            onClick={() =>
                              handlleTimeSlotToggle(selectedDays, time)
                            }
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
                <div className="flex justify-center mt-4 mb-6 gap-4">
                  <button
                    className="p-3 px-8 rounded-xl bg-slate-300 text-slate-600"
                    type="button"
                    onClick={handleBack}
                  >
                    Back
                  </button>
                  <button
                    className="p-3 px-8 rounded-xl btn-color text-white font-semibold text-center hover:opacity-95"
                    type="submit"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
            {step === 8 && (
              <div className="flex flex-col p-6  rounded-lg">
                <p className="text-2xl font-bold menu-headTextColor text-left mb-4">
                  About
                </p>
                <label className="mb-2 menu-headTextColor font-bold text-left ml-3">
                  Biograpghy
                </label>
                <input
                  type="textarea"
                  className="input border-2 p-2 rounded-lg focus:outline-none focus:ring-0"
                  placeholder="Enter your biography"
                  onChange={func1}
                  value={data.description}
                  name="description"
                  required
                ></input>
                {error.description && (
                  <p className="text-red-500 font-serif text-sm mt-1">
                    {error.description}
                  </p>
                )}

                {/* <label className="mb-2 menu-headTextColor font-bold ml-3 text-left mt-2">
                  Profile
                </label>
                <input
                  type="file"
                  className="input border-2 p-2 rounded-lg focus:outline-none focus:ring-0"
                  placeholder="Add your profile"
                  onChange={func1}
                  value={data.profilePicture}
                  name="profilePicture"
                  required
                ></input>
                {error.profilePicture && (
                  <p className="text-red-500 font-serif text-sm mt-1">
                    {error.profilePicture}
                  </p>
                )} */}

                <div className="flex justify-center mt-4 gap-4">
                  <button
                    className="p-3 px-8 rounded-xl bg-slate-300 text-slate-600"
                    type="button"
                    onClick={handleBack}
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="p-3 px-8 rounded-xl btn-color text-white font-semibold text-center hover:opacity-95"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
