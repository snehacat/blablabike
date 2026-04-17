import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'https://bike-cytc.onrender.com/api/auth',
  headers: { 'Content-Type': 'application/json' },
});

// Separate API instance for login OTP (no auth headers needed)
const publicApi = axios.create({
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
    const requestData = { phone: String(phone), password: String(password) };
    console.log("LOGIN PASSWORD REQUEST DATA:", requestData);
    console.log("LOGIN PASSWORD REQUEST URL:", publicApi.defaults.baseURL + '/login/password');
    
    try {
      const res = await publicApi.post('/login/password', requestData);
      console.log("LOGIN PASSWORD RESPONSE:", res.data);
      console.log("LOGIN PASSWORD STATUS:", res.status);
      return res.data; // { success, message, data: { token, fullName, email, phone, ... } }
    } catch (err) {
      console.log("LOGIN PASSWORD ERROR:", err.response?.data);
      console.log("LOGIN PASSWORD ERROR STATUS:", err.response?.status);
      console.log("LOGIN PASSWORD FULL ERROR:", err);
      throw err;
    }
  },

  // Login with phone + OTP (if you want to add OTP login later)
  loginSendOtp: async (phone) => {
    const requestData = { phone: String(phone) };
    console.log("SEND OTP REQUEST DATA:", requestData);
    console.log("SEND OTP REQUEST URL:", publicApi.defaults.baseURL + '/login/send-otp');
    
    try {
      const res = await publicApi.post('/login/send-otp', requestData);
      console.log("SEND OTP RESPONSE:", res.data);
      console.log("SEND OTP STATUS:", res.status);
      return res.data; // { success, message, data: null }
    } catch (err) {
      console.log("SEND OTP ERROR:", err.response?.data);
      console.log("SEND OTP ERROR STATUS:", err.response?.status);
      console.log("SEND OTP FULL ERROR:", err);
      throw err;
    }
  },
  loginVerifyOtp: async ({ phone, otp }) => {
    try {
      const requestData = { phone: String(phone), otp: String(otp) };
      console.log("REQUEST DATA:", requestData);
      console.log("REQUEST URL:", publicApi.defaults.baseURL + '/login/verify-otp');
      
      const res = await publicApi.post('/login/verify-otp', requestData);
      console.log("SUCCESS RESPONSE:", res.data);
      console.log("RESPONSE TYPE:", typeof res.data);
      return res.data;
    } catch (err) {
      console.log("ERROR RESPONSE:", err.response?.data);
      console.log("ERROR TYPE:", typeof err.response?.data);
      console.log("STATUS:", err.response?.status);
      console.log("HEADERS:", err.response?.headers);
      console.log("FULL ERROR:", err);
      throw err;
    }
  },

  // Get user profile
  getProfile: async () => {
    const res = await api.get('/users/profile');
    return res.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const res = await api.put('/users/profile', profileData);
    return res.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const res = await api.post('/auth/change-password', passwordData);
    return res.data;
  },
};

export default authAPI;
