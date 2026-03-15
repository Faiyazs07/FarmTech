export interface Insight {
  id: string;
  fieldId?: string;
  fieldName?: string;
  title: string;
  description: string;
  action: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  source: 'weather' | 'observation' | 'system';
  icon: string;
  createdAt: string;
}

export interface ScoutLog {
  id: string;
  fieldId?: string;
  fieldName?: string;
  observationType?: 'pest' | 'disease' | 'weed' | 'moisture' | 'low_growth' | 'storm_damage';
  severity?: 'low' | 'medium' | 'high';
  notes?: string;
  createdAt?: string;
}
