import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import initialData from '@/data/initialItinerary.json';

const KV_ITINERARY_KEY = 'bali_itinerary_2026';

export async function GET() {
  try {
    // Attempt to fetch from KV Database
    let itinerary = await kv.get(KV_ITINERARY_KEY);

    // If database is empty (first run), seed it with our JSON
    if (!itinerary) {
      console.log("No data found in KV Database. Seeding with initialItinerary.json...");
      await kv.set(KV_ITINERARY_KEY, initialData);
      itinerary = initialData;
    }

    return NextResponse.json(itinerary);
  } catch (error) {
    console.error('Error reading from KV Database:', error);
    
    // Fallback securely to initial data if KV fails (e.g. env vars not set locally yet)
    console.warn("Falling back to local initialItinerary.json. Ensure KV_REST_API_URL and KV_REST_API_TOKEN are set.");
    return NextResponse.json(initialData);
  }
}

export async function POST(request: Request) {
  try {
    const newItinerary = await request.json();

    // Save directly to KV Database
    await kv.set(KV_ITINERARY_KEY, newItinerary);

    return NextResponse.json({ success: true, message: 'Itinerary saved to Vercel KV successfully' });
  } catch (error) {
    console.error('Error writing to KV Database:', error);
    return NextResponse.json({ error: 'Failed to save itinerary' }, { status: 500 });
  }
}
