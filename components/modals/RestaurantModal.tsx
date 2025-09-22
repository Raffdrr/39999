
import React, { useState } from 'react';
import { Locale, FavoriteItem } from '../../types';
import FullScreenModalWrapper from './FullScreenModalWrapper';
import ImageWithFallback from '../ImageWithFallback';
import FavoriteButton from '../ui/FavoriteButton';
import useSwipe from '../../hooks/useSwipe';
import { useUIStore, useFavoritesStore, useUserStore } from '../../stores';
import {
  X, ChevronLeft, ChevronRight, Star, MapPin, Phone, Globe, Clock, Utensils, MessageSquare, Camera, Users, XCircle, CheckCircle
} from 'lucide-react';

interface RestaurantModalProps {
  locale: Locale;
  onClose: () => void;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  isFirstItem: boolean;
  isLastItem: boolean;
}

type Tab = 'info' | 'menu' | 'reviews';

const RestaurantModal: React.FC<RestaurantModalProps> = ({ locale, onClose, onSwipeLeft, onSwipeRight, isFirstItem, isLastItem }) => {
  const { openModal } = useUIStore();
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const { joinedTables, joinTable, leaveTable } = useUserStore();

  const [activeTab, setActiveTab] = useState<Tab>('info');
  const swipeHandlers = useSwipe({ onSwipedLeft: onSwipeLeft, onSwipedRight: onSwipeRight });

  const isUserJoined = joinedTables.has(locale.id);
  const isTableFull = locale.currentGuests >= locale.capacity;
  const billStatus = locale.billDetails?.status;

  const handleJoinTable = () => {
    if (!isTableFull) {
      joinTable(locale);
    }
  };

  const handleLeaveTable = () => {
    leaveTable(locale.id);
  };
  
  const handlePayBill = () => {
    if (!billStatus) {
      openModal('initiatePayBill', locale.id);
    } else if (billStatus === 'awaiting_credit_application' || billStatus === 'ready_to_finalize') {
      openModal('finalizeBill', locale.id);
    }
  }

  const handleApplyCredit = () => {
    openModal('payWithCreditAmountModal', {
      itemType: 'locale',
      itemId: locale.id,
      itemName: locale.name,
      maxAmount: locale.billDetails?.totalAmount,
      isEventFee: false,
      currentContribution: locale.billDetails?.creditContributed
    });
  };
  
  const handleCancelPayment = () => {
      openModal('cancelPayment', locale.id);
  }

  const renderFooterAction = () => {
    if (isUserJoined) {
      if (!billStatus) {
        return (
          <div className="flex gap-3">
            <button onClick={handleLeaveTable} className="modal-footer-button-secondary flex-1">Lascia Tavolo</button>
            <button onClick={handlePayBill} className="modal-footer-button-primary flex-1">Paga il Conto</button>
          </div>
        );
      }
      if (billStatus === 'awaiting_credit_application' || billStatus === 'ready_to_finalize') {
        const isReadyToFinalize = billStatus === 'ready_to_finalize';
        return (
          <div className="flex flex-col gap-2">
            <div className="text-center p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
                <p className="text-sm font-bold text-blue-700 dark:text-blue-300">Conto: €{locale.billDetails?.totalAmount.toFixed(2)}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">Credito applicato: €{locale.billDetails?.creditContributed.toFixed(2)}</p>
            </div>
            <div className="flex gap-3">
                 <button onClick={handleApplyCredit} disabled={isReadyToFinalize} className={`modal-footer-button-secondary flex-1 ${isReadyToFinalize ? 'opacity-50 cursor-not-allowed' : ''}`}>Applica Credito</button>
                 <button onClick={handlePayBill} className="modal-footer-button-primary flex-1">{isReadyToFinalize ? 'Finalizza Pagamento' : 'Paga con Carta'}</button>
            </div>
            <button onClick={handleCancelPayment} className="text-xs text-red-500 hover:underline">Annulla Pagamento</button>
          </div>
        );
      }
       if (billStatus === 'paid_with_credit') {
        return (
            <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 font-semibold p-3 bg-green-50 dark:bg-green-500/10 rounded-lg">
                <CheckCircle size={20} /> Pagamento Completato
            </div>
        );
      }

    }
    return (
      <button onClick={handleJoinTable} disabled={isTableFull} className={`modal-footer-button-primary w-full ${isTableFull ? 'opacity-50 cursor-not-allowed' : ''}`}>
        {isTableFull ? 'Tavolo Pieno' : 'Unisciti al Tavolo'}
      </button>
    );
  };


  return (
    <FullScreenModalWrapper open={true} onClose={onClose}>
      <div className="flex-1 flex flex-col h-full bg-slate-100 dark:bg-black" {...swipeHandlers}>
        <header className="relative h-48 sm:h-64 w-full flex-shrink-0">
          <ImageWithFallback src={locale.img} alt={locale.name} containerClassName="w-full h-full" imgClassName="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
             <button onClick={onClose} className="modal-header-button"><X size={24} /></button>
             <FavoriteButton
                isFavorite={isFavorite(`locale_${locale.id}`)}
                onToggle={(e) => { e.stopPropagation(); toggleFavorite({ ...locale, itemType: 'locale' }); }}
                className="modal-header-button"
                iconSize={22}
            />
          </div>
           {!isFirstItem && <button onClick={onSwipeRight} className="absolute top-1/2 -translate-y-1/2 left-2 modal-header-button"><ChevronLeft size={28} /></button>}
           {!isLastItem && <button onClick={onSwipeLeft} className="absolute top-1/2 -translate-y-1/2 right-2 modal-header-button"><ChevronRight size={28} /></button>}
           <div className="absolute bottom-4 left-4 right-4">
             <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">{locale.name}</h1>
             <p className="text-sm text-slate-200 drop-shadow">{locale.cuisine} • {locale.price}</p>
           </div>
        </header>

        <main className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
          <div className="p-4 flex items-center gap-4 border-b border-slate-200 dark:border-slate-800">
             <div className="flex items-center text-sm"><Star size={16} className="text-amber-500 mr-1.5"/> <span className="font-bold text-slate-800 dark:text-slate-200">{locale.rating.toFixed(1)}</span><span className="text-slate-500 dark:text-slate-400 ml-1">({locale.reviews} reviews)</span></div>
             <div className="flex items-center text-sm"><Users size={16} className="text-sky-500 mr-1.5"/> <span className="font-bold text-slate-800 dark:text-slate-200">{locale.currentGuests}/{locale.capacity}</span></div>
          </div>
          
          <div className="sticky top-0 bg-slate-100 dark:bg-black z-10 border-b border-slate-200 dark:border-slate-800">
            <div className="flex justify-around items-center p-1">
                {([['info', 'Info', MapPin], ['menu', 'Menu', Utensils], ['reviews', 'Recensioni', MessageSquare]] as const).map(([id, label, Icon]) => (
                    <button key={id} onClick={() => setActiveTab(id)} className={`modal-tab-button ${activeTab === id ? 'modal-tab-button-active' : ''}`}>
                        <Icon size={16}/><span>{label}</span>
                    </button>
                ))}
            </div>
          </div>
          
          <div className="p-4 space-y-4">
            {activeTab === 'info' && (
              <div className="animate-fade-in space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{locale.description}</p>
                <div className="space-y-3 text-sm">
                  <div className="modal-info-item"><MapPin size={16} className="text-slate-500"/><span>{locale.address}</span></div>
                  <div className="modal-info-item"><Phone size={16} className="text-slate-500"/><span>{locale.phone}</span></div>
                  <div className="modal-info-item"><Globe size={16} className="text-slate-500"/><span>{locale.website}</span></div>
                  <div className="modal-info-item"><Clock size={16} className="text-slate-500"/><span className="whitespace-pre-wrap">{locale.openingHours}</span></div>
                </div>
                 {locale.galleryPhotos && locale.galleryPhotos.length > 0 && <div className="grid grid-cols-2 gap-2 pt-2">
                    {locale.galleryPhotos.map(p => <ImageWithFallback key={p} src={p} alt="Foto galleria" containerClassName="w-full h-24" imgClassName="w-full h-full object-cover" />)}
                 </div>}
              </div>
            )}
            {activeTab === 'menu' && (
              <div className="animate-fade-in space-y-4">
                 {locale.menu.map(item => (
                    <div key={item.dish} className="flex justify-between items-center text-sm">
                        <span className="text-slate-700 dark:text-slate-200">{item.dish}</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-100">{item.price}</span>
                    </div>
                 ))}
                 <div className="grid grid-cols-3 gap-2 pt-2">
                    {locale.menuPhotos.map(p => <ImageWithFallback key={p} src={p} alt="Foto menu" containerClassName="w-full h-20" imgClassName="w-full h-full object-cover" />)}
                    <button onClick={() => openModal('reviewModal', { type: 'locale', item: locale })} className="flex flex-col items-center justify-center w-full h-20 bg-slate-200 dark:bg-slate-800 rounded-lg text-slate-500 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
                        <Camera size={24}/>
                        <span className="text-xs mt-1">Aggiungi Foto</span>
                    </button>
                 </div>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="animate-fade-in space-y-3">
                 <button onClick={() => openModal('reviewModal', { type: 'locale', item: locale })} className="w-full py-2.5 bg-orange-500 text-white font-semibold rounded-lg text-sm mb-3">Lascia una recensione</button>
                 {locale.userReviews.map(r => (
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
                 ))}
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

export default RestaurantModal;
