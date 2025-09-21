import React from 'react';
import { Bell, MessageSquare } from 'lucide-react';
import { useInteractionStore, useUIStore } from '../stores';
import type { LucideIcon } from 'lucide-react';

const ChatPage: React.FC = () => {
    const { notifications, chatMessages, markNotificationAsRead, markChatAsRead } = useInteractionStore();
    const { setActiveTab, openModal, showToast } = useUIStore();

    const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;
    const unreadMessagesCount = chatMessages.reduce((sum, chat) => sum + chat.unreadCount, 0);

    return (
        <div className="animate-page-content-enter flex-1 flex flex-col overflow-hidden space-y-4 sm:space-y-5 h-full">
            <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-200 mb-2 sm:mb-3 px-1 flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-orange-400 to-red-500 shadow-md">
                       <Bell size={20} className="text-white" />
                    </div>
                    <span>Notifiche</span>
                    {unreadNotificationsCount > 0 && <span className="text-sm text-orange-500">({unreadNotificationsCount})</span>}
                </h2>
                <div className="space-y-2.5 sm:space-y-3 max-h-64 overflow-y-auto no-scrollbar pr-1">
                    {notifications.map(notif => {
                        const NotificationIcon = notif.icon as LucideIcon;
                        return (
                            <div
                                key={notif.id}
                                className={`py-3 px-3 rounded-xl border dark:border-slate-700/80 cursor-pointer transition-all duration-200 ease-out hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] active:shadow-sm ${notif.isRead ? 'bg-white dark:bg-slate-800' : 'bg-orange-50 dark:bg-orange-500/10'}`}
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
                                <div className="flex items-start gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-orange-100 to-white dark:from-slate-700 dark:to-slate-600`}>
                                      <NotificationIcon size={18} className={`${notif.iconColor || 'text-orange-500'}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-semibold ${!notif.isRead ? 'text-orange-700 dark:text-orange-400' : 'text-slate-700 dark:text-slate-300'}`}>{notif.title}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{notif.description}</p>
                                    </div>
                                    <span className="text-[10px] text-slate-400 dark:text-slate-500 pt-0.5">{new Date(notif.timestamp).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 pt-3 sm:pt-4">
                <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-200 mb-2 sm:mb-3 px-1 flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-sky-400 to-blue-500 shadow-md">
                       <MessageSquare size={20} className="text-white" />
                    </div>
                    <span>Messaggi</span>
                    {unreadMessagesCount > 0 && <span className="text-sm text-sky-500">({unreadMessagesCount})</span>}
                </h2>
                <div className="space-y-2.5 sm:space-y-3 flex-1 overflow-y-auto no-scrollbar pr-1">
                    {chatMessages.map(chat => (
                        <div
                            key={chat.id}
                            className={`py-3 px-2.5 rounded-xl border dark:border-slate-700/80 cursor-pointer flex items-center gap-3 transition-all duration-200 ease-out hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] active:shadow-sm ${chat.unreadCount > 0 ? 'bg-sky-50 dark:bg-sky-500/10' : 'bg-white dark:bg-slate-800'}`}
                            onClick={() => {
                                markChatAsRead(chat.id);
                                showToast(`Chat con ${chat.senderName} (Demo)`, 'info');
                            }}
                        >
                            <div className="relative flex-shrink-0">
                                <img src={chat.avatar} alt={chat.senderName} className="w-11 h-11 rounded-full" />
                                {chat.unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-sky-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800">{chat.unreadCount}</span>}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center">
                                    <p className={`font-semibold ${chat.unreadCount > 0 ? 'text-sky-700 dark:text-sky-400' : 'text-slate-800 dark:text-slate-200'}`}>{chat.senderName}</p>
                                    <span className="text-xs text-slate-400 dark:text-slate-500">{new Date(chat.timestamp).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <p className={`text-xs text-slate-500 dark:text-slate-400 truncate ${chat.isTyping ? 'italic text-sky-600 dark:text-sky-400' : ''}`}>
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