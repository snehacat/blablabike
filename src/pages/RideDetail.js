import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Shield, ArrowLeft, MapPin, Clock, Users, Bike, CheckCircle } from 'lucide-react';
import { mockRides } from '../mockData';

const RideDetail = ({ user, onLoginClick }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const ride = mockRides.find(r => r.id === parseInt(id));
  const [seats, setSeats] = useState(1);
  const [booked, setBooked] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!ride) return (
    <div className="min-h-screen pt-24 flex items-center justify-center" style={{ background: '#0a0a0f' }}>
      <div className="text-center">
        <p className="text-5xl mb-4">🔍</p>
        <p className="text-xl font-bold text-white mb-2">Ride not found</p>
        <button onClick={() => navigate('/browse')} className="text-primary-orange hover:underline text-sm">← Back to Browse</button>
      </div>
    </div>
  );

  const time = new Date(ride.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const date = new Date(ride.departureTime).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  const handleBook = () => {
    if (!user) { onLoginClick(); return; }
    setLoading(true);
    // TODO: replace with real API → POST /bookings { rideId: ride.id, seats }
    setTimeout(() => { setLoading(false); setBooked(true); }, 1200);
  };

  const cardStyle = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' };

  return (
    <div className="min-h-screen pt-16" style={{ background: '#0a0a0f' }}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft size={16} /> Back
        </button>

        {/* Route header */}
        <div className="rounded-2xl p-6 mb-4 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #1a0a00, #2a1200)', border: '1px solid rgba(255,112,0,0.2)' }}>
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #FF7000, transparent)', transform: 'translate(30%, -30%)' }} />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Route</p>
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-2xl font-black text-white">{ride.from}</p>
                  <div className="flex items-center gap-2 my-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-orange" />
                    <div className="w-16 h-px bg-primary-orange opacity-40" />
                    <div className="w-1.5 h-1.5 rounded-full border border-gray-500" />
                  </div>
                  <p className="text-2xl font-black text-white">{ride.to}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-4xl font-black gradient-text">₹{ride.price}</p>
              <p className="text-xs text-gray-500 mt-1">per seat</p>
            </div>
          </div>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {[
            { icon: Clock, label: 'Time', value: time },
            { icon: MapPin, label: 'Date', value: date },
            { icon: Users, label: 'Seats left', value: `${ride.availableSeats}/${ride.totalSeats}` },
            { icon: Bike, label: 'Vehicle', value: ride.vehicleModel },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-xl p-4 text-center" style={cardStyle}>
              <Icon size={18} className="text-primary-orange mx-auto mb-2" />
              <p className="text-xs text-gray-500 mb-1">{label}</p>
              <p className="text-sm font-semibold text-white">{value}</p>
            </div>
          ))}
        </div>

        {/* Description */}
        {ride.description && (
          <div className="rounded-2xl p-5 mb-4" style={cardStyle}>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">About this ride</p>
            <p className="text-gray-300 text-sm leading-relaxed">{ride.description}</p>
          </div>
        )}

        {/* Driver */}
        <div className="rounded-2xl p-5 mb-4" style={cardStyle}>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Your driver</p>
          <div className="flex items-center gap-4">
            <img src={ride.driver.avatar} alt={ride.driver.name}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-primary-orange ring-opacity-40" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-bold text-white text-lg">{ride.driver.name}</p>
                {ride.driver.verified && (
                  <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full text-green-400"
                    style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                    <Shield size={10} /> Verified
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className={i < Math.floor(ride.driver.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'} />
                  ))}
                </div>
                <span className="text-sm text-gray-400">{ride.driver.rating} · {ride.driver.totalRides} rides</span>
              </div>
            </div>
          </div>
        </div>

        {/* Booking */}
        {booked ? (
          <div className="rounded-2xl p-6 text-center"
            style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
            <CheckCircle size={48} className="text-green-400 mx-auto mb-3" />
            <p className="font-bold text-white text-xl mb-1">Booking Confirmed!</p>
            <p className="text-green-400 text-sm mb-4">{seats} seat(s) booked · ₹{ride.price * seats} total</p>
            <button onClick={() => navigate('/dashboard')}
              className="btn-primary px-6 py-2.5 text-sm"><span>View in Dashboard</span></button>
          </div>
        ) : (
          <div className="rounded-2xl p-5" style={cardStyle}>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Book this ride</p>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1.5">Number of seats</label>
                <select value={seats} onChange={e => setSeats(parseInt(e.target.value))}
                  className="input-dark w-full px-4 py-2.5 rounded-xl text-sm">
                  {Array.from({ length: ride.availableSeats }, (_, i) => i + 1).map(n => (
                    <option key={n} value={n} style={{ background: '#12121a' }}>{n} seat{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-1">Total</p>
                <p className="text-2xl font-black gradient-text">₹{ride.price * seats}</p>
              </div>
            </div>
            <button onClick={handleBook} disabled={loading}
              className="btn-primary w-full py-3.5 text-sm disabled:opacity-50 flex items-center justify-center gap-2">
              <span>{loading ? 'Booking...' : user ? 'Confirm Booking' : 'Login to Book'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RideDetail;
