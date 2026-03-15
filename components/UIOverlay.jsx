import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Zap } from 'lucide-react';
import dynamic from 'next/dynamic';
import {
  CROP_DATA,
  CROP_TO_FIELD,
  FALLBACK_BUYERS,
  FALLBACK_SOIL_READINGS,
  FALLBACK_YIELD_HISTORY,
  FALLBACK_FIELD_EVENTS,
} from '../mock-data';

const WeatherWidget = dynamic(() => import('./WeatherWidget'), { ssr: false });
const SoilChain = dynamic(() => import('./SoilChain'), { ssr: false });
const YieldHistoryChart = dynamic(() => import('./YieldHistoryChart'), { ssr: false });
const BuyersPanel = dynamic(() => import('./BuyersPanel'), { ssr: false });

export default function UIOverlay({ activeZone, farmData, onClose }) {
  const cropData = activeZone?.cropType ? CROP_DATA[activeZone.cropType] : null;

  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden font-sans">
      {/* Brand Logo */}
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

      {/* Weather Widget */}
      <div className="pointer-events-auto">
        <WeatherWidget />
      </div>

      {/* Sidebar */}
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
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[10px] font-bold text-[#8fb339] uppercase tracking-[0.3em]"
                >
                  Discovery Point
                </motion.span>
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-tight mt-1">
                  {activeZone.name}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="px-8 pb-2 flex-1 overflow-y-auto custom-scrollbar text-left flex flex-col">
              <p className="text-white/70 leading-relaxed mb-6 text-lg font-light italic">
                "{activeZone.description || 'Welcome to the core of our sustainable operations where technology meets nature to define the future of food.'}"
              </p>

              {cropData ? (
                <TabbedCropPanel cropData={cropData} cropType={activeZone.cropType} />
              ) : (
                <GenericPanel farmData={farmData} />
              )}

              <div className="mt-8 space-y-4 pb-8">
                <button className="w-full bg-white text-[#0a1a08] font-black py-5 rounded-2xl uppercase tracking-widest text-xs shadow-2xl hover:-translate-y-1 transition-all">
                  Access Central Hub
                </button>
                <button
                  onClick={onClose}
                  className="w-full border border-white/10 text-white/40 font-bold py-5 rounded-2xl uppercase tracking-widest text-xs hover:bg-white/5 transition-all"
                >
                  Return to Overview
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Tabbed Crop Panel ─────────────────────────────────────────────────────────

function TabbedCropPanel({ cropData, cropType }) {
  const [activeTab, setActiveTab] = useState('current');

  const fieldId = CROP_TO_FIELD[cropType];

  // Derive soil data from seed
  const latestSoil = FALLBACK_SOIL_READINGS.find((s) => s.field_id === fieldId)
    ?? { moisture_pct: 14, nitrate_ppm: 60, ph: 6.8, organic_matter_pct: 3.0 };
  const qualityScore = 1 + (latestSoil.nitrate_ppm - 50) / 200;

  // Buyers for this crop with effective price applied
  const buyers = FALLBACK_BUYERS
    .filter((b) => b.crop_type === cropType)
    .map((b) => ({
      ...b,
      quality_score: qualityScore,
      effective_price: Math.round(b.price_per_tonne * qualityScore * 100) / 100,
    }));

  // Best effective price (for soil chain display)
  const bestPrice = buyers.reduce((max, b) => Math.max(max, b.effective_price ?? 0), 0);

  // History / events for this field
  const history = FALLBACK_YIELD_HISTORY.filter((h) => h.field_id === fieldId);
  const events = FALLBACK_FIELD_EVENTS.filter((e) => e.field_id === fieldId);

  const tabs = [
    { id: 'current', label: 'Current' },
    { id: 'history', label: 'History' },
    { id: 'buyers', label: 'Buyers' },
  ];

  return (
    <div className="flex flex-col gap-4 flex-1">
      {/* Tab bar */}
      <div className="flex gap-1 bg-white/5 rounded-xl p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === tab.id
                ? 'bg-[#2d5a27] text-white'
                : 'text-white/30 hover:text-white/60'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'current' && (
        <CropPanel
          cropData={cropData}
          moisture={latestSoil.moisture_pct}
          nitrate={latestSoil.nitrate_ppm}
          effectivePrice={bestPrice || Math.round(198 * qualityScore)}
        />
      )}

      {activeTab === 'history' && (
        <YieldHistoryChart history={history} events={events} />
      )}

      {activeTab === 'buyers' && (
        <BuyersPanel
          buyers={buyers}
          cropData={cropData}
          nitrate={latestSoil.nitrate_ppm}
          qualityScore={qualityScore}
        />
      )}
    </div>
  );
}

// ── Current tab content ───────────────────────────────────────────────────────

function CropPanel({ cropData, moisture, nitrate, effectivePrice }) {
  const { metrics, yield: yieldData, trend, forecast, recommendation, urgency } = cropData;
  const primaryMetric = metrics[0];

  const minVal = Math.min(...trend);
  const maxVal = Math.max(...trend);
  const range = maxVal - minVal || 1;
  const W = 220, H = 48;
  const points = trend.map((v, i) => {
    const x = (i / (trend.length - 1)) * W;
    const y = H - ((v - minVal) / range) * (H - 8) - 4;
    return `${x},${y}`;
  }).join(' ');

  const isTrendingUp = trend[trend.length - 1] >= trend[0];

  const urgencyConfig = {
    high: { border: 'border-red-500/50', bg: 'bg-red-500/10', text: 'text-red-400', Icon: AlertTriangle },
    medium: { border: 'border-amber-400/50', bg: 'bg-amber-400/10', text: 'text-amber-400', Icon: Zap },
    low: { border: 'border-[#8fb339]/50', bg: 'bg-[#8fb339]/10', text: 'text-[#8fb339]', Icon: CheckCircle },
  };
  const uc = urgencyConfig[urgency];

  return (
    <div className="space-y-8">
      {/* Quality Metrics */}
      <div className="space-y-6">
        <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] border-b border-white/5 pb-2">
          Quality Metrics
        </h3>
        <div className="space-y-5">
          {metrics.map((m) => {
            const ratio = m.value / m.target;
            const barPct = Math.min(ratio * 100, 100);
            const barColor = ratio >= 1 ? '#8fb339' : ratio >= 0.9 ? '#fbbf24' : '#ef4444';
            return (
              <div key={m.key} className="space-y-1.5">
                <div className="flex justify-between items-baseline">
                  <span className="text-[10px] text-white/40 uppercase font-black tracking-widest">{m.label}</span>
                  <span className="text-xs text-white/30">target {m.target}{m.unit}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${barPct}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: barColor }}
                    />
                  </div>
                  <span className="text-base font-bold text-white w-20 text-right">
                    {m.value}{m.unit}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Yield Summary */}
      {yieldData && (() => {
        const yRatio = yieldData.current / yieldData.target;
        const yPct = Math.min(yRatio * 100, 100);
        const yColor = yRatio >= 1 ? '#8fb339' : yRatio >= 0.85 ? '#fbbf24' : '#ef4444';
        const totalTonnes = (yieldData.current * yieldData.area).toFixed(0);
        return (
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] border-b border-white/5 pb-2">
              Yield Projection
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <p className="text-[9px] text-white/30 uppercase tracking-widest mb-1">Projected</p>
                <p className="text-xl font-black text-white">{yieldData.current}</p>
                <p className="text-[9px] text-white/40">{yieldData.unit}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <p className="text-[9px] text-white/30 uppercase tracking-widest mb-1">Target</p>
                <p className="text-xl font-black text-white/60">{yieldData.target}</p>
                <p className="text-[9px] text-white/40">{yieldData.unit}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <p className="text-[9px] text-white/30 uppercase tracking-widest mb-1">Total Est.</p>
                <p className="text-xl font-black text-white">{totalTonnes}</p>
                <p className="text-[9px] text-white/40">tonnes</p>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px]">
                <span className="text-white/30 uppercase tracking-widest font-black">vs Target</span>
                <span className="font-bold" style={{ color: yColor }}>{Math.round(yRatio * 100)}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${yPct}%` }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: yColor }}
                />
              </div>
              <p className="text-[10px] text-white/30">{yieldData.area} ha under cultivation</p>
            </div>
          </div>
        );
      })()}

      {/* Soil Chain */}
      <SoilChain moisture={moisture} nitrate={nitrate} effectivePrice={effectivePrice} />

      {/* 7-Day Sparkline */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] border-b border-white/5 pb-2">
          7-Day {primaryMetric.label} Trend
        </h3>
        <div className="bg-white/5 rounded-xl p-4">
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="w-full">
            <polyline
              points={points}
              fill="none"
              stroke="#8fb339"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {trend.map((v, i) => {
              const x = (i / (trend.length - 1)) * W;
              const y = H - ((v - minVal) / range) * (H - 8) - 4;
              return <circle key={i} cx={x} cy={y} r="3" fill="#8fb339" opacity="0.8" />;
            })}
          </svg>
          <div className="flex justify-between mt-1">
            {trend.map((v, i) => (
              <span key={i} className="text-[9px] text-white/30">{v}{primaryMetric.unit}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Outlook */}
      <div className="space-y-2">
        <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] border-b border-white/5 pb-2">
          Outlook
        </h3>
        <div className="flex items-start gap-2">
          {isTrendingUp
            ? <TrendingUp className="w-4 h-4 text-[#8fb339] mt-0.5 shrink-0" />
            : <TrendingDown className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />}
          <p className="text-white/60 text-sm italic leading-relaxed">{forecast}</p>
        </div>
      </div>

      {/* Recommendation */}
      <div className={`border rounded-xl p-4 ${uc.border} ${uc.bg}`}>
        <div className="flex items-center gap-2 mb-2">
          <uc.Icon className={`w-4 h-4 ${uc.text}`} />
          <span className={`text-[10px] font-black uppercase tracking-widest ${uc.text}`}>
            {urgency === 'high' ? 'Urgent Action' : urgency === 'medium' ? 'Recommended' : 'Advisory'}
          </span>
        </div>
        <p className="text-white/80 text-sm font-bold leading-relaxed">{recommendation}</p>
      </div>
    </div>
  );
}

// ── Generic panel ─────────────────────────────────────────────────────────────

function GenericPanel({ farmData }) {
  return (
    <div className="space-y-10">
      <StatGroup title="Current Status">
        <DetailBox label="System Health" value="Operational" pulse />
        <DetailBox label="Efficiency" value="98.4%" />
      </StatGroup>
      <StatGroup title="Performance Metrics">
        <div className="grid grid-cols-2 gap-6">
          <DetailBox label="Temp Control" value={`${farmData.temperature}°C`} />
          <DetailBox label="Soil Health" value={`${farmData.soilMoisture}%`} />
          <DetailBox label="Energy Load" value="Optimal" />
          <DetailBox label="Output" value="Maximized" />
        </div>
      </StatGroup>
    </div>
  );
}

function StatGroup({ title, children }) {
  return (
    <div className="space-y-6">
      <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] border-b border-white/5 pb-2">
        {title}
      </h3>
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
