import logo from "../assets/aboutus/Aboutus.png";
import { Carousel } from "flowbite-react";
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import img1 from "../assets/aboutus/empower.png";
import img2 from "../assets/aboutus/growth.png";
import img3 from "../assets/aboutus/service.png";
import { Accordion } from "flowbite-react";
function AboutUs() {
  document.title = "How it Works | 1Step";
  return (
    <>
      <div className="max-w-screen-2xl mx-auto px-4 py-9 gap-12 xl:flex md:px-8">
        <div className="space-y-4 max-w-2xl mx-auto text-center xl:text-left">
          <h1 className="text-xl text-main font-bold mx-px md:text-2xl md:mt-16">
            ABOUT US
          </h1>
          <p className="max-w-2xl mx-auto mt-2 text-3xl md:text-5xl text-main font-extrabold">
            Our mission is to help you find the best service providers in your
            area.
          </p>
          <h3 className="text-gray-600 font-medium text-base">
            We are dedicated to connecting you with top-rated service providers
            tailored to your needs. Our platform makes it easy to discover and
            choose the best professionals in your local area. Trust us to help
            you find quality services that meet your expectations.
          </h3>
        </div>
        <div className="flex-1 max-w-xl mx-auto">
          <img src={logo} className="size-62" />
        </div>
      </div>
      <div className="h-56 sm:h-64 xl:h-80 2xl:h-96 bg-primary-90">
        <Carousel
          className="text-center"
          sliderInterval={5000}
          leftControl={
            <button className="p-2 hidden sm:block text-purple-600 bg-purple-300 rounded-2xl ">
              <FaArrowLeft className="text-xl" />
            </button>
          }
          rightControl={
            <button className="p-2 hidden sm:block text-purple-600 bg-purple-300 rounded-2xl ">
              <FaArrowRight className="text-xl" />
            </button>
          }
        >
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">
            Create Your Profile<br></br>
            <spanc className="text-sm md:text-xl">
              Easily set up your provider profile by adding your qualifications,
              <br></br>
              experience, and services offered.
            </spanc>
          </h1>
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">
            Receive Booking Requests<br></br>
            <spanc className="text-sm md:text-xl font-semibold">
              Once your profile is live, clients can view and send booking
              requests.
            </spanc>
          </h1>
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">
            Manage Your Schedule<br></br>
            <spanc className="text-sm md:text-xl">
              Effortlessly manage your appointments with our scheduling tool.
            </spanc>
          </h1>
        </Carousel>
      </div>
      <div className="flex flex-col mx-auto 2xl:px-40">
        <h1 className="flex justify-center text-center mt-16 text-xl md:text-4xl font-semibold font-sans text-gray">
          Our Commitment to Families and Providers
        </h1>
        <div className="md:p-6 p-5 flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 mx-auto">
          <div className="group p-6 text-center flex-1 hover:-translate-y-2 transition-all ease-in-out duration-300">
            {" "}
            <img
              src={img1}
              alt="Therapist 1"
              className="w-40 rounded-md mx-auto transition-all ease-in-out duration-700 group-hover:-translate-y-2"
            />
            <h3 className="text-xl font-semibold mb-4 mt-4 text-main">
              Empower Community
            </h3>
            <p className="mb-2 text-base text-gray-600 font-body">
              We believe in empowering families and service providers through
              collaboration. By fostering a supportive network, we aim to create
              an environment where everyone thrives.
            </p>
          </div>
          <div className="group p-6 text-center flex-1 hover:-translate-y-2 transition-all duration-300 ease-in-out">
            <img
              src={img2}
              alt="Therapist 2"
              className="w-40 rounded-md mx-auto transition-all ease-in-out duration-700 group-hover:-translate-y-2"
            />
            <h3 className="text-xl font-semibold mb-4 mt-4 text-main">
              Commit to Growth
            </h3>
            <p className="mb-4 text-base text-gray-600 font-body">
              We prioritize continuous improvement and professional development.
              By staying informed about best practices and emerging trends, we
              enhance our ability to support the families we serve.
            </p>
          </div>
          <div className="group p-6 text-center flex-1 hover:-translate-y-2 transition-all ease-in-out duration-300">
            <img
              src={img3}
              alt="Therapist 3"
              className="w-40 rounded-md mx-auto transition ease-in-out duration-700 transform group-hover:-translate-y-2"
            />
            <h3 className="text-xl font-semibold text-main mt-4 mb-4">
              Integrity in Service
            </h3>

            <p className="mb-2 text-base text-gray-600 font-body">
              We uphold the highest standards of integrity and transparency in
              our work. Our commitment to ethical practices ensures that
              families and providers can trust us to act in their best
              interests.
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center bg-primary-90">
        <h1 className="flex justify-center text-center mt-16 text-xl md:text-4xl font-semibold font-sans text-gray mb-4 ">
          Frequently Asked Questions
        </h1>
        <h2 className="text-center text-gray-700 mb-4 md:mb-8 md:mt-4">
          Feel free to reach out to us at info@onestep.co.in if you have any
          other questions.
        </h2>
        <div className="p-2 w-full md:px-40">
          <Accordion collapseAll>
            <Accordion.Panel>
              <Accordion.Title>What is OneStep?</Accordion.Title>
              <Accordion.Content>
                <p className="mb-2 text-gray-500 dark:text-gray-400">
                  OneStep is a comprehensive platform designed to connect
                  individuals with qualified service providers in their local
                  area. Our mission is to simplify the process of finding and
                  booking professional services tailored to your needs. Whether
                  you’re seeking a therapist, doctor, or any other expert,
                  OneStep ensures a seamless experience from browsing provider
                  profiles to scheduling appointments. We prioritize quality,
                  trust, and accessibility, empowering users to make informed
                  decisions about their service needs.
                </p>
              </Accordion.Content>
            </Accordion.Panel>
            <Accordion.Panel>
              <Accordion.Title>where onestep is available?</Accordion.Title>
              <Accordion.Content>
                <p className="mb-2 text-gray-500 dark:text-gray-400">
                  Flowbite is first conceptualized and designed using the Figma
                  software so everything you see in the library has a design
                  equivalent in our Figma file.
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  Check out the
                  <a
                    href="https://flowbite.com/figma/"
                    className="text-cyan-600 hover:underline dark:text-cyan-500"
                  >
                    Figma design system
                  </a>
                  based on the utility classes from Tailwind CSS and components
                  from Flowbite.
                </p>
              </Accordion.Content>
            </Accordion.Panel>
            <Accordion.Panel>
              <Accordion.Title>
                What are the Services we offers?
              </Accordion.Title>
              <Accordion.Content>
                <p className="mb-2 text-gray-500 dark:text-gray-400">
                  The main difference is that the core components from Flowbite
                  are open source under the MIT license, whereas Tailwind UI is
                  a paid product. Another difference is that Flowbite relies on
                  smaller and standalone components, whereas Tailwind UI offers
                  sections of pages.
                </p>
                <p className="mb-2 text-gray-500 dark:text-gray-400">
                  However, we actually recommend using both Flowbite, Flowbite
                  Pro, and even Tailwind UI as there is no technical reason
                  stopping you from using the best of two worlds.
                </p>
                <p className="mb-2 text-gray-500 dark:text-gray-400">
                  Learn more about these technologies:
                </p>
                <ul className="list-disc pl-5 text-gray-500 dark:text-gray-400">
                  <li>
                    <a
                      href="https://flowbite.com/pro/"
                      className="text-cyan-600 hover:underline dark:text-cyan-500"
                    >
                      Flowbite Pro
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://tailwindui.com/"
                      rel="nofollow"
                      className="text-cyan-600 hover:underline dark:text-cyan-500"
                    >
                      Tailwind UI
                    </a>
                  </li>
                </ul>
              </Accordion.Content>
            </Accordion.Panel>
          </Accordion>
        </div>
      </div>
    </>
  );
}

export default AboutUs;
