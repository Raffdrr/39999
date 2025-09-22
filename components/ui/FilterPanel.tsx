import React, { useMemo, useState } from 'react';
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
        resetLocaleFilters,
        activeEventFilters,
        toggleEventFilter,
        resetEventFilters,
        activeDateFilter,
        setDateFilter,
        activePriceFilters,
        togglePriceFilter,
        resetAllFilters,
    } = useUIStore();
    const { locales, events } = useDataStore();

    const [showLocaleFilterSection, setShowLocaleFilterSection] = useState(true);
    const [showEventFilterSection, setShowEventFilterSection] = useState(true);
    
    const localeCuisineTypes = useMemo<string[]>(() => Array.from(new Set(locales.map(l => l.cuisine))), [locales]);
    const localePriceOptions = useMemo<string[]>(() => Array.from(new Set(locales.map(l => l.price))).sort(), [locales]);
    
    const resetAndClose = () => {
        resetAllFilters();
    }

    if (!showFilterPanel) {
        return null;
    }

    const totalActiveFilters = activeLocaleFilters.size + activeEventFilters.size + activePriceFilters.size + (activeDateFilter ? 1 : 0);

    return (
        <>
            <div className="filter-panel-overlay" onClick={toggleFilterPanel}></div>
            <div className="filter-panel-content no-scrollbar">
                {/* Header Area */}
                <div className="flex-shrink-0 px-5 pt-6 pb-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Filtri</h2>
                        <button onClick={toggleFilterPanel} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                            <X size={24} className="text-slate-600 dark:text-slate-300" />
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
                </div>
                
                {/* Scrollable Content */}
                <div className="flex-grow overflow-y-auto no-scrollbar px-5 pt-2 pb-4">
                    <div className="mt-4">
                        <FilterSection
                            displayCategory={displayCategory}
                            localeCuisineTypes={localeCuisineTypes}
                            localePriceOptions={localePriceOptions}
                            eventData={events}
                            activeLocaleFilters={activeLocaleFilters}
                            toggleLocaleFilter={toggleLocaleFilter}
                            resetLocaleFilters={resetLocaleFilters}
                            activePriceFilters={activePriceFilters}
                            togglePriceFilter={togglePriceFilter}
                            activeEventFilters={activeEventFilters}
                            toggleEventFilter={toggleEventFilter}
                            resetEventFilters={resetEventFilters}
                            activeDateFilter={activeDateFilter}
                            setDateFilter={setDateFilter}
                            showLocaleFilterSection={showLocaleFilterSection}
                            setShowLocaleFilterSection={setShowLocaleFilterSection}
                            showEventFilterSection={showEventFilterSection}
                            setShowEventFilterSection={setShowEventFilterSection}
                        />
                    </div>
                </div>

                {/* Footer / Action Buttons */}
                <div className="flex-shrink-0 p-4 bg-gradient-to-t from-slate-100/90 via-slate-100 dark:from-slate-900/90 dark:via-slate-900 to-slate-100 dark:to-slate-900 border-t border-slate-200/80 dark:border-slate-800/80">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={resetAndClose}
                            className="flex-1 py-3 px-4 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold transition-all duration-200 ease-out active:scale-95 border border-slate-200 dark:border-slate-600 shadow hover:-translate-y-0.5 hover:shadow-lg active:shadow-sm active:translate-y-0"
                        >
                            Resetta
                        </button>
                        <button 
                            onClick={toggleFilterPanel}
                            className="flex-1 py-3 px-4 rounded-lg bg-orange-500 text-white font-semibold transition-all duration-200 ease-out shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 active:shadow-md"
                        >
                            Mostra Risultati ({totalActiveFilters})
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FilterPanel;