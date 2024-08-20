import img from "../assets/howitsworks/free.png";
import img1 from "../assets/howitsworks/schedule.png";
import img2 from "../assets/howitsworks/online.png";

function HowItWorks() {
  return (
    <div className="flex flex-col mx-auto 2xl:px-40">
      <h2 className=" ml-2 text-xl text-start text-gray font-semibold">
        How does it work?
      </h2>
      <div className="md:p-6 p-5 flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 mx-auto">
        <div className="group border bg-white shadow-lg rounded-lg p-6 text-center flex-1 hover:-translate-y-2 transition-all ease-in-out duration-300">
          <h3 className="text-xl font-semibold mb-4 mt-4 text-main ">
            1. Browse a Best Therapist Profiles
          </h3>
          <p className="mb-2 text-sm">
            Explore the list of available therapists.
          </p>
          <p className="mb-2 text-sm">
            Click on profiles to view detailed information about their
            qualifications, experience, rates, and reviews from other clients.
          </p>
          <img
            src={img}
            alt="Therapist 1"
            className="w-52 rounded-md mx-auto transition-all ease-in-out duration-700 group-hover:-translate-y-2"
          />
        </div>
        <div className="group border bg-white shadow-lg rounded-lg p-6 text-center flex-1 hover:-translate-y-2 transition-all duration-300 ease-in-out">
          <h3 className="text-xl font-semibold mb-4 mt-4 text-main">
            2. Complete the short questionnaire
          </h3>
          <p className="mb-2 text-sm">Your first consultation is FREE</p>
          <p className="mb-4 text-sm">
            The questionnaire should only take 3 minutes of your time, and will
            help us match you to the right therapists for you. Signup or Login.
          </p>
          <img
            src={img1}
            alt="Therapist 2"
            className="w-52 rounded-md mx-auto transition-all ease-in-out duration-700 group-hover:-translate-y-2"
          />
        </div>

        <div className="group border bg-white shadow-lg rounded-lg p-6 text-center flex-1 hover:-translate-y-2 transition-all ease-in-out duration-300">
          <h3 className="text-xl font-semibold text-main mt-4 mb-4">
            3. Book an Appointment with the therapist
          </h3>
          <p className="mb-2 text-sm">
            Discuss and agree on the session schedule, location (if in-person),
            and payment terms.
          </p>
          <p className="mb-2 text-sm">
            Once everything is agreed upon, you can start the therapy sessions.
          </p>

          <img
            src={img2}
            alt="Therapist 3"
            className="w-52 rounded-md mx-auto transition ease-in-out duration-700 transform group-hover:-translate-y-2"
          />
        </div>
      </div>
    </div>
  );
}

export default HowItWorks;
