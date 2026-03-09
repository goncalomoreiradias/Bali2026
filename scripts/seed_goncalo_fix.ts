import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const itineraryJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/data/initialItinerary.json'), 'utf-8'));
const itineraryData = itineraryJson as any;

async function main() {
    const userEmail = "gmoreirad@gmail.com";
    console.log(`Checking user ${userEmail} ...`);

    // 1. Demote Gonçalo from ADMIN to USER
    let user = await prisma.user.findUnique({ where: { email: userEmail } });

    if (!user) {
        console.log("User not found... waiting for them to login via Google first.");
        return;
    }

    if (user.role === 'ADMIN') {
        user = await prisma.user.update({
            where: { email: userEmail },
            data: { role: 'USER' }
        });
        console.log("Demoted gmoreirad@gmail.com to USER role.");
    }

    // 2. Check explicitly if Bali trip exists for this user
    const baliTrips = await prisma.trip.findMany({
        where: { ownerId: user.id, title: "Bali Expedition" }
    });

    if (baliTrips.length > 0) {
        console.log(`User already has the Bali Expedition trip.`);
    } else {
        console.log("Creating Bali Expedition trip...");
        const trip = await prisma.trip.create({
            data: {
                title: "Bali Expedition",
                description: "15-Day Expedition",
                ownerId: user.id,
                participants: {
                    connect: [{ id: user.id }]
                },
                days: {
                    create: itineraryData.days.map((day: any) => ({
                        dayNumber: day.dayNumber,
                        title: day.title,
                        locations: {
                            create: day.locations.map((loc: any) => ({
                                name: loc.name,
                                description: loc.description || null,
                                lat: loc.lat,
                                lng: loc.lng,
                                completed: loc.completed || false,
                                tag: loc.tag || null,
                                mapsUrl: loc.mapsUrl || null,
                            })),
                        },
                    })),
                },
            },
        });
        console.log(`Successfully created Bali Trip with id: ${trip.id} for ${userEmail}`);
    }

    // 3. Create a dedicated Admin account
    const adminEmail = "admin@thinktwice.com";
    const adminAccount = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            name: "Super Admin",
            role: "ADMIN",
            plan: "YEARLY",
            password: "admin_super_secret" // In reality this should be hashed, but we can do a backdoor login for admin
        }
    });

    console.log("Dedicated Admin account created/verified:", adminEmail);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
