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
  const typeInfo =
    isCharity ? { bg: 'bg-pink-500', label: 'Benefico' } :
    itemType === 'locale' ? { bg: 'bg-amber-500', label: 'Locale' } :
    itemType === 'event' ? { bg: 'bg-orange-500', label: 'Evento' } :
    itemType === 'past_event' ? { bg: 'bg-indigo-500', label: 'Passato' } :
    { bg: 'bg-slate-400', label: 'Info' };

  let backgroundClass = 'bg-white dark:bg-slate-800';
  if (isCharity) {
    backgroundClass = 'bg-pink-50 dark:bg-pink-900/20';
  } else if (itemType === 'event') {
    backgroundClass = 'bg-orange-50 dark:bg-orange-900/20';
  } else if (itemType === 'locale') {
    backgroundClass = 'bg-slate-50 dark:bg-slate-800/70';
  }

  const animationDelay = `${index * 75}ms`;

  return (
    <div
      onClick={onClick}
      style={{ animationDelay }}
      className={`
        relative flex flex-col gap-3 ${backgroundClass} 
        rounded-2xl p-3
        shadow-md dark:shadow-md dark:shadow-black/20 
        transition-transform transition-shadow duration-300 ease-out 
        cursor-pointer 
        hover:shadow-lg dark:hover:shadow-lg dark:hover:shadow-black/30 hover:-translate-y-1 
        active:scale-[0.98] active:shadow-sm 
        border border-slate-200/60 dark:border-slate-700/60 
        ${className} animate-fade-in-up
      `}
    >
      {/* Pill Indicator */}
      <div className="flex">
        <span className={`px-2 py-0.5 text-[10px] font-bold text-white rounded-full ${typeInfo.bg} shadow`}>
          {typeInfo.label}
        </span>
      </div>
      
      {/* Content Wrapper */}
      <div className="flex flex-row gap-3 items-center">
        {children}
      </div>

      {isFavorite !== undefined && onToggleFavorite && (
        <div className="absolute top-2 right-2 z-10">
          <FavoriteButton
            isFavorite={isFavorite}
            onToggle={onToggleFavorite}
            className="p-2 rounded-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm hover:bg-orange-100/80 dark:hover:bg-orange-500/20 transition-all active:scale-90 active:bg-orange-200/80 dark:active:bg-orange-500/30"
            iconSize={18}
          />
        </div>
      )}
    </div>
  );
};

export default React.memo(ListCard);