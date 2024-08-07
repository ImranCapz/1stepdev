import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import TopLoadingBar from "react-top-loading-bar";
import logo from "../assets/logo.svg";

export function ResetPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const topLoadingBarRef = useRef(null);

  const handleForget = async (e) => {
    e.preventDefault();

    try {
      topLoadingBarRef.current.continuousStart(50);
      const response = await fetch("server/auth/otppassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (data.status === true) {
        toast.success("OTP Sucessfully Sended");
        setError(true);
        navigate("/verifyotp");
        return;
      }
    } catch (error) {
      setError(true);
      toast.error("Please enter a valid email address");
    } finally {
      topLoadingBarRef.current.complete();
    }
  };

  return (
    <form onSubmit={handleForget}>
      <section className="flex flex-col items-center justify-center px-6 py-3 mx-auto lg:py-0">
        <TopLoadingBar ref={topLoadingBarRef} color="#ff9900" height={3} />
        <img className="w-40 h-40 mr-2" src={logo} alt="logo" />
        <div className="w-full p-6 bg--500 rounded-lg shadow md:mt-0 sm:max-w-md sm:p-8">
          <h1 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Forgot your password?
          </h1>
          <p className="font-light text-gray-500 dark:text-gray-400">
            We&apos;ll email you instructions to reset your password.
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
            </div>
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  aria-describedby="terms"
                  type="checkbox"
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                  required
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor="terms"
                  className="font-light text-gray-500 dark:text-gray-300"
                >
                  I accept the{" "}
                  <a
                    className="font-medium text-purple-200 hover:underline dark:text-amber-400"
                    href="#"
                  >
                    Terms and Conditions
                  </a>
                </label>
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <button
                type="submit"
                className="block py-3 px-4 font-medium text-center text-indigo-950 bg-amber-400 hover:bg-amber-300 active:shadow-none rounded-lg shadow md:inline transition-all duration-300 ease-in-out mb-4 md:mb-0"
              >
                Send OTP
              </button>
              <Link
                to="/signin"
                className="mt-4 font-semibold leading-6 text-purple-900 hover:text-slate-400 transition-all duration-300 ease-in-out underline decoration-sky-500 md:mt-0"
              >
                Back to Sign in
              </Link>
            </div>
          </div>
          <p className="mt-5 text-red-700">
            {error && "Enter a valid email address"}
          </p>
        </div>
      </section>
    </form>
  );
}
