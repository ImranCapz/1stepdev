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

export default function ParentForm() {
  const { currentUser, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [btnloader, setBtnLoader] = useState(false);
  const TopLoadingBarRef = useRef(null);
  const [isModified, setIsModified] = useState(false);
  const [formData, setFormData] = useState({
    isParent: false,
    parentDetails: {
      fullName: "",
      lookingFor: [],
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
  console.log(formData);

  const service = [
    { value: "Diagnostic Evaluation", label: "Diagnostic Evaluation" },
    { value: "Speech Therapy", label: "Speech Therapy" },
    { value: "ABA Therapy", label: "ABA Therapy" },
    { value: "Occupational Therapy", label: "Occupational Therapy" },
    { value: "School-Based Service", label: "School-Based Service" },
    { value: "Dance Movement", label: "Dance Movement" },
    { value: "Art as Therapy", label: "Art as Therapy" },
    { value: "Counselling", label: "Counselling" },
  ];

  const handleChange = (e) => {
    let value = e.target.value;
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
        console.log(data);
        if (data.success === false) {
          return;
        }
        const definedData = {
          isParent: data.isParent || false,
          lookingFor: data.parentDetails?.lookingFor || [],
          fullName: data.parentDetails?.fullName || "",
          dob: data.parentDetails?.dob ? new Date(data.parentDetails?.dob).toISOString().split("T")[0] : "",
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
    <div className="p-7 max-w-2xl flex-col items-center  rounded-lg">
      <TopLoadingBar ref={TopLoadingBarRef} color="#ff9900" height={3} />
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <BeatLoader color="#10ebd8" loading={loading} size={15} />
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row md:gap-14 gap-4 justify-between w-full"
        >
          <div className="flex flex-col flex-1 gap-2 w-full">
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
              className="input border-2 p-2 rounded-lg focus:ring-0 md:w-60"
              required
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            <label htmlFor="gender" className="text-sm font-semibold text-main">
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
              className="input border-2 p-2 rounded-lg focus:outline-none focus:ring-0 "
              id="bloodGroup"
              required
              onChange={handleChange}
              value={formData.parentDetails?.bloodGroup}
            />
            <label htmlFor="gender" className="text-sm font-semibold text-main">
              Emergency Contact :
            </label>
            <input
              type="text"
              placeholder="Emergency Contact"
              className="border-2 p-2 rounded-lg input focus:outline-none focus:ring-0"
              id="emergencyContact"
              required
              onChange={handleChange}
              value={formData.parentDetails?.emergencyContact}
            />
            <label htmlFor="gender" className="text-sm font-semibold text-main">
              Address : (city, state, country, pincode)
            </label>
            <textarea
              type="text"
              placeholder="Address"
              className="border-2 p-2 rounded-lg input focus:outline-none focus:ring-0"
              id="address"
              required
              onChange={handleChange}
              value={formData.parentDetails?.address}
            />
          </div>
          <div className="flex flex-col flex-1 gap-2 w-full">
            <label name="fullName" className="text-sm font-semibold text-main">
              Enter your Full Name :
            </label>
            <input
              type="text"
              placeholder="Full Name"
              className="input border-2 p-2 rounded-lg focus:ring-0 md:w-60"
              id="fullName"
              maxLength="62"
              minLength="10"
              required
              onChange={handleChange}
              value={formData.parentDetails?.fullName}
            />
            <label name="fullName" className="text-sm font-semibold text-main">
              What therapy your looking for?
            </label>
            <Select
              id="name"
              key={formData.parentDetails?.lookingFor}
              options={service}
              isMulti
              required
              placeholder="looking for?"
              touchUi={false}
              className="border-2 p-1 rounded-lg border-slate-300 input hover:border-purple-400"
              defaultValue={
                Array.isArray(formData.parentDetails?.lookingFor)
                  ? formData.parentDetails?.lookingFor.map((name) =>
                      service.find((option) => option.value === name)
                    )
                  : []
              }
              onChange={(selectedOptions) => {
                setFormData((preState) => ({
                  ...preState,
                  parentDetails:{
                    ...preState.parentDetails,
                    lookingFor: selectedOptions.map((option)=> option.value)
                  }
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
            <label className="text-sm font-semibold text-main">Height*</label>
            <input
              type="text"
              placeholder="Height"
              className="input border-2 p-2 rounded-lg  focus:outline-none focus:ring-0"
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

            <label htmlFor="gender" className="text-sm font-semibold text-main">
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
            <label name="fullName" className="text-sm font-semibold text-main">
              Enter your DOB :
            </label>
            <input
              type="date"
              placeholder="Date of Birth"
              className="input border-2 p-2 rounded-lg  focus:ring-0 md:w-60"
              id="dob"
              required
              onChange={handleChange}
              value={formData.parentDetails?.dob}
            />
            <label className="text-sm font-semibold text-main">Weight*</label>
            <input
              type="text"
              placeholder="Weight"
              className="input border-2 p-2 rounded-lg focus:outline-none focus:ring-0 "
              id="weight"
              required
              onChange={handleChange}
              value={formData.parentDetails?.weight}
            />
            <label htmlFor="gender" className="text-sm font-semibold text-main">
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
            <label htmlFor="gender" className="text-sm font-semibold text-main">
              Phone Number :
            </label>
            <input
              type="text"
              placeholder="Phone Number"
              className="border-2 p-2 rounded-lg input focus:outline-none focus:ring-0"
              id="phoneNumber"
              required
              onChange={handleChange}
              value={formData.parentDetails?.phoneNumber}
            />
            <button
              disabled={!isModified || loading}
              className="p-3 btn-color rounded-lg mt-16 font-semibold rounded=lg uppercase hover:opacity-95 disabled:opacity-60 transition ease-in-out duration-300"
            >
              {btnloader ? "Saving..." : "Save"}
            </button>
            {error && <p className="text-red-700 text-xs">{error}</p>}
          </div>
        </form>
      )}
    </div>
  );
}
