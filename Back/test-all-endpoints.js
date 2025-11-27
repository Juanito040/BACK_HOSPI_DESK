const axios = require('axios');

const API_URL = 'http://localhost:3000/api/v1';
let authToken = '';
let userId = '';
let ticketId = '';
let areaId = '';

async function testAllEndpoints() {
  console.log('===========================================');
  console.log('TESTING ALL ENDPOINTS');
  console.log('===========================================\n');

  try {
    // 1. Health Check
    console.log('1️⃣  Testing Health Endpoint...');
    const health = await axios.get(`${API_URL}/health`);
    console.log('✅ Health:', health.data);

    // 2. Get Areas (Public)
    console.log('\n2️⃣  Testing Get Areas (Public)...');
    const areas = await axios.get(`${API_URL}/areas?activeOnly=true`);
    console.log(`✅ Found ${areas.data.length} areas`);
    if (areas.data.length > 0) {
      areaId = areas.data[0].id;
      console.log(`   Using area: ${areas.data[0].name}`);
    }

    // 3. Register
    console.log('\n3️⃣  Testing Register...');
    const registerData = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      role: 'REQUESTER',
      areaId: areaId || undefined
    };
    const registerResponse = await axios.post(`${API_URL}/auth/register`, registerData);
    console.log('✅ Register successful');
    authToken = registerResponse.data.token;
    userId = registerResponse.data.user.id;
    console.log(`   Token: ${authToken.substring(0, 20)}...`);
    console.log(`   User ID: ${userId}`);

    // 4. Login
    console.log('\n4️⃣  Testing Login...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: registerData.email,
      password: registerData.password
    });
    console.log('✅ Login successful');
    authToken = loginResponse.data.token; // Update token

    // Setup axios instance with auth
    const api = axios.create({
      baseURL: API_URL,
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    // 5. Create Ticket
    console.log('\n5️⃣  Testing Create Ticket...');
    const ticketData = {
      title: 'Test Ticket',
      description: 'This is a test ticket created by automated test',
      priority: 'MEDIUM',
      areaId: areaId || undefined,
      requesterId: userId
    };
    const createTicketResponse = await api.post('/tickets', ticketData);
    console.log('✅ Ticket created');
    ticketId = createTicketResponse.data.id;
    console.log(`   Ticket ID: ${ticketId}`);

    // 6. List Tickets
    console.log('\n6️⃣  Testing List Tickets...');
    const listResponse = await api.get('/tickets?page=1&pageSize=10');
    console.log('✅ Tickets listed');
    console.log(`   Total tickets: ${listResponse.data.total}`);
    console.log(`   Current page: ${listResponse.data.page}/${listResponse.data.totalPages}`);

    // 7. Get Ticket Details
    console.log('\n7️⃣  Testing Get Ticket Details...');
    const ticketDetails = await api.get(`/tickets/${ticketId}`);
    console.log('✅ Ticket details retrieved');
    console.log(`   Title: ${ticketDetails.data.ticket.title}`);
    console.log(`   Status: ${ticketDetails.data.ticket.status}`);

    // 8. Add Comment
    console.log('\n8️⃣  Testing Add Comment...');
    const commentData = {
      ticketId: ticketId,
      userId: userId,
      content: 'This is a test comment',
      isInternal: false
    };
    const commentResponse = await api.post('/comments', commentData);
    console.log('✅ Comment added');

    // 9. Update Ticket Status
    console.log('\n9️⃣  Testing Update Ticket Status...');
    const updateStatusResponse = await api.patch(`/tickets/${ticketId}/status`, {
      status: 'IN_PROGRESS'
    });
    console.log('✅ Ticket status updated to IN_PROGRESS');

    // 10. Get Areas (Authenticated)
    console.log('\n🔟 Testing Get Areas (Authenticated)...');
    const areasAuth = await api.get('/areas');
    console.log(`✅ Found ${areasAuth.data.length} areas (authenticated)`);

    console.log('\n===========================================');
    console.log('✅ ALL TESTS PASSED!');
    console.log('===========================================');
    console.log('\n📊 Summary:');
    console.log(`   - User ID: ${userId}`);
    console.log(`   - Ticket ID: ${ticketId}`);
    console.log(`   - Area ID: ${areaId}`);
    console.log('\n✅ Your backend is working correctly!');
    console.log('   You can now use the frontend to interact with the system.');

  } catch (error) {
    console.error('\n❌ TEST FAILED:');
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Error:`, error.response.data);
    } else {
      console.error(`   Error: ${error.message}`);
    }
    console.log('\n💡 Make sure the backend is running: npm run dev');
  }
}

testAllEndpoints();
