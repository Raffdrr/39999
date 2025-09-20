
import { create } from 'zustand';
import { calculateLevelDetails, GAMIFICATION_OBJECTIVES_LIST_CORE, AVAILABLE_BADGES, USER_AVATARS } from '../constants';
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
  actionProgress: Map<GamificationActionType, number>;
  unlockedBadges: Set<string>;
  
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

const initialJoinedEvents = new Set(['event_past1', 'event_past2', 'event_yoga']);
const initialJoinedTables = new Set(['loc1', 'loc2']);

// Helper to initialize user's gamification state based on mock data
const initializeGamificationState = () => {
    const actionProgress = new Map<GamificationActionType, number>();
    actionProgress.set('JOIN_EVENT', initialJoinedEvents.size);
    actionProgress.set('JOIN_TABLE', initialJoinedTables.size);

    const objectives = GAMIFICATION_OBJECTIVES_LIST_CORE.map(obj => {
        const progress = actionProgress.get(obj.actionType) || 0;
        return {
            ...obj,
            isCompleted: progress >= obj.targetCount,
            currentProgress: progress
        };
    });

    const unlockedBadges = new Set<string>();
    if ((actionProgress.get('JOIN_EVENT') || 0) >= 5) unlockedBadges.add('badge1');
    // Add other initial badge checks if necessary

    return { actionProgress, objectives, unlockedBadges };
};

const initialGamificationState = initializeGamificationState();

export const useUserStore = create<UserState>((set, get) => ({
  xp: 165,
  levelDetails: calculateLevelDetails(165),
  credit: 125.50,
  joinedEvents: initialJoinedEvents,
  joinedTables: initialJoinedTables,
  objectives: initialGamificationState.objectives,
  rewards: [], // Assuming rewards are fetched or static
  claimedRewards: new Set(),
  avatar: USER_AVATARS[8],
  isPremium: false,
  actionProgress: initialGamificationState.actionProgress,
  unlockedBadges: initialGamificationState.unlockedBadges,

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
    const { actionProgress, objectives, addXP, unlockedBadges } = get();
    const showToast = useUIStore.getState().showToast;

    const newProgress = (actionProgress.get(actionType) || 0) + 1;
    const newActionProgress = new Map(actionProgress).set(actionType, newProgress);
    
    let totalXpGained = 0;

    const updatedObjectives = objectives.map(obj => {
        if (!obj.isCompleted && obj.actionType === actionType && newProgress >= obj.targetCount) {
            totalXpGained += obj.xpValue;
            showToast(`Obiettivo: ${obj.title} (+${obj.xpValue} XP)`, "success");
            return { ...obj, isCompleted: true, currentProgress: newProgress };
        }
        return obj;
    });

    if (totalXpGained > 0) {
        addXP(totalXpGained);
    }
    
    const newUnlockedBadges = new Set(unlockedBadges);
    let newBadgeWasUnlocked = false;

    if (!newUnlockedBadges.has('badge1') && actionType === 'JOIN_EVENT' && newProgress >= 5) {
        newUnlockedBadges.add('badge1');
        newBadgeWasUnlocked = true;
    }
    if (!newUnlockedBadges.has('badge2') && actionType === 'ADD_REVIEW_LOCALE' && newProgress >= 3) {
        newUnlockedBadges.add('badge2');
        newBadgeWasUnlocked = true;
    }
    if (!newUnlockedBadges.has('badge3') && actionType === 'MAKE_DONATION' && newProgress >= 1) {
        newUnlockedBadges.add('badge3');
        newBadgeWasUnlocked = true;
    }
    if (!newUnlockedBadges.has('badge4') && actionType === 'CREATE_EVENT' && newProgress >= 1) {
        newUnlockedBadges.add('badge4');
        newBadgeWasUnlocked = true;
    }
    
    if (newBadgeWasUnlocked) {
        const newlyUnlockedBadgeId = [...newUnlockedBadges].find(id => !unlockedBadges.has(id));
        const badgeInfo = AVAILABLE_BADGES.find(b => b.id === newlyUnlockedBadgeId);
        if(badgeInfo) {
             setTimeout(() => {
                showToast(`Badge Sbloccato: ${badgeInfo.name}!`, "success");
             }, 600);
        }
    }
    
    set({ 
        actionProgress: newActionProgress,
        objectives: updatedObjectives,
        unlockedBadges: newUnlockedBadges
    });
  },

}));