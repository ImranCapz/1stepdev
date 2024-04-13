import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function ProviderReview() {
  const { providerId } = useParams();
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const response = await fetch(`/server/provider/get/${providerId}`);
        const data = await response.json();
        setProvider(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    fetchProvider();
  }, [providerId]);
  if (!provider) {
    return <div>Error on Fetching provider Data</div>;
  }

  return (
    <div className="">
      <div className="h-52vh md:h-72vh bg-listbg bg-cover bg-center flex flex-col justify-center items-center text-white">
        <div className="">
          <h1 className="flex flex-col items-center text-xl font-semibold text-zinc-600">
            YOUR REVIEW FOR
          </h1>
          <h1 className="flex flex-col items-center text-5xl font-bold mt-6  text-gray-700">
          {provider.name}
          </h1>
        </div>
      </div>
      <div className="">
        <div className="">
          
        </div>
      </div>
    </div>
  )
}