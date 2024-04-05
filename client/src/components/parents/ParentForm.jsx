import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from "../../redux/user/userSlice";
import { useNavigate } from "react-router";

export default function ParentForm() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    isParent: false,
    fullName: "",
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
  });

  const handleChange = (e) => {
    let value = e.target.value;
    if (e.target.id === "isParent") {
      value = e.target.value === "Yes" ? true : false;
    }
    setFormData({
      ...formData,
      [e.target.id]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`server/user/updateparent/${currentUser._id}`, {
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
      navigate("/");
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };

useEffect(() => {
  const fetchParentDetails = async () => {
    try {
      const res = await fetch(`server/parent/getparent/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        return;
      }
      // Ensure all properties are defined
      const definedData = {
        isParent: data.isParent || false,
        fullName: data.fullName || "",
        dob: data.dob || "",
        gender: data.gender || "",
        height: data.height || "",
        weight: data.weight || "",
        bloodGroup: data.bloodGroup || "",
        medicalHistory: data.medicalHistory || "",
        allergies: data.allergies || "",
        emergencyContact: data.emergencyContact || "",
        insurance: data.insurance || "",
        address: data.address || "",
        phoneNumber: data.phoneNumber || "",
      };
      setFormData(definedData);
      console.log(definedData);
    } catch (error) {
      console.log(error);
    }
  };
  fetchParentDetails();
}, [currentUser._id]);
  return (
    <div className="p-3 max-w-4xl mx-auto flex-col items-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-4 mt-6"
      >
        <div className="flex flex-col gap-4 flex-1">
          <label htmlFor="isParent" className="text-sm text-gray-700">
            Are you a parent?
          </label>
          <select
            id="isParent"
            name="isParent"
            value={formData.isParent ? "Yes" : "No"}
            onChange={handleChange}
            className="border-2 p-3 rounded-lg focus:border-amber-600 focus:ring-0"
            required
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          <label name="fullName" className="text-sm text-gray-700">
            Enter your Full Name :
          </label>
          <input
            type="text"
            placeholder="Full Name"
            className="border-2 p-3 rounded-lg focus:border-amber-600 focus:ring-0"
            id="fullName"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.fullName}
          />
          <label name="fullName" className="text-sm text-gray-700">
            Enter your DOB :
          </label>
          <input
            type="date"
            placeholder="Date of Birth"
            className="border-2 p-3 rounded-lg focus:border-amber-600 focus:ring-0"
            id="dob"
            required
            onChange={handleChange}
            value={formData.dob}
          />
          <label htmlFor="gender" className="text-sm text-gray-700">
            Gender:
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="border-2 p-3 rounded-lg focus:border-amber-600 focus:ring-0"
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <input
            type="text"
            placeholder="Height"
            className="border-2 p-3 rounded-lg focus:border-amber-700 focus:outline-none focus:ring-0"
            id="height"
            required
            onChange={handleChange}
            value={formData.height}
          />
          <input
            type="text"
            placeholder="Weight"
            className="border-2 p-3 rounded-lg focus:border-amber-700 focus:outline-none focus:ring-0"
            id="weight"
            required
            onChange={handleChange}
            value={formData.weight}
          />
          <input
            type="text"
            placeholder="BloodGroup"
            className="border-2 p-3 rounded-lg focus:border-amber-700 focus:outline-none focus:ring-0"
            id="bloodGroup"
            required
            onChange={handleChange}
            value={formData.bloodGroup}
          />
          <input
            type="text"
            placeholder="Medical History"
            className="border-2 p-3 rounded-lg focus:border-amber-700 focus:outline-none focus:ring-0"
            id="medicalHistory"
            required
            onChange={handleChange}
            value={formData.medicalHistory}
          />
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <label htmlFor="gender" className="text-sm text-gray-700">
            Allergies :
          </label>
          <input
            type="text"
            placeholder="Allergies"
            className="border-2 p-3 rounded-lg focus:border-amber-700 focus:outline-none focus:ring-0"
            id="allergies"
            required
            onChange={handleChange}
            value={formData.allergies}
          />
          <label htmlFor="gender" className="text-sm text-gray-700">
            Emergency Contact :
          </label>
          <input
            type="text"
            placeholder="Emergency Contact"
            className="border-2 p-3 rounded-lg focus:border-amber-700 focus:outline-none focus:ring-0"
            id="emergencyContact"
            required
            onChange={handleChange}
            value={formData.emergencyContact}
          />
          <label htmlFor="gender" className="text-sm text-gray-700">
            Insurance :
          </label>
          <input
            type="text"
            placeholder="Insurance"
            className="border-2 p-3 rounded-lg focus:border-amber-700 focus:outline-none focus:ring-0"
            id="insurance"
            required
            onChange={handleChange}
            value={formData.insurance}
          />
          <label htmlFor="gender" className="text-sm text-gray-700">
            Address : (city, state, country, pincode)
          </label>
          <textarea
            type="text"
            placeholder="Address"
            className="border-2 p-3 rounded-lg focus:border-amber-700 focus:outline-none focus:ring-0"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <label htmlFor="gender" className="text-sm text-gray-700">
            Phone Number :
          </label>
          <input
            type="text"
            placeholder="Phone Number"
            className="border-2 p-3 rounded-lg focus:border-amber-700 focus:outline-none focus:ring-0"
            id="phoneNumber"
            required
            onChange={handleChange}
            value={formData.phoneNumber}
          />
          <button
            disabled={loading}
            className="p-3 bg-slate-700 text-white rounded=lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Saving..." : "Save"}
          </button>
          {error && <p className="text-red-700 text-xs">{error}</p>}
        </div>
      </form>
    </div>
  );
}
