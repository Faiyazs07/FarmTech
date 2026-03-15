import { Insight, ScoutLog } from '../types';

export const WEATHER_ALERTS: Insight[] = [
  {
    id: 'w-rain-tomorrow',
    title: 'Rain Tomorrow',
    description: 'Up to 15mm forecast tomorrow afternoon.',
    action: 'Delay pesticide/fertilizer applications. Check drainage in low areas.',
    urgency: 'medium',
    source: 'weather',
    icon: '🌧',
    createdAt: new Date().toISOString(),
  },
];

type ObsType = NonNullable<ScoutLog['observationType']>;
type Severity = NonNullable<ScoutLog['severity']>;

interface RuleRow {
  title: string;
  description: string;
  action: string;
  urgency: Insight['urgency'];
  icon: string;
}

const RULES: Record<ObsType, Record<Severity, RuleRow>> = {
  pest: {
    high:   { icon: '🐛', title: 'Pest Outbreak',        description: 'High pest pressure detected in this field.',         action: 'Spray immediately. Re-inspect in 24h.',              urgency: 'critical' },
    medium: { icon: '🐛', title: 'Early Pest Pressure',  description: 'Moderate pest activity observed.',                   action: 'Inspect again within 48 hours.',                     urgency: 'high' },
    low:    { icon: '🐛', title: 'Pest Monitoring',      description: 'Low pest levels noted. Monitor closely.',            action: 'Log count per plant at next visit.',                 urgency: 'low' },
  },
  disease: {
    high:   { icon: '🦠', title: 'Disease Spread Risk',  description: 'Significant disease symptoms present.',              action: 'Apply fungicide. Call agronomist.',                  urgency: 'critical' },
    medium: { icon: '🦠', title: 'Disease Detected',     description: 'Disease signs observed in field.',                  action: 'Apply preventive fungicide within 2 days.',          urgency: 'high' },
    low:    { icon: '🦠', title: 'Disease Watch',        description: 'Early or minor disease indicators present.',        action: 'Document affected plants. Monitor spread.',          urgency: 'medium' },
  },
  weed: {
    high:   { icon: '🌿', title: 'Heavy Weed Pressure',  description: 'Significant weed competition detected.',             action: 'Schedule herbicide application ASAP.',               urgency: 'high' },
    medium: { icon: '🌿', title: 'Weed Competition',     description: 'Moderate weed pressure observed.',                  action: 'Plan herbicide pass within 1 week.',                 urgency: 'medium' },
    low:    { icon: '🌿', title: 'Light Weeds',          description: 'Minor weed presence noted.',                        action: 'Consider spot treatment.',                           urgency: 'low' },
  },
  moisture: {
    high:   { icon: '💧', title: 'Critical Moisture',    description: 'Soil moisture at critical low level.',              action: 'Adjust irrigation immediately.',                     urgency: 'critical' },
    medium: { icon: '💧', title: 'Moisture Deficit',     description: 'Below-optimal moisture conditions.',                action: 'Run irrigation within 24 hours.',                    urgency: 'high' },
    low:    { icon: '💧', title: 'Dry Conditions',       description: 'Slightly dry conditions observed.',                 action: 'Monitor soil moisture daily.',                       urgency: 'low' },
  },
  low_growth: {
    high:   { icon: '📉', title: 'Stunted Growth',       description: 'Significant growth lag detected.',                  action: 'Soil test needed. Check for compaction.',            urgency: 'high' },
    medium: { icon: '📉', title: 'Below Average Growth', description: 'Growth below expected for this stage.',             action: 'Review nutrient plan.',                              urgency: 'medium' },
    low:    { icon: '📉', title: 'Slow Growth',          description: 'Slightly below average growth rate.',              action: 'Monitor. May resolve with better weather.',          urgency: 'low' },
  },
  storm_damage: {
    high:   { icon: '⛈', title: 'Severe Storm Damage',  description: 'Significant crop damage from storm event.',         action: 'Assess crop loss. Contact insurer.',                 urgency: 'critical' },
    medium: { icon: '⛈', title: 'Storm Damage',         description: 'Moderate storm damage observed.',                  action: 'Walk full field. Document extent.',                  urgency: 'high' },
    low:    { icon: '⛈', title: 'Minor Storm Impact',   description: 'Light storm effects visible.',                     action: 'Monitor recovery over 7 days.',                      urgency: 'medium' },
  },
};

export function generateInsights(log: ScoutLog): Insight[] {
  const { observationType, severity, fieldId, fieldName } = log;
  if (!observationType || !severity) return [];

  const rule = RULES[observationType]?.[severity];
  if (!rule) return [];

  const primary: Insight = {
    id: `obs-${log.id}`,
    fieldId,
    fieldName,
    title: rule.title,
    description: rule.description,
    action: rule.action,
    urgency: rule.urgency,
    source: 'observation',
    icon: rule.icon,
    createdAt: new Date().toISOString(),
  };

  return [primary];
}
