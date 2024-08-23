import { useState } from "react";

export default function CreateMenuParent() {
  const [parent, setParent] = useState({
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
      emergencyContact: "",
      insurance: "",
      address: "",
      phoneNumber: "",
    },
  });
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});

  const handleBack = () => {
    setStep(step - 1);
  };

  const totalstep = 5;
  const progress = (step / totalstep) * 100;

  const func1 = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");
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

  const validate = () => {
    const newErrors = {};
    if (step === 0 && parent.parentDetails.lookingFor.length === 0) {
      newErrors.lookingFor = "Please select at least one service";
    }
    if (step === 0 && !/^[A-Za-z\s]+$/.test(parent.parentDetails.fullName)) {
      newErrors.fullName = "Name must contains only alphabets";
    }
    if (step === 1 && !/^[A-Za-z\s]+$/.test(parent.parentDetails.childName)) {
      newErrors.childName = "Name must contains only alphabets";
    }
    if (step === 4 && !/^[0-9]{10}$/.test(parent.parentDetails.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitfn = (e) => {
    e.preventDefault();
    try {
      if (validate()) {
        console.log(parent);
        console.log("save");
        setStep(step + 1);
      }
    } catch (err) {
      console.log(err);
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
      <ul className="text-purple-700 mt-2 text-lg">
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
        key={option}
        type="button"
        className={`p-3 m-1 rounded-lg border ${
          parent.parentDetails[name]?.includes(option)
            ? "bg-purple-500 text-white"
            : "bg-blue-100"
        }`}
        onClick={() => handleButtonclick(name, option)}
      >
        {option}
      </button>
    ));
  };
  return (
    <div>
      <div className="container mx-auto">
        <h1 className="text-purple-700 font-bold text-3xl my-4">Onestep</h1>

        <div className="bg-blue-200 w-full h-2 rounded">
          <div
            className="bg-purple-500 h-full rounded"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="flex flex-col md:flex-row justify-between min-h-screen bg-purple-100 md:p-20 rounded-lg justify-items-center">
          <div className="flex-wrap bg-blue-100 p-4 md:p-6 lg:p-8 border-l-4 border-purple-600 rounded-lg max-w-lg mb-4 text-left h-auto  justify-center">
            <h2 className="text-purple-700 text-2xl font-bold">
              {"\u{1F60A}"}Good To Know
            </h2>
            <p className="text-purple-700 mt-2 text-lg justify-between">
              {getGoodToKnowText(step)}
            </p>
            {/* <p className='text-purple-700 mt-2 text-lg justify-between'>{getGoodToKnowRules(step)}</p> */}
            <li className="text-purple-700 mt-2 text-lg justify-between">
              {renderRules(step)}
            </li>
          </div>
          <form onSubmit={submitfn} className="w-full">
            {step === 0 && (
              <div className="p-6 rounded-lg text-center ml-2">
                <p className="text-2xl font-bold text-purple-700 mb-5">
                  Personal Information
                </p>
                <label className="mb-5 text-purple-700 font-bold">
                  Parent Name
                </label>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg border-gray-300 mt-5 focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your fullname"
                  onChange={func1}
                  value={parent.parentDetails.fullName}
                  name="parentDetails.fullName"
                  required
                ></input>
                {errors.fullName && (
                  <p className="text-red-500 font-serif text-sm mt-1">
                    {errors.fullName}
                  </p>
                )}
                <p className="font-bold text-purple-700 mt-5">
                  Select the service you need
                </p>
                <br></br>
                <br></br>

                <div className="flex flex-col justify-center">
                  {ServiceButtons(
                    [
                      "Speech Therapist",
                      "Occupational Therapist",
                      "School Based-Service",
                      "Dance Movement",
                      "Counselling",
                      "Diagnostic Evaluation",
                      "ABA Therapy",
                    ],
                    "lookingFor"
                  )}
                </div>
                {errors.lookingFor && (
                  <p className="text-red-500 font-serif text-sm mt-1">
                    {errors.lookingFor}
                  </p>
                )}
                <div className="mt-10 flex justify-between">
                  <button
                    className="rounded-3xl bg-purple-500 w-full text-white p-3 mr-2 hover:bg-purple-700"
                    type="submit"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
            {step === 1 && (
              <div className="p-6 rounded-lg text-center">
                <p className="text-2xl font-bold text-purple-700 mb-10">
                  Child Information
                </p>
                <label className="mb-2 text-purple-700 font-bold">
                  Child Name
                </label>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg border-gray-300 mt-5  mb-5 focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter child fullname"
                  onChange={func1}
                  value={parent.parentDetails.childName}
                  name="parentDetails.childName"
                  required
                ></input>
                {errors.childName && (
                  <p className="text-red-500 font-serif text-sm mt-1">
                    {errors.childName}
                  </p>
                )}

                <label className="text-purple-700 font-bold mt-5">
                  Date of Birth
                </label>
                <input
                  type="date"
                  placeholder="select date"
                  className="w-full p-3 rounded-lg border-gray-300 mt-5 focus:ring-2 focus:ring-purple-500"
                  value={parent.parentDetails.dob}
                  onChange={func1}
                  name="parentDetails.dob"
                  required
                ></input>

                <div className="mb-4 mt-5">
                  <label
                    htmlFor="gender"
                    className="block text-purple-700 font-bold mb-2"
                  >
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="parentDetails.gender"
                    onChange={func1}
                    value={parent.parentDetails.gender}
                    placeholder="select gender"
                    className="w-full px-3 py-2 border rounded shadow-sm bg-white text-black focus:outline-none focus:ring focus:border-blue-300"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="mt-10 flex justify-between">
                  <button
                    className="rounded-3xl bg-blue-500 w-full text-white p-3 mr-2"
                    type="button"
                    onClick={handleBack}
                  >
                    Back
                  </button>
                  <button
                    className="rounded-3xl bg-purple-500 w-full text-white p-3 mr-2 hover:bg-purple-700"
                    type="submit"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="p-6 rounded-lg text-center">
                <p className="text-2xl font-bold text-purple-700 mb-10">
                  Physical Information
                </p>
                <label className="mb-5 text-purple-700 font-bold">Height</label>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg border-gray-300 mt-5 mb-5 focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter height in cm"
                  onChange={func1}
                  value={parent.parentDetails.height}
                  name="parentDetails.height"
                  required
                ></input>
                <label className="mt-5 text-purple-700 font-bold">Weight</label>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg border-gray-300 mt-5 mb-5 focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter weight in kg"
                  onChange={func1}
                  value={parent.parentDetails.weight}
                  name="parentDetails.weight"
                  required
                ></input>
                <label className="mb-5 text-purple-700 font-bold">
                  Blood Group
                </label>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg border-gray-300 mt-5 focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter blood group (e.g., A+, B-, O+)"
                  onChange={func1}
                  value={parent.parentDetails.bloodGroup}
                  name="parentDetails.bloodGroup"
                  required
                ></input>
                <div className="mt-10 flex justify-between">
                  <button
                    className="rounded-3xl bg-blue-500 w-full text-white p-3 mr-2"
                    type="button"
                    onClick={handleBack}
                  >
                    Back
                  </button>
                  <button
                    className="rounded-3xl bg-purple-500 w-full text-white p-3 mr-2 hover:bg-purple-700"
                    type="submit"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="p-6 rounded-lg text-center">
                <p className="text-2xl font-bold text-purple-700 mb-10">
                  Medical Information
                </p>
                <label className="mt-5 text-purple-700 font-bold">
                  Medical History
                </label>
                <input
                  type="textarea"
                  className="w-full p-3 rounded-lg border-gray-300 mt-5 mb-5 focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter Medical History"
                  onChange={func1}
                  value={parent.parentDetails.medicalHistory}
                  name="parentDetails.medicalHistory"
                  required
                ></input>
                <label className="mt-5 text-purple-700 font-bold">
                  Allergies
                </label>
                <input
                  type="textarea"
                  className="w-full p-3 rounded-lg border-gray-300 mt-5 mb-5 focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter any allergies"
                  onChange={func1}
                  value={parent.parentDetails.allergies}
                  name="parentDetails.allergies"
                  required
                ></input>
                <label className="mt-5 text-purple-700 font-bold">
                  Emergency Contact
                </label>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg border-gray-300 mb-5 mt-5 focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter emergency contact number"
                  onChange={func1}
                  value={parent.parentDetails.emergencyContact}
                  name="parentDetails.emergencyContact"
                  required
                ></input>
                <label className="mb-5 text-purple-700 font-bold">
                  Insurance
                </label>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg border-gray-300 mt-5 mb-5 focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter insurance details"
                  onChange={func1}
                  value={parent.parentDetails.insurance}
                  name="parentDetails.insurance"
                  required
                ></input>
                <div className="mt-10 flex justify-between">
                  <button
                    className="rounded-3xl bg-blue-500 w-full text-white p-3 mr-2"
                    type="button"
                    onClick={handleBack}
                  >
                    Back
                  </button>
                  <button
                    className="rounded-3xl bg-purple-500 w-full text-white p-3 mr-2 hover:bg-purple-700"
                    type="submit"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
            {step === 4 && (
              <div className="p-6 rounded-lg text-center">
                <p className="text-2xl font-bold text-purple-700 mb-10">
                  Contact Information
                </p>
                <label className="mb-5 text-purple-700 font-bold">
                  Address
                </label>
                <input
                  type="textarea"
                  className="w-full p-3 rounded-lg border-gray-300 mt-5 mb-5 focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your full address"
                  onChange={func1}
                  value={parent.parentDetails.address}
                  name="parentDetails.address"
                  required
                ></input>
                <label className="mb-5 text-purple-700 font-bold">
                  Phone Number
                </label>

                <input
                  type="textarea"
                  className="w-full p-3 rounded-lg border-gray-300 mt-5 mb-5 focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your phone number"
                  onChange={func1}
                  value={parent.parentDetails.phoneNumber}
                  name="parentDetails.phoneNumber"
                  required
                ></input>
                {errors.phoneNumber && (
                  <p className="text-red-500 font-serif text-sm mt-1">
                    {errors.phoneNumber}
                  </p>
                )}

                <div className="mt-10 flex justify-between">
                  <button
                    className="rounded-3xl bg-blue-500 w-full text-white p-3 mr-2"
                    type="button"
                    onClick={handleBack}
                  >
                    Back
                  </button>
                  <button
                    className="rounded-3xl bg-purple-500 w-full text-white p-3 mr-2 hover:bg-purple-700"
                    type="submit"
                  >
                    Next
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
