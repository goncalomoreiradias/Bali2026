import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Define the file path for our persistent data
const dataFilePath = path.join(process.cwd(), 'src/data/customItinerary.json');
const initialDataFilePath = path.join(process.cwd(), 'src/data/initialItinerary.json');

export async function GET() {
    try {
        let data;
        try {
            // Try to read custom data first
            const fileContents = await fs.readFile(dataFilePath, 'utf8');
            data = JSON.parse(fileContents);
            if (Object.keys(data).length === 0) throw new Error("Empty custom data");
        } catch {
            // Fallback to initial seed data
            const initialContents = await fs.readFile(initialDataFilePath, 'utf8');
            data = JSON.parse(initialContents);
            // Initialize the custom file
            await fs.writeFile(dataFilePath, initialContents, 'utf8');
        }
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error reading itinerary:', error);
        return NextResponse.json({ error: 'Failed to read itinerary' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const data = await request.json();
        await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
        return NextResponse.json({ success: true, message: 'Itinerary saved successfully.' });
    } catch (error) {
        console.error('Error saving itinerary:', error);
        return NextResponse.json({ error: 'Failed to save itinerary' }, { status: 500 });
    }
}
