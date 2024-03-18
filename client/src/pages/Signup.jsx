import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';
import TopLoadingBar from 'react-top-loading-bar';
import toast from 'react-hot-toast';
import logo from "../assets/logo.svg";

export const Signup = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passerror, setpassError] = useState(false);
  const navigate = useNavigate();
  const topLoadingBarRef = useRef(null);
  const topLoadingBarColor = error || passerror ? '#ff0000' : '#ff9900';
  

  const handleChanges = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== confirmPassword) {
      setpassError(true);
      return;
    } else {
      setpassError(false);
    }

    try {
      topLoadingBarRef.current.continuousStart(100); 
      setLoading(true);
      const res = await fetch('server/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === true) {    
        setError(true);      
        return;
      }  
      toast.success('Account Created Successfully');
      navigate('/signin');   
    } catch (error) {
      setLoading(false);
      setError(true);
    }finally {
      topLoadingBarRef.current.complete();
    }
  };


  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
       <TopLoadingBar ref={topLoadingBarRef} color={topLoadingBarColor} height={4} />
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          src={logo}
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Create a new 1Step Account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Name
            </label>
            <div className="mt-2">
              <input
                id="username"
                type="text"
                onChange={handleChanges}
                className="block w-full bg-state-100 p-3 rounded-lg ring-1 ring-inset ring-gray-300 py-1.5 border-0 focus:ring-2"
              />
            </div>
          </div>

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
                type="email"
                onChange={handleChanges}
                autoComplete="email"
                required
                className="block w-full bg-state-100 p-3 rounded-lg ring-1 ring-inset ring-gray-300 py-1.5 border-0 focus:ring-2"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Password
            </label>
            <div className="mt-2 relative rounded-md shadow-sm">
              <input
                id="password"
                onChange={handleChanges}
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                className="block w-full bg-state-100 p-3 rounded-lg ring-1 ring-inset ring-gray-300 py-1.5 border-0 focus:ring-2"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:text-gray-800"
                >
                  {showPassword ? (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Re-enter Password
            </label>
            <div className="mt-2">
              <input
                id="confirmPassword"
                onChange={handleConfirmPasswordChange}
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                className="block w-full bg-state-100 p-3 rounded-lg ring-1 ring-inset ring-gray-300 py-1.5 border-0 focus:ring-2"
              />
            </div>
          </div>

          <div>
            <button
              disabled={loading}
              type="submit"
              className="flex w-full justify-center rounded-md bg-amber-400 px-3 py-1.5 text-sm font-semibold leading-6 text-indigo-950 shadow-sm hover:bg-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-300 ease-in-out"
            >
              {loading ? 'Loading...' : 'Create Account'}
            </button>
          </div>
          <OAuth />
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link
            to="/signin"
            className="font-semibold leading-6 text-neutral-900 hover:text-slate-500 transition-all duration-300 ease-in-out"
          >
            Sign in
          </Link>
        </p>
        <p className="mt-5 text-red-700">{error && 'Username already exist'}</p>
        <p className="mt-5 text-red-700">{passerror && 'Password not match'}</p>
      </div>
    </div>
  );
};

export default Signup;
