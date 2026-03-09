import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/auth";
import { GoogleGenAI } from "@google/genai";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        // 1. Auth & Plan Check
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Please log in first." }, { status: 401 });
        }

        // Check user plan from DB (session might be stale)
        const user = await prisma.user.findUnique({
            where: { id: session.userId as string },
            select: { plan: true }
        });

        if (!user || user.plan === "FREE") {
            return NextResponse.json(
                { error: "Upgrade your plan to use AI Trip Planning.", requiresUpgrade: true },
                { status: 403 }
            );
        }

        // 2. Parse request
        const body = await request.json();
        const { destination, startDate, endDate, budget, travelStyle, numberOfPeople } = body;

        if (!destination || !startDate || !endDate) {
            return NextResponse.json({ error: "Destination, start date, and end date are required." }, { status: 400 });
        }

        // Calculate number of days
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const numberOfDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        if (numberOfDays < 1 || numberOfDays > 30) {
            return NextResponse.json({ error: "Trip must be between 1 and 30 days." }, { status: 400 });
        }

        // 3. Call Gemini AI
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "AI service is not configured." }, { status: 500 });
        }

        const ai = new GoogleGenAI({ apiKey });

        const prompt = `You are a world-class travel planner. Create a detailed ${numberOfDays}-day travel itinerary for ${destination}.

Context:
- Travel dates: ${startDate} to ${endDate}
- Budget per person: ${budget ? `€${budget}` : "flexible"}
- Travel style: ${travelStyle || "balanced"}
- Number of travelers: ${numberOfPeople || 2}

Return ONLY a valid JSON object (no markdown, no code blocks, no extra text) with this exact structure:
{
  "title": "A catchy trip title (e.g. 'Bali Cultural Adventure')",
  "description": "A 1-2 sentence trip description",
  "days": [
    {
      "dayNumber": 1,
      "title": "Day theme title (e.g. 'Arrival & Ubud Exploration')",
      "locations": [
        {
          "name": "Location Name",
          "description": "What to do here and why it's special (2-3 sentences)",
          "lat": -8.5069,
          "lng": 115.2625,
          "tag": "culture|nature|food|adventure|relaxation|nightlife|shopping",
          "mapsUrl": "https://maps.google.com/?q=lat,lng"
        }
      ]
    }
  ]
}

Requirements:
- Include 3-5 locations per day
- Use real, accurate GPS coordinates
- Include a mix of activities matching the travel style
- Provide real Google Maps URLs
- Make day titles descriptive and engaging
- Tags must be one of: culture, nature, food, adventure, relaxation, nightlife, shopping`;

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
        });

        // 4. Parse AI response
        let itineraryData;
        try {
            let rawText = response.text || "";
            // Strip markdown code fences if present
            rawText = rawText.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();
            itineraryData = JSON.parse(rawText);
        } catch (parseError) {
            console.error("Failed to parse AI response:", response.text);
            return NextResponse.json({ error: "AI generated an invalid response. Please try again." }, { status: 500 });
        }

        // 5. Save to database
        const trip = await prisma.trip.create({
            data: {
                title: itineraryData.title || `${destination} Trip`,
                description: itineraryData.description || `AI-planned trip to ${destination}`,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                ownerId: session.userId as string,
                days: {
                    create: (itineraryData.days || []).map((day: any) => ({
                        dayNumber: day.dayNumber,
                        title: day.title || `Day ${day.dayNumber}`,
                        locations: {
                            create: (day.locations || []).map((loc: any) => ({
                                name: loc.name || "Unknown Location",
                                description: loc.description || "",
                                lat: loc.lat || 0,
                                lng: loc.lng || 0,
                                tag: loc.tag || null,
                                mapsUrl: loc.mapsUrl || null,
                            }))
                        }
                    }))
                }
            },
            include: {
                days: { include: { locations: true } }
            }
        });

        return NextResponse.json({ tripId: trip.id, title: trip.title });

    } catch (error: any) {
        console.error("AI Plan Trip error:", error);
        return NextResponse.json(
            { error: error?.message || "Failed to generate trip plan." },
            { status: 500 }
        );
    }
}
