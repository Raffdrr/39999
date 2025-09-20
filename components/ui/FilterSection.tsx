import React from 'react';
import { ListFilter, RefreshCw, ChevronUp, ChevronDown } from 'lucide-react';
import { Event } from '../../types';
import { EVENT_COST_OPTIONS } from '../../constants';

interface FilterSectionProps {
  displayCategory: 'all' | 'locali' | 'events'; // 'restaurants' -> 'locali'
  restaurantCuisineTypes: string[]; // Inteso come tipi di cucina/locale
  eventData: Event[];
  activeRestaurantFilters: Set<string>; // activeLocaleFilters
  toggleRestaurantFilter: (filter: string) => void; // toggleLocaleFilter
  resetRestaurantFilters: () => void; // resetLocaleFilters
  activeEventFilters: Set<string>;
  toggleEventFilter: (filter: string) => void;
  resetEventFilters: () => void;
  showRestaurantFilterSection: boolean; // showLocaleFilterSection
  setShowRestaurantFilterSection: (show: boolean) => void; // setShowLocaleFilterSection
  showEventFilterSection: boolean;
  setShowEventFilterSection: (show: boolean) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  displayCategory,
  restaurantCuisineTypes,
  eventData,
  activeRestaurantFilters,
  toggleRestaurantFilter,
  resetRestaurantFilters,
  activeEventFilters,
  toggleEventFilter,
  resetEventFilters,
  showRestaurantFilterSection,
  setShowRestaurantFilterSection,
  showEventFilterSection,
  setShowEventFilterSection,
}) => {
  const showLocaleFilters = displayCategory === 'all' || displayCategory === 'locali'; // showRestaurantFilters -> showLocaleFilters, 'restaurants' -> 'locali'
  const showEventFilters = displayCategory === 'all' || displayCategory === 'events';

  if (!showLocaleFilters && !showEventFilters) return null; // showRestaurantFilters -> showLocaleFilters

  const currentEventCategories = Array.from(new Set(eventData
    .filter(e => {
      const eventDate = new Date(e.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return eventDate >= today;
    })
    .map(e => e.category)));

  return (
    <div className="mb-5 space-y-3 sm:space-y-4">
      {showLocaleFilters && restaurantCuisineTypes.length > 0 && ( // showRestaurantFilters -> showLocaleFilters
        <div className="p-3 sm:p-3.5 bg-white/60 backdrop-blur-md rounded-lg shadow-md overflow-hidden">
          <div
            className="flex items-center justify-between mb-2 sm:mb-2.5 cursor-pointer"
            onClick={() => setShowRestaurantFilterSection(!showRestaurantFilterSection)} // setShowLocaleFilterSection(!showLocaleFilterSection)
          >
            <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <ListFilter size={14} />Filtra Locali {/* Filtra Ristoranti -> Filtra Locali */}
            </h4>
            <div className="flex items-center">
              {activeRestaurantFilters.size > 0 && !showRestaurantFilterSection && (
                <span className="text-xs bg-amber-500 text-white px-1.5 py-0.5 rounded-full mr-2">
                  {activeRestaurantFilters.size}
                </span>
              )}
              {activeRestaurantFilters.size > 0 && showRestaurantFilterSection && (
                <button
                  onClick={(e) => { e.stopPropagation(); resetRestaurantFilters(); }}
                  className={`text-xs text-rose-600 hover:text-rose-800 font-medium flex items-center gap-1 mr-2`}
                >
                  <RefreshCw size={12} />Resetta
                </button>
              )}
              {showRestaurantFilterSection ? (
                <ChevronUp size={18} className="text-slate-500" />
              ) : (
                <ChevronDown size={18} className="text-slate-500" />
              )}
            </div>
          </div>
          <div
            className={`transition-all duration-500 ease-in-out ${
              showRestaurantFilterSection ? 'max-h-96 opacity-100 visible' : 'max-h-0 opacity-0 invisible'
            } overflow-hidden`}
          >
            <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
              {restaurantCuisineTypes.map(type => (
                <button
                  key={type}
                  onClick={() => toggleRestaurantFilter(type)}
                  className={`px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs rounded-full font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                    activeRestaurantFilters.has(type)
                      ? 'bg-amber-500 text-white shadow-md scale-105'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {showEventFilters && (currentEventCategories.length > 0 || EVENT_COST_OPTIONS.length > 0) && (
        <div className="p-3 sm:p-3.5 bg-white/60 backdrop-blur-md rounded-lg shadow-md overflow-hidden">
          <div
            className="flex items-center justify-between mb-2 sm:mb-2.5 cursor-pointer"
            onClick={() => setShowEventFilterSection(!showEventFilterSection)}
          >
            <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <ListFilter size={14} />Filtra Eventi
            </h4>
            <div className="flex items-center">
              {activeEventFilters.size > 0 && !showEventFilterSection && (
                <span className={`text-xs bg-rose-500 text-white px-1.5 py-0.5 rounded-full mr-2`}>
                  {activeEventFilters.size}
                </span>
              )}
              {activeEventFilters.size > 0 && showEventFilterSection && (
                 <button
                  onClick={(e) => {e.stopPropagation(); resetEventFilters();}}
                  className={`text-xs text-rose-600 hover:text-rose-800 font-medium flex items-center gap-1 mr-2`}
                >
                  <RefreshCw size={12}/>Resetta
                </button>
              )}
              {showEventFilterSection ? (
                <ChevronUp size={18} className="text-slate-500" />
              ) : (
                <ChevronDown size={18} className="text-slate-500" />
              )}
            </div>
          </div>
          <div
            className={`transition-all duration-500 ease-in-out ${
              showEventFilterSection ? 'max-h-96 opacity-100 visible' : 'max-h-0 opacity-0 invisible'
            } overflow-hidden`}
          >
            <div className="space-y-2 sm:space-y-2.5 pt-1">
              {currentEventCategories.length > 0 && (
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  <span className="text-[10px] sm:text-[11px] text-slate-500 w-full font-medium">Per Categoria:</span>
                  {currentEventCategories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => toggleEventFilter(cat)}
                      className={`px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs rounded-full font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                        activeEventFilters.has(cat)
                          ? `bg-rose-500 text-white shadow-md scale-105`
                          : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
              {EVENT_COST_OPTIONS.length > 0 && (
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  <span className="text-[10px] sm:text-[11px] text-slate-500 w-full font-medium">Per Costo:</span>
                  {EVENT_COST_OPTIONS.map(cost => (
                    <button
                      key={cost}
                      onClick={() => toggleEventFilter(cost)}
                      className={`px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs rounded-full font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                        activeEventFilters.has(cost)
                          ? `bg-rose-500 text-white shadow-md scale-105`
                          : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      }`}
                    >
                      {cost}
                    </button>
                  ))}
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