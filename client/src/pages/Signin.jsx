import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signinStart,
  signinSuccess,
  signinFailure,
} from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../components/OAuth";
import TopLoadingBar from "react-top-loading-bar";
import toast from "react-hot-toast";

//icons
import { FaEye } from "react-icons/fa";
import { IoIosEyeOff } from "react-icons/io";
import logo from "../assets/logo.svg";

const Signin = () => {
  const [formData, setFormData] = useState({
    email: "",
  });
  const [showpassword, setShowPassword] = useState(false);
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const topLoadingBarRef = useRef(null);

  const handleChanges = (e) => {
    const id = e.target.id;
    const value = e.target.value;
    if (id === "email") {
      const emailValid = value.split(".com");
      if (
        emailValid.length > 2 ||
        (emailValid.length === 2 && emailValid[1] !== "")
      ) {
        return;
      }
    }
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      topLoadingBarRef.current.continuousStart(100);
      dispatch(signinStart());
      const res = await fetch("server/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === true) {
        dispatch(signinFailure(data));
        toast.error(data.message);
        return;
      }
      dispatch(signinSuccess(data));
      toast.success("Successfully Login");
      navigate("/");
    } catch (error) {
      dispatch(signinFailure(error));
    } finally {
      topLoadingBarRef.current.complete();
    }
  };

  const handlePasswordVisibility = (e) => {
    e.preventDefault();
    setShowPassword(!showpassword);
  };
  const topLoadingBarColor = error ? "#ff0000" : "#ff9900";

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <TopLoadingBar
        ref={topLoadingBarRef}
        color={topLoadingBarColor}
        height={3}
      />

      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img className="mx-auto h-10 w-auto" src={logo} alt="Your Company" />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                onChange={handleChanges}
                value={formData.email}
                autoComplete="email"
                required
                className="block w-full p-3 rounded-lg ring-1 input ring-inset ring-gray- py-1.5 focus:ring-0 hover:border-purple-400"
              />
            </div>
          </div>

          <div className="mt-8">
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Password
            </label>
            <div className="mt-2 relative rounded-md shadow-sm">
              <input
                id="password"
                name="password"
                onChange={handleChanges}
                type={showpassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className="block w-full p-3 rounded-lg ring-1 input ring-inset ring-gray- py-1.5 focus:ring-0 hover:border-purple-400"
              />
              <div className="absolute right-0 inset-y-2 pr-3 leading-2 items-center flex">
                <button type="button" onClick={handlePasswordVisibility}>
                  {showpassword ? (
                    <FaEye className="text-gray-700" />
                  ) : (
                    <IoIosEyeOff className="text-gray-500" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <Link
            to="/forgetpassword"
            className="self-end flex font-semibold leading-6 text-neutral-900 hover:text-slate-400 transition-all duration-300 ease-in-out"
          >
            Forget Password.?
          </Link>
          <div>
            <button
              disabled={loading}
              type="submit"
              className="flex w-full justify-center rounded-md bg-amber-400 px-3 py-1.5 text-sm font-semibold leading-6 text-indigo-950 shadow-sm hover:bg-amber-300  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-300 ease-in-out"
            >
              {loading ? "Loading..." : "Sign in"}
            </button>
          </div>
          <OAuth redirect="/" />
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold leading-6 text-neutral-900 hover:text-slate-400 transition-all duration-300 ease-in-out"
          >
            Register
          </Link>
        </p>
      </div>
      <p className="text-red-700 mt-5">
        {error ? error.message || "Something went wrong" : ""}
      </p>
    </div>
  );
};

export default Signin;
