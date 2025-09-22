import React, { useState } from 'react';
import ModalWrapper from './ModalWrapper';
import { X, HelpCircle, Send, ChevronDown } from 'lucide-react';

const faqs = [
  { q: "Come posso modificare il mio profilo?", a: "Puoi modificare il tuo avatar e altre informazioni del profilo direttamente dalla pagina Profilo. Cerca l'icona di modifica vicino al tuo avatar." },
  { q: "Come funzionano i crediti SocialMix?", a: "Guadagni crediti partecipando ad attività e completando obiettivi. Puoi usarli per pagare quote di eventi o conti nei locali convenzionati." },
  { q: "La mia prenotazione non è andata a buon fine, cosa faccio?", a: "Se riscontri problemi con una prenotazione, controlla la sezione 'Calendario' per i dettagli. Se il problema persiste, contattaci usando il pulsante qui sotto." },
];

const FaqItem: React.FC<{ q: string; a: string }> = ({ q, a }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-slate-200 dark:border-slate-700 last:border-b-0">
      <button onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center w-full py-3 text-left">
        <span className="font-medium text-sm text-slate-700 dark:text-slate-200">{q}</span>
        <ChevronDown size={20} className={`text-slate-500 dark:text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="pb-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed animate-slide-down">
          {a}
        </div>
      )}
    </div>
  );
};

interface SupportModalProps {
  onClose: () => void;
  showToast: (text: string, type?: "success" | "error" | "info", icon?: React.ReactNode) => void;
}

const SupportModal: React.FC<SupportModalProps> = ({ onClose, showToast }) => {
  const handleContact = () => {
    showToast("Apertura client di posta... (Simulazione)", "info");
    onClose();
  };

  return (
    <ModalWrapper open={true} onClose={onClose} customClasses="max-w-lg w-full">
      <div className="bg-white dark:bg-black rounded-2xl shadow-2xl w-full max-h-[90vh] flex flex-col">
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-lg rounded-t-2xl z-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 sm:gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-sky-400 to-blue-500 shadow-md">
                <HelpCircle size={22} className="text-white" />
            </div>
            Centro Assistenza
          </h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 sm:p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="overflow-y-auto p-5 sm:p-6 space-y-4 sm:space-y-5 text-slate-700">
          <div className="bg-sky-50/70 dark:bg-sky-500/10 p-3.5 sm:p-4 rounded-lg border border-sky-200 dark:border-sky-500/20 shadow-sm">
            <h4 className="font-semibold text-sm sm:text-md text-slate-800 dark:text-slate-100 mb-1.5 sm:mb-2">Domande Frequenti (FAQ)</h4>
            <div className="space-y-1">
              {faqs.map((faq, i) => <FaqItem key={i} q={faq.q} a={faq.a} />)}
            </div>
          </div>
          <p className="text-xs sm:text-sm text-center text-slate-500 dark:text-slate-400 pt-1.5 sm:pt-2">Non hai trovato una risposta? Contattaci direttamente.</p>
        </div>
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-700 mt-auto sticky bottom-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-b-2xl">
          <button
            onClick={handleContact}
            className="w-full bg-gradient-to-br from-sky-500 to-blue-500 text-white font-semibold py-3 sm:py-3.5 px-4 rounded-lg transition-all duration-200 ease-out flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 active:shadow-md"
          >
            <Send size={18} /> Scrivici una mail
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default SupportModal;