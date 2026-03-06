"use client";

import { useEffect, useState } from "react";
import { Itinerary, DayPlan } from "@/types";
import DayCard from "@/components/DayCard";
import MapSection from "@/components/MapSection";
import EditItinerarySheet from "@/components/EditItinerarySheet";
import { List, Map as MapIcon, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type ViewMode = "list" | "map";

export default function Home() {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  // Edit State
  const [editingDay, setEditingDay] = useState<DayPlan | null>(null);
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);

  useEffect(() => {
    fetchItinerary();
  }, []);

  const fetchItinerary = async () => {
    try {
      const res = await fetch("/api/itinerary");
      const data = await res.json();
      setItinerary(data);
    } catch (error) {
      console.error("Failed to load itinerary", error);
    } finally {
      setLoading(false);
    }
  };

  const saveItinerary = async (newItinerary: Itinerary) => {
    try {
      setItinerary(newItinerary); // Optimistic UI update
      await fetch("/api/itinerary", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItinerary),
      });
    } catch (error) {
      console.error("Failed to save itinerary", error);
    }
  };

  const handleDayEdit = (updatedDay: DayPlan) => {
    if (!itinerary) return;
    const newDays = itinerary.days.map((d) =>
      d.id === updatedDay.id ? updatedDay : d
    );
    saveItinerary({ ...itinerary, days: newDays });
  };

  const toggleComplete = (dayId: string, locId: string) => {
    if (!itinerary) return;
    const newDays = itinerary.days.map(day => {
      if (day.id === dayId) {
        return {
          ...day,
          locations: day.locations.map(loc =>
            loc.id === locId ? { ...loc, completed: !loc.completed } : loc
          )
        };
      }
      return day;
    });
    saveItinerary({ ...itinerary, days: newDays });
  };

  if (loading || !itinerary) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[--color-bali-sand]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <Loader2 size={40} className="text-[--color-bali-sage]" />
        </motion.div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[--color-bali-sand] relative pb-24 lg:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-black/5 dark:border-white/5 py-4 px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold font-outfit text-[--color-bali-dark] dark:text-white">Bali 🌴</h1>
            <p className="text-xs font-semibold text-[--color-bali-terra] tracking-widest uppercase">15-Day Expedition</p>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto p-4 lg:p-6 lg:h-[calc(100vh-80px)] lg:flex lg:gap-8">

        {/* List View - Always visible on Desktop, toggled on Mobile */}
        <div className={`lg:w-1/2 lg:h-full lg:overflow-y-auto lg:pr-4 ${viewMode === 'list' ? 'block' : 'hidden lg:block'}`}>
          <div className="space-y-6 max-w-2xl mx-auto">
            {itinerary.days.map((day) => (
              <div
                key={day.id}
                onMouseEnter={() => setSelectedDayId(day.id)}
                onMouseLeave={() => setSelectedDayId(null)}
              >
                <DayCard
                  day={day}
                  onEditDay={(d) => setEditingDay(d)}
                  onToggleComplete={toggleComplete}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Map View - Always visible on Desktop, toggled on Mobile */}
        <div className={`lg:w-1/2 lg:h-[calc(100vh-120px)] lg:sticky lg:top-24 mt-4 lg:mt-0 ${viewMode === 'map' ? 'block h-[calc(100vh-200px)]' : 'hidden lg:block'}`}>
          <MapSection days={itinerary.days} selectedDayId={selectedDayId} />
        </div>

      </div>

      {/* Mobile Floating View Toggle */}
      <div className="fixed bottom-6 w-full flex justify-center lg:hidden z-40 pointer-events-none">
        <div className="glass shadow-xl rounded-full p-1 flex gap-1 pointer-events-auto">
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all ${viewMode === "list"
                ? "bg-[--color-bali-ocean] text-white shadow-md scale-105"
                : "text-gray-600 hover:bg-black/5"
              }`}
          >
            <List size={18} /> Itinerary
          </button>
          <button
            onClick={() => setViewMode("map")}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all ${viewMode === "map"
                ? "bg-[--color-bali-ocean] text-white shadow-md scale-105"
                : "text-gray-600 hover:bg-black/5"
              }`}
          >
            <MapIcon size={18} /> Map
          </button>
        </div>
      </div>

      {/* Editing Drawer */}
      {editingDay && (
        <EditItinerarySheet
          day={editingDay}
          isOpen={!!editingDay}
          onClose={() => setEditingDay(null)}
          onSave={handleDayEdit}
        />
      )}
    </main>
  );
}
