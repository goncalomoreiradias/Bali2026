import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const trips = await prisma.trip.findMany({
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(trips);
    } catch (error) {
        console.error('Error fetching trips:', error);
        return NextResponse.json({ error: "Failed to fetch trips" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, description, password, participants } = body;

        const newTrip = await prisma.trip.create({
            data: {
                title,
                description,
                password,
                participants: participants || [],
            }
        });

        return NextResponse.json(newTrip, { status: 201 });
    } catch (error) {
        console.error('Error creating trip:', error);
        return NextResponse.json({ error: "Failed to create trip" }, { status: 500 });
    }
}
