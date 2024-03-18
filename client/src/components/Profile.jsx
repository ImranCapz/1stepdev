import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import {
  updateUserFailure,
  updateUserSuccess,
  updateUserStart,
  signOut,
} from "../redux/user/userSlice";
import TopLoadingBar from 'react-top-loading-bar';
import { Link } from "react-router-dom";

export default function Profile() {
  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const [imagePrecent, setImagePrecent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const TopLoadingBarRef = useRef(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const { currentUser, loading, error } = useSelector((state) => state.user);

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
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, profilePicture: downloadURL })
        );
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
    } catch (error) {
      dispatch(updateUserFailure(error));
    }finally{
      TopLoadingBarRef.current.complete();
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSignout = async () => {
    try {
      await fetch("/server/auth/signout");
      dispatch(signOut());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full max-w-80 p-3 mx-auto">
      <TopLoadingBar ref={TopLoadingBarRef} color='#ff9900' height={3} />
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-7" onSubmit={handleSubmit}>
        <input
          type="file"
          id="profilePicture"
          name="profilePicture"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <div className="relative w-24 h-24 mx-auto group">
          <label
            htmlFor="profilePicture"
            className="w-24 h-24 cursor-pointer"
            onClick={handleImageClick}
          >
            <img
              src={formData.profilePicture || currentUser.profilePicture}
              alt="profile"
              className="w-24 h-24 rounded-full object-cover"
            />
            <div className="hidden rounded-full group-hover:flex flex-col items-center justify-center absolute inset-0 bg-gray-800 bg-opacity-60">
              <img
                src="https://www.svgrepo.com/show/33565/upload.svg"
                alt="camera"
                className="w-8 h-8"
              />
              <p className="text-white text-xs">Change Picture</p>
            </div>
          </label>
        </div>
        <p className="text-sm self-center">
          {imageError ? (
            <span className="text-red-500">Please upload a valid image</span>
          ) : imagePrecent > 0 && imagePrecent < 100 ? (
            <span>{`Uploading: ${imagePrecent}%`}</span>
          ) : imagePrecent === 100 ? (
            <span className="text-green-700">Image Uploaded Successfully</span>
          ) : (
            ""
          )}
        </p>
        <input
          defaultValue={currentUser.username}
          type="text"
          id="username"
          required
          placeholder="username"
          className="block w-full bg-state-100 p-3 rounded-lg ring-1 ring-inset ring-gray-300 py-1.5 border-0 focus:ring-2 bg-slate-100"
          onChange={handleChange}
        />
        <input
          defaultValue={currentUser.email}
          type="email"
          id="email"
          placeholder="email"
          className="block w-full bg-state-100 p-3 rounded-lg ring-1 ring-inset ring-gray-300 py-1.5 border-0 focus:ring-2 bg-slate-100"
          onChange={handleChange}
        />
        <input
          type="text"
          id="password"
          placeholder="password"
          className="block w-full bg-state-100 p-3 rounded-lg ring-1 ring-inset ring-gray-300 py-1.5 border-0 focus:ring-2 bg-slate-100"
          onChange={handleChange}
        />
        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          {loading ? "saving" : "update"}
        </button>
        <Link className='bg-green-500 text-white p-3 rounded-lg text-center uppercase hover:opacity-95'to ={"/create-listing"}>FOR PROVIDERS</Link>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleSignout} className="text-red-700 cursor-pointer">
          Sign out
        </span>
      </div>
      <p className="text-red-700 mt-7">{error && "something went wrong"}</p>
      <p className="text-green-700 mt-7">
        {updateSuccess && "Updated Successfully"}
      </p>
    </div>
  );
}
