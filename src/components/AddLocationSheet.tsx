"use client";

import { useState } from "react";
import { X, Plus, MapPin, List, RefreshCw, Loader2 } from "lucide-react";
import { DayPlan, Location, BucketListItem } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

interface AddLocationSheetProps {
    isOpen: boolean;
    onClose: () => void;
    days: DayPlan[];
    onAdd: (dayId: string, location: Location) => void;
    bucketListUrls?: string[];
    bucketListItems?: BucketListItem[];
    onRefreshBucketList?: () => Promise<void>;
}

export default function AddLocationSheet({ isOpen, onClose, days, onAdd, bucketListUrls, bucketListItems, onRefreshBucketList }: AddLocationSheetProps) {
    const [selectedDayId, setSelectedDayId] = useState<string>(days[0]?.id || "");
    const [showBucketList, setShowBucketList] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [location, setLocation] = useState<Partial<Location>>({
        name: "",
        description: "",
        timeSlot: "",
        mapsUrl: "",
        tag: "",
        notes: "",
        lat: 0,
        lng: 0,
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
            timeSlot: "",
            mapsUrl: "",
            tag: "",
            notes: "",
            lat: 0,
            lng: 0,
            completed: false
        });
        onClose();
    };

    const handleBucketListSelect = (item: BucketListItem) => {
        setLocation({
            ...location,
            name: item.name,
            lat: item.lat,
            lng: item.lng,
            mapsUrl: item.mapsUrl || "",
            tag: item.category || "Must Go",
        });
        setShowBucketList(false);
    };

    const handleRefresh = async () => {
        if (!onRefreshBucketList || refreshing) return;
        setRefreshing(true);
        try {
            await onRefreshBucketList();
        } finally {
            setRefreshing(false);
        }
    };

    const hasUrls = bucketListUrls && bucketListUrls.length > 0;
    const hasItems = bucketListItems && bucketListItems.length > 0;

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm sm:p-4">
                <motion.div
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "100%", opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="bg-surface w-full max-w-md max-h-[92vh] sm:rounded-[3rem] rounded-t-[2.5rem] shadow-2xl flex flex-col overflow-hidden border-t border-x border-stroke sm:border"
                >
                    {/* Drag Handle Indicator (visual only) */}
                    <div className="flex justify-center pt-3 pb-1 sm:hidden">
                        <div className="w-12 h-1.5 bg-text-medium/20 rounded-full" />
                    </div>
                    {/* Header */}
                    <div className="px-8 py-7 sm:pt-7 border-b border-stroke flex justify-between items-center bg-accent text-canvas shadow-lg flex-shrink-0">
                        <div className="space-y-1">
                            <h2 className="text-xl font-black uppercase tracking-tighter font-outfit leading-tight text-canvas flex items-center gap-3">
                                <Plus size={22} /> NOVA ATIVIDADE
                            </h2>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-canvas/70">Adiciona uma paragem mágica</p>
                        </div>
                        <button onClick={onClose} className="p-3 bg-canvas/10 hover:bg-canvas/20 rounded-full transition-all active:scale-90 border border-canvas/10 shadow-xl">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Form Content — touch-optimized */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-8" style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}>

                        {/* Bucket List Toggle */}
                        {hasUrls && (
                            <div className="space-y-4">
                                <button
                                    onClick={() => setShowBucketList(!showBucketList)}
                                    className={`w-full flex items-center justify-between gap-3 px-5 py-4 rounded-2xl border transition-all text-left ${showBucketList ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-canvas/50 border-stroke text-text-medium hover:border-emerald-500/30'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${showBucketList ? 'bg-emerald-500/20' : 'bg-surface'}`}>
                                            📍
                                        </div>
                                        <div>
                                            <span className="text-xs font-black uppercase tracking-widest block">Bucket List</span>
                                            <span className="text-[8px] font-bold text-text-dim uppercase tracking-wider">
                                                {hasItems ? `${bucketListItems!.length} locais guardados` : 'Clica para carregar'}
                                            </span>
                                        </div>
                                    </div>
                                    <List size={18} className={showBucketList ? 'text-emerald-500' : 'text-text-dim'} />
                                </button>

                                <AnimatePresence>
                                    {showBucketList && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="bg-canvas/40 border border-stroke rounded-2xl p-4 space-y-3">
                                                <div className="flex items-center justify-between px-1">
                                                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-text-medium">Toca para preencher</span>
                                                    <button
                                                        onClick={handleRefresh}
                                                        disabled={refreshing}
                                                        className="flex items-center gap-1.5 text-[8px] font-black text-accent hover:text-emerald-500 transition-colors uppercase tracking-wider disabled:opacity-50"
                                                    >
                                                        {refreshing ? <Loader2 size={10} className="animate-spin" /> : <RefreshCw size={10} />}
                                                        {refreshing ? 'A carregar...' : 'Atualizar'}
                                                    </button>
                                                </div>

                                                {hasItems ? (
                                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                                        {bucketListItems!.map((item) => (
                                                            <button
                                                                key={item.id}
                                                                type="button"
                                                                onClick={() => handleBucketListSelect(item)}
                                                                className="w-full bg-surface/60 border border-stroke p-3 rounded-xl flex justify-between items-center group/item hover:border-emerald-500/50 transition-all text-left"
                                                            >
                                                                <div className="flex flex-col gap-0.5">
                                                                    <span className="text-xs font-black text-text-high group-hover/item:text-emerald-500 transition-colors">{item.name}</span>
                                                                    <div className="flex items-center gap-2">
                                                                        {item.category && <span className="text-[7px] font-bold text-accent uppercase bg-accent/10 px-1.5 py-0.5 rounded">{item.category}</span>}
                                                                        {item.address && <span className="text-[7px] font-bold text-text-dim uppercase truncate max-w-[140px]">{item.address}</span>}
                                                                    </div>
                                                                </div>
                                                                <Plus size={14} className="text-text-dim group-hover/item:text-emerald-500 transition-colors flex-shrink-0" />
                                                            </button>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-6 space-y-3">
                                                        <p className="text-[9px] font-bold text-text-dim">Nenhum ponto carregado ainda.</p>
                                                        <button
                                                            onClick={handleRefresh}
                                                            disabled={refreshing}
                                                            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-500/20 hover:bg-emerald-500/20 transition-all disabled:opacity-50"
                                                        >
                                                            {refreshing ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
                                                            {refreshing ? 'A processar via AI...' : 'Carregar pontos da lista'}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}

                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-[10px] font-black text-text-medium uppercase tracking-[0.3em] px-2 leading-none">
                                NOME DO LOCAL
                            </label>
                            <input
                                type="text"
                                placeholder="Ex: Potato Head Beach Club"
                                value={location.name}
                                onChange={(e) => setLocation({ ...location, name: e.target.value })}
                                className="input-surface w-full p-6 text-[15px] font-black"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-[10px] font-black text-text-medium uppercase tracking-[0.3em] px-2 leading-none">
                                ATRIBUIR AO DIA
                            </label>
                            <select
                                value={selectedDayId}
                                onChange={(e) => setSelectedDayId(e.target.value)}
                                className="input-surface w-full p-6 text-sm font-black appearance-none"
                            >
                                {days.map(d => (
                                    <option key={d.id} value={d.id} className="bg-surface text-text-high">Dia {d.dayNumber} - {d.title}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-black text-text-medium uppercase tracking-[0.3em] px-2 leading-none">
                                    HORÁRIO
                                </label>
                                <input
                                    type="text"
                                    placeholder="09:00 - 11:00"
                                    value={location.timeSlot || ""}
                                    onChange={(e) => setLocation({ ...location, timeSlot: e.target.value })}
                                    className="input-surface w-full p-6 text-[10px] font-black uppercase tracking-widest text-accent"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-black text-text-medium uppercase tracking-[0.3em] px-2 leading-none">
                                    TAG
                                </label>
                                <select
                                    value={location.tag || ""}
                                    onChange={(e) => setLocation({ ...location, tag: e.target.value })}
                                    className="input-surface w-full p-6 text-[10px] font-black uppercase tracking-widest text-center appearance-none"
                                >
                                    <option value="" className="bg-surface">Sem Tag</option>
                                    <option value="Must Go" className="bg-surface">Must Go</option>
                                    <option value="Opcional" className="bg-surface">Opcional</option>
                                    <option value="Food" className="bg-surface">Food</option>
                                    <option value="Photo Op" className="bg-surface">Photo Op</option>
                                    <option value="Alojamento" className="bg-surface">Alojamento</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-[10px] font-black text-text-medium uppercase tracking-[0.3em] px-2 leading-none">
                                MAPS URL
                            </label>
                            <input
                                type="text"
                                placeholder="https://..."
                                value={location.mapsUrl || ""}
                                onChange={(e) => setLocation({ ...location, mapsUrl: e.target.value })}
                                className="input-surface w-full p-6 text-sm font-bold"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-[10px] font-black text-text-medium uppercase tracking-[0.3em] px-2 leading-none">
                                NOTAS (OPCIONAL)
                            </label>
                            <textarea
                                placeholder="Detalhes ou dicas rápidas..."
                                value={location.description || ""}
                                onChange={(e) => setLocation({ ...location, description: e.target.value })}
                                className="input-surface w-full p-6 h-32 text-sm font-medium resize-none shadow-none"
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-8 border-t border-stroke bg-surface pb-10 shadow-2xl flex-shrink-0">
                        <button
                            onClick={handleSave}
                            className="w-full btn-primary py-5 text-base"
                        >
                            <Plus size={22} />
                            ADICIONAR AO ROTEIRO
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
