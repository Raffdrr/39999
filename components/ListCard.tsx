import React from 'react';
import FavoriteButton from './ui/FavoriteButton';
import { MapPin, Calendar, HandHeart } from 'lucide-react';

interface ListCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  itemType?: 'locale' | 'event' | 'past_event' | string;
  index?: number;
  isCharity?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: (e: React.MouseEvent) => void;
}

const ListCard: React.FC<ListCardProps> = ({
  children,
  onClick,
  className = "",
  itemType = "",
  index = 0,
  isCharity = false,
  isFavorite,
  onToggleFavorite,
}) => {
  const typeStyles =
    itemType === 'locale' ? { border: 'border-l-amber-500', text: 'text-amber-700 dark:text-amber-400', icon: MapPin } :
    itemType === 'event' ? { border: 'border-l-orange-500', text: 'text-orange-700 dark:text-orange-400', icon: Calendar } :
    itemType === 'past_event' ? { border: 'border-l-indigo-500', text: 'text-indigo-700 dark:text-indigo-400', icon: Calendar } :
    { border: 'border-l-slate-300 dark:border-l-slate-700', text: 'text-slate-700 dark:text-slate-300', icon: null };
  
  let backgroundClass = 'bg-white dark:bg-slate-800';
  if (isCharity) {
    typeStyles.border = 'border-l-pink-500';
    typeStyles.text = 'text-pink-700 dark:text-pink-400';
    typeStyles.icon = HandHeart;
    backgroundClass = 'bg-pink-50 dark:bg-pink-900/20';
  } else if (itemType === 'event') {
    backgroundClass = 'bg-orange-50 dark:bg-orange-900/20';
  }

  const animationDelay = `${index * 75}ms`;

  return (
    <div
      onClick={onClick}
      style={{ animationDelay }}
      className={`relative flex flex-row gap-3 ${backgroundClass} rounded-xl shadow-md dark:shadow-lg dark:shadow-black/25 p-3 transition-all duration-300 ease-out cursor-pointer hover:shadow-2xl dark:hover:shadow-2xl dark:hover:shadow-black/30 hover:-translate-y-1 active:scale-[0.98] active:shadow-lg border border-slate-200/80 dark:border-slate-700/80 border-l-2 ${typeStyles.border} ${className} animate-fade-in-up`}
    >
      
      {isFavorite !== undefined && onToggleFavorite && (
        <div className="absolute top-1.5 right-1.5 z-10">
          <FavoriteButton
            isFavorite={isFavorite}
            onToggle={onToggleFavorite}
            className="p-2 rounded-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm hover:bg-orange-100/80 dark:hover:bg-orange-500/20 transition-all active:scale-90 active:bg-orange-200/80 dark:active:bg-orange-500/30"
            iconSize={18}
          />
        </div>
      )}
      {children}
    </div>
  );
};

export default React.memo(ListCard);