import { useState } from "react";
import { FaRegSmileBeam } from "react-icons/fa";
import { suggestions } from "../suggestions";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUserStart,
  updateUserFailure,
  updateUserSuccess,
} from "../../redux/user/userSlice";
import toast from "react-hot-toast";
import Input from "react-phone-number-input/input";


export default function CreateMenuParent() {
  const { currentUser } = useSelector((state) => state.user);
  const [parentPhone, setParentPhone] = useState("");
  const [emergPhone, setEmergPhone] = useState("");
  const [parent, setParent] = useState({
    isParent: true,
    parentDetails: {
      fullName: "",
      lookingFor: [],
      childName: "",
      dob: "",
      gender: "",
      height: "",
      weight: "",
      bloodGroup: "",
      medicalHistory: "",
      allergies: "",
      emergencyContact: emergPhone,
      insurance: "",
      address: "",
      phoneNumber: parentPhone,
    },
  });
  
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [successScreen, setSuccessScreen] = useState(false);
  const [count, setCount] = useState(5);
  const dispatch = useDispatch();

  const handleBack = () => {
    setStep(step - 1);
  };

  const totalstep = 5;
  const progress = (step / totalstep) * 100;

  const func1 = (e) => {
    let { name, value } = e.target;
    const keys = name.split(".");

    if (name === "parentDetails.childName") {
      value = value.replace(/[^a-zA-Z\s]/g, "");
    }
    if (name === "parentDetails.fullName") {
      value = value.replace(/[^a-zA-Z\s]/g, "");
    }

    if (name === "parentDetails.height" && value.length > 3) {
      return;
    }
    if (name === "parentDetails.weight" && value.length > 3) {
      return;
    }
    if (name === "parentDetails.dob") {
      const dob = /^\d{4}-\d{2}-\d{2}$/;
      if (!dob.test(value)) {
        return;
      }
    }
    if (keys.length === 2) {
      setParent((prevData) => ({
        ...prevData,
        [keys[0]]: {
          ...prevData[keys[0]],
          [keys[1]]: value,
        },
      }));
    } else {
      setParent((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateUserStart());
    try {
      dispatch(updateUserStart());
      const res = await fetch(`server/parent/updateparent/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parent),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data));
        return;
      }
      dispatch(updateUserSuccess(data));
      toast.success("Parent saved successfully");
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (step === 0 && parent.parentDetails.lookingFor.length === 0) {
      newErrors.lookingFor = "Please select at least one service";
    }
    if (step === 0 && !/^[A-Za-z\s]+$/.test(parent.parentDetails.fullName)) {
      newErrors.fullName = "Name must contains only alphabets";
    }
    if (
      step === 3 &&
      !/^\+\d{12}$/.test(parent.parentDetails.emergencyContact)
    ) {
      newErrors.emergencyContact =
        "Emergency contact must be a valid phone number";
    }
    if (step === 1 && !/^[A-Za-z\s]+$/.test(parent.parentDetails.childName)) {
      newErrors.childName = "Name must contains only alphabets";
    }
    if (step === 4 && !/^\+\d{12}$/.test(parent.parentDetails.phoneNumber)) {
      newErrors.phoneNumber = "Emergency contact must be a valid phone number";
    }
    if (step === 1 && !parent.parentDetails.gender) {
      newErrors.gender = "Please choose a gender";
    }
    setErrors(newErrors);
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
      console.log("Failed to save data.");
    }
  };

  const handleButtonclick = (name, value) => {
    setParent((prevData) => {
      const currentSelection = prevData.parentDetails[name] || [];
      const newSelection = currentSelection.includes(value)
        ? currentSelection.filter((item) => item !== value)
        : [...currentSelection, value];
      return {
        ...prevData,
        parentDetails: {
          ...prevData.parentDetails,
          [name]: newSelection,
        },
      };
    });
  };

  const getGoodToKnowText = (step) => {
    switch (step) {
      case 0:
        return "Providing accurate personal information helps us tailor our services to meet your specific needs.";
      case 1:
        return "Accurate child information ensures appropriate and personalized care for your child.";
      case 2:
        return "Providing accurate physical information helps us better understand and address your child's health needs.";
      case 3:
        return "Comprehensive medical information is crucial for effective and safe medical care.";
      case 4:
        return "Providing accurate contact information ensures we can reach you when necessary.";
      default:
        return "";
    }
  };

  const getGoodToKnowRules = (step) => {
    switch (step) {
      case 0:
        return "Rules: Must be at least 3 characters long. Ensure it's your legal name for accurate records. Indicate the specific service you're looking for. Helps us direct you to the right resources and support.";
      case 1:
        return "Rules: Ensure it matches your child's legal documents. Must be a valid date. Select from Male, Female, or Other. Helps us in providing gender-appropriate care.";
      case 2:
        return "Rules: Must be a positive number in centimeters. Helps us track growth and development accurately. Must be a positive number in kilograms. Crucial for determining appropriate dosages and care. Indicate a valid blood group type (eg, A+, B-, O+). Essential for emergency medical situations.";
      case 3:
        return "Rules: Optional but recommended. Helps us understand past medical conditions for better care. Optional but recommended. Helps us avoid substances that may cause allergic reactions. Must be a valid phone number. Essential for contacting you in urgent situations. Provide details if available for processing insurance claims.";
      case 4:
        return "Rules: Helps us locate you for home visits or deliveries. Must be a valid phone number. Crucial for communication and follow-ups.";
      default:
        return "";
    }
  };

  const renderRules = (step) => {
    const rulesString = getGoodToKnowRules(step);
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
        className={`p-3 m-1 rounded-lg border ${
          parent.parentDetails[name]?.includes(option.value)
            ? "menu-Button text-white"
            : `bg-blue-100 ${
                option.isDisabled ? "text-gray-400" : "text-gray-700"
              }`
        }`}
        onClick={() => handleButtonclick(name, option.value)}
      >
        {option.value}
      </button>
    ));
  };

  if (successScreen) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-bold text-center text-green-600">
          Data saved successfully
        </h1>
        <h1 className="text-3xl font-bold text-center text-green-600">
          Redirecting to dashboard in {count}
        </h1>
      </div>
    );
  }

  return (
    <div>
      <div className="fixed progress-bg w-full md:h-1 h-1 top-0 z-50 ">
        <div
          className="progress-bgs h-full transition-width duration-500 ease-in-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="container flex flex-col mx-auto mb-16 md:mb-0">
        <h1 className="text-2xl m-4 text-left font-bold text-gray">
          Fill the form for Parent Profile :
        </h1>
        <div className="flex flex-col md:flex-row md:gap-10 rounded-lg justify-center items-center">
          <div className="flex-col h-auto p-2 max-w-lg text-left">
            <div className="border-l-4 menu-borderColor md:p-6 lg:p-8 p-4 secondary-bg rounded-3xl ">
              <h2 className="flex flex-row  items-center gap-2 menu-textColor text-2xl font-bold">
                <FaRegSmileBeam /> Good To Know
              </h2>
              <p className="menu-subTextColor mt-2 text-xs md:text-lg justify-between">
                {getGoodToKnowText(step)}
              </p>
              {/* <p className='menu-headTextColor mt-2 text-lg justify-between'>{getGoodToKnowRules(step)}</p> */}
              <p className="menu-subTextColor mt-2 text-xs md:text-lg justify-between">
                {renderRules(step)}
              </p>
            </div>
          </div>
          <form onSubmit={submitfn} className="w-full md:w-[500px]">
            {step === 0 && (
              <div className="flex flex-col p-6 rounded-lg">
                <label className="p-1 menu-headTextColor font-bold mb-2">
                  Parent Name :
                </label>
                <input
                  type="text"
                  className="input border-2 p-2 rounded-lg focus:outline-none focus:ring-0"
                  placeholder="full name"
                  onChange={func1}
                  value={parent.parentDetails.fullName}
                  name="parentDetails.fullName"
                  maxLength={25}
                  required
                ></input>
                {errors.fullName && (
                  <p className="text-red-500 font-serif text-sm mt-1">
                    {errors.fullName}
                  </p>
                )}
                <p className="font-bold menu-headTextColor mt-5 mb-4">
                  What service are you looking for ?
                </p>
                <p className="flex flex-col max-h-64 overflow-y-auto">
                  {ServiceButtons(suggestions, "lookingFor")}
                </p>
                {errors.lookingFor && (
                  <p className="text-red-500 font-serif text-sm mt-1">
                    {errors.lookingFor}
                  </p>
                )}
                <div className="flex justify-center mt-4 gap-4">
                  <button
                    className="p-3 px-8 rounded-xl bg-slate-200 text-slate-400"
                    type="submit"
                    disabled
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
            {step === 1 && (
              <div className="p-6 rounded-lg">
                <p className="text-2xl font-bold menu-headTextColor mb-10">
                  Child Information
                </p>
                <label className="mb-2 menu-headTextColor font-bold">
                  Child Name
                </label>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg border-gray-300 mt-5 mb-5 input border-2 focus:outline-none focus:ring-0"
                  placeholder="Enter child fullname"
                  onChange={func1}
                  value={parent.parentDetails.childName}
                  name="parentDetails.childName"
                  maxLength={25}
                  required
                ></input>
                {errors.childName && (
                  <p className="text-red-500 font-serif text-sm mt-1">
                    {errors.childName}
                  </p>
                )}

                <label className="menu-headTextColor font-bold mt-5">
                  Date of Birth
                </label>
                <input
                  type="date"
                  placeholder="select date"
                  className="w-full p-3 rounded-lg border-gray-300 mt-5 input border-2 focus:outline-none focus:ring-0"
                  value={parent.parentDetails.dob}
                  onChange={func1}
                  name="parentDetails.dob"
                  required
                ></input>

                <div className="mt-5">
                  <label
                    htmlFor="gender"
                    className="block menu-headTextColor font-bold mb-5 "
                  >
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="parentDetails.gender"
                    onChange={func1}
                    value={parent.parentDetails.gender}
                    placeholder="select gender"
                    className="w-full p-3 rounded-lg border-gray-300 mb-5 input border-2 focus:outline-none focus:ring-0"
                  >
                    <option value="" disabled>
                      select a gender
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && (
                    <p className="text-red-500 font-serif text-sm mt-1">
                      {errors.gender}
                    </p>
                  )}
                </div>
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
            {step === 2 && (
              <div className="p-6 rounded-lg">
                <p className="text-2xl font-bold menu-headTextColor mb-10">
                  Physical Information
                </p>
                <label className="mb-5 menu-headTextColor font-bold">
                  Height
                </label>
                <input
                  type="number"
                  className="w-full p-3 rounded-lg border-gray-300 mt-5 mb-5 input border-2 focus:outline-none focus:ring-0"
                  placeholder="Enter height in cm"
                  onChange={func1}
                  value={parent.parentDetails.height}
                  name="parentDetails.height"
                  required
                ></input>
                <label className="mt-5 menu-headTextColor font-bold">
                  Weight
                </label>
                <input
                  type="number"
                  className="w-full p-3 rounded-lg border-gray-300 mb-5 mt-5 input border-2 focus:outline-none focus:ring-0"
                  placeholder="Enter weight in kg"
                  onChange={func1}
                  value={parent.parentDetails.weight}
                  name="parentDetails.weight"
                  required
                ></input>
                <label className="mb-5 menu-headTextColor font-bold">
                  Blood Group
                </label>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg border-gray-300 mb-5 mt-5 input border-2 focus:outline-none focus:ring-0"
                  placeholder="Enter blood group (e.g., A+, B-, O+)"
                  onChange={func1}
                  value={parent.parentDetails.bloodGroup}
                  name="parentDetails.bloodGroup"
                  maxLength={10}
                  required
                ></input>
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
            {step === 3 && (
              <div className="p-6 rounded-lg">
                <p className="text-2xl font-bold menu-headTextColor mb-10">
                  Medical Information
                </p>
                <label className="mt-5 menu-headTextColor font-bold">
                  Medical History
                </label>
                <input
                  type="textarea"
                  className="w-full p-3 rounded-lg border-gray-300 mb-5 mt-5 input border-2 focus:outline-none focus:ring-0"
                  placeholder="Enter Medical History"
                  onChange={func1}
                  value={parent.parentDetails.medicalHistory}
                  name="parentDetails.medicalHistory"
                  required
                  maxLength={30}
                ></input>
                <label className="mt-5 menu-headTextColor font-bold">
                  Allergies
                </label>
                <input
                  type="textarea"
                  className="w-full p-3 rounded-lg border-gray-300 mb-5 mt-5 input border-2 focus:outline-none focus:ring-0"
                  placeholder="Enter any allergies"
                  onChange={func1}
                  value={parent.parentDetails.allergies}
                  name="parentDetails.allergies"
                  maxLength={30}
                  required
                ></input>
                <label className="mt-5 menu-headTextColor font-bold">
                  Emergency Contact
                </label>
                <Input
                  placeholder="Enter emergency contact number"
                  className={`border-2 p-2 mt-2 mb-4 input rounded-lg focus:outline-none focus:ring-0 w-full`}
                  value={parent.parentDetails.emergencyContact}
                  maxLength={15}
                  onChange={(value) => {
                    setEmergPhone(value);
                    setParent((prevData) => {
                      return {
                        ...prevData,
                        parentDetails: {
                          ...prevData.parentDetails,
                          emergencyContact: value,
                        },
                      };
                    });
                  }}
                />
                {errors.emergencyContact && (
                  <p className="text-red-500 font-serif text-sm mt-1">
                    {errors.emergencyContact}
                  </p>
                )}
                <label className="mb-5 menu-headTextColor font-bold">
                  Insurance
                </label>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg border-gray-300 mb-5 mt-5 input border-2 focus:outline-none focus:ring-0"
                  placeholder="Enter insurance details"
                  onChange={func1}
                  value={parent.parentDetails.insurance}
                  name="parentDetails.insurance"
                  required
                ></input>
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
            {step === 4 && (
              <div className="p-6 rounded-lg">
                <form>
                  <p className="text-2xl font-bold menu-headTextColor mb-10">
                    Contact Information
                  </p>
                  <label className="mb-5 menu-headTextColor font-bold">
                    Address
                  </label>
                  <input
                    type="textarea"
                    className="w-full p-3 rounded-lg border-gray-300 mb-5 mt-5 input border-2 focus:outline-none focus:ring-0"
                    placeholder="Enter your full address"
                    onChange={func1}
                    value={parent.parentDetails.address}
                    name="parentDetails.address"
                    required
                  ></input>
                  <label className="mb-5 menu-headTextColor font-bold">
                    Phone Number
                  </label>
                  <Input
                    placeholder="Enter phone number"
                    className={`border-2 p-2 mt-2 mb-4 input rounded-lg focus:outline-none focus:ring-0 w-full`}
                    value={parent.parentDetails.phoneNumber}
                    maxLength={15}
                    onChange={(value) => {
                      setParentPhone(value);
                      setParent((prevData) => {
                        return {
                          ...prevData,
                          parentDetails: {
                            ...prevData.parentDetails,
                            phoneNumber: value,
                          },
                        };
                      });
                    }}
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 font-serif text-sm mt-1">
                      {errors.phoneNumber}
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
                      type="button"
                      onClick={handleSubmit}
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
