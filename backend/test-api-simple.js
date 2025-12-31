const fetch = require('node-fetch');

const testAPI = async () => {
  try {
    console.log('Testing bike rides API...');
    const response = await fetch('http://localhost:5000/api/bike-rides');
    const data = await response.json();
    
    if (data.success) {
      console.log(`✅ API working! Found ${data.data.bikeRides.length} bike rides`);
      console.log('Sample ride:', data.data.bikeRides[0]?.title);
    } else {
      console.log('❌ API returned error:', data.message);
    }
  } catch (error) {
    console.log('❌ Failed to connect to API:', error.message);
  }
};

testAPI();