import React from 'react';
import { RefreshCw, ChevronUp, ChevronDown } from 'lucide-react';
import { Event } from '../../types';
import { EVENT_COST_OPTIONS, EVENT_DATE_OPTIONS } from '../../constants';
import { FilterIcon } from '../icons/secondary';

interface FilterSectionProps {
  displayCategory: 'all' | 'locali' | 'events';
  localeCuisineTypes: string[];
  localePriceOptions: string[];
  eventData: Event[];
  activeLocaleFilters: Set<string>;
  toggleLocaleFilter: (filter: string) => void;
  resetLocaleFilters: () => void;
  activePriceFilters: Set<string>;
  togglePriceFilter: (filter: string) => void;
  activeEventFilters: Set<string>;
  toggleEventFilter: (filter: string) => void;
  resetEventFilters: () => void;
  activeDateFilter: string | null;
  setDateFilter: (filter: string | null) => void;
  showLocaleFilterSection: boolean;
  setShowLocaleFilterSection: (show: boolean) => void;
  showEventFilterSection: boolean;
  setShowEventFilterSection: (show: boolean) => void;
}

const FilterButton: React.FC<{label: string; isActive: boolean; onClick: () => void; colorClass: string}> = ({ label, isActive, onClick, colorClass }) => (
    <button
      onClick={onClick}
      className={`px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs rounded-lg font-medium transition-all duration-200 ease-out ${
        isActive
          ? `${colorClass} text-white shadow-md ring-2 ring-offset-2 dark:ring-offset-slate-900 ring-orange-500/50`
          : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 shadow-sm hover:-translate-y-0.5 hover:shadow-md active:shadow-sm active:translate-y-0'
      }`}
    >
      {label}
    </button>
);

