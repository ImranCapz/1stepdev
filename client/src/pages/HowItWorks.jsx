import img from "../assets/howitsworks/free.png";
import img1 from "../assets/howitsworks/schedule.png";
import img2 from "../assets/howitsworks/online.png";

function HowItWorks() {
  return (
    <div className="flex flex-col mx-auto 2xl:px-40 max-w-screen-2xl">
      <h1 className="flex justify-center text-center mt-6 text-xl md:text-4xl font-semibold font-sans text-gray">
        Steps to Start Your Therapy Journey
      </h1>
      <div className="md:p-6 p-5 flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 mx-auto">
        <div className="group p-6 text-center flex-1 hover:-translate-y-2 transition-all ease-in-out duration-300">
          {" "}
          <img
            src={img}
            alt="Therapist 1"
            className="w-40 rounded-md mx-auto transition-all ease-in-out duration-700 group-hover:-translate-y-2"
          />
          <h3 className="text-xl font-semibold mb-4 mt-4 text-main">
            1. Browse a Best Therapist Profiles
          </h3>
          <p className="mb-2 text-base text-gray-800">
            Explore the list of available therapists.
          </p>
          <p className="mb-2 text-base text-gray-800">
            Click on profiles to view their qualifications, experience, rates,
            and client reviews.
          </p>
        </div>
        <div className="group p-6 text-center flex-1 hover:-translate-y-2 transition-all duration-300 ease-in-out">
          <img
            src={img1}
            alt="Therapist 2"
            className="w-40 rounded-md mx-auto transition-all ease-in-out duration-700 group-hover:-translate-y-2"
          />
          <h3 className="text-xl font-semibold mb-4 mt-4 text-main">
            2. Complete the short questionnaire
          </h3>
          <p className="mb-2 text-base text-gray-800">
            Your first consultation is FREE.
          </p>
          <p className="mb-4 text-base text-gray-800">
            The 3-minute questionnaire helps us match you with the right
            therapists. Sign up or log in.
          </p>
        </div>
        <div className="group p-6 text-center flex-1 hover:-translate-y-2 transition-all ease-in-out duration-300">
          <img
            src={img2}
            alt="Therapist 3"
            className="w-40 rounded-md mx-auto transition ease-in-out duration-700 transform group-hover:-translate-y-2"
          />
          <h3 className="text-xl font-semibold text-main mt-4 mb-4">
            3. Book a therapy Appointment.
          </h3>
          <p className="mb-2 text-base text-gray-800">
            Discuss and agree on the session schedule.
          </p>
          <p className="mb-2 text-base text-gray-800">
            location (if in-person), and payment terms. Then, you can start your
            therapy sessions.
          </p>
        </div>
      </div>
    </div>
  );
}

export default HowItWorks;
