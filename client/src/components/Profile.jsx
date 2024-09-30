import { useRef, useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import TopLoadingBar from "react-top-loading-bar";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

//redux
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  updateUserFailure,
  updateUserSuccess,
  updateUserStart,
} from "../redux/user/userSlice";
import { selectProvider } from "../redux/provider/providerSlice";

//icons
import { FaEye } from "react-icons/fa";
import { IoIosEyeOff } from "react-icons/io";
import { FaRegUser } from "react-icons/fa";
import { FiMail } from "react-icons/fi";
import { PiLockSimpleBold } from "react-icons/pi";

export default function Profile() {
  const fileRef = useRef(null);
  const [image, setImage] = useState();
  const [imagePrecent, setImagePrecent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({
    profilePicture: "",
    password: "",
  });
  const TopLoadingBarRef = useRef(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showProviderError, setShowProviderError] = useState(false);
  const [userProvider, setUserProvider] = useState([]);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [isModified, setIsModified] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image]);

  const handleFileUpload = async (image) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePrecent(Math.round(progress));
      },
      (error) => {
        setImageError(true);
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, profilePicture: downloadURL });
          setIsModified(true);
        });
      }
    );
  };

  const handleImageClick = (e) => {
    e.preventDefault();
    fileRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      TopLoadingBarRef.current.continuousStart(50);
      dispatch(updateUserStart());
      const res = await fetch(`/server/user/update/${currentUser._id}`, {
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
      setUpdateSuccess(true);
      setIsModified(false);
      toast.success("Profile Updated Successfully");
    } catch (error) {
      dispatch(updateUserFailure(error));
    } finally {
      TopLoadingBarRef.current.complete();
    }
  };

  const handleChange = (e) => {
    if (e.target.id === "username") {
      e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
    }
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setIsModified(true);
  };

  const handleShowProvider = async () => {
    try {
      setShowProviderError(false);
      const res = await fetch(`/server/user/providers/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowProviderError(true);
        return;
      }
      setUserProvider(data);
    } catch (error) {
      setShowProviderError(true);
    }
  };

  const handleProviderDelete = async (providerid) => {
    try {
      const res = await fetch(`/server/provider/delete/${providerid}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data);
        return toast.success("Provider Deleted Successfully");
      }
      setUserProvider((prev) =>
        prev.filter((provider) => provider._id !== providerid)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="bg-slate-100 p-3 mx-auto">
      <TopLoadingBar ref={TopLoadingBarRef} color="#ff9900" height={3} />
      <h1 className="flex flex-col p-2 mb-4 font-bold text-2xl text-gray">
        Account Settings :{" "}
      </h1>
      <div className="p-10 bg-white rounded-lg border">
        <div>
          <form
            className="flex flex-col items-start gap-7 md:w-[900px]"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col items-center">
              <input
                type="file"
                id="profilePicture"
                name="profilePicture"
                ref={fileRef}
                hidden
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
              <div className="relative w-34 h-34 mx-auto group">
                <label
                  htmlFor="profilePicture"
                  className="w-24 h-24 cursor-pointer"
                  onClick={handleImageClick}
                >
                  <img
                    src={
                      currentUser.profilePicture ||
                      formData.profilePicture ||
                      "https://i.ibb.co/tKQH4zp/defaultprofile.jpg"
                    }
                    alt="profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-[lightgray]"
                  />
                  <div className="hidden rounded-full group-hover:flex flex-col items-center justify-center absolute inset-0 bg-gray-800 bg-opacity-60">
                    <img
                      src="https://www.svgrepo.com/show/33565/upload.svg"
                      alt="camera"
                      className="w-10 h-10"
                    />
                    <p className="text-white text-xs">Change Picture</p>
                  </div>
                </label>
              </div>
              <p className="text-sm self-center">
                {imageError ? (
                  <span className="text-red-500">
                    Please upload a valid image
                  </span>
                ) : imagePrecent > 0 && imagePrecent < 100 ? (
                  <span>{`Uploading: ${imagePrecent}%`}</span>
                ) : imagePrecent === 100 ? (
                  <span className="text-green-700">
                    Image Uploaded Successfully
                  </span>
                ) : (
                  ""
                )}
              </p>
            </div>
            <div className="flex flex-col w-72 md:w-1/2 gap-2 relative">
              <label htmlFor="username" className="text-xl text-slate-600">
                Username
              </label>
              <div className="flex items-center mt-2 w-50 h-14 rounded-lg ring-0 ring-inset border-0 focus:ring-2 bg-slate-100">
                <FaRegUser className="ml-3 text-xl text-gray-400" />
                <input
                  defaultValue={currentUser.username}
                  type="text"
                  id="username"
                  maxLength={20}
                  required
                  placeholder="username"
                  className=" text-xl pl-3 w-52 text-gray-800 bg-state-100 p-3 rounded-lg ring-0 ring-inset py-1.5 border-0 focus:ring-2 bg-slate-100"
                  onChange={handleChange}
                />
              </div>
              <label htmlFor="username" className="text-xl mt-4 text-slate-600">
                Email Address
              </label>
              <div className="flex items-center mt-2 h-14 rounded-lg ring-0 ring-inset border-0 focus:ring-2 bg-slate-100">
                <FiMail className="ml-3 text-xls w-5 h-5 text-gray-400" />
                <input
                  defaultValue={currentUser.email}
                  type="email"
                  id="email"
                  placeholder="email"
                  className="flex-grow text-xl pl-3 w-3/4 mx-auto text-gray-500 bg-state-100 p-3 rounded-lg ring-0 ring-inset ring-gray-300 py-1.5 border-0 focus:ring-2 bg-slate-100"
                  onChange={handleChange}
                  disabled
                />
              </div>
              <label htmlFor="username" className="text-xl mt-4 text-slate-600">
                Password
              </label>
              <div className="relative flex items-center mt-2 w-50 h-14 rounded-lg ring-0 ring-inset border-0 focus:ring-2 bg-slate-100">
                <PiLockSimpleBold className="ml-3 text-xl text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="password"
                  className="flex-grow w-52 text-xl pl-3 text-gray-700 bg-state-100 p-3 rounded-lg ring-0 ring-inset ring-gray-300 py-1.5 border-0 focus:ring-2 bg-slate-100"
                  onChange={handleChange}
                />
              </div>
              {formData.password && (
                <div className="absolute right-0 bottom-[127px] pr-5">
                  <button type="button" onClick={handlePasswordVisibility}>
                    {showPassword ? (
                      <FaEye className="text-slate-700" />
                    ) : (
                      <IoIosEyeOff className="text-slate-600" />
                    )}
                  </button>
                </div>
              )}

              <h1 className="text-slate-500 font-semibold">
                <b>Note</b>: Enter new password to reset old password.
              </h1>
              <button
                disabled={!isModified}
                className=" bg-blue-600 text-xl font-semibold text-white mt-6 p-3 rounded-lg hover:opacity-95 transition-all disabled:opacity-80"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
        <p className="text-red-700 mt-7">{error && "something went wrong"}</p>
        <p className="text-green-700 mt-7">
          {updateSuccess && "Updated Successfully"}
        </p>
        <button onClick={handleShowProvider} className="text-green-700 w-full">
          Show Created Provider
        </button>
        <p className="text-red-700 mt-7">
          {showProviderError ? "Error showing Provider" : ""}
        </p>
        {userProvider && userProvider.length > 0 && (
          <div className="flex flex-col gap-4">
            <h1 className="text-center mt-7 text-2xl font-semibold">
              Your Providers
            </h1>
            {userProvider.map((provider) => (
              <div
                key={provider._id}
                className=" rounded-lg p-3 flex gap-4 justify-between items-center"
              >
                <Link
                  to={`/provider/${provider.fullName}?id=${provider._id}&service=${provider.name[0]}`}
                >
                  <img
                    src={provider.profilePicture}
                    alt="provider cover"
                    className="h-16 w-16 object-contain rounded-full"
                  />
                </Link>
                <Link
                  onClick={() => dispatch(selectProvider(provider._id))}
                  className="flex-1 font-semibold hover:underline truncate"
                  to={`/provider/${provider.fullName}?id=${provider._id}&service=${provider.name[0]}`}
                >
                  <p>{provider.fullName}</p>
                </Link>
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => handleProviderDelete(provider._id)}
                    className="text-red-700 uppercase"
                  >
                    Delete
                  </button>
                  <Link to="/dashboard?tab=providers">
                    <button className="text-green-700 uppercase">EDIT</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
