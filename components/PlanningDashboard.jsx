import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, TrendingUp, CloudRain, AlertTriangle, Leaf, Package, Thermometer, ShieldAlert, ArrowRight, Mic, Send } from 'lucide-react';
import { useState } from 'react';

export default function PlanningDashboard({ isActive, onClose }) {
    const [selectedMonth, setSelectedMonth] = useState('April');

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

    return (
        <AnimatePresence>
            {isActive && (
                <motion.div
                    initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                    animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
                    exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 z-50 bg-[#0a1a08]/80 flex flex-col pt-32 pb-8 px-12 pointer-events-auto overflow-y-auto custom-scrollbar font-sans text-white"
                >
                    {/* Header */}
                    <div className="flex justify-between items-end border-b border-white/10 pb-6 mb-8 mt-12">
                        <div>
                            <p className="text-[10px] font-bold text-[#8fb339] uppercase tracking-[0.4em] mb-2">Strategic Overview</p>
                            <h1 className="text-6xl font-black uppercase tracking-tighter leading-none">Estate Planning</h1>
                        </div>

                        <div className="flex bg-[#1c2e1c]/50 p-2 rounded-2xl border border-white/5 backdrop-blur-md">
                            {months.map(month => (
                                <button
                                    key={month}
                                    onClick={() => setSelectedMonth(month)}
                                    className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${selectedMonth === month
                                        ? 'bg-white text-black shadow-lg scale-105'
                                        : 'text-white/40 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {month}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Grid Layout */}
                    <div className="grid grid-cols-12 gap-6 flex-1">

                        {/* Left Column - The Plan */}
                        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">

                            {/* Primary Recommendation */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="bg-gradient-to-br from-[#2d5a27]/40 to-[#0a1a08]/40 border border-white/10 p-8 rounded-3xl h-full flex flex-col relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[#8fb339]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 group-hover:bg-[#8fb339]/20 transition-all duration-700" />

                                <div className="flex justify-between items-start mb-8 relative z-10">
                                    <div>
                                        <h2 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-1">Primary Route</h2>
                                        <p className="text-4xl font-black uppercase tracking-tighter">Canola & Oats Cycle</p>
                                    </div>
                                    <div className="bg-[#8fb339]/20 border border-[#8fb339]/30 text-[#8fb339] px-4 py-2 rounded-full flex items-center gap-2">
                                        <div className="w-2 h-2 bg-[#8fb339] rounded-full animate-pulse" />
                                        <span className="text-xs font-bold tracking-widest uppercase">Optimal Action</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8 flex-1 relative z-10">
                                    <div className="space-y-6">
                                        <PathStep number="01" title="Preparation" desc="Soil conditioning & moisture retention protocols for Canola phase." icon={<Leaf className="w-5 h-5 text-[#8fb339]" />} />
                                        <PathStep number="02" title="Seeding" desc="High-density planting to maximize yield per square meter." icon={<Package className="w-5 h-5 text-[#8fb339]" />} />
                                        <PathStep number="03" title="Monitoring" desc="Continuous AI-driven health assessment." icon={<TrendingUp className="w-5 h-5 text-[#8fb339]" />} />
                                    </div>
                                    <div className="bg-white/5 rounded-2xl p-6 border border-white/5 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-sm font-bold uppercase tracking-widest text-[#8fb339] mb-4">Required Supplies</h3>
                                            <div className="space-y-4">
                                                <SupplyItem name="Canola Elite Seeds" supplier="AgriCorp GenX" qty="450 kg" price="$3,200" />
                                                <SupplyItem name="Oats Vanguard" supplier="Northern Seeds" qty="800 kg" price="$1,850" />
                                                <SupplyItem name="Organic Fertilizer" supplier="BioNutrients" qty="2.5 tons" price="$4,100" />
                                            </div>
                                        </div>
                                        <button className="w-full mt-6 bg-white flex items-center justify-center gap-3 text-black font-black py-4 rounded-xl uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                                            <span>Initiate Supply Order</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Column - Risks & Markets */}
                        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">

                            {/* Weather & Risks */}
                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="bg-[#1c2e1c]/40 border border-white/10 p-6 rounded-3xl flex-1 backdrop-blur-sm"
                            >
                                <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                    <Thermometer className="w-4 h-4" /> Environmental Forecast
                                </h3>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <div className="flex items-center gap-4">
                                            <CloudRain className="w-8 h-8 text-blue-400" />
                                            <div>
                                                <p className="text-sm font-black uppercase">Precipitation</p>
                                                <p className="text-xs font-bold text-white/50">Expected +15% avg</p>
                                            </div>
                                        </div>
                                        <div className="bg-blue-400/20 text-blue-400 px-3 py-1 rounded-lg text-xs font-bold font-mono">
                                            FAVORABLE
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-red-500/10 rounded-2xl border border-red-500/20">
                                        <div className="flex items-center gap-4">
                                            <ShieldAlert className="w-8 h-8 text-red-400" />
                                            <div>
                                                <p className="text-sm font-black uppercase">Pesticide Risk</p>
                                                <p className="text-xs font-bold text-white/50">Aphid migration high</p>
                                            </div>
                                        </div>
                                        <div className="bg-red-500/20 text-red-500 px-3 py-1 rounded-lg text-xs font-bold flex flex-col items-end">
                                            <span className="font-mono">42% CHANCE</span>
                                            <span className="text-[8px] uppercase tracking-widest">Action Required</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Market Data */}
                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="bg-[#1c2e1c]/40 border border-white/10 p-6 rounded-3xl flex-1 backdrop-blur-sm"
                            >
                                <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4" /> Live Market Data
                                </h3>

                                <div className="space-y-4 text-xs font-mono">
                                    <MarketRow asset="CANOLA (CLc1)" price="$642.50" change="+1.2%" up />
                                    <MarketRow asset="OATS (OOc1)" price="$355.25" change="-0.4%" up={false} />
                                    <MarketRow asset="WHEAT (Wc1)" price="$578.00" change="+2.1%" up />
                                    <MarketRow asset="FERTILIZER (IDX)" price="$412.00" change="+0.1%" up />
                                </div>
                            </motion.div>

                        </div>
                    </div>

                    {/* AI Chat Bar */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-8 flex justify-center sticky bottom-0 z-20 pb-4"
                    >
                        <div className="relative w-full max-w-3xl flex items-center bg-[#1c2e1c]/80 backdrop-blur-xl border border-white/20 rounded-full p-2 shadow-2xl">
                            <button className="p-3 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all">
                                <Mic className="w-5 h-5" />
                            </button>
                            <input
                                type="text"
                                placeholder="Ask about crops, soils, or market trends..."
                                className="flex-1 bg-transparent border-none outline-none text-white px-4 placeholder:text-white/30 text-sm font-light tracking-wide"
                            />
                            <button className="p-3 bg-[#8fb339] text-black hover:bg-white rounded-full transition-all shadow-[0_0_15px_rgba(143,179,57,0.4)]">
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>

                </motion.div>
            )}
        </AnimatePresence>
    );
}

function PathStep({ number, title, desc, icon }) {
    return (
        <div className="flex gap-4 items-start pb-6 border-b border-white/5 last:border-0 last:pb-0">
            <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-black text-sm">
                    {number}
                </div>
            </div>
            <div>
                <h4 className="font-bold text-lg uppercase tracking-wider flex items-center gap-2 mb-1">
                    {title} {icon}
                </h4>
                <p className="text-sm text-white/60 font-light leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}

function SupplyItem({ name, supplier, qty, price }) {
    return (
        <div className="flex justify-between items-center bg-black/20 p-3 rounded-lg border border-white/5">
            <div>
                <p className="text-xs font-bold uppercase">{name}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-widest">{supplier}</p>
            </div>
            <div className="text-right">
                <p className="text-xs font-mono font-bold">{qty}</p>
                <p className="text-[10px] text-[#8fb339] font-mono">{price}</p>
            </div>
        </div>
    );
}

function MarketRow({ asset, price, change, up }) {
    return (
        <div className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
            <span className="text-white/70">{asset}</span>
            <div className="flex items-center gap-4">
                <span className="font-bold text-white">{price}</span>
                <span className={`px-2 py-0.5 rounded ${up ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {change}
                </span>
            </div>
        </div>
    );
}
