export type Urgency = 'low' | 'medium' | 'high';

export interface CropMetric {
  key: string;
  label: string;
  value: number;
  unit: string;
  target: number;
}

export interface CropYield {
  current: number;   // t/ha projected at current trajectory
  target: number;    // t/ha seasonal target
  area: number;      // hectares
  unit: string;      // display unit label
}

export interface CropData {
  metrics: CropMetric[];
  yield: CropYield;
  trend: number[];
  forecast: string;
  recommendation: string;
  urgency: Urgency;
}

// ── New longitudinal / buyer types ────────────────────────────────────────────

export interface YieldHistory {
  id?: number;
  field_id: string;
  crop_type: string;
  season_year: number;
  projected_yield: number;
  actual_yield: number | null;
  area_ha: number;
  gross_revenue: number | null;
}

export interface Buyer {
  id: string;
  name: string;
  type: 'mill' | 'maltster' | 'crusher' | 'processor' | 'co-op' | 'exporter';
  crop_type: string;
  min_protein: number | null;
  min_oil: number | null;
  min_diastatic: number | null;
  max_moisture: number | null;
  price_per_tonne: number;
  contract_status: 'contracted' | 'spot' | 'tender';
  contract_tonnes: number | null;
  // computed at runtime from soil chain
  quality_score?: number;
  effective_price?: number;
}

export interface SoilReading {
  id?: number;
  field_id: string;
  reading_date: string;
  moisture_pct: number;
  nitrate_ppm: number;
  ph: number;
  organic_matter_pct: number;
}

export interface FieldEvent {
  id?: number;
  field_id: string;
  event_date: string;
  event_type: 'pest' | 'disease' | 'drought' | 'storm' | 'input';
  severity: 'low' | 'medium' | 'high';
  description: string;
  resolved: boolean;
}

// ── Fallback seed data (used when DB is unavailable) ─────────────────────────

export const FALLBACK_YIELD_HISTORY: YieldHistory[] = [
  { field_id: 'crop_field_a', crop_type: 'wheat', season_year: 2023, projected_yield: 7.8, actual_yield: 7.5, area_ha: 42, gross_revenue: 63630 },
  { field_id: 'crop_field_a', crop_type: 'wheat', season_year: 2024, projected_yield: 8.1, actual_yield: 7.9, area_ha: 42, gross_revenue: 66486 },
  { field_id: 'crop_field_a', crop_type: 'wheat', season_year: 2025, projected_yield: 7.2, actual_yield: null, area_ha: 42, gross_revenue: null },
  { field_id: 'crop_field_b', crop_type: 'canola', season_year: 2023, projected_yield: 3.6, actual_yield: 3.4, area_ha: 38, gross_revenue: 88400 },
  { field_id: 'crop_field_b', crop_type: 'canola', season_year: 2024, projected_yield: 3.7, actual_yield: 3.6, area_ha: 38, gross_revenue: 93600 },
  { field_id: 'crop_field_b', crop_type: 'canola', season_year: 2025, projected_yield: 3.4, actual_yield: null, area_ha: 38, gross_revenue: null },
  { field_id: 'crop_field_c', crop_type: 'peas', season_year: 2023, projected_yield: 4.5, actual_yield: 4.3, area_ha: 25, gross_revenue: 61275 },
  { field_id: 'crop_field_c', crop_type: 'peas', season_year: 2024, projected_yield: 4.8, actual_yield: 4.6, area_ha: 25, gross_revenue: 65550 },
  { field_id: 'crop_field_c', crop_type: 'peas', season_year: 2025, projected_yield: 4.1, actual_yield: null, area_ha: 25, gross_revenue: null },
  { field_id: 'crop_field_d', crop_type: 'barley', season_year: 2023, projected_yield: 6.5, actual_yield: 6.2, area_ha: 31, gross_revenue: 76570 },
  { field_id: 'crop_field_d', crop_type: 'barley', season_year: 2024, projected_yield: 6.8, actual_yield: 6.5, area_ha: 31, gross_revenue: 80275 },
  { field_id: 'crop_field_d', crop_type: 'barley', season_year: 2025, projected_yield: 5.8, actual_yield: null, area_ha: 31, gross_revenue: null },
];

