import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'https://bike-cytc.onrender.com/api/auth',
  headers: { 'Content-Type': 'application/json' },
});

const authAPI = {
  // Registration (sends OTP; OTP verification completes account creation)
  register: async (userData) => {
    const res = await api.post('/register', userData);
    return res.data; // { success, message, data: null }
  },

  // Registration OTP verification (creates account + returns token/profile)
  verifyRegistrationOtp: async ({ phone, otp }) => {
    const res = await api.post('/verify-registration-otp', { phone, otp });
    return res.data; // { success, message, data: { token, fullName, email, phone, ... } }
  },

  // Login with phone + password
  loginWithPassword: async ({ phone, password }) => {
    const res = await api.post('/login/password', { phone, password });
    return res.data; // { success, message, data: { token, fullName, email, phone, ... } }
  },

  // Login with phone + OTP (if you want to add OTP login later)
  loginSendOtp: async (phone) => {
    const res = await api.post('/login/send-otp', { phone });
    return res.data; // { success, message, data: null }
  },
  loginVerifyOtp: async ({ phone, otp }) => {
    const res = await api.post('/login/verify-otp', { phone, otp });
    return res.data; // { success, message, data: { token, fullName, email, phone, ... } }
  },
};

export default authAPI;
