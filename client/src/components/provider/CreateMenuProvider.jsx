import { useState } from "react";
import TimePicker from "react-time-picker";

export default function CreateMenuProvider() {
  const [data, setData] = useState({
    name: [],
    therapytype: [],
    fullName: "",
    email: "",
    qualification: "",
    experience: "",
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
    phone: "",
    availability: {
      morningStart: "",
      morningEnd: "",
      eveningStart: "",
      eveningEnd: "",
    },
    description: "",
    profilePicture: "",
  });
  const [step, setStep] = useState(0);
  const [error, setError] = useState({});

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
    const { name, value } = e.target;
    const keys = name.split(".");

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
    if (step === 1 && data.therapytype.length === 0) {
      newErrors.therapytype = "Please select at least one service type";
    }

    if (step === 2 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = "Invalid email format";
    }
    if (step === 4 && data.regularPrice <= 100) {
      newErrors.regularPrice = "Fee must be greater than 100";
    }
    if (step === 5 && data.experience <= 0) {
      newErrors.experience = "Experience must be greater than 0";
    }
    if (step === 6 && !/^[0-9]{10}$/.test(data.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }
    if (step === 3 && !/^[0-9]{6}$/.test(data.address.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }
    if (step === 8 && data.description.split(" ").length < 30) {
      newErrors.description = "Biography must be at least 30 words";
    }
    if (step === 8 && !data.profilePicture) {
      newErrors.profilePicture = "Image is required";
    }

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const submitfn = (e) => {
    e.preventDefault();
    try {
      if (validate()) {
        console.log(data);
        console.log("save");
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
        return "Ensure the service aligns with your expertise and qualifications.";
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
        return "Your biography should be at least 30 words. Profile picture must be a clear, professional image.";
      default:
        return "";
    }
  };
  const ServiceButtons = (options, name) => {
    return options.map((option) => (
      <button
        key={option}
        type="button"
        className={`p-3 m-1 rounded-lg border ${
          data[name]?.includes(option)
            ? "bg-purple-500 text-white"
            : "bg-blue-100"
        }`}
        onClick={() => handleButtonClick(name, option)}
      >
        {option}
      </button>
    ));
  };

  return (
    <div>
      <div className="container mx-auto p-4">
        <h1 className="text-center text-purple-700 text-4xl font-bold my-4">
          Onestep
        </h1>
        <br></br>
        <div className="w-full bg-blue-200 h-2 rounded">
          <div
            className="bg-purple-500 h-full rounded"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <section className="flex flex-col md:flex-row bg-purple-100 justify-between min-h-screen md:p-20 rounded-lg">
          <div className="flex-wrap bg-blue-100 p-4 md:p-6 lg:p-8 border-l-4 border-purple-600 rounded-lg max-w-lg mb-4 text-left h-auto lg:h-48 xl:h-64 justify-center">
            <h2 className="text-purple-700 text-2xl font-bold">
              {"\u{1F60A}"} Good To Know
            </h2>
            <p className="text-purple-700 mt-2 text-lg justify-between">
              {getGoodToKnowText(step)}
            </p>
            <p className="text-purple-700 mt-2 text-lg justify-between">
              {goodtoknowrules(step)}
            </p>
          </div>
          <form onSubmit={submitfn} className="w-full md:w-2/3 space-y-6">
            {/* <div class=" p-5 rounded-lg shadow-xl"> */}
            {step === 0 && (
              <div className="p-6  rounded-lg shadow-md text-center ml-5">
                <p className="text-2xl font-bold text-purple-700 mb-5">
                  Please Select your Service
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
                    "name"
                  )}
                </div>
                {error.name && (
                  <p className="text-red-500 font-serif text-sm mt-1">
                    {error.name}
                  </p>
                )}
                <div className="mt-10 flex justify-between">
                  <button
                    className="mt-5 bg-purple-500 w-full text-white p-3 rounded-3xl hover:bg-purple-700"
                    type="submit"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="p-6  rounded-lg shadow-md text-center ml-5">
                <p className="text-2xl font-bold text-purple-700 mb-5">
                  Please Select your Service Type
                </p>
                <br></br>
                <br></br>
                <div className="flex flex-col justify-center">
                  {ServiceButtons(
                    ["Virtual", "In-Home", "In-Clinic"],
                    "therapytype"
                  )}
                </div>
                {error.therapytype && (
                  <p className="text-red-500 font-serif text-sm mt-1">
                    {error.therapytype}
                  </p>
                )}
                <br></br>
                <br></br>
                <div className="mt-5 flex justify-between">
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
              <div className="p-6  rounded-lg shadow-md text-center ml-5">
                <h2 className="text-2xl font-bold text-purple-700 mb-5">
                  Basic Information
                </h2>
                <br></br>
                <br></br>
                <label className="mb-5">Full Name</label>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg border-gray-300 mt-5 focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your fullname"
                  onChange={func1}
                  value={data.fullName}
                  name="fullName"
                  required
                ></input>
                <br></br>
                <br></br>
                <label>Email</label>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg border-gray-300 mt-5 focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your Email"
                  onChange={func1}
                  value={data.email}
                  name="email"
                  required
                ></input>
                {error.email && (
                  <p className="text-red-500 font-serif text-sm mt-1">
                    {error.email}
                  </p>
                )}
                <br></br>
                <br></br>
                <label>Qualification</label>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg border-gray-300 mt-5 focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your Qualification"
                  onChange={func1}
                  value={data.qualification}
                  name="qualification"
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
              <div className="p-6  rounded-lg shadow-md text-center ml-5">
                <h2 className="text-2xl font-bold text-purple-700 mb-5">
                  Location Details
                </h2>
                <p>Address</p>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter Address"
                  onChange={func1}
                  value={data.address.addressLine1}
                  name="address.addressLine1"
                  required
                ></input>
                <br></br>
                <br></br>
                <p>Street</p>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your Street"
                  onChange={func1}
                  value={data.address.street}
                  name="address.street"
                  required
                ></input>
                <br></br>
                <br></br>
                <p>Country</p>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your Country"
                  onChange={func1}
                  value={data.address.country}
                  name="address.country"
                  required
                ></input>
                <br></br>
                <br></br>
                <p>State</p>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your State"
                  onChange={func1}
                  value={data.address.state}
                  name="address.state"
                  required
                ></input>
                <br></br>
                <br></br>
                <p>City</p>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your City"
                  onChange={func1}
                  value={data.address.city}
                  name="address.city"
                  required
                ></input>
                <br></br>
                <br></br>
                <p>Pincode</p>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your Pincode"
                  onChange={func1}
                  value={data.address.pincode}
                  name="address.pincode"
                  required
                ></input>
                {error.pincode && (
                  <p className="text-red-500 font-serif text-sm mt-1">
                    {error.pincode}
                  </p>
                )}
                <div className="mt-5 flex justify-between">
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
              <div className="p-6  rounded-lg shadow-md text-center ml-5">
                <p
                  className="
text-2xl font-bold text-purple-700 mb-5    "
                >
                  Fee per Appoinment
                </p>
                <br></br>
                <br></br>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-500"
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
                <br></br>
                <br></br>
                <div className="mt-5 flex justify-between">
                  <button
                    className="rounded-3xl bg-blue-500 w-full text-white p-3 mr-2 "
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
            {step === 5 && (
              <div className="p-6  rounded-lg shadow-md text-center ml-5">
                <p className="text-2xl font-bold text-purple-700 mb-5">
                  Years of Experience
                </p>
                <br></br>
                <br></br>
                <input
                  type="number"
                  className="w-full p-3 rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-500"
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
                <br></br>
                <br></br>
                <div className="mt-5 flex justify-between">
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
            {step === 6 && (
              <div className="p-6  rounded-lg shadow-md text-center ml-5">
                <h2 className="text-2xl font-bold text-purple-700 mb-5 ">
                  Authentication
                </h2>
                <label>Licensing</label>
                <br></br>
                <br></br>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-500"
                  placeholder="Eg. License Number, Issuing authority"
                  onChange={func1}
                  value={data.license}
                  name="license"
                  required
                ></input>
                <br></br>
                <br></br>
                <p>Phone Number</p>
                <br></br>
                <br></br>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your Phone no"
                  onChange={func1}
                  value={data.phone}
                  name="phone"
                  required
                ></input>
                {error.phone && (
                  <p className="text-red-500 font-serif text-sm mt-1">
                    {error.phone}
                  </p>
                )}
                <br></br>
                <br></br>
                <div className="mt-5 flex justify-between">
                  <button
                    className="rounded-3xl bg-blue-500 w-full text-white p-3 mr-2"
                    type="button"
                    onClick={handleBack}
                  >
                    Back
                  </button>
                  <br></br>
                  <button
                    className="rounded-3xl bg-purple-500 w-full text-white p-3 mr-2 hover:bg-purple-700"
                    type="submit"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === 7 && (
              <div className="p-6  rounded-lg shadow-md text-center ml-5">
                <h2 className="text-2xl font-bold text-purple-700 mb-5">
                  Availability
                </h2>
                <label>Morning</label>
                <br></br>
                <br></br>
                <TimePicker
                  type="time"
                  className="w-full p-3 rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-500 "
                  onChange={(value) =>
                    func1({
                      target: { name: "availability.morningStart", value },
                    })
                  }
                  value={data.availability.morningStart}
                  name="data.availability.morningStart"
                  format="h:mm a"
                  required
                ></TimePicker>
                <TimePicker
                  type="time"
                  className="w-full p-3 rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-500 "
                  onChange={(value) =>
                    func1({
                      target: { name: "availability.morningEnd", value },
                    })
                  }
                  value={data.availability.morningEnd}
                  name="data.availability.morningEnd"
                  format="h:mm a"
                  required
                ></TimePicker>
                <TimePicker
                  type="time"
                  className="w-full p-3 rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-500 "
                  onChange={(value) =>
                    func1({
                      target: { name: "availability.eveningStart", value },
                    })
                  }
                  value={data.availability.eveningStart}
                  name="data.availability.eveningStart"
                  format="h:mm a"
                  required
                ></TimePicker>
                <TimePicker
                  type="time"
                  className="w-full p-3 rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-500 "
                  onChange={(value) =>
                    func1({
                      target: { name: "availability.eveningEnd", value },
                    })
                  }
                  value={data.availability.eveningEnd}
                  name="data.availability.eveningEnd"
                  format="h:mm a"
                  required
                ></TimePicker>
                <br></br>
                <br></br>
                <div className="mt-5 flex justify-between">
                  <button
                    className="rounded-3xl bg-blue-500 w-full text-white p-3 mr-2"
                    type="button"
                    onClick={handleBack}
                  >
                    Back
                  </button>
                  <br></br>
                  <button
                    className="rounded-3xl bg-purple-500 w-full text-white p-3 mr-2 hover:bg-purple-700"
                    type="submit"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
            {step === 8 && (
              <div className="p-6  rounded-lg shadow-md text-center ml-5">
                <h2 className="text-2xl font-bold text-purple-700 mb-5">
                  About
                </h2>
                <label>Biograpghy</label>
                <br></br>
                <br></br>
                <input
                  type="textarea"
                  className="w-full p-3 rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-500 "
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
                <br></br>
                <br></br>
                <p>Profile</p>
                <br></br>
                <br></br>
                <input
                  type="file"
                  className="w-full p-3 rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-500"
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
                )}
                <br></br>
                <br></br>
                <div className="mt-5 flex justify-between">
                  <button
                    className="rounded-3xl bg-blue-500 w-full text-white p-3 mr-2"
                    type="button"
                    onClick={handleBack}
                  >
                    Back
                  </button>
                  <br></br>
                  <button
                    className="rounded-3xl bg-purple-500 w-full text-white p-3 mr-2 hover:bg-green-500"
                    type="submit"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}

            {/* </div> */}
          </form>
        </section>
      </div>
    </div>
  );
}
