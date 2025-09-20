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
  const activeIndex = CATEGORIES_CONFIG.findIndex(c => c.id === displayCategory);

  return (
    <div className="relative flex w-full items-center rounded-full bg-slate-100 p-1 shadow-inner">
      <div
        className="absolute left-1 top-1 bottom-1 w-1/3 rounded-full bg-gradient-to-br from-rose-500 to-red-500 shadow-md transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(${activeIndex * 100}%)` }}
        aria-hidden="true"
      />

      {CATEGORIES_CONFIG.map((cat) => (
        <button
          key={cat.id}
          onClick={() => {
            setDisplayCategory(cat.id);
            resetAllFilters();
          }}
          className={`relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-full px-2 py-1.5 text-center text-xs font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-1 focus:ring-offset-slate-100 ${
            displayCategory === cat.id ? 'text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
          aria-pressed={displayCategory === cat.id}
        >
          <cat.icon size={14} />
          <span>{cat.label}</span>
        </button>
      ))}
    </div>
  );
};

export default CategoryToggle;