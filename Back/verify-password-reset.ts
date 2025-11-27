import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verify() {
  console.log('Verificando campos de password reset en la base de datos...\n');

  try {
    // Intentar obtener un usuario con los campos de password reset
    const user = await prisma.user.findFirst({
      select: {
        id: true,
        email: true,
        passwordResetToken: true,
        passwordResetExpires: true,
      },
    });

    if (user) {
      console.log('✅ Los campos de password reset existen en la base de datos!');
      console.log('\nEjemplo de usuario:');
      console.log('- ID:', user.id);
      console.log('- Email:', user.email);
      console.log('- Password Reset Token:', user.passwordResetToken || '(null)');
      console.log('- Password Reset Expires:', user.passwordResetExpires || '(null)');
    } else {
      console.log('No hay usuarios en la base de datos todavía.');
    }

    console.log('\n✅ PASO 3 COMPLETADO: Migración de password reset verificada exitosamente!');

  } catch (error: any) {
    console.error('❌ Error al verificar:', error.message);
    console.log('\nSi ves un error sobre columnas que no existen, necesitas ejecutar la migración.');
  } finally {
    await prisma.$disconnect();
  }
}

verify();
