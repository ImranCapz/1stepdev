import OAuth from "../components/OAuth";
import logo from "../assets/logo.svg";

export default function SignupModal() {
  return (
    <div>
      <div className="flex flex-col items-center justify-center px-6 py-12">
        <div className="">
          <img className="mx-auto h-10 w-auto" src={logo} alt="Your Company" />
          <OAuth />
        </div>
      </div>
    </div>
  );
}
