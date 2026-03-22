import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { getSession } from "@/lib/auth";

export async function PATCH(req: NextRequest, context: any) {
    try {
        const session = await getSession();
        if (!session?.userId || session.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }
        
        // Wait for the params object to resolve 
        const params = await context.params;
        const id = params.id;

        const body = await req.json();
        const { status } = body;

        if (!status) {
            return NextResponse.json({ error: "Status is required" }, { status: 400 });
        }

        const ticket = await prisma.supportTicket.update({
            where: { id },
            data: { status }
        });

        return NextResponse.json(ticket, { status: 200 });
    } catch (error) {
        console.error("Failed to update ticket status:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
