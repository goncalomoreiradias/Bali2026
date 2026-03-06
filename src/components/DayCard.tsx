"use client";

import { motion } from "framer-motion";
import { DayPlan, Location } from "@/types";
import { MapPin, Navigation, Edit2, CheckCircle } from "lucide-react";

interface DayCardProps {
    day: DayPlan;
    onEditDay: (day: DayPlan) => void;
    onToggleComplete: (dayId: string, locId: string) => void;
}

export default function DayCard({ day, onEditDay, onToggleComplete }: DayCardProps) {
    // Animation variants
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
    };

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="glass-card mb-8 overflow-hidden relative shadow-xl hover:shadow-2xl transition-shadow border border-white/40 dark:border-white/10"
        >
            <div className="bg-gradient-to-r from-bali-sage to-bali-ocean p-5 text-white flex justify-between items-center z-10 relative">
                <div>
                    <h2 className="text-2xl font-bold font-inter tracking-tight flex items-center gap-2">
                        Day {day.dayNumber}
                    </h2>
                    <p className="text-sm opacity-90 font-medium mt-1">{day.title}</p>
                </div>
                <button
                    onClick={(e) => { e.stopPropagation(); onEditDay(day); }}
                    className="p-3 rounded-full hover:bg-white/20 transition-colors backdrop-blur-md bg-white/10"
                    aria-label="Edit Day"
                >
                    <Edit2 size={18} />
                </button>
            </div>

            <div className="p-5 space-y-6 relative z-10">
                {day.locations.map((loc, index) => (
                    <motion.div
                        key={loc.id}
                        variants={itemVariants}
                        onClick={() => onEditDay(day)}
                        className="flex items-start gap-4 p-4 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors group cursor-pointer border border-transparent hover:border-black/5 dark:hover:border-white/10"
                    >
                        <button
                            onClick={(e) => { e.stopPropagation(); onToggleComplete(day.id, loc.id); }}
                            className={`mt-1 flex-shrink-0 transition-colors z-20 relative bg-white dark:bg-gray-900 rounded-full pb-0.5 ${loc.completed ? 'text-bali-sage' : 'text-gray-300 hover:text-bali-terra'}`}
                        >
                            <CheckCircle size={24} className="bg-white dark:bg-gray-900 rounded-full" />
                        </button>

                        <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h3 className={`font-semibold text-lg ${loc.completed ? 'text-gray-500 line-through' : 'text-foreground group-hover:text-bali-ocean transition-colors'}`}>
                                    {loc.name}
                                </h3>
                                {loc.tag && (
                                    <span className="px-2.5 py-1 bg-bali-terra/10 text-bali-terra text-[10px] uppercase font-bold tracking-wider rounded-md border border-bali-terra/20">
                                        {loc.tag}
                                    </span>
                                )}
                            </div>
                            {loc.description && (
                                <p className={`text-sm mt-1 ${loc.completed ? 'text-gray-400' : 'text-gray-600 dark:text-gray-300'}`}>
                                    {loc.description}
                                </p>
                            )}
                        </div>

                        <a
                            href={loc.mapsUrl || `https://maps.google.com/?q=${encodeURIComponent(loc.name + " Bali")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-3 text-gray-400 hover:text-bali-ocean dark:hover:text-blue-400 bg-white dark:bg-gray-800 rounded-full shadow-md hover:shadow-lg transition-all active:scale-95 flex-shrink-0 border border-gray-100 dark:border-gray-700 z-20"
                            title="Open in Google Maps"
                        >
                            <Navigation size={20} />
                        </a>
                    </motion.div>
                ))}
            </div>

            {/* Visual timeline connector - Fixed positioning to eliminate gap */}
            <div className="absolute left-[39px] top-[80px] bottom-[30px] w-[2px] bg-gray-200 dark:bg-gray-700 z-[5]"></div>
        </motion.div>
    );
}
