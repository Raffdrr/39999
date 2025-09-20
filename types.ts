
import React from 'react';
import type { LucideIcon, LucideProps } from 'lucide-react';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface MenuItem {
  dish: string;
  price: string;
  category: string;
}

export interface UserReview {
  userId: string;
  name:string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
}

export interface BillDetails {
  totalAmount: number;
  creditContributed: number;
  status: 'awaiting_credit_application' | 'ready_to_finalize' | 'paid_with_credit';
}

export interface Locale { // Ristorante -> Locale
  id: string;
  name: string;
  rating: number;
  reviews: number;
  cuisine: string; // Mantenuto come 'cuisine' per tipo di cibo/offerta del locale
  price: string;
  distance: string;
  address: string;
  phone: string;
  website: string;
  img: string;
  coords: Coordinates;
  capacity: number;
  currentGuests: number;
  hashtags: string[];
  menu: MenuItem[];
  description: string;
  menuPhotos: string[];
  userReviews: UserReview[];
  joinedUserNames?: string[];
  billDetails?: BillDetails; // Added for pay at table feature
  openingHours?: string; // Added for locale detail tab
  galleryPhotos?: string[]; // Added for locale detail tab
}

export interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  category: string;
  img: string;
  coords?: Coordinates;
  description:string;
  maxParticipants: number;
  currentParticipants: number;
  hashtags: string[];
  isUserCreated: boolean;
  userReviews: UserReview[];
  pastAttendees: string[];
  isCharityEvent: boolean;
  donationsReceived: number;
  donationGoal: number;
  partecipationFee?: string;
  localeId?: string; // restaurantId -> localeId
  invitedFriends?: string[];
  paidWithCredit?: boolean; 
  // New fields for dynamic event detail screen
  isPublicVenue?: boolean; // True if the event takes place in a public venue/locale
  organizerName?: string; // Name of the organizer if not the current user
  whatToBring?: string;
  houseRules?: string;
  generalInfo?: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: React.ReactElement<LucideProps>; // Changed from React.ReactElement
  description: string;
  color: string;
}

export type GamificationActionType = 
  | 'CREATE_EVENT' 
  | 'ADD_REVIEW' 
  | 'ADD_MENU_PHOTO' 
  | 'JOIN_EVENT' 
  | 'ADD_REVIEW_LOCALE' // ADD_REVIEW_RESTAURANT -> ADD_REVIEW_LOCALE
  | 'MAKE_DONATION'
  | 'PAY_EVENT_WITH_CREDIT'
  | 'JOIN_TABLE'
  | 'CLAIM_REWARD'
  | 'PAY_LOCALE_BILL_WITH_CREDIT'; // Added for pay at table

export interface GamificationObjectiveCore {
  id: string;
  title: string;
  description: string;
  xpValue: number;
  actionType: GamificationActionType;
  targetCount: number;
  icon: React.ReactElement;
}
export interface GamificationObjective extends GamificationObjectiveCore {
  isCompleted: boolean;
  currentProgress?: number;
}


export interface FriendData {
  id: string;
  name: string;
  distance: string;
  avatar: string;
}

export interface NavTabType {
  id: string;
  label: string;
  icon: LucideIcon; // Changed from React.ElementType to LucideIcon
}

export interface ToastMessage {
  text: string;
  type: "success" | "error" | "info";
  icon?: React.ReactNode;
}

export interface ReviewModalData {
  type: 'locale' | 'event'; // 'restaurant' -> 'locale'
  item: Locale | Event;     // Restaurant -> Locale
}

export interface LevelDetails {
  level: number;
  xp: number;
  xpForCurrentLevelStart: number;
  xpForNextLevelStart: number;
  xpIntoCurrentLevel: number;
  xpNeededForNextLevel: number;
  progressPercentage: number;
}

export type TabId = "home" | "calendar" | "chat" | "favorites" | "profile";
export type DisplayCategory = "all" | "locali" | "events"; // "restaurants" -> "locali"

export interface FavoriteItem extends Partial<Locale>, Partial<Event> { // Restaurant -> Locale
  itemType: 'locale' | 'event'; // 'restaurant' -> 'locale'
  id: string; 
  name: string; 
  img: string; 
}

export interface PaymentCodeModalData {
  itemName: string;
  itemType: 'locale' | 'event'; // 'restaurant' -> 'locale'
  details?: string; 
  amount?: string; 
  qrCodeUrl: string;
  paymentCode: string;
}

export interface PayWithCreditAmountModalData {
  itemType: 'locale' | 'event';
  itemId: string;
  itemName: string;
  maxAmount?: number; // For event: event fee. For locale bill: total bill amount.
  isEventFee?: boolean; // True for event fees, false for locale bill contributions.
  currentContribution?: number; // For locale bill: credit already applied to this bill.
}

export interface NotificationItem {
  id: string;
  icon: LucideIcon; // Changed from React.ElementType to LucideIcon
  iconColor?: string;
  title: string;
  description: string;
  timestamp: string; 
  isRead: boolean;
  link?: { tabId: TabId; itemId?: string; itemType?: 'locale' | 'event' }; // 'restaurant' -> 'locale'
}

export interface ChatMessage {
  id: string;
  senderId: string; 
  senderName: string;
  avatar: string;
  lastMessage: string;
  timestamp: string; 
  unreadCount: number;
  isTyping?: boolean;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  xpCost: number;
  icon: React.ReactElement;
  color: string;
}