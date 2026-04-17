// API Configuration for different environments
const getApiConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isDevelopment) {
    return {
      baseURL: 'https://bike-cytc.onrender.com/api',
      timeout: 10000,
    };
  }
  
  if (isProduction) {
    // For production, use the same backend URL
    return {
      baseURL: 'https://bike-cytc.onrender.com/api',
      timeout: 10000,
    };
  }
  
  return {
    baseURL: 'https://bike-cytc.onrender.com/api',
    timeout: 10000,
  };
};

export default getApiConfig;