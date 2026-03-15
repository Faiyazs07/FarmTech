import { motion, AnimatePresence } from 'framer-motion';
import { X, Thermometer, Droplets, AlertTriangle, Menu } from 'lucide-react';
import { useState } from 'react';

export default function UIOverlay({ activeZone, farmData, onClose }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden font-sans">
      {/* Brand Logo - Top Left */}
      <div className="pointer-events-auto absolute top-6 left-6 flex items-center gap-4">
        <div className="bg-[#2d5a27] p-3 rounded-xl shadow-2xl border border-white/20">
          <div className="w-8 h-8 border-2 border-white/40 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
          </div>
        </div>
        <div className="text-white drop-shadow-xl text-left">
          <p className="font-black text-2xl leading-none uppercase tracking-tighter">DOWNS PALACE</p>
          <p className="text-[9px] font-bold tracking-[0.4em] opacity-60 uppercase">Future of Agriculture</p>
        </div>
      </div>

      {/* Hamburger Menu - Top Right */}
      <div className="pointer-events-auto absolute top-6 right-6 flex items-center gap-4">
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all group"
        >
          <Menu className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Sidebar Detail Panel */}
      <AnimatePresence>
        {activeZone && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="pointer-events-auto absolute top-0 right-0 h-full w-full max-w-md bg-[#0a1a08]/95 backdrop-blur-md border-l border-white/10 z-[60] flex flex-col"
          >
            {/* Header */}
            <div className="p-8 pb-4 flex justify-between items-center bg-gradient-to-b from-[#2d5a27]/20 to-transparent">
              <div className="text-left">
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-tight mt-1">{activeZone.name}</h2>
              </div>
              <button 
                onClick={onClose} 
                className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Main Content */}
            <div className="p-8 flex-1 overflow-y-auto custom-scrollbar text-left">
              <p className="text-white/70 leading-relaxed mb-10 text-lg font-light italic">
                "{activeZone.description || 'Welcome to the core of our sustainable operations where technology meets nature to define the future of food.'}"
              </p>

              <div className="mt-16 space-y-4">
                <button className="w-full bg-white text-[#0a1a08] font-black py-5 rounded-2xl uppercase tracking-widest text-xs shadow-2xl hover:-translate-y-1 transition-all">
                  Access Central Hub
                </button>
                <button onClick={onClose} className="w-full border border-white/10 text-white/40 font-bold py-5 rounded-2xl uppercase tracking-widest text-xs hover:bg-white/5 transition-all">
                  Return to Overview
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-auto absolute inset-0 bg-[#0a1a08]/98 backdrop-blur-3xl z-[100] flex flex-col items-center justify-center p-8"
          >
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-8 right-8 p-4 bg-white/5 hover:bg-white/10 rounded-full transition-all"
            >
              <X className="w-8 h-8 text-white" />
            </button>
            
            <nav className="flex flex-col items-center gap-12">
              <MenuLink label="Our History" active />
              <MenuLink label="Sustainability" />
              <MenuLink label="Technology" />
              <MenuLink label="Global Impact" />
              <MenuLink label="Get Involved" />
            </nav>

            <div className="mt-24 text-center">
              <p className="text-white/20 text-[10px] font-black uppercase tracking-[1em]">Downs Palace &copy; 2026</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuLink({ label, active }) {
  return (
    <button className={`text-5xl font-black uppercase tracking-tighter transition-all hover:scale-105 active:scale-95 ${active ? 'text-white' : 'text-white/30 hover:text-white'}`}>
      {label}
    </button>
  );
}

function StatGroup({ title, children }) {
  return (
    <div className="space-y-6">
      <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] border-b border-white/5 pb-2">{title}</h3>
      <div className="space-y-6">{children}</div>
    </div>
  );
}

function DetailBox({ label, value, pulse }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">{label}</p>
      <div className="flex items-center gap-2">
        <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
        {pulse && <div className="w-2 h-2 bg-[#8fb339] rounded-full animate-pulse shadow-[0_0_10px_#8fb339]" />}
      </div>
    </div>
  );
}
