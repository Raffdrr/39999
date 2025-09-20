
import React from 'react';
import {
    Locale, Event, FriendData, GamificationObjectiveCore, Badge, Reward,
    NotificationItem, ChatMessage, Story, SocialCard, LevelDetails, UserReview
} from './types';
import {
    Utensils, Beer, Music, Mountain, Aperture, HandHeart, VenetianMask, Pizza, Rocket,
    Medal, Star, Gift, MessageSquare, UserPlus, Camera, Repeat, CreditCard, Heart, Ticket, Users,
    ClipboardList, Award, ThumbsUp
} from 'lucide-react';

// UI Colors & Styles
export const CORAL_BORDER = 'border-rose-500/40';
export const CORAL_TEXT_ACTIVE = 'text-rose-600';
export const CORAL_ICON_ACTIVE = 'text-rose-500';

// Image Placeholders & Presets
export const MAP_PLACEHOLDER = 'https://images.unsplash.com/photo-1594755341233-42a7c4125b2d?q=80&w=1287&auto=format&fit=crop';
export const MAP_PLACEHOLDER_LOCALE_MODAL = 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1331&q=80';
export const GOOGLE_PAY_LOGO_URL = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/2560px-Google_Pay_Logo.svg.png';
export const SIMULATED_QR_CODE_URL = "https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=SocialMixPaymentDemo";
export const PANDA_AVATAR_REWARD_URL = "https://i.pravatar.cc/150?u=panda-avatar";
export const CHARITY_EVENT_PRESET_IMG = 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80';

export const USER_AVATARS: string[] = [
    'https://randomuser.me/api/portraits/women/68.jpg',
    'https://randomuser.me/api/portraits/men/75.jpg',
    'https://randomuser.me/api/portraits/women/44.jpg',
    'https://randomuser.me/api/portraits/men/31.jpg',
    'https://randomuser.me/api/portraits/women/23.jpg',
    'https://randomuser.me/api/portraits/men/55.jpg',
    'https://randomuser.me/api/portraits/women/11.jpg',
    'https://randomuser.me/api/portraits/men/1.jpg',
    'https://randomuser.me/api/portraits/men/32.jpg', // Main user avatar
];

export const MENU_PHOTO_PRESETS = [
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=781&q=80",
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
];

export const EVENT_IMAGE_PRESETS = [
    "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd51725?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
];

// Filter Options
export const EVENT_COST_OPTIONS = ['Gratuito', 'A Pagamento'];

// Mock Data: Friends
export const NEARBY_FRIENDS_DATA: FriendData[] = [
  { id: 'friend1', name: 'Luca Bianchi', distance: '1.2 km', avatar: USER_AVATARS[1] },
  { id: 'friend2', name: 'Giulia Verdi', distance: '2.5 km', avatar: USER_AVATARS[2] },
  { id: 'friend3', name: 'Marco Neri', distance: '3.1 km', avatar: USER_AVATARS[3] },
  { id: 'friend4', name: 'Sofia Romano', distance: '4.8 km', avatar: USER_AVATARS[4] },
];

// Mock Data: User Reviews
const sampleReviews: UserReview[] = [
  { userId: 'user1', name: 'Giulia Verdi', avatar: USER_AVATARS[2], rating: 5, text: "Posto fantastico! Atmosfera incredibile e cibo delizioso. Super consigliato per una serata tra amici.", date: "2023-10-26" },
  { userId: 'user2', name: 'Luca Bianchi', avatar: USER_AVATARS[1], rating: 4, text: "Ottima esperienza, personale gentile e location molto curata. Tornerò sicuramente per provare altri piatti.", date: "2023-10-25" },
  { userId: 'user3', name: 'Sofia Romano', avatar: USER_AVATARS[4], rating: 5, text: "Evento organizzatissimo, musica top e bella gente. Non vedo l'ora del prossimo!", date: "2023-09-15" },
];

