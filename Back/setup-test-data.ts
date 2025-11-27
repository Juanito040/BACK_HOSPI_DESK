import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Creating test area...');

  const area = await prisma.area.upsert({
    where: { id: '11111111-1111-1111-1111-111111111111' },
    update: {},
    create: {
      id: '11111111-1111-1111-1111-111111111111',
      name: 'Soporte Técnico',
      description: 'Área de soporte técnico general',
    },
  });

  console.log('Area created:', area);
  console.log('\nNow you can create a ticket with:');
  console.log('areaId: 11111111-1111-1111-1111-111111111111');
  console.log('requesterId: 3c9746aa-762a-4eba-a89f-50faf9e10738');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
