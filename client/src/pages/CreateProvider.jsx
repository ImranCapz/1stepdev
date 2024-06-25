import { useEffect, useState } from "react";
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
import { Country, State, City } from "country-state-city";
import { useDispatch } from "react-redux";
import { selectProvider } from "../redux/provider/providerSlice";
import BeatLoader from "react-spinners/BeatLoader";
import { FileInput } from "flowbite-react";
import Input from "react-phone-number-input/input";
import { IoMdAlert } from "react-icons/io";

export default function CreateProvider() {
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [providerData, setProviderData] = useState({});
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const [value, setValue] = useState();
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    email: "",
    qualification: "",
    license: "",
    fullName: "",
    experience: "",
    phone: value,
    address: {
      addressLine1: "",
      country: "",
      state: "",
      city: "",
      street: "",
      pincode: "",
    },
    therapytype: "",
    availability: {
      morningStart: "",
      morningEnd: "",
      eveningStart: "",
      eveningEnd: "",
    },
    regularPrice: "",
    description: "",
    profilePicture: "",
  });
  const [Errors, setErrors] = useState({
    phone: false,
    email: false,
    description: false,
    profilePicture: false,
  });

  console.log("Formdata", formData);
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
    const { id, value, type } = e.target;
    const addressFields = ["addressLine1", "street", "pincode"];

    if (addressFields.includes(id)) {
      setFormData((prevState) => ({
        ...prevState,
        address: {
          ...prevState.address,
          [id]: value,
        },
      }));
    } else if (type === "time") {
      setFormData((prevState) => ({
        ...prevState,
        availability: {
          ...prevState.availability,
          [id]: value,
        },
      }));
    } else {
      setFormData({
        ...formData,
        [id]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let errors = { ...Errors };
      if (!formData.profilePicture || formData.profilePicture.length < 1) {
        errors.profilePicture = true;
        setErrors(errors);
        return toast.error("You must upload a profile picture");
      } else {
        errors.profilePicture = false;
        setErrors(errors);
      }
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = true;
        setErrors(errors);
        return toast.error("Invalid email address");
      } else {
        errors.email = false;
        setErrors(errors);
      }
      if (!formData.phone || formData.phone.length !== 13) {
        errors.phone = true;
        setErrors(errors);
        return toast.error("Phone number must be 10 digits");
      } else {
        errors.phone = false;
        setErrors(errors);
      }
      if (!formData.description || formData.description.length < 50) {
        errors.description = true;
        setErrors(errors);
        return toast.error("Description must be at least 50 characters");
      } else {
        errors.description = false;
        setErrors(errors);
      }
      if (!formData.imageUrls || formData.imageUrls.length < 1) {
        errors.imageUrls = true;
        setErrors(errors);
        return toast.error("You must upload at least one image");
      } else {
        errors.imageUrls = false;
        setErrors(errors);
      }
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
      dispatch(selectProvider(data._id));
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
  ];

  const [selectedState, setSelectedState] = useState();
  const [cities, setCities] = useState([]);
  let country = Country.getAllCountries();
  const [selectedCountry, setSelectedCountry] = useState(country[0]);
  let state = State.getStatesOfCountry(selectedCountry.isoCode);

  useEffect(() => {
    if (selectedCountry && selectedState) {
      const cities = City.getCitiesOfState(
        selectedCountry.isoCode,
        selectedState
      );
      setCities(cities);
    }
  }, [selectedCountry, selectedState]);

  useEffect(() => {
    const fetchProvider = async () => {
      setLoading(true);
      if (!currentUser) {
        return;
      }
      const res = await fetch(
        `/server/provider/fetchprovider/${currentUser._id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      console.log(data);
      setProviderData(data);
      setLoading(false);
      if (data.status === true) {
        setFormData({
          ...formData,
          ...data.fetchprovider,
          name: data.fetchprovider.name.map(
            (name) => service.find((option) => option.value === name).value
          ),
          therapytype: data.fetchprovider.therapytype.map(
            (name) => therapyType.find((option) => option.value === name).value
          ),
          address: {
            ...formData.address,
            addressLine1: data.fetchprovider.address.addressLine1,
            street: data.fetchprovider.address.street,
            country: data.fetchprovider.address.country,
            state: data.fetchprovider.address.state,
            city: data.fetchprovider.address.city,
            pincode: data.fetchprovider.address.pincode,
          },
        });
      }
    };
    fetchProvider();
  }, [currentUser]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return toast.error("You must upload at least one image");
      setError(false);
      console.log("Provider", providerData);
      const res = await fetch(
        `/server/provider/update/${providerData.fetchprovider._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            userRef: currentUser._id,
          }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setError(data.message);
      }
      toast.success("Provider updated successfully");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="md:p-10 p-5 w-full mx-auto flex-col items-center bg-sky-100">
      {loading ? (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <BeatLoader color="#10ebd8" loading={loading} size={20} />
          </div>
        </>
      ) : (
        <>
          {currentUser._id ===
          (providerData &&
            providerData.fetchprovider &&
            providerData.fetchprovider.userRef) ? (
            <>
              <h1 className="flex flex-col p-2 font-bold text-2xl text-gray">
                {" "}
                Your Provider Details :
              </h1>
            </>
          ) : (
            <>
              <h1 className="text-base text-gray-700 font-semibold text-left my-7 mt-5">
                Fill the form to create a provider
              </h1>
            </>
          )}
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
                className={`w-24 h-24 rounded-full object-cover border-4 border-[lightgray] ${
                  Errors.profilePicture && "border-red-500"
                }`}
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
          <div className="w-full flex justify-center mt-2">
            {Errors.profilePicture && (
              <p className="text-sm text-red-500 font-semibold">
                Please upload a profile picture
              </p>
            )}
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-10 mt-6 bg-white md:p-20 p-6 rounded-lg"
          >
            <div className="flex flex-col gap-3 flex-1">
              <label className="font-semibold text-main">Select service*</label>
              <Select
                id="name"
                key={formData.name}
                options={service}
                isMulti
                required
                placeholder="What service do you provide?"
                touchUi={false}
                className="border-2 p-1 rounded-lg border-slate-300 input hover:border-purple-400"
                defaultValue={
                  Array.isArray(formData.name)
                    ? formData.name.map((name) =>
                        service.find((option) => option.value === name)
                      )
                    : []
                }
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
              <label className="font-semibold text-main">Full Name*</label>
              <input
                type="text"
                placeholder="Full Name"
                className="border-2 p-2 rounded-lg border-slate-300 input focus:outline-none focus:ring-0"
                id="fullName"
                required
                onChange={handleChange}
                value={formData.fullName}
              />
              <label className="font-semibold text-main">
                <p className="flex flex-row items-center">
                  {Errors.email && (
                    <IoMdAlert className="text-red-700 text-sm" />
                  )}
                  Email*{" "}
                </p>
              </label>
              <input
                placeholder="Email"
                className={`border-2 p-2 rounded-lg input focus:outline-none focus:ring-0 border-slate-300 ${
                  Errors.email ? "error" : ""
                }`}
                id="email"
                required
                onChange={handleChange}
                value={formData.email}
              />
              {Errors.email && (
                <p className="text-sm text-red-500 font-semibold">
                  Please enter a valid email address.
                </p>
              )}
              <label className="font-semibold text-main">Qualification*</label>
              <input
                type="text"
                placeholder="(e.g.,Psychologist, Counselor)"
                className="border-2 p-2 rounded-lg input focus:ring-0 border-slate-300"
                id="qualification"
                required
                onChange={handleChange}
                value={formData.qualification}
              />
              <label className="font-semibold text-main">Address*</label>
              <input
                placeholder="Address"
                className="border-2 p-2 rounded-lg border-slate-300 input focus:outline-none focus:ring-0 "
                id="addressLine1"
                required
                onChange={handleChange}
                value={formData.address.addressLine1}
              />
              <label className="font-semibold text-main">Street</label>
              <input
                placeholder="Street"
                className="w-full border-2 p-2 rounded-lg border-slate-300 input focus:outline-none focus:ring-0 "
                id="street"
                onChange={handleChange}
                value={formData.address.street}
              />
              <div className="flex flex-row gap-2 items-center">
                <div className="w-full flex flex-col gap-2">
                  <label className="font-semibold text-main">Country*</label>
                  <Select
                    id="country"
                    placeholder="Country"
                    key={formData.address.country}
                    defaultValue={
                      formData.address.country
                        ? {
                            value: formData.address.country,
                            label: formData.address.country,
                          }
                        : undefined
                    }
                    options={Country.getAllCountries().map((country) => {
                      return { value: country.name, label: country.name };
                    })}
                    className="w-full rounded-lg border-2 border-slate-300 hover:border-purple-400"
                    onChange={(selectedOption) => {
                      const selectedCountry = Country.getAllCountries().find(
                        (country) => country.name === selectedOption.value
                      );
                      setSelectedCountry(selectedCountry);
                      setFormData({
                        ...formData,
                        address: {
                          ...formData.address,
                          country: selectedOption.label,
                        },
                      });
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
                </div>
                <div className="w-full flex flex-col gap-2">
                  <label className="font-semibold text-main">State*</label>
                  <Select
                    id="state"
                    key={`state-${formData.address.state}`}
                    defaultValue={
                      formData.address.state
                        ? {
                            value: formData.address.state,
                            label: formData.address.state,
                          }
                        : undefined
                    }
                    options={state.map((state) => {
                      return { value: state.isoCode, label: state.name };
                    })}
                    placeholder="State"
                    className="w-full rounded-lg border-2 border-slate-300 hover:border-purple-400"
                    onChange={(selectedOption) => {
                      setSelectedState(selectedOption.value);
                      setFormData({
                        ...formData,
                        address: {
                          ...formData.address,
                          state: selectedOption.label,
                        },
                      });
                    }}
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        backgroundColor: "transparent",
                        minWidth: "100px",
                        border: "none",
                        outline: "none",
                        boxShadow: "none",
                        transition: "all 0.3s ease",
                      }),
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-row gap-2">
                <div className="w-full flex flex-col gap-2">
                  <label className="font-semibold text-main">City*</label>
                  <Select
                    id="city"
                    key={formData.address.city}
                    defaultValue={
                      formData.address.city
                        ? {
                            value: formData.address.city,
                            label: formData.address.city,
                          }
                        : undefined
                    }
                    options={cities.map((city) => {
                      return { value: city.name, label: city.name };
                    })}
                    className="w-full border-2 rounded-lg border-slate-300 hover:border-purple-400"
                    placeholder="Select City"
                    onChange={(selectedOption) => {
                      setFormData({
                        ...formData,
                        address: {
                          ...formData.address,
                          city: selectedOption.label,
                        },
                      });
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
                </div>
                <div className="w-full flex flex-col gap-2">
                  <label className="font-semibold text-main">Pincode*</label>
                  <input
                    placeholder="Pincode"
                    className="w-full border-2 p-1.5 border-slate-300 rounded-lg input focus:outline-none focus:ring-0"
                    id="pincode"
                    required
                    onChange={handleChange}
                    value={formData.address.pincode}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <label className="font-semibold text-main md:text-base text-sm">
                    fee per Appoinment*
                  </label>
                  <input
                    type="number"
                    id="regularPrice"
                    min="50"
                    max="100000"
                    required
                    className="border-2 p-3 rounded-lg input focus:outline-none focus:ring-0 border-slate-300"
                    onChange={handleChange}
                    value={formData.regularPrice}
                  />

                  <div className="flex flex-col items-center">
                    <p className="text-main md:text-sm text-xs font-semibold">
                      Regular Fees
                    </p>
                    <span className="text-main font-semibold text-xs">
                      ( ₹ Appointment )
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="font-semibold text-main md:text-base text-sm">
                    Years of Experience* &nbsp;
                  </label>
                  <input
                    type="number"
                    id="experience"
                    min="0"
                    max="100000"
                    required
                    className="border-2 p-3 rounded-lg input focus:outline-none focus:ring-0 border-slate-300"
                    onChange={handleChange}
                    value={formData.experience}
                  />

                  <div className="flex flex-col items-center ">
                    <p className="text-main md:text-sm text-xs font-semibold">
                      Service
                    </p>
                    <span className="text-main font-semibold text-xs">
                      ( no. of Experience )
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col flex-1 gap-3">
              <label className="font-semibold text-main">
                Select your therapy type*
              </label>
              <Select
                key={formData.therapytype}
                id="therapytype"
                options={therapyType}
                isMulti
                required
                placeholder="Type of Therapy"
                touchUi={false}
                defaultValue={
                  Array.isArray(formData.therapytype)
                    ? formData.therapytype.map((name) =>
                        therapyType.find((option) => option.value === name)
                      )
                    : []
                }
                className="border-2 p-1 rounded-lg border-slate-300 bg-white input hover:border-purple-400"
                onChange={(selectedOptions) => {
                  setFormData((prevState) => ({
                    ...prevState,
                    therapytype: selectedOptions.map((option) => option.value),
                  }));
                }}
                styles={{
                  control: (provided) => ({
                    ...provided,
                    backgroundColor: "transparent",
                    minWidth: "160px",
                    border: "none",
                    boxShadow: "none",
                    transition: "all 0.3s ease",
                  }),
                }}
              />
              <label className="font-semibold text-main">Licensing*</label>
              <input
                type="text"
                placeholder="(License number, issuing authority)"
                className="border-2 p-2 rounded-lg input focus:outline-none focus:ring-0 border-slate-300"
                id="license"
                required
                onChange={handleChange}
                value={formData.license}
              />
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-main">
                  <p className="flex flex-row items-center">
                    {Errors.phone && (
                      <IoMdAlert className="text-red-700 text-sm" />
                    )}
                    Phone*
                  </p>
                </label>
                <Input
                  placeholder="Phone number"
                  className={`border-2 p-2 rounded-lg input focus:outline-none focus:ring-0 border-slate-300 ${
                    Errors.phone ? "error" : ""
                  }`}
                  id="phone"
                  required
                  onChange={(value) => {
                    setValue(value);
                    setFormData({
                      ...formData,
                      phone: value,
                    });
                  }}
                  value={formData.phone}
                />
                {Errors.phone && (
                  <p className="text-sm text-red-500 font-semibold">
                    Please enter a 10-digit number.
                  </p>
                )}
                <p className="font-semibold text-main">Availability:</p>
                <div className="flex flex-row gap-4">
                  <p className="font-semibold text-main">Morning:</p>
                  <input
                    type="time"
                    id="morningStart"
                    className="border-2 p-2 rounded-lg input focus:outline-none focus:ring-0 border-slate-300"
                    required
                    value={formData.availability.morningStart}
                    onChange={handleChange}
                  />
                  <input
                    type="time"
                    id="morningEnd"
                    className="border-2 p-2 rounded-lg input focus:outline-none focus:ring-0 border-slate-300"
                    required
                    value={formData.availability.morningEnd}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-row gap-4 pl-1">
                  <p className="font-semibold text-main">Evening:</p>
                  <input
                    type="time"
                    id="eveningStart"
                    className="border-2 p-2 rounded-lg input focus:outline-none focus:ring-0 border-slate-300"
                    required
                    value={formData.availability.eveningStart}
                    onChange={handleChange}
                  />
                  <input
                    type="time"
                    id="eveningEnd"
                    className="border-2 p-2 rounded-lg input focus:outline-none focus:ring-0 border-slate-300"
                    required
                    value={formData.availability.eveningEnd}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <textarea
                type="text"
                placeholder="Biography"
                className={`border-2 p-2 rounded-lg input focus:outline-none focus:ring-0 border-slate-300 ${
                  Errors.description ? "error" : ""
                }`}
                id="description"
                required
                onChange={handleChange}
                value={formData.description}
              />
              {Errors.description && (
                <p className="text-sm text-red-500 font-semibold">
                  Please write a 50-word description in the field.
                </p>
              )}
              <p className="font-semibold text-main">
                Images:
                <span className="font-normal text-gray-600 ml-2">
                  The first image will be the cover. pick image for showcase
                  (max 6)
                </span>
              </p>

              <div className="flex flex-row items-center gap-4">
                <FileInput
                  onChange={(e) => setFiles(e.target.files)}
                  className="p-3 rounded w-full"
                  type="file"
                  id="images"
                  accept="image/*"
                  multiple
                />
                <button
                  type="button"
                  disabled={uploading}
                  onClick={handleImageSubmit}
                  className={`p-2 max-h-10 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-85 ${
                    Errors.imageUrls && "error"
                  }`}
                >
                  {uploading ? "uploading..." : "upload"}
                </button>
              </div>
              <div className="">
                {Errors.imageUrls && (
                  <p className="text-sm text-red-500 font-semibold">
                    {" "}
                    Please upload at least one image.
                  </p>
                )}
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
              {currentUser._id ===
              (providerData &&
                providerData.fetchprovider &&
                providerData.fetchprovider.userRef) ? (
                <>
                  <button
                    type="submit"
                    onClick={handleUpdate}
                    disabled={loading || uploading}
                    className="p-3 bg-blue-600 text-white rounded=lg rounded-lg Captialize hover:opacity-95 disabled:opacity-80 transition-all duration-300 ease-in-out"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  {error && <p className="text-red-700 text-xs">{error}</p>}
                </>
              ) : (
                <>
                  <button
                    type="submit"
                    disabled={loading || uploading}
                    className="p-3 btn-color rounded-lg font-semibold  rounded=lg hover:opacity-85 disabled:opacity-80 transition-all duration-300 ease-in-out"
                  >
                    {loading ? "Creating Provider" : "Create Provider"}
                  </button>
                  {error && <p className="text-red-700 text-xs">{error}</p>}
                </>
              )}
            </div>
          </form>
        </>
      )}
    </div>
  );
}
