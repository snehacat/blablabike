import axios from 'axios';

const api = axios.create({
  baseURL: 'https://bike-cytc.onrender.com/api/auth',
  headers: { 'Content-Type': 'application/json' },
});

const authAPI = {
  register: async (userData) => {
    const res = await api.post('/register', userData);
    return res.data;
  },
  login: async (credentials) => {
    const res = await api.post('/login', credentials);
    return res.data;
  },
  sendOTP: async (phone) => {
    const res = await api.post('/send-otp', { phone });
    return res.data;
  },
  verifyOTP: async (phone, otp) => {
    const res = await api.post('/verify-otp', { phone, otp });
    return res.data;
  },
};

export default authAPI;
