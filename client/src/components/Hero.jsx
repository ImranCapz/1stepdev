import Typewriter from "typewriter-effect";
import { Link, useNavigate } from "react-router-dom";
import { SearchBar } from "../components/SearchBar";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import  imagehome from "../assets/homeimage.png"
import { Card, Modal } from "flowbite-react";
import { SlSpeech } from "react-icons/sl";
import { LuStethoscope } from "react-icons/lu";
import { FaHandHoldingMedical } from "react-icons/fa";
import ListModel from "./modal/ListModel";
import heartIcon from "../assets/listLike.png";
import freescanner from "../assets/freescanner.png";
import search from "../assets/search.png";
import { RiMusic2Fill } from "react-icons/ri";

const Hero = () => {
  const { searchTerm } = useParams();
  const [defaultsearchTerm, setDefaultSearchTerm] = useState(searchTerm);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    setDefaultSearchTerm(searchTerm);
  }, [searchTerm]);

  document.title = "Your first step for all therapy needs";

  function onCloseModal() {
    setOpenModal(false);
  }

  const startSearching = ()=> {
    window.scrollTo(0, 0);
    navigate("/Diagnostic%20Evaluation");
  }
  const integrations = [
    {
      title: "",
      desc: "1Step offers the IASQ-ASD autism screener tools, which are clinically-validated and widely used by healthcare professionals. The results will let you know if a further evaluation may be needed.",
      icon: (
        <img src="https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg" />
      ),
    },
  ];
  const navigate = useNavigate();
  const features = [
    {
      name: "Trusted",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "Over 50+ videos",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M1 4.75C1 3.784 1.784 3 2.75 3h14.5c.966 0 1.75.784 1.75 1.75v10.515a1.75 1.75 0 01-1.75 1.75h-1.5c-.078 0-.155-.005-.23-.015H4.48c-.075.01-.152.015-.23.015h-1.5A1.75 1.75 0 011 15.265V4.75zm16.5 7.385V11.01a.25.25 0 00-.25-.25h-1.5a.25.25 0 00-.25.25v1.125c0 .138.112.25.25.25h1.5a.25.25 0 00.25-.25zm0 2.005a.25.25 0 00-.25-.25h-1.5a.25.25 0 00-.25.25v1.125c0 .108.069.2.165.235h1.585a.25.25 0 00.25-.25v-1.11zm-15 1.11v-1.11a.25.25 0 01.25-.25h1.5a.25.25 0 01.25.25v1.125a.25.25 0 01-.164.235H2.75a.25.25 0 01-.25-.25zm2-4.24v1.125a.25.25 0 01-.25.25h-1.5a.25.25 0 01-.25-.25V11.01a.25.25 0 01.25-.25h1.5a.25.25 0 01.25.25zm13-2.005V7.88a.25.25 0 00-.25-.25h-1.5a.25.25 0 00-.25.25v1.125c0 .138.112.25.25.25h1.5a.25.25 0 00.25-.25zM4.25 7.63a.25.25 0 01.25.25v1.125a.25.25 0 01-.25.25h-1.5a.25.25 0 01-.25-.25V7.88a.25.25 0 01.25-.25h1.5zm0-3.13a.25.25 0 01.25.25v1.125a.25.25 0 01-.25.25h-1.5a.25.25 0 01-.25-.25V4.75a.25.25 0 01.25-.25h1.5zm11.5 1.625a.25.25 0 01-.25-.25V4.75a.25.25 0 01.25-.25h1.5a.25.25 0 01.25.25v1.125a.25.25 0 01-.25.25h-1.5zm-9 3.125a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "400 ratings",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ];

  return (
    <section>
      <div className="max-w-screen-2xl mx-auto px-4 py-9 gap-12 text-gray-600 md:px-8 xl:flex">
        <div className="space-y-5 max-w-2xl mx-auto text-center xl:text-left">
          <div className="flex flex-wrap items-center justify-center gap-6 xl:justify-start">
            {/* {features.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-x-2 text-gray-500 text-sm"
              >
                {item.icon}
                {item.name}
              </div>
            ))} */}
          </div>
          <h1 className="text-4xl text-main font-extrabold mx-px md:text-5xl">
            Your first step for all{" "}
            <Typewriter
              options={{
                strings: ["ABA", "care", "speech", "physical"],
                autoStart: true,
                loop: true,
              }}
            />
            therapy solutions
          </h1>
          <p className="max-w-2xl mx-auto xl:mx-0">
            We’ll help you find the best care providers for autism, ADHD,
            learning differences, anxiety, and other developmental concerns.
          </p>
          <div className="items-center justify-center gap-x-3 space-y-3 sm:flex sm:space-y-0 xl:justify-start">
            <Link
              to={"/question"}
              className="flex items-center justify-center gap-x-2 py-2 px-4 text-indigo-950 btn-color active:bg-amber-400 active:shadow-none rounded-lg shadow md:inline-flex transistion-all duration-300 ease-in-out"
            >
              Get Free Screeners
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
          <br></br>
          <SearchBar defaultSearchTerm={defaultsearchTerm}/>
        </div>
        <div className="flex-1 max-w-xl mx-auto mt-14 xl:mt-0">
          <div className="relative">
            <img src={imagehome} alt="hero" className="rounded-lg size-120" />
            {/* <div className="max-w-screen-xl mx-auto px-4 md:text-center md:px-8">
              <div className="max-w-xl space-y-3 md:mx-auto">
                <h1 className="text-gray-800 text-xl font-extrabold sm:text-2xl">Screening Tool</h1>
                <p className="text-gray-600 mt-2">Wondering if your child may be on the spectrum? We can help.</p>
              </div>
              <ul className="mt-4 grid flex-1 max-w-xl mx-auto xl:mt-0">
                {integrations.map((item, idx) => (
                  <li key={idx} className="border rounded-lg">
                    <div className="flex items-start justify-between p-4">
                      <div className="space-y-2">
                        {item.icon}
                        <h4 className="text-gray-800 font-semibold">{item.title}</h4>
                        <p className="text-gray-600 text-sm">{item.desc}</p>
                      </div>
                    </div>
                    <div className="py-5 px-4 border-t text-right flex justify-center items-center">
                      <a
                        href=""
                        onClick={() => {
                          navigate("/question");
                        }}
                        className="text-zinc-700 hover:text-zinc-900 text-sm font-bold"
                      >
                        Let&apos;s Get Started
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </div> */}
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col px-4 py-9 mx-auto justify-center bg-home">
        <h2 className="text-3xl font-extrabold text-center text-main">
        Latest Articles
        </h2>
        <h3 className="font-bold text-center text-main mt-2">
          Unlock In-Depth Knowledge with Expert Guides
        </h3>
        <div className="text-center flex flex-wrap justify-between gap-2 p-3 mx-auto mt-4">
          <Card className="w-40 h-24 bg-rec hover:shadow-xl transition ease-in-out duration-300">
            <p className="flex flex-col items-center gap-2">
              <SlSpeech />
              <span className="text-sm">Speech Therapy</span>
            </p>
          </Card>
          <Card className="w-40 h-24 bg-rec hover:shadow-xl transition ease-in-out duration-300">
            <p className="flex flex-col items-center gap-2">
              <RiMusic2Fill />
              <span className="text-sm">Music Therapy</span>
            </p>
          </Card>

          <Card className="w-40 h-24 bg-rec hover:shadow-xl transition ease-in-out duration-300">
            <p className="flex flex-col items-center gap-2">
              <LuStethoscope />
              <span className="text-sm">Diagnostic Evaluation</span>
            </p>
          </Card>
          <Card className="w-40 h-24 bg-rec hover:shadow-xl transition ease-in-out duration-300">
            <p className="flex flex-col items-center gap-2">
              <LuStethoscope />
              <span className="text-sm">Occupational Therapy</span>
            </p>
          </Card>
          <Card className="w-40 h-24 bg-rec hover:shadow-xl transition ease-in-out duration-300">
            <p className="flex flex-col items-center gap-2">
              <LuStethoscope />
              <span className="text-sm">School-Based Service</span>
            </p>
          </Card>
          <Card className="w-40 h-24 bg-rec hover:shadow-xl transition ease-in-out duration-300">
            <p className="flex flex-col items-center gap-2">
              <FaHandHoldingMedical />
              <span className="text-sm">ABA Therapy</span>
            </p>
          </Card>
        </div>
      </div>
      <div className="flex flex-col px-4 py-9 mx-auto justify-center max-w-screen-2xl items-center">
        <h2 className="text-3xl font-extrabold text-center text-main">
        Join 1Step for free{" "}
        </h2>
        {/* <h3 className="md:w-1/2 text-center text-main mt-2">
          Empower Your Parenting with Free Child Development Tools Access
          Essential Resources to Foster Your Child&nbsp;s Growth for Free
        </h3> */}
        <div className="text-center flex flex-col md:flex-row gap-2 md:gap-8 p-3 mx-auto mt-8">
          <Card className="w-80 h-72 hover:shadow-xl transition ease-in-out duration-300">
            <div>
              <p className="flex flex-col items-center">
                <img src={search} alt="heartIcon" className="w-16 h-16 mb-4" />
                <span className="text-2xl font-bold text-main mb-6">
                  Search Therapist
                </span>
              </p>
              <p className="text-sm">
                Your first step for all therapy solutions. Find the Perfect
                Therapist for Your Needs.
              </p>
              <button
                onClick={() => startSearching()}
                className="w-48 justify-center items-center mt-10 p-2 text-sm bg-sky-100 rounded-md font-semibold text-sky-600 hover:bg-sky-200 transition duration-300"
              >
                Start Searching
              </button>
            </div>
          </Card>
          <Card className="w-80 h-72 hover:shadow-xl transition ease-in-out duration-300">
            <div>
              <p className="flex flex-col items-center">
                <img
                  src={freescanner}
                  alt="heartIcon"
                  className="w-16 h-16 mb-4"
                />
                <span className="text-2xl font-bold text-main mb-6">
                  Free Screeners
                </span>
              </p>
              <p className="text-sm">
                Get answers in 5 min by taking a screener widely used by health
                experts.
              </p>
              <button
                onClick={() => navigate("/freescreeners")}
                className="w-48 justify-center items-center mt-10 p-2 text-sm bg-sky-100 rounded-md font-semibold text-sky-600 hover:bg-sky-200 transition duration-300"
              >
                Take Free Screener
              </button>
            </div>
          </Card>

          <Card className="w-80 h-72 hover:shadow-xl transition ease-in-out duration-300">
            <div>
              <p className="flex flex-col items-center">
                <img
                  src={heartIcon}
                  alt="heartIcon"
                  className="w-16 h-16 mb-4"
                />
                <span className="text-2xl font-bold text-main mb-6">
                  Create a favorite list
                </span>
              </p>
              <p className="text-sm">
                Keep all your favorite providers in one place.
              </p>
              <button
                onClick={() => setOpenModal(true)}
                className="w-48 justify-center items-center mt-10 p-2 text-sm bg-sky-100 rounded-md font-semibold text-sky-600 hover:bg-sky-200 transition duration-300"
              >
                Create First List
              </button>
            </div>
          </Card>
        </div>
        <Modal show={openModal} size="md" onClose={onCloseModal} popup>
          <Modal.Header></Modal.Header>
          <Modal.Body>
            <ListModel />
          </Modal.Body>
        </Modal>
      </div>
    </section>
  );
};

export default Hero;
