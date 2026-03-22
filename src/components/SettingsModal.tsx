"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, LifeBuoy, Zap, ChevronRight, Loader2, CheckCircle2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useRouter } from "next/navigation";

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    session: any;
    userPlan: string;
}

export default function SettingsModal({ isOpen, onClose, session, userPlan }: SettingsModalProps) {
    const { t } = useI18n();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"profile" | "support">("profile");

    // Support Form State
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmitTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject.trim() || !message.trim()) return;

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/tickets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subject, message })
            });
            if (res.ok) {
                setIsSuccess(true);
                setTimeout(() => {
                    setSubject("");
                    setMessage("");
                    setIsSuccess(false);
                    onClose();
                }, 2000);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
                onClick={onClose}
            />
            
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="glass bg-surface w-full max-w-2xl sm:rounded-[2.5rem] rounded-[2rem] shadow-2xl overflow-hidden relative border border-stroke flex flex-col sm:flex-row h-[80vh] sm:h-auto sm:min-h-[500px]"
            >
                {/* Close Button Mobile */}
                <button
                    onClick={onClose}
                    className="sm:hidden absolute top-6 right-6 z-50 w-8 h-8 flex items-center justify-center bg-stroke rounded-full"
                >
                    <X size={16} />
                </button>

                {/* Sidebar */}
                <div className="w-full sm:w-1/3 bg-canvas/50 border-b sm:border-b-0 sm:border-r border-stroke p-6 sm:p-8 flex flex-col gap-2">
                    <h2 className="text-xl font-black font-outfit uppercase tracking-tight text-text-high mb-6 hidden sm:block">
                        Definições
                    </h2>

                    <button
                        onClick={() => setActiveTab("profile")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                            activeTab === "profile" 
                                ? "bg-accent text-canvas shadow-lg" 
                                : "text-text-medium hover:bg-stroke hover:text-text-high"
                        }`}
                    >
                        <Shield size={18} /> A Minha Conta
                    </button>

                    <button
                        onClick={() => setActiveTab("support")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                            activeTab === "support" 
                                ? "bg-accent text-canvas shadow-lg" 
                                : "text-text-medium hover:bg-stroke hover:text-text-high"
                        }`}
                    >
                        <LifeBuoy size={18} /> Suporte
                    </button>
                    
                    <div className="flex-1" />
                    <button
                        onClick={onClose}
                        className="hidden sm:flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-text-medium hover:bg-stroke hover:text-text-high transition-all"
                    >
                        <ChevronRight size={18} className="rotate-180" /> Fechar
                    </button>
                </div>

                {/* Content */}
                <div className="w-full sm:w-2/3 p-6 sm:p-10 flex flex-col h-full overflow-y-auto">
                    {activeTab === "profile" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-10 sm:pb-0">
                            <div>
                                <h3 className="text-2xl font-black text-text-high mb-2 font-outfit uppercase tracking-tight">Informações Pessoais</h3>
                                <p className="text-sm font-medium text-text-medium">Gere os detalhes da conta nesta secção.</p>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 rounded-2xl bg-canvas border border-stroke flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-text-medium">Nome</p>
                                        <p className="font-bold text-text-high">{session?.name || "Viajante"}</p>
                                    </div>
                                </div>
                                <div className="p-4 rounded-2xl bg-canvas border border-stroke flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-text-medium">Email</p>
                                        <p className="font-bold text-text-high">{session?.email || "Sem email associado"}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 rounded-3xl bg-accent/5 border border-accent/20 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                                    <Zap size={64} className="text-accent" />
                                </div>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-2">O Meu Plano</h4>
                                <div className="flex items-end gap-3 mb-6">
                                    <span className="text-3xl font-black text-text-high font-outfit uppercase leading-none">
                                        {userPlan === "FREE" ? "Gratuito" : userPlan}
                                    </span>
                                </div>
                                {userPlan === "FREE" ? (
                                    <button onClick={() => router.push("/#pricing")} className="px-6 py-2.5 bg-accent text-canvas rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-transform shadow-lg">
                                        Fazer Upgrade
                                    </button>
                                ) : (
                                    <p className="text-xs font-bold text-text-medium">Estás a usufruir de todas as funcionalidades Premium.</p>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "support" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-10 sm:pb-0 flex flex-col h-full">
                            <div>
                                <h3 className="text-2xl font-black text-text-high mb-2 font-outfit uppercase tracking-tight">Centro de Suporte</h3>
                                <p className="text-sm font-medium text-text-medium max-w-sm">Dúvidas ou problemas? Abre um ticket e a nossa equipa ajudará o mais brevemente possível.</p>
                            </div>

                            {isSuccess ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 p-8 bg-green-500/5 rounded-3xl border border-green-500/20">
                                    <CheckCircle2 size={48} className="text-green-500" />
                                    <div>
                                        <h4 className="text-lg font-black text-text-high uppercase">Ticket Enviado!</h4>
                                        <p className="text-sm text-text-medium mt-1">A nossa equipa responderá em breve.</p>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmitTicket} className="space-y-4 flex-1 flex flex-col">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-medium px-2">Assunto</label>
                                        <input
                                            type="text"
                                            required
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                            placeholder="Ex: Problema com o Roteiro"
                                            className="w-full bg-canvas border border-stroke rounded-2xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-accent outline-none text-text-high placeholder:text-text-medium/50 transition-all font-outfit"
                                        />
                                    </div>
                                    <div className="space-y-2 flex-1 flex flex-col">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-medium px-2">Mensagem</label>
                                        <textarea
                                            required
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="Explica-nos o que aconteceu..."
                                            className="w-full flex-1 bg-canvas border border-stroke rounded-2xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-accent outline-none min-h-[160px] resize-none text-text-high placeholder:text-text-medium/50 transition-all font-outfit"
                                        />
                                    </div>
                                    
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-4 bg-accent text-canvas rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 hover:bg-accent-indigo disabled:opacity-50 disabled:active:scale-100 mt-auto"
                                    >
                                        {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Enviar Ticket"}
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
