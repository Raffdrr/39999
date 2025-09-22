
import React, { useState, useEffect } from 'react';
import { Home, CalendarDays, MessagesSquare, Heart, CircleUserRound } from 'lucide-react';
import { HomeIcon, CalendarIcon, ChatIcon, FavoritesIcon, ProfileIcon } from './components/icons';

import HomePage from './pages/HomePage';
import CalendarPage from './pages/CalendarPage';
import ChatPage from './pages/ChatPage';
import FavoritesPage from './pages/FavoritesPage';
import ProfilePage from './pages/ProfilePage';
import Toast from './components/ui/Toast';
import FilterPanel from './components/ui/FilterPanel';
import FabMenu from './components/ui/FabMenu';
import HomeSearchBar from './components/ui/SearchBar';

import RestaurantModal from './components/modals/RestaurantModal';
import EventModal from './components/modals/EventModal';
import GlobalMapModal from './components/modals/GlobalMapModal';
import ReviewModal from './components/modals/ReviewModal';
import DonationModal from './components/modals/DonationModal';
import AddCreditModal from './components/modals/AddCreditModal';
import WithdrawCreditModal from './components/modals/WithdrawCreditModal';
import AmbassadorModal from './components/modals/AmbassadorModal';
import SubscriptionModal from './components/modals/SubscriptionModal';
import ProposeTableModal from './components/modals/ProposeTableModal';
import CreateEventModal from './components/modals/CreateEventModal';
import InviteFriendsModal from './components/modals/InviteFriendsModal';
import SupportModal from './components/modals/SupportModal';
import LogoutConfirmationModal from './components/modals/LogoutConfirmationModal';
import PaymentCodeModal from './components/modals/PaymentCodeModal';
import PayWithCreditAmountModal from './components/modals/PayWithCreditAmountModal';
import InputModal from './components/modals/InputModal';

import { useUIStore, useDataStore, useUserStore } from './stores';
import { NavTabType, TabId, Event as EventType } from './types';

// New interface for nav tabs with gradients
interface NavTabWithGradient {
  id: TabId;
  label: string;
  icon: React.ComponentType<{isActive: boolean; className?: string}>; // Use the new icon components
  gradient: string;
}


const navTabs: NavTabWithGradient[] = [
  { id: 'calendar', label: 'Calendario', icon: CalendarIcon, gradient: 'from-purple-400 to-indigo-500' },
  { id: 'chat', label: 'Chat', icon: ChatIcon, gradient: 'from-emerald-400 to-green-500' },
  { id: 'home', label: 'Home', icon: HomeIcon, gradient: 'from-sky-400 to-blue-500' },
  { id: 'favorites', label: 'Preferiti', icon: FavoritesIcon, gradient: 'from-red-500 to-orange-500' },
  { id: 'profile', label: 'Profilo', icon: ProfileIcon, gradient: 'from-amber-400 to-yellow-500' },
];

const pageComponents: Record<TabId, React.ComponentType> = {
  home: HomePage,
  calendar: CalendarPage,
  chat: ChatPage,
  favorites: FavoritesPage,
  profile: ProfilePage,
};