export const FALLBACK_BUYERS: Buyer[] = [
  { id: 'premier-mills', name: 'Premier Flour Mills', type: 'mill', crop_type: 'wheat', min_protein: 12.0, min_oil: null, min_diastatic: null, max_moisture: 14.5, price_per_tonne: 198, contract_status: 'contracted', contract_tonnes: 450 },
  { id: 'harvest-traders', name: 'Harvest Grain Traders', type: 'co-op', crop_type: 'wheat', min_protein: 11.5, min_oil: null, min_diastatic: null, max_moisture: 15.0, price_per_tonne: 185, contract_status: 'spot', contract_tonnes: null },
  { id: 'export-grain-co', name: 'Euro Export Grain Co', type: 'exporter', crop_type: 'wheat', min_protein: 12.5, min_oil: null, min_diastatic: null, max_moisture: 14.0, price_per_tonne: 210, contract_status: 'tender', contract_tonnes: 200 },
  { id: 'northfield-canola', name: 'Northfield Oilseed Crushers', type: 'crusher', crop_type: 'canola', min_protein: null, min_oil: 42.0, min_diastatic: null, max_moisture: 9.0, price_per_tonne: 520, contract_status: 'contracted', contract_tonnes: 300 },
  { id: 'biofuel-direct', name: 'BiofuelDirect Ltd', type: 'processor', crop_type: 'canola', min_protein: null, min_oil: 40.0, min_diastatic: null, max_moisture: 9.5, price_per_tonne: 495, contract_status: 'spot', contract_tonnes: null },
  { id: 'greenoil-co-op', name: 'GreenOil Co-operative', type: 'co-op', crop_type: 'canola', min_protein: null, min_oil: 41.5, min_diastatic: null, max_moisture: 9.0, price_per_tonne: 510, contract_status: 'tender', contract_tonnes: 150 },
  { id: 'pulse-pro', name: 'Pulse Pro Processors', type: 'processor', crop_type: 'peas', min_protein: 22.0, min_oil: null, min_diastatic: null, max_moisture: 16.0, price_per_tonne: 285, contract_status: 'contracted', contract_tonnes: 200 },
  { id: 'animal-feed-uk', name: 'Animal Feed UK', type: 'co-op', crop_type: 'peas', min_protein: 20.0, min_oil: null, min_diastatic: null, max_moisture: 16.5, price_per_tonne: 260, contract_status: 'spot', contract_tonnes: null },
  { id: 'highland-maltsters', name: 'Highland Maltsters Ltd', type: 'maltster', crop_type: 'barley', min_protein: 11.0, min_oil: null, min_diastatic: 300, max_moisture: 14.5, price_per_tonne: 245, contract_status: 'contracted', contract_tonnes: 280 },
  { id: 'county-distillers', name: 'County Craft Distillers', type: 'maltster', crop_type: 'barley', min_protein: 10.5, min_oil: null, min_diastatic: 280, max_moisture: 14.0, price_per_tonne: 260, contract_status: 'tender', contract_tonnes: 100 },
  { id: 'feed-barley-co', name: 'Feed Barley Co-op', type: 'co-op', crop_type: 'barley', min_protein: null, min_oil: null, min_diastatic: null, max_moisture: 15.0, price_per_tonne: 195, contract_status: 'spot', contract_tonnes: null },
];

