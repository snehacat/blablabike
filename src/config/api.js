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
    // For production, you have several options:
    // Option 1: Use your deployed backend URL
    return {
      baseURL: 'https://your-backend-domain.com/api',
      timeout: 10000,
    };
    
    // Option 2: Use Vercel serverless functions
    // return {
    //   baseURL: '/api',
    //   timeout: 10000,
    // };
    
    // Option 3: Mock API for demo purposes (temporary)
    return {
      baseURL: 'https://mockapi.example.com/api',
      timeout: 10000,
    };
  }
  
  return {
    baseURL: 'https://bike-cytc.onrender.com/api',
    timeout: 10000,
  };
};

export default getApiConfig;
