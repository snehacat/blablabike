import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Shield, Clock, Bike } from 'lucide-react';

const RideCard = ({ ride }) => {
  const navigate = useNavigate();
  const time = new Date(ride.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const seatsLeft = ride.availableSeats;

  return (
    <div className="card-hover rounded-2xl overflow-hidden cursor-pointer"
      style={{ background: 'linear-gradient(135deg, #12121a, #1a1a2e)', border: '1px solid rgba(255,255,255,0.08)' }}
      onClick={() => navigate(`/rides/${ride.id}`)}>

      {/* Route header */}
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-primary-orange" />
              <p className="font-semibold text-white text-base">{ride.from}</p>
            </div>
            <div className="ml-1 w-px h-4 bg-gray-700 ml-[3px]" />
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full border-2 border-gray-500" />
              <p className="font-semibold text-white text-base">{ride.to}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold gradient-text">₹{ride.price}</p>
            <p className="text-xs text-gray-500">per seat</p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-gray-300"
            style={{ background: 'rgba(255,255,255,0.05)' }}>
            <Clock size={11} /> {time}
          </span>
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-gray-300"
            style={{ background: 'rgba(255,255,255,0.05)' }}>
            <Bike size={11} /> {ride.vehicleType}
          </span>
          <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${seatsLeft <= 1 ? 'text-red-400' : 'text-green-400'}`}
            style={{ background: seatsLeft <= 1 ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)' }}>
            {seatsLeft}/{ride.totalSeats} seats
          </span>
        </div>
      </div>

      {/* Driver footer */}
      <div className="px-5 py-3 flex items-center justify-between"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.2)' }}>
        <div className="flex items-center gap-2">
          <img src={ride.driver.avatar} alt={ride.driver.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-orange ring-opacity-30" />
          <div>
            <div className="flex items-center gap-1">
              <p className="text-xs font-semibold text-white">{ride.driver.name}</p>
              {ride.driver.verified && <Shield size={10} className="text-green-400" />}
            </div>
            <div className="flex items-center gap-1">
              <Star size={10} className="text-yellow-400 fill-yellow-400" />
              <span className="text-xs text-gray-500">{ride.driver.rating}</span>
            </div>
          </div>
        </div>
        <span className="text-xs font-semibold text-primary-orange hover:text-orange-light transition-colors">
          View Details →
        </span>
      </div>
    </div>
  );
};

export default RideCard;
