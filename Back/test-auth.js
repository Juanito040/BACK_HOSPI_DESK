const axios = require('axios');

const API_URL = 'http://localhost:3000/api/v1';

async function testBackend() {
  console.log('Testing backend connection...\n');

  // Test 1: Health check
  try {
    console.log('1. Testing health endpoint...');
    const health = await axios.get(`${API_URL}/health`);
    console.log('✓ Health check passed:', health.data);
  } catch (error) {
    console.error('✗ Health check failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('Backend is not running! Please start it with: npm run dev');
      return;
    }
  }

  // Test 2: Register
  try {
    console.log('\n2. Testing register endpoint...');
    const registerData = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      role: 'REQUESTER'
    };

    const registerResponse = await axios.post(`${API_URL}/auth/register`, registerData);
    console.log('✓ Register successful:', {
      hasToken: !!registerResponse.data.token,
      hasRefreshToken: !!registerResponse.data.refreshToken,
      user: registerResponse.data.user
    });

    // Test 3: Login
    console.log('\n3. Testing login endpoint...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: registerData.email,
      password: registerData.password
    });
    console.log('✓ Login successful:', {
      hasToken: !!loginResponse.data.token,
      hasRefreshToken: !!loginResponse.data.refreshToken,
      user: loginResponse.data.user
    });

  } catch (error) {
    console.error('✗ Test failed:', error.response?.data || error.message);
  }
}

testBackend();
