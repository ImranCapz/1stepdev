import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaMapMarkerAlt,
  FaShare,
} from 'react-icons/fa';
import { useSelector } from "react-redux";
import BookingContact from "../components/BookingContact";
import { useNavigate } from 'react-router-dom'; 

export default function Provider() {
  SwiperCore.use([Navigation]);
  const [provider, setprovider] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchprovider = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/server/provider/get/${params.providerId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setprovider(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
      }
    };
    fetchprovider();
  }, [params.providerId]);
  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && (
        <p className="text-center my-7 text-2xl">Error fetching provider</p>
      )}
      {provider && !loading && !error && (
        <div>
          <Swiper navigation>
            {provider.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px]"
                  style={{ background: `url(${url}) center no-repeat`,backgroundSize:'cover' }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className='fixed top-[18%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
            <FaShare
              className='text-slate-500'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
              Link copied!
            </p>
          )}
          <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
            <p className='text-2xl font-semibold'>
              {provider.name} - ₹{' '}
              {provider.regularPrice.toLocaleString('en-US')} / Appointment
            </p>
            <p className='flex items-center mt-6 gap-2 text-slate-600  text-sm'>
              <FaMapMarkerAlt className='text-sky-500' />
              {provider.address}
            </p>
           
            <p className='text-slate-800'>
              <span className='font-semibold text-black'>Description - </span>
              {provider.description}
            </p>
            {
              !currentUser && (
                <button
                  onClick={() => navigate('/signup')}
                  className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'
                >
                  Book A Appointment
                </button>
              )
            }
            {currentUser && provider.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'
              >
                Contact FOR BOOKING
              </button>
            )}
            {contact && <BookingContact provider={provider}/>}
          </div>
        </div>
      )}
    </main>
  );
}
