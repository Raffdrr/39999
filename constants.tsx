
import React from 'react';
import {
  Badge, GamificationObjectiveCore, LevelDetails, Locale, Event, NotificationItem,
  ChatMessage, FriendData, UserReview, Reward
} from './types';
import {
  Award, Camera, CheckCircle, Gift, Heart, PlusCircle, Smile, Sparkles, Star, Target, Ticket, Trash2, UserCheck, Users,
  MessageSquare, Bell, FileText, BookMarked, ShoppingBag, Clock2, Percent
} from 'lucide-react';

export const CORAL_PRIMARY = 'rose'; // The primary theme color, corresponds to Tailwind's 'rose'.
export const CORAL_ACCENT_LIGHT = 'rose-light'; // Placeholder, not really used
export const CORAL_TEXT_ACTIVE = 'text-rose-500';
export const CORAL_ICON_ACTIVE = 'text-rose-500';
export const CORAL_BORDER = 'border-rose-500/40';
export const CORAL_TAG_BG = 'bg-rose-100';
export const CORAL_TAG_TEXT = 'text-rose-700';

export const MAP_PLACEHOLDER = "https://placehold.co/600x400/e0e0e0/757575?text=Mappa";
export const MAP_PLACEHOLDER_LOCALE_MODAL = "https://placehold.co/600x200/e2e8f0/475569?text=Mappa+Locale";
export const GOOGLE_PAY_LOGO_URL = "https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg";
export const SIMULATED_QR_CODE_URL = "https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=SocialMixPaymentDemo";
export const PANDA_AVATAR_REWARD_URL = 'https://img.icons8.com/plasticine/100/000000/panda.png';
export const CHARITY_EVENT_PRESET_IMG = 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80';


export const USER_AVATARS = [
  "https://randomuser.me/api/portraits/women/44.jpg",
  "https://randomuser.me/api/portraits/men/46.jpg",
  "https://randomuser.me/api/portraits/women/47.jpg",
  "https://randomuser.me/api/portraits/men/48.jpg",
  "https://randomuser.me/api/portraits/women/49.jpg",
  "https://randomuser.me/api/portraits/men/50.jpg",
  "https://randomuser.me/api/portraits/women/51.jpg",
  "https://randomuser.me/api/portraits/men/52.jpg",
  "https://randomuser.me/api/portraits/men/32.jpg", // Mario Rossi
];

const initialReviews: UserReview[] = [
    { userId: 'user1', name: 'Laura Bianchi', avatar: USER_AVATARS[0], rating: 5, text: 'Posto fantastico, atmosfera unica e cibo delizioso! Tornerò sicuramente.', date: '2023-10-26' },
    { userId: 'user2', name: 'Marco Verdi', avatar: USER_AVATARS[1], rating: 4, text: 'Buona selezione di birre e ottimo servizio. Un po\' affollato nel weekend.', date: '2023-10-25' },
];

