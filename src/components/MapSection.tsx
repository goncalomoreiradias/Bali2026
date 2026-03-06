"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { DayPlan } from "@/types";

// Dynamically import react-leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false });

interface MapSectionProps {
    days: DayPlan[];
    selectedDayId?: string | null;
}

export default function MapSection({ days, selectedDayId }: MapSectionProps) {
    const [L, setL] = useState<any>(null);

    useEffect(() => {
        // Only import Leaflet on the client side
        import("leaflet").then(leaflet => {
            // Fix default icon issue with webpack/nextjs
            delete (leaflet.Icon.Default.prototype as any)._getIconUrl;

            leaflet.Icon.Default.mergeOptions({
                iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
                iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            });

            setL(leaflet);
        });
    }, []);

    if (!L) {
        return (
            <div className="w-full h-[300px] md:h-full bg-gray-100 dark:bg-gray-800 animate-pulse flex items-center justify-center rounded-xl">
                <span className="text-gray-400">Loading map...</span>
            </div>
        );
    }

    // Get locations for the selected day, or all locations if none selected
    const locationsToRender = selectedDayId
        ? days.find(d => d.id === selectedDayId)?.locations || []
        : days.flatMap(d => d.locations);

    // Default to Bali center
    const centerLat = locationsToRender.length > 0 ? locationsToRender[0].lat : -8.409518;
    const centerLng = locationsToRender.length > 0 ? locationsToRender[0].lng : 115.188919;

    return (
        <div className="w-full h-full min-h-[400px] rounded-xl overflow-hidden glass-card shadow-lg z-0 relative border border-white/20">
            <MapContainer
                center={[centerLat, centerLng] as [number, number]}
                zoom={selectedDayId ? 11 : 10}
                style={{ height: "100%", width: "100%", zIndex: 1 }}
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                {locationsToRender.map((loc) => (
                    <Marker key={loc.id} position={[loc.lat, loc.lng]}>
                        <Popup className="font-sans">
                            <div className="p-1">
                                <h4 className="font-bold text-[--color-bali-ocean] m-0 mb-1">{loc.name}</h4>
                                <p className="text-xs text-gray-600 m-0">{loc.description}</p>
                                <a
                                    href={`https://maps.google.com/?q=${loc.lat},${loc.lng}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-2 inline-block text-xs font-semibold text-[--color-bali-terra] hover:underline"
                                >
                                    Open in Maps
                                </a>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Premium overlay gradient to brand the map */}
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] z-10" />
        </div>
    );
}
