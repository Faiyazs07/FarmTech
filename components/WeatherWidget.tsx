'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Wind } from 'lucide-react';

interface WeatherData {
  temperature: number;
  weatherCode: number;
  windSpeed: number;
  precipProbability: number[]; // next 6 hours
  precipHours: string[];
}

function getCondition(code: number): { label: string; Icon: React.ComponentType<{ className?: string }> } {
  if (code === 0) return { label: 'Clear Sky', Icon: Sun };
  if (code <= 3) return { label: 'Partly Cloudy', Icon: Cloud };
  if (code <= 49) return { label: 'Foggy', Icon: Cloud };
  if (code <= 59) return { label: 'Drizzle', Icon: CloudRain };
  if (code <= 69) return { label: 'Rain', Icon: CloudRain };
  if (code <= 79) return { label: 'Snow', Icon: CloudSnow };
  if (code <= 82) return { label: 'Rain Showers', Icon: CloudRain };
  if (code <= 86) return { label: 'Snow Showers', Icon: CloudSnow };
  if (code <= 99) return { label: 'Thunderstorm', Icon: CloudLightning };
  return { label: 'Unknown', Icon: Wind };
}

function iconAnimation(code: number) {
  if (code === 0) return { animate: { scale: [1, 1.08, 1] }, transition: { repeat: Infinity, duration: 3 } };
  if (code <= 59) return { animate: { y: [0, -3, 0] }, transition: { repeat: Infinity, duration: 2 } };
  if (code <= 69) return { animate: { y: [0, 4, 0] }, transition: { repeat: Infinity, duration: 0.8 } };
  if (code <= 79) return { animate: { rotate: [0, 15, -15, 0] }, transition: { repeat: Infinity, duration: 2.5 } };
  return { animate: { scale: [1, 1.05, 1] }, transition: { repeat: Infinity, duration: 1.5 } };
}

function toF(c: number) {
  return Math.round(c * 9 / 5 + 32);
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function fetchWeather(lat: number, lon: number) {
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m&hourly=precipitation_probability&start_date=${dateStr}&end_date=${dateStr}&timezone=auto`;

      fetch(url)
        .then(r => r.json())
        .then(data => {
          const currentHour = now.getHours();
          const hourlyProbs: number[] = data.hourly?.precipitation_probability ?? [];
          const precipSlice = hourlyProbs.slice(currentHour, currentHour + 6);
          const hours = Array.from({ length: 6 }, (_, i) => {
            const h = (currentHour + i) % 24;
            return `${pad(h)}:00`;
          });

          setWeather({
            temperature: Math.round(data.current.temperature_2m),
            weatherCode: data.current.weather_code,
            windSpeed: Math.round(data.current.wind_speed_10m),
            precipProbability: precipSlice,
            precipHours: hours,
          });
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }

    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        () => fetchWeather(51.5, -0.1)
      );
    } else {
      fetchWeather(51.5, -0.1);
    }
  }, []);

  if (loading) {
    return (
      <div className="absolute top-6 right-6 w-52 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 animate-pulse">
        <div className="h-4 bg-white/10 rounded mb-2 w-3/4" />
        <div className="h-8 bg-white/10 rounded mb-2" />
        <div className="h-3 bg-white/10 rounded w-1/2" />
      </div>
    );
  }

  if (!weather) return null;

  const { label, Icon } = getCondition(weather.weatherCode);
  const anim = iconAnimation(weather.weatherCode);
  const displayTemp = unit === 'C' ? `${weather.temperature}°C` : `${toF(weather.temperature)}°F`;
  const maxProb = Math.max(...weather.precipProbability, 1);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="absolute top-6 right-6 w-52 bg-[#0a1a08]/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-2xl"
      >
        {/* Top row: icon + temp + toggle */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <motion.div {...anim}>
              <Icon className="w-6 h-6 text-[#8fb339]" />
            </motion.div>
            <span className="text-2xl font-black text-white tracking-tight">{displayTemp}</span>
          </div>
          <button
            onClick={() => setUnit(u => u === 'C' ? 'F' : 'C')}
            className="text-[10px] font-black px-2 py-1 rounded-lg border border-[#8fb339]/50 text-[#8fb339] hover:bg-[#8fb339]/20 transition-all"
          >
            °{unit === 'C' ? 'F' : 'C'}
          </button>
        </div>

        {/* Condition label */}
        <p className="text-[11px] text-white/60 mb-2 font-medium">{label}</p>

        {/* Wind */}
        <div className="flex items-center gap-1 mb-3">
          <Wind className="w-3 h-3 text-white/40" />
          <span className="text-[11px] text-white/50">Wind: {weather.windSpeed} km/h</span>
        </div>

        {/* Precipitation bars */}
        <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-2">Precip next 6h</p>
        <div className="flex items-end gap-1 h-8">
          {weather.precipProbability.map((prob, i) => {
            const barH = Math.max(4, Math.round((prob / maxProb) * 28));
            return (
              <div key={i} className="flex flex-col items-center gap-0.5 flex-1">
                <div
                  className="w-full rounded-sm bg-[#8fb339]/70"
                  style={{ height: `${barH}px` }}
                />
              </div>
            );
          })}
        </div>
        <div className="flex gap-1 mt-1">
          {weather.precipHours.map((h, i) => (
            <span key={i} className="flex-1 text-center text-[8px] text-white/30 leading-none">{h}</span>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
