import React from 'react';
import { CORAL_BORDER } from '../constants';
import FavoriteButton from './ui/FavoriteButton';
import { MapPin, Calendar } from 'lucide-react';

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
  const typeColor =
    itemType === 'locale' ? 'border-amber-500/30' :
    itemType === 'event' ? (isCharity ? 'border-pink-500/40' : CORAL_BORDER) :
    itemType === 'past_event' ? 'border-indigo-500/30' :
    'border-slate-200';

  const animationDelay = `${index * 75}ms`;

  return (
    <div
      onClick={onClick}
      style={{ animationDelay }}
      className={`relative flex flex-row gap-3 bg-white/90 backdrop-blur-2xl rounded-xl shadow-md p-2.5 hover:shadow-xl transition-all duration-300 ease-in-out cursor-pointer hover:scale-[1.01] active:scale-[0.98] border ${typeColor} ${className} animate-fade-in-up`}
    >
      {(itemType === 'locale' || itemType === 'event') && (
        <div className="absolute top-2 left-2 z-10 bg-white/80 backdrop-blur-sm rounded-full text-[10px] font-semibold px-1.5 py-0.5 flex items-center gap-0.5 shadow-sm">
          {itemType === 'locale' ? (
            <>
              <MapPin size={10} className="text-amber-600" />
              <span className="text-amber-800">Locale</span>
            </>
          ) : (
             <>
              <Calendar size={10} className="text-rose-600" />
              <span className="text-rose-800">Evento</span>
            </>
          )}
        </div>
      )}

      {isFavorite !== undefined && onToggleFavorite && (
        <div className="absolute top-1.5 right-1.5 z-10">
          <FavoriteButton
            isFavorite={isFavorite}
            onToggle={onToggleFavorite}
            className="p-2 rounded-full bg-white/50 backdrop-blur-sm hover:bg-rose-100/80"
            iconSize={18}
          />
        </div>
      )}
      {children}
    </div>
  );
};

export default React.memo(ListCard);