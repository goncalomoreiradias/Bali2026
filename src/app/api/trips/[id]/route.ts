import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Fetch a specific trip by ID
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> } // In Next.js 15, params is a Promise
) {
    try {
        const { id } = await params;

        const trip = await prisma.trip.findUnique({
            where: { id },
            include: {
                days: {
                    include: {
                        locations: {
                            orderBy: { createdAt: 'asc' }
                        }
                    },
                    orderBy: { dayNumber: 'asc' }
                },
                expenses: {
                    orderBy: { createdAt: 'asc' }
                }
            }
        });

        if (!trip) {
            return NextResponse.json({ error: "Trip not found." }, { status: 404 });
        }

        return NextResponse.json(trip);
    } catch (error) {
        console.error('Error reading trip from Database:', error);
        return NextResponse.json({ error: "Database Connection Error" }, { status: 500 });
    }
}

// Update a specific trip
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: tripId } = await params;
        const newItinerary = await request.json();

        // Use a transaction to safely swap out days and expenses
        await prisma.$transaction(async (tx) => {
            // Delete old relations for this trip
            await tx.dayPlan.deleteMany({ where: { tripId } });
            await tx.expense.deleteMany({ where: { tripId } });

            // Create new relations
            await tx.trip.update({
                where: { id: tripId },
                data: {
                    title: newItinerary.title,
                    participants: newItinerary.participants || [],
                    days: {
                        create: (newItinerary.days || []).map((day: any) => ({
                            id: day.id,
                            dayNumber: day.dayNumber,
                            title: day.title,
                            locations: {
                                create: (day.locations || []).map((loc: any) => ({
                                    id: loc.id,
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
                    expenses: {
                        create: (newItinerary.expenses || []).map((exp: any) => ({
                            id: exp.id,
                            amount: exp.amount,
                            description: exp.description,
                            paidBy: exp.paidBy,
                            date: new Date(exp.date),
                            category: exp.category || null,
                        })),
                    },
                },
            });
        });

        return NextResponse.json({ success: true, message: 'Trip updated successfully' });
    } catch (error) {
        console.error('Error updating trip in Database:', error);
        return NextResponse.json({ error: 'Failed to update trip' }, { status: 500 });
    }
}

// Delete a specific trip
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await prisma.trip.delete({
            where: { id }
        });

        return NextResponse.json({ success: true, message: 'Trip deleted successfully' });
    } catch (error) {
        console.error('Error deleting trip:', error);
        return NextResponse.json({ error: "Failed to delete trip" }, { status: 500 });
    }
}
