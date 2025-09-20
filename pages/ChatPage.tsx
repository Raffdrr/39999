import React from 'react';
import { Bell, MessageSquare, Heart, Ticket } from 'lucide-react';
import { useInteractionStore, useUIStore, useDataStore } from '../stores';
import type { LucideIcon } from 'lucide-react';

const ChatPage: React.FC = () => {
    const { notifications, chatMessages, markNotificationAsRead, markChatAsRead } = useInteractionStore();
    const { setActiveTab, openModal, showToast } = useUIStore();
    const { locales, events } = useDataStore();

    const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;
    const unreadMessagesCount = chatMessages.reduce((sum, chat) => sum + chat.unreadCount, 0);

    return (
        <div className="animate-page-content-enter flex-1 flex flex-col overflow-hidden space-y-4 sm:space-y-5 h-full">
            <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-700 mb-2 sm:mb-3 px-1 flex items-center gap-1.5">
                    <Bell size={20} className={`text-rose-500`} />Notifiche ({unreadNotificationsCount})
                </h2>
                <div className="space-y-2.5 sm:space-y-3 max-h-64 overflow-y-auto no-scrollbar pr-1">
                    {notifications.map(notif => {
                        const NotificationIcon = notif.icon as LucideIcon;
                        return (
                            <div
                                key={notif.id}
                                className={`py-3 px-2.5 rounded-xl border cursor-pointer ${notif.isRead ? 'bg-white/70' : 'bg-rose-50'}`}
                                onClick={() => {
                                    markNotificationAsRead(notif.id);
                                    if (notif.link) {
                                        if (notif.link.itemId) {
                                            if(notif.link.itemType === 'locale') openModal('selectedLocale', notif.link.itemId)
                                            else openModal('selectedEvent', notif.link.itemId)
                                        }
                                        setActiveTab(notif.link.tabId);
                                    }
                                }}
                            >
                                <div className="flex items-start gap-2.5">
                                    <NotificationIcon size={20} className={`mt-0.5 flex-shrink-0 ${notif.iconColor || 'text-rose-500'}`} />
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-semibold ${!notif.isRead ? 'text-rose-700' : 'text-slate-700'}`}>{notif.title}</p>
                                        <p className="text-xs text-slate-500 truncate">{notif.description}</p>
                                    </div>
                                    <span className="text-[10px] text-slate-400 pt-0.5">{new Date(notif.timestamp).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="border-t border-slate-200 pt-3 sm:pt-4">
                <h2 className="text-lg sm:text-xl font-bold text-slate-700 mb-2 sm:mb-3 px-1 flex items-center gap-1.5">
                    <MessageSquare size={20} className="text-sky-500" />Messaggi ({unreadMessagesCount})
                </h2>
                <div className="space-y-2.5 sm:space-y-3 flex-1 overflow-y-auto no-scrollbar pr-1">
                    {chatMessages.map(chat => (
                        <div
                            key={chat.id}
                            className={`py-3 px-2.5 rounded-xl border cursor-pointer flex items-center gap-3 ${chat.unreadCount > 0 ? 'bg-sky-50' : 'bg-white/70'}`}
                            onClick={() => {
                                markChatAsRead(chat.id);
                                showToast(`Chat con ${chat.senderName} (Demo)`, 'info');
                            }}
                        >
                            <div className="relative flex-shrink-0">
                                <img src={chat.avatar} alt={chat.senderName} className="w-11 h-11 rounded-full" />
                                {chat.unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">{chat.unreadCount}</span>}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center">
                                    <p className={`font-semibold ${chat.unreadCount > 0 ? 'text-sky-700' : 'text-slate-800'}`}>{chat.senderName}</p>
                                    <span className="text-xs text-slate-400">{new Date(chat.timestamp).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <p className={`text-xs text-slate-500 truncate ${chat.isTyping ? 'italic text-sky-600' : ''}`}>
                                    {chat.isTyping ? 'Sta scrivendo...' : chat.lastMessage}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