const App: React.FC = () => {
  const { 
    activeTab, setActiveTab, toastMessage, hideToast, openModal, closeAllModals, showToast,
    modalView, goToNextModalItem, goToPrevModalItem,
    isGlobalMapOpen, reviewModal, donationModal, 
    isAddCreditOpen, isWithdrawCreditOpen, isAmbassadorModalOpen, isSubscriptionModalOpen,
    isProposeTableModalOpen, isCreateEventModalOpen, isInviteFriendsModalOpen, 
    isSupportModalOpen, isLogoutModalOpen, paymentCodeModal, payWithCreditAmountModal,
    inputModal,
    initiatePayBill, finalizeBill, cancelPayment,
    theme, // Get theme from the store
  } = useUIStore();
  const { locales, events, createEvent, setBillDetails, finalizeBillPayment, cancelPaymentAndRefund } = useDataStore();
  const { credit, processGamificationAction } = useUserStore();

  const [invitedFriends, setInvitedFriends] = useState<Set<string>>(new Set());

  // Effect to sync the theme state with the DOM
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const donationEventData = events.find(e => e.id === donationModal);
  
  const isHomePage = activeTab === 'home';
  
  useEffect(() => {
    if (initiatePayBill) {
      const locale = locales.find(l => l.id === initiatePayBill);
      if(locale) {
        openModal('inputModal', {
          title: "Inizia Pagamento",
          message: `Inserisci l'importo totale del conto per ${locale.name}. Questo importo sarà diviso tra i partecipanti al tavolo.`,
          inputLabel: "Importo Totale Conto (€)",
          inputType: 'number',
          inputMode: 'decimal',
          placeholder: 'Es. 55.50',
          confirmText: 'Avanti',
          min: "0.01",
          step: "0.01",
          onClose: () => openModal('initiatePayBill', null),
          onConfirm: (value: string) => {
            const totalAmount = parseFloat(value);
            if (!isNaN(totalAmount) && totalAmount > 0) {
              setBillDetails(initiatePayBill, {
                totalAmount,
                creditContributed: 0,
                status: 'awaiting_credit_application'
              });
              openModal('initiatePayBill', null); // close this trigger
              openModal('modalView', { list: [`locale_${initiatePayBill}`], index: 0 }); // Re-open locale modal to show new state
            }
          }
        });
      }
    }
  }, [initiatePayBill, locales, openModal, setBillDetails]);

  useEffect(() => {
    if (finalizeBill) {
      finalizeBillPayment(finalizeBill);
      openModal('finalizeBill', null);
    }
  }, [finalizeBill, finalizeBillPayment, openModal]);

  useEffect(() => {
    if (cancelPayment) {
      cancelPaymentAndRefund(cancelPayment);
      openModal('cancelPayment', null);
    }
  }, [cancelPayment, cancelPaymentAndRefund, openModal]);


  const handleCreateEvent = (eventData: Partial<EventType>) => {
    createEvent(eventData, Array.from(invitedFriends));
    processGamificationAction('CREATE_EVENT');
    closeAllModals();
    setActiveTab('calendar');
    showToast("Evento creato con successo!", "success");
    setInvitedFriends(new Set());
  };

  const handleProposeTable = () => {
      closeAllModals();
      showToast("Proposta di tavolo inviata!", "success");
      setActiveTab('chat');
  };
  
  const ActivePageComponent = pageComponents[activeTab];

  let modalToRender = null;
  if (modalView) {
      const currentIdString = modalView.list[modalView.index];
      const [type, id] = currentIdString.split('_');
      if (type === 'locale') {
          const itemData = locales.find(l => l.id === id);
          if (itemData) {
              modalToRender = (
                  <RestaurantModal 
                      locale={itemData} 
                      onClose={() => openModal('modalView', null)} 
                      onSwipeLeft={goToNextModalItem}
                      onSwipeRight={goToPrevModalItem}
                      isFirstItem={modalView.index === 0}
                      isLastItem={modalView.index === modalView.list.length - 1}
                  />
              );
          }
      } else if (type === 'event') {
          const itemData = events.find(e => e.id === id);
          if (itemData) {
              modalToRender = (
                  <EventModal 
                      event={itemData} 
                      onClose={() => openModal('modalView', null)} 
                      onSwipeLeft={goToNextModalItem}
                      onSwipeRight={goToPrevModalItem}
                      isFirstItem={modalView.index === 0}
                      isLastItem={modalView.index === modalView.list.length - 1}
                  />
              );
          }
      }
  }

  return (
    <div className="h-screen w-screen bg-slate-100 dark:bg-black flex flex-col font-sans antialiased overflow-hidden">
      <main className={`flex-1 overflow-y-auto px-4 sm:px-5 flex flex-col pt-4 ${isHomePage ? 'pb-32' : 'pb-18'}`}>
        {<ActivePageComponent />}
      </main>
      
      {/* Modals & Overlays */}
      <FilterPanel />
      {modalToRender}
      {isGlobalMapOpen && <GlobalMapModal onClose={() => openModal('isGlobalMapOpen', false)} />}
      {reviewModal && <ReviewModal itemType={reviewModal.type} item={reviewModal.item} onClose={() => openModal('reviewModal', null)} />}
      {donationEventData && <DonationModal event={donationEventData} onClose={() => openModal('donationModal', null)} />}
      {isAddCreditOpen && <AddCreditModal onClose={() => openModal('isAddCreditOpen', false)} />}
      {isWithdrawCreditOpen && <WithdrawCreditModal currentCredit={credit} onClose={() => openModal('isWithdrawCreditOpen', false)} />}
      {isAmbassadorModalOpen && <AmbassadorModal showToast={showToast} onClose={() => openModal('isAmbassadorModalOpen', false)} />}
      {isSubscriptionModalOpen && <SubscriptionModal showToast={showToast} onClose={() => openModal('isSubscriptionModalOpen', false)} />}
      {isProposeTableModalOpen && <ProposeTableModal onClose={() => openModal('isProposeTableModalOpen', false)} onPropose={handleProposeTable} locali={locales} showToast={showToast} />}
      {isCreateEventModalOpen && <CreateEventModal onClose={() => openModal('isCreateEventModalOpen', false)} onCreate={handleCreateEvent} showToast={showToast} setShowInviteFriendsModal={(show) => openModal('isInviteFriendsModalOpen', show)} invitedFriendsCount={invitedFriends.size} />}
      {isInviteFriendsModalOpen && <InviteFriendsModal onClose={() => openModal('isInviteFriendsModalOpen', false)} currentInvited={invitedFriends} onInviteToggle={(name) => setInvitedFriends(prev => { const newSet = new Set(prev); if (newSet.has(name)) { newSet.delete(name); } else { newSet.add(name); } return newSet; })} />}
      {isSupportModalOpen && <SupportModal onClose={() => openModal('isSupportModalOpen', false)} showToast={showToast} />}
      {isLogoutModalOpen && <LogoutConfirmationModal onClose={() => openModal('isLogoutModalOpen', false)} onConfirm={() => { openModal('isLogoutModalOpen', false); showToast("Logout effettuato (simulazione)", "info"); }} />}
      {paymentCodeModal && <PaymentCodeModal data={paymentCodeModal} onClose={() => openModal('paymentCodeModal', null)} />}
      {payWithCreditAmountModal && <PayWithCreditAmountModal data={payWithCreditAmountModal} onClose={() => openModal('payWithCreditAmountModal', null)} />}
      {inputModal && <InputModal {...inputModal} showToast={showToast} />}
      
      {/* Bottom Search Bar for Home Page */}
      {isHomePage && (
        <div className="fixed bottom-14 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg z-20 border-t border-slate-200/80 dark:border-slate-800/80 shadow-top">
          <div className="px-2.5 py-1.5 flex items-center gap-2">
            <div className="flex-grow">
              <HomeSearchBar />
            </div>
            <FabMenu />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-slate-200/80 dark:border-slate-800/80 z-30 shadow-top">
        <div className="flex justify-around items-center h-14 px-2">
            {navTabs.map(tab => {
              const isActive = activeTab === tab.id;
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex flex-col items-center justify-center h-12 w-12 rounded-2xl transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600 focus:ring-offset-2 dark:focus:ring-offset-slate-900
                    ${isActive
                      ? `text-slate-800 dark:text-slate-100`
                      : 'text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-105 active:scale-95'
                    }`}
                  aria-label={tab.label}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <IconComponent
                    isActive={isActive}
                    className="transition-all duration-300"
                  />
                  <span className={`mt-1 text-[10px] font-bold transition-all duration-300
                    ${isActive ? 'text-transparent bg-clip-text bg-gradient-to-r ' + tab.gradient : ''}
                  `}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
        </div>
      </nav>

      {toastMessage && <Toast message={toastMessage} onHide={hideToast} onHomePage={isHomePage} />}
    </div>
  );
};

export default App;
