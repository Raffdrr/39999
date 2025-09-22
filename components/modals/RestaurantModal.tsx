import React, { useState, useEffect, useRef } from 'react';
import { Locale, UserReview as UserReviewType, FriendData, BillDetails } from '../../types'; 
import { MAP_PLACEHOLDER_LOCALE_MODAL, MENU_PHOTO_PRESETS, USER_AVATARS, NEARBY_FRIENDS_DATA } from '../../constants'; 
import { useDataStore, useUserStore, useFavoritesStore, useUIStore } from '../../stores';
import useSwipe from '../../hooks/useSwipe';

import ImageWithFallback from '../ImageWithFallback';
import FavoriteButton from '../ui/FavoriteButton';
import { X, Star, Heart, MapPin as MapPinIconLucide, CheckCircle, BookOpen, Camera, ThumbsUp, Edit3, ImagePlus, Users, ChevronDown, ChevronUp, LogOut, AlertTriangle, Receipt, CreditCard as CreditCardIcon, ChevronLeft, Share2, Info as InfoIcon, GalleryThumbnails, MenuSquare, MessageSquareText, Users2, Repeat, Undo2, ChevronRight, Building } from 'lucide-react'; 

interface LocaleModalProps { 
  locale: Locale; 
  onClose: () => void;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  isFirstItem: boolean;
  isLastItem: boolean;
}

type LocaleDetailTabId = 'info' | 'menu' | 'reviews' | 'participants';

const TABS_CONFIG: { id: LocaleDetailTabId; label: string; icon: React.ElementType }[] = [
    { id: 'info', label: "Info", icon: Building },
    { id: 'menu', label: "Menu", icon: MenuSquare },
    { id: 'reviews', label: `Recensioni`, icon: MessageSquareText },
    { id: 'participants', label: "Partecipanti", icon: Users2 },
];
const TAB_IDS = TABS_CONFIG.map(t => t.id);

