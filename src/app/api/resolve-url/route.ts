import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/resolve-url
 * Resolves a short Google Maps URL (maps.app.goo.gl/...) by following
 * redirects and returning the final expanded URL.
 */
export async function POST(req: NextRequest) {
    try {
        const { url } = await req.json();

        if (!url || typeof url !== "string") {
            return NextResponse.json({ error: "URL is required" }, { status: 400 });
        }

        // Only resolve short URLs — full URLs don't need resolving
        const isShortUrl = url.includes("goo.gl") || url.includes("maps.app") || url.includes("bit.ly") || url.includes("t.co");
        
        if (!isShortUrl) {
            return NextResponse.json({ resolvedUrl: url });
        }

        // Follow redirects to get the final URL
        const response = await fetch(url, {
            method: "HEAD",
            redirect: "follow",
            headers: {
                "User-Agent": "Mozilla/5.0 (compatible; Viatio/1.0)"
            }
        });

        const resolvedUrl = response.url;

        return NextResponse.json({ resolvedUrl });
    } catch (error: any) {
        console.error("URL resolution failed:", error.message);
        
        // Try a GET request as fallback (some services don't support HEAD)
        try {
            const { url } = await req.clone().json().catch(() => ({ url: "" }));
            if (url) {
                const response = await fetch(url, {
                    method: "GET",
                    redirect: "follow",
                    headers: {
                        "User-Agent": "Mozilla/5.0 (compatible; Viatio/1.0)"
                    }
                });
                return NextResponse.json({ resolvedUrl: response.url });
            }
        } catch {}
        
        return NextResponse.json({ error: "Failed to resolve URL" }, { status: 500 });
    }
}
