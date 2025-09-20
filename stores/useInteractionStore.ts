
import { create } from 'zustand';
import { NotificationItem, ChatMessage } from '../types';
import { initialNotifications, initialChatMessages } from '../constants';

interface InteractionState {
  notifications: NotificationItem[];
  chatMessages: ChatMessage[];
  markNotificationAsRead: (notificationId: string) => void;
  markChatAsRead: (chatId: string) => void;
}

export const useInteractionStore = create<InteractionState>((set) => ({
  notifications: initialNotifications,
  chatMessages: initialChatMessages,

  markNotificationAsRead: (notificationId) => {
    set(state => ({
      notifications: state.notifications.map(n =>
        n.id === notificationId ? { ...n, isRead: true } : n
      ),
    }));
  },

  markChatAsRead: (chatId) => {
    set(state => ({
      chatMessages: state.chatMessages.map(c =>
        c.id === chatId ? { ...c, unreadCount: 0 } : c
      ),
    }));
  },
}));
