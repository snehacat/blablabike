import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import RideCard from '../components/RideCard';
import { mockRides } from '../mockData';

const BrowseRides = ({ user }) => {
  const [searchParams] = useSearchParams();
  const cityParam = searchParams.get('city') || '';

  const [search, setSearch] = useState({ from: '', to: '', date: '' });
  const [filters, setFilters] = useState({ vehicleType: '', maxPrice: '', minSeats: '', city: cityParam });
  const [showFilters, setShowFilters] = useState(false);
  const [results, setResults] = useState(() =>
    cityParam ? mockRides.filter(r => r.city === cityParam) : mockRides
  );

  useEffect(() => {
    if (cityParam) {
      setFilters(f => ({ ...f, city: cityParam }));
      setResults(mockRides.filter(r => r.city === cityParam));
    }
  }, [cityParam]);

  const handleSearch = (e) => {
    e.preventDefault();
    let f = [...mockRides];
    if (filters.city) f = f.filter(r => r.city === filters.city);
    if (search.from) f = f.filter(r => r.from.toLowerCase().includes(search.from.toLowerCase()));
    if (search.to) f = f.filter(r => r.to.toLowerCase().includes(search.to.toLowerCase()));
    if (search.date) f = f.filter(r => r.date === search.date);
    if (filters.vehicleType) f = f.filter(r => r.vehicleType === filters.vehicleType);
    if (filters.maxPrice) f = f.filter(r => r.price <= parseInt(filters.maxPrice));
    if (filters.minSeats) f = f.filter(r => r.availableSeats >= parseInt(filters.minSeats));
    setResults(f);
  };

  const clearAll = () => {
    setSearch({ from: '', to: '', date: '' });
    setFilters({ vehicleType: '', maxPrice: '', minSeats: '', city: '' });
    setResults(mockRides);
  };

  const inputCls = "w-full px-4 py-3 rounded-xl text-sm text-gray-900 bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-gray-400";

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
      <div className="pt-20 pb-10 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0d0d15, #12121a)' }}>
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(ellipse at 30% 50%, rgba(255,112,0,0.3) 0%, transparent 60%)' }} />
        <div className="relative max-w-4xl mx-auto px-4">
          <p className="text-xs font-bold uppercase tracking-widest text-primary-orange mb-2 text-center">Find your ride</p>
          <h1 className="text-3xl font-black text-white mb-8 text-center">Search available rides</h1>
          <form onSubmit={handleSearch} className="bg-white rounded-2xl p-4 shadow-2xl">
            <div className="grid md:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">From</label>
                <input type="text" placeholder="e.g. Bandra" value={search.from}
                  onChange={e => setSearch({ ...search, from: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">To</label>
                <input type="text" placeholder="e.g. Andheri" value={search.to}
                  onChange={e => setSearch({ ...search, to: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Date</label>
                <input type="date" value={search.date}
                  onChange={e => setSearch({ ...search, date: e.target.value })} className={inputCls} />
              </div>
              <div className="flex items-end">
                <button type="submit" className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2">
                  <Search size={16} />
                  <span>Search</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <p className="text-gray-400 text-sm">{results.length} rides found</p>
            {filters.city && (
              <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full"
                style={{ background: 'rgba(255,112,0,0.15)', border: '1px solid rgba(255,112,0,0.3)', color: '#FF7000' }}>
                📍 {filters.city}
                <button onClick={clearAll} className="ml-1 hover:text-white"><X size={11} /></button>
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {(filters.city || search.from || search.to) && (
              <button onClick={clearAll}
                className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white px-3 py-1.5 rounded-lg transition-all"
                style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                <X size={13} /> Clear
              </button>
            )}
            <button onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-all"
              style={{ border: `1px solid ${showFilters ? 'rgba(255,112,0,0.4)' : 'rgba(255,255,255,0.1)'}`, color: showFilters ? '#FF7000' : '#9ca3af' }}>
              <SlidersHorizontal size={13} /> Filters
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="rounded-2xl p-5 mb-6 grid md:grid-cols-4 gap-4"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">City</label>
              <select value={filters.city} onChange={e => setFilters({ ...filters, city: e.target.value })}
                className="input-dark w-full px-4 py-2.5 rounded-xl text-sm">
                {['', 'Delhi', 'Mumbai', 'Bengaluru'].map(o => (
                  <option key={o} value={o} style={{ background: '#12121a' }}>{o || 'All Cities'}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Vehicle Type</label>
              <select value={filters.vehicleType} onChange={e => setFilters({ ...filters, vehicleType: e.target.value })}
                className="input-dark w-full px-4 py-2.5 rounded-xl text-sm">
                {['', 'Bike', 'Scooter', 'Scooty'].map(o => (
                  <option key={o} value={o} style={{ background: '#12121a' }}>{o || 'All'}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Max Price (₹)</label>
              <input type="number" placeholder="e.g. 100" value={filters.maxPrice}
                onChange={e => setFilters({ ...filters, maxPrice: e.target.value })}
                className="input-dark w-full px-4 py-2.5 rounded-xl text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Min Seats</label>
              <input type="number" placeholder="e.g. 2" value={filters.minSeats}
                onChange={e => setFilters({ ...filters, minSeats: e.target.value })}
                className="input-dark w-full px-4 py-2.5 rounded-xl text-sm" />
            </div>
          </div>
        )}

        {results.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">🛵</p>
            <p className="text-xl font-bold text-white mb-2">No rides found</p>
            <p className="text-gray-500 text-sm">Try adjusting your search or check back later.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {results.map(ride => <RideCard key={ride.id} ride={ride} user={user} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseRides;
