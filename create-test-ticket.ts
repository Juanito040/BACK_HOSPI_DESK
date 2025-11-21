import axios from 'axios';

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzYzk3NDZhYS03NjJhLTRlYmEtYTg5Zi01MGZhZjllMTA3MzgiLCJlbWFpbCI6InRlc3R1c2VyQGV4YW1wbGUuY29tIiwicm9sZSI6IlJFUVVFU1RFUiIsImlhdCI6MTc2MzMzNjQyNCwiZXhwIjoxNzYzNDIyODI0fQ.dDA52jRsAYTGtTQaoo5ejiu8Cbi6A-u0ZeHK_5Bhp8M';

async function createTestTicket() {
  try {
    console.log('Creating test ticket to trigger email notification...\n');

    const payload = {
      title: 'Test Email Notification - Problema con impresora',
      description: 'Este ticket es una prueba para verificar las notificaciones por email via Mailtrap. La impresora del piso 3 no está funcionando correctamente.',
      priority: 'HIGH',
      areaId: '11111111-1111-1111-1111-111111111111',
      requesterId: '3c9746aa-762a-4eba-a89f-50faf9e10738',
    };

    console.log('Payload:', JSON.stringify(payload, null, 2));

    const response = await axios.post(
      'http://localhost:3000/api/v1/tickets',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );

    console.log('Ticket created successfully!');
    console.log('Ticket ID:', response.data.id);
    console.log('Title:', response.data.title);
    console.log('Priority:', response.data.priority);
    console.log('\n✅ Check your Mailtrap inbox at: https://mailtrap.io');
    console.log('   You should see an email notification for this ticket!');
  } catch (error: any) {
    console.error('Error creating ticket:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
  }
}

createTestTicket();
