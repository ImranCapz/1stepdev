import pic1 from "../../assets/providerintro/1.png";
import pic2 from "../../assets/providerintro/2.png";
import pic3 from "../../assets/providerintro/3.png";
import profileImage from "../../pages/providerscreen/createprovider.png";
import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { HiOutlineArrowRight } from "react-icons/hi";

function ProviderIntro() {
  const navigate = useNavigate();
  return (
    <div>
      <div className="overflow-x-hidden">
        <div className="flex flex-col">
          <section className="flex flex-col bg-purple-100 justify-center items-center w-full">
            <div className="container mx-auto mt-10 mb-10 ">
              <h1 className="text-2xl mb-5 mt-5 font-bold text-purple-900 text-center md:text-3xl 2xl:text-4xl">
                How Can I Become a Therapist on OneStep?
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 md:px-64 gap-4">
                <div className="flex flex-col justify-center">
                  <h2 className="text-xl font-semibold text-main mb-4 text-center md:text-left">
                    Create Your Therapist Profile
                  </h2>

                  <p className="text-gray-600 2xl:text-xl mb-4 md:text-left text-center md:text-base">
                    Build a profile that highlights your specializations,
                    experience, and the unique care you offer
                  </p>
                </div>
                <div className="flex justify-center items-center">
                  <img
                    src={pic1}
                    alt="Tutor example"
                    className=" lg:w-auto lg:h-52 w-44 h-44 md:w-60 md:h-60"
                  />
                </div>
                <div className="flex flex-col justify-center items-center order-2 md:order-none">
                  <img
                    src={pic2}
                    alt="Tutor example"
                    className="md:w-56 md:h-56 lg:w-auto lg:h-52 w-44 h-44"
                  />
                </div>
                <div className="flex flex-col justify-center order-1 md:order-none">
                  <h2 className="text-xl font-semibold text-main mb-4 text-center md:text-left">
                    Set Your Therapy Conditions
                  </h2>
                  <p className="text-gray-600 2xl:text-xl mb-4 md:text-left text-center md:text-base">
                    You have complete control over your schedule, session fees,
                    and therapeutic approach. Update Your Therapy Conditions
                  </p>
                </div>

                <div className="flex flex-col justify-center order-3 md:order-none">
                  <h2 className="text-xl font-semibold text-main mb-4 text-center md:text-left">
                    Start Helping Clients
                  </h2>
                  <p className="text-gray-600 2xl:text-xl mb-4 md:text-left text-center md:text-base">
                    Once your profile is live, begin offering therapy sessions
                    and making a difference
                  </p>
                </div>
                <div className="flex justify-center items-center order-4 md:order-none">
                  <img
                    src={pic3}
                    alt="Tutor example"
                    className="md:w-56 md:h-56 lg:w-auto lg:h-52 w-44 h-44"
                  />
                </div>
              </div>
            </div>
          </section>
          <section className="p-4 flex flex-col justify-center items-center w-full">
            <div className="container mx-auto flex flex-col md:flex-col lg:flex-row bg-transparent max-w-screen-2xl">
              <div className="flex-1 items-center justify-center md:bg-transparent bg-white p-8 w-full my-auto">
                <h2 className="text-2xl font-semibold mb-6 text-center text-gray">
                  <p>Create your profile for your therapy practice</p>
                </h2>
                <div className="flex flex-col items-center justify-center">
                  <img
                    src={profileImage}
                    alt="profile"
                    className="flex items-center h-32 w-34 object-cover rounded-full bg-gray-400 p-1"
                  />
                  <Button
                    className=" rounded-lg mt-4"
                    onClick={() => navigate("/for-providers")}
                  >
                    Get Started
                    <HiOutlineArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default ProviderIntro;
