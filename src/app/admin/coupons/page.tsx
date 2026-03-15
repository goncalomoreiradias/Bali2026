"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Key, Loader2, Copy, Check, Sparkles, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CouponGeneratorPage() {
    const router = useRouter();
    const [planGranted, setPlanGranted] = useState("SINGLE_TRIP");
    const [usesLeft, setUsesLeft] = useState(1);
    const [expiresAt, setExpiresAt] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [generatedCode, setGeneratedCode] = useState("");
    const [copied, setCopied] = useState(false);
    const [activeCoupons, setActiveCoupons] = useState<any[]>([]);
    const [isFetching, setIsFetching] = useState(true);

    // Fetch existing coupons
    useState(() => {
        const fetchCoupons = async () => {
            try {
                const res = await fetch("/api/admin/coupons");
                const data = await res.json();
                if (data.coupons) setActiveCoupons(data.coupons);
            } catch (err) {
                console.error("Failed to fetch coupons");
            } finally {
                setIsFetching(false);
            }
        };
        fetchCoupons();
    });

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this coupon?")) return;
        
        try {
            const res = await fetch(`/api/admin/coupons?id=${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setActiveCoupons(prev => prev.filter(c => c.id !== id));
            }
        } catch (err) {
            alert("Failed to delete coupon");
        }
    };

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });
        setGeneratedCode("");
        setIsLoading(true);

        try {
            const body = {
                planGranted,
                usesLeft: Number(usesLeft),
                ...(expiresAt && { expiresAt })
            };

            const res = await fetch("/api/admin/coupons", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: "success", text: "Coupon generated successfully!" });
                setGeneratedCode(data.coupon.code);
                router.refresh();
            } else {
                setMessage({ type: "error", text: data.error });
            }
        } catch (err) {
            setMessage({ type: "error", text: "Failed to generate coupon." });
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (!generatedCode) return;
        navigator.clipboard.writeText(generatedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <main className="min-h-screen bg-obsidian text-white p-6 md:p-12 relative overflow-hidden selection:bg-accent-cobalt selection:text-white">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-cobalt/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-magenta/5 blur-[120px] rounded-full" />
            </div>

            <header className="flex items-center gap-6 mb-16 relative z-10">
                <Link href="/admin" className="group p-4 glass bg-white/5 border-white/10 rounded-full hover:bg-white/10 transition-all border shadow-2xl active:scale-90">
                    <ArrowLeft size={22} className="text-gray-400 group-hover:text-white transition-colors" />
                </Link>
                <div>
                    <p className="text-[10px] font-black text-accent-cobalt tracking-[0.4em] uppercase mb-1">Admin Tools</p>
                    <h1 className="text-4xl font-black font-outfit text-white tracking-tight leading-none uppercase">
                        Promo Generator
                    </h1>
                </div>
            </header>

            <div className="max-w-xl mx-auto relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass bg-[#141820]/60 p-12 rounded-[3.5rem] border border-white/5 shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Key size={120} className="text-accent-cobalt" />
                    </div>

                    <h2 className="text-2xl font-black font-outfit mb-10 flex items-center gap-4 text-white uppercase tracking-tight">
                        <div className="p-3 bg-accent-cobalt/10 rounded-2xl">
                            <Key className="text-accent-cobalt" size={24} />
                        </div>
                        New Access Code
                    </h2>

                    <form onSubmit={handleGenerate} className="space-y-8">
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] px-2 leading-none">
                                Plan Tier to Grant
                            </label>
                            <div className="relative">
                                <select
                                    value={planGranted}
                                    onChange={(e) => setPlanGranted(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 focus:border-accent-cobalt rounded-full px-8 py-4.5 outline-none font-black text-white text-sm appearance-none cursor-pointer transition-all hover:bg-white/10"
                                >
                                    <option value="SINGLE_TRIP" className="bg-obsidian">Single Trip (€2.99 value)</option>
                                    <option value="MONTHLY" className="bg-obsidian">Monthly Subscription (€5.99 value)</option>
                                    <option value="YEARLY" className="bg-obsidian">Yearly Subscription (€49.99 value)</option>
                                </select>
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                    <ArrowLeft className="-rotate-90" size={16} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] px-2 leading-none">
                                Usage Limit
                            </label>
                            <input
                                type="number"
                                min="1"
                                required
                                value={usesLeft}
                                onChange={(e) => setUsesLeft(parseInt(e.target.value))}
                                className="w-full bg-white/5 border border-white/10 focus:border-accent-cobalt rounded-full px-8 py-4.5 outline-none font-black text-white text-sm transition-all"
                            />
                            <p className="text-[9px] font-medium text-gray-600 uppercase tracking-widest px-2">How many users can redeem this specific code.</p>
                        </div>

                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] px-2 leading-none">
                                Expiration Date (Optional)
                            </label>
                            <input
                                type="date"
                                value={expiresAt}
                                onChange={(e) => setExpiresAt(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 focus:border-accent-cobalt rounded-full px-8 py-4.5 outline-none font-black text-white text-sm transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full mt-4 py-5 bg-gradient-to-br from-accent-cobalt via-accent-indigo to-accent-magenta text-white font-black rounded-full flex items-center justify-center gap-3 transition-all disabled:opacity-50 active:scale-95 shadow-[0_20px_40px_-10px_rgba(46,91,255,0.3)] uppercase tracking-[0.2em] text-[11px] border border-white/20"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Generate Secure Code"}
                        </button>

                        {message.text && !generatedCode && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`p-5 rounded-[1.5rem] text-[10px] font-black text-center uppercase tracking-[0.2em] border shadow-2xl ${message.type === 'success'
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                    : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                }`}>
                                {message.text}
                            </motion.div>
                        )}
                    </form>

                    {generatedCode && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="mt-12 p-8 bg-black/40 rounded-[2.5rem] border border-accent-cobalt/30 border-dashed relative group overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-all">
                                <Sparkles size={64} className="text-accent-emerald" />
                            </div>
                            
                            <div className="absolute -top-3 left-10 bg-accent-emerald text-obsidian text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-2xl">
                                Code Ready
                            </div>
                            
                            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] text-center mb-4">Share with the user:</p>
                            
                            <div className="flex items-center justify-between bg-white/5 p-6 rounded-[2rem] border border-white/5 shadow-inner">
                                <span className="font-outfit font-black text-3xl text-accent-emerald tracking-[0.2em] uppercase">{generatedCode}</span>
                                <button
                                    onClick={copyToClipboard}
                                    className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all text-white active:scale-90 border border-white/5"
                                    title="Copy to clipboard"
                                >
                                    {copied ? <Check className="text-accent-emerald" size={22} strokeWidth={3} /> : <Copy size={22} />}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </div>
            {/* Active Coupons List */}
            <div className="max-w-4xl mx-auto mt-20 relative z-10">
                <h2 className="text-2xl font-black font-outfit mb-8 text-white uppercase tracking-tight flex items-center gap-3">
                    <div className="p-2 bg-accent-magenta/10 rounded-xl">
                        <Key className="text-accent-magenta" size={20} />
                    </div>
                    Active Coupons
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AnimatePresence>
                        {activeCoupons.map((coupon) => (
                            <motion.div
                                key={coupon.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="glass bg-[#141820]/60 p-6 rounded-[2rem] border border-white/5 flex justify-between items-center group hover:border-white/10 transition-all"
                            >
                                <div>
                                    <p className="text-lg font-black font-outfit text-accent-indigo tracking-widest uppercase">{coupon.code}</p>
                                    <div className="flex gap-3 mt-1">
                                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Uses: <span className="text-white">{coupon.usesLeft}</span></p>
                                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Plan: <span className="text-accent-magenta">{coupon.planGranted}</span></p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(coupon.id)}
                                    className="p-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-xl transition-all active:scale-90 border border-rose-500/10"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    
                    {activeCoupons.length === 0 && !isFetching && (
                        <div className="col-span-2 py-12 glass bg-white/5 rounded-[2.5rem] border border-white/5 border-dashed flex flex-col items-center gap-4 text-gray-600">
                            <Key size={32} className="opacity-20" />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em]">No active coupons found</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
