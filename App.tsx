import React, { useState, useEffect, useRef } from "react";
import {
  Home, Heart, User, X, CheckCircle, Star,
  Ticket, Users, MessageSquare, AlertTriangle, Info, Plus, 
  Send, MapPin, Settings, LogOut, Edit,
  Search as SearchIcon, ListFilter, PlusCircle, UsersRound,
  GripVertical, CalendarDays, ChevronUp, ChevronDown, Award, Shield,
  Banknote, PiggyBank, PlusSquare, QrCode, LucideIcon,
  Sparkles
} from "lucide-react";

import { useUIStore, useDataStore, useUserStore, useFavoritesStore, useInteractionStore } from './stores';

import { 
    NavTabType, ToastMessage, ReviewModalData, TabId, PaymentCodeModalData, 
    PayWithCreditAmountModalData, Event, Locale
} from './types';

import HomePage from './pages/HomePage';
import CalendarPage from './pages/CalendarPage';
import ChatPage from './pages/ChatPage';
import FavoritesPage from './pages/FavoritesPage';
import ProfilePage from './pages/ProfilePage';

import ModalWrapper from "./components/modals/ModalWrapper";
import LocaleModal from "./components/modals/RestaurantModal";
import EventModal from "./components/modals/EventModal";
import CreateEventModal from "./components/modals/CreateEventModal";
import ProposeTableModal from "./components/modals/ProposeTableModal";
import GlobalMapModal from "./components/modals/GlobalMapModal";
import InviteFriendsModal from "./components/modals/InviteFriendsModal";
import AmbassadorModal from "./components/modals/AmbassadorModal";
import SubscriptionModal from "./components/modals/SubscriptionModal";
import ReviewModal from "./components/modals/ReviewModal";
import DonationModal from "./components/modals/DonationModal";
import WithdrawCreditModal from "./components/modals/WithdrawCreditModal";
import AddCreditModal from "./components/modals/AddCreditModal";
import PaymentCodeModal from "./components/modals/PaymentCodeModal";
import PayWithCreditAmountModal from "./components/modals/PayWithCreditAmountModal";
import InputModal from "./components/modals/InputModal";

import { NEARBY_FRIENDS_DATA, USER_AVATARS, SIMULATED_QR_CODE_URL } from './constants';

const NAV_BAR_BASE_HEIGHT_PX = 68;
const BOTTOM_SEARCH_BAR_HEIGHT_PX = 56;
const HOME_FILTER_PANEL_MAX_HEIGHT_PX = 300;
const FAB_BUTTON_HEIGHT_PX = 56;
const BASE_MARGIN_PX = 16;

