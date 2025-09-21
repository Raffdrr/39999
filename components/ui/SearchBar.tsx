import React from 'react';
import { Search } from 'lucide-react';
import { useUIStore } from '../../stores';
import { FilterIcon } from '../icons/secondary';

const HomeSearchBar: React.FC = () => {
    const { searchTerm, setSearchTerm, toggleFilterPanel, activeLocaleFilters, activeEventFilters } = useUIStore();
    const totalActiveFilters = activeLocaleFilters.size + activeEventFilters.size;

    return (
        <div className="flex items-center gap-2">
            <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 pointer-events-none" />
                <input
                    type="search"
                    placeholder="Cerca locali o eventi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:bg-white dark:focus:bg-slate-700/50 transition-all shadow-sm"
                />
            </div>
            <button
                onClick={toggleFilterPanel}
                className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl shadow transition-all duration-200 ease-out hover:shadow-lg hover:-translate-y-0.5 active:scale-95 active:shadow-sm active:translate-y-0 relative flex-shrink-0"
                aria-label="Apri filtri"
            >
                <FilterIcon size={24} />
                {totalActiveFilters > 0 && (
                     <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800">
                        {totalActiveFilters}
                    </span>
                )}
            </button>
        </div>
    );
};

export default HomeSearchBar;