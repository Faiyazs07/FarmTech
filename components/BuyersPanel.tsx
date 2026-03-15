'use client';

import { Buyer, CropData } from '../mock-data';

interface Props {
  buyers: Buyer[];
  cropData: CropData;
  nitrate: number;
  qualityScore: number;
}

const TYPE_LABELS: Record<string, string> = {
  mill: 'Mill',
  maltster: 'Maltster',
  crusher: 'Crusher',
  processor: 'Processor',
  'co-op': 'Co-op',
  exporter: 'Exporter',
};

const TYPE_COLORS: Record<string, string> = {
  mill: 'bg-blue-500/20 text-blue-400',
  maltster: 'bg-purple-500/20 text-purple-400',
  crusher: 'bg-orange-500/20 text-orange-400',
  processor: 'bg-cyan-500/20 text-cyan-400',
  'co-op': 'bg-[#8fb339]/20 text-[#8fb339]',
  exporter: 'bg-yellow-500/20 text-yellow-400',
};

const STATUS_COLORS: Record<string, string> = {
  contracted: 'bg-[#8fb339]/20 text-[#8fb339] border border-[#8fb339]/30',
  spot: 'bg-amber-400/20 text-amber-400 border border-amber-400/30',
  tender: 'bg-white/10 text-white/50 border border-white/10',
};

function GradeCheck({ pass, label }: { pass: boolean; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`text-sm ${pass ? 'text-[#8fb339]' : 'text-red-400'}`}>
        {pass ? '✓' : '✗'}
      </span>
      <span className={`text-[9px] font-bold ${pass ? 'text-white/50' : 'text-red-400/80'}`}>
        {label}
      </span>
    </div>
  );
}

export default function BuyersPanel({ buyers, cropData, nitrate, qualityScore }: Props) {
  if (!buyers.length) {
    return <p className="text-white/30 text-sm">No buyer data available.</p>;
  }

  const metricMap: Record<string, number> = {};
  cropData.metrics.forEach((m) => { metricMap[m.key] = m.value; });
  const grainMoisture = metricMap['moisture'] ?? null;

  return (
    <div className="space-y-4">
      {buyers.map((buyer) => {
        const effectivePrice = buyer.effective_price ?? buyer.price_per_tonne;
        const priceDelta = effectivePrice - buyer.price_per_tonne;

        const checks: { pass: boolean; label: string }[] = [];
        if (buyer.min_protein !== null) {
          const v = metricMap['protein'] ?? 0;
          checks.push({ pass: v >= buyer.min_protein, label: `Protein ≥ ${buyer.min_protein}% (${v.toFixed(1)}%)` });
        }
        if (buyer.min_oil !== null) {
          const v = metricMap['oil'] ?? 0;
          checks.push({ pass: v >= buyer.min_oil, label: `Oil ≥ ${buyer.min_oil}% (${v.toFixed(1)}%)` });
        }
        if (buyer.min_diastatic !== null) {
          const v = metricMap['diastatic'] ?? 0;
          checks.push({ pass: v >= buyer.min_diastatic, label: `Diastatic Power ≥ ${buyer.min_diastatic} WK (${v} WK)` });
        }
        if (buyer.max_moisture !== null && grainMoisture !== null) {
          checks.push({ pass: grainMoisture <= buyer.max_moisture, label: `Moisture ≤ ${buyer.max_moisture}% (${grainMoisture.toFixed(1)}%)` });
        }

        const allPass = checks.every((c) => c.pass);

        return (
          <div key={buyer.id}
            className={`rounded-xl border p-4 space-y-3 ${allPass ? 'border-white/10 bg-white/5' : 'border-red-500/20 bg-red-500/5'}`}>
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <p className="text-sm font-bold text-white leading-tight">{buyer.name}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${TYPE_COLORS[buyer.type] ?? 'bg-white/10 text-white/40'}`}>
                    {TYPE_LABELS[buyer.type] ?? buyer.type}
                  </span>
                  <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${STATUS_COLORS[buyer.contract_status]}`}>
                    {buyer.contract_status}
                  </span>
                  {buyer.contract_tonnes && (
                    <span className="text-[8px] text-white/30">{buyer.contract_tonnes.toLocaleString()} t</span>
                  )}
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-lg font-black text-white">
                  £{effectivePrice.toFixed(0)}<span className="text-[10px] text-white/30">/t</span>
                </p>
                <p className="text-[9px] text-white/30">base £{buyer.price_per_tonne}</p>
                {Math.abs(priceDelta) > 0.5 && (
                  <p className={`text-[9px] font-bold ${priceDelta >= 0 ? 'text-[#8fb339]' : 'text-red-400'}`}>
                    {priceDelta >= 0 ? '+' : ''}£{priceDelta.toFixed(1)} quality adj.
                  </p>
                )}
              </div>
            </div>

            {checks.length > 0 && (
              <div className="space-y-1 border-t border-white/5 pt-3">
                <p className="text-[9px] text-white/20 uppercase tracking-widest font-black mb-2">Grade Requirements</p>
                {checks.map((c, i) => <GradeCheck key={i} pass={c.pass} label={c.label} />)}
              </div>
            )}
          </div>
        );
      })}

      <div className="bg-white/5 rounded-xl p-3 space-y-1">
        <p className="text-[9px] text-white/20 uppercase tracking-widest font-black">Quality Score Basis</p>
        <p className="text-[10px] text-white/40">
          Soil nitrate {nitrate.toFixed(0)} ppm → quality score{' '}
          <span className="text-white/70 font-bold">{qualityScore.toFixed(3)}×</span>
          {' '}(1.0 = grade base price)
        </p>
      </div>
    </div>
  );
}
