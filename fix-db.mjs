import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    const result = await prisma.$executeRawUnsafe(`UPDATE "Trip" SET participants = '{}' WHERE participants IS NULL;`);
    console.log("Updated rows:", result);
    
    // Also create a test trip just to be sure Prisma can read
    const trip = await prisma.trip.findFirst();
    console.log("First trip fetched successfully:", trip?.title);
  } catch (e) {
    console.error("PRISMA ERROR IS:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