export const initialLocaleData: Locale[] = [
    { id: 'loc1', name: 'Osteria del Borgo Antico', rating: 4.8, reviews: 134, cuisine: 'Italiana', price: '€€', distance: '1.2km', address: 'Via Roma 1, Milano', phone: '02 123456', website: 'osteriaborgo.it', img: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80', coords: { lat: 45.4642, lng: 9.1900 }, capacity: 20, currentGuests: 12, hashtags: ['tradizionale', 'romantico'], menu: [{ dish: 'Spaghetti Carbonara', price: '€12', category: 'Primi' }], description: 'Un angolo di tradizione nel cuore della città.', menuPhotos: [], userReviews: initialReviews, galleryPhotos: [], openingHours: 'Lun-Sab: 12-15, 19-23', joinedUserNames: ["Mario Rossi"] },
    { id: 'loc2', name: 'The Golden Spoon', rating: 4.5, reviews: 250, cuisine: 'Gourmet', price: '€€€', distance: '500m', address: 'Piazza Duomo 2, Milano', phone: '02 654321', website: 'goldenspoon.com', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80', coords: { lat: 45.4640, lng: 9.1918 }, capacity: 30, currentGuests: 28, hashtags: ['moderno', 'fine-dining'], menu: [{ dish: 'Risotto oro e zafferano', price: '€25', category: 'Primi' }], description: 'Esperienza culinaria indimenticabile.', menuPhotos: [], userReviews: [{ userId: 'user_current', name: 'Mario Rossi', avatar: USER_AVATARS[8], rating: 5, text: 'Incredibile!', date: '2023-10-20' }], galleryPhotos: [], openingHours: 'Mar-Dom: 19-23:30' },
];

export const initialEventData: Event[] = [
    { id: 'event1', name: 'Serata Jazz & Wine', date: new Date('2025-12-05T21:00:00').toISOString(), time: '21:00', location: 'Jazz Club Milano', category: 'Musica', img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80', description: 'Una serata di grande musica jazz accompagnata da una selezione di vini pregiati.', maxParticipants: 50, currentParticipants: 35, hashtags: ['jazz', 'livemusic', 'wine'], isUserCreated: false, userReviews: [], pastAttendees: [], isCharityEvent: false, donationsReceived: 0, donationGoal: 0 },
    { id: 'event_yoga', name: 'Yoga al Parco', date: new Date('2025-12-10T09:00:00').toISOString(), time: '09:00', location: 'Parco Sempione', category: 'Benessere', img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1220&q=80', description: 'Sessione di yoga all\'aperto per iniziare la giornata con energia.', maxParticipants: 30, currentParticipants: 22, hashtags: ['yoga', 'outdoor', 'relax'], isUserCreated: false, userReviews: [], pastAttendees: [], isCharityEvent: false, donationsReceived: 0, donationGoal: 0, partecipationFee: "€10" },
    { id: 'event_past1', name: 'Corso di Cucina', date: new Date('2024-05-15T18:00:00').toISOString(), time: '18:00', location: 'Scuola Culinaria', category: 'Cibo', img: 'https://images.unsplash.com/photo-1556910110-a5a6350d3950?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80', description: 'Impara i segreti della pasta fresca.', maxParticipants: 15, currentParticipants: 15, hashtags: ['food', 'workshop'], isUserCreated: false, userReviews: [], pastAttendees: ["Mario Rossi"], isCharityEvent: false, donationsReceived: 0, donationGoal: 0 },
    { id: 'event_past2', name: 'Maratona Benefica', date: new Date('2024-04-20T09:30:00').toISOString(), time: '09:30', location: 'Centro Città', category: 'Beneficenza', img: CHARITY_EVENT_PRESET_IMG, description: 'Corri per una buona causa!', maxParticipants: 500, currentParticipants: 450, hashtags: ['running', 'charity'], isUserCreated: false, userReviews: [], pastAttendees: ["Mario Rossi"], isCharityEvent: true, donationsReceived: 5250, donationGoal: 5000, paidWithCredit: true, partecipationFee: "€25" },
];

export const NEARBY_FRIENDS_DATA: FriendData[] = [
    { id: 'friend1', name: 'Giulia Neri', distance: '200m', avatar: USER_AVATARS[2] },
    { id: 'friend2', name: 'Luca Gallo', distance: '800m', avatar: USER_AVATARS[3] },
    { id: 'friend3', name: 'Sara Conti', distance: '1.5km', avatar: USER_AVATARS[4] },
];

// Fix: Changed icon from JSX element to component reference to fix cloneElement error.
export const USER_BADGES: Badge[] = [
    { id: 'badge1', name: 'Recensore Locale', icon: Star, description: 'Hai recensito 3 locali.', color: 'amber' },
    { id: 'badge2', name: 'Critico di Eventi', icon: Ticket, description: 'Hai recensito 3 eventi.', color: 'indigo' },
    { id: 'badge3', name: 'Partecipante Top', icon: Users, description: 'Hai partecipato a 3 eventi.', color: 'blue' },
    { id: 'badge4', name: 'Animo Nobile', icon: Gift, description: 'Hai fatto una donazione.', color: 'pink' },
    { id: 'badge5', name: 'Socializer', icon: UserCheck, description: 'Ti sei unito al tuo primo tavolo.', color: 'teal' },
];

export const XP_THRESHOLDS_FOR_LEVELS: number[] = [0, 100, 250, 500, 1000, 2000]; // XP per iniziare il livello 1, 2, 3, etc.

export const calculateLevelDetails = (xp: number): LevelDetails => {
    let level = 1;
    while (level < XP_THRESHOLDS_FOR_LEVELS.length && xp >= XP_THRESHOLDS_FOR_LEVELS[level]) {
        level++;
    }
    const xpForCurrentLevelStart = XP_THRESHOLDS_FOR_LEVELS[level - 1];
    const xpForNextLevelStart = level < XP_THRESHOLDS_FOR_LEVELS.length ? XP_THRESHOLDS_FOR_LEVELS[level] : Infinity;
    const xpIntoCurrentLevel = xp - xpForCurrentLevelStart;
    const xpNeededForNextLevel = xpForNextLevelStart - xpForCurrentLevelStart;
    const progressPercentage = xpNeededForNextLevel === Infinity ? 100 : Math.min(100, (xpIntoCurrentLevel / xpNeededForNextLevel) * 100);

    return {
        level,
        xp,
        xpForCurrentLevelStart,
        xpForNextLevelStart,
        xpIntoCurrentLevel,
        xpNeededForNextLevel,
        progressPercentage,
    };
}

export const GAMIFICATION_OBJECTIVES_LIST_CORE: GamificationObjectiveCore[] = [
    { id: 'obj1', title: 'Aggiungi una recensione', description: 'Lascia la tua prima recensione per un locale o evento.', xpValue: 10, actionType: 'ADD_REVIEW', targetCount: 1, icon: <Star size={20} className="text-amber-500" /> },
    { id: 'obj2', title: 'Unisciti a un evento', description: 'Partecipa al tuo primo evento.', xpValue: 15, actionType: 'JOIN_EVENT', targetCount: 1, icon: <Ticket size={20} className="text-indigo-500" /> },
    { id: 'obj3', title: 'Aggiungi foto al menu', description: 'Contribuisci aggiungendo una foto a un menu.', xpValue: 20, actionType: 'ADD_MENU_PHOTO', targetCount: 1, icon: <Camera size={20} className="text-sky-500" /> },
    { id: 'obj4', title: 'Crea un evento', description: 'Organizza il tuo primo evento e invita i tuoi amici.', xpValue: 50, actionType: 'CREATE_EVENT', targetCount: 1, icon: <PlusCircle size={20} className="text-rose-500" /> },
    { id: 'obj5', title: 'Fai una donazione', description: 'Supporta una causa benefica.', xpValue: 30, actionType: 'MAKE_DONATION', targetCount: 1, icon: <Gift size={20} className="text-pink-500" /> },
    { id: 'obj6', title: 'Paga con Credito', description: 'Paga la quota di un evento usando il tuo credito SocialMix.', xpValue: 25, actionType: 'PAY_EVENT_WITH_CREDIT', targetCount: 1, icon: <CheckCircle size={20} className="text-green-500" /> },
    { id: 'obj7', title: 'Unisciti a un tavolo', description: 'Unisciti al tuo primo tavolo in un locale.', xpValue: 15, actionType: 'JOIN_TABLE', targetCount: 1, icon: <Users size={20} className="text-teal-500" /> },
];

export const MENU_PHOTO_PRESETS = [
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500',
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500',
];
export const EVENT_IMAGE_PRESETS = [
    'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    'https://images.unsplash.com/photo-1472692634322-ce5de6f7a63d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
];

export const EVENT_COST_OPTIONS = ["Gratuito", "A Pagamento"];

export const initialNotifications: NotificationItem[] = [
    { id: 'n1', icon: MessageSquare, title: 'Nuovo messaggio da Luca', description: 'Ti ha scritto riguardo all\'evento di domani.', timestamp: new Date(new Date().setHours(new Date().getHours() - 1)).toISOString(), isRead: false, link: { tabId: 'chat' } },
    { id: 'n2', icon: Heart, title: 'Osteria del Borgo Antico piace anche a Giulia', description: 'Anche la tua amica ha aggiunto questo locale ai preferiti.', timestamp: new Date(new Date().setHours(new Date().getHours() - 3)).toISOString(), isRead: false, link: { tabId: 'favorites', itemId: 'loc1', itemType: 'locale' } },
    { id: 'n3', icon: Ticket, title: 'Promemoria: Serata Jazz & Wine', description: 'L\'evento a cui partecipi è tra 5 giorni!', timestamp: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), isRead: true, link: { tabId: 'calendar', itemId: 'event1', itemType: 'event' } },
];

export const initialChatMessages: ChatMessage[] = [
    { id: 'chat1', senderId: 'friend2', senderName: 'Luca Gallo', avatar: USER_AVATARS[3], lastMessage: 'Ciao! Ci vediamo domani sera?', timestamp: new Date(new Date().setHours(new Date().getHours() - 1)).toISOString(), unreadCount: 1 },
    { id: 'chat2', senderId: 'friend1', senderName: 'Giulia Neri', avatar: USER_AVATARS[2], lastMessage: 'Fantastico quel posto! Dobbiamo tornarci.', timestamp: new Date(new Date().setHours(new Date().getHours() - 4)).toISOString(), unreadCount: 0 },
    { id: 'chat3', senderId: 'group1', senderName: 'Gruppo "Cena Sabato"', avatar: 'https://img.icons8.com/clouds/100/000000/group.png', lastMessage: 'Sara: Io ci sono!', timestamp: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), unreadCount: 3, isTyping: true },
];

// Fix: Changed icon from JSX element to component reference to fix cloneElement error.
export const INITIAL_REWARDS_DATA: Reward[] = [
    { id: 'reward_premium_month', name: 'Mese Premium Gratuito', description: 'Goditi un mese di SocialMix Premium, offerto da noi!', xpCost: 500, icon: Sparkles, color: 'purple' },
    { id: 'reward_discount_partner', name: 'Sconto 20% Partner', description: 'Ottieni un codice sconto del 20% da usare presso un locale partner.', xpCost: 350, icon: Percent, color: 'teal' },
    { id: 'reward_exclusive_avatar', name: 'Avatar Esclusivo', description: 'Sblocca un avatar a tema panda per il tuo profilo.', xpCost: 200, icon: Smile, color: 'emerald' },
];
