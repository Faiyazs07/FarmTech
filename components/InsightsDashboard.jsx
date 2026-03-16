import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Tractor, Droplets, Leaf, Settings, BellRing, ChevronRight, CheckCircle2, AlertOctagon, X } from 'lucide-react';

export default function InsightsDashboard({ isActive, onClose }) {
    return (
        <AnimatePresence>
            {isActive && (
                <motion.div
                    initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                    animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
                    exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 z-50 bg-[#0a1a08]/85 flex flex-col pt-32 pb-12 px-12 pointer-events-auto overflow-y-auto custom-scrollbar font-sans text-white"
                >
                    {/* Header Row */}
                    <div className="flex justify-between items-start border-b border-white/10 pb-6 mb-8 mt-4">
                        <div>
                            <p className="text-[10px] font-bold text-[#38bdf8] uppercase tracking-[0.4em] mb-2">Live Analytics</p>
                            <h1 className="text-6xl font-black uppercase tracking-tighter leading-none">Estate Insights</h1>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-4 bg-white/5 hover:bg-white/10 rounded-full text-white/50 transition-all group border border-white/10 mb-2"
                        >
                            <X className="w-8 h-8 group-hover:rotate-90 transition-transform" />
                        </button>

                        {/* Main Score UI */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center gap-6 bg-[#1c2e1c]/40 border border-white/10 px-8 py-4 rounded-3xl backdrop-blur-md"
                        >
                            <div className="relative w-20 h-20 flex items-center justify-center">
                                {/* SVG Ring */}
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="40" cy="40" r="36" className="stroke-white/10" strokeWidth="8" fill="none" />
                                    <motion.circle
                                        cx="40" cy="40" r="36"
                                        className="stroke-[#38bdf8]"
                                        strokeWidth="8" fill="none"
                                        strokeLinecap="round"
                                        initial={{ strokeDasharray: "226", strokeDashoffset: "226" }}
                                        animate={{ strokeDashoffset: 226 - (226 * 0.8) }}
                                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-2xl font-black leading-none">80</span>
                                    <span className="text-[8px] font-bold text-white/50 uppercase">/ 100</span>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-black uppercase tracking-wider mb-1">System Health</h3>
                                <p className="text-xs text-[#38bdf8] uppercase font-bold tracking-widest flex items-center gap-2">
                                    <Activity className="w-4 h-4" /> Optimal Output
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Grid Layout */}
                    <div className="grid grid-cols-12 gap-6 flex-1">

                        {/* Left Column - Crop Status */}
                        <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">

                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="bg-gradient-to-br from-[#0f172a]/60 to-[#020617]/60 border border-[#38bdf8]/20 p-8 rounded-3xl h-full flex flex-col relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-96 h-96 bg-[#38bdf8]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                                <div className="flex justify-between items-center mb-10 relative z-10 border-b border-white/10 pb-4">
                                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                                        <Leaf className="w-6 h-6 text-[#38bdf8]" /> Precision Wheat Status
                                    </h2>
                                    <span className="bg-[#38bdf8]/20 text-[#38bdf8] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">Live Scan</span>
                                </div>

                                <div className="grid grid-cols-2 gap-x-12 gap-y-8 relative z-10 flex-1">
                                    <CropMetric label="Protein Content" value="14.2%" target="Target: >13.5%" status="excellent" />
                                    <CropMetric label="Soil Moisture" value="38%" target="Optimal: 35-45%" status="good" />
                                    <CropMetric label="Growth Stage" value="Heading" target="Expected: Booting" status="ahead" />
                                    <CropMetric label="Nitrogen Level" value="Adequate" target="Recent app: 12 days ago" status="good" />
                                </div>

                                <div className="mt-8 relative z-10 bg-white/5 border border-white/10 p-5 rounded-2xl flex items-start gap-4">
                                    <div className="bg-[#38bdf8]/20 p-3 rounded-xl"><Droplets className="w-6 h-6 text-[#38bdf8]" /></div>
                                    <div>
                                        <h4 className="text-sm font-bold uppercase tracking-wider mb-1">Irrigation Recommendation</h4>
                                        <p className="text-xs text-white/50 leading-relaxed font-light">Current moisture levels are stable. Forecast shows minimal rain, maintain standard pivot irrigation schedule for Field A.</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Column - Fleet & Machinery */}
                        <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">

                            {/* Tractor Status Alert */}
                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="bg-[#1c2e1c]/40 border border-[#ef4444]/30 p-8 rounded-3xl flex flex-col relative overflow-hidden"
                            >
                                <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#ef4444]/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/4" />

                                <div className="flex items-center gap-4 mb-8">
                                    <div className="bg-[#ef4444]/20 p-4 rounded-2xl border border-[#ef4444]/30">
                                        <Tractor className="w-8 h-8 text-[#ef4444]" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black uppercase tracking-tighter text-white">Heavy Machinery</h3>
                                        <p className="text-xs font-bold text-white/40 uppercase tracking-[0.2em]">CX-900 Autonomous Harvester</p>
                                    </div>
                                </div>

                                <div className="bg-black/30 rounded-2xl p-6 border border-white/10 space-y-4 mb-8 relative z-10">
                                    <div className="flex justify-between items-end border-b border-white/5 pb-4">
                                        <span className="text-xs uppercase text-white/50 font-bold tracking-widest">Engine Hours</span>
                                        <span className="text-3xl font-mono font-black text-white flex items-baseline gap-1">10,012 <span className="text-sm text-white/40">hrs</span></span>
                                    </div>

                                    <div className="flex items-start gap-3 pt-2">
                                        <AlertOctagon className="w-5 h-5 text-[#ef4444] shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="text-sm font-bold text-[#ef4444] uppercase mb-1">Critical Maintenance Due</h4>
                                            <p className="text-xs text-white/60 leading-relaxed">System logs indicate standard engine oil breakdown at the 10k hour mark. Immediate fluid replacement recommended to prevent internal scoring.</p>
                                        </div>
                                    </div>
                                </div>

                                <button className="relative z-10 w-full bg-[#ef4444] hover:bg-white text-white hover:text-[#ef4444] flex items-center justify-center gap-3 font-black py-5 rounded-xl uppercase tracking-widest text-sm transition-all shadow-[0_0_30px_rgba(239,68,68,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] group">
                                    <BellRing className="w-5 h-5 group-hover:animate-bounce" />
                                    <span>Notify Me</span>
                                </button>
                            </motion.div>

                            {/* Smaller Stats */}
                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="grid grid-cols-2 gap-6"
                            >
                                <div className="bg-[#1c2e1c]/40 border border-white/5 p-6 rounded-2xl">
                                    <Settings className="w-6 h-6 text-white/30 mb-4" />
                                    <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-1">Active Drones</p>
                                    <p className="text-3xl font-black">12/14</p>
                                </div>
                                <div className="bg-[#1c2e1c]/40 border border-white/5 p-6 rounded-2xl flex flex-col justify-end">
                                    <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-3">Next Shift</p>
                                    <p className="text-sm font-bold text-white uppercase flex items-center justify-between">
                                        18:00 Local <ChevronRight className="w-4 h-4 text-white/30" />
                                    </p>
                                </div>
                            </motion.div>

                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function CropMetric({ label, value, target, status }) {
    const isExcellent = status === 'excellent' || status === 'ahead';
    return (
        <div className="flex flex-col gap-2">
            <h4 className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em]">{label}</h4>
            <div className="flex items-end gap-3">
                <span className="text-4xl font-mono font-black text-white">{value}</span>
                {isExcellent && <CheckCircle2 className="w-6 h-6 text-green-400 mb-1" />}
            </div>
            <p className={`text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-1 rounded w-fit ${isExcellent ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-white/40'}`}>
                {target}
            </p>
        </div>
    );
}
