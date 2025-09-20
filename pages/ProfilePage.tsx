import React, { useState } from 'react';
import {
  Award, ChevronRight, Gift, HelpCircle,
  LogOut, PlusCircle, Shield, Target, TrendingUp, CalendarCheck, Lock
} from 'lucide-react';
import { useUserStore, useUIStore, useDataStore } from '../stores';
// FIX: Imported INITIAL_REWARDS_DATA to resolve reference error.
import { AVAILABLE_BADGES, INITIAL_REWARDS_DATA } from '../constants';
import { GamificationObjective, Badge as BadgeType, Reward as RewardType } from '../types';
import { CheckCircle } from 'lucide-react';
import ImageWithFallback from '../components/ImageWithFallback';

const ProfilePage: React.FC = () => {
  const {
    levelDetails,
    credit,
    avatar,
    objectives,
    claimedRewards,
    unlockedBadges,
    setAvatar,
    joinedEvents
  } = useUserStore();
  const { events } = useDataStore();
  const { openModal, showToast } = useUIStore();

  const [isBadgesOpen, setIsBadgesOpen] = useState(false);
  const [isObjectivesOpen, setIsObjectivesOpen] = useState(false);
  const [isRewardsOpen, setIsRewardsOpen] = useState(false);
  const [isPastEventsOpen, setIsPastEventsOpen] = useState(false);

  const handleAvatarChange = () => {
    const newAvatar = avatar.includes('men/32.jpg') ? 'https://randomuser.me/api/portraits/women/48.jpg' : 'https://randomuser.me/api/portraits/men/32.jpg';
    setAvatar(newAvatar);
    showToast("Avatar aggiornato!", "success");
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const pastEvents = events
    .filter(event => {
        const eventDate = new Date(event.date);
        return joinedEvents.has(event.id) && eventDate < today;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());


  return (
    <div className="animate-page-content-enter flex flex-col flex-1 h-full overflow-y-auto no-scrollbar pb-8">
      
      {/* User Info Header */}
      <div className="relative flex flex-col items-center p-5 bg-white rounded-2xl shadow-lg mb-5">
        <button onClick={handleAvatarChange} className="relative group">
          <img src={avatar} alt="User Avatar" className="w-24 h-24 rounded-full border-4 border-rose-400 object-cover shadow-md transition-transform group-hover:scale-105" />
          <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity text-xs font-semibold">
            Cambia
          </div>
        </button>
        <h2 className="text-xl font-bold text-slate-800 mt-3">Mario Rossi</h2>
        <p className="text-sm text-slate-500">Livello {levelDetails.level}</p>

        {/* XP Progress Bar */}
        <div className="w-full mt-4">
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>{levelDetails.xpIntoCurrentLevel} XP</span>
            <span>{levelDetails.xpForNextLevelStart} XP per Liv. {levelDetails.level + 1}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5">
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 h-2.5 rounded-full" style={{ width: `${levelDetails.progressPercentage}%` }}></div>
          </div>
        </div>
      </div>

      {/* Credit Section */}
      <div className="bg-white p-4 rounded-2xl shadow-lg mb-5">
        <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-3">Credito SocialMix</h3>
        <div className="flex items-center justify-between">
          <p className="text-3xl font-bold text-emerald-600">€{credit.toFixed(2)}</p>
          <div className="flex gap-2">
            <button onClick={() => openModal('isAddCreditOpen', true)} className="p-2.5 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors" aria-label="Aggiungi Credito"><PlusCircle size={20} /></button>
            <button onClick={() => openModal('isWithdrawCreditOpen', true)} className="p-2.5 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors" aria-label="Ritira Credito"><TrendingUp size={20} /></button>
          </div>
        </div>
      </div>

      {/* Accordion Sections */}
      <div className="space-y-4">
        {/* Badges Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => setIsBadgesOpen(!isBadgesOpen)}>
            <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1.5"><Award size={16}/> I Tuoi Badge</h3>
            <ChevronRight size={20} className={`text-slate-400 transition-transform duration-300 ${isBadgesOpen ? 'rotate-90' : ''}`} />
          </div>
          {isBadgesOpen && (
            <div className="px-4 pb-4 animate-slide-down">
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                {AVAILABLE_BADGES.map((badge: BadgeType) => {
                    const Icon = badge.icon;
                    const isUnlocked = unlockedBadges.has(badge.id);
                    return (
                        <div key={badge.id} className="flex flex-col items-center flex-shrink-0 w-20 text-center" title={isUnlocked ? badge.name : `Sblocca: ${badge.description}`}>
                            <div className={`relative w-14 h-14 rounded-full flex items-center justify-center ${isUnlocked ? `bg-${badge.color}-100` : 'bg-slate-200'}`}>
                              <Icon size={32} className={`${isUnlocked ? `text-${badge.color}-500` : 'text-slate-400'}`} />
                               {!isUnlocked && (
                                <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center">
                                  <Lock size={20} className="text-white/80" />
                                </div>
                              )}
                            </div>
                            <p className={`text-xs mt-2 truncate w-full font-medium ${isUnlocked ? 'text-slate-600' : 'text-slate-400'}`}>{badge.name}</p>
                        </div>
                    )
                })}
              </div>
            </div>
          )}
        </div>
        
        {/* Objectives Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => setIsObjectivesOpen(!isObjectivesOpen)}>
            <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1.5"><Target size={16}/> Obiettivi</h3>
            <ChevronRight size={20} className={`text-slate-400 transition-transform duration-300 ${isObjectivesOpen ? 'rotate-90' : ''}`} />
          </div>
          {isObjectivesOpen && (
            <div className="px-4 pb-4 animate-slide-down space-y-3">
              {objectives.slice(0, 3).map((obj: GamificationObjective) => (
                  <div key={obj.id} className={`flex items-center p-3 rounded-lg ${obj.isCompleted ? 'bg-green-50' : 'bg-slate-100'}`}>
                      <div className={`mr-3 ${obj.isCompleted ? 'text-green-500' : ''}`}>{obj.isCompleted ? <CheckCircle size={24} /> : obj.icon}</div>
                      <div className="flex-1">
                          <p className={`text-sm font-semibold ${obj.isCompleted ? 'text-green-800' : 'text-slate-800'}`}>{obj.title}</p>
                          <p className="text-xs text-slate-500">{obj.description}</p>
                      </div>
                      {!obj.isCompleted && <span className="text-xs font-bold text-amber-600">+{obj.xpValue} XP</span>}
                  </div>
              ))}
            </div>
          )}
        </div>

        {/* Rewards Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => setIsRewardsOpen(!isRewardsOpen)}>
            <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1.5"><Gift size={16}/> Premi Disponibili</h3>
            <ChevronRight size={20} className={`text-slate-400 transition-transform duration-300 ${isRewardsOpen ? 'rotate-90' : ''}`} />
          </div>
          {isRewardsOpen && (
            <div className="px-4 pb-4 animate-slide-down space-y-3">
              {INITIAL_REWARDS_DATA.map((reward: RewardType) => {
                  const Icon = reward.icon;
                  const canAfford = levelDetails.xp >= reward.xpCost;
                  const isClaimed = claimedRewards.has(reward.id);
                  return (
                      <div key={reward.id} className={`flex items-center gap-3 p-3 rounded-lg ${isClaimed ? 'bg-slate-200' : 'bg-white border'}`}>
                          <div className={`w-10 h-10 flex-shrink-0 rounded-lg flex items-center justify-center bg-${reward.color}-100`}>
                            <Icon size={24} className={`text-${reward.color}-500`} />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-sm text-slate-800">{reward.name}</p>
                            <p className="text-xs text-slate-500">{reward.xpCost} XP</p>
                          </div>
                          <button 
                              disabled={!canAfford || isClaimed}
                              onClick={() => showToast("Funzionalità Premi in arrivo!", "info")}
                              className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-colors
                              ${isClaimed ? 'bg-slate-400 text-white cursor-not-allowed' :
                              canAfford ? `bg-${reward.color}-500 text-white hover:bg-${reward.color}-600` :
                              'bg-slate-300 text-slate-500 cursor-not-allowed'}`}
                          >
                              {isClaimed ? 'Riscattato' : 'Riscatta'}
                          </button>
                      </div>
                  );
              })}
            </div>
          )}
        </div>

        {/* Past Events Section */}
        {pastEvents.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => setIsPastEventsOpen(!isPastEventsOpen)}>
                    <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1.5"><CalendarCheck size={16}/> Eventi Passati</h3>
                    <ChevronRight size={20} className={`text-slate-400 transition-transform duration-300 ${isPastEventsOpen ? 'rotate-90' : ''}`} />
                </div>
                {isPastEventsOpen && (
                    <div className="px-4 pb-4 animate-slide-down space-y-3">
                        {pastEvents.map(event => (
                            <div 
                                key={event.id}
                                onClick={() => openModal('selectedEvent', event.id)}
                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                            >
                                <ImageWithFallback 
                                    src={event.img} 
                                    alt={event.name}
                                    containerClassName="w-12 h-12 rounded-md flex-shrink-0"
                                    imgClassName="w-full h-full object-cover rounded-md"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm text-slate-800 truncate">{event.name}</p>
                                    <p className="text-xs text-slate-500">{new Date(event.date).toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}
      </div>

      {/* Action Links */}
      <div className="space-y-2 mt-5">
        <button onClick={() => openModal('isAmbassadorModalOpen', true)} className="profile-action-button">
          <Award className="text-amber-500" /> <span>Diventa Ambassador</span> <ChevronRight className="ml-auto text-slate-400" />
        </button>
        <button onClick={() => openModal('isSubscriptionModalOpen', true)} className="profile-action-button">
          <Shield className="text-purple-500" /> <span>SocialMix Premium</span> <ChevronRight className="ml-auto text-slate-400" />
        </button>
        <button onClick={() => openModal('isSupportModalOpen', true)} className="profile-action-button">
          <HelpCircle className="text-sky-500" /> <span>Centro Assistenza</span> <ChevronRight className="ml-auto text-slate-400" />
        </button>
        <button onClick={() => openModal('isLogoutModalOpen', true)} className="profile-action-button">
          <LogOut className="text-red-500" /> <span>Logout</span> <ChevronRight className="ml-auto text-slate-400" />
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
