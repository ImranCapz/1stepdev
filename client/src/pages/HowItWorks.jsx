import img from "../assets/howitsworks/free.png";
import img1 from "../assets/howitsworks/schedule.png";
import img2 from "../assets/howitsworks/online.png";

function HowItWorks() {
  return (
    <div>
      <h2 className="text-3xl text-center md:text-left mb- text-teal-500 font-semibold">
        How does it work?
      </h2>

      <div className="p-16 flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 mx-auto">
        <div className="group border h-[430px] bg-white shadow-lg rounded-lg p-6 text-center flex-1 hover:-translate-y-2 transition-all ease-in-out duration-300">
          <h3 className="text-xl font-semibold mb-4 mt-4 text-main ">
            1. We will find you an online therapist
          </h3>
          <p className="mb-2">
            Fill out our quick registration
            <a href="#" className="text-teal-400">
              form
            </a>
          </p>
          <p className="mb-2">
            We will send recommendations of the best therapists for you to
            choose from.
          </p>
          <img
            src={img}
            alt="Therapist 1"
            className="w-64 rounded-md mx-auto transition-all ease-in-out duration-700 group-hover:-translate-y-2"
          />
        </div>

        <div className="group border bg-white shadow-lg rounded-lg p-6 text-center flex-1 hover:-translate-y-2 transition-all duration-300 ease-in-out">
          <h3 className="text-xl font-semibold mb-4 mt-4 text-main">
            2. Schedule your first appointment
          </h3>
          <p className="mb-2">Your first consultation is FREE</p>
          <p className="mb-4">
            Fit therapy sessions around your work, home & family life.
          </p>
          <img
            src={img1}
            alt="Therapist 2"
            className="w-64 rounded-md mx-auto transition-all ease-in-out duration-700 group-hover:-translate-y-2"
          />
        </div>

        <div className="group border bg-white shadow-lg rounded-lg p-6 text-center flex-1 hover:-translate-y-2 transition-all ease-in-out duration-300">
          <h3 className="text-xl font-semibold text-main mt-4 mb-4">
            3. Start your recovery journey
          </h3>
          <p className="mb-2">Access Therapy. Anytime. Anywhere.</p>
          <p className="mb-2">
            Meet with one of our therapists by video such as Skype or Zoom.
          </p>

          <img
            src={img2}
            alt="Therapist 3"
            className="w-64 rounded-md mx-auto transition ease-in-out duration-700 transform group-hover:-translate-y-2"
          />
        </div>
      </div>
    </div>
  );
}

export default HowItWorks;
