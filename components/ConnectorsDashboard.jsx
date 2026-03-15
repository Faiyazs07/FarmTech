"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { X, Link2, Cpu, Radio, Shield, Zap, Globe } from 'lucide-react';

export default function ConnectorsDashboard({ isActive, onClose }) {
    const providers = [
        { name: "John Deere JDLink", status: "Connected", type: "Fleet Management", latency: "12ms", icon: Cpu, color: "text-emerald-400" },
        { name: "DJI Mavic Pro Grid", status: "Active", type: "Aerial Surveillance", latency: "45ms", icon: Radio, color: "text-blue-400" },
        { name: "Sentinel-2 API", status: "Live", type: "Satellite Imaging", latency: "230ms", icon: Globe, color: "text-purple-400" },
        { name: "Tesla Powerwall 3", status: "Connected", type: "Energy Grid", latency: "2ms", icon: Zap, color: "text-amber-400" },
        { name: "Local Weather Node", status: "Connected", type: "IoT Sensor", latency: "18ms", icon: Radio, color: "text-cyan-400" },
    ];

    return (
        <AnimatePresence>
            {isActive && (
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 100 }}
                    className="fixed inset-0 bg-[#0a1a08]/95 backdrop-blur-3xl z-[90] flex flex-col"
                >
                    {/* Top Bar */}
                    <div className="p-8 flex justify-between items-center border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Link2 className="w-4 h-4 text-emerald-400" />
                                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">System Integration</span>
                            </div>
                            <h2 className="text-5xl font-black text-white uppercase tracking-tighter">Connectors Hub</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-4 bg-white/5 hover:bg-white/10 rounded-full text-white/50 transition-all group"
                        >
                            <X className="w-8 h-8 group-hover:rotate-90 transition-transform" />
                        </button>
                    </div>

                    {/* Grid Content */}
                    <div className="flex-1 overflow-y-auto p-12 max-w-7xl mx-auto w-full custom-scrollbar">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {providers.map((p, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="p-8 rounded-[40px] bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:bg-white/[0.08] transition-all group relative overflow-hidden"
                                >
                                    <div className="relative z-10">
                                        <div className={`w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${p.color}`}>
                                            <p.icon className="w-8 h-8" />
                                        </div>

                                        <h3 className="text-2xl font-bold text-white mb-1 uppercase tracking-tight">{p.name}</h3>
                                        <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-6">{p.type}</p>

                                        <div className="flex items-center justify-between mt-auto">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
                                                <span className="text-xs font-bold text-white/80 uppercase tracking-widest">{p.status}</span>
                                            </div>
                                            <span className="text-[10px] text-white/20 font-black uppercase">{p.latency}</span>
                                        </div>
                                    </div>

                                    {/* Glass Card Background Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </motion.div>
                            ))}

                            {/* Add New Connector */}
                            <button className="p-8 rounded-[40px] border-2 border-dashed border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group flex flex-col items-center justify-center gap-4 min-h-[300px]">
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <span className="text-4xl text-white/20 group-hover:text-emerald-400 transition-colors">+</span>
                                </div>
                                <span className="text-sm font-black text-white/20 group-hover:text-emerald-400 transition-colors uppercase tracking-[0.3em]">Add Integration</span>
                            </button>
                        </div>
                    </div>

                    {/* Footer Status */}
                    <div className="p-8 bg-black/40 backdrop-blur-3xl border-t border-white/5 flex justify-between items-center text-left">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-emerald-500" />
                                <span className="text-xs font-black text-white/40 uppercase tracking-widest">Protocol 4.0 Secure</span>
                            </div>
                            <div className="w-px h-6 bg-white/10" />
                            <div className="flex items-center gap-2">
                                <Globe className="w-5 h-5 text-blue-400" />
                                <span className="text-xs font-black text-white/40 uppercase tracking-widest">Global Sync Active</span>
                            </div>
                        </div>
                        <p className="text-[10px] font-black text-white/10 uppercase tracking-[1em]">FarmTech Integrated Platform</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