const LocaleModal: React.FC<LocaleModalProps> = ({ locale, onClose, onSwipeLeft, onSwipeRight, isFirstItem, isLastItem }) => {
  const { addMenuPhoto } = useDataStore();
  const { joinedTables, joinTable, leaveTable, avatar } = useUserStore();
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const { showToast, openModal, theme } = useUIStore();
  
  const [activeDetailTab, setActiveDetailTab] = useState<LocaleDetailTabId>(TABS_CONFIG[0].id);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);

  const [dragStart, setDragStart] = useState<{ y: number; scrollTop: number } | null>(null);
  const [dragY, setDragY] = useState(0);

  const handleTabSwipeLeft = () => {
    const currentIndex = TAB_IDS.indexOf(activeDetailTab);
    const nextIndex = (currentIndex + 1) % TAB_IDS.length;
    setActiveDetailTab(TAB_IDS[nextIndex]);
  };

  const handleTabSwipeRight = () => {
    const currentIndex = TAB_IDS.indexOf(activeDetailTab);
    const prevIndex = (currentIndex - 1 + TAB_IDS.length) % TAB_IDS.length;
    setActiveDetailTab(TAB_IDS[prevIndex]);
  };

  const tabSwipeHandlers = useSwipe({ onSwipedLeft: handleTabSwipeLeft, onSwipedRight: handleTabSwipeRight });
  const itemSwipeHandlers = useSwipe({ onSwipedLeft: onSwipeLeft, onSwipedRight: onSwipeRight });

  const handleScroll = () => {
      if (scrollRef.current) {
          const threshold = window.innerHeight * 0.2;
          setIsHeaderCollapsed(scrollRef.current.scrollTop > threshold);
      }
  };
  
  const handlePullDownStart = (e: React.TouchEvent) => {
    if (scrollRef.current) {
        setDragStart({ y: e.targetTouches[0].clientY, scrollTop: scrollRef.current.scrollTop });
    }
  };

  const handlePullDownMove = (e: React.TouchEvent) => {
      if (!dragStart || dragStart.scrollTop > 5) return;
      const currentY = e.targetTouches[0].clientY;
      const dy = currentY - dragStart.y;
      if (dy > 0) {
          e.stopPropagation();
          setDragY(dy);
      }
  };

  const handlePullDownEnd = () => {
      if (!dragStart) return;
      if (dragY > 150) {
          onClose();
      } else {
          setDragY(0);
      }
      setDragStart(null);
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    setActiveDetailTab(TABS_CONFIG[0].id); 
    setIsHeaderCollapsed(false);
    setDragY(0);
    setDragStart(null);
    scrollRef.current?.scrollTo(0, 0);
    return () => { document.body.style.overflow = ''; };
  }, [locale]);

  const favId = `locale_${locale.id}`; 
  const isUserJoined = joinedTables.has(locale.id); 

  const menuByCategory = locale.menu.reduce((acc, item) => { 
    (acc[item.category] = acc[item.category] || []).push(item);
    return acc;
  }, {} as Record<string, typeof locale.menu>); 
  
  const peopleAtTableForInfoTab = (locale.joinedUserNames || []) 
    .map(attendeeName => {
        const friendDetail = NEARBY_FRIENDS_DATA.find(friend => friend.name === attendeeName);
        if (attendeeName === "Mario Rossi") return { id: "currentUser", name: "Mario Rossi", avatar: avatar};
        return friendDetail ? 
               { id: friendDetail.id, name: friendDetail.name, avatar: friendDetail.avatar} : 
               { id: attendeeName, name: attendeeName, avatar: USER_AVATARS[Math.floor(Math.random() * (USER_AVATARS.length -1))] }; 
    });

  const detailedParticipantsList = (locale.joinedUserNames || [])
    .map(name => {
        const isCurrentUser = name === "Mario Rossi";
        const friend = NEARBY_FRIENDS_DATA.find(f => f.name === name);
        const age = isCurrentUser ? 32 : (Math.floor(Math.random() * 25) + 20); 
        const city = isCurrentUser ? "Milano" : "Città Demo"; 
        return { id: friend?.id || (isCurrentUser ? 'currentUser' : name), name, avatar: isCurrentUser ? avatar : (friend?.avatar || USER_AVATARS[Math.floor(Math.random() * USER_AVATARS.length)]), age, city };
    })
    .filter((p, index, self) => index === self.findIndex((t) => (t.id === p.id && t.name === p.name)));

  const renderMainActionButton = () => {
    const baseButtonClasses = "text-white font-semibold py-3 px-5 rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-sm";

    if (locale.billDetails?.status === 'paid_with_credit') {
      return <button className={`bg-green-600 cursor-default ${baseButtonClasses}`} title="Conto Pagato"><CheckCircle size={20} /> Pagato</button>;
    }
    if (locale.billDetails?.status === 'ready_to_finalize') {
      return <button onClick={() => openModal('finalizeBill', locale.id)} className={`bg-sky-500 hover:bg-sky-600 ${baseButtonClasses}`} title={`Finalizza Pagamento (€${locale.billDetails.creditContributed.toFixed(2)})`}><CreditCardIcon size={20} /> Finalizza</button>;
    }
    if (locale.billDetails?.status === 'awaiting_credit_application') {
      return <button onClick={() => openModal('payWithCreditAmountModal', { itemType: 'locale', itemId: locale.id, itemName: locale.name, maxAmount: locale.billDetails.totalAmount, currentContribution: locale.billDetails.creditContributed, isEventFee: false })} className={`bg-purple-500 hover:bg-purple-600 ${baseButtonClasses}`} title={`Applica Credito (Tot: €${locale.billDetails.totalAmount.toFixed(2)})`}><CreditCardIcon size={20} /> Applica Credito</button>;
    }
    if (isUserJoined) {
       return <button onClick={() => openModal('initiatePayBill', locale.id)} className={`bg-rose-500 hover:bg-rose-600 ${baseButtonClasses}`} title="Paga Conto al Tavolo"><Receipt size={20} /> Paga Conto</button>;
    }
    if (locale.currentGuests >= locale.capacity) {
        return <button className={`bg-slate-500 cursor-not-allowed ${baseButtonClasses}`} disabled title="Tavolo Pieno"><AlertTriangle size={20} /> Completo</button>;
    }
    return <button onClick={() => joinTable(locale)} className={`bg-sky-500 hover:bg-sky-600 ${baseButtonClasses}`} title="Unisciti al Tavolo"><CheckCircle size={20} /> Unisciti</button>;
  };
  
  const renderInfoTab = () => (
    <div className="p-4 space-y-4">
      <div className="bg-white/70 dark:bg-slate-950/70 backdrop-blur-md p-4 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/60">
        <h3 className={`text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2`}>Descrizione</h3>
        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{locale.description || "Nessuna descrizione fornita."}</p>
      </div>
       {locale.hashtags && locale.hashtags.length > 0 && ( 
        <div className="bg-white/70 dark:bg-slate-950/70 backdrop-blur-md p-4 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/60">
            <h3 className={`text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2`}>Tags</h3>
            <div className="flex flex-wrap gap-2">
            {locale.hashtags.map(tag => <span key={tag} className={`text-xs bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300 px-2.5 py-1 rounded-full font-medium`}>#{tag}</span>)} 
            </div>
        </div>
      )}
      <div className="bg-white/70 dark:bg-slate-950/70 backdrop-blur-md p-4 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/60">
        <h3 className={`text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2`}>Indirizzo</h3>
        <p className="text-slate-600 dark:text-slate-300 text-sm mb-2">{locale.address || "Indirizzo non specificato"}</p>
        <ImageWithFallback itemKey={`map_loc_${locale.id}`} src={MAP_PLACEHOLDER_LOCALE_MODAL} alt="Mappa Locale" imgClassName="w-full h-40 object-cover rounded-md" containerClassName="w-full h-40 rounded-md" />
      </div>
      {locale.openingHours && (
        <div className="bg-white/70 dark:bg-slate-950/70 backdrop-blur-md p-4 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/60">
          <h3 className={`text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2`}>Orari di Apertura</h3>
          <p className="text-slate-600 dark:text-slate-300 text-sm whitespace-pre-line">{locale.openingHours}</p>
        </div>
      )}
       <div className="bg-white/70 dark:bg-slate-950/70 backdrop-blur-md p-4 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/60">
          <h3 className={`text-lg font-semibold text-slate-700 dark:text-slate-200 mb-1`}>Persone al Tavolo</h3>
          <p className="text-slate-600 dark:text-slate-300 text-sm mb-2">{locale.currentGuests} / {locale.capacity}</p>
          {peopleAtTableForInfoTab.length > 0 ? (
            <div className="flex flex-wrap gap-2">
                {peopleAtTableForInfoTab.slice(0, 5).map(att => <img key={att.id} src={att.avatar} alt={att.name} title={att.name} className="w-8 h-8 rounded-full border-2 border-slate-200 dark:border-slate-700 object-cover"/>)}
                {peopleAtTableForInfoTab.length > 5 && <span className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs text-slate-500 dark:text-slate-300 font-semibold">+{peopleAtTableForInfoTab.length - 5}</span>}
            </div>
          ) : <p className="text-xs text-slate-500 dark:text-slate-400">Nessuno attualmente al tavolo.</p>}
      </div>
    </div>
  );

  const renderMenuTab = () => (
     <div className="p-4 space-y-4">
        {Object.keys(menuByCategory).length > 0 ? (
          Object.entries(menuByCategory).map(([category, items]) => (
            <div key={category} className="bg-white/70 dark:bg-slate-950/70 backdrop-blur-md p-4 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/60">
              <h3 className={`text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3`}>{category}</h3>
              <ul className="space-y-2">
                {items.map(item => <li key={item.dish} className="flex justify-between items-center text-sm border-b border-slate-200 dark:border-slate-700/50 pb-2 last:border-b-0 last:pb-0"><span className="text-slate-600 dark:text-slate-300">{item.dish}</span><span className="font-medium text-slate-700 dark:text-slate-200">{item.price}</span></li>)}
              </ul>
            </div>
          ))
        ) : <p className="text-slate-500 dark:text-slate-400 text-center py-8">Menu non disponibile.</p>}
        {locale.menuPhotos && locale.menuPhotos.length > 0 && (
            <div className="bg-white/70 dark:bg-slate-950/70 backdrop-blur-md p-4 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/60">
                 <h3 className={`text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3`}>Foto del Menu</h3>
                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {locale.menuPhotos.map((photoUrl, index) => <ImageWithFallback key={`menu_photo_${index}`} src={photoUrl} alt={`Foto menu ${index + 1}`} imgClassName="w-full h-28 object-cover rounded-md" containerClassName="w-full h-28 rounded-md" />)}
                 </div>
            </div>
        )}
        <button onClick={() => { const photo = prompt("Inserisci URL foto menu (simulato):", MENU_PHOTO_PRESETS[Math.floor(Math.random() * MENU_PHOTO_PRESETS.length)]); if (photo) addMenuPhoto(locale.id, photo); }} className={`w-full mt-2 flex items-center justify-center gap-2 py-2.5 border border-orange-500 text-orange-600 dark:text-orange-400 rounded-lg bg-orange-500/5 dark:bg-orange-500/10 hover:bg-orange-500/20 transition-colors text-sm font-medium`}><Camera size={18} /> Aggiungi Foto al Menu</button>
     </div>
  );

  const renderReviewsTab = () => (
    <div className="p-4 space-y-4">
        {locale.userReviews && locale.userReviews.length > 0 ? ( 
            locale.userReviews.map((review: UserReviewType) => ( 
              <div key={review.userId + review.date} className="bg-white/70 dark:bg-slate-950/70 backdrop-blur-md p-3.5 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/60">
                <div className="flex items-start mb-1.5">
                  <img src={review.avatar || USER_AVATARS[0]} alt={review.name} className="w-9 h-9 rounded-full mr-3 border-2 border-slate-200 dark:border-slate-700" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{review.name || "Utente Anonimo"}</p>
                    <div className="flex items-center">{[...Array(5)].map((_, i) => <Star key={i} size={14} className={`mr-0.5 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-400 dark:text-slate-600'}`} />)}</div>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-500">{new Date(review.date).toLocaleDateString('it-IT')}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{review.text}</p>
              </div>
            ))
        ) : <p className="text-slate-500 dark:text-slate-400 text-center py-4">Nessuna recensione ancora.</p>}
        <button onClick={() => openModal('reviewModal', { type: 'locale', item: locale })} className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 border border-orange-500 text-orange-600 dark:text-orange-400 rounded-lg bg-orange-500/5 dark:bg-orange-500/10 hover:bg-orange-500/20 transition-colors text-sm font-medium"><Edit3 size={18} /> Lascia una Recensione</button>
        {locale.galleryPhotos && locale.galleryPhotos.length > 0 && (
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700/60">
                <h3 className={`text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2`}><GalleryThumbnails size={20}/>Galleria Locale</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">{locale.galleryPhotos.map((photo, index) => <ImageWithFallback key={`gallery_loc_${index}`} src={photo} alt={`${locale.name} - foto ${index + 1}`} imgClassName="w-full h-32 sm:h-40 object-cover rounded-md" containerClassName="w-full h-32 sm:h-40 rounded-md" />)}</div>
            </div>
        )}
    </div>
  );

  const renderParticipantsTab = () => (
    <div className="p-4 space-y-3">
      {detailedParticipantsList.length > 0 ? (
        <div className="flex flex-col space-y-3">{detailedParticipantsList.map(p => (
            <div key={p.id} className="flex items-center gap-3 sm:gap-4 p-3 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-700/60">
              <div className="relative flex-shrink-0"><img src={p.avatar} alt={p.name} className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover shadow-md border-2 border-slate-200 dark:border-slate-700" /></div>
              <div className="flex-1 min-w-0"><p className="text-md font-semibold text-slate-800 dark:text-slate-100 truncate">{p.name}</p><p className="text-xs text-slate-500 dark:text-slate-400">{p.age} anni • {p.city}</p></div>
            </div>))}
        </div>
      ) : <p className="text-slate-500 dark:text-slate-400 text-center py-8">Nessun partecipante al tavolo al momento.</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 z-40 animate-fade-in"
         style={{ backgroundColor: `rgba(${theme === 'dark' ? '0, 0, 0,' : '248, 250, 252,'} ${1 - Math.min(1, dragY / 500)})` }}>
      <div className="h-full w-full flex flex-col"
           style={{ transform: `translateY(${dragY}px)`, transition: dragStart ? 'none' : 'transform 0.3s ease-out' }}>
        <div ref={scrollRef} onScroll={handleScroll} onTouchStart={handlePullDownStart} onTouchMove={handlePullDownMove} onTouchEnd={handlePullDownEnd}
             className="flex-1 w-full overflow-y-auto no-scrollbar">
          
          <div className={`sticky top-0 left-0 right-0 z-30 flex items-center justify-between px-4 h-16 bg-white/80 dark:bg-black/80 backdrop-blur-lg shadow-md transition-all duration-300 ease-in-out ${isHeaderCollapsed ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}>
             <button onClick={onClose} className="p-2 rounded-full text-slate-700 dark:text-slate-200 hover:bg-black/10 dark:hover:bg-white/10" aria-label="Chiudi"><ChevronLeft size={24} /></button>
             <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 truncate mx-4 flex-1 text-center">{locale.name}</h2>
             <div className="w-10"></div>
          </div>

          <div {...itemSwipeHandlers} className="relative h-[45vh] sm:h-[50vh] w-full -mt-16">
            <ImageWithFallback src={locale.img} alt={locale.name} imgClassName="absolute inset-0 w-full h-full object-cover" containerClassName="absolute inset-0 w-full h-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10"></div>
            <div className={`absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm-right-6 z-20 p-2 text-white transition-opacity duration-300 ${isHeaderCollapsed ? 'opacity-0' : 'opacity-100'}`}>
              <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight drop-shadow-lg">{locale.name}</h1>
              <p className="text-md sm:text-lg text-slate-200 mt-1.5 drop-shadow-md">{locale.cuisine} • {locale.price}</p>
              <div className="flex items-center text-amber-400 font-bold text-md sm:text-lg mt-2.5 drop-shadow-sm">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 mr-1.5 fill-amber-400 text-amber-400" />
                {locale.rating.toFixed(1)} 
                <span className="text-slate-300 font-normal ml-2 text-xs sm:text-sm">({locale.reviews} recensioni)</span> 
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-black sticky top-16 z-10 shadow-sm">
            <div className="flex border-b border-slate-200 dark:border-slate-800">
              {TABS_CONFIG.map(tab => (
                <button key={tab.id} onClick={() => setActiveDetailTab(tab.id)}
                        className={`flex-1 py-3.5 px-2 text-center text-sm font-semibold transition-colors duration-200 focus:outline-none flex items-center justify-center gap-1.5 ${activeDetailTab === tab.id ? `text-orange-600 dark:text-orange-500 border-b-2 border-orange-500` : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'}`}>
                  <tab.icon size={16} /> {tab.label}
                </button>))}
            </div>
          </div>

          <div {...tabSwipeHandlers} className="bg-transparent">
            {activeDetailTab === 'info' && renderInfoTab()}
            {activeDetailTab === 'menu' && renderMenuTab()}
            {activeDetailTab === 'reviews' && renderReviewsTab()}
            {activeDetailTab === 'participants' && renderParticipantsTab()}
          </div>
        </div>
        
        <div className="flex-shrink-0 z-40 p-4 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-black/80 backdrop-blur-lg">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button onClick={onClose} className="p-3 rounded-full bg-black/5 dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:bg-black/10 dark:hover:bg-white/20 transition-colors" aria-label="Indietro"><ChevronLeft size={24} /></button>
                    <FavoriteButton isFavorite={isFavorite(favId)} onToggle={() => toggleFavorite({ ...locale, itemType: 'locale' })} className="p-3 rounded-full bg-black/5 dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:bg-black/10 dark:hover:bg-white/20 transition-colors" aria-label={isFavorite(favId) ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"} iconSize={24} iconClassName={isFavorite(favId) ? `fill-orange-500 text-orange-500` : `text-slate-600 dark:text-slate-300`}/>
                    <button onClick={() => showToast(`Condividi: ${locale.name} (Demo)`, "info")} className="p-3 rounded-full bg-black/5 dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:bg-black/10 dark:hover:bg-white/20 transition-colors" aria-label="Condividi"><Share2 size={24} /></button>
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-end">
                    {isUserJoined && locale.billDetails && (locale.billDetails.status === 'awaiting_credit_application' || locale.billDetails.status === 'ready_to_finalize') && (
                      <button onClick={() => openModal('cancelPayment', locale.id)} className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-3.5 rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-1.5 text-xs" title="Annulla Pagamento e Rimborsa Credito"><Undo2 size={16} /> Annulla</button>
                    )}
                    {isUserJoined && (
                      <button onClick={() => leaveTable(locale.id)} className="bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-3.5 rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-1.5 text-xs" title="Lascia il Tavolo"><LogOut size={16} /> Lascia</button>
                    )}
                    {renderMainActionButton()}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LocaleModal;