export const FALLBACK_SOIL_READINGS: SoilReading[] = [
  { field_id: 'crop_field_a', reading_date: '2025-09-22', moisture_pct: 14.2, nitrate_ppm: 62.0, ph: 6.8, organic_matter_pct: 3.2 },
  { field_id: 'crop_field_a', reading_date: '2025-09-15', moisture_pct: 13.8, nitrate_ppm: 59.5, ph: 6.8, organic_matter_pct: 3.2 },
  { field_id: 'crop_field_a', reading_date: '2025-09-08', moisture_pct: 15.1, nitrate_ppm: 64.2, ph: 6.8, organic_matter_pct: 3.2 },
  { field_id: 'crop_field_a', reading_date: '2025-09-01', moisture_pct: 16.3, nitrate_ppm: 68.4, ph: 6.8, organic_matter_pct: 3.2 },
  { field_id: 'crop_field_a', reading_date: '2025-08-25', moisture_pct: 13.2, nitrate_ppm: 57.0, ph: 6.8, organic_matter_pct: 3.2 },
  { field_id: 'crop_field_a', reading_date: '2025-08-18', moisture_pct: 12.8, nitrate_ppm: 54.5, ph: 6.7, organic_matter_pct: 3.1 },
  { field_id: 'crop_field_a', reading_date: '2025-08-11', moisture_pct: 13.5, nitrate_ppm: 58.3, ph: 6.7, organic_matter_pct: 3.1 },
  { field_id: 'crop_field_a', reading_date: '2025-08-04', moisture_pct: 14.9, nitrate_ppm: 63.6, ph: 6.7, organic_matter_pct: 3.1 },
  { field_id: 'crop_field_a', reading_date: '2025-07-28', moisture_pct: 15.4, nitrate_ppm: 65.8, ph: 6.7, organic_matter_pct: 3.1 },
  { field_id: 'crop_field_a', reading_date: '2025-07-21', moisture_pct: 12.1, nitrate_ppm: 52.7, ph: 6.7, organic_matter_pct: 3.1 },
  { field_id: 'crop_field_a', reading_date: '2025-07-14', moisture_pct: 11.8, nitrate_ppm: 51.2, ph: 6.6, organic_matter_pct: 3.0 },
  { field_id: 'crop_field_a', reading_date: '2025-07-07', moisture_pct: 13.0, nitrate_ppm: 56.0, ph: 6.6, organic_matter_pct: 3.0 },
  { field_id: 'crop_field_b', reading_date: '2025-09-22', moisture_pct: 11.2, nitrate_ppm: 49.5, ph: 6.5, organic_matter_pct: 2.8 },
  { field_id: 'crop_field_b', reading_date: '2025-09-15', moisture_pct: 10.8, nitrate_ppm: 47.3, ph: 6.5, organic_matter_pct: 2.8 },
  { field_id: 'crop_field_b', reading_date: '2025-09-08', moisture_pct: 12.4, nitrate_ppm: 53.2, ph: 6.5, organic_matter_pct: 2.8 },
  { field_id: 'crop_field_c', reading_date: '2025-09-22', moisture_pct: 16.8, nitrate_ppm: 72.6, ph: 7.1, organic_matter_pct: 3.6 },
  { field_id: 'crop_field_c', reading_date: '2025-09-15', moisture_pct: 17.2, nitrate_ppm: 74.2, ph: 7.1, organic_matter_pct: 3.6 },
  { field_id: 'crop_field_c', reading_date: '2025-09-08', moisture_pct: 15.4, nitrate_ppm: 66.8, ph: 7.1, organic_matter_pct: 3.6 },
  { field_id: 'crop_field_d', reading_date: '2025-09-22', moisture_pct: 13.1, nitrate_ppm: 57.4, ph: 6.6, organic_matter_pct: 3.0 },
  { field_id: 'crop_field_d', reading_date: '2025-09-15', moisture_pct: 12.7, nitrate_ppm: 55.3, ph: 6.6, organic_matter_pct: 3.0 },
  { field_id: 'crop_field_d', reading_date: '2025-09-08', moisture_pct: 14.0, nitrate_ppm: 60.6, ph: 6.6, organic_matter_pct: 3.0 },
];

