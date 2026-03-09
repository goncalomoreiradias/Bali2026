import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ session: null });
        }

        // Enrich session with the latest plan from DB
        const user = await prisma.user.findUnique({
            where: { id: session.userId as string },
            select: { plan: true }
        });

        return NextResponse.json({
            session: {
                ...session,
                plan: user?.plan || "FREE"
            }
        });
    } catch {
        return NextResponse.json({ session: null });
    }
}
