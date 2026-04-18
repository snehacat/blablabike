// API Configuration for different environments
const getApiConfig = () => {
  const baseURL = process.env.REACT_APP_API_URL?.trim() || 'https://bike-cytc.onrender.com/api';
  const timeout = 20000; // allow more time for backend response

  return {
    baseURL,
    timeout,
  };
};

export default getApiConfig;