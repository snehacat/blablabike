// Simple test to verify API calls
const axios = require('axios');

const testBackend = async () => {
  console.log('🧪 Testing Backend Connection...');
  
  try {
    // Test the exact same endpoints as frontend
    const response = await axios.post('https://bike-cytc.onrender.com/api/auth/register', {
      fullName: 'Test User',
      email: 'test@example.com', 
      phone: '9876543210',
      password: 'TestPass123'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Backend Response:', response.status);
    console.log('✅ Backend Data:', response.data);
    
    if (response.status === 200) {
      console.log('🎉 SUCCESS: Backend is working!');
    } else if (response.status === 403) {
      console.log('🚫 403 FORBIDDEN: Backend exists but blocking requests');
    } else if (response.status === 500) {
      console.log('💥 500 ERROR: Backend has internal errors');
    } else {
      console.log('❓ UNKNOWN STATUS:', response.status);
    }
    
  } catch (error) {
    console.error('❌ CONNECTION ERROR:', error.message);
  }
};

testBackend();
