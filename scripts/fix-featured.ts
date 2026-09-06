import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.pandal.count({
    where: { isFeatured: true }
  });
  console.log('Featured pandals count:', count);

  if (count === 0) {
    console.log('No featured pandals found. Setting 6 random pandals to featured...');
    const pandals = await prisma.pandal.findMany({ take: 6 });
    for (const p of pandals) {
      await prisma.pandal.update({
        where: { id: p.id },
        data: { isFeatured: true }
      });
    }
    console.log('Fixed!');
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
