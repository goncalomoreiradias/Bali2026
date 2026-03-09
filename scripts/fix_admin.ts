import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const adminEmail = "admin@thinktwice.com";
    const hashedPassword = await hash("admin123", 10);

    await prisma.user.upsert({
        where: { email: adminEmail },
        update: {
            password: hashedPassword
        },
        create: {
            email: adminEmail,
            name: "Super Admin",
            role: "ADMIN",
            plan: "YEARLY",
            password: hashedPassword
        }
    });

    console.log("Admin account password updated and hashed successfully.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
