import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, ArrowRight, Shield, Zap, Star } from 'lucide-react';
import { rideAPI, statsAPI } from '../api';
import { mockRides } from '../mockData';
import RideCard from '../components/RideCard';

const heroBgs = [
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&h=1080&fit=crop',
];

const Home = ({ user, onSignupClick, onLoginClick }) => {
  const navigate = useNavigate();
  const [bgIndex, setBgIndex] = useState(0);
  const [openRides, setOpenRides] = useState([]);
  const [stats, setStats] = useState({ totalUsers: '6.2K+', totalRides: '24K+', fuelSaved: '18L+' });

  useEffect(() => {
    const timer = setInterval(() => setBgIndex(i => (i + 1) % heroBgs.length), 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ridesRes, statsRes] = await Promise.all([rideAPI.getAllRides(), statsAPI.getStats()]);
        setOpenRides(ridesRes.data.slice(0, 6));
        setStats(statsRes.data);
      } catch { setOpenRides(mockRides.slice(0, 6)); }
    };
    fetchData();
  }, []);

  return (
    <div className="mesh-bg min-h-screen">
      <HeroSection bgIndex={bgIndex} setBgIndex={setBgIndex} stats={stats} user={user} navigate={navigate} onSignupClick={onSignupClick} />
      <HowItWorks />
      <CitiesSection navigate={navigate} />
      <OpenRidesSection openRides={openRides} user={user} onLoginClick={onLoginClick} navigate={navigate} />
      <FeaturesSection />
      <CTASection user={user} navigate={navigate} onSignupClick={onSignupClick} />
    </div>
  );
};

