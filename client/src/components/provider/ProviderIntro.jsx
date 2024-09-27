import {
  FaCalendarAlt,
  FaDesktop,
  FaMoneyBill,
  FaGoogle,
  FaApple,
} from "react-icons/fa";
import {
  FcApproval,
  FcCurrencyExchange,
  FcSalesPerformance,
  FcGlobe,
} from "react-icons/fc";
import img from "../../assets/providerintro/preview (1).jpg";
import pic from "../../assets/providerintro/1.jpg";
import pic1 from "../../assets/providerintro/2.jpg";
import pic2 from "../../assets/providerintro/3.jpg";
import pic3 from "../../assets/providerintro/4.jpeg";
import profileImage from "../../pages/providerscreen/createprovider.png";
import { Button } from "flowbite-react";
import img1 from "../../assets/providerintro/abc.jpeg";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import OAuth from "../../components/OAuth";

function ProviderIntro() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const { currentProvider } = useSelector((state) => state.provider);
  return (
    <div>
      {!currentProvider && (
        <div className="overflow-x-hidden">
          <div className="flex flex-col">
            <section className="p-4 bg-purple-100 flex flex-col justify-center items-center w-full">
              <div className="container mx-auto flex flex-col md:flex-col lg:flex-row bg-transparent max-w-screen-2xl">
                <div className="flex-1 p-5">
                  <h1 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl  font-bold text-purple-900 text-left">
                    Start Your Therapy Practice with Just a Few Clicks
                  </h1>

                  <p className="text-gray-500 font-semibold my-4 text-left text-base sm:text-sm md:text-lg lg:text-xl">
                    Join OneStep, India’s leading platform for online therapy
                    and counseling!
                  </p>

                  <p className="text-gray-700 mt-4 text-left text-base sm:text-sm md:text-lg lg:text-xl">
                    Your search for "online therapist jobs" ends with OneStep!
                  </p>

                  <p className="text-gray-700 mt-4 text-left text-base sm:text-xl md:text-lg lg:text-xl">
                    Whether you’re a new therapist looking to build your
                    practice or an experienced professional seeking more
                    clients, OneStep provides a seamless way to start offering
                    therapy services online.
                  </p>

                  <ul className=" text-gray-700 mt-6 space-y-2 text-left text-base md:text-lg lg:text-xl">
                    <li className="flex space-x-2 text-purple-900">
                      <FaCalendarAlt className="hidden md:block mt-1" />
                      <span>
                        <strong>Flexible Schedule:</strong> Set your own hours
                        and work from the comfort of your home.
                      </span>
                    </li>
                    <li className="flex space-x-2 text-purple-900">
                      <FaDesktop className="hidden md:block mt-1" />
                      <span>
                        <strong>Provide Therapy Sessions in Your Area:</strong>{" "}
                        Specializing in Various Fields
                      </span>
                    </li>
                    <li className="flex space-x-2 text-purple-900">
                      <FaMoneyBill className="hidden md:block mt-1" />
                      <span>
                        <strong>Competitive Rates:</strong> ₹500 per hour or
                        More
                      </span>
                    </li>
                  </ul>

                  <p className="text-gray-700 mt-4 text-left text-base sm:text-sm md:text-lg lg:text-xl">
                    Provide specialized therapy services through OneStep,
                    including art therapy, music therapy, occupational therapy,
                    and more. Reach clients both locally and globally through
                    our platform.
                  </p>
                  <p className="text-gray-700 mt-4 text-left text-base sm:text-sm md:text-lg lg:text-xl">
                    Sign up using the OneStep Login - No commission charged - No
                    Registration Fee
                  </p>
                </div>
                <div className="flex-1 items-center justify-center md:bg-transparent bg-white p-8 w-full my-auto">
                  <h2 className="text-2xl font-semibold mb-6 text-center text-gray">
                    {currentUser
                      ? "Create your profile for your therapy practice"
                      : " Create your profile"}
                  </h2>
                  {currentUser ? (
                    <div className="flex flex-col items-center justify-center">
                      <img
                        src={profileImage}
                        alt="profile"
                        className="flex items-center h-32 w-34 object-cover rounded-full bg-gray-400 p-1"
                      />
                      <Button
                        to={"/dashboard?tab=providers"}
                        className=" rounded-lg mt-4 text-xl"
                        onClick={() => navigate("/dashboard?tab=providers")}
                      >
                        Create Profile
                      </Button>
                    </div>
                  ) : (
                    <div className="w-full flex flex-col items-center justify-center">
                      <form className="w-[560px] space-y-4 bg-white md:p-10 md:rounded-lg md:shadow-2xl">
                        <div className="w-full flex text-center  btn-color p-2 rounded-lg">
                          <Link to={"/signup"} className="w-full ">
                            Sign-up via email
                          </Link>
                        </div>

                        <div className="text-center text-gray-500">or</div>
                        <div className="">
                          <OAuth redirect="/dashboard?tab=providers" />
                        </div>

                        <div className="text-center mt-4 text-gray-500">
                          <p href="#" className="">
                            Do you already have an account?{" "}
                            <Link to={"/signin"} className="text-slate-900">
                              Sign in
                            </Link>
                          </p>
                        </div>
                      </form>{" "}
                      <p className="text-center text-gray-500 mt-4">
                        By signing up, you agree to our{" "}
                        <a href="#" className="text-blue-500">
                          terms
                        </a>
                        .
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section className="bg-color relative z-20 mt-5 p-5">
              {/* <div className="container mx-auto">
              <h1 className="text-2xl mb-5 font-bold text-purple-900 text-center md:text-3xl lg:text-4xl">
                Join the OneStep!
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8">
                <div className="flex justify-center items-center">
                  <img
                    src={img}
                    alt="Tutor example"
                    className="lg:w-auto lg:h-52 md:w-64 md:h-64 hidden md:block"
                  />
                </div>

                <div className="flex flex-col justify-center">
                  <h2 className="text-xl font-bold text-purple-900 mb-4 text-center md:text-right lg:text-right md:text-3xl">
                    Take the First Step to Wellness!
                  </h2>
                  <p className="text-gray-600 text-base mb-4 text-center md:text-lg md:text-right lg:text-right lg:text-xl">
                    By signing up with OneStep, you join a caring community of
                    certified therapists and mental health professionals
                    dedicated to supporting you on your journey.
                  </p>
                </div>
              </div>

              <div className=" container mx-auto mt-5">
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8">
                  <div className="flex flex-col justify-center">
                    <h2 className="text-xl font-bold text-purple-900 mb-4 text-center md:text-left lg:text-left md:text-3xl">
                      Meaningful Connections and Transformative Experiences
                    </h2>
                    <p className="text-gray-600  mb-4 text-center md:text-lg md:text-left lg:text-left lg:text-xl">
                      At OneStep, humans are at the core of every interaction.
                      Each day, we foster compassion, empathy, and growth to
                      create the perfect connection between therapists and
                      clients.
                    </p>
                  </div>

                  <div className="flex justify-center items-center">
                    <img
                      src={img1}
                      alt="Tutor example"
                      className=" lg:w-auto lg:h-52 md:w-64 md:h-64 hidden md:block rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div> */}
            </section>
            <section className=" flex flex-col justify-center items-center w-full">
              <div className="container mx-auto">
                <h1 className="text-2xl mb-5 font-bold text-purple-900 text-center md:text-3xl lg:text-4xl">
                  How Can I Become a Therapist on OneStep?
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 md:px-52 gap-4">
                  <div className="flex flex-col justify-center">
                    <h2 className="text-2xl font-bold text-purple-900 mb-4 text-center md:text-left">
                      Create Your Therapist Profile
                    </h2>

                    <p className="text-gray-600 text-base mb-4 lg:text-xl text-center md:text-lg">
                      Build a profile that highlights your specializations,
                      experience, and the unique care you offer
                    </p>
                  </div>
                  <div className="flex justify-center items-center">
                    <img
                      src={pic2}
                      alt="Tutor example"
                      className=" lg:w-auto lg:h-52 w-44 h-44 md:w-60 md:h-60"
                    />
                  </div>
                  <div className="flex flex-col justify-center items-center order-2 md:order-none">
                    <img
                      src={pic1}
                      alt="Tutor example"
                      className="md:w-56 md:h-56 lg:w-auto lg:h-52 w-44 h-44"
                    />
                  </div>
                  <div className="flex flex-col justify-center order-1 md:order-none">
                    <h2 className="text-2xl font-bold text-purple-900 mb-4 text-center md:text-right">
                      Set Your Therapy Conditions
                    </h2>
                    <p className="text-gray-600 lg:text-xl mb-4 text-left md:text-lg md:text-right">
                      You have complete control over your schedule, session
                      fees, and therapeutic approach. Update Your Therapy
                      Conditions
                    </p>
                  </div>

                  <div className="flex flex-col justify-center order-3 md:order-none">
                    <h2 className="text-2xl font-bold text-purple-900 mb-4 text-center md:text-left">
                      Start Helping Clients
                    </h2>
                    <p className="text-gray-600  lg:text-xl mb-4 text-left md:text-lg">
                      Once your profile is live, begin offering therapy sessions
                      and making a difference
                    </p>
                  </div>
                  <div className="flex justify-center items-center order-4 md:order-none">
                    <img
                      src={pic}
                      alt="Tutor example"
                      className="md:w-56 md:h-56 lg:w-auto lg:h-52 w-44 h-44"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* <section className="bg-blue-50 flex flex-col justify-center items-center w-full p-5 mt-5">
            <div className="container">
              <h1 className="text-2xl mb-5 font-bold text-purple-900 text-center md:text-3xl">
                We are here to support you!
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8">
                <div className="flex flex-col justify-center md:p-10 p-0">
                  <p className="text-gray-600  lg:text-xl mb-4 text-left md:text-lg"></p>
                  <p className="text-gray-600 text-base mb-4 lg:text-xl text-left md:text-lg"></p>
                </div>
                <div className="flex flex-col my-auto text-left text-base md:text-lg lg:text-xl text-gray-600 font-semibold">
                  <div className="flex items-start">
                    <FcApproval className="mt-2"></FcApproval>
                    <li className="list-none ml-2">
                      Your personal information fully protected.
                    </li>
                  </div>
                  <div className="flex items-start">
                    <FcApproval className="mt-2"></FcApproval>
                    <li className="list-none ml-2">
                      Clients are verified and highly committed.
                    </li>
                  </div>
                  <div className="flex items-start">
                    <FcApproval className="mt-2"></FcApproval>
                    <li className="list-none ml-2">
                      Therapist Community Collaboration Hub.
                    </li>
                  </div>
                  <div className="flex items-start">
                    <FcApproval className="mt-2"></FcApproval>
                    <li className="list-none ml-2">
                      Secure and private platform for therapists.
                    </li>
                  </div>
                </div>
              </div>
            </div>
          </section> */}
            {/* <section className=" flex flex-col justify-center items-center w-full p-5 mt-5">
            <div className="container">
              <h1 className="text-2xl mb-5 font-bold text-purple-900 text-center md:text-3xl">
                Freedom to Schedule!
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-3 mt-16 gap-10">
                <div>
                  <FcCurrencyExchange className="w-10 h-10"></FcCurrencyExchange>
                  <h1 className="text-base font-bold text-start md:text-2xl md:font-normal">
                    Set Your Fees
                  </h1>
                  <p className="mt-5 text-start md:text-lg lg:text-xl">
                    You have full control over your service fees. Set your rates
                    based on your expertise and experience, and let potential
                    clients know the value you bring to their journey.
                  </p>
                </div>
                <div>
                  <FcSalesPerformance className="w-10 h-10"></FcSalesPerformance>
                  <h1 className="text-base font-bold text-start md:text-2xl md:font-normal">
                    No Risk, All Reward
                  </h1>
                  <p className="mt-5 text-start md:text-lg lg:text-xl">
                    You have full control over your service fees. Set your rates
                    based on your expertise and experience, and let potential
                    clients know the value you bring to their journey.
                  </p>
                </div>
                <div>
                  <FcGlobe className="w-10 h-10"></FcGlobe>
                  <h1 className="text-base font-bold text-start md:text-2xl md:font-normal">
                    Global Reach
                  </h1>
                  <p className="mt-5 text-start md:text-lg lg:text-xl">
                    Connect with clients from around the world. OneStep supports
                    therapists in over 40 countries, giving you the opportunity
                    to expand your practice and help people from diverse
                    backgrounds.
                  </p>
                </div>
              </div>
            </div>
          </section>
          <section className="bg-purple-100 flex flex-col justify-center items-center w-full p-5 mt-5">
            <div className="container">
              <h1 className="text-2xl mb-5 font-bold text-purple-900 md:text-3xl">
                OneStep is:
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-3 mt-5 mb-5">
                <div className="w-40 h-40 md:w-44 md:h-44 lg:w-60 lg:h-60 bg-purple-500 rounded-full mx-auto flex items-center justify-center">
                  <h1 className="md:text-2xl text-xl font-bold text-purple-900 lg:text-3xl">
                    Providers
                  </h1>
                </div>
                <div className="w-40 h-40 md:w-44 md:h-44 lg:w-60 lg:h-60 bg-purple-500 rounded-full mx-auto flex items-center justify-center">
                  <h1 className="md:text-2xl text-xl font-bold text-purple-900 text-center lg:text-3xl">
                    Therapy Sessions
                  </h1>
                </div>
                <div className="w-40 h-40 md:w-44 md:h-44 lg:w-60 lg:h-60 bg-purple-500 rounded-full mx-auto flex items-center justify-center">
                  <h1 className="md:text-2xl text-xl font-bold text-purple-900 text-center lg:text-3xl">
                    +100 Therapy Fields
                  </h1>
                </div>
              </div>
            </div>
          </section> */}

            {/* <section className="flex flex-col justify-center items-center w-full p-5 mt-5">
            <div className="container">
              <div className="grid grid-cols-1 md:grid-cols-2 mt-16 gap-5">
                <div>
                  <div className="bg-orange-100 w-auto  h-36 rounded-2xl  justify-start items-center mx-auto grid grid-cols-1 md:grid-cols-2">
                    <h1 className="my-auto text-start p-5 font-semibold text-xl text-orange-500">
                      All of our Therapies by city
                    </h1>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-5 gap-2 md:gap-0 text-start">
                    <p>Mumbai</p>
                    <p>Chennai</p>
                    <p className="break-words">Thiruvananthapuram</p>
                    <p>Kolkata</p>
                    <p>Bangalore</p>
                    <p>Jaipur</p>
                  </div>
                </div>

                <div>
                  <div className="bg-blue-100 w-auto h-36 rounded-2xl flex justify-start items-center mx-auto">
                    <h1 className="my-auto text-start p-5 font-semibold text-xl text-blue-500">
                      All of our sessions by therapies
                    </h1>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-5 gap-2 text-start">
                    <p>Speech Therapy</p>
                    <p>Art Therapy</p>
                    <p>Music Therapy</p>
                    <p>Occupational Therapy</p>
                    <p>School-Based Service</p>
                    <p>Counselling</p>
                    <p>Social Skills Group</p>
                  </div>
                </div>
              </div>
            </div>
          </section> */}

            {/* <section className="flex flex-col justify-center items-center w-full p-5 mt-5">
            <div className="container ">
              <h1 className="text-2xl mt-10 font-bold text-purple-900 md:text-3xl text-center lg:text-4xl">
                Giving private sessions, how does it work?
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 mt-5 gap-10 md:p-10">
                <div className="tracking-wide">
                  <p className="text-start md:text-lg lg:text-xl">
                    If you're looking to become a therapist, you've come to the
                    right place. With thousands of therapists already offering
                    their services through OneStep, you can join a global
                    network of professionals helping clients worldwide.
                  </p>
                  <p className="text-start mt-5 font-semibold md:text-lg lg:text-xl">
                    How to become a therapist on OneStep?
                  </p>
                  <p className="text-start md:text-lg lg:text-xl">
                    Getting started is simple! By landing on this page, you’re
                    already halfway there. In just 10 minutes, you can create
                    your profile and begin offering therapy sessions locally or
                    online. All we ask is that you provide a brief description
                    of your background and expertise. Whether you’re newly
                    licensed or have years of experience, OneStep welcomes you
                    to share your skills. Make sure to upload a professional
                    photo to complete your profile.
                  </p>
                  <p className="text-start mt-5 font-semibold md:text-lg lg:text-xl">
                    Why become a therapist on OneStep?
                  </p>
                  <p className="text-start md:text-lg lg:text-xl">
                    Everyone has a unique approach to therapy, and with OneStep,
                    you have the flexibility to offer your services on your
                    terms. Whether you’re looking for part-time work, want to
                    expand your practice, or transition to working fully online,
                    OneStep provides the tools to reach a wider audience.
                  </p>
                  <p className="text-start md:text-lg lg:text-xl">
                    Our platform is <strong>free to use</strong> for therapists.
                    With thousands of people seeking therapy sessions daily,
                    your profile will gain exposure to a diverse clientele.
                  </p>
                  <p className="text-start mt-5 font-semibold md:text-lg lg:text-xl">
                    Do I need specific qualifications to offer therapy?
                  </p>
                  <p className="text-start md:text-lg lg:text-xl">
                    As a therapist on OneStep, you’ll need appropriate
                    credentials to provide your services. If you’re licensed in
                    your field—whether it's cognitive-behavioral therapy, art
                    therapy, or occupational therapy—you’re welcome to join.
                    Just provide a brief description of your experience and
                    areas of expertise, and let your profile do the rest.
                  </p>
                  <p className="text-start mt-5 font-semibold md:text-lg lg:text-xl">
                    I’m new to therapy… Can I still offer services?
                  </p>
                  <p className="text-start md:text-lg lg:text-xl">
                    Absolutely! If you’re newly certified or working towards
                    expanding your client base, OneStep is a great place to
                    start. Whether you specialize in couples therapy, mental
                    health coaching, or mindfulness training, there’s a place
                    for everyone on our platform.
                  </p>
                  <p className="text-start mt-5 font-semibold md:text-lg lg:text-xl">
                    {" "}
                    What types of therapy can I offer?
                  </p>
                  <p className="text-start md:text-lg lg:text-xl">
                    At OneStep, we support a wide range of therapy practices,
                    including but not limited to:
                  </p>
                  <div className="text-start md:text-lg lg:text-xl">
                    <li>Cognitive Behavioral Therapy (CBT)</li>
                    <li>Art Therapy</li>
                    <li>Occupational Therapy</li>
                    <li>Music Therapy</li>
                    <p className="text-start mt-5 md:text-lg lg:text-xl">
                      You don’t need to be a clinical psychologist to make an
                      impact. Therapists with a variety of certifications are
                      welcome to share their knowledge, provided they are
                      licensed to practice in their respective fields.
                    </p>
                  </div>
                </div>

                <div className="tracking-wide">
                  <p className="text-start font-semibold md:text-lg lg:text-xl">
                    Highlight your strengths (your skills, your experience, your
                    approach)
                  </p>
                  <p className="text-start md:text-lg lg:text-xl">
                    Consider why a client might choose you over another
                    therapist. Showcase what makes you unique. Share details
                    about your therapeutic style, methods, and the type of
                    therapy you specialize in. Whether it’s cognitive behavioral
                    therapy, mindfulness-based practices, or art therapy, make
                    sure potential clients understand the value you bring.
                  </p>
                  <p className="text-start mt-5 font-semibold md:text-lg lg:text-xl">
                    Share your story
                  </p>
                  <p className="text-start md:text-lg lg:text-xl">
                    Therapy is about more than just providing support — it’s
                    about building trust and connection with your clients. Give
                    potential clients a glimpse into who you are as a person.
                    Share your journey, interests, any groups you’re part of,
                    your previous experience, and how it all shaped your
                    approach to therapy. This helps foster a deeper, more
                    personal connection.
                  </p>
                  <p className="text-start mt-5 font-semibold md:text-lg lg:text-xl">
                    Focus on the benefits: what are you offering your clients?
                  </p>
                  <p className="text-start md:text-lg lg:text-xl">
                    Avoid jargon that might be hard for clients to understand.
                    Clearly explain what your services provide, including the
                    types of therapy you specialize in, the issues you help with
                    (anxiety, trauma, relationship challenges, etc.), and how
                    your clients will benefit from your sessions.
                  </p>
                  <p className="text-start mt-5 font-semibold md:text-lg lg:text-xl">
                    Review your profile
                  </p>
                  <p className="text-start md:text-lg lg:text-xl">
                    Before publishing, make sure your profile is error-free and
                    polished. A carefully written profile will leave a
                    professional impression and attract more clients.
                  </p>
                  <p className="text-start font-semibold mt-5 md:text-lg lg:text-xl">
                    Can I offer both online and in-person sessions?
                  </p>
                  <p className="text-start md:text-lg lg:text-xl">
                    Yes, OneStep allows you to provide both online and in-person
                    sessions, depending on your preference and the needs of your
                    clients. You can specify your availability for each option
                    in your profile. Offering online sessions allows you to
                    expand your reach beyond your local area, while in-person
                    sessions may appeal to clients who prefer face-to-face
                    interaction.
                  </p>
                  <p className="text-start  mt-5 md:text-lg lg:text-xl">
                    Each therapist has their own techniques, methods, and
                    strategies to help clients on their journey toward
                    well-being. A good therapist invests the time to create a
                    personalized, structured, and individualized plan for each
                    client. Through this tailored approach, clients can develop
                    new coping mechanisms and strengthen existing emotional and
                    mental health skills, allowing them to make meaningful
                    progress in their personal growth.
                  </p>
                </div>
              </div>
            </div>
          </section> */}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProviderIntro;
