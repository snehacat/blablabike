// Vehicle API Testing Script
// Run this in browser console when logged in

// Test Vehicle APIs
console.log('=== Vehicle API Testing Script ===');

// 1. Test Get My Vehicles
async function testGetVehicles() {
  try {
    console.log('Testing GET /vehicles/my...');
    const token = localStorage.getItem('token');
    
    const response = await fetch('https://bike-cytc.onrender.com/api/vehicles/my', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    console.log('Get Vehicles Response:', data);
    console.log('Status:', response.status);
    return data;
  } catch (error) {
    console.error('Get Vehicles Error:', error);
  }
}

// 2. Test Add Vehicle
async function testAddVehicle() {
  try {
    console.log('Testing POST /vehicles...');
    const token = localStorage.getItem('token');
    
    const vehicleData = {
      bikeNumber: 'TEST' + Date.now().toString().slice(-6),
      bikeName: 'Test Bike',
      bikeModel: 'Test Model',
      bikeCompany: 'Test Company',
      vehicleType: 'BIKE'
    };
    
    const response = await fetch('https://bike-cytc.onrender.com/api/vehicles', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(vehicleData)
    });
    
    const data = await response.json();
    console.log('Add Vehicle Response:', data);
    console.log('Status:', response.status);
    return data;
  } catch (error) {
    console.error('Add Vehicle Error:', error);
  }
}

// 3. Test Deactivate Vehicle
async function testDeactivateVehicle(vehicleId) {
  try {
    console.log(`Testing PATCH /vehicles/${vehicleId}/deactivate...`);
    const token = localStorage.getItem('token');
    
    const response = await fetch(`https://bike-cytc.onrender.com/api/vehicles/${vehicleId}/deactivate`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    console.log('Deactivate Vehicle Response:', data);
    console.log('Status:', response.status);
    return data;
  } catch (error) {
    console.error('Deactivate Vehicle Error:', error);
  }
}

// 4. Complete Test Flow
async function runCompleteVehicleTest() {
  console.log('=== Starting Complete Vehicle API Test ===');
  
  // Check if user is logged in
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (!token || !user) {
    console.error('Please login first!');
    return;
  }
  
  console.log('User logged in:', JSON.parse(user));
  
  // Step 1: Get current vehicles
  console.log('\n--- Step 1: Get Current Vehicles ---');
  const currentVehicles = await testGetVehicles();
  
  // Step 2: Add a test vehicle
  console.log('\n--- Step 2: Add Test Vehicle ---');
  const addedVehicle = await testAddVehicle();
  
  if (addedVehicle?.success) {
    const newVehicleId = addedVehicle.data.id;
    console.log('New vehicle ID:', newVehicleId);
    
    // Step 3: Get vehicles again to see the new one
    console.log('\n--- Step 3: Get Vehicles After Adding ---');
    await testGetVehicles();
    
    // Step 4: Deactivate the test vehicle
    console.log('\n--- Step 4: Deactivate Test Vehicle ---');
    await testDeactivateVehicle(newVehicleId);
    
    // Step 5: Get vehicles again to see it deactivated
    console.log('\n--- Step 5: Get Vehicles After Deactivating ---');
    await testGetVehicles();
  }
  
  console.log('\n=== Complete Vehicle API Test Finished ===');
}

// Make functions available globally
window.testVehicleAPIs = {
  getVehicles: testGetVehicles,
  addVehicle: testAddVehicle,
  deactivateVehicle: testDeactivateVehicle,
  runCompleteTest: runCompleteVehicleTest
};

console.log('Vehicle API testing functions loaded!');
console.log('Available functions:');
console.log('- testVehicleAPIs.getVehicles()');
console.log('- testVehicleAPIs.addVehicle()');
console.log('- testVehicleAPIs.deactivateVehicle(vehicleId)');
console.log('- testVehicleAPIs.runCompleteTest()');
console.log('\nExample usage: testVehicleAPIs.runCompleteTest()');