// Mock Data: Locales (Restaurants)
export const initialLocaleData: Locale[] = [
    {
        id: 'loc1', name: 'Osteria del Corso', rating: 4.8, reviews: 124, cuisine: 'Italiana', price: '€€', distance: '1.2km',
        address: 'Corso Magenta 12, Milano', phone: '02 123456', website: 'osteriadelcorso.it',
        img: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        coords: { lat: 45.465, lng: 9.178 }, capacity: 30, currentGuests: 12, hashtags: ['tradizionale', 'romantico', 'pasta'],
        menu: [{ dish: 'Spaghetti Carbonara', price: '€14', category: 'Primi' }, { dish: 'Tiramisù', price: '€7', category: 'Dolci' }],
        description: "Un'autentica osteria milanese che serve piatti della tradizione con un tocco moderno. Perfetto per cene intime e pranzi di lavoro.",
        menuPhotos: MENU_PHOTO_PRESETS.slice(0, 2), userReviews: sampleReviews.slice(0, 2),
        openingHours: "Lun-Sab: 12:00-15:00, 19:00-23:00\nDomenica: Chiuso",
        galleryPhotos: [
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
        ],
        joinedUserNames: ['Luca Bianchi', 'Giulia Verdi'],
    },
    {
        id: 'loc2', name: 'The Burger Hub', rating: 4.5, reviews: 250, cuisine: 'Hamburger', price: '€', distance: '2.5km',
        address: 'Via Paolo Sarpi 50, Milano', phone: '02 789012', website: 'theburgerhub.com',
        img: 'https://images.unsplash.com/photo-1512152272829-e3139592d56f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        coords: { lat: 45.481, lng: 9.174 }, capacity: 50, currentGuests: 45, hashtags: ['gourmet', 'veloce', 'birre'],
        menu: [{ dish: 'Classic Cheeseburger', price: '€10', category: 'Hamburger' }, { dish: 'Patatine Fritte', price: '€4', category: 'Contorni' }],
        description: "I migliori hamburger gourmet della città, preparati con ingredienti freschi e di alta qualità. Ampia selezione di birre artigianali.",
        menuPhotos: [MENU_PHOTO_PRESETS[1]], userReviews: [],
        joinedUserNames: ['Marco Neri'],
    },
];

// Mock Data: Events
export const initialEventData: Event[] = [
    {
        id: 'event1', name: 'Aperitivo sui Navigli', date: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(), time: '19:00',
        location: 'Mag Cafè, Ripa di Porta Ticinese, 43, Milano', category: 'Social',
        img: 'https://images.unsplash.com/photo-1542648873-047071d48a86?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        coords: { lat: 45.451, lng: 9.171 }, description: "Unisciti a noi per un aperitivo rilassante lungo i Navigli! Ottimi cocktail, stuzzichini e buona compagnia. L'occasione perfetta per conoscere nuove persone.",
        maxParticipants: 20, currentParticipants: 12, hashtags: ['aperitivo', 'navigli', 'cocktail'], isUserCreated: false,
        userReviews: sampleReviews.slice(2, 3), pastAttendees: [], isCharityEvent: false, donationsReceived: 0, donationGoal: 0,
    },
    {
        id: 'event_charity', name: 'Corsa Benefica al Parco', date: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(), time: '09:30',
        location: 'Parco Sempione, Milano', category: 'Sport', img: CHARITY_EVENT_PRESET_IMG,
        description: "Corriamo insieme per una buona causa! Una corsa non competitiva di 5km per raccogliere fondi. L'intero ricavato sarà devoluto in beneficenza.",
        maxParticipants: 200, currentParticipants: 88, hashtags: ['corsa', 'beneficenza', 'parco'], isUserCreated: false, userReviews: [],
        pastAttendees: [], isCharityEvent: true, donationsReceived: 1250, donationGoal: 3000,
    },
    {
        id: 'event_yoga', name: 'Yoga al Tramonto', date: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(), time: '19:30',
        location: 'Terrazza Triennale, Milano', category: 'Benessere',
        img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1220&q=80',
        description: "Una sessione di Vinyasa Flow con vista panoramica sulla città al calar del sole. Porta il tuo tappetino e la tua energia positiva!",
        maxParticipants: 25, currentParticipants: 25, hashtags: ['yoga', 'relax', 'tramonto'], isUserCreated: true, userReviews: [],
        pastAttendees: ['Sofia Romano', 'Luca Bianchi'], isCharityEvent: false, donationsReceived: 0, donationGoal: 0,
        partecipationFee: "€15,00",
    },
    {
        id: 'event_past1', name: 'Concerto Acustico', date: '2023-10-15', time: '21:00',
        location: 'Arci Bellezza, Milano', category: 'Musica',
        img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
        description: "Serata intima con musica dal vivo.",
        maxParticipants: 50, currentParticipants: 50, hashtags: ['musica', 'live', 'indie'], isUserCreated: false, userReviews: [],
        pastAttendees: ['Mario Rossi'], isCharityEvent: false, donationsReceived: 0, donationGoal: 0,
    },
    {
        id: 'event_past2', name: 'Cineforum all\'aperto', date: '2023-08-20', time: '21:30',
        location: 'Parco Sempione, Milano', category: 'Cultura',
        img: 'https://images.unsplash.com/photo-1620177114340-9a5a7b62309f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        description: "Proiezione di un grande classico sotto le stelle.",
        maxParticipants: 100, currentParticipants: 100, hashtags: ['cinema', 'estate'], isUserCreated: false, userReviews: [],
        pastAttendees: ['Mario Rossi', 'Giulia Verdi'], isCharityEvent: false, donationsReceived: 0, donationGoal: 0,
    },
];

