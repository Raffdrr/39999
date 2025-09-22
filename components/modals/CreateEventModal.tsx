import React, { useState, useEffect } from 'react';
import {
  ChevronLeft, AlertTriangle
} from 'lucide-react';
import { Event } from '../../types';
import { EVENT_IMAGE_PRESETS, CHARITY_EVENT_PRESET_IMG } from '../../constants';

interface CreateEventModalProps {
  onClose: () => void;
  onCreate: (eventData: Partial<Event>) => void;
  showToast: (text: string, type?: "success" | "error" | "info", icon?: React.ReactNode) => void;
  setShowInviteFriendsModal: (show: boolean) => void;
  invitedFriendsCount: number;
}
// --- Custom Fluent-style Icons ---
const CreateEventIcon: React.FC<{size?: number}> = ({size = 20}) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.5 2A1.5 1.5 0 005 3.5V4H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3.5a1.5 1.5 0 00-3 0V4H7V3.5A1.5 1.5 0 006.5 2z" />
      <path d="M12.5 11.5a3 3 0 11-6 0 3 3 0 016 0z" fill="#f87171" stroke="#fff" strokeWidth="1.25"/>
      <path d="M13 11.5a.5.5 0 01-.5.5h-1v1a.5.5 0 11-1 0v-1h-1a.5.5 0 110-1h1v-1a.5.5 0 111 0v1h1a.5.5 0 01.5.5z" fill="white"/>
    </svg>
);
const IconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => <div className="text-slate-500 dark:text-slate-400 w-5 h-5">{children}</div>;
const TypeNameIcon = () => <IconWrapper><svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5a.997.997 0 01.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg></IconWrapper>;
const CalendarFluentIcon = () => <IconWrapper><svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg></IconWrapper>;
const ClockFluentIcon = () => <IconWrapper><svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" /></svg></IconWrapper>;
const LocationFluentIcon = () => <IconWrapper><svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg></IconWrapper>;
const CategoryFluentIcon = () => <IconWrapper><svg viewBox="0 0 20 20" fill="currentColor"><path d="M2 4a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V4zM2 12a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2z" /></svg></IconWrapper>;
const DescriptionFluentIcon = () => <IconWrapper><svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 2a1 1 0 011-1h4a1 1 0 110 2H7a1 1 0 01-1-1zm0 4a1 1 0 011-1h4a1 1 0 110 2H7a1 1 0 01-1-1zm0 4a1 1 0 011-1h4a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd" /></svg></IconWrapper>;
const ParticipantsFluentIcon = () => <IconWrapper><svg viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zm7 6a3 3 0 11-6 0 3 3 0 016 0zM5 13a4 4 0 00-4 4v1a1 1 0 001 1h6a1 1 0 001-1v-1a4 4 0 00-4-4H5zm10-1a4 4 0 014 4v1a1 1 0 01-1 1h-6a1 1 0 01-1-1v-1a4 4 0 014-4h2z" /></svg></IconWrapper>;
const HashtagFluentIcon = () => <IconWrapper><svg viewBox="0 0 20 20" fill="currentColor"><path d="M14.5 3.75a.75.75 0 00-1.5 0v1.5h-2.5a.75.75 0 000 1.5h2.5v3h-2.5a.75.75 0 000 1.5h2.5v1.5a.75.75 0 001.5 0v-1.5h2a.75.75 0 000-1.5h-2v-3h2a.75.75 0 000-1.5h-2v-1.5zM4 6.5a.75.75 0 01.75-.75h3.5a.75.75 0 010 1.5h-3.5a.75.75 0 01-.75-.75zM4.75 12a.75.75 0 000 1.5h3.5a.75.75 0 000-1.5h-3.5z" /></svg></IconWrapper>;
const FeeFluentIcon = () => <IconWrapper><svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v1.088A5.002 5.002 0 005.776 10H5a1 1 0 100 2h.776a5.002 5.002 0 003.448 3.088V16a1 1 0 102 0v-1.088A5.002 5.002 0 0014.224 12H15a1 1 0 100-2h-.776a5.002 5.002 0 00-3.448-3.088V5z" clipRule="evenodd" /></svg></IconWrapper>;
const CharityFluentIcon = () => <IconWrapper><svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg></IconWrapper>;
const GoalFluentIcon = () => <IconWrapper><svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zm0-4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg></IconWrapper>;
const InviteFluentIcon = () => <IconWrapper><svg viewBox="0 0 20 20" fill="currentColor"><path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 11a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1v-1z" /></svg></IconWrapper>;
const SendFluentIcon: React.FC = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>;
const ArrowRightFluentIcon: React.FC = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>;


