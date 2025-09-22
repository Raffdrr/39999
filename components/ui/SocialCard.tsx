import React from 'react';
import { Users, ArrowRight } from 'lucide-react';
import { SocialCard as SocialCardType } from '../../types';
import { useUIStore } from '../../stores';

interface SocialCardProps {
  card: SocialCardType;
  index: number;
}

const SocialCard: React.FC<SocialCardProps> = ({ card, index }) => {
  const { openModal } = useUIStore();

  return (
    <div 
        style={{ animationDelay: `${index * 75}ms` }}
        className="flex flex-col gap-3 sm:gap-4 rounded-2xl p-4 sm:p-5 
          bg-white dark:bg-slate-950
          border border-slate-200/80 dark:border-orange-500/30
          shadow-lg 
          dark:shadow-[0_4px_14px_-1px_rgba(249,115,22,0.08)]
          dark:hover:shadow-[0_8px_25px_-3px_rgba(249,115,22,0.12)]
          transition-all duration-300 ease-in-out animate-fade-in-up 
          hover:-translate-y-1 active:scale-[0.98]"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 flex-shrink-0 bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center rounded-full shadow-md">
            <Users size={20} />
        </div>
        <p className="social-card-text text-sm font-medium text-slate-800 leading-relaxed">{card.text}</p>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex -space-x-3">
            {card.friendAvatars.map((avatar, i) => (
                <img key={i} src={avatar} alt={`Friend ${i+1}`} className="avatar-border w-8 h-8 rounded-full border-2 object-cover shadow-sm" />
            ))}
        </div>
        {card.relatedEventId && (
            <button 
                // FIX: Use 'modalView' to open the event modal.
                onClick={() => {
                    const eventId = `event_${card.relatedEventId}`;
                    openModal('modalView', { list: [eventId], index: 0 });
                }}
                className="social-card-button flex items-center gap-1.5 text-xs font-semibold text-indigo-600 px-3 py-1.5 rounded-full shadow-md hover:bg-indigo-50 transition-all duration-200 ease-out active:scale-95 hover:shadow-lg hover:-translate-y-0.5"
            >
                Visualizza <ArrowRight size={14} />
            </button>
        )}
      </div>
    </div>
  );
};

export default SocialCard;