export default function SocialMixApp() {
  const {
    activeTab,
    selectedLocaleId,
    selectedEventId,
    isGlobalMapOpen,
    isCreateEventModalOpen,
    isProposeTableModalOpen,
    isInviteFriendsModalOpen,
    isAmbassadorModalOpen,
    isSubscriptionModalOpen,
    reviewModalData,
    donationModalEventId,
    isWithdrawModalOpen,
    isAddCreditModalOpen,
    paymentCodeModalData,
    payWithCreditAmountModalData,
    inputModalConfig,
    setActiveTab,
    openModal,
    closeAllModals,
    showToast,
    toast,
    showFilterPanel 
  } = useUIStore();

  const { locales, events, addReview, addMenuPhoto, createEvent, makeDonation, setBillDetails } = useDataStore();
  const { userCredit, updateUserCredit, processGamificationAction } = useUserStore();
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const { notifications, chatMessages, markNotificationAsRead, markChatAsRead } = useInteractionStore();

  const [showFabMenu, setShowFabMenu] = useState(false);
  const fabMenuRef = useRef<HTMLDivElement>(null);
  const [invitedFriends, setInvitedFriends] = useState<Set<string>>(new Set());

  const selectedLocale = locales.find(l => l.id === selectedLocaleId) || null;
  const selectedEvent = events.find(e => e.id === selectedEventId) || null;
  const donationModalEvent = events.find(e => e.id === donationModalEventId) || null;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (fabMenuRef.current && !fabMenuRef.current.contains(event.target as Node)) {
        setShowFabMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [fabMenuRef]);

  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;
  const unreadMessagesCount = chatMessages.reduce((sum, chat) => sum + chat.unreadCount, 0);

  const navTabs: {id: TabId, label: string, icon: LucideIcon, badgeCount?: number}[] = [
    { id: "calendar" as TabId, label: "Calendario", icon: CalendarDays },
    { id: "chat" as TabId, label: "Chat", icon: MessageSquare, badgeCount: unreadNotificationsCount + unreadMessagesCount },
    { id: "home" as TabId, label: "Home", icon: Home }, 
    { id: "favorites" as TabId, label: "Preferiti", icon: Heart },
    { id: "profile" as TabId, label: "Profilo", icon: User },
  ];

  const handleCreateEvent = (newEventData: Partial<Event>) => {
    createEvent(newEventData, Array.from(invitedFriends));
    closeAllModals();
    setInvitedFriends(new Set());
    showToast(`Evento "${newEventData.name}" creato con successo!`, "success", <Sparkles size={18} className="text-yellow-300"/>);
    processGamificationAction('CREATE_EVENT');
  };

  const handleProposeTable = (tableData: { localeName: string; date: string; time: string; numPeople: number; notes: string }) => {
    console.log("Tavolo proposto:", tableData);
    openModal('isProposeTableModal', false);
    showToast(`Proposta tavolo da "${tableData.localeName}" inviata!`, "success");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "home": return <HomePage />;
      case "calendar": return <CalendarPage />;
      case "chat": return <ChatPage />;
      case "favorites": return <FavoritesPage />;
      case "profile": return <ProfilePage />;
      default: return <p>Tab non trovato</p>;
    }
  };

  let mainPaddingBottomPx = NAV_BAR_BASE_HEIGHT_PX;
  if (activeTab === 'home') {
    mainPaddingBottomPx += BOTTOM_SEARCH_BAR_HEIGHT_PX;
  }

  let fabBottomPx = NAV_BAR_BASE_HEIGHT_PX + BASE_MARGIN_PX;
  if (activeTab === 'home') {
    fabBottomPx += BOTTOM_SEARCH_BAR_HEIGHT_PX;
    if (showFilterPanel) {
      fabBottomPx += HOME_FILTER_PANEL_MAX_HEIGHT_PX;
    }
  }
  const fabContainerStyle = { bottom: `${fabBottomPx}px` };
  const toastBottomPx = fabBottomPx + FAB_BUTTON_HEIGHT_PX + BASE_MARGIN_PX / 2;
  const toastStyle = { bottom: `${toastBottomPx}px` };

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-50 overflow-hidden">
      
      <main 
        key={activeTab}
        className="flex-1 overflow-y-auto p-3.5 sm:p-4 pt-6 sm:pt-8 animate-page-content-enter"
        style={{ paddingBottom: `${mainPaddingBottomPx}px` }}
      >
        {renderContent()}
      </main>
      
      <nav className="bg-white/95 backdrop-blur-md shadow-top-strong fixed bottom-0 left-0 right-0 z-20 border-t border-slate-200/70" style={{height: `${NAV_BAR_BASE_HEIGHT_PX}px`}}>
        <div className="flex justify-evenly h-full items-center" role="tablist" aria-label="Navigazione principale">
          {navTabs.map((tab) => {
            const NavIcon = tab.icon; 
            const isActive = activeTab === tab.id;
            return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex flex-col items-center justify-center h-full w-16 transition-all duration-300 ease-in-out focus:outline-none group"
              role="tab"
              aria-selected={isActive}
              aria-controls={`${tab.id}-panel`} 
              id={`${tab.id}-tab`}
            >
              <div className={`absolute inset-x-0 mx-auto -top-2 h-1 w-8 rounded-full bg-rose-500 transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-0 scale-x-0'}`}></div>
              <NavIcon 
                size={isActive ? 26 : 24} 
                className={`transition-all duration-200 z-10 ${isActive ? `text-rose-600` : 'text-slate-500 group-hover:text-slate-800'}`} 
                strokeWidth={isActive ? 2.5 : 2} 
                aria-hidden="true"
              />
              <span className={`text-[10px] mt-1 font-semibold transition-all duration-200 z-10 ${isActive ? `text-rose-600` : 'text-slate-500 group-hover:text-slate-800'}`}>{tab.label}</span>
              {tab.badgeCount && tab.badgeCount > 0 && (
                 <span className="absolute top-1 right-1.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white/80" aria-label={`${tab.badgeCount} notifiche non lette`}>
                    {tab.badgeCount > 9 ? '9+' : tab.badgeCount}
                 </span>
              )}
            </button>
          );
        })}
        </div>
      </nav>

      {activeTab === 'home' && (
        <div ref={fabMenuRef} 
            className="fixed left-1/2 -translate-x-1/2 z-30 flex flex-col items-center transition-all duration-300 ease-in-out"
            style={fabContainerStyle}
        >
          {showFabMenu && (
            <div className="flex items-center gap-x-3 mb-4"> 
              <div className="flex flex-col items-center">
                <button
                  onClick={() => { openModal('isProposeTableModal', true); setShowFabMenu(false); }}
                  title="Proponi Tavolo"
                  aria-label="Proponi un tavolo"
                  style={{ animationDelay: '50ms' }}
                  className="animate-fab-menu-open bg-sky-500 hover:bg-sky-600 text-white p-3.5 rounded-full shadow-lg transition-all duration-200 hover:scale-110 active:scale-95"
                >
                  <Users size={24} />
                </button>
                <span className="text-xs font-semibold text-slate-700 mt-1.5 bg-white/70 px-2 py-0.5 rounded-full">Tavolo</span>
              </div>
              <div className="w-8"></div> {/* Spacer */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => { openModal('isCreateEventModal', true); setShowFabMenu(false); }}
                  title="Crea Evento"
                  aria-label="Crea un evento"
                  style={{ animationDelay: '100ms' }}
                  className={`animate-fab-menu-open bg-rose-500 hover:bg-rose-600 text-white p-3.5 rounded-full shadow-lg transition-all duration-200 hover:scale-110 active:scale-95`}
                >
                  <PlusCircle size={24} />
                </button>
                 <span className="text-xs font-semibold text-slate-700 mt-1.5 bg-white/70 px-2 py-0.5 rounded-full">Evento</span>
              </div>
            </div>
          )}
          <button
            onClick={() => setShowFabMenu(!showFabMenu)}
            className={`p-4 rounded-full text-white transition-all duration-300 transform active:scale-90 shadow-xl hover:shadow-2xl
                        ${showFabMenu ? `bg-gradient-to-br from-slate-600 to-slate-700 scale-105 rotate-45` : `bg-gradient-to-br from-rose-500 to-pink-500 scale-100 rotate-0`}`}
            style={{ height: `${FAB_BUTTON_HEIGHT_PX}px`, width: `${FAB_BUTTON_HEIGHT_PX}px` }}
            aria-expanded={showFabMenu}
            aria-controls="fab-submenu" 
            aria-label={showFabMenu ? "Chiudi menu creazione" : "Apri menu creazione"}
          >
            <Plus size={28} className="transition-transform duration-300" />
          </button>
        </div>
      )}

      {selectedLocale && <LocaleModal locale={selectedLocale} onClose={closeAllModals} />}
      {selectedEvent && <EventModal event={selectedEvent} onClose={closeAllModals} />}
      
      {isCreateEventModalOpen && (
        <CreateEventModal 
          onClose={() => openModal('isCreateEventModal', false)} 
          onCreate={handleCreateEvent} 
          showToast={showToast} 
          setShowInviteFriendsModal={(show) => openModal('isInviteFriendsModal', show)} 
          invitedFriendsCount={invitedFriends.size} 
        />
      )}

      {isProposeTableModalOpen && (
        <ProposeTableModal 
          onClose={() => openModal('isProposeTableModal', false)} 
          onPropose={handleProposeTable} 
          locali={locales} 
          showToast={showToast} 
        />
      )}

      {isGlobalMapOpen && <GlobalMapModal onClose={closeAllModals} />}
      {isInviteFriendsModalOpen && <InviteFriendsModal onClose={() => openModal('isInviteFriendsModal', false)} currentInvited={invitedFriends} onInviteToggle={(name) => setInvitedFriends(prev => { const next = new Set(prev); if (next.has(name)) next.delete(name); else next.add(name); return next;})} />}
      {isAmbassadorModalOpen && <AmbassadorModal onClose={closeAllModals} showToast={showToast} />}
      {isSubscriptionModalOpen && <SubscriptionModal onClose={closeAllModals} showToast={showToast} />}
      {reviewModalData && <ReviewModal itemType={reviewModalData.type} item={reviewModalData.item} onClose={closeAllModals} />}
      {donationModalEvent && <DonationModal event={donationModalEvent} onClose={closeAllModals} />}
      {isWithdrawModalOpen && <WithdrawCreditModal currentCredit={userCredit} onClose={closeAllModals} />}
      {isAddCreditModalOpen && <AddCreditModal onClose={closeAllModals} />}
      {paymentCodeModalData && <PaymentCodeModal data={paymentCodeModalData} onClose={closeAllModals} />}
      {payWithCreditAmountModalData && <PayWithCreditAmountModal data={payWithCreditAmountModalData} onClose={closeAllModals} />}
      {inputModalConfig && <InputModal {...inputModalConfig} onClose={closeAllModals} showToast={showToast} />}

      {toast && (
        <div 
          className={`fixed left-1/2 -translate-x-1/2 max-w-xs sm:max-w-sm w-full px-4 py-3.5 rounded-xl shadow-2xl text-white text-sm sm:text-md font-semibold flex items-center gap-2.5 sm:gap-3 animate-toast-pop z-50
          ${toast.type === "success" ? "bg-gradient-to-r from-green-500 to-emerald-600" : ""}
          ${toast.type === "error" ? "bg-gradient-to-r from-red-500 to-rose-600" : ""}
          ${toast.type === "info" ? "bg-gradient-to-r from-sky-500 to-blue-600" : ""}`}
          style={toastStyle}
          role="alert" aria-live="assertive"
        >
           {toast.icon ? toast.icon : (toast.type === "success" ? <CheckCircle size={22} /> : toast.type === "error" ? <AlertTriangle size={22}/> : <Info size={22}/>)}
          {toast.text}
        </div>
      )}
    </div>
  );
}