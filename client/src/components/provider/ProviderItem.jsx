import { Link } from "react-router-dom";
import  { MdLocationOn }  from "react-icons/md";
import PropTypes from 'prop-types';

export default function ProviderItem({provider}) {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]">
      <Link to={`/provider/${provider._id}`}>
        <img src={provider.imageUrls[0]} alt="provider cover" className="h-[200px] md:h-[120px] w-full object-cover hover:scale-105 transition-scale duration-300"/>
        <div className="p-3 flex flex-col gap-2 w-full">
            <p className="truncate text-lg font-semibold text-slate-700">{provider.name}</p>
            <img src={provider.profilePicture} alt="provider profile" className="h-20 w-20 rounded-full object-cover"/>
            <div className="flex items-center gap-1">
                <MdLocationOn className='h-4 w-4 text-sky-300' />
                <p className="text-sm text-gray-600 truncate w-full">{provider.address}</p>
            </div>
            <p className="text-sm text-gray-600 line-clamp-3">{provider.description}</p>
        </div>
      </Link>
    </div>
  )
}

ProviderItem.propTypes = {
  provider: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    imageUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
    name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    profilePicture: PropTypes.string.isRequired,
  }).isRequired,
};
