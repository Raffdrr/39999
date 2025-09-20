import React, { useState, useEffect, useRef } from 'react';
import { Edit, PiggyBank, PlusSquare, Banknote, Ticket, Clock, Star, Target, BadgePercent, ShoppingBag, Settings, Award, Shield, UsersRound, HelpCircle, LogOut, ChevronUp, ChevronDown, CheckCircle, CreditCard, UtensilsCrossed, ChevronRight, Sparkles, PlusCircle } from 'lucide-react';
import { useUserStore, useDataStore, useUIStore } from '../stores';
import { USER_BADGES, INITIAL_REWARDS_DATA } from '../../constants';
import { GamificationObjective } from '../types';
import ImageWithFallback from '../components/ImageWithFallback';

const ObjectiveRow: React.FC<{ objective: GamificationObjective }> = ({ objective }) => {
  const [isJustCompleted, setIsJustCompleted] = useState(false);
  const prevIsCompleted = useRef(objective.isCompleted);

  useEffect(() => {
    if (objective.isCompleted && !prevIsCompleted.current) {
      setIsJustCompleted(true);
      const timer = setTimeout(() => setIsJustCompleted(false), 2000); // Animation duration (2s)
      prevIsCompleted.current = objective.isCompleted;
      return () => clearTimeout(timer);
    }
  }, [objective.isCompleted]);
  
  const isCompleted = objective.isCompleted;

  return (
    <div className={`flex items-center gap-3 p-2.5 rounded-lg transition-all duration-500 ${isJustCompleted ? 'animate-objective-complete' : ''} ${isCompleted ? 'bg-slate-50' : 'bg-white shadow-sm border'}`}>
      <div className={`p-2 rounded-full transition-colors duration-500 ${isCompleted ? 'bg-slate-200' : 'bg-green-100'}`}>
        {isCompleted ? <CheckCircle size={20} className="text-slate-400" /> : objective.icon}
      </div>
      <div className={`flex-1 transition-opacity duration-500 ${isCompleted ? 'opacity-60' : 'opacity-100'}`}>
        <p className={`font-semibold text-sm ${isCompleted ? 'text-slate-600 line-through' : 'text-slate-800'}`}>
          {objective.title}
        </p>
        <p className={`text-xs ${isCompleted ? 'text-slate-500 line-through' : 'text-slate-500'}`}>
          {objective.description}
        </p>
      </div>
      {!isCompleted && (
        <span className="font-bold text-sm text-green-600">+{objective.xpValue} XP</span>
      )}
    </div>
  );
};


