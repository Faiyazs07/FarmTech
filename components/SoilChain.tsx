'use client';

interface SoilChainProps {
  moisture: number;
  nitrate: number;
  effectivePrice: number;
}

export default function SoilChain({ moisture, nitrate, effectivePrice }: SoilChainProps) {
  const nodes = [
    { icon: '💧', label: 'Moisture', value: `${moisture.toFixed(1)}%` },
    { icon: '🧪', label: 'Nitrate', value: `${nitrate.toFixed(0)} ppm` },
    { icon: '💷', label: 'Effective', value: `£${effectivePrice.toFixed(0)}/t` },
  ];

  return (
    <div className="space-y-2">
      <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] border-b border-white/5 pb-2">
        Soil → Nitrate → Value Chain
      </h3>
      <div className="flex items-center gap-1 bg-white/5 rounded-xl p-3">
        {nodes.map((node, i) => (
          <div key={node.label} className="flex items-center gap-1 flex-1">
            <div className="flex-1 flex flex-col items-center gap-1">
              <span className="text-lg">{node.icon}</span>
              <span className="text-[9px] text-white/40 uppercase tracking-widest font-black">{node.label}</span>
              <span className="text-sm font-bold text-white">{node.value}</span>
            </div>
            {i < nodes.length - 1 && (
              <span className="text-white/20 text-sm shrink-0">→</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
