// Test script to verify our authAPI is working correctly
import authAPI from './src/authAPI.js';

const testAuthAPIs = async () => {
  console.log('🧪 Testing Auth APIs...');
  
  try {
    // Test 1: Signup (should call /api/auth/register)
    console.log('\n📝 TEST 1: SIGNUP');
    const signupResult = await authAPI.signup({
      fullName: 'Test User',
      email: 'test@example.com',
      phone: '9876543210',
      password: 'TestPass123'
    });
    console.log('✅ Signup Result:', signupResult);
    
    // Test 2: Send OTP (should call /api/auth/login/send-otp)
    console.log('\n📱 TEST 2: SEND OTP');
    const otpResult = await authAPI.loginSendOtp('9876543210');
    console.log('✅ OTP Send Result:', otpResult);
    
    // Test 3: Verify OTP (should call /api/auth/login/verify-otp)
    console.log('\n🔐 TEST 3: VERIFY OTP');
    const verifyResult = await authAPI.loginVerifyOtp({
      phone: '9876543210',
      otp: '123456' // This will fail with mock, should show real backend behavior
    });
    console.log('✅ OTP Verify Result:', verifyResult);
    
    // Test 4: Login with Password (should call /api/auth/login/password)
    console.log('\n🔑 TEST 4: LOGIN PASSWORD');
    const loginResult = await authAPI.loginWithPassword({
      phone: '9876543210',
      password: 'TestPass123'
    });
    console.log('✅ Login Result:', loginResult);
    
    // Test 5: Get Profile (should call /api/users/profile)
    console.log('\n👤 TEST 5: GET PROFILE');
    try {
      const profileResult = await authAPI.getProfile();
      console.log('✅ Profile Result:', profileResult);
    } catch (err) {
      console.log('❌ Profile Error:', err.message);
    }
    
  } catch (error) {
    console.error('❌ Test Failed:', error.message);
  }
};

// Run the test
testAuthAPIs();
