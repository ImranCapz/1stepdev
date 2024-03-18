import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import logo from "../assets/logo.svg";
import { Link } from "react-router-dom";

export default function VerifyOtp() {
  const [email, setEmail] = useState("");
  const [userEnteredOtp, setUserEnteredOtp] = useState("");
  const [newPassword, setnewPassword] = useState("");
  const [verificationStatus, setVerificationStatus] = useState(null);
  const navigate = useNavigate();

  const handleVerifyOtp = async () => {
    try {
      const response = await fetch("server/auth/verifyOtp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, userEnteredOtp, newPassword }),
      });

      const result = await response.json();

      setVerificationStatus({
        success: result.status,
        message: result.message,
      });

      if (result.success) {
        toast.success(result.message);
        navigate("/signin");
      }
    } catch (error) {
      setVerificationStatus({
        status: false,
        message: "An error occurred during OTP verification.",
      });
      toast.error("An error occurred during OTP verification.");
    }
  };
  return (
    <section className="flex flex-col items-center justify-center px-6 py-3 mx-auto lg:py-0">
      <img className="w-40 h-40 mr-2" src={logo} alt="logo" />
      <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
        <h1 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
          OTP VERIFICATION
        </h1>
        <p className="font-light text-gray-500 dark:text-gray-400">
          Check your email for OTP
        </p>
        <div className="mt-4 space-y-4 lg:mt-5 md:space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <br />
            <div>
              <label
                htmlFor="userEnteredOtp"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Enter your OTP
              </label>
              <input
                type="userEnteredOtp"
                name="userEnteredOtp"
                id="userEnteredOtp"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="enter your OTP"
                value={userEnteredOtp}
                onChange={(e) => setUserEnteredOtp(e.target.value)}
                required
              />
            </div>
            <br />
            <div>
              <label
                htmlFor="newPassword"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Enter New Password
              </label>
              <input
                type="newPassword"
                name="newPassword"
                id="newPassword"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Enter New Password"
                value={newPassword}
                onChange={(e) => setnewPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <button
              onClick={handleVerifyOtp}
              className="block py-3 px-4 font-medium text-center text-indigo-950 bg-amber-400 hover:bg-amber-300 active:shadow-none rounded-lg shadow md:inline transition-all duration-300 ease-in-out mb-4 md:mb-0"
            >
              Verify OTP
            </button>
          </div>
        </div>
      </div>
      {verificationStatus !== null && (
        <div
          className={`mt-6  flex flex-col items-center ${
            verificationStatus.success ? "text-green-500" : "text-red-500"
          }`}
        >
          <p>{verificationStatus.message}</p>
            
          {verificationStatus.success ? (
           
            <Link
              to="/signin"
              className=" py-3 px-4 font-medium text-center text-indigo-950 bg-amber-400 hover:bg-amber-300 active:shadow-none rounded-lg shadow md:inline transition-all duration-300 ease-in-out mb-4 md:mb-0 mt-8"
            >
              Back to Sign in your account
            </Link>
          ) : (
            <Link
              to="/forgetpassword"
              className="block py-3 px-4 font-medium text-center text-indigo-950 bg-amber-400 hover:bg-amber-300 active:shadow-none rounded-lg shadow md:inline transition-all duration-300 ease-in-out mb-4 md:mb-0 mt-8"
            >
              Resend OTP
            </Link>
          )}
        </div>
      )}
    </section>
  );
}
