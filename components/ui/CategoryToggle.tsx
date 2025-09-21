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
    // Outer container with padding, establishing the frame.
    <div className="w-full rounded-full bg-slate-200/70 dark:bg-slate-800 p-1 shadow-inner">
      {/* Inner container for flex layout, allowing pill and buttons to share the same coordinate system. */}
      <div className="relative flex items-center">
        {/* Sliding Pill: its width is now correctly calculated as 1/3 of the inner container, matching the flex-1 buttons. */}
        <div
          className="absolute top-0 bottom-0 w-1/3 rounded-full bg-gradient-to-br from-orange-400 to-red-500 shadow-lg transition-transform duration-300 ease-out"
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
            className={`relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-full px-2 py-1.5 text-center text-sm font-semibold transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-800 ${
              displayCategory === cat.id
                ? 'text-white'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 active:scale-95'
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