const axios = require('axios');

const API_URL = 'http://localhost:3000/api/v1';

async function createAreas() {
  console.log('🏥 Creando áreas de ejemplo...\n');

  // Primero necesitamos registrar un usuario admin
  const registerData = {
    name: 'Administrador',
    email: `admin${Date.now()}@hospital.com`,
    password: 'admin123',
    role: 'ADMIN'
  };

  try {
    // 1. Registrar usuario admin
    console.log('1️⃣  Registrando usuario administrador...');
    const registerResponse = await axios.post(`${API_URL}/auth/register`, registerData);
    const token = registerResponse.data.token;
    console.log('✅ Usuario administrador creado');
    console.log(`   Email: ${registerData.email}`);
    console.log(`   Password: ${registerData.password}\n`);

    // 2. Crear áreas
    const areas = [
      {
        name: 'Urgencias',
        description: 'Área de atención de emergencias',
        isActive: true
      },
      {
        name: 'Quirófano',
        description: 'Área de cirugías y procedimientos',
        isActive: true
      },
      {
        name: 'Laboratorio',
        description: 'Área de análisis y pruebas',
        isActive: true
      },
      {
        name: 'Farmacia',
        description: 'Área de medicamentos',
        isActive: true
      },
      {
        name: 'Sistemas (TI)',
        description: 'Área de tecnología e informática',
        isActive: true
      },
      {
        name: 'Recursos Humanos',
        description: 'Área administrativa de personal',
        isActive: true
      },
      {
        name: 'Mantenimiento',
        description: 'Área de mantenimiento de instalaciones',
        isActive: true
      }
    ];

    console.log('2️⃣  Creando áreas...');
    const api = axios.create({
      baseURL: API_URL,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    for (const area of areas) {
      try {
        await api.post('/areas', area);
        console.log(`   ✅ ${area.name}`);
      } catch (error) {
        console.log(`   ❌ ${area.name} - ${error.response?.data?.message || error.message}`);
      }
    }

    console.log('\n✅ ¡Áreas creadas exitosamente!');
    console.log('\n📋 Resumen:');
    console.log(`   - ${areas.length} áreas creadas`);
    console.log(`   - Usuario admin: ${registerData.email}`);
    console.log(`   - Password: ${registerData.password}`);
    console.log('\n💡 Ahora puedes crear tickets y asignarlos a estas áreas.');

  } catch (error) {
    console.error('\n❌ Error:', error.response?.data || error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Asegúrate de que el backend esté corriendo: npm run dev');
    }
  }
}

createAreas();
