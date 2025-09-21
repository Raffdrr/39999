import { create } from 'zustand';
import { ToastMessage, TabId, ReviewModalData, PaymentCodeModalData, PayWithCreditAmountModalData, InputModalData, DisplayCategory } from '../types';

// Data types for modals that carry specific information
type ModalData = {
  modalView: { list: string[]; index: number } | null; // Unified state for Locale/Event modals
  reviewModal: ReviewModalData | null;
  donationModal: string | null; // eventId
  paymentCodeModal: PaymentCodeModalData | null;
  payWithCreditAmountModal: PayWithCreditAmountModalData | null;
  inputModal: InputModalData | null;
  finalizeBill: string | null; // localeId
  initiatePayBill: string | null; // localeId
  cancelPayment: string | null; // localeId
};

// Boolean flags for simple open/close modals
type ModalFlags = {
  isGlobalMapOpen: boolean;
  isAddCreditOpen: boolean;
  isWithdrawCreditOpen: boolean;
  isAmbassadorModalOpen: boolean;
  isSubscriptionModalOpen: boolean;
  isProposeTableModalOpen: boolean;
  isCreateEventModalOpen: boolean;
  isInviteFriendsModalOpen: boolean;
  isSupportModalOpen: boolean;
  isLogoutModalOpen: boolean;
};

// Combining all modal states
type ModalState = ModalData & ModalFlags;

// Define the name for each modal type
type ModalName = keyof ModalState;

interface UIState extends ModalState {
  activeTab: TabId;
  theme: 'light' | 'dark';
  toastMessage: ToastMessage | null;
  showFilterPanel: boolean;
  searchTerm: string;
  displayCategory: DisplayCategory;
  activeLocaleFilters: Set<string>;
  activeEventFilters: Set<string>;
  
  setActiveTab: (tabId: TabId) => void;
  toggleTheme: () => void;
  showToast: (text: string, type?: "success" | "error" | "info", icon?: React.ReactNode) => void;
  hideToast: () => void;
  
  openModal: <K extends ModalName>(modal: K, data?: ModalState[K]) => void;
  closeAllModals: () => void;

  goToNextModalItem: () => void;
  goToPrevModalItem: () => void;

  toggleFilterPanel: () => void;
  setSearchTerm: (term: string) => void;
  setDisplayCategory: (category: DisplayCategory) => void;
  toggleLocaleFilter: (filter: string) => void;
  toggleEventFilter: (filter: string) => void;
  resetAllFilters: () => void;
}

const initialModalState: ModalState = {
  modalView: null,
  reviewModal: null,
  donationModal: null,
  paymentCodeModal: null,
  payWithCreditAmountModal: null,
  inputModal: null,
  finalizeBill: null,
  initiatePayBill: null,
  cancelPayment: null,
  isGlobalMapOpen: false,
  isAddCreditOpen: false,
  isWithdrawCreditOpen: false,
  isAmbassadorModalOpen: false,
  isSubscriptionModalOpen: false,
  isProposeTableModalOpen: false,
  isCreateEventModalOpen: false,
  isInviteFriendsModalOpen: false,
  isSupportModalOpen: false,
  isLogoutModalOpen: false,
};


export const useUIStore = create<UIState>((set, get) => ({
  ...initialModalState,
  activeTab: 'home',
  theme: 'light',
  toastMessage: null,
  showFilterPanel: false,
  searchTerm: '',
  displayCategory: 'all',
  activeLocaleFilters: new Set(),
  activeEventFilters: new Set(),

  setActiveTab: (tabId) => {
    if (get().showFilterPanel) {
      set({ showFilterPanel: false });
    }
    set({ activeTab: tabId });
  },

  toggleTheme: () => set(state => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  
  showToast: (text, type = 'info', icon) => {
    set({ toastMessage: { text, type, icon } });
    setTimeout(() => get().hideToast(), 3000);
  },
  
  hideToast: () => set({ toastMessage: null }),

  openModal: (modal, data) => {
    set({ [modal]: data } as any);
  },

  closeAllModals: () => {
    set({ ...initialModalState });
  },

  goToNextModalItem: () => set(state => {
    if (!state.modalView) return {};
    const nextIndex = state.modalView.index + 1;
    if (nextIndex >= state.modalView.list.length) {
      return { modalView: null }; // Close modal at the end
    }
    return { modalView: { ...state.modalView, index: nextIndex } };
  }),
  
  goToPrevModalItem: () => set(state => {
    if (!state.modalView) return {};
    const prevIndex = state.modalView.index - 1;
    if (prevIndex < 0) {
      return { modalView: null }; // Close modal at the beginning
    }
    return { modalView: { ...state.modalView, index: prevIndex } };
  }),

  toggleFilterPanel: () => set(state => ({ showFilterPanel: !state.showFilterPanel })),
  
  setSearchTerm: (term) => set({ searchTerm: term }),
  
  setDisplayCategory: (category) => set({ displayCategory: category }),
  
  toggleLocaleFilter: (filter) => set(state => {
    const newSet = new Set(state.activeLocaleFilters);
    if (newSet.has(filter)) newSet.delete(filter);
    else newSet.add(filter);
    return { activeLocaleFilters: newSet };
  }),

  toggleEventFilter: (filter) => set(state => {
    const newSet = new Set(state.activeEventFilters);
    if (newSet.has(filter)) newSet.delete(filter);
    else newSet.add(filter);
    return { activeEventFilters: newSet };
  }),
  
  resetAllFilters: () => set({ activeLocaleFilters: new Set(), activeEventFilters: new Set() }),
}));