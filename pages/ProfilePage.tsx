import React, { useState } from 'react';
import {
  ChevronRight, Gift, Target, CalendarCheck, Lock, Settings, Sun, Moon, PlusCircle, TrendingUp
} from 'lucide-react';
import { useUserStore, useUIStore, useDataStore } from '../stores';
import { AVAILABLE_BADGES, INITIAL_REWARDS_DATA } from '../constants';
import { GamificationObjective, Badge as BadgeType, Reward as RewardType } from '../types';
import { CheckCircle } from 'lucide-react';
import ImageWithFallback from '../components/ImageWithFallback';
import { AwardIcon, ShieldIcon, HelpIcon, LogoutIcon } from '../components/icons/secondary';

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
  const { openModal, showToast, theme, toggleTheme } = useUIStore();

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
      
      <div className="relative flex flex-col items-center p-5 bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-lg mb-5">
        <button onClick={handleAvatarChange} className="relative group">
          <img src={avatar} alt="User Avatar" className="w-24 h-24 rounded-full border-4 border-orange-400 object-cover shadow-md transition-transform group-hover:scale-105" />
          <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity text-xs font-semibold">
            Cambia
          </div>
        </button>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-3">Mario Rossi</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Livello {levelDetails.level}</p>

        <div className="w-full mt-4">
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>{levelDetails.xpIntoCurrentLevel} XP</span>
            <span>{levelDetails.xpForNextLevelStart} XP per Liv. {levelDetails.level + 1}</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 h-2.5 rounded-full" style={{ width: `${levelDetails.progressPercentage}%` }}></div>
          </div>
        </div>
      </div>

      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg border border-slate-200/50 dark:border-slate-700/50 p-4 rounded-2xl shadow-lg mb-5">
        <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-3">Credito SocialMix</h3>
        <div className="flex items-center justify-between">
          <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">€{credit.toFixed(2)}</p>
          <div className="flex gap-2">
            <button onClick={() => openModal('isAddCreditOpen', true)} className="p-2.5 bg-emerald-100 dark:bg-emerald-800/60 text-emerald-600 dark:text-emerald-300 rounded-lg transition-all duration-200 ease-out shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 active:shadow-sm" aria-label="Aggiungi Credito"><PlusCircle size={20} /></button>
            <button onClick={() => openModal('isWithdrawCreditOpen', true)} className="p-2.5 bg-orange-100 dark:bg-orange-800/60 text-orange-600 dark:text-orange-300 rounded-lg transition-all duration-200 ease-out shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 active:shadow-sm" aria-label="Ritira Credito"><TrendingUp size={20} /></button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl">
          <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors" onClick={() => setIsBadgesOpen(!isBadgesOpen)} aria-expanded={isBadgesOpen}>
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><AwardIcon size={16}/> I Tuoi Badge</h3>
            <ChevronRight size={20} className={`text-slate-400 transition-transform duration-300 ${isBadgesOpen ? 'rotate-90' : ''}`} />
          </div>
          {isBadgesOpen && (
            <div className="animate-slide-down">
                <div className="p-4 bg-slate-50/80 dark:bg-slate-900/50">
                    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                        {AVAILABLE_BADGES.map((badge: BadgeType) => {
                            const Icon = badge.icon;
                            const isUnlocked = unlockedBadges.has(badge.id);
                            return (
                                <div key={badge.id} className="flex flex-col items-center flex-shrink-0 w-20 text-center" title={isUnlocked ? badge.name : `Sblocca: ${badge.description}`}>
                                    <div className={`relative w-14 h-14 rounded-full flex items-center justify-center ${isUnlocked ? `bg-${badge.color}-100 dark:bg-${badge.color}-500/20 shadow-md` : 'bg-slate-200 dark:bg-slate-700'}`}>
                                      <Icon size={32} className={`${isUnlocked ? `text-${badge.color}-500 dark:text-${badge.color}-400` : 'text-slate-400'}`} />
                                       {!isUnlocked && (
                                        <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center">
                                          <Lock size={20} className="text-white/80" />
                                        </div>
                                      )}
                                    </div>
                                    <p className={`text-xs mt-2 truncate w-full font-medium ${isUnlocked ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400'}`}>{badge.name}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
          )}
        </div>
        
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl">
          <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors" onClick={() => setIsObjectivesOpen(!isObjectivesOpen)} aria-expanded={isObjectivesOpen}>
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Target size={16}/> Obiettivi</h3>
            <ChevronRight size={20} className={`text-slate-400 transition-transform duration-300 ${isObjectivesOpen ? 'rotate-90' : ''}`} />
          </div>
          {isObjectivesOpen && (
            <div className="animate-slide-down">
              <div className="p-4 bg-slate-50/80 dark:bg-slate-900/50 space-y-3">
                  {objectives.map((obj: GamificationObjective) => (
                      <div key={obj.id} className={`flex items-center p-3 rounded-lg border shadow-sm ${obj.isCompleted ? 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
                          <div className={`mr-3 ${obj.isCompleted ? 'text-green-500' : 'text-slate-500 dark:text-slate-400'}`}>{obj.isCompleted ? <CheckCircle size={24} /> : obj.icon}</div>
                          <div className="flex-1">
                              <p className={`text-sm font-semibold ${obj.isCompleted ? 'text-green-800 dark:text-green-300' : 'text-slate-800 dark:text-slate-200'}`}>{obj.title}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">{obj.description}</p>
                              {!obj.isCompleted && obj.currentProgress !== undefined && obj.targetCount > 1 && (
                                <div className="mt-1.5 flex items-center gap-2">
                                  <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-1.5">
                                      <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${(obj.currentProgress / obj.targetCount) * 100}%` }}></div>
                                  </div>
                                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{obj.currentProgress}/{obj.targetCount}</span>
                                </div>
                              )}
                          </div>
                          {!obj.isCompleted && obj.targetCount === 1 && <span className="text-xs font-bold text-amber-600 dark:text-amber-400">+{obj.xpValue} XP</span>}
                      </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl">
          <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors" onClick={() => setIsRewardsOpen(!isRewardsOpen)} aria-expanded={isRewardsOpen}>
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Gift size={16}/> Premi Disponibili</h3>
            <ChevronRight size={20} className={`text-slate-400 transition-transform duration-300 ${isRewardsOpen ? 'rotate-90' : ''}`} />
          </div>
          {isRewardsOpen && (
             <div className="animate-slide-down">
              <div className="p-4 bg-slate-50/80 dark:bg-slate-900/50 space-y-3">
                  {INITIAL_REWARDS_DATA.map((reward: RewardType) => {
                      const Icon = reward.icon;
                      const canAfford = levelDetails.xp >= reward.xpCost;
                      const isClaimed = claimedRewards.has(reward.id);
                      return (
                          <div key={reward.id} className={`flex items-center gap-3 p-3 rounded-lg ${isClaimed ? 'bg-slate-200 dark:bg-slate-700 opacity-70' : 'bg-white dark:bg-slate-800 border dark:border-slate-700 shadow-sm'}`}>
                              <div className={`w-10 h-10 flex-shrink-0 rounded-lg flex items-center justify-center bg-${reward.color}-100 dark:bg-${reward.color}-500/20`}>
                                <Icon size={24} className={`text-${reward.color}-500 dark:text-${reward.color}-400`} />
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{reward.name}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{reward.xpCost} XP</p>
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
            </div>
          )}
        </div>

        {pastEvents.length > 0 && (
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl">
                <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors" onClick={() => setIsPastEventsOpen(!isPastEventsOpen)} aria-expanded={isPastEventsOpen}>
                    <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><CalendarCheck size={16}/> Eventi Passati</h3>
                    <ChevronRight size={20} className={`text-slate-400 transition-transform duration-300 ${isPastEventsOpen ? 'rotate-90' : ''}`} />
                </div>
                {isPastEventsOpen && (
                    <div className="animate-slide-down">
                      <div className="p-4 bg-slate-50/80 dark:bg-slate-900/50 space-y-3">
                        {pastEvents.map((event, index) => (
                            <div 
                                key={event.id}
                                onClick={() => {
                                    const pastEventIds = pastEvents.map(e => `event_${e.id}`);
                                    openModal('modalView', { list: pastEventIds, index });
                                }}
                                className="flex items-center gap-3 p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-all hover:shadow-md hover:-translate-y-px"
                            >
                                <ImageWithFallback 
                                    src={event.img} 
                                    alt={event.name}
                                    containerClassName="w-12 h-12 rounded-md flex-shrink-0"
                                    imgClassName="w-full h-full object-cover rounded-md"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate">{event.name}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(event.date).toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>
                            </div>
                        ))}
                      </div>
                    </div>
                )}
            </div>
        )}
      </div>
      
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-lg p-4 mt-5">
        <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-3"><Settings size={16}/> Impostazioni</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {theme === 'light' ? <Sun className="text-amber-500" /> : <Moon className="text-sky-400" />}
            <span className="font-medium text-slate-700 dark:text-slate-200">Modalità Scura</span>
          </div>
          <button onClick={toggleTheme} className={`relative inline-flex items-center h-7 rounded-full w-12 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 dark:focus:ring-offset-slate-800 border border-slate-300 dark:border-slate-600 ${theme === 'dark' ? 'bg-orange-500' : 'bg-slate-200 dark:bg-slate-700'}`}>
            <span className={`inline-block w-5 h-5 transform bg-white rounded-full transition-transform shadow-md ring-1 ring-black/5 ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      <div className="space-y-2 mt-5">
        <button onClick={() => openModal('isAmbassadorModalOpen', true)} className="profile-action-button">
          <AwardIcon size={28} /> <span>Diventa Ambassador</span> <ChevronRight className="chevron" />
        </button>
        <button onClick={() => openModal('isSubscriptionModalOpen', true)} className="profile-action-button">
          <ShieldIcon size={28} /> <span>SocialMix Premium</span> <ChevronRight className="chevron" />
        </button>
        <button onClick={() => openModal('isSupportModalOpen', true)} className="profile-action-button">
          <HelpIcon size={28} /> <span>Centro Assistenza</span> <ChevronRight className="chevron" />
        </button>
        <button onClick={() => openModal('isLogoutModalOpen', true)} className="profile-action-button">
          <LogoutIcon size={28} /> <span>Logout</span> <ChevronRight className="chevron" />
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;