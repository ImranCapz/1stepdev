import { Link } from "react-router-dom";
import OAuth from "../OAuth";
import logo from "../../assets/logo.svg";
import parentIcon from "../../assets/parentmodel.jpg";
import PropTypes from "prop-types";

export default function ParentModel({ onClose }) {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center py-2">
        <div className="w-full flex flex-col gap-2">
          <img className="mx-auto h-10 w-auto" src={logo} alt="1step" />
          <img className="mx-auto size-24" src={parentIcon} alt="heartIcon" />
          <div className="text-center flex gap-2 flex-col">
            <h2 className="text-2xl font-extrabold text-gray">
              Create your parent Profile
            </h2>
            <h4 className="text-sm">
              Create an account to interact with providers and connect with the
              right professionals for your needs.
            </h4>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <OAuth
              onClose={onClose}
              redirect="/dashboard?tag=Parent%20Details"
            />
            <Link to="/signup" onClick={onClose}>
              <button className="p-2 w-full btn-color rounded-lg">
                Continue with Email
              </button>
            </Link>
          </div>
          <div className="mt-4 text-center text-xs p-4">
            By proceeding, you confirm you are at least 18 years old and have
            read an accept 1Step Health&apos;s&nbsp;
            <Link to="/terms-of-service" className="underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy-policy" className="underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

ParentModel.propTypes = {
  onClose: PropTypes.func,
};
