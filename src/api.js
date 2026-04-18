import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://bike-cytc.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
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

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Ride APIs
export const rideAPI = {
  getAllRides: (params = {}) => api.get('/rides', { params }),
  getRideById: (id) => api.get(`/rides/${id}`),
  createRide: (rideData) => api.post('/rides', rideData),
};

// Booking APIs
export const bookingAPI = {
  bookRide: (bookingData) => api.post('/bookings', bookingData),
  getUserBookings: (userId) => api.get(`/bookings/${userId}`),
};

// User APIs
export const userAPI = {
  getAllUsers: () => api.get('/users'),
  getUserById: (id) => api.get(`/users/${id}`),
};

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login/password', credentials),
  register: (userData) => api.post('/auth/register', userData),
  loginSendOtp: (phone) => api.post('/auth/login/send-otp', { phone }),
  loginVerifyOtp: ({ phone, otp }) => api.post('/auth/login/verify-otp', { phone, otp }),
};

// Stats API
export const statsAPI = {
  getStats: () => api.get('/stats'),
};

export default api;
