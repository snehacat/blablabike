import React, { useState } from 'react';
import { X, Loader, Eye, EyeOff, Zap } from 'lucide-react';
import authAPI from './authAPI';

const LoginModal = ({ onClose, onSuccess, onSwitchToSignup }) => {
  const [form, setForm] = useState({ phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.phone || !form.password) { setError('Please fill in all fields.'); return; }
    // Backend examples use 10-digit phone numbers, but allow 10-15 digits (+ optional)
    const phoneOk = /^\+?\d{10,15}$/.test(form.phone);
    if (!phoneOk) { setError('Phone must be valid (e.g. 6876543210).'); return; }
    setLoading(true);
    try {
      const resp = await authAPI.loginWithPassword({ phone: form.phone, password: form.password });
      if (resp?.success && resp?.data?.token) {
        const authData = resp.data;
        localStorage.setItem('token', authData.token);
        localStorage.setItem('user', JSON.stringify({
          fullName: authData.fullName,
          email: authData.email,
          phone: authData.phone,
          role: authData.role,
          kycStatus: authData.kycStatus,
          verified: (authData.kycStatus || '').toUpperCase() === 'APPROVED' || (authData.kycStatus || '').toUpperCase() === 'VERIFIED',
        }));
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          onSuccess({
            fullName: authData.fullName,
            email: authData.email,
            phone: authData.phone,
            role: authData.role,
            kycStatus: authData.kycStatus,
            verified: (authData.kycStatus || '').toUpperCase() === 'APPROVED' || (authData.kycStatus || '').toUpperCase() === 'VERIFIED',
          });
        }, 1500);
        return;
      }
      setError(resp?.message || 'Login failed. Please try again.');
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>
      <div className="relative w-full max-w-md rounded-2xl overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #12121a, #1a1a2e)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #FF7000, #ff9a3c)' }} />
        <div className="p-8">
          <button onClick={onClose} className="absolute top-5 right-5 text-gray-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #FF7000, #ff9a3c)' }}>
              <Zap size={18} className="text-white" fill="white" />
            </div>
            <span className="text-lg font-bold text-white">BikePooling</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
          <p className="text-gray-400 text-sm mb-6">Sign in to your account</p>
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl text-sm text-red-300"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 px-4 py-3 rounded-xl text-sm text-green-300"
              style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
              {success}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Phone</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                placeholder="6876543210" className="input-dark w-full px-4 py-3 rounded-xl text-sm" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} name="password" value={form.password}
                  onChange={handleChange} placeholder="••••••••"
                  className="input-dark w-full px-4 py-3 rounded-xl text-sm pr-11" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3 text-sm mt-2 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading && <Loader size={15} className="animate-spin" />}
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-5">
            Don't have an account?{' '}
            <button onClick={onSwitchToSignup} className="text-primary-orange font-semibold hover:underline">
              Sign up free
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
