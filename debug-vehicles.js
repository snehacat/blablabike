// Debug Vehicle API - Run this in browser console
console.log('=== Vehicle API Debug Script ===');

// Test 1: Check if user is logged in
const token = localStorage.getItem('token');
const user = localStorage.getItem('user');

console.log('Token:', token ? 'EXISTS' : 'MISSING');
console.log('User:', user ? JSON.parse(user) : 'MISSING');

if (!token) {
  console.error('ERROR: No token found. Please login first.');
} else {
  console.log('User is logged in, testing APIs...');
  
  // Test 2: Direct API call to get vehicles
  const testGetVehicles = async () => {
    try {
      console.log('\n=== Testing GET /vehicles/my ===');
      
      const response = await fetch('https://bike-cytc.onrender.com/api/vehicles/my', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      const responseText = await response.text();
      console.log('Response text:', responseText);
      
      let responseData;
      try {
        responseData = JSON.parse(responseText);
        console.log('Parsed response data:', responseData);
      } catch (e) {
        console.log('Response is not valid JSON:', responseText);
        return;
      }
      
      if (response.ok) {
        console.log('SUCCESS: API call successful');
        console.log('Number of vehicles:', responseData?.data?.length || 0);
        
        if (responseData?.data && responseData.data.length > 0) {
          console.log('Vehicle details:');
          responseData.data.forEach((vehicle, index) => {
            console.log(`Vehicle ${index + 1}:`, {
              id: vehicle.id,
              bikeName: vehicle.bikeName,
              bikeNumber: vehicle.bikeNumber,
              active: vehicle.active,
              activeType: typeof vehicle.active
            });
          });
        } else {
          console.log('No vehicles found in response');
        }
      } else {
        console.log('ERROR: API call failed');
        console.log('Error message:', responseData?.message || 'Unknown error');
      }
      
    } catch (error) {
      console.error('Network error:', error);
    }
  };
  
  // Test 3: Try alternative endpoints
  const testAlternativeEndpoints = async () => {
    console.log('\n=== Testing Alternative Endpoints ===');
    
    const endpoints = [
      '/api/vehicles',
      '/api/vehicles/all',
      '/api/vehicles/list'
    ];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`\nTesting GET ${endpoint}...`);
        
        const response = await fetch(`https://bike-cytc.onrender.com${endpoint}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log(`Status: ${response.status}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`SUCCESS: ${endpoint} returned data:`, data);
        } else {
          const errorText = await response.text();
          console.log(`FAILED: ${endpoint} - ${response.status} - ${errorText}`);
        }
        
      } catch (error) {
        console.log(`ERROR: ${endpoint} - ${error.message}`);
      }
    }
  };
  
  // Run tests
  console.log('\nStarting API tests...');
  testGetVehicles().then(() => {
    testAlternativeEndpoints();
  });
}

console.log('\nDebug script loaded. Run testGetVehicles() to test the API.');
