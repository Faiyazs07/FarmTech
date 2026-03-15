"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar as CalendarIcon, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function CalendarDashboard({ isActive, onClose }) {
    const schedule = [
        { time: "09:00 AM", task: "Automated Plowing", field: "North Wheat Field", status: "completed", urgent: false },
        { time: "11:30 AM", task: "Drone Soil Analysis", field: "Canola Sector B", status: "in-progress", urgent: true },
        { time: "01:30 PM", task: "Seed Drill Calibration", field: "Heritage Peas", status: "pending", urgent: false },
        { time: "03:00 PM", task: "Irrigation Check", field: "All Sectors", status: "pending", urgent: false },
        { time: "05:00 PM", task: "Data Backup & Sync", field: "Central Hub", status: "pending", urgent: false },
    ];

    return (
        <AnimatePresence>
            {isActive && (
                <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    className="fixed inset-y-0 right-0 w-full max-w-xl bg-[#0a1a08]/90 backdrop-blur-2xl border-l border-white/10 z-[80] shadow-2xl flex flex-col"
                >
                    {/* Header */}
                    <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-emerald-500/10 to-transparent">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <CalendarIcon className="w-4 h-4 text-emerald-400" />
                                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">Operational Schedule</span>
                            </div>
                            <h2 className="text-4xl font-black text-white uppercase tracking-tighter">March 2026</h2>
                            <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mt-1">Season: Early Preparation</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-4 bg-white/5 hover:bg-white/10 rounded-full text-white/50 transition-all group"
                        >
                            <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                        </button>
                    </div>

                    {/* Timeline */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                        {schedule.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="relative pl-8 border-l border-white/10"
                            >
                                {/* Timeline Dot */}
                                <div className={`absolute left-[-5px] top-0 w-[9px] h-[9px] rounded-full border-2 border-[#0a1a08] ${item.status === 'completed' ? 'bg-emerald-500' :
                                        item.status === 'in-progress' ? 'bg-amber-500 animate-pulse' : 'bg-white/20'
                                    }`} />

                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-black text-white/40 tracking-tighter w-20">{item.time}</span>
                                        <div className={`flex-1 p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group ${item.urgent ? 'ring-1 ring-red-500/30' : ''}`}>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-lg font-bold text-white leading-tight group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{item.task}</h3>
                                                    <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mt-1">{item.field}</p>
                                                </div>
                                                {item.status === 'completed' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                                                {item.urgent && <AlertCircle className="w-5 h-5 text-red-500 animate-pulse" />}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Footer Card */}
                    <div className="p-8 bg-white/5 border-t border-white/5">
                        <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg">
                                    <Clock className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold uppercase tracking-tight">Today's Progress</h4>
                                    <p className="text-emerald-400/80 text-xs font-black uppercase tracking-widest leading-none mt-1">68% Optimized</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
