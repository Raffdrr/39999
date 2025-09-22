import React, { useMemo } from 'react';
import { useDataStore, useUIStore, useFavoritesStore } from '../stores';
import { Locale, Event, FavoriteItem } from '../types';

import StoriesSection from '../components/ui/StoriesSection';
import MapPreview from '../components/ui/MapPreview';
import WeatherWidget from '../components/ui/WeatherWidget';
import CategoryToggle from '../components/ui/CategoryToggle';
import ListCard from '../components/ListCard';
import ImageWithFallback from '../components/ImageWithFallback';
import { StarIcon, MapPinIcon } from '../components/icons/secondary';

const HomePage: React.FC = () => {
    const { locales, events } = useDataStore();
    const { openModal, searchTerm, displayCategory, setDisplayCategory, resetAllFilters, activeLocaleFilters, activeEventFilters, activeDateFilter, activePriceFilters } = useUIStore();
    const { isFavorite, toggleFavorite } = useFavoritesStore();
    
    const { filteredItems, itemIdsForModalView } = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcomingEvents = events.filter(e => new Date(e.date) >= today);

        let filteredLocales = (displayCategory === 'all' || displayCategory === 'locali')
            ? locales.filter(l => {
                const cuisineMatch = activeLocaleFilters.size === 0 || activeLocaleFilters.has(l.cuisine);
                const priceMatch = activePriceFilters.size === 0 || activePriceFilters.has(l.price);
                return cuisineMatch && priceMatch;
            })
            : [];

        let filteredEvents = (displayCategory === 'all' || displayCategory === 'events')
            ? upcomingEvents.filter(e => {
                let categoryAndCostMatch = true;
                if (activeEventFilters.size > 0) {
                    const costFilter = e.partecipationFee ? 'A Pagamento' : 'Gratuito';
                    const hasCategory = activeEventFilters.has(e.category);
                    const hasCost = activeEventFilters.has(costFilter);
                    categoryAndCostMatch = hasCategory || hasCost;
                }

                let dateMatch = true;
                if (activeDateFilter) {
                    const eventDate = new Date(e.date);
                    eventDate.setHours(0, 0, 0, 0);

                    const tomorrow = new Date(today);
                    tomorrow.setDate(today.getDate() + 1);
                    
                    const dayOfWeek = today.getDay(); // 0=Sun, 1=Mon,...
                    const startOfWeek = new Date(today);
                    startOfWeek.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)); 
                    
                    const endOfWeek = new Date(startOfWeek);
                    endOfWeek.setDate(startOfWeek.getDate() + 6);

                    const saturday = new Date(today);
                    if (dayOfWeek !== 0) { // If not Sunday
                        saturday.setDate(today.getDate() - dayOfWeek + 6);
                    } else { // If Sunday
                        saturday.setDate(today.getDate() - 1);
                    }
                    const sunday = new Date(saturday);
                    sunday.setDate(saturday.getDate() + 1);


                    if (activeDateFilter === 'Oggi') {
                        dateMatch = eventDate.getTime() === today.getTime();
                    } else if (activeDateFilter === 'Domani') {
                        dateMatch = eventDate.getTime() === tomorrow.getTime();
                    } else if (activeDateFilter === 'Questa settimana') {
                        dateMatch = eventDate >= startOfWeek && eventDate <= endOfWeek;
                    } else if (activeDateFilter === 'Questo weekend') {
                        dateMatch = eventDate.getTime() === saturday.getTime() || eventDate.getTime() === sunday.getTime();
                    }
                }

                return categoryAndCostMatch && dateMatch;
            })
            : [];
        
        if (searchTerm.trim() !== '') {
            const lowercasedSearch = searchTerm.toLowerCase();
            filteredLocales = filteredLocales.filter(l => l.name.toLowerCase().includes(lowercasedSearch));
            filteredEvents = filteredEvents.filter(e => e.name.toLowerCase().includes(lowercasedSearch));
        }

        type CombinedItem = (Locale & { itemType: 'locale' }) | (Event & { itemType: 'event' });

        const combined: CombinedItem[] = [
            ...filteredLocales.map(l => ({ ...l, itemType: 'locale' as const })), 
            ...filteredEvents.map(e => ({ ...e, itemType: 'event' as const }))
        ]
        .sort((a, b) => {
            const distanceA = a.itemType === 'locale' && a.distance ? parseFloat(a.distance) : Infinity;
            const distanceB = b.itemType === 'locale' && b.distance ? parseFloat(b.distance) : Infinity;
            if (distanceA !== Infinity && distanceB !== Infinity) return distanceA - distanceB;
            return 0;
        });

        const ids = combined
            .map(item => `${item.itemType}_${item.id}`);
        
        return { filteredItems: combined, itemIdsForModalView: ids };
    }, [locales, events, displayCategory, activeLocaleFilters, activeEventFilters, activeDateFilter, activePriceFilters, searchTerm]);
    
    const handleItemClick = (clickedItemId: string) => {
        const itemIndex = itemIdsForModalView.indexOf(clickedItemId);
        if (itemIndex !== -1) {
            openModal('modalView', { list: itemIdsForModalView, index: itemIndex });
        }
    };


    return (
        <div className="animate-page-content-enter flex flex-col gap-4">
            <StoriesSection />
            <MapPreview />
            <CategoryToggle
                displayCategory={displayCategory}
                setDisplayCategory={setDisplayCategory}
                resetAllFilters={resetAllFilters}
            />
            <WeatherWidget />
            
            {filteredItems.map((item, index) => {
                const isLocale = item.itemType === 'locale';
                const locale = item as Locale;
                const event = item as Event;
                const favId = `${isLocale ? 'locale' : 'event'}_${item.id}`;
                
                return (
                    <ListCard
                        key={item.id}
                        onClick={() => handleItemClick(`${item.itemType}_${item.id}`)}
                        itemType={isLocale ? 'locale' : 'event'}
                        index={index}
                        isCharity={!isLocale && event.isCharityEvent}
                        isFavorite={isFavorite(favId)}
                        onToggleFavorite={() => toggleFavorite(item as FavoriteItem)}
                    >
                        <ImageWithFallback 
                            itemKey={`list_img_${item.id}`} 
                            src={item.img!} 
                            alt={`Foto di ${item.name}`} 
                            imgClassName="w-full h-full object-cover"
                            containerClassName="w-24 h-24 rounded-lg flex-shrink-0"
                        />
                        <div className="flex flex-col justify-center flex-1 min-w-0 space-y-0.5">
                            <h3 className="list-card-title font-bold text-base text-slate-800 truncate">{item.name}</h3>
                            {isLocale ? (
                                <>
                                    <p className="list-card-subtitle text-xs text-slate-500 truncate">{locale.cuisine} • {locale.price}</p>
                                    <div className="flex items-center text-xs">
                                        <StarIcon size={14} className="mr-1 flex-shrink-0" />
                                        <span className="text-amber-600 font-bold">{locale.rating?.toFixed(1)}</span>
                                        <span className="list-card-rating-reviews text-slate-400 font-normal ml-1.5 truncate">({locale.reviews} reviews)</span>
                                    </div>
                                    <p className="list-card-distance text-xs text-slate-500 truncate flex items-center"><MapPinIcon size={12} className="inline mr-1"/>{locale.distance} da te</p>
                                </>
                            ) : (
                                <>
                                    <p className="list-card-subtitle text-xs text-slate-500 truncate">{event.category} • {new Date(event.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })}</p>
                                    <p className="list-card-distance text-xs text-slate-500 truncate flex items-center"><MapPinIcon size={12} className="inline mr-1"/>{event.location || "N/D"}</p>
                                    <div className="list-card-event-fee text-xs font-semibold text-orange-600 pt-1">{event.partecipationFee || 'Gratuito'}</div>
                                </>
                            )}
                        </div>
                    </ListCard>
                );
            })}
             {filteredItems.length === 0 && (
                <div className="text-center py-10">
                    <p className="text-slate-500 dark:text-slate-400">Nessun risultato trovato.</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Prova a modificare i filtri o la ricerca.</p>
                </div>
            )}
        </div>
    );
};

export default HomePage;