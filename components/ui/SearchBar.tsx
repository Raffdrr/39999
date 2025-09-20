import React from 'react';
import { Search, ListFilter } from 'lucide-react';
import { useUIStore } from '../../stores';

const HomeSearchBar: React.FC = () => {
    const { searchTerm, setSearchTerm, toggleFilterPanel, activeLocaleFilters, activeEventFilters } = useUIStore();
    const totalActiveFilters = activeLocaleFilters.size + activeEventFilters.size;

    return (
        <div className="flex items-center gap-2">
            <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                    type="search"
                    placeholder="Cerca locali o eventi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-100 border-2 border-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 focus:bg-white transition-all"
                />
            </div>
            <button
                onClick={toggleFilterPanel}
                className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl shadow-sm hover:bg-slate-100 transition-colors relative flex-shrink-0"
                aria-label="Apri filtri"
            >
                <ListFilter size={24} />
                {totalActiveFilters > 0 && (
                     <span className="absolute -top-1.5 -right-1.5 bg-sky-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                        {totalActiveFilters}
                    </span>
                )}
            </button>
        </div>
    );
};

export default HomeSearchBar;