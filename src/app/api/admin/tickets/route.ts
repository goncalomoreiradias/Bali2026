import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session?.userId || session.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const tickets = await prisma.supportTicket.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        plan: true
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json(tickets, { status: 200 });
    } catch (error) {
        console.error("Failed to retrieve admin tickets:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
