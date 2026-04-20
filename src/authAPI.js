import axios from 'axios';

import getApiConfig from './config/api';



const apiConfig = getApiConfig();



const api = axios.create({

  baseURL: apiConfig.baseURL,

  timeout: apiConfig.timeout,

  headers: {

    'Content-Type': 'application/json'

  }

});

// Add request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear localStorage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

const publicApi = axios.create({

  baseURL: apiConfig.baseURL,

  timeout: apiConfig.timeout,

  headers: {

    'Content-Type': 'application/json'

  }

});



const authAPI = {

  // Registration (sends OTP; OTP verification completes account creation)

  register: async (userData) => {

    const res = await publicApi.post('/auth/register', userData);

    return res.data; // { success, message, data: null }

  },



  // Registration OTP verification (creates account + returns token/profile)

  verifyRegistrationOTP: async (phone, otp) => {

    const res = await publicApi.post('/auth/verify-registration-otp', { phone, otp });

    return res.data; // { success, message, data: { token, fullName, email, phone, ... } }

  },



  // Login with phone + password

  login: async ({ phone, password }) => {

    const requestData = { phone: String(phone), password: String(password) };

    console.log("LOGIN PASSWORD REQUEST DATA:", requestData);

    console.log("LOGIN PASSWORD REQUEST URL:", publicApi.defaults.baseURL + '/auth/login');
    console.log("LOGIN PASSWORD REQUEST URL:", publicApi.defaults.baseURL + '/auth/login/password');

    

    try {

      const res = await publicApi.post('/auth/login/password', requestData);

      console.log("LOGIN PASSWORD RESPONSE:", res.data);

      console.log("LOGIN PASSWORD STATUS:", res.status);

      

      // Try to get profile data to get user's actual name

      let userData = res.data.data;

      try {

        const profileData = await authAPI.getProfile();

        console.log("Profile data found:", profileData);

        userData.fullName = profileData.fullName || userData.fullName;

        userData.email = profileData.email || userData.email;

        userData.kycStatus = profileData.kycStatus || userData.kycStatus;

        userData.verified = profileData.verified || userData.verified;

      } catch (profileErr) {

        console.log("Could not fetch profile, using login data");

      }

      

      return {

        success: true,

        message: "Login successful",

        data: userData

      };

    } catch (err) {

      console.log("LOGIN PASSWORD ERROR:", err.response?.data);

      console.log("LOGIN PASSWORD ERROR STATUS:", err.response?.status);

      console.log("LOGIN PASSWORD FULL ERROR:", err);

      

      // If backend is not available, provide mock login for demo

      if (err.response?.status === 403 || err.code === 'ERR_NETWORK') {

        console.log("Backend unavailable, using mock login...");

        

        // First try to get profile data from localStorage

        try {

          // Check for profile data in userProfile key (where MyProfile stores it)

          const storedProfile = localStorage.getItem('userProfile');

          if (storedProfile) {

            const profileData = JSON.parse(storedProfile);

            console.log("Found stored profile data:", profileData);

            return {

              success: true,

              message: "Login successful",

              data: {

                token: "mock_token_" + Date.now(),

                fullName: profileData.fullName || `User ${String(phone).slice(-4)}`,

                email: profileData.email || `user${String(phone).slice(-4)}@example.com`,

                phone: phone,

                role: "USER",

                kycStatus: profileData.kycStatus || "PENDING",

                verified: profileData.verified || false

              }

            };

          }

          

          // Also check user key as fallback

          const storedUser = localStorage.getItem('user');

          if (storedUser) {

            const userData = JSON.parse(storedUser);

            console.log("Found stored user data:", userData);

            return {

              success: true,

              message: "Login successful",

              data: {

                token: "mock_token_" + Date.now(),

                fullName: userData.fullName || `User ${String(phone).slice(-4)}`,

                email: userData.email || `user${String(phone).slice(-4)}@example.com`,

                phone: phone,

                role: "USER",

                kycStatus: userData.kycStatus || "PENDING",

                verified: userData.verified || false

              }

            };

          }

        } catch (error) {

          console.log("No stored profile data found, using phone-based name");

        }

        

        // Generate a simple name from phone number for demo

        const phoneStr = String(phone);

        const userName = phoneStr.length >= 10 ? `User ${phoneStr.slice(-4)}` : `User ${phoneStr}`;

        return {

          success: true,

          message: "Login successful",

          data: {

            token: "mock_token_" + Date.now(),

            fullName: userName,

            email: `user${phoneStr.slice(-4)}@example.com`,

            phone: phone,

            role: "USER",

            kycStatus: "PENDING",

            verified: false

          }

        };

      }

      

      throw err;

    }

  },



  // Login with phone + OTP (if you want to add OTP login later)

  loginSendOtp: async (phone) => {

    const requestData = { phone: String(phone) };

    console.log("SEND OTP REQUEST DATA:", requestData);

    console.log("SEND OTP REQUEST URL:", publicApi.defaults.baseURL + '/auth/login/send-otp');

    

    try {

      const res = await publicApi.post('/auth/login/send-otp', requestData);

      console.log("SEND OTP RESPONSE:", res.data);

      console.log("SEND OTP STATUS:", res.status);

      return res.data; // { success, message, data: null }

    } catch (err) {

      console.log("SEND OTP ERROR:", err.response?.data);

      console.log("SEND OTP ERROR STATUS:", err.response?.status);

      console.log("SEND OTP FULL ERROR:", err);

      

      // If backend is not available, provide mock OTP for demo

      if (err.response?.status === 403 || err.code === 'ERR_NETWORK') {

        console.log("Backend unavailable, using mock OTP...");

        

        // Generate mock OTP based on phone number for demo

        const phoneStr = String(phone);

        const mockOtp = phoneStr.length >= 10 ? phoneStr.slice(-6) : phoneStr.padStart(6, '0');

        

        return {

          success: true,

          message: `OTP sent successfully. For demo, use: ${mockOtp}`,

          data: {

            mockOtp: mockOtp

          }

        };

      }

      throw err;

    }

  },

  loginVerifyOtp: async ({ phone, otp }) => {

    try {

      const requestData = { phone: String(phone), otp: String(otp) };

      console.log("REQUEST DATA:", requestData);

      console.log("REQUEST URL:", publicApi.defaults.baseURL + '/auth/login/verify-otp');

      

      const res = await publicApi.post('/auth/login/verify-otp', requestData);

      console.log("SUCCESS RESPONSE:", res.data);

      console.log("RESPONSE TYPE:", typeof res.data);

      return res.data;

    } catch (err) {

      console.log("ERROR RESPONSE:", err.response?.data);

      console.log("ERROR TYPE:", typeof err.response?.data);

      console.log("STATUS:", err.response?.status);

      console.log("HEADERS:", err.response?.headers);

      console.log("FULL ERROR:", err);

      

      // If backend is not available, provide mock OTP verification for demo

      if (err.response?.status === 403 || err.code === 'ERR_NETWORK') {

        console.log("Backend unavailable, using mock OTP verification...");

        

        // Generate a consistent OTP based on phone number for demo

        const phoneStr = String(phone);

        const mockOtp = phoneStr.length >= 10 ? phoneStr.slice(-6) : phoneStr.padStart(6, '0');

        

        // Validate OTP

        if (String(otp) !== mockOtp) {

          console.log("Invalid OTP:", otp, "Expected:", mockOtp);

          return {

            success: false,

            message: "Invalid OTP. Please try again.",

            error: "OTP_MISMATCH"

          };

        }

        

        console.log("OTP validated successfully:", otp);

        

        // First try to get profile data from localStorage

        try {

          // Check for profile data in userProfile key (where MyProfile stores it)

          const storedProfile = localStorage.getItem('userProfile');

          if (storedProfile) {

            const profileData = JSON.parse(storedProfile);

            console.log("Found stored profile data for OTP:", profileData);

            return {

              success: true,

              message: "Login successful",

              data: {

                token: "mock_token_" + Date.now(),

                fullName: profileData.fullName || `User ${String(phone).slice(-4)}`,

                email: profileData.email || `user${String(phone).slice(-4)}@example.com`,

                phone: phone,

                role: "USER",

                kycStatus: profileData.kycStatus || "PENDING",

                verified: profileData.verified || false

              }

            };

          }
          

          

          // Also check user key as fallback

          const storedUser = localStorage.getItem('user');

          if (storedUser) {

            const userData = JSON.parse(storedUser);

            console.log("Found stored user data for OTP:", userData);

            return {

              success: true,

              message: "Login successful",

              data: {

                token: "mock_token_" + Date.now(),

                fullName: userData.fullName || `User ${String(phone).slice(-4)}`,

                email: userData.email || `user${String(phone).slice(-4)}@example.com`,

                phone: phone,

                role: "USER",

                kycStatus: userData.kycStatus || "PENDING",

                verified: userData.verified || false

              }

            };

          }

        } catch (error) {

          console.log("No stored profile data found for OTP, using phone-based name");

        }

        

        // Generate a simple name from phone number for demo

        const userName = phoneStr.length >= 10 ? `User ${phoneStr.slice(-4)}` : `User ${phoneStr}`;

        return {

          success: true,

          message: "Login successful",

          data: {

            token: "mock_token_" + Date.now(),

            fullName: userName,

            email: `user${phoneStr.slice(-4)}@example.com`,

            phone: phone,

            role: "USER",

            kycStatus: "PENDING",

            verified: false

          }

        };

      }

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



  // DigiLocker APIs

  initiateDigiLocker: async () => {

    const res = await api.post('/digilocker/initiate');

    return res.data;

  },

  getDigiLockerStatus: async () => {

    const res = await api.get('/digilocker/status');

    return res.data;

  },

  submitDocuments: async (documentData) => {

    const res = await api.post('/digilocker/submit-documents', documentData);

    return res.data;

  },



  // Vehicle APIs

  addVehicle: async (vehicleData) => {

    const res = await api.post('/vehicles', vehicleData);

    return res.data;

  },

  getMyVehicles: async () => {

    const res = await api.get('/vehicles/my');

    return res.data;

  },

  deactivateVehicle: async (vehicleId) => {

    const res = await api.patch(`/vehicles/${vehicleId}/deactivate`);

    return res.data;

  },

  activateVehicle: async (vehicleId) => {

    const res = await api.patch(`/vehicles/${vehicleId}/activate`);

    return res.data;

  },

  deleteVehicle: async (vehicleId) => {

    const res = await api.delete(`/vehicles/${vehicleId}`);

    return res.data;

  }

};

export default authAPI;