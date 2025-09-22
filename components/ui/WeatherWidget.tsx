import React from 'react';
import { Sun, Cloud, CloudRain } from 'lucide-react';

// Simulate weather data for Naples
const weatherData = {
  city: 'Napoli',
  temperature: 27,
  condition: 'Soleggiato', // 'Nuvoloso', 'Pioggia'
  icon: Sun, // Cloud, CloudRain
};

const WeatherWidget: React.FC = () => {
  const { city, temperature, condition, icon: Icon } = weatherData;

  return (
    <div className="
      flex items-center justify-between p-3 
      w-full rounded-full 
      bg-slate-200/60 dark:bg-slate-800/60 
      backdrop-blur-sm shadow-md 
      border border-slate-300/50 dark:border-slate-700/50
      animate-fade-in-up
    ">
      <div className="flex items-center gap-3">
        <Icon size={32} className="text-orange-500" />
        <div>
          <h3 className="text-md font-bold text-slate-800 dark:text-slate-100">{city}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">{condition}</p>
        </div>
      </div>
      <p className="text-3xl font-extrabold text-slate-700 dark:text-slate-200">{temperature}°</p>
    </div>
  );
};

export default WeatherWidget;