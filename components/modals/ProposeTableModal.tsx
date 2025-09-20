import React, { useState, useEffect } from 'react';
import { Locale } from '../../types'; 
import { ChevronLeft, ClipboardList, Send, AlertTriangle, Building, CalendarDays, Clock, Users, FileText, Info as InfoIconLucide } from 'lucide-react';
import ImageWithFallback from '../ImageWithFallback';

interface ProposeTableModalProps {
  onClose: () => void;
  onPropose: (tableData: { localeName: string; date: string; time: string; numPeople: number; notes: string }) => void; 
  locali: Locale[]; 
  showToast: (text: string, type?: "success" | "error" | "info", icon?: React.ReactNode) => void;
}

const HEADER_IMAGE_URL = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80';

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
    <div className="fixed inset-0 z-40 bg-slate-50 text-slate-900 animate-fade-in">
      <form onSubmit={handleSubmit} className="h-full w-full flex flex-col">
        <div className="flex-1 overflow-y-auto no-scrollbar">

          <div className="relative h-[35vh] w-full">
            <ImageWithFallback
              src={HEADER_IMAGE_URL}
              alt="Proponi un tavolo"
              imgClassName="absolute inset-0 w-full h-full object-cover"
              containerClassName="absolute inset-0 w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent z-10"></div>
            
            <button type="button" onClick={onClose} className="absolute top-4 left-4 z-20 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors pointer-events-auto" aria-label="Indietro">
              <ChevronLeft size={24} />
            </button>
            
            <div className="absolute bottom-4 left-4 right-4 z-20 p-2 text-white">
              <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight drop-shadow-lg flex items-center gap-3">
                <ClipboardList size={36} /> Proponi un Tavolo
              </h1>
            </div>
          </div>
          
          <div className="p-4 sm:p-5 space-y-4 sm:space-y-5 bg-slate-50 -mt-4 rounded-t-2xl relative z-20 pb-28">
            <div>
              <label htmlFor="localeName" className="form-label"><Building />Nome Locale*</label>
              <select id="localeName" value={localeName} onChange={e => setLocaleName(e.target.value)} required className="form-input bg-white"> 
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
            
            <div className="mt-3 sm:mt-4 p-3 bg-sky-50 border border-sky-200 rounded-lg text-xs text-sky-700 flex items-start gap-2 shadow-sm">
              <InfoIconLucide size={20} className="flex-shrink-0 mt-0.5 text-sky-500" />
              <span>Questa funzionalità simula una proposta di tavolo. Nella versione reale, contatteremmo il locale o useremmo un sistema di prenotazione integrato.</span>
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 z-30 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none">
          <button type="submit" className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 sm:py-3.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-95 pointer-events-auto">
            <Send size={20}/> Invia Proposta
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProposeTableModal;