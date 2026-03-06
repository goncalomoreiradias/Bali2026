"use client";

import { useState } from "react";
import { X, Plus, Save, MapPin } from "lucide-react";
import { DayPlan, Location } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

interface AddLocationSheetProps {
    isOpen: boolean;
    onClose: () => void;
    days: DayPlan[];
    onAdd: (dayId: string, location: Location) => void;
}

export default function AddLocationSheet({ isOpen, onClose, days, onAdd }: AddLocationSheetProps) {
    const [selectedDayId, setSelectedDayId] = useState<string>(days[0]?.id || "");
    const [location, setLocation] = useState<Partial<Location>>({
        name: "",
        description: "",
        mapsUrl: "",
        tag: "",
        lat: -8.409518,
        lng: 115.188919,
        completed: false
    });

    const handleSave = () => {
        if (!selectedDayId || !location.name) {
            alert("Please provide a name and select a day.");
            return;
        }

        onAdd(selectedDayId, {
            ...location,
            id: `loc-new-${Date.now()}`,
        } as Location);

        // Reset form
        setLocation({
            name: "",
            description: "",
            mapsUrl: "",
            tag: "",
            lat: -8.4,
            lng: 115.2,
            completed: false
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm sm:p-4">
                <motion.div
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "100%", opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="bg-white dark:bg-gray-900 w-full max-w-md max-h-[90vh] sm:rounded-2xl rounded-t-3xl shadow-2xl flex flex-col overflow-hidden"
                >
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gradient-to-r from-bali-terra to-[#C06A50] text-white">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <MapPin size={22} /> Add New Activity
                        </h2>
                        <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Form Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Location Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Potato Head Beach Club"
                                value={location.name}
                                onChange={(e) => setLocation({ ...location, name: e.target.value })}
                                className="w-full bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-bali-terra outline-none transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Assign to Day</label>
                            <select
                                value={selectedDayId}
                                onChange={(e) => setSelectedDayId(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-bali-terra outline-none transition-colors"
                            >
                                {days.map(d => (
                                    <option key={d.id} value={d.id}>Day {d.dayNumber} - {d.title}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tag</label>
                                <select
                                    value={location.tag || ""}
                                    onChange={(e) => setLocation({ ...location, tag: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 outline-none"
                                >
                                    <option value="">No Tag</option>
                                    <option value="Must Go">Must Go</option>
                                    <option value="Opcional">Opcional</option>
                                    <option value="Food">Food</option>
                                    <option value="Photo Op">Photo Op</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Maps URL</label>
                                <input
                                    type="text"
                                    placeholder="https://..."
                                    value={location.mapsUrl || ""}
                                    onChange={(e) => setLocation({ ...location, mapsUrl: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Short Description</label>
                            <textarea
                                placeholder="Optional notes or details..."
                                value={location.description || ""}
                                onChange={(e) => setLocation({ ...location, description: e.target.value })}
                                className="w-full bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 outline-none resize-none h-24"
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-5 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
                        <button
                            onClick={handleSave}
                            className="w-full py-4 bg-bali-terra hover:bg-[#C06A50] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            <Plus size={20} />
                            Add Activity
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
