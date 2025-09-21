import React from 'react';
import { Heart } from 'lucide-react';
import { useFavoritesStore, useUIStore } from '../stores';
import ListCard from '../components/ListCard';
import ImageWithFallback from '../components/ImageWithFallback';
import { Locale, Event, FavoriteItem } from '../types';
import { StarIcon, MapPinIcon, TrashIcon } from '../components/icons/secondary';

const FavoritesPage: React.FC = () => {
    const { favorites, toggleFavorite } = useFavoritesStore();
    const { openModal } = useUIStore();
    const favoriteItems: FavoriteItem[] = Array.from(favorites.values());

    return (
        <div className="animate-page-content-enter flex flex-col flex-1 h-full">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-700 dark:text-slate-200 mb-4 sm:mb-5 px-1">I Tuoi Preferiti ({favoriteItems.length})</h2>
            {favoriteItems.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 p-4">
                    <Heart size={64} className="mb-4 opacity-30 text-orange-300" />
                    <p className="text-center text-sm">Non hai ancora aggiunto preferiti.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4 sm:gap-5 overflow-y-auto no-scrollbar flex-1">
                    {favoriteItems.map((item, index) => {
                        const isLocale = item.itemType === 'locale';
                        return (
                            <ListCard
                                key={item.id}
                                onClick={() => openModal(isLocale ? 'selectedLocale' : 'selectedEvent', item.id!)}
                                itemType={item.itemType}
                                index={index}
                                isCharity={!isLocale && (item as Event).isCharityEvent}
                            >
                                <ImageWithFallback 
                                    itemKey={`fav_img_${item.id}`} 
                                    src={item.img!} 
                                    alt={`Foto di ${item.name}`} 
                                    imgClassName="w-full h-full object-cover"
                                    containerClassName="w-24 h-24 rounded-lg flex-shrink-0"
                                />
                                <div className="flex flex-col justify-center flex-1 min-w-0 space-y-0.5">
                                    <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 truncate">{item.name}</h3>
                                    {isLocale ? (
                                        <>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{(item as Locale).cuisine} • {(item as Locale).price}</p>
                                            <div className="flex items-center text-xs">
                                                <StarIcon size={14} className="mr-1 flex-shrink-0" />
                                                <span className="text-amber-600 font-bold">{(item as Locale).rating?.toFixed(1)}</span>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{(item as Event).category} • {new Date((item as Event).date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate flex items-center"><MapPinIcon size={12} className="inline mr-1"/>{(item as Event).location || "N/D"}</p>
                                        </>
                                    )}
                                </div>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); toggleFavorite(item); }} 
                                    className="p-2 rounded-full hover:bg-red-100/80 dark:hover:bg-red-500/20 self-center ml-2 flex-shrink-0 transition-all duration-200 ease-out active:scale-90 active:bg-red-200/80 dark:active:bg-red-500/30"
                                    aria-label={`Rimuovi ${item.name} dai preferiti`}
                                >
                                    <TrashIcon size={18} />
                                </button>
                            </ListCard>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default FavoritesPage;