export const FALLBACK_FIELD_EVENTS: FieldEvent[] = [
  { field_id: 'crop_field_a', event_date: '2025-08-15', event_type: 'disease', severity: 'medium', description: 'Septoria tritici blotch detected on lower leaves in NW corner — 15% canopy affected', resolved: false },
  { field_id: 'crop_field_a', event_date: '2025-07-02', event_type: 'pest', severity: 'low', description: 'Aphid colonies observed at field margins; beneficial insect activity suppressing spread', resolved: true },
  { field_id: 'crop_field_a', event_date: '2024-09-10', event_type: 'drought', severity: 'high', description: 'Prolonged dry spell reduced grain fill — final yield 0.3 t/ha below projection', resolved: true },
  { field_id: 'crop_field_a', event_date: '2023-08-20', event_type: 'storm', severity: 'medium', description: 'Lodging event after 80mm rainfall in 24h; 8% of crop affected in southern block', resolved: true },
  { field_id: 'crop_field_b', event_date: '2025-09-01', event_type: 'pest', severity: 'high', description: 'Cabbage stem flea beetle pressure elevated — threshold exceeded, spray applied', resolved: false },
  { field_id: 'crop_field_b', event_date: '2025-07-18', event_type: 'disease', severity: 'low', description: 'Sclerotinia stem rot isolated to two rows; spread contained', resolved: true },
  { field_id: 'crop_field_b', event_date: '2024-08-05', event_type: 'drought', severity: 'medium', description: 'Moisture deficit during pod fill reduced oil content by ~1.8%', resolved: true },
  { field_id: 'crop_field_c', event_date: '2025-08-22', event_type: 'disease', severity: 'high', description: 'Aphanomyces root rot risk elevated following wet fortnight — preventative fungicide applied', resolved: false },
  { field_id: 'crop_field_c', event_date: '2025-06-30', event_type: 'pest', severity: 'medium', description: 'Pea moth egg counts at monitoring trap threshold — timing spray to hatch window', resolved: true },
  { field_id: 'crop_field_c', event_date: '2024-09-05', event_type: 'drought', severity: 'medium', description: 'Late season drought stress reduced seed fill — 0.2 t/ha shortfall vs target', resolved: true },
  { field_id: 'crop_field_d', event_date: '2025-09-10', event_type: 'disease', severity: 'high', description: 'Net blotch confirmed across 30% of crop — diastatic power now critically low for malt contract', resolved: false },
  { field_id: 'crop_field_d', event_date: '2025-07-25', event_type: 'pest', severity: 'medium', description: 'Bird cherry-oat aphid infestation in eastern block; BYDV risk elevated', resolved: true },
  { field_id: 'crop_field_d', event_date: '2024-08-28', event_type: 'drought', severity: 'high', description: 'Severe moisture deficit at grain fill — yield 0.3 t/ha below target, malt grade borderline', resolved: true },
];

// ── Field → crop mapping ──────────────────────────────────────────────────────
export const FIELD_TO_CROP: Record<string, string> = {
  crop_field_a: 'wheat',
  crop_field_b: 'canola',
  crop_field_c: 'peas',
  crop_field_d: 'barley',
};

export const CROP_TO_FIELD: Record<string, string> = {
  wheat: 'crop_field_a',
  canola: 'crop_field_b',
  peas: 'crop_field_c',
  barley: 'crop_field_d',
};

// ── Equipment ─────────────────────────────────────────────────────────────────

export type EquipmentStatus = 'ok' | 'due_soon' | 'overdue';
export interface Equipment {
  id: string; name: string; type: 'tractor' | 'combine' | 'sprayer' | 'pump';
  icon: string;
  current_hours: number; service_interval_hours: number;
  last_service_date: string;
  current_km?: number; service_interval_km?: number;
  status: EquipmentStatus;
}
export const EQUIPMENT: Equipment[] = [
  { id: 'tractor-1', name: 'John Deere 6R 155', type: 'tractor', icon: '🚜', current_hours: 412, service_interval_hours: 500, last_service_date: '2025-08-01', current_km: 9800, service_interval_km: 10000, status: 'due_soon' },
  { id: 'combine-1', name: 'Claas Lexion 8900', type: 'combine', icon: '🌾', current_hours: 185, service_interval_hours: 250, last_service_date: '2025-09-01', status: 'ok' },
  { id: 'sprayer-1', name: 'Amazone UX 5200', type: 'sprayer', icon: '💧', current_hours: 310, service_interval_hours: 300, last_service_date: '2025-07-15', status: 'overdue' },
  { id: 'pump-1', name: 'Grundfos Irrigation Pump', type: 'pump', icon: '⚙️', current_hours: 88, service_interval_hours: 200, last_service_date: '2025-09-10', status: 'ok' },
];

// ── Commodity Prices ──────────────────────────────────────────────────────────

