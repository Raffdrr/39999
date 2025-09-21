import React, { useState, useEffect, useRef } from 'react';
import { Event, UserReview as UserReviewType, Locale, FriendData } from '../../types';
import { GOOGLE_PAY_LOGO_URL, USER_AVATARS, MAP_PLACEHOLDER_LOCALE_MODAL, MAP_PLACEHOLDER, NEARBY_FRIENDS_DATA } from '../../constants';
import { useDataStore, useUserStore, useFavoritesStore, useUIStore } from '../../stores';
import useSwipe from '../../hooks/useSwipe'; // Import the new hook

import ImageWithFallback from '../ImageWithFallback';
import FavoriteButton from '../ui/FavoriteButton';
import { X, Star, Heart, MapPin as MapPinIconLucide, CalendarDays, Clock, DollarSign, Gift, Users, CheckCircle, ThumbsUp, CreditCard, Banknote, AlertTriangle, Edit3, ChevronLeft, Share2, Info as InfoIcon, Ticket as TicketIcon, Users2, Building } from 'lucide-react';

interface EventModalProps {
  event: Event;
  onClose: () => void;
}

type EventDetailTabId = 'details' | 'participants';

const EventModal: React.FC<EventModalProps> = ({ event, onClose }) => {
  const { locales } = useDataStore();
  const { joinedEvents, credit, avatar, joinEvent, leaveEvent } = useUserStore();
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const { showToast, openModal } = useUIStore();

  const [activeDetailTab, setActiveDetailTab] = useState<EventDetailTabId>('details');
  const [headerLocale, setHeaderLocale] = useState<Locale | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);

  const TABS: EventDetailTabId[] = ['details', 'participants'];
  
  const handleSwipeLeft = () => {
    const currentIndex = TABS.indexOf(activeDetailTab);
    const nextIndex = (currentIndex + 1) % TABS.length;
    setActiveDetailTab(TABS[nextIndex]);
  };

  const handleSwipeRight = () => {
    const currentIndex = TABS.indexOf(activeDetailTab);
    const prevIndex = (currentIndex - 1 + TABS.length) % TABS.length;
    setActiveDetailTab(TABS[prevIndex]);
  };
  
  const swipeHandlers = useSwipe({ onSwipedLeft: handleSwipeLeft, onSwipedRight: handleSwipeRight });


  const handleScroll = () => {
    if (scrollRef.current) {
      const threshold = window.innerHeight * 0.2;
      setIsHeaderCollapsed(scrollRef.current.scrollTop > threshold);
    }
  };

  useEffect(() => {
    if (event.isPublicVenue && event.localeId) {
      const foundLocale = locales.find(l => l.id === event.localeId);
      setHeaderLocale(foundLocale || null);
    } else {
      setHeaderLocale(null);
    }
  }, [event, locales]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    setActiveDetailTab('details');
    setIsHeaderCollapsed(false);
    scrollRef.current?.scrollTo(0, 0);
    return () => {
      document.body.style.overflow = '';
    };
  }, [event]);

  const favId = `event_${event.id}`;
  const isJoined = joinedEvents.has(event.id);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDate = new Date(event.date);
  const isPastEvent = eventDate < today;

  const isPayableTodayOrTomorrow = (dateString: string): boolean => {
    const checkDate = new Date(dateString);
    checkDate.setHours(0, 0, 0, 0);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    const tomorrowDate = new Date(todayDate);
    tomorrowDate.setDate(todayDate.getDate() + 1);
    return checkDate.getTime() === todayDate.getTime() || checkDate.getTime() === tomorrowDate.getTime();
  };

  const eventFeeAmount = event.partecipationFee ? parseFloat(event.partecipationFee.replace('€', '').replace(',', '.')) : 0;
  
  const canPayFeeWithCreditConditionsMet = event.partecipationFee && 
                                 credit >= eventFeeAmount && 
                                 isPayableTodayOrTomorrow(event.date) &&
                                 !event.paidWithCredit;

  const handleSimulatedExternalPaymentAndJoin = () => {
    showToast(`Pagamento di ${event.partecipationFee} per ${event.name} con Google Pay in corso... (Simulazione)`, "info", <CreditCard size={18} />);
    setTimeout(() => {
      joinEvent(event, 'direct_fee_payment'); 
    }, 1500);
  };
  
  const handleOpenPayFeeWithCreditModal = () => {
    if (event.paidWithCredit) { showToast("Quota già pagata con credito.", "info"); return; }
    if (!event.partecipationFee) { showToast("Questo evento è gratuito.", "info"); return; }
    if (credit < eventFeeAmount) { showToast("Credito insufficiente per pagare la quota.", "error", <AlertTriangle size={18}/>); return; }
    if (!isPayableTodayOrTomorrow(event.date)) { showToast("Puoi pagare la quota con credito solo nei giorni vicini all'evento.", "info"); return; }
    openModal('payWithCreditAmountModal', { itemType: 'event', itemId: event.id, itemName: event.name, maxAmount: eventFeeAmount, isEventFee: true });
  };

  const organizerDisplayName = event.isUserCreated ? "Mario Rossi" : event.organizerName || "SocialMix Team";
  const headerTitle = headerLocale ? headerLocale.name : event.name;

  const tabs = [
    { id: 'details' as EventDetailTabId, label: headerLocale ? "Locale" : "Evento" },
    { id: 'participants' as EventDetailTabId, label: "Partecipanti" }
  ];

  const handleShare = async () => {
    // In a real app, this would be a deep link to the event page
    const eventUrl = window.location.href; 
    const shareData = {
      title: `Sei invitato: ${event.name}`,
      text: `Partecipa con me a "${event.name}" il ${new Date(event.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'long' })} alle ${event.time}! Scopri di più su SocialMix.`,
      url: eventUrl,
    };

    try {
      if (navigator.share) {
        // Use Web Share API if available (mobile)
        await navigator.share(shareData);
      } else {
        // Fallback for desktop: copy link to clipboard
        await navigator.clipboard.writeText(eventUrl);
        showToast("Link dell'evento copiato negli appunti!", "success");
      }
    } catch (error) {
      console.error("Errore nella condivisione:", error);
      showToast("Impossibile condividere l'evento.", "error");
    }
  };

  const renderParticipants = () => {
    let allAttendeesNames = [...(event.pastAttendees || [])];
    if (isJoined && !allAttendeesNames.includes("Mario Rossi")) {
        allAttendeesNames.push("Mario Rossi");
    }
    
    const participantsDetails = allAttendeesNames.map(name => {
        const isCurrentUser = name === "Mario Rossi";
        const friend = NEARBY_FRIENDS_DATA.find(f => f.name === name);
        const age = isCurrentUser ? 32 : (friend && 'age' in friend ? (friend as any).age : Math.floor(Math.random() * 30) + 20); 
        const city = isCurrentUser ? "Milano" : (friend && 'city' in friend ? (friend as any).city : "Città Demo");

        return { 
            id: friend?.id || (isCurrentUser ? 'currentUser' : name), 
            name, 
            avatar: isCurrentUser ? avatar : (friend?.avatar || USER_AVATARS[Math.floor(Math.random() * USER_AVATARS.length)]),
            isHost: event.isUserCreated && isCurrentUser,
            age,
            city
        };
    }).filter((p, index, self) => index === self.findIndex((t) => (t.id === p.id && t.name === p.name)));


    return (
      <div className="p-4 space-y-3">
        {participantsDetails.length > 0 ? (
          <div className="flex flex-col space-y-3">
            {participantsDetails.map(p => (
              <div key={p.id} className="flex items-center gap-3 sm:gap-4 p-3 bg-white dark:bg-slate-800/80 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700/80">
                <div className="relative flex-shrink-0">
                  <img src={p.avatar} alt={p.name} className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover shadow-md border-2 border-slate-200 dark:border-slate-700" />
                  {p.isHost && (
                    <span className="absolute -bottom-1 -right-1 bg-amber-400 text-black text-xs px-1.5 py-0.5 rounded-full font-semibold shadow-sm">Host</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-md font-semibold text-slate-800 dark:text-slate-100 truncate">{p.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{p.age} anni • {p.city}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 dark:text-slate-400 text-center py-8">Nessun partecipante ancora.</p>
        )}
      </div>
    );
  };

  const renderEventDetailsContent = () => (
    <div className="p-4 space-y-4">
      {!event.isPublicVenue && (
         <div className="bg-white dark:bg-slate-800/80 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700/80">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-2"><MapPinIconLucide size={20} className="text-orange-500"/>Luogo Evento</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm mb-2">{event.location || "Luogo non specificato"}</p>
            <ImageWithFallback 
                itemKey={`map_event_${event.id}`} 
                src={event.coords ? MAP_PLACEHOLDER_LOCALE_MODAL : MAP_PLACEHOLDER } 
                alt={`Mappa per ${event.name}`} 
                imgClassName="w-full h-40 object-cover rounded-md" 
                containerClassName="w-full h-40 rounded-md bg-slate-200" 
            />
        </div>
      )}
      <div className="bg-white dark:bg-slate-800/80 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700/80">
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">Descrizione Evento</h3>
        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{event.description}</p>
      </div>
      {event.whatToBring && (
        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700/80">
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">Cosa Portare</h3>
          <p className="text-slate-600 dark:text-slate-300 text-sm">{event.whatToBring}</p>
        </div>
      )}
      {event.houseRules && (
        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700/80">
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">Regole</h3>
          <p className="text-slate-600 dark:text-slate-300 text-sm">{event.houseRules}</p>
        </div>
      )}
      {event.generalInfo && (
        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700/80">
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">Info Generali</h3>
          <p className="text-slate-600 dark:text-slate-300 text-sm">{event.generalInfo}</p>
        </div>
      )}
      {(!event.whatToBring && !event.houseRules && !event.generalInfo && (event.isPublicVenue || (!event.isPublicVenue && !event.location))) && (
           <p className="text-slate-500 dark:text-slate-400 text-sm p-4 text-center">Nessun dettaglio aggiuntivo fornito per questo evento.</p>
      )}
    </div>
  );

  const renderLocaleDetailsContent = () => {
    if (!headerLocale) return <p className="text-slate-500 dark:text-slate-400 p-4">Dettagli locale non disponibili.</p>;
    return (
      <div className="p-4 space-y-4">
        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700/80">
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-2"><Building size={20} className="text-orange-500"/>Descrizione Locale</h3>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{headerLocale.description}</p>
        </div>
        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700/80">
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-2"><MapPinIconLucide size={20} className="text-orange-500"/>Indirizzo</h3>
          <p className="text-slate-600 dark:text-slate-300 text-sm">{headerLocale.address}</p>
          <ImageWithFallback 
            itemKey={`map_loc_event_${headerLocale.id}`}
            src={MAP_PLACEHOLDER_LOCALE_MODAL} 
            alt="Mappa Placeholder" 
            imgClassName="mt-2 rounded-md w-full h-40 object-cover" 
            containerClassName="mt-2 rounded-md w-full h-40 bg-slate-200"
          />
        </div>
        {headerLocale.galleryPhotos && headerLocale.galleryPhotos.length > 0 && (
          <div className="bg-white dark:bg-slate-800/80 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700/80">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">Galleria Locale</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {headerLocale.galleryPhotos.map((photo, index) => (
                <ImageWithFallback key={index} src={photo} alt={`Foto locale ${index+1}`} imgClassName="w-full h-24 object-cover rounded" containerClassName="w-full h-24 rounded bg-slate-200" />
              ))}
            </div>
          </div>
        )}
        {headerLocale.openingHours && (
           <div className="bg-white dark:bg-slate-800/80 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700/80">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">Orari</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm whitespace-pre-line">{headerLocale.openingHours}</p>
          </div>
        )}
      </div>
    );
  };
  
 const renderActionButton = () => {
    if (isPastEvent) {
      if (isJoined && !event.userReviews.find(r => r.userId === 'currentUser')) {
        return (
          <button
            onClick={() => openModal('reviewModal', { type: 'event', item: event })}
            className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-sm"
            title="Lascia una recensione"
          > <Edit3 size={20} /> Lascia Recensione </button>
        );
      }
      return null;
    }

    if (event.isCharityEvent) {
      return (
        <button
          onClick={() => openModal('donationModal', event.id)}
          className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-sm"
          title="Dona Ora"
        > <Gift size={20} /> Dona Ora </button>
      );
    }
    
    if (isJoined) {
       if (event.partecipationFee && !event.paidWithCredit && canPayFeeWithCreditConditionsMet) {
         return (
            <button onClick={handleOpenPayFeeWithCreditModal} className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-sm" title="Paga Quota con Credito">
                <Banknote size={20} /> Paga con Credito
            </button>
         );
       }
        return (
            <button onClick={() => leaveEvent(event)} className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-sm" title="Lascia Evento">
                <X size={20} /> Lascia Evento
            </button>
        );

    } else { 
        const maxReached = headerLocale ? event.currentParticipants >= headerLocale.capacity : (event.maxParticipants > 0 && event.currentParticipants >= event.maxParticipants);
        if (maxReached && (headerLocale?.capacity > 0 || event.maxParticipants > 0)) {
            return (
                <button className="bg-slate-500 text-white/80 font-semibold py-3 px-4 rounded-xl shadow-lg cursor-not-allowed flex items-center justify-center gap-2 text-sm" title="Evento Completo" disabled>
                    <AlertTriangle size={20} /> Evento Completo
                </button>
            );
        }
        if (event.partecipationFee) {
            return ( 
                <div className="flex flex-col space-y-2.5">
                    <button onClick={handleSimulatedExternalPaymentAndJoin} className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 px-4 rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-xs sm:text-sm" title="Paga e Partecipa">
                        <CreditCard size={18} /> Paga e Partecipa
                    </button>
                    {canPayFeeWithCreditConditionsMet && (
                        <button onClick={handleOpenPayFeeWithCreditModal} className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2.5 px-4 rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-xs sm:text-sm" title="Paga Quota con Credito">
                            <Banknote size={18} /> Paga con Credito
                        </button>
                    )}
                    <button onClick={() => joinEvent(event, 'join_pay_later')} className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2.5 px-4 rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-xs sm:text-sm" title="Unisciti e paga più tardi/all'evento">
                        <Users2 size={18} /> Unisciti (Paga Dopo)
                    </button>
                </div>
            );
        }
        return ( 
            <button onClick={() => joinEvent(event)} className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-sm" title="Partecipa Gratuitamente">
                <CheckCircle size={20} /> Partecipa Gratuitamente
            </button>
        );
    }
  };


  return (
    <div ref={scrollRef} onScroll={handleScroll} className="fixed inset-0 z-40 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white overflow-y-auto no-scrollbar animate-fade-in">
        <div className={`sticky top-0 left-0 right-0 z-30 flex items-center justify-between px-4 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-md transition-all duration-300 ease-in-out ${isHeaderCollapsed ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}>
             <button onClick={onClose} className="p-2 rounded-full text-slate-700 dark:text-slate-200 hover:bg-black/10 dark:hover:bg-white/10" aria-label="Chiudi">
                <ChevronLeft size={24} />
             </button>
             <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 truncate mx-4 flex-1 text-center">{headerTitle}</h2>
             <div className="w-10"></div>
        </div>

      <div className="relative h-[45vh] sm:h-[50vh] w-full -mt-16">
        <ImageWithFallback
          src={event.img}
          alt={headerTitle}
          imgClassName="absolute inset-0 w-full h-full object-cover"
          containerClassName="absolute inset-0 w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-10"></div>
        
        <div className={`absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 z-20 p-2 text-white transition-opacity duration-300 ${isHeaderCollapsed ? 'opacity-0' : 'opacity-100'}`}>
          {event.isCharityEvent && (
            <span className="inline-block bg-pink-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full mb-2 uppercase tracking-wide shadow-md">Evento Benefico</span>
          )}
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight drop-shadow-lg">{headerTitle}</h1>
          <p className="text-md sm:text-lg text-slate-200 mt-1.5 drop-shadow-md">Creato da {organizerDisplayName}</p>
          <div className="flex items-center text-sm text-slate-300 mt-2.5 gap-x-4 gap-y-1 flex-wrap drop-shadow-sm">
            <span className="flex items-center gap-1.5"><CalendarDays size={16} /> {new Date(event.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <span className="flex items-center gap-1.5"><Clock size={16} /> {event.time}</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 sticky top-16 z-10 shadow-sm">
        <div className="flex border-b border-slate-200 dark:border-slate-800">
          {tabs.map(tab => {
            const IconComponent = tab.label === "Locale" ? Building : (tab.label === "Evento" ? TicketIcon : Users);
            return (
              <button
                key={tab.id}
                onClick={() => setActiveDetailTab(tab.id)}
                className={`flex-1 py-3.5 px-2 text-center text-sm font-semibold transition-colors duration-200 focus:outline-none flex items-center justify-center gap-1.5
                            ${activeDetailTab === tab.id ? `text-orange-600 dark:text-orange-500 border-b-2 border-orange-500` : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'}`}
              >
                <IconComponent size={16} /> {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div {...swipeHandlers} className="bg-transparent pb-[10rem]">
        {activeDetailTab === 'details' && (headerLocale ? renderLocaleDetailsContent() : renderEventDetailsContent())}
        {activeDetailTab === 'participants' && renderParticipants()}
      </div>
      
      <div className="fixed bottom-28 right-6 z-30 flex flex-col items-end space-y-2.5">
        {renderActionButton()}
      </div>

      <div className="fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent dark:from-slate-950 dark:via-slate-950/80 dark:to-transparent z-30 pointer-events-none" />
      <div className="fixed bottom-0 left-0 right-0 p-4 z-40 flex items-center justify-center gap-x-8">
          <button onClick={onClose} className="p-3 rounded-full bg-black/5 dark:bg-white/10 backdrop-blur-sm text-slate-700 dark:text-slate-200 hover:bg-black/10 dark:hover:bg-white/20 transition-colors pointer-events-auto" aria-label="Indietro">
              <ChevronLeft size={24} />
          </button>
          <FavoriteButton
            isFavorite={isFavorite(favId)}
            onToggle={() => toggleFavorite({ ...event, itemType: 'event' })}
            className="p-3 rounded-full bg-black/5 dark:bg-white/10 backdrop-blur-sm text-slate-700 dark:text-slate-200 hover:bg-black/10 dark:hover:bg-white/20 transition-colors pointer-events-auto"
            aria-label={isFavorite(favId) ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
            iconSize={24}
            iconClassName={isFavorite(favId) ? 'fill-orange-500 text-orange-500' : 'text-slate-600 dark:text-slate-300'}
          />
          <button onClick={handleShare} className="p-3 rounded-full bg-black/5 dark:bg-white/10 backdrop-blur-sm text-slate-700 dark:text-slate-200 hover:bg-black/10 dark:hover:bg-white/20 transition-colors pointer-events-auto" aria-label="Condividi">
              <Share2 size={24} />
          </button>
      </div>

    </div>
  );
};

export default EventModal;