import { PrismaClient, Priority, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Limpiar datos existentes (opcional, comentar si no deseas limpiar)
  // await prisma.auditTrail.deleteMany();
  // await prisma.attachment.deleteMany();
  // await prisma.comment.deleteMany();
  // await prisma.ticket.deleteMany();
  // await prisma.sLA.deleteMany();
  // await prisma.user.deleteMany();
  // await prisma.area.deleteMany();

  // Crear Áreas
  console.log('📁 Creando áreas...');

  const areaIT = await prisma.area.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Sistemas y TI',
      description: 'Área encargada de soporte técnico, infraestructura y sistemas informáticos',
      isActive: true,
    },
  });

  const areaMantenimiento = await prisma.area.upsert({
    where: { id: '00000000-0000-0000-0000-000000000002' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000002',
      name: 'Mantenimiento',
      description: 'Área encargada del mantenimiento de instalaciones y equipos médicos',
      isActive: true,
    },
  });

  const areaRecursosHumanos = await prisma.area.upsert({
    where: { id: '00000000-0000-0000-0000-000000000003' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000003',
      name: 'Recursos Humanos',
      description: 'Área encargada de gestión de personal y recursos humanos',
      isActive: true,
    },
  });

  const areaAdministracion = await prisma.area.upsert({
    where: { id: '00000000-0000-0000-0000-000000000004' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000004',
      name: 'Administración',
      description: 'Área administrativa y financiera',
      isActive: true,
    },
  });

  console.log(`✅ Creadas ${4} áreas`);

  // Crear SLAs para cada área y prioridad
  console.log('⏱️  Creando SLAs...');

  const slas = [
    // Sistemas y TI
    { areaId: areaIT.id, priority: Priority.CRITICAL, responseTimeMinutes: 15, resolutionTimeMinutes: 120 },
    { areaId: areaIT.id, priority: Priority.HIGH, responseTimeMinutes: 30, resolutionTimeMinutes: 240 },
    { areaId: areaIT.id, priority: Priority.MEDIUM, responseTimeMinutes: 60, resolutionTimeMinutes: 480 },
    { areaId: areaIT.id, priority: Priority.LOW, responseTimeMinutes: 120, resolutionTimeMinutes: 1440 },

    // Mantenimiento
    { areaId: areaMantenimiento.id, priority: Priority.CRITICAL, responseTimeMinutes: 30, resolutionTimeMinutes: 180 },
    { areaId: areaMantenimiento.id, priority: Priority.HIGH, responseTimeMinutes: 60, resolutionTimeMinutes: 360 },
    { areaId: areaMantenimiento.id, priority: Priority.MEDIUM, responseTimeMinutes: 120, resolutionTimeMinutes: 720 },
    { areaId: areaMantenimiento.id, priority: Priority.LOW, responseTimeMinutes: 240, resolutionTimeMinutes: 2880 },

    // Recursos Humanos
    { areaId: areaRecursosHumanos.id, priority: Priority.CRITICAL, responseTimeMinutes: 60, resolutionTimeMinutes: 240 },
    { areaId: areaRecursosHumanos.id, priority: Priority.HIGH, responseTimeMinutes: 120, resolutionTimeMinutes: 480 },
    { areaId: areaRecursosHumanos.id, priority: Priority.MEDIUM, responseTimeMinutes: 240, resolutionTimeMinutes: 1440 },
    { areaId: areaRecursosHumanos.id, priority: Priority.LOW, responseTimeMinutes: 480, resolutionTimeMinutes: 2880 },

    // Administración
    { areaId: areaAdministracion.id, priority: Priority.CRITICAL, responseTimeMinutes: 60, resolutionTimeMinutes: 240 },
    { areaId: areaAdministracion.id, priority: Priority.HIGH, responseTimeMinutes: 120, resolutionTimeMinutes: 480 },
    { areaId: areaAdministracion.id, priority: Priority.MEDIUM, responseTimeMinutes: 240, resolutionTimeMinutes: 1440 },
    { areaId: areaAdministracion.id, priority: Priority.LOW, responseTimeMinutes: 480, resolutionTimeMinutes: 2880 },
  ];

  for (const sla of slas) {
    await prisma.sLA.upsert({
      where: {
        areaId_priority: {
          areaId: sla.areaId,
          priority: sla.priority,
        },
      },
      update: {},
      create: sla,
    });
  }

  console.log(`✅ Creados ${slas.length} SLAs`);

  // Crear Usuarios
  console.log('👥 Creando usuarios...');

  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Usuario Administrador
  await prisma.user.upsert({
    where: { email: 'admin@hospital.com' },
    update: {},
    create: {
      name: 'Administrador del Sistema',
      email: 'admin@hospital.com',
      phone: '+57 300 111 1111',
      role: Role.ADMIN,
      passwordHash: hashedPassword,
      isActive: true,
      areaId: areaIT.id,
    },
  });

  // Usuario Agente de IT
  await prisma.user.upsert({
    where: { email: 'agente.it@hospital.com' },
    update: {},
    create: {
      name: 'Agente de Sistemas',
      email: 'agente.it@hospital.com',
      phone: '+57 300 222 2222',
      role: Role.AGENT,
      passwordHash: hashedPassword,
      isActive: true,
      areaId: areaIT.id,
    },
  });

  // Usuario Técnico
  await prisma.user.upsert({
    where: { email: 'tecnico@hospital.com' },
    update: {},
    create: {
      name: 'Técnico de Soporte',
      email: 'tecnico@hospital.com',
      phone: '+57 300 333 3333',
      role: Role.TECH,
      passwordHash: hashedPassword,
      isActive: true,
      areaId: areaIT.id,
    },
  });

  // Usuario Solicitante
  await prisma.user.upsert({
    where: { email: 'usuario@hospital.com' },
    update: {},
    create: {
      name: 'Usuario de Prueba',
      email: 'usuario@hospital.com',
      phone: '+57 300 444 4444',
      role: Role.REQUESTER,
      passwordHash: hashedPassword,
      isActive: true,
    },
  });

  console.log(`✅ Creados ${4} usuarios`);

  console.log('\n🎉 Seed completado exitosamente!\n');
  console.log('📋 Usuarios creados:');
  console.log('┌─────────────────────────────────────────────────────────┐');
  console.log('│ Email                    │ Contraseña │ Rol            │');
  console.log('├─────────────────────────────────────────────────────────┤');
  console.log('│ admin@hospital.com       │ admin123   │ ADMIN          │');
  console.log('│ agente.it@hospital.com   │ admin123   │ AGENT          │');
  console.log('│ tecnico@hospital.com     │ admin123   │ TECH           │');
  console.log('│ usuario@hospital.com     │ admin123   │ REQUESTER      │');
  console.log('└─────────────────────────────────────────────────────────┘');
  console.log('\n📁 Áreas creadas:');
  console.log('  • Sistemas y TI');
  console.log('  • Mantenimiento');
  console.log('  • Recursos Humanos');
  console.log('  • Administración');
  console.log('\n⏱️  SLAs configurados: 16 (4 áreas x 4 prioridades)');
  console.log('\n🚀 ¡Ya puedes iniciar sesión en el sistema!\n');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
