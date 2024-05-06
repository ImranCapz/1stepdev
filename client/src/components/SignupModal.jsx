import OAuth from "../components/OAuth";
import logo from "../assets/logo.svg";
import { Button } from "@material-tailwind/react";
import { Link } from "react-router-dom";

export default function SignupModal() {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-full">
          <img className="mx-auto h-10 w-auto" src={logo} alt="Your Company" />
          <div className="">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray">
              Sign in to unlock the best of 1Step Health
            </h2>
          </div>
          <div className="flex flex-col gap-2 mt-10">
          <OAuth />
          <Link to='/signup'>
          <Button variant="outlined" className="w-full">Continue with Email</Button>
          </Link>
          </div>
          <div className="mt-6 text-center text-xs p-4">
          By proceeding, you confirm you are at least 18 years old and have read an accept 1Step Health&apos;s&nbsp;
          <Link to='/terms-of-service' className="underline">Terms of Service</Link> and <Link to='/privacy-policy' className="underline">Privacy Policy</Link>.
          </div>
        </div>
      </div>
    </div>
  );
}
