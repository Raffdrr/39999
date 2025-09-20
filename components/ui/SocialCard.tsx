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
        className="flex flex-col gap-3 sm:gap-4 rounded-2xl p-4 sm:p-5 shadow-lg transition-all duration-300 ease-in-out border border-slate-200/50 animate-fade-in-up animate-social-card-gradient"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 flex-shrink-0 bg-indigo-500 text-white flex items-center justify-center rounded-full shadow-md">
            <Users size={20} />
        </div>
        <p className="text-sm font-medium text-slate-800 leading-relaxed">{card.text}</p>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex -space-x-3">
            {card.friendAvatars.map((avatar, i) => (
                <img key={i} src={avatar} alt={`Friend ${i+1}`} className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm" />
            ))}
        </div>
        {card.relatedEventId && (
            <button 
                onClick={() => openModal('selectedEvent', card.relatedEventId)}
                className="flex items-center gap-1.5 text-xs font-semibold bg-white text-indigo-600 px-3 py-1.5 rounded-full shadow-md hover:bg-indigo-50 transition-colors active:scale-95"
            >
                Visualizza <ArrowRight size={14} />
            </button>
        )}
      </div>
    </div>
  );
};

export default SocialCard;