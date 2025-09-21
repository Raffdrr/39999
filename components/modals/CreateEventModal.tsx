import React, { useState, useEffect } from 'react';
import {
  ChevronLeft, Send, AlertTriangle, Type, CalendarDays, Clock, Users, FileText,
  MapPin as MapPinIcon, DollarSign, Image as ImageIcon, Gift, Tag, UsersRound, Sparkles, Target
} from 'lucide-react';
import { Event } from '../../types';
import { EVENT_IMAGE_PRESETS, CHARITY_EVENT_PRESET_IMG } from '../../constants';
import ImageWithFallback from '../ImageWithFallback';

interface CreateEventModalProps {
  onClose: () => void;
  onCreate: (eventData: Partial<Event>) => void;
  showToast: (text: string, type?: "success" | "error" | "info", icon?: React.ReactNode) => void;
  setShowInviteFriendsModal: (show: boolean) => void;
  invitedFriendsCount: number;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({
  onClose,
  onCreate,
  showToast,
  setShowInviteFriendsModal,
  invitedFriendsCount,
}) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventName || !date || !time || !location || !category) {
      showToast("Compila tutti i campi obbligatori (*).", "error", <AlertTriangle size={18}/>);
      return;
    }
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

  return (
    <div className="fixed inset-0 z-40 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 animate-fade-in">
      <form onSubmit={handleSubmit} className="h-full w-full flex flex-col">
        
        <header className="sticky top-0 z-20 flex items-center justify-between p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
            <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Indietro">
                <ChevronLeft size={24} className="text-slate-600 dark:text-slate-300" />
            </button>
            <div className="flex flex-col items-center">
                 <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-orange-400 to-red-500 shadow-md mb-1">
                    <Sparkles size={18} className="text-white" />
                 </div>
                <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">Crea Evento</h1>
            </div>
            <div className="w-10"></div>
        </header>
          
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 sm:p-5 space-y-4 sm:space-y-5 pb-28">
            <div>
              <label htmlFor="eventName" className="form-label"><Type />Nome Evento*</label>
              <input type="text" id="eventName" value={eventName} onChange={e => setEventName(e.target.value)} required className="form-input" placeholder="Es. Aperitivo Social"/>
            </div>

            <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
              <div>
                <label htmlFor="eventDate" className="form-label"><CalendarDays />Data*</label>
                <input type="date" id="eventDate" value={date} min={new Date().toISOString().split('T')[0]} onChange={e => setDate(e.target.value)} required className="form-input" />
              </div>
              <div>
                <label htmlFor="eventTime" className="form-label"><Clock />Ora*</label>
                <input type="time" id="eventTime" value={time} onChange={e => setTime(e.target.value)} required className="form-input" />
              </div>
            </div>
            
            <div>
              <label htmlFor="eventLocation" className="form-label"><MapPinIcon />Luogo*</label>
              <input type="text" id="eventLocation" value={location} onChange={e => setLocation(e.target.value)} required className="form-input" placeholder="Es. Nome Locale o Indirizzo"/>
            </div>
            
            <div>
              <label htmlFor="eventDescription" className="form-label"><FileText />Descrizione</label>
              <textarea id="eventDescription" value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Descrivi brevemente il tuo evento..." className="form-input leading-relaxed"></textarea>
            </div>
            
            <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
              <div>
                <label htmlFor="eventCategory" className="form-label"><FileText />Categoria*</label>
                <select id="eventCategory" value={category} onChange={e => setCategory(e.target.value)} required className="form-input bg-white dark:bg-slate-800">
                  <option>Social</option><option>Cibo</option><option>Musica</option><option>Sport</option><option>Cultura</option><option>Beneficenza</option><option>Altro</option>
                </select>
              </div>
              <div>
                <label htmlFor="maxParticipants" className="form-label"><Users />Max Partecipanti</label>
                <input type="number" id="maxParticipants" value={maxParticipants} min="0" onChange={e => setMaxParticipants(e.target.value)} className="form-input" placeholder="Illimitato"/>
              </div>
            </div>
            
            <div>
              <label htmlFor="hashtags" className="form-label"><Tag />Hashtag</label>
              <input type="text" id="hashtags" value={hashtags} onChange={e => setHashtags(e.target.value)} className="form-input" placeholder="Es. aperitivo, amici (separati da virgola)"/>
            </div>
            
            <div className="flex items-center gap-3.5 sm:gap-4 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex-1">
                  <p className="font-medium text-sm text-slate-800 dark:text-slate-200 flex items-center gap-1.5"><DollarSign size={16} className="text-green-500" />Quota di Partecipazione</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Lascia vuoto se l'evento è gratuito.</p>
                </div>
                <input type="number" value={partecipationFee} min="0" step="0.50" onChange={(e) => setPartecipationFee(e.target.value)} placeholder="€" className="form-input w-24" />
            </div>

            <div className="flex items-center p-3 pl-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex-1">
                <p className="font-medium text-sm text-slate-800 dark:text-slate-200 flex items-center gap-1.5"><Gift size={16} className="text-pink-500"/>Evento Benefico?</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Spunta se l'evento raccoglie fondi.</p>
              </div>
              <label htmlFor="isCharity" className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" id="isCharity" checked={isCharityEvent} onChange={e => setIsCharityEvent(e.target.checked)} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-pink-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 dark:after:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
              </label>
            </div>

            {isCharityEvent && (
                <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border-2 border-pink-200 dark:border-pink-500/50 shadow-md animate-fade-in-up">
                    <label htmlFor="donationGoal" className="form-label text-pink-700 dark:text-pink-400"><Target />Obiettivo Donazione (€)</label>
                    <input type="number" id="donationGoal" value={donationGoal} min="0" onChange={e => setDonationGoal(e.target.value)} className="form-input focus:ring-pink-400 focus:border-pink-400" placeholder="Es. 500"/>
                </div>
            )}
            
            <button type="button" onClick={() => setShowInviteFriendsModal(true)} className="w-full mt-2 flex items-center justify-center gap-2 py-3 border border-indigo-400 text-indigo-600 dark:text-indigo-300 rounded-lg bg-indigo-50/70 dark:bg-indigo-500/20 transition-all duration-200 ease-out text-sm font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 active:shadow-sm">
              <UsersRound size={18} /> Invita Amici ({invitedFriendsCount})
            </button>

        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 z-30 bg-gradient-to-t from-slate-50 via-slate-50/90 to-transparent dark:from-slate-950 dark:via-slate-950/90 dark:to-transparent pointer-events-none">
          <button type="submit" className="w-full bg-gradient-to-br from-orange-500 to-red-500 text-white font-semibold py-3 sm:py-3.5 px-4 rounded-xl transition-all duration-200 ease-out flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 active:shadow-md pointer-events-auto">
            <Send size={20}/> Crea Evento
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEventModal;