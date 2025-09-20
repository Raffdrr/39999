
import { create } from 'zustand';
import { FavoriteItem, Locale, Event } from '../types';
import { useUIStore } from './useUIStore';
import { initialLocaleData, initialEventData } from '../constants';
import { Heart } from 'lucide-react';
import React from 'react';

interface FavoritesState {
  favorites: Map<string, FavoriteItem>;
  toggleFavorite: (item: FavoriteItem) => void;
  isFavorite: (itemId: string) => boolean;
}

const initialFavs = new Map<string, FavoriteItem>();
const favLocale = initialLocaleData.find(l => l.id === "loc1");
if (favLocale) initialFavs.set(`locale_${favLocale.id}`, {...favLocale, itemType: 'locale'});
const favEvent = initialEventData.find(e => e.id === "event1");
if (favEvent) initialFavs.set(`event_${favEvent.id}`, {...favEvent, itemType: 'event'});

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: initialFavs,
  
  toggleFavorite: (item) => {
    const itemId = `${item.itemType}_${item.id}`;
    const newFavorites = new Map(get().favorites);
    
    if (newFavorites.has(itemId)) {
      newFavorites.delete(itemId);
      useUIStore.getState().showToast(`${item.name} rimosso dai preferiti.`, "info", React.createElement(Heart, { className: "w-5 h-5 text-sky-400" }));
    } else {
      newFavorites.set(itemId, item);
      useUIStore.getState().showToast(`${item.name} aggiunto ai preferiti!`, "success", React.createElement(Heart, { className: "w-5 h-5 text-rose-400 fill-rose-400" }));
    }
    
    set({ favorites: newFavorites });
  },

  isFavorite: (itemId) => get().favorites.has(itemId),
}));
