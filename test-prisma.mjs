import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    const trip = await prisma.trip.findFirst();
    console.log(trip);
  } catch (e) {
    console.error("PRISMA ERROR IS:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