const ProfilePage: React.FC = () => {
    const { xp, levelDetails, credit, joinedEvents, joinedTables, objectives, claimedRewards, avatar, isPremium, claimReward } = useUserStore();
    const { events, locales } = useDataStore();
    const { openModal, showToast } = useUIStore();
    
    const [showPastJoinedEvents, setShowPastJoinedEvents] = useState(false);
    const [showActiveObjectives, setShowActiveObjectives] = useState(true);
    const [showUserBadgesSection, setShowUserBadgesSection] = useState(false);
    const [showRewardsSection, setShowRewardsSection] = useState(false); 
    const [levelUp, setLevelUp] = useState(false);
    const prevLevel = useRef(levelDetails.level);

    useEffect(() => {
        if (levelDetails.level > prevLevel.current) {
            setLevelUp(true);
            const timer = setTimeout(() => setLevelUp(false), 2000);
            prevLevel.current = levelDetails.level;
            return () => clearTimeout(timer);
        }
    }, [levelDetails.level]);


    const joinedUpcomingEvents = events.filter(e => joinedEvents.has(e.id) && new Date(e.date) >= new Date()).sort((a,b) => new Date(a.date).valueOf() - new Date(b.date).valueOf());
    const pastJoinedEvents = events.filter(e => joinedEvents.has(e.id) && new Date(e.date) < new Date()).sort((a,b) => new Date(b.date).valueOf() - new Date(a.date).valueOf());
    const activeJoinedTables = locales.filter(l => joinedTables.has(l.id));

    return (
        <div className="animate-page-content-enter flex-1 overflow-y-auto space-y-5 sm:space-y-6 pb-24">
             <div className="bg-gradient-to-br from-slate-700 via-slate-800 to-gray-900 p-5 sm:p-6 rounded-b-3xl shadow-xl text-white">
                <div className="flex items-center gap-4">
                    <img src={avatar} alt="User Avatar" className="w-20 h-20 rounded-full border-3 border-white/50"/>
                    <div>
                        <h2 className="text-2xl font-bold">Mario Rossi {isPremium && <Sparkles size={18} className="inline fill-yellow-300 text-yellow-400 ml-1" />}</h2>
                        <p className="text-sm text-slate-300">mario.rossi@example.com</p>
                    </div>
                </div>
                <div className="mt-5">
                    <div className="flex justify-between items-center mb-1">
                        <h3 className="text-sm font-semibold text-slate-200">Livello & Progresso</h3>
                        <span className={`text-sm font-bold text-amber-400 ${levelUp ? 'animate-level-up' : ''}`}>Liv. {levelDetails.level}</span>
                    </div>
                    <div className="w-full bg-slate-600/70 rounded-full h-3.5">
                        <div className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${levelDetails.progressPercentage}%` }}></div>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 text-right">{levelDetails.xpNeededForNextLevel - levelDetails.xpIntoCurrentLevel} XP al Liv. {levelDetails.level + 1}</p>
                </div>
            </div>

            <div className="bg-white shadow-lg rounded-xl p-4 mx-1">
                <h3 className="font-semibold text-slate-700 mb-2 flex items-center gap-1.5"><PiggyBank size={20} className="text-sky-500"/>Il Mio Credito</h3>
                <div className="flex items-center justify-between mb-2.5">
                    <p className="text-4xl font-bold text-sky-600">€{credit.toFixed(2)}</p>
                    <div className="flex gap-2.5">
                        <button onClick={() => openModal('isAddCreditModal', true)} className="p-2.5 rounded-full bg-sky-100"><PlusSquare size={20}/></button>
                        <button onClick={() => openModal('isWithdrawModal', true)} className="p-2.5 rounded-full bg-sky-100"><Banknote size={20}/></button>
                    </div>
                </div>
            </div>

            {activeJoinedTables.length > 0 && (
                <div className="bg-white shadow-lg rounded-xl p-4 mx-1">
                    <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-1.5"><UtensilsCrossed size={20} className="text-amber-500" />Tavoli a cui sei Unito</h3>
                    {activeJoinedTables.map(locale => (
                        <div key={locale.id} onClick={() => openModal('selectedLocale', locale.id)} className="mb-3 p-2.5 bg-slate-50 rounded-lg border flex items-center gap-3 cursor-pointer">
                            <ImageWithFallback src={locale.img} alt={locale.name} imgClassName="h-16 w-16 rounded-md object-cover" containerClassName="h-16 w-16 rounded-md" />
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-slate-800 truncate">{locale.name}</p>
                                <p className="text-xs text-slate-500">{locale.currentGuests}/{locale.capacity} persone</p>
                            </div>
                            <ChevronRight size={20} className="text-slate-400" />
                        </div>
                    ))}
                </div>
            )}

            {joinedUpcomingEvents.length > 0 && (
                <div className="bg-white shadow-lg rounded-xl p-4 mx-1">
                     <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-1.5"><Ticket size={20} className="text-rose-500"/>Prossimi Eventi</h3>
                     {joinedUpcomingEvents.map(event => (
                         <div key={event.id} onClick={() => openModal('selectedEvent', event.id)} className="mb-3 p-2.5 bg-slate-50 rounded-lg border flex items-center gap-3 cursor-pointer">
                           <ImageWithFallback src={event.img} alt={event.name} imgClassName="h-16 w-16 rounded-md object-cover" containerClassName="h-16 w-16 rounded-md" />
                           <div className="flex-1 min-w-0">
                               <p className="font-semibold text-slate-800 truncate">{event.name}</p>
                               <p className="text-xs text-slate-500">{new Date(event.date).toLocaleDateString()}</p>
                           </div>
                           <ChevronRight size={20} className="text-slate-400" />
                        </div>
                     ))}
                </div>
            )}
            
            <div className="bg-white shadow-lg rounded-xl mx-1 overflow-hidden">
                <button onClick={() => setShowPastJoinedEvents(!showPastJoinedEvents)} className="w-full flex justify-between items-center p-4 text-left">
                    <h3 className="font-semibold text-slate-700 flex items-center gap-1.5"><Clock size={20} className="text-indigo-500"/>Eventi Passati</h3>
                    <ChevronDown size={20} className={`transition-transform ${showPastJoinedEvents ? 'rotate-180' : ''}`} />
                </button>
                {showPastJoinedEvents && <div className="p-4 border-t animate-slide-down"><p>Lista eventi passati...</p></div>}
            </div>
            
            <div className="bg-white shadow-lg rounded-xl mx-1 overflow-hidden">
                <button onClick={() => setShowActiveObjectives(!showActiveObjectives)} className="w-full flex justify-between items-center p-4 text-left">
                    <h3 className="font-semibold text-slate-700 flex items-center gap-1.5"><Target size={20} className="text-green-500"/>Obiettivi</h3>
                    <ChevronDown size={20} className={`transition-transform ${showActiveObjectives ? 'rotate-180' : ''}`} />
                </button>
                {showActiveObjectives && (
                    <div className="p-4 border-t animate-slide-down space-y-2.5">
                        {objectives.length > 0 ? (
                           objectives
                             .sort((a, b) => (a.isCompleted ? 1 : -1) - (b.isCompleted ? 1 : -1))
                             .map(obj => <ObjectiveRow key={obj.id} objective={obj} />)
                        ) : (
                            <p className="text-sm text-center text-slate-500 py-2">Nessun obiettivo disponibile.</p>
                        )}
                    </div>
                )}
            </div>
            
            <div className="bg-white shadow-lg rounded-xl mx-1 overflow-hidden">
                <button onClick={() => setShowUserBadgesSection(!showUserBadgesSection)} className="w-full flex justify-between items-center p-4 text-left">
                    <h3 className="font-semibold text-slate-700 flex items-center gap-1.5"><BadgePercent size={20} className="text-blue-500"/>I Tuoi Badge</h3>
                    <ChevronDown size={20} className={`transition-transform ${showUserBadgesSection ? 'rotate-180' : ''}`} />
                </button>
                {showUserBadgesSection && <div className="p-4 border-t animate-slide-down"><p>Lista badge...</p></div>}
            </div>

            <div className="bg-white shadow-lg rounded-xl mx-1 overflow-hidden">
                <button onClick={() => setShowRewardsSection(!showRewardsSection)} className="w-full flex justify-between items-center p-4 text-left">
                    <h3 className="font-semibold text-slate-700 flex items-center gap-1.5"><ShoppingBag size={20} className="text-rose-500"/>Premi (XP: {xp})</h3>
                    <ChevronDown size={20} className={`transition-transform ${showRewardsSection ? 'rotate-180' : ''}`} />
                </button>
                {showRewardsSection && <div className="p-4 border-t animate-slide-down"><p>Lista premi...</p></div>}
            </div>

            <div className="bg-white shadow-lg rounded-xl p-4 mx-1">
                <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-1.5"><Settings size={20}/>Impostazioni</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <button onClick={() => openModal('isAmbassadorModal', true)} className="p-3 rounded-lg border bg-amber-50 text-amber-700">Diventa Ambassador</button>
                    <button onClick={() => openModal('isSubscriptionModal', true)} className="p-3 rounded-lg border bg-purple-50 text-purple-700">Abbonamento</button>
                    <button onClick={() => showToast("Invita Amici (Demo)", "info")} className="p-3 rounded-lg border bg-indigo-50 text-indigo-700">Invita Amici</button>
                    <button onClick={() => showToast("Supporto (Demo)", "info")} className="p-3 rounded-lg border bg-green-50 text-green-700">Supporto</button>
                    <button onClick={() => showToast("Logout (Demo)", "info")} className="p-3 rounded-lg border bg-red-50 text-red-700 col-span-2">Esci</button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;