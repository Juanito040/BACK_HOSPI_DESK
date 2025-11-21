import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import axios from 'axios';

const prisma = new PrismaClient();

async function fixAndTest() {
  try {
    // Generate valid UUIDs
    const areaId = randomUUID();
    const userId = '3c9746aa-762a-4eba-a89f-50faf9e10738'; // Ya existe del registro

    console.log('Creating area with valid UUID...');

    // Delete old area if exists
    await prisma.area.deleteMany({
      where: { name: 'Soporte Técnico' }
    });

    // Create area with valid UUID v4
    const area = await prisma.area.create({
      data: {
        id: areaId,
        name: 'Soporte Técnico',
        description: 'Área de soporte técnico general',
      },
    });

    console.log('✅ Area created:', area.id);
    console.log('\nNow testing ticket creation...\n');

    // Test ticket creation
    const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzYzk3NDZhYS03NjJhLTRlYmEtYTg5Zi01MGZhZjllMTA3MzgiLCJlbWFpbCI6InRlc3R1c2VyQGV4YW1wbGUuY29tIiwicm9sZSI6IlJFUVVFU1RFUiIsImlhdCI6MTc2MzMzNjQyNCwiZXhwIjoxNzYzNDIyODI0fQ.dDA52jRsAYTGtTQaoo5ejiu8Cbi6A-u0ZeHK_5Bhp8M';

    const payload = {
      title: 'Test Email Notification - Problema con impresora',
      description: 'Este ticket prueba las notificaciones automáticas por email. La impresora del piso 3 no funciona.',
      priority: 'HIGH',
      areaId: areaId,
      requesterId: userId,
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

    console.log('\n✅ Ticket created successfully!');
    console.log('Ticket ID:', response.data.id);
    console.log('Title:', response.data.title);
    console.log('Status:', response.data.status);
    console.log('Priority:', response.data.priority);
    console.log('\n🎉 Check your Mailtrap inbox at: https://mailtrap.io');
    console.log('   You should see an email notification for this ticket!');

  } catch (error: any) {
    if (error.response) {
      console.error('❌ Error creating ticket:');
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('❌ Error:', error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

fixAndTest();