// Mock Data: Stories & Social Cards
export const STORIES_DATA: Story[] = [
    { id: 'story1', image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=870', title: '2x1 Cocktail', type: 'promo' },
    { id: 'story2', image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=1172', title: 'Burger Scontati', type: 'promo' },
    { id: 'story3', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=1064', title: 'Happy Hour!', type: 'promo' },
    { id: 'story4', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1074', title: 'Cena Speciale', type: 'promo' },
    { id: 'story5', image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?q=80&w=987', title: 'Colazione Offerta', type: 'promo' },
];

export const SOCIAL_CARD_DATA: SocialCard[] = [
    {
        itemType: 'social', id: 'social1',
        text: 'Giulia, Luca e altri 2 amici parteciperanno a "Aperitivo sui Navigli". Ti unisci a loro?',
        friendAvatars: [USER_AVATARS[2], USER_AVATARS[1], USER_AVATARS[4], USER_AVATARS[5]],
        relatedEventId: 'event1',
    }
];

// Gamification: Level Logic
export const calculateLevelDetails = (xp: number): LevelDetails => {
  const baseXP = 100;
  const factor = 1.5;
  let level = 1;
  let xpForNextLevel = baseXP;
  let xpForCurrentLevelStart = 0;

  while (xp >= xpForNextLevel) {
    level++;
    xpForCurrentLevelStart = xpForNextLevel;
    xpForNextLevel += Math.floor(baseXP * Math.pow(factor, level - 1));
  }

  const xpIntoCurrentLevel = xp - xpForCurrentLevelStart;
  const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevelStart;
  const progressPercentage = Math.min(100, (xpIntoCurrentLevel / xpNeededForNextLevel) * 100);

  return { level, xp, xpForCurrentLevelStart, xpForNextLevelStart: xpForNextLevel, xpIntoCurrentLevel, xpNeededForNextLevel, progressPercentage };
};

// Gamification: Objectives
export const GAMIFICATION_OBJECTIVES_LIST_CORE: GamificationObjectiveCore[] = [
  { id: 'obj1', title: 'Primo Evento', description: 'Partecipa al tuo primo evento', xpValue: 50, actionType: 'JOIN_EVENT', targetCount: 1, icon: <Ticket size={24} /> },
  { id: 'obj2', title: 'Recensore', description: 'Scrivi la tua prima recensione', xpValue: 25, actionType: 'ADD_REVIEW_LOCALE', targetCount: 1, icon: <MessageSquare size={24} /> },
  { id: 'obj3', title: 'Fotografo di Menu', description: 'Aggiungi una foto a un menu', xpValue: 30, actionType: 'ADD_MENU_PHOTO', targetCount: 1, icon: <Camera size={24} /> },
  { id: 'obj4', title: 'Socialite', description: 'Unisciti a un tavolo', xpValue: 40, actionType: 'JOIN_TABLE', targetCount: 1, icon: <Users size={24} /> },
  { id: 'obj5', title: 'Benefattore', description: 'Fai una donazione a un evento', xpValue: 60, actionType: 'MAKE_DONATION', targetCount: 1, icon: <HandHeart size={24} /> },
  { id: 'obj6', title: 'Pagamento Smart', description: 'Paga con il tuo credito', xpValue: 35, actionType: 'PAY_EVENT_WITH_CREDIT', targetCount: 1, icon: <CreditCard size={24} /> },
  // New long-term and future objectives
  { id: 'obj7', title: 'Partecipante Seriale', description: 'Partecipa a 5 eventi', xpValue: 100, actionType: 'JOIN_EVENT', targetCount: 5, icon: <Repeat size={24} /> },
  { id: 'obj8', title: 'Critico Esperto', description: 'Scrivi 3 recensioni di locali', xpValue: 75, actionType: 'ADD_REVIEW_LOCALE', targetCount: 3, icon: <Pizza size={24} /> },
  { id: 'obj9', title: 'Critico Apprezzato', description: 'Ricevi un "like" su una recensione', xpValue: 20, actionType: 'VOTE_REVIEW_UP', targetCount: 1, icon: <ThumbsUp size={24} /> },
  { id: 'obj10', title: 'Ambasciatore Sociale', description: 'Un amico si unisce a un evento su tuo invito', xpValue: 50, actionType: 'INVITE_FRIEND_ACCEPTED', targetCount: 1, icon: <UserPlus size={24} /> },
];

// Gamification: Badges & Rewards
export const AVAILABLE_BADGES: Badge[] = [
    { id: 'badge1', name: 'Esploratore', icon: Rocket, description: 'Partecipa a 5 eventi', color: 'sky' },
    { id: 'badge2', name: 'Gourmet', icon: Pizza, description: 'Recensisci 3 locali', color: 'amber' },
    { id: 'badge3', name: 'Benefattore', icon: HandHeart, description: 'Fai una donazione a una causa', color: 'pink' },
    { id: 'badge4', name: 'Anima della Festa', icon: VenetianMask, description: 'Crea il tuo primo evento', color: 'purple' },
];

export const INITIAL_REWARDS_DATA: Reward[] = [
    { id: 'rew1', name: 'Sconto 10% Caffè', description: 'Ottieni uno sconto del 10% sulla prossima colazione.', xpCost: 200, icon: Beer, color: 'amber' },
    { id: 'rew2', name: 'Avatar Esclusivo Panda', description: 'Sblocca un avatar a tema panda per il tuo profilo.', xpCost: 500, icon: Gift, color: 'emerald' },
    { id: 'rew3', name: 'Ingresso VIP Evento', description: 'Accesso prioritario al prossimo evento SocialMix.', xpCost: 1000, icon: Star, color: 'rose' },
];

// Interaction: Notifications & Chats
export const initialNotifications: NotificationItem[] = [
    { id: 'notif1', icon: Heart, title: 'Nuovo Locale Preferito!', description: `L'Osteria del Corso è stata aggiunta ai tuoi preferiti.`, timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), isRead: false, link: { tabId: 'favorites' } },
    { id: 'notif2', icon: Ticket, title: 'Promemoria Evento', description: `L'evento "Aperitivo sui Navigli" è domani!`, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), isRead: false, link: { tabId: 'calendar', itemId: 'event1', itemType: 'event' } },
    { id: 'notif3', icon: Users, title: 'Nuovo Tavolo Proposto', description: 'Luca Bianchi ha proposto un tavolo da "The Burger Hub".', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), isRead: true, link: { tabId: 'chat' } },
];

export const initialChatMessages: ChatMessage[] = [
    { id: 'chat1', senderId: 'friend1', senderName: 'Luca Bianchi', avatar: USER_AVATARS[1], lastMessage: 'Ciao! Tutto bene per stasera?', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), unreadCount: 2 },
    { id: 'chat2', senderId: 'group1', senderName: 'Aperitivo sui Navigli Gruppo', avatar: 'https://placehold.co/100x100/f43f5e/ffffff?text=AP', lastMessage: 'Giulia: Non vedo l\'ora!', timestamp: new Date(Date.now() - 1000 * 60 * 55).toISOString(), unreadCount: 5 },
    { id: 'chat3', senderId: 'friend2', senderName: 'Giulia Verdi', avatar: USER_AVATARS[2], lastMessage: 'Sì, confermo! A dopo!', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), unreadCount: 0, isTyping: true },
];