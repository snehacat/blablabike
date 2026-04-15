import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';

const Profile = ({ user, onUpdate }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: user?.fullName || '', email: user?.email || '', phone: user?.phone || '' });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!user) { navigate('/'); return null; }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // TODO: replace with real API → PUT /users/me { ...form }
    setTimeout(() => {
      const updated = { ...user, ...form };
      localStorage.setItem('user', JSON.stringify(updated));
      if (onUpdate) onUpdate(updated);
      setLoading(false); setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  return (
    <div className="min-h-screen pt-16" style={{ background: '#0a0a0f' }}>
      <div className="max-w-lg mx-auto px-4 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft size={16} /> Back
        </button>

        <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="h-1" style={{ background: 'linear-gradient(90deg, #FF7000, #ff9a3c)' }} />
          <div className="p-6">
            <h1 className="text-2xl font-black text-white mb-6">Edit Profile</h1>

            <div className="flex items-center gap-4 mb-6 pb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <img src={user.avatar || `https://i.pravatar.cc/80?u=${user.email}`} alt=""
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-primary-orange ring-opacity-40" />
              <div>
                <p className="font-bold text-white">{user.fullName}</p>
                <p className="text-gray-500 text-sm">Member since {user.joinedDate || '2024'}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { label: 'Full Name', name: 'fullName', type: 'text', placeholder: 'Your full name' },
                { label: 'Email', name: 'email', type: 'email', placeholder: 'your@email.com' },
                { label: 'Phone', name: 'phone', type: 'tel', placeholder: '+911234567890' },
              ].map(({ label, name, type, placeholder }) => (
                <div key={name}>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">{label}</label>
                  <input type={type} name={name} value={form[name]} onChange={handleChange}
                    placeholder={placeholder} className="input-dark w-full px-4 py-3 rounded-xl text-sm" />
                </div>
              ))}
              <button type="submit" disabled={loading}
                className="btn-primary w-full py-3.5 text-sm disabled:opacity-50 flex items-center justify-center gap-2">
                {saved ? <><CheckCircle size={15} /><span>Saved!</span></> : <span>{loading ? 'Saving...' : 'Save Changes'}</span>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