export type TradeSignal = 'hold' | 'sell' | 'watch';
export interface CommodityPrice {
  crop: string; label: string; price_per_tonne: number;
  week_delta: number; signal: TradeSignal; signal_reason: string;
}
export const COMMODITY_PRICES: CommodityPrice[] = [
  { crop: 'wheat',  label: 'Wheat',  price_per_tonne: 198, week_delta: +4.50, signal: 'watch', signal_reason: 'Trending up — monitor for sell window in 5–7 days.' },
  { crop: 'canola', label: 'Canola', price_per_tonne: 520, week_delta: -8.00, signal: 'hold',  signal_reason: 'Falling on EU export data — hold until recovery above £525.' },
  { crop: 'peas',   label: 'Peas',   price_per_tonne: 285, week_delta: +1.25, signal: 'sell',  signal_reason: 'Quality risk from root rot — lock in contracted price now.' },
  { crop: 'barley', label: 'Barley', price_per_tonne: 245, week_delta: -3.75, signal: 'hold',  signal_reason: 'Malt contract at risk — resolve diastatic issue before selling.' },
];

// ── Existing crop metrics data ────────────────────────────────────────────────
export const CROP_DATA: Record<string, CropData> = {
  wheat: {
    metrics: [
      { key: 'protein', label: 'Protein', value: 11.8, unit: '%', target: 12.5 },
      { key: 'moisture', label: 'Grain Moisture', value: 13.2, unit: '%', target: 14.0 },
    ],
    yield: { current: 7.2, target: 8.5, area: 42, unit: 't/ha' },
    trend: [11.2, 11.5, 11.9, 12.1, 12.0, 12.3, 12.4],
    forecast: 'Gluten accumulation trending upward; warm dry week ahead favours final grain fill.',
    recommendation: 'Apply 20 kg/ha foliar urea within 48 hours to close the protein gap before heading stage.',
    urgency: 'medium',
  },
  canola: {
    metrics: [
      { key: 'oil', label: 'Oil Content', value: 42.3, unit: '%', target: 44.0 },
      { key: 'glucosinolate', label: 'Glucosinolate', value: 18.2, unit: 'µmol/g', target: 25.0 },
      { key: 'erucic', label: 'Erucic Acid', value: 0.4, unit: '%', target: 2.0 },
    ],
    yield: { current: 3.4, target: 3.8, area: 38, unit: 't/ha' },
    trend: [40.1, 40.8, 41.2, 41.9, 42.0, 42.1, 42.3],
    forecast: 'Oil accumulation on track; forecast cool nights will boost lipid synthesis over next 10 days.',
    recommendation: 'Maintain current irrigation schedule. No intervention needed — crop is performing within optimal parameters.',
    urgency: 'low',
  },
  peas: {
    metrics: [
      { key: 'protein', label: 'Protein Content', value: 23.1, unit: '%', target: 25.0 },
      { key: 'starch', label: 'Starch', value: 48.2, unit: '%', target: 50.0 },
      { key: 'moisture', label: 'Seed Moisture', value: 14.8, unit: '%', target: 16.0 },
    ],
    yield: { current: 4.1, target: 5.0, area: 25, unit: 't/ha' },
    trend: [21.0, 21.4, 22.0, 22.5, 22.8, 23.0, 23.1],
    forecast: 'Protein lagging behind seasonal average; nitrogen fixation efficiency down 12% vs prior year.',
    recommendation: 'Scout for aphanomyces root rot — wet conditions last week create elevated risk. Consider fungicide application.',
    urgency: 'medium',
  },
  barley: {
    metrics: [
      { key: 'protein', label: 'Protein Content', value: 11.2, unit: '%', target: 11.5 },
      { key: 'diastatic', label: 'Diastatic Power', value: 280, unit: 'WK', target: 300 },
      { key: 'moisture', label: 'Grain Moisture', value: 13.8, unit: '%', target: 14.5 },
    ],
    yield: { current: 5.8, target: 7.0, area: 31, unit: 't/ha' },
    trend: [9.8, 10.1, 10.4, 10.7, 10.9, 11.0, 11.2],
    forecast: 'Diastatic power critically below malting grade threshold. Risk of contract penalty at harvest.',
    recommendation: 'Immediate: Apply sulphur-based foliar spray (15 kg/ha) to recover enzyme activity. Re-test in 7 days.',
    urgency: 'high',
  },
};
