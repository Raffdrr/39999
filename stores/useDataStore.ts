import create from 'zustand';
import { initialLocaleData, initialEventData, MENU_PHOTO_PRESETS, CHARITY_EVENT_PRESET_IMG, EVENT_IMAGE_PRESETS } from '../constants';
import { Locale, Event, UserReview, BillDetails, GamificationActionType } from '../types';
import { useUserStore } from './useUserStore';
import { useUIStore } from './useUIStore';

interface DataState {
  locales: Locale[];
  events: Event[];
  addReview: (itemType: 'locale' | 'event', itemId: string, rating: number, text: string) => void;
  addMenuPhoto: (localeId: string, photoUrl: string) => void;
  makeDonation: (eventId: string, amount: number) => void;
  createEvent: (eventData: Partial<Event>, invitedFriends: string[]) => void;
  setBillDetails: (localeId: string, details: BillDetails | undefined) => void;
  updateLocaleGuests: (localeId: string, change: number, userName?: string) => void;
  updateEventParticipation: (eventId: string, change: number) => void;
  applyCreditToBill: (localeId: string, amountToApply: number) => void;
  finalizeBillPayment: (localeId: string) => void;
  cancelPaymentAndRefund: (localeId: string) => void;
}

export const useDataStore = create<DataState>((set, get) => ({
  locales: initialLocaleData.map(l => ({...l, joinedUserNames: l.joinedUserNames || [] })),
  events: initialEventData,

  addReview: (itemType, itemId, rating, text) => {
    const { userAvatar, processGamificationAction } = useUserStore.getState();
    const review: UserReview = {
      userId: 'currentUser',
      name: 'Mario Rossi',
      avatar: userAvatar,
      rating,
      text,
      date: new Date().toISOString().split('T')[0]
    };

    if (itemType === 'locale') {
      set(state => ({
        locales: state.locales.map(l =>
          l.id === itemId ? { ...l, userReviews: [...(l.userReviews || []), review] } : l
        )
      }));
      processGamificationAction('ADD_REVIEW_LOCALE');
    } else {
      set(state => ({
        events: state.events.map(e =>
          e.id === itemId ? { ...e, userReviews: [...(e.userReviews || []), review] } : e
        )
      }));
    }
    useUIStore.getState().showToast("Recensione aggiunta!", "success");
    processGamificationAction('ADD_REVIEW');
  },

  addMenuPhoto: (localeId, photoUrl) => {
    set(state => ({
      locales: state.locales.map(l =>
        l.id === localeId ? { ...l, menuPhotos: [...(l.menuPhotos || []), photoUrl] } : l
      )
    }));
    useUserStore.getState().processGamificationAction('ADD_MENU_PHOTO');
    useUIStore.getState().showToast("Foto del menu aggiunta!", "success");
  },

  makeDonation: (eventId, amount) => {
    set(state => ({
      events: state.events.map(e =>
        e.id === eventId ? { ...e, donationsReceived: (e.donationsReceived || 0) + amount } : e
      )
    }));
    useUserStore.getState().processGamificationAction('MAKE_DONATION');
    useUIStore.getState().showToast(`Grazie per la donazione di €${amount.toFixed(2)}!`, "success");
  },

  createEvent: (eventData, invitedFriends) => {
    const newEvent: Event = {
      name: '', date: '', time: '', location: '', category: '', img: '', description: '', maxParticipants: 0,
      ...eventData,
      id: `event${Date.now()}`,
      currentParticipants: 0,
      isUserCreated: true,
      userReviews: [],
      pastAttendees: [],
      donationsReceived: 0,
      paidWithCredit: false,
      isCharityEvent: eventData.isCharityEvent === true,
      donationGoal: (eventData.isCharityEvent === true && eventData.donationGoal) ? eventData.donationGoal : 0,
      hashtags: eventData.hashtags || [],
      invitedFriends: invitedFriends,
    };
    set(state => ({ events: [newEvent, ...state.events] }));
  },

  setBillDetails: (localeId, details) => {
    set(state => ({
      locales: state.locales.map(l =>
        l.id === localeId ? { ...l, billDetails: details } : l
      )
    }));
  },
  
  updateLocaleGuests: (localeId, change, userName) => {
    set(state => ({
      locales: state.locales.map(l => {
        if (l.id === localeId) {
          const newGuests = Math.max(0, l.currentGuests + change);
          let newJoinedUserNames = l.joinedUserNames || [];
          if (change > 0 && userName && !newJoinedUserNames.includes(userName)) {
            newJoinedUserNames = [...newJoinedUserNames, userName];
          } else if (change < 0 && userName) {
            newJoinedUserNames = newJoinedUserNames.filter(name => name !== userName);
          }
          return { ...l, currentGuests: newGuests, joinedUserNames: newJoinedUserNames };
        }
        return l;
      })
    }));
  },
  
  updateEventParticipation: (eventId, change) => {
    set(state => ({
      events: state.events.map(e => 
        e.id === eventId ? { ...e, currentParticipants: Math.max(0, e.currentParticipants + change) } : e
      )
    }));
  },

  applyCreditToBill: (localeId, amountToApply) => {
    const { userCredit, updateUserCredit, processGamificationAction } = useUserStore.getState();
    const locale = get().locales.find(l => l.id === localeId);
    const bill = locale?.billDetails;
    
    if (!bill || !locale) return;
    if (amountToApply > userCredit) {
      useUIStore.getState().showToast("Credito insufficiente.", "error");
      return;
    }

    const newCreditContributed = bill.creditContributed + amountToApply;
    const remainingOnBill = bill.totalAmount - newCreditContributed;
    const newStatus: BillDetails['status'] = remainingOnBill <= 0 ? 'ready_to_finalize' : 'awaiting_credit_application';

    updateUserCredit(-amountToApply);
    get().setBillDetails(localeId, { ...bill, creditContributed: newCreditContributed, status: newStatus });
    
    useUIStore.getState().showToast(`€${amountToApply.toFixed(2)} di credito applicati.`, "success");
     if (remainingOnBill <= 0) {
        useUIStore.getState().showToast("Conto coperto! Pronto per finalizzare.", "info");
    }
  },

  finalizeBillPayment: (localeId) => {
      const locale = get().locales.find(l => l.id === localeId);
      const bill = locale?.billDetails;
      if (!bill || !locale) return;

      const finalBillDetails: BillDetails = { ...bill, status: 'paid_with_credit' };
      get().setBillDetails(localeId, finalBillDetails);

      useUserStore.getState().processGamificationAction('PAY_LOCALE_BILL_WITH_CREDIT');
      useUIStore.getState().openModal('paymentCodeModal', {
          itemName: locale.name,
          itemType: 'locale',
          details: "Pagamento Conto al Tavolo",
          amount: `€${bill.creditContributed.toFixed(2)} (con credito)`,
          paymentCode: `TVL-${Math.random().toString(36).substring(2, 5).toUpperCase()}`,
          qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=SocialMixPaymentDemo",
      });
  },

  cancelPaymentAndRefund: (localeId) => {
      const locale = get().locales.find(l => l.id === localeId);
      const bill = locale?.billDetails;
      if (!bill || bill.status === 'paid_with_credit') return;

      if (bill.creditContributed > 0) {
          useUserStore.getState().updateUserCredit(bill.creditContributed);
          useUIStore.getState().showToast(`Credito di €${bill.creditContributed.toFixed(2)} rimborsato.`, "info");
      }
      get().setBillDetails(localeId, undefined);
  },

}));
