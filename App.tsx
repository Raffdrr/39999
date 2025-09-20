import React, { useState, useEffect } from 'react';
import { Home, Calendar, MessageSquare, Heart, User } from 'lucide-react';

import HomePage from './pages/HomePage';
import CalendarPage from './pages/CalendarPage';
import ChatPage from './pages/ChatPage';
import FavoritesPage from './pages/FavoritesPage';
import ProfilePage from './pages/ProfilePage';
import Toast from './components/ui/Toast';

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
import { CORAL_ICON_ACTIVE, CORAL_TEXT_ACTIVE } from './constants';

const navTabs: NavTabType[] = [
  { id: 'calendar', label: 'Calendario', icon: Calendar },
  { id: 'chat', label: 'Chat', icon: MessageSquare },
  { id: 'home', label: 'Home', icon: Home },
  { id: 'favorites', label: 'Preferiti', icon: Heart },
  { id: 'profile', label: 'Profilo', icon: User },
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
    selectedLocale, selectedEvent, isGlobalMapOpen, reviewModal, donationModal, 
    isAddCreditOpen, isWithdrawCreditOpen, isAmbassadorModalOpen, isSubscriptionModalOpen,
    isProposeTableModalOpen, isCreateEventModalOpen, isInviteFriendsModalOpen, 
    isSupportModalOpen, isLogoutModalOpen, paymentCodeModal, payWithCreditAmountModal,
    inputModal,
    initiatePayBill, finalizeBill, cancelPayment
  } = useUIStore();
  const { locales, events, createEvent, setBillDetails, finalizeBillPayment, cancelPaymentAndRefund } = useDataStore();
  const { credit, processGamificationAction } = useUserStore();

  const [invitedFriends, setInvitedFriends] = useState<Set<string>>(new Set());

  const selectedLocaleData = locales.find(l => l.id === selectedLocale);
  const selectedEventData = events.find(e => e.id === selectedEvent);
  const donationEventData = events.find(e => e.id === donationModal);
  
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
              openModal('selectedLocale', initiatePayBill); // Re-open locale modal to show new state
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

  return (
    <div className="h-screen w-screen bg-transparent flex flex-col font-sans antialiased overflow-hidden">
      <main className="flex-1 overflow-y-auto p-4 sm:p-5 pb-24 flex flex-col">
        {<ActivePageComponent />}
      </main>
      
      {/* Modals */}
      {selectedLocaleData && <RestaurantModal locale={selectedLocaleData} onClose={() => openModal('selectedLocale', null)} />}
      {selectedEventData && <EventModal event={selectedEventData} onClose={() => openModal('selectedEvent', null)} />}
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


      <nav className="fixed bottom-0 left-0 right-0 h-[68px] bg-white/90 backdrop-blur-lg border-t border-slate-200/80 flex justify-around items-center z-30 shadow-top">
        {navTabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="flex flex-col items-center justify-center gap-1 w-16 h-full transition-colors duration-200" aria-label={tab.label}>
            <tab.icon size={24} className={activeTab === tab.id ? CORAL_ICON_ACTIVE : 'text-slate-500'} />
            <span className={`text-xs font-medium ${activeTab === tab.id ? CORAL_TEXT_ACTIVE : 'text-slate-600'}`}>
              {tab.label}
            </span>
          </button>
        ))}
      </nav>

      {toastMessage && <Toast message={toastMessage} onHide={hideToast} />}
    </div>
  );
};

export default App;