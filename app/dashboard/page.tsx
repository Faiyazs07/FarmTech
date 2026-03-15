'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import SoilChain from '@/components/SoilChain';
import {
  CROP_DATA,
  FALLBACK_BUYERS,
  FALLBACK_SOIL_READINGS,
  FALLBACK_FIELD_EVENTS,
  FALLBACK_YIELD_HISTORY,
  CROP_TO_FIELD,
  EQUIPMENT,
  COMMODITY_PRICES,
  type Equipment,
} from '@/mock-data';

const WeatherWidget = dynamic(() => import('@/components/WeatherWidget'), { ssr: false });

// ── Static constants ──────────────────────────────────────────────────────────

const WEEK_FORECAST = [
  { day: 'Mon', icon: '☀️', high: 18, low: 10, rainPct: 5 },
  { day: 'Tue', icon: '⛅', high: 16, low: 9, rainPct: 20 },
  { day: 'Wed', icon: '🌧', high: 13, low: 8, rainPct: 75 },
  { day: 'Thu', icon: '🌧', high: 12, low: 7, rainPct: 85 },
  { day: 'Fri', icon: '⛅', high: 15, low: 9, rainPct: 30 },
  { day: 'Sat', icon: '☀️', high: 17, low: 10, rainPct: 10 },
  { day: 'Sun', icon: '☀️', high: 19, low: 11, rainPct: 5 },
];

const ACTIONS = [
  { id: 'a1', priority: 'high',   text: 'Apply sulphur to barley (15 kg/ha foliar spray)' },
  { id: 'a2', priority: 'high',   text: 'Book sprayer service — Amazone UX 5200 overdue' },
  { id: 'a3', priority: 'high',   text: 'Apply flea beetle pesticide to canola before rain (Wed)' },
  { id: 'a4', priority: 'medium', text: 'Apply foliar urea to wheat before Wednesday (20 kg/ha)' },
  { id: 'a5', priority: 'medium', text: 'Scout peas for aphanomyces root rot' },
  { id: 'a6', priority: 'medium', text: 'Book tractor oil change (9,800 / 10,000 km)' },
  { id: 'a7', priority: 'low',    text: 'Review canola sell position above £525/t' },
  { id: 'a8', priority: 'low',    text: 'Log weekly soil moisture readings' },
];

const AI_PREDICTIONS = [
  { icon: '🌧', text: 'Rain arriving Wednesday–Thursday (75–85% probability) — delay any spray applications until Friday.' },
  { icon: '🌾', text: 'Wheat protein gap projected to close in ~5 days if foliar urea applied this week.' },
  { icon: '🍺', text: 'Barley malt diastatic threshold at risk without sulphur input this week — contract penalty likely.' },
  { icon: '⚙️', text: 'Sprayer service overdue by 10 hours — calibration drift may be affecting application accuracy.' },
  { icon: '📈', text: 'Canola price recovery window above £525/t likely in 7–10 days based on EU export data trend.' },
];

// ── Score helpers ─────────────────────────────────────────────────────────────

function scoreColor(score: number) {
  if (score >= 85) return '#d4f591';
  if (score >= 70) return '#8fb339';
  if (score >= 40) return '#f59e0b';
  return '#ef4444';
}

function computeHealthScore() {
  const urgencyMult: Record<string, number> = { high: 0.6, medium: 0.85, low: 1.0 };

  const cropScores = Object.entries(CROP_DATA).map(([cropKey, crop]) => {
    const avgMetricRatio =
      crop.metrics.reduce((sum, m) => sum + Math.min(m.value / m.target, 1), 0) / crop.metrics.length;
    const yieldRatio = Math.min(crop.yield.current / crop.yield.target, 1);
    const base = ((avgMetricRatio + yieldRatio) / 2) * urgencyMult[crop.urgency] * 100;
    const fieldId = CROP_TO_FIELD[cropKey];
    const activeEvents = FALLBACK_FIELD_EVENTS.filter(e => e.field_id === fieldId && !e.resolved).length;
    return Math.max(0, base - activeEvents * 5);
  });
  const cropScore = cropScores.reduce((a, b) => a + b, 0) / cropScores.length;

  const equipMap: Record<string, number> = { ok: 1.0, due_soon: 0.5, overdue: 0.0 };
  const equipScore =
    (EQUIPMENT.reduce((sum, e) => sum + equipMap[e.status], 0) / EQUIPMENT.length) * 100;

  const weatherScore = 72;
  const total = Math.round(cropScore * 0.5 + equipScore * 0.25 + weatherScore * 0.25);
  return { total, cropScore: Math.round(cropScore), equipScore: Math.round(equipScore), weatherScore };
}

// ── Farm Health Score Ring ────────────────────────────────────────────────────

function HealthScoreRing() {
  const { total, cropScore, equipScore, weatherScore } = computeHealthScore();
  const r = 80;
  const circumference = 2 * Math.PI * r;
  const color = scoreColor(total);

  return (
    <div className="bg-white/5 rounded-3xl p-8 flex flex-col items-center gap-6">
      <h2 className="text-xs font-black text-white/30 uppercase tracking-[0.5em]">Farm Health Score</h2>
      <div className="relative flex items-center justify-center">
        <svg width="200" height="200" className="-rotate-90">
          <circle cx="100" cy="100" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
          <motion.circle
            cx="100" cy="100" r={r}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference * (1 - total / 100) }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-5xl font-black text-white">{total}</span>
          <span className="text-xs text-white/40 font-bold">/100</span>
        </div>
      </div>
      <div className="flex gap-10">
        {[
          { label: 'Crops',     score: cropScore,    weight: 50 },
          { label: 'Equipment', score: equipScore,   weight: 25 },
          { label: 'Weather',   score: weatherScore, weight: 25 },
        ].map(({ label, score, weight }) => (
          <div key={label} className="flex flex-col items-center gap-1">
            <span className="text-2xl font-black" style={{ color: scoreColor(score) }}>{score}</span>
            <span className="text-[10px] text-white/40 uppercase tracking-widest">{label}</span>
            <span className="text-[9px] text-white/20">×{weight}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Crop Performance Card ─────────────────────────────────────────────────────

const CROP_ICONS: Record<string, string> = { wheat: '🌾', canola: '🌻', peas: '🫛', barley: '🍺' };

const URGENCY_BADGE: Record<string, string> = {
  high:   'bg-red-500/20 text-red-400 border-red-500/30',
  medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  low:    'bg-[#8fb339]/20 text-[#8fb339] border-[#8fb339]/30',
};

function CropPerformanceCard({ cropKey }: { cropKey: string }) {
  const crop = CROP_DATA[cropKey];
  const fieldId = CROP_TO_FIELD[cropKey];
  const soil = FALLBACK_SOIL_READINGS.find(s => s.field_id === fieldId);
  const buyers = FALLBACK_BUYERS.filter(b => b.crop_type === cropKey);
  const bestBuyer = buyers.reduce((a, b) => (b.price_per_tonne > a.price_per_tonne ? b : a), buyers[0]);
  const nitrate = soil?.nitrate_ppm ?? 50;
  const effectivePrice = bestBuyer ? bestBuyer.price_per_tonne * (1 + (nitrate - 50) / 200) : 0;

  const healthPct = Math.round(
    (crop.metrics.reduce((s, m) => s + Math.min(m.value / m.target, 1), 0) / crop.metrics.length) * 100,
  );
  const yieldPct = Math.round((crop.yield.current / crop.yield.target) * 100);
  const primaryMetric = crop.metrics[0];

  return (
    <div className="bg-white/5 rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{CROP_ICONS[cropKey] ?? '🌱'}</span>
          <div>
            <p className="text-sm font-black text-white capitalize">{cropKey}</p>
            <p className="text-[10px] text-white/40">{crop.yield.area} ha</p>
          </div>
        </div>
        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg border ${URGENCY_BADGE[crop.urgency]}`}>
          {crop.urgency}
        </span>
      </div>

      {/* Crop health bar */}
      <div>
        <div className="flex justify-between text-[10px] text-white/40 mb-1">
          <span>Crop Health</span><span>{healthPct}%</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: scoreColor(healthPct) }}
            initial={{ width: 0 }}
            animate={{ width: `${healthPct}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Primary metric */}
      <div className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2">
        <span className="text-[11px] text-white/50">{primaryMetric.label}</span>
        <span className="text-sm font-black text-white">
          {primaryMetric.value}{primaryMetric.unit}
          <span className="text-white/30 font-normal"> / {primaryMetric.target}{primaryMetric.unit}</span>
        </span>
      </div>

      {/* Yield progress */}
      <div>
        <div className="flex justify-between text-[10px] text-white/40 mb-1">
          <span>Yield</span>
          <span>{crop.yield.current} / {crop.yield.target} {crop.yield.unit} ({yieldPct}%)</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-[#8fb339]"
            initial={{ width: 0 }}
            animate={{ width: `${yieldPct}%` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Soil chain */}
      {soil && (
        <SoilChain
          moisture={soil.moisture_pct}
          nitrate={soil.nitrate_ppm}
          effectivePrice={effectivePrice}
        />
      )}
    </div>
  );
}

// ── Equipment Card ────────────────────────────────────────────────────────────

const EQUIP_STATUS_STYLES: Record<string, { bar: string; badge: string }> = {
  ok:       { bar: 'bg-[#8fb339]',  badge: 'bg-[#8fb339]/20 text-[#8fb339] border-[#8fb339]/30' },
  due_soon: { bar: 'bg-amber-500',  badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  overdue:  { bar: 'bg-red-500',    badge: 'bg-red-500/20 text-red-400 border-red-500/30' },
};

const STATUS_LABEL: Record<string, string> = { ok: 'OK', due_soon: 'Due Soon', overdue: 'Overdue' };

function EquipmentCard({ equip }: { equip: Equipment }) {
  const useKm = equip.type === 'tractor' && equip.current_km != null;
  const current = useKm ? equip.current_km! : equip.current_hours;
  const max = useKm ? equip.service_interval_km! : equip.service_interval_hours;
  const pct = Math.min((current / max) * 100, 100);
  const sc = EQUIP_STATUS_STYLES[equip.status];

  return (
    <div className="bg-white/5 rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="text-2xl">{equip.icon}</span>
        <div className="min-w-0">
          <p className="text-xs font-black text-white truncate">{equip.name}</p>
          <p className="text-[10px] text-white/40 capitalize">{equip.type}</p>
        </div>
      </div>
      <div className="text-xs text-white/60">
        {current.toLocaleString()} {useKm ? 'km' : 'hrs'} / {max.toLocaleString()} {useKm ? 'km' : 'hrs'}
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${sc.bar}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
      </div>
      <span
        className={`self-start text-[10px] font-black uppercase px-2 py-1 rounded-lg border ${sc.badge} ${equip.status === 'overdue' ? 'animate-pulse' : ''}`}
      >
        {STATUS_LABEL[equip.status]}
      </span>
    </div>
  );
}

// ── Commodity signal pill styles ──────────────────────────────────────────────

const SIGNAL_PILL: Record<string, string> = {
  sell:  'bg-[#8fb339]/20 text-[#8fb339] border-[#8fb339]/30',
  watch: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  hold:  'bg-white/10 text-white/50 border-white/20',
};

// ── Report download (HTML blob) ───────────────────────────────────────────────

function downloadReport(year: number) {
  const rows = FALLBACK_YIELD_HISTORY.filter(y => y.season_year === year);
  const events = FALLBACK_FIELD_EVENTS.filter(e => e.event_date.startsWith(String(year)));
  const generated = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>Downs Palace — ${year} Season Report</title>
<style>
  body { font-family: system-ui, sans-serif; max-width: 900px; margin: 40px auto; padding: 0 24px; color: #1a1a1a; }
  h1 { font-size: 2rem; font-weight: 900; text-transform: uppercase; border-bottom: 3px solid #8fb339; padding-bottom: 12px; margin-bottom: 4px; }
  h2 { font-size: 1.1rem; font-weight: 700; margin-top: 2rem; color: #3a5a00; }
  p.meta { color: #6b7280; font-size: 0.85rem; margin: 0 0 1.5rem; }
  table { width: 100%; border-collapse: collapse; margin-top: 0.75rem; }
  th { background: #8fb339; color: white; padding: 8px 12px; text-align: left; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; }
  td { padding: 8px 12px; border-bottom: 1px solid #e5e7eb; font-size: 0.9rem; }
  tr:nth-child(even) td { background: #f9fafb; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 99px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; }
  .high   { background: #fee2e2; color: #b91c1c; }
  .medium { background: #fef3c7; color: #b45309; }
  .low    { background: #f0fdf4; color: #166534; }
  @media print { body { margin: 20px; } }
</style>
</head>
<body>
<h1>Downs Palace — ${year} Season Report</h1>
<p class="meta">Generated ${generated}</p>
<h2>Yield Summary</h2>
<table>
  <thead><tr><th>Field</th><th>Crop</th><th>Area (ha)</th><th>Projected (t/ha)</th><th>Actual (t/ha)</th><th>Revenue (£)</th></tr></thead>
  <tbody>
    ${rows.map(r => `<tr><td>${r.field_id}</td><td style="text-transform:capitalize">${r.crop_type}</td><td>${r.area_ha}</td><td>${r.projected_yield}</td><td>${r.actual_yield ?? '—'}</td><td>${r.gross_revenue != null ? '£' + r.gross_revenue.toLocaleString() : '—'}</td></tr>`).join('\n    ')}
  </tbody>
</table>
<h2>Field Events</h2>
<table>
  <thead><tr><th>Date</th><th>Field</th><th>Type</th><th>Severity</th><th>Description</th><th>Resolved</th></tr></thead>
  <tbody>
    ${events.length > 0 ? events.map(e => `<tr><td>${e.event_date}</td><td>${e.field_id}</td><td style="text-transform:capitalize">${e.event_type}</td><td><span class="badge ${e.severity}">${e.severity}</span></td><td>${e.description}</td><td>${e.resolved ? '✓' : '✗'}</td></tr>`).join('\n    ') : '<tr><td colspan="6" style="text-align:center;color:#9ca3af">No events recorded for this season</td></tr>'}
  </tbody>
</table>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `downs-palace-${year}-season-report.html`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Main Dashboard Page ───────────────────────────────────────────────────────

export default function DashboardPage() {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setChecked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <main className="min-h-screen bg-[#0a1a08] text-white p-6 md:p-8 max-w-7xl mx-auto">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Downs Palace</h1>
          <p className="text-xs text-white/40 uppercase tracking-[0.4em] mt-1">Farm Dashboard</p>
        </div>
        <Link
          href="/"
          className="px-4 py-2 rounded-xl border border-white/20 text-xs font-black uppercase tracking-widest text-white/60 hover:text-white hover:border-white/40 transition-all"
        >
          ← Back to Farm
        </Link>
      </div>

      {/* ── Farm Health Score ── */}
      <section className="mb-6">
        <HealthScoreRing />
      </section>

      {/* ── Crop Performance + Weather ── */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <h2 className="text-xs font-black text-white/30 uppercase tracking-[0.5em] mb-4">Crop Performance</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {['wheat', 'canola', 'peas', 'barley'].map(key => (
              <CropPerformanceCard key={key} cropKey={key} />
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <h2 className="text-xs font-black text-white/30 uppercase tracking-[0.5em] mb-4">Weather</h2>
          <div className="relative w-full h-[220px] overflow-hidden rounded-2xl mb-4 bg-[#0a1a08]/60 border border-white/5">
            <WeatherWidget />
          </div>

          {/* 7-day forecast */}
          <div className="bg-white/5 rounded-2xl p-4">
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-3">7-Day Forecast</p>
            <div className="grid grid-cols-7 gap-1">
              {WEEK_FORECAST.map(d => (
                <div key={d.day} className="flex flex-col items-center gap-1">
                  <span className="text-[9px] text-white/40 font-bold">{d.day}</span>
                  <span className="text-sm">{d.icon}</span>
                  <span className="text-[9px] text-white font-bold">{d.high}°</span>
                  <span className="text-[9px] text-white/40">{d.low}°</span>
                  {/* Rain probability bar */}
                  <div className="w-full h-8 flex items-end bg-white/5 rounded overflow-hidden">
                    <div
                      className="w-full bg-blue-400/60 rounded"
                      style={{ height: `${d.rainPct}%` }}
                    />
                  </div>
                  <span className="text-[8px] text-blue-300/70">{d.rainPct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Equipment Maintenance ── */}
      <section className="mb-6">
        <h2 className="text-xs font-black text-white/30 uppercase tracking-[0.5em] mb-4">Equipment Maintenance</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {EQUIPMENT.map(e => <EquipmentCard key={e.id} equip={e} />)}
        </div>
      </section>

      {/* ── Commodity Prices + AI Predictions ── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div>
          <h2 className="text-xs font-black text-white/30 uppercase tracking-[0.5em] mb-4">Commodity Prices</h2>
          <div className="bg-white/5 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  {['Crop', '£/t', '7-day Δ', 'Signal'].map((h, i) => (
                    <th
                      key={h}
                      className={`px-4 py-3 text-[10px] font-black text-white/30 uppercase tracking-widest ${i === 0 ? 'text-left' : i === 3 ? 'text-center' : 'text-right'}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMMODITY_PRICES.map(c => (
                  <tr key={c.crop} className="border-b border-white/5 hover:bg-white/5 transition-colors" title={c.signal_reason}>
                    <td className="px-4 py-3 text-sm font-bold text-white">{c.label}</td>
                    <td className="px-4 py-3 text-sm font-black text-right text-white">£{c.price_per_tonne}</td>
                    <td className="px-4 py-3 text-sm text-right">
                      <span className={`flex items-center justify-end gap-1 ${c.week_delta >= 0 ? 'text-[#8fb339]' : 'text-red-400'}`}>
                        {c.week_delta >= 0
                          ? <TrendingUp className="w-3 h-3" />
                          : <TrendingDown className="w-3 h-3" />}
                        {c.week_delta >= 0 ? '+' : ''}£{Math.abs(c.week_delta).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg border ${SIGNAL_PILL[c.signal]}`}>
                        {c.signal}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-xs font-black text-white/30 uppercase tracking-[0.5em] mb-4">AI Predictions</h2>
          <div className="flex flex-col gap-3">
            {AI_PREDICTIONS.map((p, i) => (
              <div key={i} className="bg-white/5 rounded-2xl px-4 py-3 flex gap-3 items-start">
                <span className="text-xl shrink-0">{p.icon}</span>
                <p className="text-xs text-white/70 leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Actions Checklist ── */}
      <section className="mb-6">
        <h2 className="text-xs font-black text-white/30 uppercase tracking-[0.5em] mb-4">Actions To Take</h2>
        <div className="bg-white/5 rounded-2xl p-4 flex flex-col gap-1">
          {ACTIONS.map(action => {
            const done = checked.has(action.id);
            const priorityBadge: Record<string, string> = {
              high:   'bg-red-500/20 text-red-400 border-red-500/30',
              medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
              low:    'bg-white/10 text-white/40 border-white/20',
            };
            return (
              <button
                key={action.id}
                onClick={() => toggle(action.id)}
                className={`flex items-center gap-3 text-left px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all ${done ? 'opacity-40' : ''}`}
              >
                <div
                  className={`w-5 h-5 shrink-0 rounded-md border-2 flex items-center justify-center transition-all ${
                    done ? 'bg-[#8fb339] border-[#8fb339]' : 'border-white/20'
                  }`}
                >
                  {done && <span className="text-black text-[10px] font-black leading-none">✓</span>}
                </div>
                <span className={`flex-1 text-sm text-white ${done ? 'line-through' : ''}`}>{action.text}</span>
                <span className={`shrink-0 text-[9px] font-black uppercase px-2 py-0.5 rounded border ${priorityBadge[action.priority]}`}>
                  {action.priority}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Season Reports ── */}
      <section>
        <h2 className="text-xs font-black text-white/30 uppercase tracking-[0.5em] mb-4">Season Reports</h2>
        <div className="flex gap-4 flex-wrap">
          {[2023, 2024].map(year => (
            <button
              key={year}
              onClick={() => downloadReport(year)}
              className="px-6 py-3 rounded-xl border border-[#8fb339]/40 text-[#8fb339] text-sm font-black uppercase tracking-widest hover:bg-[#8fb339]/10 transition-all"
            >
              Download {year} Season Report
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
