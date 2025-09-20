import create from 'zustand';
import { TabId, ReviewModalData, PaymentCodeModalData, PayWithCreditAmountModalData, ToastMessage } from '../types';
import React from 'react';

type ModalPayload = string | boolean | ReviewModalData | PaymentCodeModalData | PayWithCreditAmountModalData | { [key: string]: any } | null;

interface UIState {
  activeTab: TabId;
  selectedLocaleId: string | null;
  selectedEventId: string | null;
  
  isGlobalMapOpen: boolean;
  isCreateEventModalOpen: boolean;
  isProposeTableModalOpen: boolean;
  isInviteFriendsModalOpen: boolean;
  isAmbassadorModalOpen: boolean;
  isSubscriptionModalOpen: boolean;
  reviewModalData: ReviewModalData | null;
  donationModalEventId: string | null;
  isWithdrawModalOpen: boolean;
  isAddCreditModalOpen: boolean;
  paymentCodeModalData: PaymentCodeModalData | null;
  payWithCreditAmountModalData: PayWithCreditAmountModalData | null;
  inputModalConfig: any; // Simplified for brevity
  
  toast: ToastMessage | null;
  showFilterPanel: boolean;
  
  setActiveTab: (tabId: TabId) => void;
  openModal: (modal: keyof UIState, payload: ModalPayload) => void;
  closeAllModals: () => void;
  showToast: (text: string, type?: ToastMessage['type'], icon?: React.ReactNode) => void;
  toggleFilterPanel: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeTab: 'home',
  selectedLocaleId: null,
  selectedEventId: null,
  isGlobalMapOpen: false,
  isCreateEventModalOpen: false,
  isProposeTableModalOpen: false,
  isInviteFriendsModalOpen: false,
  isAmbassadorModalOpen: false,
  isSubscriptionModalOpen: false,
  reviewModalData: null,
  donationModalEventId: null,
  isWithdrawModalOpen: false,
  isAddCreditModalOpen: false,
  paymentCodeModalData: null,
  payWithCreditAmountModalData: null,
  inputModalConfig: null,
  toast: null,
  showFilterPanel: false,

  setActiveTab: (tabId) => set({ activeTab: tabId }),

  openModal: (modal, payload) => {
    // This is a generic modal opener. It can be more type-safe with overloads.
    if (modal === 'selectedLocale') set({ selectedLocaleId: payload as string });
    else if (modal === 'selectedEvent') set({ selectedEventId: payload as string });
    else if (modal === 'reviewModal') set({ reviewModalData: payload as ReviewModalData });
    else if (modal === 'donationModal') set({ donationModalEventId: payload as string });
    else if (modal === 'paymentCodeModal') set({ paymentCodeModalData: payload as PaymentCodeModalData });
    else if (modal === 'payWithCreditAmountModal') set({ payWithCreditAmountModalData: payload as PayWithCreditAmountModalData });
    else if (modal === 'inputModalConfig') set({ inputModalConfig: payload as any });
    else set({ [modal as any]: payload });
  },

  closeAllModals: () => set({
    selectedLocaleId: null,
    selectedEventId: null,
    isGlobalMapOpen: false,
    isCreateEventModalOpen: false,
    isProposeTableModalOpen: false,
    isInviteFriendsModalOpen: false,
    isAmbassadorModalOpen: false,
    isSubscriptionModalOpen: false,
    reviewModalData: null,
    donationModalEventId: null,
    isWithdrawModalOpen: false,
    isAddCreditModalOpen: false,
    paymentCodeModalData: null,
    payWithCreditAmountModalData: null,
    inputModalConfig: null,
  }),
  
  showToast: (text, type = "success", icon = null) => {
    set({ toast: { text, type, icon } });
    setTimeout(() => set({ toast: null }), 3500);
  },

  toggleFilterPanel: () => set(state => ({ showFilterPanel: !state.showFilterPanel })),
}));
