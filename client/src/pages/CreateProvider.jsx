import { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useRef } from "react";
import Select from "react-select";

export default function CreateProvider() {
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    email: "",
    qualification: "",
    license: "",
    fullName: "",
    experience: "",
    phone: "",
    address: "",
    therapytype: "",
    availability: {
      morningStart:"08:00",
      morningEnd: "12:00",
      eveningStart: "13:00",
      eveningEnd: "17:00",
    },
    regularPrice: "",
    description: "",
    profilePicture: "",
  });
  console.log(formData);

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
          return toast.success("Image uploaded successfully");
        })
        .catch(() => {
          toast.error("Image upload failed(2 mb max per image)");
          setUploading(false);
        });
    } else {
      toast.error("you can only upload 6 images per provider");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress} % done`);
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

  const handleChange = (e) => {
    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea" ||
      e.target.type === "email"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    } else if (e.target.type === "time") {
      setFormData((prevState) => ({
        ...prevState,
        availability: {
          ...prevState.availability,
          [e.target.id]: e.target.value,
        },
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return toast.error("You must upload at least one image");
      setLoading(true);
      setError(false);
      const res = await fetch("/server/provider/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success) {
        setError(data.message);
      }
      navigate(`/provider/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleImageClick = (e) => {
    e.preventDefault();
    fileRef.current.click();
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      storeImage(file)
        .then((url) => {
          setFormData({
            ...formData,
            profilePicture: url,
          });
          setUploading(false);
          toast.success("Profile image uploaded successfully");
        })
        .catch(() => {
          toast.error("Profile image upload failed");
          setUploading(false);
        });
    }
  };

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

  const therapyType = [
    { value: "Virtual", label: "Virtual" },
    { value: "In-Clinic", label: "In-Clinic" },
    { value: "In-Home", label: "In-Home" },
  ]
  return (
    <div className="p-10 w-full mx-auto flex-col items-center">
      <h1 className="text-base text-gray-700 font-semibold text-left my-7 mt-5">
        Fill the form to create a provider
      </h1>
      <input
        type="file"
        id="profilePicture"
        name="profilePicture"
        ref={fileRef}
        hidden
        accept="image/*"
        required
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
              formData.profilePicture ||
              "https://i.ibb.co/tKQH4zp/defaultprofile.jpg"
            }
            alt="profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-[lightgray]"
          />
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
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-4 mt-6"
      >
        <div className="flex flex-col gap-4 flex-1">
          <Select
            id="name"
            options={service}
            isMulti
            required
            placeholder="What service do you provide?"
            touchUi={false}
            className="border-2 p-3 rounded-lg border-slate-500 focus:border-amber-700  hover:border-amber-500"
            onChange={(selectedOptions) => {
              setFormData((preState) => ({
                ...preState,
                name: selectedOptions.map((option) => option.value),
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
          <input
            type="text"
            placeholder="Full Name*"
            className="border-2 p-3 rounded-lg focus:border-amber-700 focus:outline-none focus:ring-0"
            id="fullName"
            required
            onChange={handleChange}
            value={formData.fullName}
          />
          <input
            type="email"
            placeholder="Email"
            className="border-2 p-3 rounded-lg focus:border-amber-600 focus:ring-0"
            id="email"
            required
            onChange={handleChange}
            value={formData.email}
          />
          <input
            type="text"
            placeholder="Qualification(e.g.,Psychologist, Counselor)"
            className="border-2 p-3 rounded-lg focus:border-amber-600 focus:ring-0"
            id="qualification"
            required
            onChange={handleChange}
            value={formData.qualification}
          />

          <input
            type="text"
            placeholder="Licensing (License number, issuing authority)"
            className="border-2 p-3 rounded-lg focus:border-amber-700 focus:outline-none focus:ring-0"
            id="license"
            required
            onChange={handleChange}
            value={formData.license}
          />
          <input
            type="number"
            placeholder="Phone number"
            className="border-2 p-3 rounded-lg focus:border-amber-700 focus:outline-none focus:ring-0"
            id="phone"
            required
            onChange={handleChange}
            value={formData.phone}
          />
          <input
            type="text"
            placeholder="Address"
            className="border-2 p-3 rounded-lg focus:border-amber-700 focus:outline-none focus:ring-0"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="50"
                max="100000"
                required
                className="border-2 p-3 rounded-lg focus:border-amber-700 focus:outline-none focus:ring-0"
                onChange={handleChange}
                value={formData.regularPrice}
              />
              
              <div className="flex flex-col items-center">
                <p>Regular Fees</p>
                <span className="text-xs">( ₹ per Appointment )</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="experience"
                min="0"
                max="100000"
                required
                className="border-2 p-3 rounded-lg focus:border-amber-700 focus:outline-none focus:ring-0"
                onChange={handleChange}
                value={formData.experience}
              />
              
              <div className="flex flex-col items-center">
                <p>Year of Experience</p>
                <span className="text-xs">( services )</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
         <Select
         id="therapytype"
         options={therapyType}
         isMulti
         required
         placeholder="Type of Therapy"
         touchUi={false}
         className="border-2 p-3 rounded-lg border-slate-500 bg-white focus:border-amber-700 hover:border-amber-500"
         onChange={(selectedOptions)=>{
          setFormData((prevState)=>({
            ...prevState,
            therapytype: selectedOptions.map((option)=>option.value),
          }))
         }}
         styles={{
          control:(provided)=>({
            ...provided,
            backgroundColor: "transparent",
            minWidth: '160px',
            border: 'none',
            boxShadow: 'none',
            transition: 'all 0.3s ease',
          })
         }}
         />
          <div className="flex flex-col gap-4">
            <p className="font-semibold">Availability:</p>
            <div className="flex flex-row gap-4">
              <p>Morning:</p>
              <input
                type="time"
                id="morningStart"
                className="border-2 p-3 rounded-lg focus:border-amber-700 focus:outline-none focus:ring-0"
                required
                value={formData.availability.morningStart}
                onChange={handleChange}
              />
              <input
                type="time"
                id="morningEnd"
                className="border-2 p-3 rounded-lg focus:border-amber-700 focus:outline-none focus:ring-0"
                required
                value={formData.availability.morningEnd}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-row gap-4 pl-1">
              <p>Evening:</p>
              <input
                type="time"
                id="eveningStart"
                className="border-2 p-3 rounded-lg focus:border-amber-700 focus:outline-none focus:ring-0"
                required
                value={formData.availability.eveningStart}
                onChange={handleChange}
              />
              <input
                type="time"
                id="eveningEnd"
                className="border-2 p-3 rounded-lg focus:border-amber-700 focus:outline-none focus:ring-0"
                required
                value={formData.availability.eveningEnd}
                onChange={handleChange}
              />
            </div>
          </div>
          <textarea
            type="text"
            placeholder="Biography"
            className="border-2 p-3 rounded-lg focus:border-amber-700 focus:outline-none focus:ring-0"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover. pick image for showcase (max 6)
            </span>
          </p>

          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              disabled={uploading}
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-85"
            >
              {uploading ? "uploading..." : "upload"}
            </button>
          </div>
          <p className="text-red-700 text-xs">
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={index}
                className="flex justify-between p-3 border items-center"
              >
                <img
                  src={url}
                  alt="image"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploading}
            className="p-3 bg-slate-700 text-white rounded=lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Creating Provider" : "Create Provider"}
          </button>
          {error && <p className="text-red-700 text-xs">{error}</p>}
        </div>
      </form>
    </div>
  );
}
