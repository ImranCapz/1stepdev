import { useEffect, useState,useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from "../../redux/user/userSlice";
import BeatLoader from "react-spinners/BeatLoader";
import toast from "react-hot-toast";
import TopLoadingBar from "react-top-loading-bar";


export default function ParentForm() {
  const { currentUser, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [loading , setLoading] = useState(false);
  const [btnloader, setBtnLoader] = useState(false);
  const TopLoadingBarRef = useRef(null);
  const [isModified, setIsModified] = useState(false);
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
    setIsModified(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!isModified){
      return;
    }
    dispatch(updateUserStart());
    try {
      TopLoadingBarRef.current.continuousStart(50);
      dispatch(updateUserStart());
      setBtnLoader(true);
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
     if(formData.isParent){
      toast.success("Parent details updated successfully");
     }else{
      toast.error("Parent Details Successfully Removed")
     }
     setBtnLoader(false);
    } catch (error) {
      dispatch(updateUserFailure(error));
    }finally{
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
          fullName: data.fullName || "",
          dob: data.dob ? new Date(data.dob).toISOString().split('T')[0] : "",
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
    <div className="p-7 max-w-2xl mx-auto flex-col items-center bg-white rounded-lg">
      <TopLoadingBar ref={TopLoadingBarRef} color="#ff9900" height={3} />
      {loading ? (
        <div style={{ display:'flex', justifyContent:'center', alignItems:'center' }}> 
        <BeatLoader color="#10ebd8" loading={loading} size={15} />
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-4 mt-6"
        >  
          <div className="flex flex-col gap-2 flex-1">
            <label htmlFor="isParent" className="text-sm font-semibold text-main">
              Are you a parent?
            </label>
            <select
              id="isParent"
              name="isParent"
              value={formData.isParent ? "Yes" : "No"}
              onChange={handleChange}
              className="input border-2 p-3 rounded-lg focus:ring-0 "
              required
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            
            <label name="fullName" className="text-sm font-semibold text-main">
              Enter your Full Name :
            </label>
            <input
              type="text"
              placeholder="Full Name"
              className="input border-2 p-3 rounded-lg focus:ring-0 "
              id="fullName"
              maxLength="62"
              minLength="10"
              required
              onChange={handleChange}
              value={formData.fullName}
            />
            <label name="fullName" className="text-sm font-semibold text-main">
              Enter your DOB :
            </label>
            <input
              type="date"
              placeholder="Date of Birth"
              className="input border-2 p-3 rounded-lg  focus:ring-0"
              id="dob"
              required
              onChange={handleChange}
              value={formData.dob}
            />
            <label htmlFor="gender" className="text-sm font-semibold text-main">
              Gender:
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="input border-2 p-3 rounded-lg  focus:outline-none focus:ring-0"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <label className="font-semibold text-main">Height*</label>
            <input
              type="text"
              placeholder="Height"
              className="input border-2 p-3 rounded-lg  focus:outline-none focus:ring-0"
              id="height"
              required
              onChange={handleChange}
              value={formData.height}
            />
            <label className="font-semibold text-main">Weight*</label>
            <input
              type="text"
              placeholder="Weight"
              className="input border-2 p-3 rounded-lg focus:outline-none focus:ring-0 "
              id="weight"
              required
              onChange={handleChange}
              value={formData.weight}
            />
            <label className="font-semibold text-main">BloodGroup*</label>
            <input
              type="text"
              placeholder="BloodGroup"
              className="input border-2 p-3 rounded-lg focus:outline-none focus:ring-0 "
              id="bloodGroup"
              required
              onChange={handleChange}
              value={formData.bloodGroup}
            />
            
          </div>
          <div className="flex flex-col flex-1 gap-2">
          <label className="font-semibold text-main">Medical History*</label>
            <input
              type="text"
              placeholder="Medical History"
              className="input border-2 p-3 rounded-lg focus:outline-none focus:ring-0"
              id="medicalHistory"
              required
              onChange={handleChange}
              value={formData.medicalHistory}
            />
            <label htmlFor="gender" className="text-sm font-semibold text-main">
              Allergies :
            </label>
            <input
              type="text"
              placeholder="Allergies"
              className="input border-2 p-3 rounded-lg focus:outline-none focus:ring-0"
              id="allergies"
              required
              onChange={handleChange}
              value={formData.allergies}
            />
            <label htmlFor="gender" className="text-sm font-semibold text-main">
              Emergency Contact :
            </label>
            <input
              type="text"
              placeholder="Emergency Contact"
              className="border-2 p-3 rounded-lg input focus:outline-none focus:ring-0"
              id="emergencyContact"
              required
              onChange={handleChange}
              value={formData.emergencyContact}
            />
            <label htmlFor="gender" className="text-sm font-semibold text-main">
              Insurance :
            </label>
            <input
              type="text"
              placeholder="Insurance"
              className="border-2 p-3 rounded-lg input focus:outline-none focus:ring-0"
              id="insurance"
              required
              onChange={handleChange}
              value={formData.insurance}
            />
            <label htmlFor="gender" className="text-sm font-semibold text-main">
              Address : (city, state, country, pincode)
            </label>
            <textarea
              type="text"
              placeholder="Address"
              className="border-2 p-3 rounded-lg input focus:outline-none focus:ring-0"
              id="address"
              required
              onChange={handleChange}
              value={formData.address}
            />
            <label htmlFor="gender" className="text-sm font-semibold text-main">
              Phone Number :
            </label>
            <input
              type="text"
              placeholder="Phone Number"
              className="border-2 p-3 rounded-lg input focus:outline-none focus:ring-0"
              id="phoneNumber"
              required
              onChange={handleChange}
              value={formData.phoneNumber}
            />
            <button
              disabled={!isModified || loading}
              className="p-3 btn-color rounded-lg font-semibold rounded=lg uppercase hover:opacity-95 disabled:opacity-60 transition ease-in-out duration-300"
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
