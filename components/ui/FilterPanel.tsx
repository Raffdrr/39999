
import React, { useMemo } from 'react';
import { useUIStore, useDataStore } from '../../stores';
import CategoryToggle from './CategoryToggle';
import FilterSection from './FilterSection';
import { X } from 'lucide-react';

const FilterPanel: React.FC = () => {
    const {
        showFilterPanel,
        toggleFilterPanel,
        displayCategory,
        setDisplayCategory,
        activeLocaleFilters,
        toggleLocaleFilter,
        resetAllFilters,
        activeEventFilters,
        toggleEventFilter,
    } = useUIStore();
    const { locales, events } = useDataStore();
    
    const localeCuisineTypes = useMemo(() => Array.from(new Set(locales.map(l => l.cuisine))), [locales]);
    
    const resetAndClose = () => {
        resetAllFilters();
        setDisplayCategory('all');
    }

    if (!showFilterPanel) {
        return null;
    }

    return (
        <>
            <div className="filter-panel-overlay" onClick={toggleFilterPanel}></div>
            <div className="filter-panel-content no-scrollbar">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-800">Filtri</h2>
                    <button onClick={toggleFilterPanel} className="p-2 rounded-full hover:bg-slate-200 transition-colors">
                        <X size={24} className="text-slate-600" />
                    </button>
                </div>

                <CategoryToggle
                    displayCategory={displayCategory}
                    setDisplayCategory={(cat) => {
                        setDisplayCategory(cat);
                        resetAllFilters();
                    }}
                    resetAllFilters={resetAndClose}
                />
                
                <FilterSection
                    displayCategory={displayCategory}
                    restaurantCuisineTypes={localeCuisineTypes}
                    eventData={events}
                    activeRestaurantFilters={activeLocaleFilters}
                    toggleRestaurantFilter={toggleLocaleFilter}
                    resetRestaurantFilters={() => setDisplayCategory(displayCategory)} // Placeholder, handled by resetAllFilters
                    activeEventFilters={activeEventFilters}
                    toggleEventFilter={toggleEventFilter}
                    resetEventFilters={() => setDisplayCategory(displayCategory)} // Placeholder, handled by resetAllFilters
                    showRestaurantFilterSection={true}
                    setShowRestaurantFilterSection={() => {}}
                    showEventFilterSection={true}
                    setShowEventFilterSection={() => {}}
                />
            </div>
        </>
    );
};

export default FilterPanel;