const CreateEventModal: React.FC<CreateEventModalProps> = ({
  onClose,
  onCreate,
  showToast,
  setShowInviteFriendsModal,
  invitedFriendsCount,
}) => {
  const [step, setStep] = useState(1);
  const totalSteps = 2;

  // Form state remains the same
  const [eventName, setEventName] = useState("");
  const [date, setDate] = useState(new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [time, setTime] = useState("19:30");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("Social");
  const [description, setDescription] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [isCharityEvent, setIsCharityEvent] = useState(false);
  const [donationGoal, setDonationGoal] = useState("");
  const [partecipationFee, setPartecipationFee] = useState("");

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleNext = () => {
    if (step === 1) {
      if (!eventName || !date || !time || !location || !category) {
        showToast("Compila tutti i campi principali (*).", "error", <AlertTriangle size={18}/>);
        return;
      }
    }
    setStep(s => Math.min(s + 1, totalSteps));
  };

  const handleBack = () => {
    setStep(s => Math.max(s - 1, 1));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const maxParticipantsNum = maxParticipants ? parseInt(maxParticipants) : 0;
    if (isNaN(maxParticipantsNum) || maxParticipantsNum < 0) {
        showToast("Inserisci un numero di partecipanti valido.", "error", <AlertTriangle size={18}/>);
        return;
    }
    const newEventData: Partial<Event> = {
      name: eventName,
      date,
      time,
      location,
      category,
      description,
      maxParticipants: maxParticipantsNum,
      hashtags: hashtags ? hashtags.split(',').map(h => h.trim()).filter(Boolean) : [],
      isCharityEvent,
      donationGoal: isCharityEvent && donationGoal ? parseFloat(donationGoal) : 0,
      partecipationFee: partecipationFee ? `€${parseFloat(partecipationFee).toFixed(2)}` : undefined,
      img: isCharityEvent ? CHARITY_EVENT_PRESET_IMG : EVENT_IMAGE_PRESETS[Math.floor(Math.random() * EVENT_IMAGE_PRESETS.length)],
    };
    onCreate(newEventData);
  };
  
  const stepTitles = ["Dettagli Principali", "Opzioni Aggiuntive"];

  return (
    <div className="fixed inset-0 z-40 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 animate-fade-in">
      <form onSubmit={handleSubmit} className="h-full w-full flex flex-col">
        
        <header className="sticky top-0 z-20 flex items-center justify-center py-2 px-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
                 <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-gradient-to-br from-orange-400 to-red-500 text-white shadow-md">
                    <CreateEventIcon size={18}/>
                 </div>
                <h1 className="text-md font-bold text-slate-800 dark:text-slate-100">Crea Evento</h1>
            </div>
        </header>

        <div className="px-4 sm:px-5 pt-4 pb-2">
            <div className="flex items-center gap-2">
                <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                    <div className="bg-gradient-to-r from-orange-400 to-red-500 h-1.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
                </div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Step {step}/{totalSteps}</span>
            </div>
            <h2 className="text-md font-semibold text-slate-700 dark:text-slate-300 mt-2">{stepTitles[step - 1]}</h2>
        </div>
          
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 sm:p-5 space-y-4 sm:space-y-5 pb-28">
            {step === 1 && (
                <div key="step1" className="animate-fade-in space-y-4 sm:space-y-5">
                    <div>
                        <label htmlFor="eventName" className="form-label"><TypeNameIcon />Nome Evento*</label>
                        <input type="text" id="eventName" value={eventName} onChange={e => setEventName(e.target.value)} required className="form-input" placeholder="Es. Aperitivo Social"/>
                    </div>
                    <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
                        <div>
                            <label htmlFor="eventDate" className="form-label"><CalendarFluentIcon />Data*</label>
                            <input type="date" id="eventDate" value={date} min={new Date().toISOString().split('T')[0]} onChange={e => setDate(e.target.value)} required className="form-input" />
                        </div>
                        <div>
                            <label htmlFor="eventTime" className="form-label"><ClockFluentIcon />Ora*</label>
                            <input type="time" id="eventTime" value={time} onChange={e => setTime(e.target.value)} required className="form-input" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="eventLocation" className="form-label"><LocationFluentIcon />Luogo*</label>
                        <input type="text" id="eventLocation" value={location} onChange={e => setLocation(e.target.value)} required className="form-input" placeholder="Es. Nome Locale o Indirizzo"/>
                    </div>
                     <div>
                        <label htmlFor="eventCategory" className="form-label"><CategoryFluentIcon />Categoria*</label>
                        <select id="eventCategory" value={category} onChange={e => setCategory(e.target.value)} required className="form-input bg-white dark:bg-slate-800">
                            <option>Social</option><option>Cibo</option><option>Musica</option><option>Sport</option><option>Cultura</option><option>Beneficenza</option><option>Altro</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="eventDescription" className="form-label"><DescriptionFluentIcon />Descrizione</label>
                        <textarea id="eventDescription" value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Descrivi brevemente il tuo evento..." className="form-input leading-relaxed"></textarea>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div key="step2" className="animate-fade-in space-y-4 sm:space-y-5">
                    <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
                        <div>
                            <label htmlFor="maxParticipants" className="form-label"><ParticipantsFluentIcon />Max Partecipanti</label>
                            <input type="number" id="maxParticipants" value={maxParticipants} min="0" onChange={e => setMaxParticipants(e.target.value)} className="form-input" placeholder="Illimitato"/>
                        </div>
                        <div>
                            <label htmlFor="hashtags" className="form-label"><HashtagFluentIcon />Hashtag</label>
                            <input type="text" id="hashtags" value={hashtags} onChange={e => setHashtags(e.target.value)} className="form-input" placeholder="Es. #aperitivo"/>
                        </div>
                    </div>

                    <div className="flex items-center gap-3.5 sm:gap-4 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                        <div className="flex-1">
                            <p className="font-medium text-sm text-slate-800 dark:text-slate-200 flex items-center gap-1.5"><FeeFluentIcon />Quota di Partecipazione</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Lascia vuoto se l'evento è gratuito.</p>
                        </div>
                        <input type="number" value={partecipationFee} min="0" step="0.50" onChange={(e) => setPartecipationFee(e.target.value)} placeholder="€" className="form-input w-24" />
                    </div>

                    <div className="flex items-center p-3 pl-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                        <div className="flex-1">
                            <p className="font-medium text-sm text-slate-800 dark:text-slate-200 flex items-center gap-1.5"><CharityFluentIcon />Evento Benefico?</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Spunta se l'evento raccoglie fondi.</p>
                        </div>
                        <label htmlFor="isCharity" className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" id="isCharity" checked={isCharityEvent} onChange={e => setIsCharityEvent(e.target.checked)} className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-pink-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 dark:after:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                        </label>
                    </div>

                    {isCharityEvent && (
                        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border-2 border-pink-200 dark:border-pink-500/50 shadow-md animate-fade-in-up">
                            <label htmlFor="donationGoal" className="form-label text-pink-700 dark:text-pink-400"><GoalFluentIcon />Obiettivo Donazione (€)</label>
                            <input type="number" id="donationGoal" value={donationGoal} min="0" onChange={e => setDonationGoal(e.target.value)} className="form-input focus:ring-pink-400 focus:border-pink-400" placeholder="Es. 500"/>
                        </div>
                    )}
                    
                    <button type="button" onClick={() => setShowInviteFriendsModal(true)} className="w-full mt-2 flex items-center justify-between gap-2 py-3 px-4 border border-indigo-400 text-indigo-600 dark:text-indigo-300 rounded-lg bg-indigo-50/70 dark:bg-indigo-500/20 transition-all duration-200 ease-out text-sm font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 active:shadow-sm">
                      <span className="flex items-center gap-2">
                        <InviteFluentIcon /> Invita Amici
                      </span>
                      <span className="text-xs bg-indigo-200 dark:bg-indigo-400/50 text-indigo-700 dark:text-indigo-200 px-2 py-1 rounded-full">{invitedFriendsCount} invitati</span>
                    </button>
                </div>
            )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 z-30 bg-gradient-to-t from-slate-50 via-slate-50/90 to-transparent dark:from-slate-950 dark:via-slate-950/90 dark:to-transparent">
          {step === 1 && (
             <div className="flex items-center gap-3">
              <button type="button" onClick={onClose} className="flex-1 py-3 px-4 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold transition-all duration-200 ease-out active:scale-95 border border-slate-200 dark:border-slate-600 shadow hover:-translate-y-0.5 hover:shadow-lg active:shadow-sm active:translate-y-0">
                Chiudi
              </button>
              <button type="button" onClick={handleNext} className="flex-1 bg-gradient-to-br from-orange-500 to-red-500 text-white font-semibold py-3 sm:py-3.5 px-4 rounded-xl transition-all duration-200 ease-out flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 active:shadow-md">
                Avanti <ArrowRightFluentIcon/>
              </button>
            </div>
          )}
          {step === 2 && (
            <div className="flex items-center gap-3">
              <button type="button" onClick={handleBack} className="flex-1 py-3 px-4 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold transition-all duration-200 ease-out active:scale-95 border border-slate-200 dark:border-slate-600 shadow hover:-translate-y-0.5 hover:shadow-lg active:shadow-sm active:translate-y-0 flex items-center justify-center gap-1">
                <ChevronLeft size={20}/> Indietro
              </button>
              <button type="submit" className="flex-1 bg-gradient-to-br from-orange-500 to-red-500 text-white font-semibold py-3 sm:py-3.5 px-4 rounded-xl transition-all duration-200 ease-out flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 active:shadow-md">
                <SendFluentIcon /> Crea Evento
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateEventModal;