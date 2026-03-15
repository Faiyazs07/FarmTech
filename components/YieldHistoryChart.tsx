'use client';

import { YieldHistory, FieldEvent } from '../mock-data';

interface Props {
  history: YieldHistory[];
  events: FieldEvent[];
}

const EVENT_ICONS: Record<string, string> = {
  pest: '🐛',
  disease: '🦠',
  drought: '☀️',
  storm: '⛈️',
  input: '💊',
};

const SEVERITY_COLORS: Record<string, string> = {
  high: 'text-red-400 border-red-500/40 bg-red-500/10',
  medium: 'text-amber-400 border-amber-400/40 bg-amber-400/10',
  low: 'text-[#8fb339] border-[#8fb339]/40 bg-[#8fb339]/10',
};

export default function YieldHistoryChart({ history, events }: Props) {
  if (!history.length) {
    return <p className="text-white/30 text-sm">No history data available.</p>;
  }

  const allValues = history.flatMap((h) => [h.projected_yield, h.actual_yield ?? 0]);
  const maxVal = Math.max(...allValues, 1);

  const W = 280;
  const H = 100;
  const BAR_W = 20;
  const GAP = 8;
  const GROUP_W = BAR_W * 2 + GAP + 20;

  return (
    <div className="space-y-6">
      {/* Bar chart */}
      <div className="space-y-2">
        <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] border-b border-white/5 pb-2">
          Year-on-Year Yield
        </h4>
        <div className="bg-white/5 rounded-xl p-4 overflow-x-auto">
          <svg width={W} height={H + 24} viewBox={`0 0 ${W} ${H + 24}`} className="w-full">
            {[0.25, 0.5, 0.75, 1].map((f) => (
              <line key={f} x1={0} y1={H - f * H} x2={W} y2={H - f * H}
                stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            ))}

            {history.map((entry, i) => {
              const projH = (entry.projected_yield / maxVal) * H;
              const actH = entry.actual_yield !== null ? (entry.actual_yield / maxVal) * H : 0;
              const gx = i * GROUP_W + 10;

              return (
                <g key={entry.season_year}>
                  <rect x={gx} y={H - projH} width={BAR_W} height={projH} rx={3}
                    fill="rgba(143,179,57,0.35)" />
                  {entry.actual_yield !== null ? (
                    <rect x={gx + BAR_W + GAP} y={H - actH} width={BAR_W} height={actH} rx={3}
                      fill="#8fb339" />
                  ) : (
                    <rect x={gx + BAR_W + GAP} y={H - projH} width={BAR_W} height={projH} rx={3}
                      fill="rgba(143,179,57,0.15)" strokeDasharray="3,2"
                      stroke="#8fb339" strokeWidth="1" />
                  )}
                  <text x={gx + BAR_W + GAP / 2} y={H + 14} textAnchor="middle"
                    fontSize="9" fill="rgba(255,255,255,0.3)" fontFamily="sans-serif">
                    {entry.season_year}
                  </text>
                </g>
              );
            })}
          </svg>
          <div className="flex gap-4 mt-1">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-[#8fb339]/35 border border-[#8fb339]/50" />
              <span className="text-[9px] text-white/30">Projected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-[#8fb339]" />
              <span className="text-[9px] text-white/30">Actual</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm border border-dashed border-[#8fb339] bg-[#8fb339]/15" />
              <span className="text-[9px] text-white/30">In progress</span>
            </div>
          </div>
        </div>
      </div>

      {/* Season summary rows */}
      <div className="space-y-2">
        <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] border-b border-white/5 pb-2">
          Season Summary
        </h4>
        <div className="space-y-2">
          {history.map((h) => {
            const delta = h.actual_yield !== null ? h.actual_yield - h.projected_yield : null;
            const deltaColor = delta === null ? 'text-white/30'
              : delta >= 0 ? 'text-[#8fb339]' : 'text-red-400';
            return (
              <div key={h.season_year}
                className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
                <span className="text-xs font-bold text-white/60">{h.season_year}</span>
                <span className="text-xs text-white/50">
                  {h.actual_yield !== null
                    ? `${h.actual_yield} t/ha`
                    : `${h.projected_yield} t/ha proj.`}
                </span>
                {h.gross_revenue !== null && (
                  <span className="text-xs text-white/40">£{h.gross_revenue.toLocaleString()}</span>
                )}
                {delta !== null ? (
                  <span className={`text-[10px] font-bold ${deltaColor}`}>
                    {delta >= 0 ? '+' : ''}{delta.toFixed(1)} t/ha
                  </span>
                ) : (
                  <span className="text-[10px] text-white/20">current</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Problem log */}
      {events.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] border-b border-white/5 pb-2">
            Problem Log
          </h4>
          <div className="space-y-2 max-h-56 overflow-y-auto custom-scrollbar pr-1">
            {events.map((ev, i) => {
              const sc = SEVERITY_COLORS[ev.severity] ?? SEVERITY_COLORS.low;
              const icon = EVENT_ICONS[ev.event_type] ?? '📋';
              return (
                <div key={i} className={`border rounded-lg p-3 ${sc}`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{icon}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {ev.event_type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] opacity-50">{ev.event_date.slice(0, 10)}</span>
                      {ev.resolved ? (
                        <span className="text-[8px] bg-[#8fb339]/20 text-[#8fb339] px-1.5 py-0.5 rounded-full font-bold">
                          RESOLVED
                        </span>
                      ) : (
                        <span className="text-[8px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full font-bold animate-pulse">
                          ACTIVE
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-[10px] opacity-80 leading-relaxed">{ev.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