const HeroSection = ({ bgIndex, setBgIndex, stats, user, navigate, onSignupClick }) => (
  <section className="relative min-h-screen flex items-center overflow-hidden">
    {heroBgs.map((src, i) => (
      <div key={i} className="carousel-slide absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${src})`, opacity: i === bgIndex ? 1 : 0 }} />
    ))}
    <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.75) 100%)' }} />
    <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(255,112,0,0.12) 0%, transparent 60%)' }} />

    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
      {heroBgs.map((_, i) => (
        <button key={i} onClick={() => setBgIndex(i)}
          className={`h-1.5 rounded-full transition-all duration-300 ${i === bgIndex ? 'w-8 bg-primary-orange' : 'w-1.5 bg-white bg-opacity-30'}`} />
      ))}
    </div>

    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 w-full">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 fade-up-1"
            style={{ background: 'rgba(255,112,0,0.1)', border: '1px solid rgba(255,112,0,0.25)' }}>
            <div className="relative w-2 h-2">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping" />
            </div>
            <span className="text-xs font-medium" style={{ color: '#ff9a3c' }}>Live in Delhi, Mumbai & Bengaluru</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6 fade-up-2">
            <span className="text-white">Got a spare seat?</span><br />
            <span className="gradient-text">Share your ride.</span><br />
            <span className="text-white">Split the cost.</span>
          </h1>

          <p className="text-lg text-gray-300 mb-8 leading-relaxed max-w-lg fade-up-3">
            Post your daily 2-wheeler commute and let someone going the same way join you.
            Save fuel. Make friends. Split the cost.
          </p>

          <div className="grid grid-cols-3 gap-3 mb-8 fade-up-3">
            {[
              { value: stats.totalUsers || '6.2K+', label: 'Active users' },
              { value: stats.totalRides || '24K+', label: 'Rides shared' },
              { value: stats.fuelSaved || '18L+', label: 'Fuel saved' },
            ].map((s, i) => (
              <div key={i} className="rounded-xl p-3 text-center"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="text-xl font-bold gradient-text">{s.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 fade-up-4">
            <button onClick={() => navigate('/browse')} className="btn-primary px-7 py-3.5 flex items-center justify-center gap-2">
              <Search size={18} /><span>Find a Ride</span>
            </button>
            <button onClick={() => user ? navigate('/post-ride') : onSignupClick()} className="btn-outline px-7 py-3.5 flex items-center justify-center gap-2">
              <Plus size={18} /><span>Post My Ride</span>
            </button>
          </div>
        </div>

        <div className="hidden lg:block fade-up-2">
          <div className="rounded-2xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)' }}>
            <div className="px-5 py-4 flex items-center justify-between"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-white">Live Rides</span>
              </div>
              <span className="text-xs text-gray-500">Updated just now</span>
            </div>
            <div className="p-3 space-y-2">
              {[
                { from: 'Connaught Place', to: 'Gurgaon', time: '8:30 AM', price: '₹80', seats: 2, avatar: 'https://i.pravatar.cc/32?img=1', rating: 4.8 },
                { from: 'Bandra', to: 'Andheri', time: '9:00 AM', price: '₹60', seats: 1, avatar: 'https://i.pravatar.cc/32?img=5', rating: 4.9 },
                { from: 'Indiranagar', to: 'Electronic City', time: '6:00 PM', price: '₹70', seats: 3, avatar: 'https://i.pravatar.cc/32?img=3', rating: 4.7 },
              ].map((r, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.03)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,112,0,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}>
                  <div className="flex items-center gap-3">
                    <img src={r.avatar} alt="" className="w-9 h-9 rounded-full ring-2 ring-primary-orange ring-opacity-30" />
                    <div>
                      <p className="text-sm font-semibold text-white">{r.from} <span className="text-gray-500">→</span> {r.to}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-500">{r.time}</span>
                        <span className="text-xs text-gray-600">·</span>
                        <span className="text-xs text-gray-500">{r.seats} seat{r.seats > 1 ? 's' : ''}</span>
                        <span className="text-xs text-gray-600">·</span>
                        <Star size={9} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-xs text-gray-500">{r.rating}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-bold gradient-text">{r.price}</span>
                </div>
              ))}
            </div>
            <div className="p-3 pt-1">
              <button onClick={() => navigate('/browse')} className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2">
                <span>Browse All Rides</span><ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const HowItWorks = () => (
  <section className="py-24 section-light">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-14">
        <p className="text-xs font-bold uppercase tracking-widest text-primary-orange mb-3">How it works</p>
        <h2 className="text-4xl font-black text-gray-900">Simple. Fast. Done in 4 steps.</h2>
      </div>
      <div className="grid md:grid-cols-4 gap-6">
        {[
          { n: '01', title: 'Sign up & verify', desc: 'Create your account and verify your phone with OTP.' },
          { n: '02', title: 'Post or browse', desc: 'Share your commute or find someone on your route.' },
          { n: '03', title: 'Confirm & connect', desc: 'Review profiles and confirm your ride partners.' },
          { n: '04', title: 'Ride & save', desc: 'Share the ride, split costs, enjoy the journey.' },
        ].map((step, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all card-hover border border-gray-100">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-white font-black text-sm"
              style={{ background: 'linear-gradient(135deg, #FF7000, #ff9a3c)' }}>
              {step.n}
            </div>
            <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const CitiesSection = ({ navigate }) => (
  <section className="py-24" style={{ background: '#0d0d15' }}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-14">
        <p className="text-xs font-bold uppercase tracking-widest text-primary-orange mb-3">Where we operate</p>
        <h2 className="text-4xl font-black text-white">Available Cities</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {[
          { city: 'Delhi', rides: '2.1K', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&h=400&fit=crop', desc: 'India Gate to Gurgaon, Noida & beyond' },
          { city: 'Mumbai', rides: '2.8K', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&h=400&fit=crop', desc: 'Bandra, Andheri, Dadar & Western suburbs' },
          { city: 'Bengaluru', rides: '1.3K', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&h=400&fit=crop', desc: 'Electronic City, Whitefield, Koramangala' },
        ].map(({ city, rides, image, desc }) => (
          <div key={city} className="group cursor-pointer card-hover rounded-2xl overflow-hidden image-overlay"
            onClick={() => navigate(`/browse?city=${city}`)}>
            <img src={image} alt={city} className="w-full h-52 object-cover" />
            <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-white text-xl">{city}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold text-white"
                  style={{ background: 'rgba(34,197,94,0.8)' }}>Live</span>
              </div>
              <p className="text-gray-300 text-sm">{rides} rides · {desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const OpenRidesSection = ({ openRides, user, onLoginClick, navigate }) => (
  <section className="py-24 section-light">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary-orange mb-2">Live now</p>
          <h2 className="text-4xl font-black text-gray-900">Open rides right now</h2>
        </div>
        <button onClick={() => navigate('/browse')} className="flex items-center gap-2 text-sm font-semibold text-primary-orange hover:underline transition-colors">
          View all <ArrowRight size={15} />
        </button>
      </div>
      <div className="grid md:grid-cols-3 gap-5">
        {openRides.map(ride => <RideCard key={ride.id} ride={ride} />)}
      </div>
    </div>
  </section>
);

const FeaturesSection = () => (
  <section className="py-24" style={{ background: '#0d0d15' }}>
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-12">
        <p className="text-xs font-bold uppercase tracking-widest text-primary-orange mb-3">Why BlaBla Bike</p>
        <h2 className="text-4xl font-black text-white">Built for everyday commuters</h2>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {[
          { emoji: '🏷️', title: 'Split the fuel cost', desc: 'Riding alone is expensive. A co-rider sharing fuel makes every commute noticeably cheaper for both of you.' },
          { emoji: '🗺️', title: 'Live map tracking', desc: 'Track your ride in real time. Share a live link with family so they always know where you are.' },
          { emoji: '🆘', title: 'SOS emergency button', desc: 'One tap sends your live GPS to your emergency contact and our admin team. Auto-records audio as evidence.' },
          { emoji: '⭐', title: 'Verified community', desc: 'Every user is phone-verified. Mutual ratings and reviews build a trustworthy, accountable community.' },
          { emoji: '💰', title: 'Fair, transparent pricing', desc: 'Admin sets a fair per-km rate. Posters can adjust slightly. You always see the full fare before confirming.' },
          { emoji: '🔁', title: 'Post once, ride daily', desc: 'Set up recurring rides for your fixed commute. Regulars get priority matching — no re-posting needed.' },
        ].map(({ emoji, title, desc }, i) => (
          <div key={i} className="rounded-2xl p-6 card-hover"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="text-3xl mb-3">{emoji}</div>
            <h3 className="font-bold text-white mb-2">{title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const CTASection = ({ user, navigate, onSignupClick }) => (
  <section className="py-24 relative overflow-hidden section-light">
    <div className="relative max-w-3xl mx-auto px-4 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
        style={{ background: 'rgba(255,112,0,0.1)', border: '1px solid rgba(255,112,0,0.2)' }}>
        <Zap size={12} className="text-primary-orange" />
        <span className="text-xs font-semibold text-primary-orange">Join 6,200+ commuters</span>
      </div>
      <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
        Your commute is going anyway —{' '}
        <span className="gradient-text">fill that seat.</span>
      </h2>
      <p className="text-gray-500 mb-8 text-lg">Don't let that empty seat go to waste.</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button onClick={() => user ? navigate('/post-ride') : onSignupClick()}
          className="btn-primary px-8 py-4 text-base flex items-center justify-center gap-2">
          <span>Post a Ride Now</span><ArrowRight size={18} />
        </button>
        <button onClick={() => navigate('/browse')}
          className="px-8 py-4 text-base font-semibold rounded-xl border-2 border-gray-200 text-gray-700 hover:border-primary-orange hover:text-primary-orange transition-all flex items-center justify-center gap-2">
          <Search size={18} /><span>Browse Open Rides</span>
        </button>
      </div>
      <div className="flex items-center justify-center gap-6 mt-10 flex-wrap">
        {[
          { icon: Shield, text: 'OTP Verified Users' },
          { icon: Star, text: '4.9 Avg Rating' },
          { icon: Zap, text: 'Instant Booking' },
        ].map(({ icon: Icon, text }, i) => (
          <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
            <Icon size={14} className="text-primary-orange" />{text}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Home;
