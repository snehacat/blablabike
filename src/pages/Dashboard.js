import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Shield, MapPin, Clock, XCircle, Plus, Lock } from 'lucide-react';
import { mockBookings, mockPostedRides } from '../mockData';

const statusBadge = (status) => {
  const map = {
    confirmed: { bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.2)', text: '#4ade80' },
    completed: { bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)', text: '#9ca3af' },
    cancelled: { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)', text: '#f87171' },
    active: { bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)', text: '#60a5fa' },
  };
  const s = map[status] || map.completed;
  return (
    <span className="text-xs px-2.5 py-0.5 rounded-full font-medium capitalize"
      style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.text }}>
      {status}
    </span>
  );
};

const Dashboard = ({ user, onLoginClick }) => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('bookings');

  if (!user) return (
    <div className="min-h-screen pt-24 flex items-center justify-center" style={{ background: '#0a0a0f' }}>
      <div className="text-center rounded-2xl p-10 max-w-sm mx-4"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: 'rgba(255,112,0,0.1)', border: '1px solid rgba(255,112,0,0.2)' }}>
          <Lock size={28} className="text-primary-orange" />
        </div>
        <p className="text-xl font-bold text-white mb-2">Login required</p>
        <p className="text-gray-500 text-sm mb-6">Please log in to view your dashboard.</p>
        <button onClick={onLoginClick} className="btn-primary px-6 py-3 text-sm w-full"><span>Login / Sign Up</span></button>
      </div>
    </div>
  );

  const cardStyle = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' };

  return (
    <div className="min-h-screen pt-16" style={{ background: '#0a0a0f' }}>
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Profile card */}
        <div className="rounded-2xl p-6 mb-6 flex items-center gap-5" style={cardStyle}>
          <div className="relative">
            <img src={user.avatar || `https://i.pravatar.cc/80?u=${user.email}`} alt=""
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-primary-orange ring-opacity-40" />
            {user.verified && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: '#22c55e' }}>
                <Shield size={10} className="text-white" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">{user.fullName || user.email}</h2>
            <p className="text-gray-500 text-sm">{user.email}</p>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1">
                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                <span className="text-sm text-gray-400">{user.rating || '—'}</span>
              </div>
              <span className="text-sm text-gray-500">{user.totalRides || 0} rides</span>
            </div>
          </div>
          <button onClick={() => navigate('/profile')}
            className="btn-outline px-4 py-2 text-sm">Edit Profile</button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl mb-6 w-fit" style={{ background: 'rgba(255,255,255,0.05)' }}>
          {[{ key: 'bookings', label: 'My Bookings' }, { key: 'rides', label: 'My Posted Rides' }].map(({ key, label }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === key ? 'text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
              }`}
              style={tab === key ? { background: 'linear-gradient(135deg, #FF7000, #ff9a3c)' } : {}}>
              {label}
            </button>
          ))}
        </div>

        {/* Bookings */}
        {tab === 'bookings' && (
          <div className="space-y-3">
            {mockBookings.length === 0 ? (
              <EmptyState icon="🎫" title="No bookings yet" desc="Find a ride and book your first seat."
                action={() => navigate('/browse')} actionLabel="Browse Rides" />
            ) : mockBookings.map(booking => (
              <div key={booking.id} className="rounded-2xl p-5" style={cardStyle}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-white text-lg">{booking.ride.from} → {booking.ride.to}</p>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><Clock size={12} /> {new Date(booking.ride.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="flex items-center gap-1"><MapPin size={12} /> {booking.ride.vehicleType}</span>
                    </div>
                  </div>
                  {statusBadge(booking.status)}
                </div>
                <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center gap-2">
                    <img src={booking.ride.driver.avatar} alt="" className="w-7 h-7 rounded-full" />
                    <span className="text-sm text-gray-400">{booking.ride.driver.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold gradient-text">₹{booking.totalAmount}</span>
                    <button onClick={() => navigate(`/rides/${booking.ride.id}`)}
                      className="text-primary-orange text-sm hover:underline">View →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Posted rides */}
        {tab === 'rides' && (
          <div className="space-y-3">
            <button onClick={() => navigate('/post-ride')}
              className="w-full rounded-2xl p-5 flex items-center justify-center gap-2 text-gray-500 hover:text-primary-orange transition-all"
              style={{ border: '2px dashed rgba(255,255,255,0.1)' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,112,0,0.4)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}>
              <Plus size={18} /> Post a new ride
            </button>
            {mockPostedRides.length === 0 ? (
              <EmptyState icon="🛵" title="No rides posted" desc="Share your commute and earn while you ride." />
            ) : mockPostedRides.map(ride => (
              <div key={ride.id} className="rounded-2xl p-5" style={cardStyle}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-white text-lg">{ride.from} → {ride.to}</p>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><Clock size={12} /> {new Date(ride.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span>₹{ride.price}/seat</span>
                    </div>
                  </div>
                  {statusBadge(ride.status)}
                </div>
                <div className="flex items-center justify-between pt-3 text-sm text-gray-500"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <span>{ride.bookings || 0} booking(s)</span>
                  <span>{ride.availableSeats}/{ride.totalSeats} seats left</span>
                  <button className="flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors text-xs">
                    <XCircle size={12} /> Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const EmptyState = ({ icon, title, desc, action, actionLabel }) => (
  <div className="text-center py-16 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
    <p className="text-5xl mb-3">{icon}</p>
    <p className="font-bold text-white mb-1">{title}</p>
    <p className="text-gray-500 text-sm mb-4">{desc}</p>
    {action && <button onClick={action} className="btn-primary px-5 py-2 text-sm"><span>{actionLabel}</span></button>}
  </div>
);

export default Dashboard;
