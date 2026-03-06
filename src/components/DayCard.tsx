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
            className="glass-card mb-6 overflow-hidden relative"
        >
            <div className="bg-gradient-to-r from-[--color-bali-sage] to-[--color-bali-ocean] p-4 text-white flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold font-inter tracking-tight">
                        Day {day.dayNumber}
                    </h2>
                    <p className="text-sm opacity-90 font-medium">{day.title}</p>
                </div>
                <button
                    onClick={() => onEditDay(day)}
                    className="p-2 rounded-full hover:bg-white/20 transition-colors"
                    aria-label="Edit Day"
                >
                    <Edit2 size={18} />
                </button>
            </div>

            <div className="p-4 space-y-4">
                {day.locations.map((loc, index) => (
                    <motion.div
                        key={loc.id}
                        variants={itemVariants}
                        className="flex items-start gap-4 p-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors group"
                    >
                        <button
                            onClick={() => onToggleComplete(day.id, loc.id)}
                            className={`mt-1 flex-shrink-0 transition-colors ${loc.completed ? 'text-[--color-bali-sage]' : 'text-gray-400 hover:text-[--color-bali-terra]'}`}
                        >
                            <CheckCircle size={20} />
                        </button>

                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h3 className={`font-semibold ${loc.completed ? 'text-gray-500 line-through' : 'text-foreground'}`}>
                                    {loc.name}
                                </h3>
                            </div>
                            {loc.description && (
                                <p className={`text-sm mt-1 ${loc.completed ? 'text-gray-400' : 'text-gray-600 dark:text-gray-300'}`}>
                                    {loc.description}
                                </p>
                            )}
                        </div>

                        <a
                            href={`https://maps.google.com/?q=${loc.lat},${loc.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-400 hover:text-[--color-bali-ocean] dark:hover:text-blue-400 bg-white dark:bg-gray-800 rounded-full shadow-sm hover:shadow-md transition-all active:scale-95 flex-shrink-0"
                            title="Open in Google Maps"
                        >
                            <Navigation size={18} />
                        </a>
                    </motion.div>
                ))}
            </div>

            {/* Visual timeline connector */}
            <div className="absolute left-[31px] top-[95px] bottom-6 w-0.5 bg-gray-200 dark:bg-gray-700 z-[-1]"></div>
        </motion.div>
    );
}
