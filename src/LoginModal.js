import React, { useState } from 'react';
import { X, Loader, Eye, EyeOff, Zap } from 'lucide-react';
import authAPI from './authAPI';

const LoginModal = ({ onClose, onSuccess, onSwitchToSignup }) => {
  const [form, setForm] = useState({ phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState('password'); // 'password' or 'otp'
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSendOtp = async () => {
    if (!form.phone) { setError('Please enter your phone number.'); return; }
    const phoneOk = /^\+?\d{10,15}$/.test(form.phone);
    if (!phoneOk) { setError('Phone must be valid (e.g. 6876543210).'); return; }
    
    setOtpLoading(true);
    try {
      const resp = await authAPI.loginSendOtp({ phone: form.phone });
      if (resp?.success) {
        setOtpSent(true);
        setSuccess('OTP sent to your phone!');
      } else {
        setError(resp?.message || 'Failed to send OTP.');
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to send OTP.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) { setError('Please enter the OTP.'); return; }
    
    setLoading(true);
    try {
      console.log('Verifying OTP for phone:', form.phone, 'OTP:', otp);
      const requestData = { phone: form.phone, otp: otp };
      console.log('Request data being sent:', JSON.stringify(requestData));
      
      let resp;
      try {
        resp = await authAPI.loginVerifyOtp(requestData);
        console.log('OTP verification response:', resp);
      } catch (firstError) {
        console.log('First attempt failed, trying different format:', firstError);
        
        // Try with OTP as string explicitly
        try {
          const stringRequest = { phone: form.phone, otp: otp.toString() };
          console.log('Trying with string OTP:', JSON.stringify(stringRequest));
          resp = await authAPI.loginVerifyOtp(stringRequest);
          console.log('String OTP response:', resp);
        } catch (secondError) {
          console.log('Second attempt failed, trying as number:', secondError);
          
          // Try with OTP as number
          try {
            const numberRequest = { phone: form.phone, otp: parseInt(otp) };
            console.log('Trying with number OTP:', JSON.stringify(numberRequest));
            resp = await authAPI.loginVerifyOtp(numberRequest);
            console.log('Number OTP response:', resp);
          } catch (thirdError) {
            console.log('All formats failed:', thirdError);
            throw thirdError;
          }
        }
      }
      
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
      setError(resp?.message || 'Invalid OTP. Please try again.');
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (loginMethod === 'password') {
      if (!form.phone || !form.password) { setError('Please fill in all fields.'); return; }
      const phoneOk = /^\+?\d{10,15}$/.test(form.phone);
      if (!phoneOk) { setError('Phone must be valid (e.g. 6876543210).'); return; }
      
      setLoading(true);
      try {
        const resp = await authAPI.loginWithPassword({ phone: form.phone, password: form.password });
        console.log('Login response:', resp); // Debug log
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
    } else {
      // OTP login
      if (!otpSent) {
        handleSendOtp();
      } else {
        handleVerifyOtp();
      }
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
          {/* Login Method Selection */}
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => setLoginMethod('password')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                loginMethod === 'password'
                  ? 'bg-orange-DEFAULT text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Password
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod('otp')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                loginMethod === 'otp'
                  ? 'bg-orange-DEFAULT text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              OTP
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Phone</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                placeholder="6876543210" className="input-dark w-full px-4 py-3 rounded-xl text-sm" required />
            </div>
            
            {loginMethod === 'password' && (
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} name="password" value={form.password}
                    onChange={handleChange} placeholder="Enter password"
                    className="input-dark w-full px-4 py-3 rounded-xl text-sm pr-11" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}
            
            {loginMethod === 'otp' && otpSent && (
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  className="input-dark w-full px-4 py-3 rounded-xl text-sm"
                  maxLength={6}
                  required
                />
              </div>
            )}
            
            <button type="submit" disabled={loading || otpLoading}
              className="btn-primary w-full py-3 text-sm mt-2 disabled:opacity-50 flex items-center justify-center gap-2">
              {(loading || otpLoading) && <Loader size={15} className="animate-spin" />}
              <span>
                {loading ? 'Signing in...' : 
                 otpLoading ? 'Sending OTP...' :
                 loginMethod === 'otp' && !otpSent ? 'Send OTP' :
                 loginMethod === 'otp' && otpSent ? 'Verify OTP' :
                 'Sign In'}
              </span>
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
