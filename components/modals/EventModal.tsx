
import React, { useState } from 'react';
import { Event, FavoriteItem } from '../../types';
import FullScreenModalWrapper from './FullScreenModalWrapper';
import ImageWithFallback from '../ImageWithFallback';
import FavoriteButton from '../ui/FavoriteButton';
import useSwipe from '../../hooks/useSwipe';
import { useUIStore, useFavoritesStore, useUserStore } from '../../stores';
import {
  X, ChevronLeft, ChevronRight, Calendar, Clock, MapPin, Users, Ticket, MessageSquare, HandHeart, Info, Star
} from 'lucide-react';

interface EventModalProps {
  event: Event;
  onClose: () => void;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  isFirstItem: boolean;
  isLastItem: boolean;
}

type Tab = 'details' | 'participants' | 'reviews';

const EventModal: React.FC<EventModalProps> = ({ event, onClose, onSwipeLeft, onSwipeRight, isFirstItem, isLastItem }) => {
  const { openModal } = useUIStore();
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const { joinedEvents, joinEvent, leaveEvent, credit } = useUserStore();
  const [activeTab, setActiveTab] = useState<Tab>('details');
  const swipeHandlers = useSwipe({ onSwipedLeft: onSwipeLeft, onSwipedRight: onSwipeRight });

  const isUserJoined = joinedEvents.has(event.id);
  const isEventFull = event.currentParticipants >= event.maxParticipants;
  const eventDate = new Date(event.date);
  const isPastEvent = eventDate < new Date();

  const handleJoinLeave = () => {
    if (isUserJoined) {
      leaveEvent(event);
    } else if (!isEventFull && !isPastEvent) {
      if (event.partecipationFee && !event.paidWithCredit) {
         handlePayFee();
      } else {
         joinEvent(event);
      }
    }
  };
  
  const handlePayFee = () => {
     if (!event.partecipationFee) return;
     const fee = parseFloat(event.partecipationFee.replace('€', '').replace(',', '.'));
     if(credit < fee) {
         openModal('isAddCreditOpen', true);
         return;
     }
      openModal('payWithCreditAmountModal', {
        itemType: 'event',
        itemId: event.id,
        itemName: event.name,
        maxAmount: fee,
        isEventFee: true,
      });
  }

  const renderFooterAction = () => {
    if (isPastEvent) {
        return <div className="modal-footer-button-secondary text-center">Evento Concluso</div>;
    }

    let mainButton;
    if (isUserJoined) {
        mainButton = <button onClick={handleJoinLeave} className="modal-footer-button-secondary flex-1">Lascia Evento</button>;
    } else if (isEventFull) {
        mainButton = <button disabled className="modal-footer-button-primary w-full opacity-50 cursor-not-allowed">Evento Pieno</button>;
    } else if (event.partecipationFee && !event.paidWithCredit) {
        mainButton = <button onClick={handlePayFee} className="modal-footer-button-primary flex-1">Paga Quota ({event.partecipationFee})</button>;
    } else {
        mainButton = <button onClick={handleJoinLeave} className="modal-footer-button-primary flex-1">Partecipa</button>;
    }

    return (
        <div className="flex gap-3">
            {event.isCharityEvent && <button onClick={() => openModal('donationModal', event.id)} className="p-4 bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-400 rounded-lg"><HandHeart/></button>}
            {mainButton}
        </div>
    );
  };
  
  const eventFormattedDate = new Date(event.date).toLocaleDateString('it-IT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <FullScreenModalWrapper open={true} onClose={onClose}>
      <div className="flex-1 flex flex-col h-full bg-slate-100 dark:bg-black" {...swipeHandlers}>
        <header className="relative h-48 sm:h-64 w-full flex-shrink-0">
          <ImageWithFallback src={event.img} alt={event.name} containerClassName="w-full h-full" imgClassName="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
             <button onClick={onClose} className="modal-header-button"><X size={24} /></button>
             <FavoriteButton
                isFavorite={isFavorite(`event_${event.id}`)}
                onToggle={(e) => { e.stopPropagation(); toggleFavorite({ ...event, itemType: 'event' }); }}
                className="modal-header-button"
                iconSize={22}
            />
          </div>
           {!isFirstItem && <button onClick={onSwipeRight} className="absolute top-1/2 -translate-y-1/2 left-2 modal-header-button"><ChevronLeft size={28} /></button>}
           {!isLastItem && <button onClick={onSwipeLeft} className="absolute top-1/2 -translate-y-1/2 right-2 modal-header-button"><ChevronRight size={28} /></button>}
           <div className="absolute bottom-4 left-4 right-4">
             <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">{event.name}</h1>
             <p className="text-sm text-slate-200 drop-shadow">{event.category}</p>
           </div>
        </header>
        
        <main className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
           <div className="sticky top-0 bg-slate-100 dark:bg-black z-10 border-b border-slate-200 dark:border-slate-800">
            <div className="flex justify-around items-center p-1">
                {([['details', 'Dettagli', Info], ['participants', 'Partecipanti', Users], ['reviews', 'Recensioni', MessageSquare]] as const).map(([id, label, Icon]) => (
                    <button key={id} onClick={() => setActiveTab(id)} className={`modal-tab-button ${activeTab === id ? 'modal-tab-button-active' : ''}`}>
                        <Icon size={16}/><span>{label}</span>
                    </button>
                ))}
            </div>
          </div>
          
           <div className="p-4 space-y-4">
             {activeTab === 'details' && (
               <div className="animate-fade-in space-y-4 text-sm">
                  <div className="modal-info-item"><Calendar size={16} className="text-slate-500"/><span>{eventFormattedDate}</span></div>
                  <div className="modal-info-item"><Clock size={16} className="text-slate-500"/><span>{event.time}</span></div>
                  <div className="modal-info-item"><MapPin size={16} className="text-slate-500"/><span>{event.location}</span></div>
                  <div className="modal-info-item"><Ticket size={16} className="text-slate-500"/><span>{event.partecipationFee || 'Gratuito'}</span></div>
                  <div className="modal-info-item"><Users size={16} className="text-slate-500"/><span>{event.currentParticipants} / {event.maxParticipants} partecipanti</span></div>
                  
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed pt-2">{event.description}</p>
                   
                  {event.hashtags.length > 0 && <div className="flex flex-wrap gap-2 pt-2">
                    {event.hashtags.map(tag => <span key={tag} className="px-2 py-1 text-xs bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full">#{tag}</span>)}
                  </div>}

                  {event.isCharityEvent && <div className="p-3 bg-pink-50 dark:bg-pink-500/10 rounded-lg border border-pink-200 dark:border-pink-500/20 space-y-2">
                    <p className="font-semibold text-pink-700 dark:text-pink-400">Evento Benefico</p>
                    <div className="w-full bg-pink-200 dark:bg-pink-900 rounded-full h-2.5"><div className="bg-pink-500 h-2.5 rounded-full" style={{width: `${Math.min(100, (event.donationsReceived / event.donationGoal) * 100)}%`}}></div></div>
                    <p className="text-xs text-pink-600 dark:text-pink-300">Raccolti €{event.donationsReceived} di €{event.donationGoal}</p>
                  </div>}
               </div>
             )}
             {activeTab === 'participants' && (
                <div className="animate-fade-in space-y-2">
                    <p className="text-sm font-semibold">{event.currentParticipants} Partecipanti Attuali</p>
                    {/* Placeholder for participant list */}
                    <p className="text-xs text-slate-500">Lista partecipanti non disponibile in questa demo.</p>
                </div>
             )}
             {activeTab === 'reviews' && (
                <div className="animate-fade-in space-y-3">
                    <button onClick={() => openModal('reviewModal', { type: 'event', item: event })} className="w-full py-2.5 bg-orange-500 text-white font-semibold rounded-lg text-sm mb-3">Lascia una recensione</button>
                    {event.userReviews.length > 0 ? event.userReviews.map(r => (
                        <div key={r.userId + r.date} className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                             <div className="flex items-center mb-2">
                               <img src={r.avatar} alt={r.name} className="w-8 h-8 rounded-full mr-2"/>
                               <div>
                                <p className="font-semibold text-sm text-slate-800 dark:text-slate-100">{r.name}</p>
                                <div className="flex items-center">{[...Array(r.rating)].map((_, i) => <Star key={i} size={14} className="text-amber-400 fill-amber-400"/>)}</div>
                               </div>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{r.text}</p>
                        </div>
                    )) : <p className="text-center text-sm text-slate-500 py-4">Nessuna recensione ancora.</p>}
                </div>
             )}
           </div>
        </main>
        
        <footer className="p-4 bg-white/80 dark:bg-black/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 z-10 flex-shrink-0">
          {renderFooterAction()}
        </footer>
      </div>
    </FullScreenModalWrapper>
  );
};

export default EventModal;
