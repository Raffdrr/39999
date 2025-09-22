import React from 'react';
import { GripVertical, CalendarDays, MapPin } from 'lucide-react';
import { DisplayCategory } from '../../types';

interface CategoryToggleProps {
  displayCategory: DisplayCategory;
  setDisplayCategory: (category: DisplayCategory) => void;
  resetAllFilters: () => void;
}

const CATEGORIES_CONFIG = [
  { id: "all" as DisplayCategory, label: "Tutti", icon: GripVertical },
  { id: "locali" as DisplayCategory, label: "Locali", icon: MapPin },
  { id: "events" as DisplayCategory, label: "Eventi", icon: CalendarDays },
];

const CategoryToggle: React.FC<CategoryToggleProps> = ({ displayCategory, setDisplayCategory, resetAllFilters }) => {
  const activeIndex = CATEGORIES_CONFIG.findIndex(cat => cat.id === displayCategory);

  return (
    <div className="w-full rounded-full p-0.5 shadow-md bg-slate-200/60 dark:bg-slate-800/60 backdrop-blur-sm">
      <div className="relative flex items-center">
        {/* Sliding Pill */}
        <div
          className="absolute top-0 bottom-0 w-1/3 h-full rounded-full bg-gradient-to-br from-orange-400 to-red-500 shadow-lg transition-transform duration-300 ease-out"
          style={{
            transform: `translateX(${activeIndex * 100}%)`,
          }}
        />
        
        {CATEGORIES_CONFIG.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setDisplayCategory(cat.id);
              resetAllFilters();
            }}
            className={`relative z-10 flex flex-1 items-center justify-center gap-1 rounded-full px-2 py-1 text-center text-sm font-semibold transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-800 ${
              displayCategory === cat.id
                ? 'text-white'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 active:scale-95'
            }`}
            aria-pressed={displayCategory === cat.id}
          >
            <cat.icon size={16} />
            <span>{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryToggle;