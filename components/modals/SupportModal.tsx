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
    <div className="border-b border-slate-200 last:border-b-0">
      <button onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center w-full py-3 text-left">
        <span className="font-medium text-sm text-slate-700">{q}</span>
        <ChevronDown size={20} className={`text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="pb-3 text-xs text-slate-600 leading-relaxed animate-slide-down">
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-h-[90vh] flex flex-col">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-sm rounded-t-2xl z-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2 sm:gap-2.5">
            <HelpCircle size={26} className="text-sky-500" />Centro Assistenza
          </h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 sm:p-1.5 rounded-full hover:bg-slate-200 transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="overflow-y-auto p-5 sm:p-6 space-y-4 sm:space-y-5 text-slate-700">
          <div className="bg-sky-50/70 p-3.5 sm:p-4 rounded-lg border border-sky-200 shadow-sm">
            <h4 className="font-semibold text-sm sm:text-md text-slate-800 mb-1.5 sm:mb-2">Domande Frequenti (FAQ)</h4>
            <div className="space-y-1">
              {faqs.map((faq, i) => <FaqItem key={i} q={faq.q} a={faq.a} />)}
            </div>
          </div>
          <p className="text-xs sm:text-sm text-center text-slate-500 pt-1.5 sm:pt-2">Non hai trovato una risposta? Contattaci direttamente.</p>
        </div>
        <div className="p-4 sm:p-5 border-t border-slate-200 mt-auto sticky bottom-0 bg-white/80 backdrop-blur-sm rounded-b-2xl">
          <button
            onClick={handleContact}
            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 sm:py-3.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 shadow-md hover:shadow-lg active:scale-95"
          >
            <Send size={18} /> Scrivici una mail
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default SupportModal;