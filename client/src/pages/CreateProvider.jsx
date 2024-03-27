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

export default function CreateProvider() {
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    license: "",
    regularPrice: "50",
    discountPrice: "0",
  });
  console.log(formData);
  const [imageUploadError, setImageUploadError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

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
          return toast.success('Image uploaded successfully');
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
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return toast.error("You must upload at least one image");
      if (+formData.regularPrice < +formData.discountPrice)
        return toast.error("Discound price must be lower than regular price");
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
      navigate(`/provider/${data._id}`)
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <div className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Creating a Provider</h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border-2 p-3 rounded-lg focus:border-amber-600 focus:ring-0"
            id="name"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
          />

          <textarea
            type="text"
            placeholder="Description"
            className="border-2 p-3 rounded-lg focus:border-amber-700 focus:outline-none focus:ring-0"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
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

          <input
            type="text"
            placeholder="License"
            className="border-2 p-3 rounded-lg focus:border-amber-700 focus:outline-none focus:ring-0"
            id="license"
            required
            onChange={handleChange}
            value={formData.license}
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
                id="discountPrice"
                min="50"
                max="100000"
                required
                className="border-2 p-3 rounded-lg focus:border-amber-700 focus:outline-none focus:ring-0"
                onChange={handleChange}
                value={formData.discountPrice}
              />
              <div className="flex flex-col items-center">
                <p>Discount Fees</p>
                <span className="text-xs">( ₹ per Appointment )</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
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
          <button disabled={loading || uploading } className="p-3 bg-slate-700 text-white rounded=lg uppercase hover:opacity-95 disabled:opacity-80">
            {loading ? "Creating Provider" : "Create Provider"}
          </button>
          {error && <p className="text-red-700 text-xs">{error}</p>}
        </div>
      </form>
    </div>
  );
}
