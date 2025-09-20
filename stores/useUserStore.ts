// Fix: Changed import from default to named.
import { create } from 'zustand';
import { calculateLevelDetails, GAMIFICATION_OBJECTIVES_LIST_CORE, initialEventData, USER_AVATARS, PANDA_AVATAR_REWARD_URL } from '../constants';
import { LevelDetails, GamificationObjective, GamificationActionType, Event, Locale, Reward } from '../types';
import { useUIStore } from './useUIStore';
import { useDataStore } from './useDataStore';

interface UserState {
  xp: number;
  levelDetails: LevelDetails;
  credit: number;
  joinedEvents: Set<string>;
  joinedTables: Set<string>;
  objectives: GamificationObjective[];
  rewards: Reward[];
  claimedRewards: Set<string>;
  avatar: string;
  isPremium: boolean;
  
  addXP: (amount: number) => void;
  updateCredit: (amount: number) => void;
  
  joinEvent: (event: Event, paymentType?: 'direct_fee_payment' | 'join_pay_later') => void;
  leaveEvent: (event: Event) => void;
  payEventFeeWithCredit: (eventId: string, amount: number) => void;

  joinTable: (locale: Locale) => void;
  leaveTable: (localeId: string) => void;
  
  claimReward: (rewardId: string) => void;
  setAvatar: (avatarUrl: string) => void;
  setPremium: (isPremium: boolean) => void;

  processGamificationAction: (actionType: GamificationActionType) => void;
}

const initializeObjectives = (joinedTablesCount: number): GamificationObjective[] => {
    return GAMIFICATION_OBJECTIVES_LIST_CORE.map(obj => {
        let isCompleted = false;
        if (obj.actionType === 'JOIN_TABLE' && joinedTablesCount > 0) {
            isCompleted = true;
        }
        return { ...obj, isCompleted };
    });
};

const initialJoinedEvents = new Set(['event_past1', 'event_past2', 'event_yoga']);
const initialJoinedTables = new Set(['loc1', 'loc2']);

export const useUserStore = create<UserState>((set, get) => ({
  xp: 165,
  levelDetails: calculateLevelDetails(165),
  credit: 125.50,
  joinedEvents: initialJoinedEvents,
  joinedTables: initialJoinedTables,
  objectives: initializeObjectives(initialJoinedTables.size),
  rewards: [], // Assuming rewards are fetched or static
  claimedRewards: new Set(),
  avatar: USER_AVATARS[8],
  isPremium: false,

  addXP: (amount) => {
    const currentXP = get().xp;
    const newXP = currentXP + amount;
    const oldLevel = get().levelDetails.level;
    const newLevelDetails = calculateLevelDetails(newXP);
    set({ xp: newXP, levelDetails: newLevelDetails });

    if (newLevelDetails.level > oldLevel) {
        setTimeout(() => {
          useUIStore.getState().showToast(`Congratulazioni! Livello ${newLevelDetails.level} raggiunto!`, "success");
        }, 500);
    }
  },

  updateCredit: (amount) => set(state => ({ credit: state.credit + amount })),
  
  joinEvent: (event, paymentType) => {
      if (get().joinedEvents.has(event.id)) return;
      
      set(state => ({ joinedEvents: new Set(state.joinedEvents).add(event.id) }));
      useDataStore.getState().updateEventParticipation(event.id, 1);
      
      useUIStore.getState().showToast(`Ti sei unito a: ${event.name}!`, "success");
      get().processGamificationAction('JOIN_EVENT');
  },
  
  leaveEvent: (event) => {
      if (!get().joinedEvents.has(event.id)) return;

      if (event.paidWithCredit && event.partecipationFee) {
        const fee = parseFloat(event.partecipationFee.replace('€', ''));
        get().updateCredit(fee);
        useUIStore.getState().showToast(`Credito di €${fee.toFixed(2)} rimborsato.`, "info");
      }

      set(state => {
          const newSet = new Set(state.joinedEvents);
          newSet.delete(event.id);
          return { joinedEvents: newSet };
      });
      useDataStore.getState().updateEventParticipation(event.id, -1);
      useUIStore.getState().showToast(`Hai lasciato: ${event.name}`, "info");
  },

  payEventFeeWithCredit: (eventId, amount) => {
      if (get().credit < amount) return;
      
      get().updateCredit(-amount);
      const wasAlreadyJoined = get().joinedEvents.has(eventId);
      if(!wasAlreadyJoined) {
        set(state => ({ joinedEvents: new Set(state.joinedEvents).add(eventId) }));
        useDataStore.getState().updateEventParticipation(eventId, 1);
        get().processGamificationAction('JOIN_EVENT');
      }
      
      useUIStore.getState().showToast(`Pagata quota di €${amount.toFixed(2)} con credito!`, "success");
      get().processGamificationAction('PAY_EVENT_WITH_CREDIT');
  },

  joinTable: (locale) => {
    if (get().joinedTables.has(locale.id)) return;
    if (locale.currentGuests >= locale.capacity) return;
    
    set(state => ({ joinedTables: new Set(state.joinedTables).add(locale.id) }));
    useDataStore.getState().updateLocaleGuests(locale.id, 1, 'Mario Rossi');
    useUIStore.getState().showToast(`Ti sei unito al tavolo da ${locale.name}!`, "success");
    get().processGamificationAction('JOIN_TABLE');
  },

  leaveTable: (localeId) => {
    if (!get().joinedTables.has(localeId)) return;
    
    useDataStore.getState().cancelPaymentAndRefund(localeId);

    set(state => {
      const newSet = new Set(state.joinedTables);
      newSet.delete(localeId);
      return { joinedTables: newSet };
    });
    useDataStore.getState().updateLocaleGuests(localeId, -1, 'Mario Rossi');
    useUIStore.getState().showToast(`Hai lasciato il tavolo.`, "info");
  },

  claimReward: (rewardId) => {
      // Logic for claiming reward
  },
  setAvatar: (avatarUrl) => set({ avatar: avatarUrl }),
  setPremium: (isPremium) => set({ isPremium }),

  processGamificationAction: (actionType) => {
    let xpGained = 0;
    const newObjectives = get().objectives.map(obj => {
      if (obj.actionType === actionType && !obj.isCompleted) {
        xpGained += obj.xpValue;
        useUIStore.getState().showToast(`Obiettivo: ${obj.title} (+${obj.xpValue} XP)`, "success");
        return { ...obj, isCompleted: true };
      }
      return obj;
    });

    if (xpGained > 0) {
      get().addXP(xpGained);
    }
    set({ objectives: newObjectives });
  },

}));
