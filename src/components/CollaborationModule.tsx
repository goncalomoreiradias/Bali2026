"use client";

import { motion } from "framer-motion";
import { UserPlus, Shield } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface Participant {
    id: string;
    name: string;
    role: "Owner" | "Editor" | "Viewer";
    online?: boolean;
}

interface CollaborationModuleProps {
    participants: Participant[];
    onInvite: () => void;
}

export default function CollaborationModule({ participants, onInvite }: CollaborationModuleProps) {
    const { t } = useI18n();
    return (
        <div className="flex items-center gap-2 md:gap-3 bg-canvas p-1.5 md:p-2 rounded-full border border-stroke shadow-lg backdrop-blur-xl transition-all">
            <div className="flex -space-x-2 px-1">
                {participants.map((p, i) => (
                    <motion.div
                        key={p.id}
                        initial={{ scale: 0, x: -10 }}
                        animate={{ scale: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="relative group/avatar"
                    >
                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-accent text-canvas border-2 border-canvas flex items-center justify-center text-[8px] md:text-[9px] font-black shadow-md cursor-help">
                            {p.name.charAt(0).toUpperCase()}
                        </div>
                        
                        {/* Status Indicator */}
                        {p.online && (
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-canvas" />
                        )}

                        {/* Hover Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 group-hover/avatar:opacity-100 transition-all pointer-events-none z-50">
                            <div className="bg-canvas border border-stroke px-3 py-1.5 rounded-xl shadow-2xl space-y-0.5 min-w-[100px]">
                                <p className="text-[9px] font-black text-text-high uppercase tracking-tight">{p.name}</p>
                                <div className="flex items-center gap-1">
                                    <Shield size={8} className="text-text-medium" />
                                    <span className="text-[7px] font-black uppercase tracking-widest text-text-medium">{p.role}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <button
                onClick={onInvite}
                className="flex items-center gap-1.5 px-3 md:px-4 py-1.5 bg-accent text-canvas rounded-full font-black uppercase tracking-widest text-[7px] md:text-[8px] transition-all active:scale-95 hover:opacity-90 whitespace-nowrap relative z-10"
            >
                <UserPlus size={11} />
                <span className="hidden sm:inline">{t("collab.invite")}</span>
                <span className="sm:hidden">+</span>
            </button>
        </div>
    );
}
