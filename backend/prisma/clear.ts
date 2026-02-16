import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.comment.deleteMany();
  await prisma.suggestion.deleteMany();
  await prisma.billStar.deleteMany();
  await prisma.bill.deleteMany();
  await prisma.badge.deleteMany();
  console.log('Cleared all data');
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
