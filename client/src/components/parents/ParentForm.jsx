import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from "../../redux/user/userSlice";
import BeatLoader from "react-spinners/BeatLoader";
import toast from "react-hot-toast";
import TopLoadingBar from "react-top-loading-bar";
import Select from "react-select";
import Input from "react-phone-number-input/input";
import { IoMdAlert } from "react-icons/io";
import { suggestions } from "../suggestions";

export default function ParentForm() {
  const { currentUser, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [btnloader, setBtnLoader] = useState(false);
  const TopLoadingBarRef = useRef(null);
  const [value, setValue] = useState();
  const [emergvalue, setEmergValue] = useState();
  const [isModified, setIsModified] = useState(false);
  const [phoneValid, setPhoneValid] = useState(true);
  const [emergencyContact, setEmergencyContact] = useState(true);
  const [formData, setFormData] = useState({
    isParent: false,
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
      emergencyContact: emergvalue,
      insurance: "",
      address: "",
      phoneNumber: value,
    },
  });

  const handleChange = (e) => {
    let value = e.target.value;
    const id = e.target.id;
    const maxLength = {
      fullName: 15,
      childName: 15,
      bloodGroup: 10,
      height: 3,
      weight: 3,
      medicalHistory: 30,
      allergies: 30,
      insurance: 30,
      address: 100,
    };

    if (maxLength[id] && value.length > maxLength[id]) {
      return;
    }
    if (e.target.id === "phoneNumber") {
      if (value.length !== 10) {
        setPhoneValid(false);
      } else {
        setPhoneValid(true);
      }
    }
    if (e.target.id === "isParent") {
      value = e.target.value === "Yes" ? true : false;
      setFormData({
        ...formData,
        isParent: value,
      });
    } else {
      setFormData({
        ...formData,
        parentDetails: {
          ...formData.parentDetails,
          [e.target.id]: value,
        },
      });
    }
    setIsModified(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isModified) {
      return;
    }
    if (formData.parentDetails?.phoneNumber.length !== 13) {
      toast.error("Phone number should be 10 digits");
      setPhoneValid(false);
      return;
    } else {
      setPhoneValid(true);
    }
    if (formData.parentDetails?.emergencyContact.length !== 13) {
      toast.error("Emergency Contact should be 10 digits");
      setEmergencyContact(false);
      return;
    } else {
      setEmergencyContact(true);
    }

    dispatch(updateUserStart());
    try {
      TopLoadingBarRef.current.continuousStart(50);
      dispatch(updateUserStart());
      setBtnLoader(true);
      const res = await fetch(`server/parent/updateparent/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data));
        return;
      }
      dispatch(updateUserSuccess(data));

      if (formData.isParent) {
        toast.success("Parent details updated successfully");
      } else {
        toast.error("Parent Details Successfully Removed");
      }
      setIsModified(false);
      setBtnLoader(false);
    } catch (error) {
      dispatch(updateUserFailure(error));
    } finally {
      TopLoadingBarRef.current.complete();
    }
  };

  useEffect(() => {
    const fetchParentDetails = async () => {
      dispatch(updateUserStart());
      setLoading(true);
      try {
        const res = await fetch(`server/parent/getparent/${currentUser._id}`);
        const data = await res.json();
        if (data.success === false) {
          return;
        }
        const definedData = {
          isParent: data.isParent || false,
          lookingFor: data.parentDetails?.lookingFor || [],
          childName: data.parentDetails?.childName || "",
          fullName: data.parentDetails?.fullName || "",
          dob: data.parentDetails?.dob
            ? new Date(data.parentDetails?.dob).toISOString().split("T")[0]
            : "",
          gender: data.parentDetails?.gender || "",
          height: data.parentDetails?.height || "",
          weight: data.parentDetails?.weight || "",
          bloodGroup: data.parentDetails?.bloodGroup || "",
          medicalHistory: data.parentDetails?.medicalHistory || "",
          allergies: data.parentDetails?.allergies || "",
          emergencyContact: data.parentDetails?.emergencyContact || "",
          insurance: data.parentDetails?.insurance || "",
          address: data.parentDetails?.address || "",
          phoneNumber: data.parentDetails?.phoneNumber || "",
        };
        setFormData({
          isParent: data.isParent || false,
          parentDetails: definedData,
        });
        dispatch(updateUserSuccess(data));
      } catch (error) {
        console.log(error);
        dispatch(updateUserFailure(error));
      }
      setLoading(false);
    };
    fetchParentDetails();
  }, [currentUser._id, dispatch]);

  return (
    <div className="p-3 flex-col items-center rounded-lg">
      <TopLoadingBar ref={TopLoadingBarRef} color="#ff9900" height={3} />
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <BeatLoader color="#10ebd8" loading={loading} size={15} />
        </div>
      ) : (
        <>
          <div className="flex">
            <h1 className="p-2 text-gray font-bold text-2xl">
              Your Parent Details :
            </h1>
          </div>
          <form
            onSubmit={handleSubmit}
            className="p-4 flex flex-col sm:flex-row md:gap-4 gap-4 md:w-[1200px] mx-auto justify-center"
          >
            <div className="flex flex-col flex-1 gap-2">
              <label
                htmlFor="isParent"
                className="text-sm font-semibold text-main"
              >
                Are you a parent?
              </label>
              <select
                id="isParent"
                name="isParent"
                value={formData.isParent ? "Yes" : "No"}
                onChange={handleChange}
                className="input border-2 p-2 rounded-lg focus:ring-0"
                required
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              <label
                htmlFor="gender"
                className="text-sm font-semibold text-main"
              >
                Gender:
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.parentDetails?.gender}
                onChange={handleChange}
                className="input border-2 p-2 rounded-lg  focus:outline-none focus:ring-0"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <label className="text-sm font-semibold text-main">
                BloodGroup*
              </label>
              <input
                type="text"
                placeholder="BloodGroup"
                className="input border-2 p-2 rounded-lg focus:outline-none focus:ring-0"
                id="bloodGroup"
                required
                onChange={handleChange}
                value={formData.parentDetails?.bloodGroup}
              />
              <label
                htmlFor="gender"
                className="text-sm font-semibold text-main"
              >
                <p className="flex flex-row items-center">
                  {!emergencyContact && (
                    <IoMdAlert className="text-red-700 text-sm" />
                  )}
                  Emergency Contact :{" "}
                </p>
              </label>
              <Input
                placeholder="Emergency Contact"
                className={`border-2 p-2 input rounded-lg focus:outline-none focus:ring-0 ${
                  !phoneValid ? "error" : ""
                }`}
                maxLength="15"
                value={formData.parentDetails?.emergencyContact}
                onChange={(value) => {
                  setEmergValue(value);
                  setFormData({
                    ...formData,
                    parentDetails: {
                      ...formData.parentDetails,
                      emergencyContact: value,
                    },
                  });
                  setIsModified(true);
                }}
                required
              />
              {!emergencyContact && (
                <p className="text-sm text-red-500 font-semibold">
                  Please enter a 10-digit number
                </p>
              )}
              <label
                htmlFor="gender"
                className="text-sm font-semibold text-main"
              >
                Address : (city, state, pincode)
              </label>
              <textarea
                type="text"
                placeholder="Address"
                rows={3}
                className="border-2 p-2 rounded-lg input focus:outline-none focus:ring-0"
                id="address"
                required
                onChange={handleChange}
                value={formData.parentDetails?.address}
              />
            </div>
            <div className="flex flex-col flex-1 gap-2 w-full">
              <label
                name="fullName"
                className="text-sm font-semibold text-main"
              >
                Enter your Full Name :
              </label>
              <input
                type="text"
                placeholder="Full Name"
                className="input border-2 p-2 rounded-lg focus:ring-0"
                id="fullName"
                maxLength="62"
                minLength="5"
                required
                onChange={handleChange}
                value={formData.parentDetails?.fullName}
              />
              <label
                name="fullName"
                className="text-sm font-semibold text-main"
              >
                Enter your DOB :
              </label>
              <input
                type="date"
                placeholder="Date of Birth"
                className="input border-2 p-2 rounded-lg  focus:ring-0"
                id="dob"
                required
                onChange={handleChange}
                value={formData.parentDetails?.dob}
              />
              <label className="text-sm font-semibold text-main">
                Height Kg*
              </label>
              <input
                type="number"
                placeholder="Height"
                className="input border-2 p-2 rounded-lg focus:outline-none focus:ring-0"
                id="height"
                required
                onChange={handleChange}
                value={formData.parentDetails?.height}
              />
              <label className="text-sm font-semibold text-main">
                Medical History*
              </label>
              <input
                type="text"
                placeholder="Medical History"
                className="input border-2 p-2 rounded-lg focus:outline-none focus:ring-0"
                id="medicalHistory"
                required
                onChange={handleChange}
                value={formData.parentDetails?.medicalHistory}
              />

              <label
                htmlFor="gender"
                className="text-sm font-semibold text-main"
              >
                Insurance :
              </label>
              <input
                type="text"
                placeholder="Insurance"
                className="border-2 p-2 rounded-lg input focus:outline-none focus:ring-0"
                id="insurance"
                required
                onChange={handleChange}
                value={formData.parentDetails?.insurance}
              />
            </div>
            <div className="flex flex-col flex-1 gap-2 w-full">
              <label
                name="fullName"
                className="text-sm font-semibold text-main"
              >
                What therapy your looking for?
              </label>
              <Select
                id="name"
                key={formData.parentDetails?.lookingFor}
                options={suggestions}
                isMulti
                required
                placeholder="looking for?"
                touchUi={false}
                className="border-2 rounded-lg border-slate-300 bg-white input hover:border-purple-400"
                defaultValue={
                  Array.isArray(formData.parentDetails?.lookingFor)
                    ? formData.parentDetails?.lookingFor.map((name) =>
                        suggestions.find((option) => option.value === name)
                      )
                    : []
                }
                onChange={(selectedOptions) => {
                  setFormData((preState) => ({
                    ...preState,
                    parentDetails: {
                      ...preState.parentDetails,
                      lookingFor: selectedOptions.map((option) => option.value),
                    },
                  }));
                  setIsModified(true);
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
              <label className="text-sm font-semibold text-main">
                Child Name*
              </label>
              <input
                type="text"
                placeholder="Child Name"
                className="input border-2 p-2 rounded-lg focus:outline-none focus:ring-0 "
                id="childName"
                required
                onChange={handleChange}
                value={formData.parentDetails?.childName}
              />
              <label className="text-sm font-semibold text-main">Weight*</label>
              <input
                type="number"
                placeholder="Weight cm*"
                className="input border-2 p-2 rounded-lg focus:outline-none focus:ring-0 "
                id="weight"
                required
                onChange={handleChange}
                value={formData.parentDetails?.weight}
              />
              <label className="text-sm font-semibold text-main">
                Allergies :
              </label>
              <input
                type="text"
                placeholder="Allergies"
                className="input border-2 p-2 rounded-lg focus:outline-none focus:ring-0"
                id="allergies"
                required
                onChange={handleChange}
                value={formData.parentDetails?.allergies}
              />
              <label className="text-sm font-semibold text-main">
                <p className="flex flex-row items-center">
                  {!phoneValid && (
                    <IoMdAlert className="text-red-700 text-sm" />
                  )}
                  Phone Number :{" "}
                </p>
              </label>
              <Input
                placeholder="Enter phone number"
                className={`border-2 p-2 input rounded-lg focus:outline-none focus:ring-0 ${
                  !phoneValid ? "error" : ""
                }`}
                value={formData.parentDetails?.phoneNumber}
                onChange={(value) => {
                  setValue(value);
                  setFormData({
                    ...formData,
                    parentDetails: {
                      ...formData.parentDetails,
                      phoneNumber: value,
                    },
                  });
                  setIsModified(true);
                }}
                required
              />
              {!phoneValid && (
                <p className="text-sm text-red-500 font-semibold">
                  Please enter a 10-digit number
                </p>
              )}
              <button
                disabled={!isModified || loading}
                className="p-2 btn-color rounded-lg mt-8 font-semibold rounded=lg uppercase hover:opacity-95 disabled:opacity-60 transition ease-in-out duration-300"
              >
                {btnloader ? "Saving..." : "Save"}
              </button>
              {error && <p className="text-red-700 text-xs">{error}</p>}
            </div>
          </form>
        </>
      )}
    </div>
  );
}
