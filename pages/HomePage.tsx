import React, { useState, useEffect, useRef } from 'react';
import { Heart, Star, Users, MapPin as MapPinIconLucide, AlertTriangle, Gift, ListFilter, Search as SearchIcon, X, Plus, ClipboardList, PlusCircle } from 'lucide-react';
import { useDataStore, useUIStore, useFavoritesStore } from '../stores';
import { DisplayCategory, Locale, Event } from '../types';
import ListCard from '../components/ListCard';
import ImageWithFallback from '../components/ImageWithFallback';
import CategoryToggleComponent from '../components/ui/CategoryToggle';
import FilterSectionComponent from '../components/ui/FilterSection';
import MapPreviewComponent from '../components/ui/MapPreview';
import FavoriteButton from '../components/ui/FavoriteButton';
import useSwipe from '../hooks/useSwipe'; // Import the new hook
import { EVENT_COST_OPTIONS, CORAL_TAG_BG, CORAL_TAG_TEXT } from '../constants';

const BOTTOM_SEARCH_BAR_HEIGHT_PX = 56;
const HOME_FILTER_PANEL_MAX_HEIGHT_PX = 300;
const CATEGORIES: DisplayCategory[] = ['all', 'locali', 'events'];

const HomePage: React.FC = () => {
    const { locales, events } = useDataStore();
    const { openModal, showFilterPanel, toggleFilterPanel } = useUIStore();
    const { favorites, isFavorite, toggleFavorite } = useFavoritesStore();
    
    const [displayCategory, setDisplayCategory] = useState<DisplayCategory>("all");
    const [search, setSearch] = useState("");
    const [activeLocaleFilters, setActiveLocaleFilters] = useState<Set<string>>(new Set());
    const [activeEventFilters, setActiveEventFilters] = useState<Set<string>>(new Set());
    const [showLocaleFilterSection, setShowLocaleFilterSection] = useState(true);
    const [showEventFilterSection, setShowEventFilterSection] = useState(true);
    const [isFabMenuOpen, setIsFabMenuOpen] = useState(false);

    const mainContentRef = useRef<HTMLDivElement>(null);
    
    const handleSwipeLeft = () => {
        const currentIndex = CATEGORIES.indexOf(displayCategory);
        const nextIndex = (currentIndex + 1) % CATEGORIES.length;
        setDisplayCategory(CATEGORIES[nextIndex]);
    };
    const handleSwipeRight = () => {
        const currentIndex = CATEGORIES.indexOf(displayCategory);
        const prevIndex = (currentIndex - 1 + CATEGORIES.length) % CATEGORIES.length;
        setDisplayCategory(CATEGORIES[prevIndex]);
    };
    const swipeHandlers = useSwipe({ onSwipedLeft: handleSwipeLeft, onSwipedRight: handleSwipeRight });


    // FIX: Use Array.from to explicitly convert the Set to an array, resolving a TypeScript inference issue.
    const localeCuisineTypes: string[] = Array.from(new Set(locales.map((l: Locale) => l.cuisine)));
    const filteredLocali = locales.filter((l: Locale) => { const searchLower = search.toLowerCase(); const searchMatch = l.name.toLowerCase().includes(searchLower) || l.cuisine.toLowerCase().includes(searchLower) || (l.hashtags && l.hashtags.some(h => `#${h.toLowerCase()}`.includes(searchLower))); const filterMatch = activeLocaleFilters.size === 0 || activeLocaleFilters.has(l.cuisine); return searchMatch && filterMatch; });
    const filteredEvents = events.filter(e => { const searchLower = search.toLowerCase(); const searchMatch = e.name.toLowerCase().includes(searchLower) || e.category.toLowerCase().includes(searchLower) || (e.description && e.description.toLowerCase().includes(searchLower)) || (e.hashtags && e.hashtags.some(h => `#${h.toLowerCase()}`.includes(searchLower))); let filterMatch = true; if (activeEventFilters.size > 0) { filterMatch = Array.from(activeEventFilters).every(filter => { if (EVENT_COST_OPTIONS.includes(filter)) return filter === "Gratuito" ? !e.partecipationFee : !!e.partecipationFee; return e.category === filter; }); } const today = new Date(); today.setHours(0,0,0,0); const eventDate = new Date(e.date); return searchMatch && filterMatch && eventDate >= today; });
    
    const resetAllFilters = () => {
        setActiveLocaleFilters(new Set());
        setActiveEventFilters(new Set());
    };
    
    useEffect(() => {
        mainContentRef.current?.scrollTo(0, 0);
    }, [search, displayCategory, activeLocaleFilters, activeEventFilters]);

    const showLocali = displayCategory === 'all' || displayCategory === 'locali';
    const showEvents = displayCategory === 'all' || displayCategory === 'events'; 
    const noLocaliFound = showLocali && filteredLocali.length === 0;
    const noEventsFound = showEvents && filteredEvents.length === 0;
    
    const filterKey = `${displayCategory}-${[...activeLocaleFilters].join('-')}-${[...activeEventFilters].join('-')}`;

    return (
        <div {...swipeHandlers} className="flex flex-col flex-1 h-full">
            <CategoryToggleComponent displayCategory={displayCategory} setDisplayCategory={setDisplayCategory} resetAllFilters={resetAllFilters} />
            {(!search || search.length === 0) && <MapPreviewComponent />}
            
            <div ref={mainContentRef} className="flex flex-col gap-4 sm:gap-5 overflow-y-auto no-scrollbar flex-1 pb-24">
              <div key={filterKey} className="flex flex-col gap-4 sm:gap-5 animate-fade-in">
                {showLocali && (
                    <>
                        {displayCategory === 'all' && filteredLocali.length > 0 && <h2 className="text-lg sm:text-xl font-bold text-slate-700 mt-2 mb-0 px-1">Locali</h2>}
                        {filteredLocali.map((l, index) => (
                            <ListCard key={l.id} onClick={() => openModal('selectedLocale', l.id)} itemType="locale" index={index}>
                                <ImageWithFallback itemKey={`loc_img_${l.id}`} src={l.img} alt={`Foto di ${l.name}`} imgClassName="h-32 sm:h-36 w-full sm:w-32 md:w-40 rounded-xl object-cover" containerClassName="h-32 sm:h-36 w-full sm:w-32 md:w-40 rounded-xl" />
                                <div className="flex flex-col justify-between py-1 flex-1 min-w-0">
                                  <div>
                                     <h3 className="font-bold text-md sm:text-lg text-slate-800 truncate">{l.name}</h3>
                                     <p className="text-xs text-slate-500 truncate">{l.cuisine} • {l.price} • {l.distance}</p>
                                  </div>
                                   <div className="flex items-center gap-4 mt-2">
                                        <div className="flex items-center text-xs sm:text-sm text-amber-600 font-bold">
                                            <Star size={16} className="mr-1.5 fill-amber-500 text-amber-500" /> {l.rating.toFixed(1)} <span className="text-slate-500 font-normal ml-1.5 text-xs">({l.reviews} rec.)</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded-full w-fit">
                                            <Users size={14} />
                                            <span>{l.currentGuests} / {l.capacity}</span>
                                        </div>
                                   </div>
                                </div>
                                <FavoriteButton isFavorite={isFavorite(`locale_${l.id}`)} onToggle={() => toggleFavorite({ ...l, itemType: 'locale' })} />
                            </ListCard>
                        ))}
                    </>
                )}
                {showEvents && (
                    <>
                        {displayCategory === 'all' && filteredEvents.length > 0 && <h2 className="text-lg sm:text-xl font-bold text-slate-700 mt-4 mb-0 px-1">Prossimi Eventi</h2>}
                        {filteredEvents.map((e, index) => (
                           <ListCard key={e.id} onClick={() => openModal('selectedEvent', e.id)} itemType="event" index={index} isCharity={e.isCharityEvent}>
                               <ImageWithFallback itemKey={`event_img_${e.id}`} src={e.img} alt={`Foto di ${e.name}`} imgClassName="h-32 sm:h-36 w-full sm:w-32 md:w-40 rounded-xl object-cover" containerClassName="h-32 sm:h-36 w-full sm:w-32 md:w-40 rounded-xl" />
                               <div className="flex flex-col justify-between py-1 flex-1 min-w-0">
                                   <div>
                                       <h3 className="font-bold text-md sm:text-lg text-slate-800 truncate">{e.name}</h3>
                                       <p className="text-xs text-slate-500 truncate">{e.category} • {new Date(e.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'long' })}</p>
                                   </div>
                                    <div className="flex items-center gap-4 mt-2">
                                        <div className="text-xs font-semibold text-green-600">
                                            {e.partecipationFee ? e.partecipationFee : "Gratuito"}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded-full w-fit">
                                            <Users size={14} />
                                            <span>
                                                {e.currentParticipants}
                                                {e.maxParticipants > 0 ? ` / ${e.maxParticipants}` : ''}
                                            </span>
                                        </div>
                                    </div>
                               </div>
                               <FavoriteButton isFavorite={isFavorite(`event_${e.id}`)} onToggle={() => toggleFavorite({ ...e, itemType: 'event' })} />
                           </ListCard>
                        ))}
                    </>
                )}
                 {noLocaliFound && noEventsFound && <p className="text-center text-slate-500 mt-8 py-4">Nessun risultato trovato.</p>}
               </div>
            </div>

            {/* Bottom Controls specific to Home */}
            <div 
              className="fixed left-0 right-0 bg-slate-50/90 backdrop-blur-md shadow-lg z-10 transition-all duration-300 ease-in-out overflow-y-auto no-scrollbar border-t border-b border-slate-200"
              style={{
                bottom: `${68 + BOTTOM_SEARCH_BAR_HEIGHT_PX}px`,
                maxHeight: showFilterPanel ? `${HOME_FILTER_PANEL_MAX_HEIGHT_PX}px` : '0px',
                opacity: showFilterPanel ? 1 : 0,
              }}
            >
                <FilterSectionComponent 
                    displayCategory={displayCategory}
                    restaurantCuisineTypes={localeCuisineTypes}
                    eventData={events}
                    activeRestaurantFilters={activeLocaleFilters}
                    toggleRestaurantFilter={(f) => setActiveLocaleFilters(p => new Set(p.has(f) ? [...p].filter(i => i !== f) : [...p, f]))}
                    resetRestaurantFilters={() => setActiveLocaleFilters(new Set())}
                    activeEventFilters={activeEventFilters}
                    toggleEventFilter={(f) => setActiveEventFilters(p => new Set(p.has(f) ? [...p].filter(i => i !== f) : [...p, f]))}
                    resetEventFilters={() => setActiveEventFilters(new Set())}
                    showRestaurantFilterSection={showLocaleFilterSection}
                    setShowRestaurantFilterSection={setShowLocaleFilterSection}
                    showEventFilterSection={showEventFilterSection}
                    setShowEventFilterSection={setShowEventFilterSection}
                />
            </div>
             <div 
                className="bg-white/95 backdrop-blur-md px-3 fixed left-0 right-0 z-20 transition-all duration-300"
                style={{ bottom: `68px`, height: `${BOTTOM_SEARCH_BAR_HEIGHT_PX}px` }} 
              >
                <div className="flex items-center gap-2 h-full">
                    <div className="relative flex-1">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input type="text" placeholder="Cerca..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-9 pl-9 pr-7 py-1.5 text-sm bg-slate-100 border-slate-300 rounded-lg"/>
                    </div>
                    <button onClick={toggleFilterPanel} className={`p-2 rounded-lg ${showFilterPanel ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                        <ListFilter size={18} />
                    </button>
                </div>
            </div>

            {/* FAB Menu */}
            {isFabMenuOpen && (
              <div 
                className="fixed inset-0 bg-black/40 z-30" 
                onClick={() => setIsFabMenuOpen(false)}
                aria-hidden="true"
              ></div>
            )}
            <div className="fixed bottom-[78px] left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-4">
              {isFabMenuOpen && (
                <div className="animate-fab-menu-open flex items-center justify-center gap-4">
                  {/* Proponi Tavolo (Left) */}
                  <div 
                    className="flex items-center gap-2 cursor-pointer group"
                    onClick={() => {
                      openModal('isProposeTableModalOpen', true);
                      setIsFabMenuOpen(false);
                    }}
                  >
                    <span className="bg-white/90 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md transition-transform duration-200 group-hover:scale-105">
                      Proponi
                    </span>
                    <button 
                      className="w-12 h-12 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-lg transition-transform duration-200 group-hover:scale-110"
                      aria-label="Proponi un tavolo"
                    >
                      <ClipboardList size={24} />
                    </button>
                  </div>

                  {/* Crea Evento (Right) */}
                  <div 
                    className="flex items-center gap-2 cursor-pointer group"
                    onClick={() => {
                      openModal('isCreateEventModalOpen', true);
                      setIsFabMenuOpen(false);
                    }}
                  >
                    <button 
                      className="w-12 h-12 rounded-full bg-purple-500 text-white flex items-center justify-center shadow-lg transition-transform duration-200 group-hover:scale-110"
                      aria-label="Crea un evento"
                    >
                      <PlusCircle size={24} />
                    </button>
                    <span className="bg-white/90 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md transition-transform duration-200 group-hover:scale-105">
                      Crea
                    </span>
                  </div>
                </div>
              )}
              
              {/* Main FAB */}
              <button
                onClick={() => setIsFabMenuOpen(!isFabMenuOpen)}
                className="w-16 h-16 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-xl hover:bg-rose-600 transition-all duration-300 active:scale-95"
                aria-label={isFabMenuOpen ? "Chiudi menu azioni" : "Apri menu azioni"}
              >
                <Plus
                  size={32}
                  className={`transition-transform duration-300 ${isFabMenuOpen ? 'rotate-45' : 'rotate-0'}`}
                />
              </button>
            </div>
        </div>
    );
};

export default HomePage;