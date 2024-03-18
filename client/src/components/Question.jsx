import { useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { useNavigate } from "react-router-dom";

const ContactForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    enquiry: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (


    <main className="py-14">
      <div className="max-w-lg mx-auto space-y-3 sm:text-center">
        <h3 className="text-indigo-600 font-semibold">
          For more information contact us
        </h3>
        <p>Please fill out the form below.</p>
      </div>
      <div className="mt-8 max-w-lg mx-auto">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
            />
          </div>
          <div>
            <label className="font-medium">Phone number</label>
            <div className="relative mt-2">
              <div className="absolute inset-y-0 left-3 my-auto h-6 flex items-center border-r pr-2">
                <select className="text-sm bg-transparent outline-none rounded-lg h-full">
                  <option>IND</option>
                </select>
              </div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 00000 00000"
                required
                className="w-full pl-[4.5rem] pr-3 py-2 appearance-none bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="font-medium">Enquiry</label>
            <textarea
              name="enquiry"
              value={formData.enquiry}
              onChange={handleChange}
              required
              className="w-full mt-2 h-36 px-3 py-2 resize-none appearance-none bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
            ></textarea>
          </div>
          <button className="w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150">
            Submit
          </button>
        </form>
      </div>
    </main>
  );
};

const ThanksComponent = () => {
  const navigate = useNavigate()
  return (
    <section className="py-14">
      <div className="max-w-screen-xl mx-auto px-4 md:text-center md:px-8">
        <div className="max-w-xl md:mx-auto">
          <h3 className="text-3xl text-gray-800 font-semibold md:text-4xl">
            Thanks for <span className="text-amber-400">contacting us...</span>
          </h3>
        </div>
        <div className="flex gap-3 items-center mt-4 md:justify-center">

          <button onClick={() => { navigate("/") }}
            className="group px-4 py-2 text-indigo-600 font-medium bg-indigo-50 rounded-full inline-flex items-center"
            href="">
            Back to home
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-1 duration-150 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

const Question = () => {
  const [questionNumber, setQuestionNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleAnswer = (answer) => {
    setQuestionNumber(questionNumber + 1);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleFormSubmit = async (formData) => {
    
    const apiUrl = 'https://api.web3forms.com/submit';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apikey: '648ca5f5-5962-4380-a17f-3bc645fca23f',
          ...formData,
        }),
      });

      if (response.ok) {
        console.log('Form submitted successfully');
        setFormSubmitted(true);
        setQuestionNumber(1); // Reset question number after form submission
        setTimeout(() => {
          setFormSubmitted(false);
        }, 100000);
      } else {
        console.error('Form submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const shouldContact = () => {
    return questionNumber > 5 && !formSubmitted;
  };

  const questions = [
    {
      question: 'Does your child have poor eye contact?',
      paragraph: "(FOR EXAMPLE, While playing, asking for things, talking to you.)",
    },
    {
      question: ' Does your child lack social smile?',
      paragraph: '(FOR EXAMPLE, Does your child smile when meeting people or in reciprocation.)',
    },
    {
      question: 'Does your child remain aloof?',
      paragraph: '(FOR EXAMPLE, Does the child remain self-absorbed, withdrawn, and not responsive to people or environment.)',
    },
    {
      question: 'Does your child not reach out to others?',
      paragraph: '(FOR EXAMPLE, Does your child initiate, seek, or respond to social interactions.)',
    },
    {
      question: 'Does your child engage in solitary and repetitive play activities?',
      paragraph: '(FOR EXAMPLE, Does your child  most of the time prefer solitary activities, avoid playing with others and may not engage in group oriented activities or tasks at all.)',
    },
    // Add more questions and paragraphs here
  ];

  return (
    <div>
      {questionNumber <= questions.length && !formSubmitted ? (
        <section className="py-44">
          <div className="max-w-screen-xl mx-auto px-4 md:text-center md:px-8">
            <div className="max-w-xl space-y-3 md:mx-auto">
              <h3 className="text-indigo-600 font-semibold">
                IASQ: Question {questionNumber} of 10
              </h3>
              <p className="text-gray-800 text-3xl font-bold sm:text-4xl">
                {/* Display the current question */}
                {questions[questionNumber - 1].question}
              </p>
              <p className="text-gray-600">
                {/* Display the corresponding paragraph */}
                {questions[questionNumber - 1].paragraph}
              </p>
            </div>

            <div className="flex gap-3 items-center mt-4 md:justify-center">
              <button
                onClick={() => handleAnswer('No')}
                className="inline-block py-2 px-4 text-white font-medium bg-gray-800 duration-150 hover:bg-gray-700 active:bg-gray-900 rounded-lg shadow-md hover:shadow-none"
              >
                No
              </button>
              <button
                onClick={() => handleAnswer('Yes')}
                className="inline-block py-2 px-4 text-gray-800 font-medium duration-150 border hover:bg-gray-50 border-stone-800 active:bg-gray-100 rounded-lg">
                Yes
              </button>
            </div>
          </div>
        </section>
      ) : formSubmitted ? (
        <ThanksComponent />
      ) : (
        <ContactForm onSubmit={handleFormSubmit} />
      )}

      {/* Display loading spinner when loading state is true */}
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
          <ClipLoader color="#19ff00" loading={loading} size={40} />
        </div>
      )}
    </div>
  );
};

export default Question;
