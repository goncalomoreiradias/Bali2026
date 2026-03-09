"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, MapPin, Calendar, Wallet, Users, Compass, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface AIPlannerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const travelStyles = [
    { value: "adventure", label: "🏔️ Aventura", labelEn: "🏔️ Adventure" },
    { value: "relaxation", label: "🌴 Relaxamento", labelEn: "🌴 Relaxation" },
    { value: "culture", label: "🏛️ Cultura", labelEn: "🏛️ Culture" },
    { value: "foodie", label: "🍜 Gastronomia", labelEn: "🍜 Foodie" },
    { value: "party", label: "🎉 Festa", labelEn: "🎉 Party" },
    { value: "balanced", label: "⚖️ Equilibrado", labelEn: "⚖️ Balanced" },
];

export default function AIPlannerModal({ isOpen, onClose }: AIPlannerModalProps) {
    const router = useRouter();
    const [destination, setDestination] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [budget, setBudget] = useState("");
    const [travelStyle, setTravelStyle] = useState("balanced");
    const [numberOfPeople, setNumberOfPeople] = useState(2);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [phase, setPhase] = useState<"form" | "generating">("form");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        setPhase("generating");

        try {
            const res = await fetch("/api/ai/plan-trip", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    destination,
                    startDate,
                    endDate,
                    budget: budget ? parseFloat(budget) : undefined,
                    travelStyle,
                    numberOfPeople,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to generate trip");
            }

            // Success — redirect to the new trip
            onClose();
            router.push(`/trips/${data.tripId}`);
        } catch (err: any) {
            setError(err.message || "Something went wrong. Please try again.");
            setPhase("form");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
                onClick={(e) => { if (e.target === e.currentTarget && !loading) onClose(); }}
            >
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, y: 100, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 100, scale: 0.95 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="relative w-full max-w-lg mx-4 sm:mx-0 bg-white dark:bg-gray-900 rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl max-h-[90vh] overflow-y-auto"
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-gradient-to-r from-brand-primary to-brand-secondary p-6 rounded-t-[2rem] z-10">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="absolute top-4 right-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition text-white disabled:opacity-50"
                        >
                            <X size={20} />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                                <Sparkles className="text-white" size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-extrabold text-white font-outfit">AI Trip Planner</h2>
                                <p className="text-white/80 text-sm">Powered by Google Gemini</p>
                            </div>
                        </div>
                    </div>

                    {phase === "generating" ? (
                        <div className="p-8 flex flex-col items-center justify-center min-h-[300px] text-center">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            >
                                <Sparkles size={48} className="text-brand-primary mb-6" />
                            </motion.div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                                A criar o teu itinerário...
                            </h3>
                            <p className="text-gray-500 text-sm max-w-xs">
                                A inteligência artificial está a pesquisar os melhores locais, restaurantes e experiências para ti. Aguarda uns segundos...
                            </p>
                            <div className="mt-6 w-full max-w-xs">
                                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full"
                                        initial={{ width: "0%" }}
                                        animate={{ width: "90%" }}
                                        transition={{ duration: 15, ease: "easeOut" }}
                                    />
                                </div>
                            </div>
                            {error && (
                                <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm font-bold rounded-xl">
                                    {error}
                                </div>
                            )}
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {error && (
                                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm font-bold rounded-xl text-center">
                                    {error}
                                </div>
                            )}

                            {/* Destination */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    <MapPin size={16} className="text-brand-primary" /> Destino
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Bali, Indonesia"
                                    required
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 rounded-xl px-4 py-3 outline-none font-medium transition-all"
                                />
                            </div>

                            {/* Date Range */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        <Calendar size={16} className="text-brand-primary" /> Início
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 rounded-xl px-4 py-3 outline-none font-medium transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        <Calendar size={16} className="text-brand-secondary" /> Fim
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 rounded-xl px-4 py-3 outline-none font-medium transition-all"
                                    />
                                </div>
                            </div>

                            {/* Budget & People */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        <Wallet size={16} className="text-brand-accent" /> Orçamento €
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="Ex: 1500"
                                        value={budget}
                                        onChange={(e) => setBudget(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 rounded-xl px-4 py-3 outline-none font-medium transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        <Users size={16} className="text-brand-primary" /> Pessoas
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="20"
                                        value={numberOfPeople}
                                        onChange={(e) => setNumberOfPeople(parseInt(e.target.value) || 2)}
                                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 rounded-xl px-4 py-3 outline-none font-medium transition-all"
                                    />
                                </div>
                            </div>

                            {/* Travel Style */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                    <Compass size={16} className="text-brand-secondary" /> Estilo de Viagem
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {travelStyles.map((style) => (
                                        <button
                                            key={style.value}
                                            type="button"
                                            onClick={() => setTravelStyle(style.value)}
                                            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${travelStyle === style.value
                                                ? "bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/30"
                                                : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-brand-primary/50"
                                                }`}
                                        >
                                            {style.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading || !destination || !startDate || !endDate}
                                className="w-full py-4 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 hover:shadow-xl hover:shadow-brand-primary/30 active:scale-[0.98]"
                            >
                                <Sparkles size={20} />
                                Gerar Itinerário com AI
                            </button>
                        </form>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
