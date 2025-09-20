import React from 'react';
import { GripVertical, Home, CalendarDays, MapPin } from 'lucide-react'; // Home -> MapPin per "Locali"
import { DisplayCategory } from '../../types';

interface CategoryToggleProps {
  displayCategory: DisplayCategory;
  setDisplayCategory: (category: DisplayCategory) => void;
  resetAllFilters: () => void;
}

const CATEGORIES_CONFIG = [
  { id: "all" as DisplayCategory, label: "Tutti", icon: GripVertical },
  { id: "locali" as DisplayCategory, label: "Locali", icon: MapPin }, // "restaurants" -> "locali", Home -> MapPin
  { id: "events" as DisplayCategory, label: "Eventi", icon: CalendarDays },
];

const CategoryToggle: React.FC<CategoryToggleProps> = ({ displayCategory, setDisplayCategory, resetAllFilters }) => {
  return (
    <div className="flex gap-2 sm:gap-2.5 mb-5">
      {CATEGORIES_CONFIG.map((cat) => (
        <button
          key={cat.id}
          onClick={() => {
            setDisplayCategory(cat.id);
            resetAllFilters();
          }}
          className={`flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-400 flex items-center justify-center gap-1.5 sm:gap-2 shadow-md hover:shadow-lg active:scale-95 ${
            displayCategory === cat.id
              ? `bg-gradient-to-br from-rose-500 via-rose-500 to-red-500 text-white scale-105`
              : "bg-white/80 text-slate-700 hover:bg-white"
          }`}
        >
          <cat.icon size={16} />
          {cat.label}
        </button>
      ))}
    </div>
  );
};

export default CategoryToggle;