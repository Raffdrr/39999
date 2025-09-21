import React, { useState, useEffect } from 'react';
import { Locale } from '../../types'; 
import { ChevronLeft, ClipboardList, Send, AlertTriangle, Building, CalendarDays, Clock, Users, FileText, Info as InfoIconLucide } from 'lucide-react';

interface ProposeTableModalProps {
  onClose: () => void;
  onPropose: (tableData: { localeName: string; date: string; time: string; numPeople: number; notes: string }) => void; 
  locali: Locale[]; 
  showToast: (text: string, type?: "success" | "error" | "info", icon?: React.ReactNode) => void;
}

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
        
        <header className="sticky top-0 z-20 flex items-center justify-between p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
            <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Indietro">
                <ChevronLeft size={24} className="text-slate-600 dark:text-slate-300" />
            </button>
            <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-sky-400 to-blue-500 shadow-md mb-1">
                  <ClipboardList size={18} className="text-white" />
                </div>
                <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">Proponi un Tavolo</h1>
            </div>
            <div className="w-10"></div>
        </header>

        <div className="flex-1 overflow-y-auto no-scrollbar p-4 sm:p-5 space-y-4 sm:space-y-5 pb-28">
            <div>
              <label htmlFor="localeName" className="form-label"><Building />Nome Locale*</label>
              <select id="localeName" value={localeName} onChange={e => setLocaleName(e.target.value)} required className="form-input bg-white dark:bg-slate-800"> 
                {locali.map(l => <option key={l.id} value={l.name}>{l.name}</option>)} 
                <option value="Altro">Altro (specifica nelle note)</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
              <div>
                <label htmlFor="tableDate" className="form-label"><CalendarDays />Data*</label>
                <input type="date" id="tableDate" value={date} min={new Date().toISOString().split('T')[0]} onChange={e => setDate(e.target.value)} required className="form-input" />
              </div>
              <div>
                <label htmlFor="tableTime" className="form-label"><Clock />Ora*</label>
                <input type="time" id="tableTime" value={time} onChange={e => setTime(e.target.value)} required className="form-input" />
              </div>
            </div>
            
            <div>
              <label htmlFor="numPeople" className="form-label"><Users />Numero Persone*</label>
              <input type="number" id="numPeople" value={numPeople} min="1" onChange={e => setNumPeople(e.target.value)} required className="form-input" />
            </div>
            
            <div>
              <label htmlFor="tableNotes" className="form-label"><FileText />Note (opzionale)</label>
              <textarea id="tableNotes" value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Es. Preferenze tavolo, allergie, nome per 'Altro' locale..." className="form-input leading-relaxed"></textarea>
            </div>
            
            <div className="mt-3 sm:mt-4 p-3 bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/20 rounded-lg text-xs text-sky-700 dark:text-sky-300 flex items-start gap-2 shadow-sm">
              <InfoIconLucide size={20} className="flex-shrink-0 mt-0.5 text-sky-500" />
              <span>Questa funzionalità simula una proposta di tavolo. Nella versione reale, contatteremmo il locale o useremmo un sistema di prenotazione integrato.</span>
            </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 z-30 bg-gradient-to-t from-slate-50 via-slate-50/90 to-transparent dark:from-slate-950 dark:via-slate-950/90 dark:to-transparent pointer-events-none">
          <button type="submit" className="w-full bg-gradient-to-br from-sky-500 to-blue-500 text-white font-semibold py-3 sm:py-3.5 px-4 rounded-xl transition-all duration-200 ease-out flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 active:shadow-md pointer-events-auto">
            <Send size={20}/> Invia Proposta
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProposeTableModal;