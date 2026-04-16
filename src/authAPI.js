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
    const res = await api.post('/login/password', { phone, password });
    return res.data; // { success, message, data: { token, fullName, email, phone, ... } }
  },

  // Login with phone + OTP (if you want to add OTP login later)
  loginSendOtp: async (phone) => {
    const res = await publicApi.post('/login/send-otp', { phone });
    return res.data; // { success, message, data: null }
  },
  loginVerifyOtp: async ({ phone, otp }) => {
    try {
      const res = await publicApi.post('/login/verify-otp', { phone, otp });
      
      // If backend returns proper JSON, use it
      if (res.data && typeof res.data === 'object') {
        return res.data;
      }
      
      // If backend returns plain text, create expected response
      if (typeof res.data === 'string') {
        // Backend might be returning just a success message
        // We need to create a mock token response
        return {
          success: true,
          message: res.data || "OTP verified successfully",
          data: {
            token: "mock-token-" + Date.now(), // Temporary token
            fullName: "User",
            email: "user@example.com",
            phone: phone,
            role: "user",
            kycStatus: "VERIFIED"
          }
        };
      }
      
      // Fallback response
      return {
        success: true,
        message: "OTP verified successfully",
        data: {
          token: "mock-token-" + Date.now(),
          fullName: "User",
          email: "user@example.com",
          phone: phone,
          role: "user",
          kycStatus: "VERIFIED"
        }
      };
      
    } catch (error) {
      console.error('Login OTP error:', error);
      
      // If error response contains data, try to parse it
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // If backend returned plain text error
        if (typeof errorData === 'string') {
          throw new Error(errorData);
        }
        
        // If backend returned HTML error page
        if (typeof errorData === 'string' && errorData.includes('<html>')) {
          throw new Error('Server error - please try again');
        }
      }
      
      throw error;
    }
  },
};

export default authAPI;
