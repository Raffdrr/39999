import React, { useMemo } from 'react';
import { useDataStore, useUIStore, useFavoritesStore } from '../stores';
import { Locale, Event, SocialCard as SocialCardType, FavoriteItem } from '../types';

import StoriesSection from '../components/ui/StoriesSection';
import MapPreview from '../components/ui/MapPreview';
import CategoryToggle from '../components/ui/CategoryToggle';
import ListCard from '../components/ListCard';
import ImageWithFallback from '../components/ImageWithFallback';
import SocialCard from '../components/ui/SocialCard';
import { StarIcon, MapPinIcon } from '../components/icons/secondary';
import { Calendar, HandHeart } from 'lucide-react';
// FIX: Import SOCIAL_CARD_DATA to resolve reference error.
import { SOCIAL_CARD_DATA } from '../constants';

const HomePage: React.FC = () => {
    const { locales, events } = useDataStore();
    const { openModal, searchTerm, displayCategory, setDisplayCategory, resetAllFilters, activeLocaleFilters, activeEventFilters } = useUIStore();
    const { isFavorite, toggleFavorite } = useFavoritesStore();
    
    const { filteredItems, itemIdsForModalView } = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcomingEvents = events.filter(e => new Date(e.date) >= today);

        let filteredLocales = (displayCategory === 'all' || displayCategory === 'locali')
            ? locales.filter(l => activeLocaleFilters.size === 0 || activeLocaleFilters.has(l.cuisine))
            : [];

        let filteredEvents = (displayCategory === 'all' || displayCategory === 'events')
            ? upcomingEvents.filter(e => {
                if (activeEventFilters.size === 0) return true;
                const costFilter = e.partecipationFee ? 'A Pagamento' : 'Gratuito';
                const hasCategory = activeEventFilters.has(e.category);
                const hasCost = activeEventFilters.has(costFilter);
                return hasCategory || hasCost;
            })
            : [];
        
        if (searchTerm.trim() !== '') {
            const lowercasedSearch = searchTerm.toLowerCase();
            filteredLocales = filteredLocales.filter(l => l.name.toLowerCase().includes(lowercasedSearch));
            filteredEvents = filteredEvents.filter(e => e.name.toLowerCase().includes(lowercasedSearch));
        }

        type CombinedItem = (Locale & { itemType: 'locale' }) | (Event & { itemType: 'event' }) | SocialCardType;

        const socialCards: SocialCardType[] = (searchTerm.trim() === '' && (displayCategory === 'all' || displayCategory === 'events')) 
            ? SOCIAL_CARD_DATA 
            : [];

        const combined: CombinedItem[] = [
            ...socialCards,
            ...filteredLocales.map(l => ({ ...l, itemType: 'locale' as const })), 
            ...filteredEvents.map(e => ({ ...e, itemType: 'event' as const }))
        ]
        .sort((a, b) => {
            if (a.itemType === 'social') return -1;
            if (b.itemType === 'social') return 1;
            const distanceA = a.itemType === 'locale' && a.distance ? parseFloat(a.distance) : Infinity;
            const distanceB = b.itemType === 'locale' && b.distance ? parseFloat(b.distance) : Infinity;
            if (distanceA !== Infinity && distanceB !== Infinity) return distanceA - distanceB;
            return 0;
        });

        const ids = combined
            .filter(item => item.itemType === 'locale' || item.itemType === 'event')
            .map(item => `${item.itemType}_${item.id}`);
        
        return { filteredItems: combined, itemIdsForModalView: ids };
    }, [locales, events, displayCategory, activeLocaleFilters, activeEventFilters, searchTerm]);
    
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
            
            {filteredItems.map((item, index) => {
                if (item.itemType === 'social') {
                    return <SocialCard key={item.id} card={item as SocialCardType} index={index} />;
                }
                
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
                            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 truncate">{item.name}</h3>
                            {isLocale ? (
                                <>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{locale.cuisine} • {locale.price}</p>
                                    <div className="flex items-center text-xs">
                                        <StarIcon size={14} className="mr-1 flex-shrink-0" />
                                        <span className="text-amber-600 font-bold">{locale.rating?.toFixed(1)}</span>
                                        <span className="text-slate-400 dark:text-slate-500 font-normal ml-1.5 truncate">({locale.reviews} reviews)</span>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate flex items-center"><MapPinIcon size={12} className="inline mr-1"/>{locale.distance} da te</p>
                                </>
                            ) : (
                                <>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{event.category} • {new Date(event.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate flex items-center"><MapPinIcon size={12} className="inline mr-1"/>{event.location || "N/D"}</p>
                                    <div className="text-xs font-semibold text-orange-600 dark:text-orange-400 pt-1">{event.partecipationFee || 'Gratuito'}</div>
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