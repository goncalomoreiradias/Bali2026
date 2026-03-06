"use client";

import { useState } from "react";
import { X, Plus, Receipt } from "lucide-react";
import { Expense } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

interface AddExpenseSheetProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (expense: Expense) => void;
}

export default function AddExpenseSheet({ isOpen, onClose, onAdd }: AddExpenseSheetProps) {
    const [expense, setExpense] = useState<Partial<Expense>>({
        description: "",
        amount: 0,
        paidBy: "",
        date: new Date().toISOString().split('T')[0]
    });

    const handleSave = () => {
        if (!expense.description || !expense.amount || !expense.paidBy) {
            alert("Por favor preenche a descrição, o valor e quem pagou.");
            return;
        }

        onAdd({
            ...expense,
            id: `exp-${Date.now()}`,
        } as Expense);

        // Reset form
        setExpense({
            description: "",
            amount: 0,
            paidBy: "",
            date: new Date().toISOString().split('T')[0]
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
                    <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gradient-to-r from-bali-ocean to-blue-600 text-white">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Receipt size={22} /> Nova Despesa
                        </h2>
                        <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Form Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Descrição</label>
                            <input
                                type="text"
                                placeholder="Ex: Jantar no Sweet Orange"
                                value={expense.description}
                                onChange={(e) => setExpense({ ...expense, description: e.target.value })}
                                className="w-full bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-bali-ocean outline-none transition-colors"
                                autoFocus
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Valor (€)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">€</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={expense.amount || ""}
                                        onChange={(e) => setExpense({ ...expense, amount: parseFloat(e.target.value) || 0 })}
                                        className="w-full bg-gray-50 dark:bg-gray-800 pl-8 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 outline-none font-bold text-lg"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Quem pagou?</label>
                                <input
                                    type="text"
                                    placeholder="Nome"
                                    value={expense.paidBy || ""}
                                    onChange={(e) => setExpense({ ...expense, paidBy: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Data</label>
                            <input
                                type="date"
                                value={expense.date}
                                onChange={(e) => setExpense({ ...expense, date: e.target.value })}
                                className="w-full bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 outline-none"
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-5 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
                        <button
                            onClick={handleSave}
                            className="w-full py-4 bg-bali-ocean hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            <Plus size={20} />
                            Guardar Despesa
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
