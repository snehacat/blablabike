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
    // Try different request formats - the error suggests backend expects raw string
    const formats = [
      {
        name: 'Raw OTP string as request body',
        data: String(otp),
        headers: { 'Content-Type': 'text/plain' }
      },
      {
        name: 'JSON with phone as string, OTP as raw string',
        data: JSON.stringify({ phone: String(phone), otp: String(otp) }),
        headers: { 'Content-Type': 'application/json' }
      },
      {
        name: 'JSON with only OTP',
        data: JSON.stringify({ otp: String(otp) }),
        headers: { 'Content-Type': 'application/json' }
      },
      {
        name: 'URL encoded with phone and OTP',
        data: `phone=${encodeURIComponent(phone)}&otp=${encodeURIComponent(otp)}`,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      },
      {
        name: 'JSON array with phone and OTP',
        data: JSON.stringify([String(phone), String(otp)]),
        headers: { 'Content-Type': 'application/json' }
      }
    ];

    for (const format of formats) {
      try {
        console.log(`authAPI - Trying format: ${format.name}`);
        console.log('authAPI - Data:', format.data);
        console.log('authAPI - Headers:', format.headers);
        
        // Use existing axios import
        // const axios = require('axios');
        const res = await axios.post(`${api.defaults.baseURL}/login/verify-otp`, format.data, {
          headers: {
            ...format.headers,
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        console.log(`authAPI - Success with ${format.name}:`, res.data);
        return res.data;
      } catch (error) {
        console.error(`authAPI - Failed with ${format.name}:`, error.response?.data || error.message);
        console.error(`authAPI - Error status:`, error.response?.status);
        console.error(`authAPI - Error headers:`, error.response?.headers);
        if (format.name === formats[formats.length - 1].name) {
          // Last format failed, throw the error
          throw error;
        }
        // Try next format
        continue;
      }
    }
  },
};

export default authAPI;