const FilterSection: React.FC<FilterSectionProps> = ({
  displayCategory,
  localeCuisineTypes,
  localePriceOptions,
  eventData,
  activeLocaleFilters,
  toggleLocaleFilter,
  resetLocaleFilters,
  activePriceFilters,
  togglePriceFilter,
  activeEventFilters,
  toggleEventFilter,
  resetEventFilters,
  activeDateFilter,
  setDateFilter,
  showLocaleFilterSection,
  setShowLocaleFilterSection,
  showEventFilterSection,
  setShowEventFilterSection,
}) => {
  const showLocaleFilters = displayCategory === 'all' || displayCategory === 'locali';
  const showEventFilters = displayCategory === 'all' || displayCategory === 'events';

  if (!showLocaleFilters && !showEventFilters) return null;

  const currentEventCategories = Array.from(new Set(eventData
    .filter(e => {
      const eventDate = new Date(e.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return eventDate >= today;
    })
    .map(e => e.category)));

  const totalLocaleFilters = activeLocaleFilters.size + activePriceFilters.size;
  const totalEventFilters = activeEventFilters.size + (activeDateFilter ? 1 : 0);

  return (
    <div className="space-y-3 sm:space-y-4">
      {showLocaleFilters && (localeCuisineTypes.length > 0 || localePriceOptions.length > 0) && (
        <div className="p-3 sm:p-3.5 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-lg shadow-md overflow-hidden">
          <div
            className="flex items-center justify-between mb-2 sm:mb-2.5 cursor-pointer"
            onClick={() => setShowLocaleFilterSection(!showLocaleFilterSection)}
          >
            <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <FilterIcon size={16} />Filtra Locali
            </h4>
            <div className="flex items-center">
              {totalLocaleFilters > 0 && !showLocaleFilterSection && (
                <span className="text-xs bg-amber-500 text-white px-1.5 py-0.5 rounded-full mr-2">
                  {totalLocaleFilters}
                </span>
              )}
              {totalLocaleFilters > 0 && showLocaleFilterSection && (
                <button
                  onClick={(e) => { e.stopPropagation(); resetLocaleFilters(); }}
                  className={`text-xs text-rose-600 hover:text-rose-800 dark:text-rose-400 dark:hover:text-rose-300 font-medium flex items-center gap-1 mr-2`}
                >
                  <RefreshCw size={12} />Resetta
                </button>
              )}
              {showLocaleFilterSection ? <ChevronUp size={18} className="text-slate-500 dark:text-slate-400" /> : <ChevronDown size={18} className="text-slate-500 dark:text-slate-400" />}
            </div>
          </div>
          <div className={`transition-all duration-500 ease-in-out ${showLocaleFilterSection ? 'max-h-[1000px] opacity-100 visible' : 'max-h-0 opacity-0 invisible'} overflow-hidden`}>
            <div className="space-y-3 pt-1">
              {localeCuisineTypes.length > 0 && (
                <div>
                  <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 w-full font-medium">Per Categoria:</span>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
                    {localeCuisineTypes.map(type => <FilterButton key={type} label={type} isActive={activeLocaleFilters.has(type)} onClick={() => toggleLocaleFilter(type)} colorClass="bg-amber-500" />)}
                  </div>
                </div>
              )}
               {localePriceOptions.length > 0 && (
                <div>
                  <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 w-full font-medium">Per Prezzo:</span>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
                    {localePriceOptions.map(price => <FilterButton key={price} label={price} isActive={activePriceFilters.has(price)} onClick={() => togglePriceFilter(price)} colorClass="bg-amber-500" />)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {showEventFilters && (currentEventCategories.length > 0 || EVENT_COST_OPTIONS.length > 0) && (
        <div className="p-3 sm:p-3.5 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-lg shadow-md overflow-hidden">
          <div
            className="flex items-center justify-between mb-2 sm:mb-2.5 cursor-pointer"
            onClick={() => setShowEventFilterSection(!showEventFilterSection)}
          >
            <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <FilterIcon size={16} />Filtra Eventi
            </h4>
            <div className="flex items-center">
              {totalEventFilters > 0 && !showEventFilterSection && (
                <span className={`text-xs bg-orange-500 text-white px-1.5 py-0.5 rounded-full mr-2`}>
                  {totalEventFilters}
                </span>
              )}
              {totalEventFilters > 0 && showEventFilterSection && (
                 <button
                  onClick={(e) => {e.stopPropagation(); resetEventFilters();}}
                  className={`text-xs text-rose-600 hover:text-rose-800 dark:text-rose-400 dark:hover:text-rose-300 font-medium flex items-center gap-1 mr-2`}
                >
                  <RefreshCw size={12}/>Resetta
                </button>
              )}
              {showEventFilterSection ? <ChevronUp size={18} className="text-slate-500 dark:text-slate-400" /> : <ChevronDown size={18} className="text-slate-500 dark:text-slate-400" />}
            </div>
          </div>
          <div className={`transition-all duration-500 ease-in-out ${showEventFilterSection ? 'max-h-[1000px] opacity-100 visible' : 'max-h-0 opacity-0 invisible'} overflow-hidden`}>
            <div className="space-y-3 pt-1">
              {EVENT_DATE_OPTIONS.length > 0 && (
                <div>
                   <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 w-full font-medium">Per Data:</span>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
                    {EVENT_DATE_OPTIONS.map(dateOpt => <FilterButton key={dateOpt} label={dateOpt} isActive={activeDateFilter === dateOpt} onClick={() => setDateFilter(dateOpt)} colorClass="bg-orange-500" />)}
                  </div>
                </div>
              )}
              {currentEventCategories.length > 0 && (
                 <div>
                  <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 w-full font-medium">Per Categoria:</span>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
                    {currentEventCategories.map(cat => <FilterButton key={cat} label={cat} isActive={activeEventFilters.has(cat)} onClick={() => toggleEventFilter(cat)} colorClass="bg-orange-500" />)}
                  </div>
                </div>
              )}
              {EVENT_COST_OPTIONS.length > 0 && (
                <div>
                  <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 w-full font-medium">Per Costo:</span>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
                    {EVENT_COST_OPTIONS.map(cost => <FilterButton key={cost} label={cost} isActive={activeEventFilters.has(cost)} onClick={() => toggleEventFilter(cost)} colorClass="bg-orange-500" />)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSection;