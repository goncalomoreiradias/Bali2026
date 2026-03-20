import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/auth";

const prisma = new PrismaClient();

// GET: Return all bucket list items for this trip
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id: tripId } = await params;

        const items = await prisma.bucketListItem.findMany({
            where: { tripId },
            orderBy: { createdAt: "asc" },
        });

        return NextResponse.json(items);
    } catch (error) {
        console.error("Error fetching bucket list:", error);
        return NextResponse.json({ error: "Failed to fetch bucket list" }, { status: 500 });
    }
}

// POST: Sync bucket list items by fetching URLs and using AI to extract places
export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id: tripId } = await params;

        // Get trip with its bucket list URLs
        const trip = await prisma.trip.findUnique({
            where: { id: tripId },
            select: { bucketListUrls: true, ownerId: true },
        });

        if (!trip) {
            return NextResponse.json({ error: "Trip not found" }, { status: 404 });
        }

        if (!trip.bucketListUrls || trip.bucketListUrls.length === 0) {
            return NextResponse.json({ error: "No bucket list URLs configured" }, { status: 400 });
        }

        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "AI service not configured" }, { status: 500 });
        }

        // 1. Fetch the content of each URL
        const allExtractedItems: Array<{
            name: string;
            lat: number;
            lng: number;
            category: string;
            address: string;
            mapsUrl: string;
            sourceUrl: string;
        }> = [];

        for (const url of trip.bucketListUrls) {
            try {
                // 1. Fetch the content of each URL
                let resolvedUrl = url;
                try {
                    const resolveRes = await fetch(`${getBaseUrl(request)}/api/resolve-url`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ url })
                    });
                    if (resolveRes.ok) {
                        const data = await resolveRes.json();
                        resolvedUrl = data.resolvedUrl || url;
                    }
                } catch (e) { 
                    console.error("Resolve error:", e);
                }

                // Fetch the page HTML
                const pageRes = await fetch(resolvedUrl, {
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                        "Accept-Language": "pt-PT,pt;q=0.9,en;q=0.8",
                        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
                    },
                });

                if (!pageRes.ok) {
                    console.error(`Failed to fetch URL: ${resolvedUrl} (${pageRes.status})`);
                    continue;
                }

                const html = await pageRes.text();
                
                // Truncate HTML smartly. 
                // Google Maps data is often in window.APP_INITIALIZATION_STATE or similar inside script tags.
                // We remove style/svg but keep large inline scripts that might contain data.
                const cleanedHtml = html
                    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
                    .replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, "")
                    .replace(/<link[^>]*>/gi, "")
                    .replace(/<path[^>]*>/gi, "")
                    .replace(/<meta[^>]*>/gi, "")
                    // We remove external scripts but keep inline ones as they often contain the list data
                    .replace(/<script[^>]*src=[^>]*>[\s\S]*?<\/script>/gi, "")
                    .replace(/\s+/g, " ")
                    .substring(0, 50000); 

                // 2. Use AI to extract places from the HTML
                const prompt = `Analisa o seguinte conteúdo HTML de uma página Google Maps que contém uma lista de locais guardados. 
Extrai TODOS os locais/pontos de interesse mencionados na página.

Para cada local extraído, devolve:
- name: nome do local
- lat: latitude (se disponível, senão 0)
- lng: longitude (se disponível, senão 0)  
- category: categoria (Restaurante, Café, Hotel, Templo, Praia, Bar, Museu, Natureza, Loja, etc.)
- address: morada ou localização

IMPORTANTE: Extrai o MÁXIMO de locais possíveis. Não ignores nenhum.
Se encontrares coordenadas no HTML (em URLs, data attributes, etc.), usa-as.

Devolve APENAS um JSON válido no formato:
{ "places": [ { "name": "...", "lat": 0.0, "lng": 0.0, "category": "...", "address": "..." } ] }

Se não conseguires encontrar locais, devolve: { "places": [] }

HTML:
${cleanedHtml}`;

                const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${apiKey}`,
                        "HTTP-Referer": "https://viatio.app",
                        "X-Title": "Viatio Bucket List Extractor",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        model: "google/gemini-2.0-flash-001",
                        messages: [{ role: "user", content: prompt }],
                        response_format: { type: "json_object" },
                        max_tokens: 4096,
                        temperature: 0.3,
                    }),
                });

                if (!aiRes.ok) {
                    const errData = await aiRes.json();
                    console.error("AI extraction error:", errData);
                    continue;
                }

                const aiResult = await aiRes.json();
                const content = aiResult.choices?.[0]?.message?.content;

                if (!content) continue;

                let parsed;
                try {
                    parsed = JSON.parse(content.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim());
                } catch {
                    console.error("Failed to parse AI response for URL:", url);
                    continue;
                }

                if (parsed.places && Array.isArray(parsed.places)) {
                    for (const place of parsed.places) {
                        if (place.name) {
                            allExtractedItems.push({
                                name: place.name,
                                lat: parseFloat(place.lat) || 0,
                                lng: parseFloat(place.lng) || 0,
                                category: place.category || null,
                                address: place.address || null,
                                mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + (place.address ? " " + place.address : ""))}`,
                                sourceUrl: url,
                            });
                        }
                    }
                }

                // Track AI usage
                const usage = aiResult.usage;
                if (usage) {
                    await prisma.aiUsage.create({
                        data: {
                            userId: session.userId as string,
                            tripId,
                            model: aiResult.model || "google/gemini-2.0-flash-001",
                            promptTokens: usage.prompt_tokens || 0,
                            completionTokens: usage.completion_tokens || 0,
                            totalTokens: usage.total_tokens || 0,
                            estimatedCost: ((usage.prompt_tokens || 0) * 0.0000001) + ((usage.completion_tokens || 0) * 0.0000004),
                        },
                    });
                }
            } catch (urlError) {
                console.error(`Error processing URL ${url}:`, urlError);
                continue;
            }
        }

        // 3. Sync: Delete old items and insert new ones (atomic)
        await prisma.$transaction(async (tx) => {
            // Delete all existing items for this trip
            await tx.bucketListItem.deleteMany({ where: { tripId } });

            // Insert all newly extracted items
            if (allExtractedItems.length > 0) {
                await tx.bucketListItem.createMany({
                    data: allExtractedItems.map((item) => ({
                        tripId,
                        name: item.name,
                        lat: item.lat,
                        lng: item.lng,
                        category: item.category,
                        address: item.address,
                        mapsUrl: item.mapsUrl,
                        sourceUrl: item.sourceUrl,
                    })),
                });
            }
        });

        // 4. Return updated items
        const updatedItems = await prisma.bucketListItem.findMany({
            where: { tripId },
            orderBy: { createdAt: "asc" },
        });

        return NextResponse.json({
            items: updatedItems,
            count: updatedItems.length,
            message: `Encontrados ${updatedItems.length} locais nas tuas listas.`,
        });
    } catch (error) {
        console.error("Error syncing bucket list:", error);
        return NextResponse.json({ error: "Failed to sync bucket list" }, { status: 500 });
    }
}

// Helper to get base URL from request
function getBaseUrl(request: Request): string {
    const url = new URL(request.url);
    return `${url.protocol}//${url.host}`;
}
