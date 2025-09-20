import React from 'react';
import { CORAL_BORDER } from '../constants';

interface ListCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  itemType?: 'restaurant' | 'event' | 'past_event' | string;
  index?: number;
  isCharity?: boolean;
}

const ListCard: React.FC<ListCardProps> = ({
  children,
  onClick,
  className = "",
  itemType = "",
  index = 0,
  isCharity = false,
}) => {
  const typeColor =
    itemType === 'restaurant' ? 'border-amber-500/30' :
    itemType === 'event' ? (isCharity ? 'border-pink-500/40' : CORAL_BORDER) :
    itemType === 'past_event' ? 'border-indigo-500/30' :
    'border-slate-200';

  const animationDelay = `${index * 75}ms`;

  return (
    <div
      onClick={onClick}
      style={{ animationDelay }}
      className={`flex flex-col sm:flex-row gap-3 sm:gap-4 bg-white/90 backdrop-blur-2xl rounded-2xl shadow-lg p-3 sm:p-4 hover:shadow-2xl transition-all duration-300 ease-in-out cursor-pointer hover:scale-[1.02] active:scale-[0.99] border ${typeColor} ${className} animate-card-enter`}
    >
      {children}
    </div>
  );
};

export default React.memo(ListCard);