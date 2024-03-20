import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

export default function Provider() {
  SwiperCore.use([Navigation]);
  const [provider, setprovider] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const params = useParams();

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
        </div>
      )}
    </main>
  );
}
