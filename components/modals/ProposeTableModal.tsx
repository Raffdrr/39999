import React, { useState, useEffect } from 'react';
import { Locale } from '../../types'; 
import { AlertTriangle, Info as InfoIconLucide } from 'lucide-react';

interface ProposeTableModalProps {
  onClose: () => void;
  onPropose: (tableData: { localeName: string; date: string; time: string; numPeople: number; notes: string }) => void; 
  locali: Locale[]; 
  showToast: (text: string, type?: "success" | "error" | "info", icon?: React.ReactNode) => void;
}

// --- Custom Fluent-style Icons ---
const ProposeTableIcon: React.FC<{size?: number}> = ({size = 20}) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 8a3 3 0 100-6 3 3 0 000 6zM5.068 11.326a5.5 5.5 0 00-4.883 5.044 1 1 0 00.986 1.13h11.658a1 1 0 00.986-1.13 5.5 5.5 0 00-4.883-5.044 3.502 3.502 0 01-3.864 0z" />
      <path d="M14.5 9a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0z" fill="#60a5fa" stroke="#fff" strokeWidth="1.25"/>
      <path d="M14.5 8a.5.5 0 00-1 0v.5a.5.5 0 01-1 0V8a1.5 1.5 0 013 0v.055a1.88 1.88 0 01-1.386 1.81l-.001.001a.5.5 0 01-.226-.966A.88.88 0 0013.5 8.055V8zM14.5 11a.5.5 0 11-1 0 .5.5 0 011 0z" fill="white"/>
    </svg>
);
const IconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => <div className="text-slate-500 dark:text-slate-400 w-5 h-5">{children}</div>;
const BuildingFluentIcon = () => <IconWrapper><svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 4a1 1 0 100 2h2a1 1 0 100-2H6zm6 0a1 1 0 100 2h2a1 1 0 100-2h-2zM6 12a1 1 0 100 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg></IconWrapper>;
const CalendarFluentIcon = () => <IconWrapper><svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm-2 7a1 1 0 011-1h8a1 1 0 110 2H5a1 1 0 01-1-1zm1-3a1 1 0 100 2h8a1 1 0 100-2H5z" clipRule="evenodd" /></svg></IconWrapper>;
const ClockFluentIcon = () => <IconWrapper><svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.5-13a.5.5 0 00-1 0v6a.5.5 0 00.146.354l3.5 3.5a.5.5 0 00.708-.708L10.5 11.293V5z" clipRule="evenodd" /></svg></IconWrapper>;
const ParticipantsFluentIcon = () => <IconWrapper><svg viewBox="0 0 20 20" fill="currentColor"><path d="M7 8a4 4 0 100-8 4 4 0 000 8zm0 2a6 6 0 00-6 6v1a1 1 0 001 1h10a1 1 0 001-1v-1a6 6 0 00-6-6zm8.5 2a3.5 3.5 0 100-7 3.5 3.5 0 000 7zm-3.5 5a4 4 0 00-4 4v1a.5.5 0 00.5.5h7a.5.5 0 00.5-.5v-1a4 4 0 00-4-4z" /></svg></IconWrapper>;
const NotesFluentIcon = () => <IconWrapper><svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm2 5a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg></IconWrapper>;
const SendFluentIcon: React.FC = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>;


const ProposeTableModal: React.FC<ProposeTableModalProps> = ({ onClose, onPropose, locali, showToast }) => { 
  const [localeName, setLocaleName] = useState(locali.length > 0 ? locali[0].name : ""); 
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState("20:00");
  const [numPeople, setNumPeople] = useState("2");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localeName || !date || !time || !numPeople) { 
      showToast("Compila tutti i campi obbligatori (*).", "error", <AlertTriangle size={18}/>);
      return;
    }
    const numPeopleInt = parseInt(numPeople);
    if (isNaN(numPeopleInt) || numPeopleInt <=0) {
        showToast("Inserisci un numero di persone valido.", "error", <AlertTriangle size={18}/>);
        return;
    }
    onPropose({ localeName, date, time, numPeople: numPeopleInt, notes }); 
  };
  
  return (
    <div className="fixed inset-0 z-40 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 animate-fade-in">
      <form onSubmit={handleSubmit} className="h-full w-full flex flex-col">
        
        <header className="sticky top-0 z-20 flex items-center justify-center py-2 px-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-gradient-to-br from-sky-400 to-blue-500 text-white shadow-md">
                  <ProposeTableIcon size={18} />
                </div>
                <h1 className="text-md font-bold text-slate-800 dark:text-slate-100">Proponi un Tavolo</h1>
            </div>
        </header>

        <div className="flex-1 overflow-y-auto no-scrollbar p-4 sm:p-5 space-y-4 sm:space-y-5 pb-28">
            <div>
              <label htmlFor="localeName" className="form-label"><BuildingFluentIcon />Nome Locale*</label>
              <select id="localeName" value={localeName} onChange={e => setLocaleName(e.target.value)} required className="form-input bg-white dark:bg-slate-800"> 
                {locali.map(l => <option key={l.id} value={l.name}>{l.name}</option>)} 
                <option value="Altro">Altro (specifica nelle note)</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
              <div>
                <label htmlFor="tableDate" className="form-label"><CalendarFluentIcon />Data*</label>
                <input type="date" id="tableDate" value={date} min={new Date().toISOString().split('T')[0]} onChange={e => setDate(e.target.value)} required className="form-input" />
              </div>
              <div>
                <label htmlFor="tableTime" className="form-label"><ClockFluentIcon />Ora*</label>
                <input type="time" id="tableTime" value={time} onChange={e => setTime(e.target.value)} required className="form-input" />
              </div>
            </div>
            
            <div>
              <label htmlFor="numPeople" className="form-label"><ParticipantsFluentIcon />Numero Persone*</label>
              <input type="number" id="numPeople" value={numPeople} min="1" onChange={e => setNumPeople(e.target.value)} required className="form-input" />
            </div>
            
            <div>
              <label htmlFor="tableNotes" className="form-label"><NotesFluentIcon />Note (opzionale)</label>
              <textarea id="tableNotes" value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Es. Preferenze tavolo, allergie, nome per 'Altro' locale..." className="form-input leading-relaxed"></textarea>
            </div>
            
            <div className="mt-3 sm:mt-4 p-3 bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/20 rounded-lg text-xs text-sky-700 dark:text-sky-300 flex items-start gap-2 shadow-sm">
              <InfoIconLucide size={20} className="flex-shrink-0 mt-0.5 text-sky-500" />
              <span>Questa funzionalità simula una proposta di tavolo. Nella versione reale, contatteremmo il locale o useremmo un sistema di prenotazione integrato.</span>
            </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 z-30 bg-gradient-to-t from-slate-50 via-slate-50/90 to-transparent dark:from-slate-950 dark:via-slate-950/90 dark:to-transparent">
          <div className="flex items-center gap-3">
              <button type="button" onClick={onClose} className="flex-1 py-3 px-4 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold transition-all duration-200 ease-out active:scale-95 border border-slate-200 dark:border-slate-600 shadow hover:-translate-y-0.5 hover:shadow-lg active:shadow-sm active:translate-y-0">
                Chiudi
              </button>
              <button type="submit" className="flex-1 bg-gradient-to-br from-sky-500 to-blue-500 text-white font-semibold py-3 sm:py-3.5 px-4 rounded-xl transition-all duration-200 ease-out flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 active:shadow-md">
                <SendFluentIcon /> Invia Proposta
              </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProposeTableModal;