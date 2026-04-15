import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Lock } from 'lucide-react';

const PostRide = ({ user, onLoginClick }) => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ from: '', to: '', date: '', time: '', seats: '1', price: '', vehicleType: 'Bike', vehicleModel: '', description: '', recurring: false });
  const [errors, setErrors] = useState({});

  if (!user) return (
    <div className="min-h-screen pt-24 flex items-center justify-center" style={{ background: '#0a0a0f' }}>
      <div className="text-center rounded-2xl p-10 max-w-sm mx-4"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: 'rgba(255,112,0,0.1)', border: '1px solid rgba(255,112,0,0.2)' }}>
          <Lock size={28} className="text-primary-orange" />
        </div>
        <p className="text-xl font-bold text-white mb-2">Login required</p>
        <p className="text-gray-500 text-sm mb-6">You need to be logged in to post a ride.</p>
        <button onClick={onLoginClick} className="btn-primary px-6 py-3 text-sm w-full"><span>Login / Sign Up</span></button>
      </div>
    </div>
  );

  const validate = () => {
    const e = {};
    if (!form.from) e.from = 'Required';
    if (!form.to) e.to = 'Required';
    if (!form.date) e.date = 'Required';
    if (!form.time) e.time = 'Required';
    if (!form.price || isNaN(form.price) || form.price <= 0) e.price = 'Enter a valid price';
    if (!form.vehicleModel) e.vehicleModel = 'Required';
    return e;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setLoading(true);
    // TODO: replace with real API → POST /rides { ...form }
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1200);
  };

  if (submitted) return (
    <div className="min-h-screen pt-24 flex items-center justify-center" style={{ background: '#0a0a0f' }}>
      <div className="text-center rounded-2xl p-10 max-w-sm mx-4"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
          <CheckCircle size={32} className="text-green-400" />
        </div>
        <p className="text-xl font-bold text-white mb-2">Ride Posted!</p>
        <p className="text-gray-400 text-sm mb-6">{form.from} → {form.to} is now live.</p>
        <div className="flex gap-3">
          <button onClick={() => navigate('/browse')} className="flex-1 btn-outline py-2.5 text-sm">Browse</button>
          <button onClick={() => navigate('/dashboard')} className="flex-1 btn-primary py-2.5 text-sm"><span>Dashboard</span></button>
        </div>
      </div>
    </div>
  );

  const inputCls = (name) => `input-dark w-full px-4 py-3 rounded-xl text-sm ${errors[name] ? 'border-red-500' : ''}`;

  return (
    <div className="min-h-screen pt-16" style={{ background: '#0a0a0f' }}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft size={16} /> Back
        </button>

        <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="h-1" style={{ background: 'linear-gradient(90deg, #FF7000, #ff9a3c)' }} />
          <div className="p-6">
            <h1 className="text-2xl font-black text-white mb-1">Post a Ride</h1>
            <p className="text-gray-500 text-sm mb-6">Share your commute and split the cost.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { label: 'From', name: 'from', type: 'text', placeholder: 'e.g. Bandra' },
                  { label: 'To', name: 'to', type: 'text', placeholder: 'e.g. Andheri' },
                  { label: 'Date', name: 'date', type: 'date' },
                  { label: 'Departure Time', name: 'time', type: 'time' },
                ].map(({ label, name, type, placeholder }) => (
                  <div key={name}>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">{label}</label>
                    <input type={type} name={name} value={form[name]} onChange={handleChange}
                      placeholder={placeholder} className={inputCls(name)} />
                    {errors[name] && <p className="text-red-400 text-xs mt-1">{errors[name]}</p>}
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Available Seats</label>
                  <select name="seats" value={form.seats} onChange={handleChange} className="input-dark w-full px-4 py-3 rounded-xl text-sm">
                    {[1,2,3,4].map(n => <option key={n} value={n} style={{ background: '#12121a' }}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Price per Seat (₹)</label>
                  <input type="number" name="price" value={form.price} onChange={handleChange}
                    placeholder="e.g. 80" className={inputCls('price')} />
                  {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Vehicle Type</label>
                  <select name="vehicleType" value={form.vehicleType} onChange={handleChange} className="input-dark w-full px-4 py-3 rounded-xl text-sm">
                    {['Bike','Scooter','Scooty'].map(v => <option key={v} value={v} style={{ background: '#12121a' }}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Vehicle Model</label>
                  <input type="text" name="vehicleModel" value={form.vehicleModel} onChange={handleChange}
                    placeholder="e.g. Honda Activa" className={inputCls('vehicleModel')} />
                  {errors.vehicleModel && <p className="text-red-400 text-xs mt-1">{errors.vehicleModel}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Description (optional)</label>
                <textarea name="description" value={form.description} onChange={handleChange}
                  placeholder="Any notes for co-riders..." rows={3}
                  className="input-dark w-full px-4 py-3 rounded-xl text-sm resize-none" />
              </div>

              <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl transition-all"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <input type="checkbox" name="recurring" checked={form.recurring} onChange={handleChange}
                  className="w-4 h-4 accent-orange-500" />
                <div>
                  <p className="text-sm font-semibold text-white">Recurring daily ride</p>
                  <p className="text-xs text-gray-500">Post once, ride every day on this route</p>
                </div>
              </label>

              <button type="submit" disabled={loading}
                className="btn-primary w-full py-4 text-sm disabled:opacity-50 flex items-center justify-center gap-2">
                <span>{loading ? 'Posting...' : 'Post Ride'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostRide;
