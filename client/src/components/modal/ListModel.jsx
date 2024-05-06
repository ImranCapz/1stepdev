import OAuth from "../../components/OAuth";
import logo from "../../assets/logo.svg";
import heartIcon from '../../assets/listLike.png';
import { Button } from "@material-tailwind/react";
import { Link } from "react-router-dom";

export default function ListModel() {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center py-2">
        <div className="w-full flex flex-col gap-2">
          <img className="mx-auto h-10 w-auto" src={logo} alt="1step" />
          <img className="mx-auto h-20 w-auto" src={heartIcon} alt="heartIcon" />
          <div className="text-center flex gap-2 flex-col">
            <h2 className="text-3xl font-extrabold text-gray">
            Create your first list
            </h2>
            <h4 className="text-sm">Create an account to save a list of providers you&apos;re interested in contacting.</h4>
          </div>
          <div className="flex flex-col gap-2 mt-4">
          <OAuth />
          <Link to='/signup'>
          <Button variant="outlined" className="w-full">Continue with Email</Button>
          </Link>
          </div>
          <div className="mt-4 text-center text-xs p-4">
          By proceeding, you confirm you are at least 18 years old and have read an accept 1Step Health&apos;s&nbsp;
          <Link to='/terms-of-service' className="underline">Terms of Service</Link> and <Link to='/privacy-policy' className="underline">Privacy Policy</Link>.
          </div>
        </div>
      </div>
    </div>
  );
}
