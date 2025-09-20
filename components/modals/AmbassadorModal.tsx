
import React from 'react';
import ModalWrapper from './ModalWrapper';
import { X, Award, Star, Send } from 'lucide-react';

interface AmbassadorModalProps {
  onClose: () => void;
  showToast: (text: string, type?: "success" | "error" | "info", icon?: React.ReactNode) => void;
}

const AmbassadorModal: React.FC<AmbassadorModalProps> = ({ onClose, showToast }) => {
  return (
    <ModalWrapper open={true} onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-h-[90vh] flex flex-col">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-sm rounded-t-2xl z-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2 sm:gap-2.5">
            <Award size={26} className="text-amber-500" />Diventa Ambassador!
          </h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 sm:p-1.5 rounded-full hover:bg-slate-200 transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="overflow-y-auto p-5 sm:p-6 space-y-4 sm:space-y-5 text-slate-700">
          <p className="text-md sm:text-lg text-center font-semibold text-amber-600">Entra a far parte della nostra community esclusiva di Ambassador SocialMix!</p>
          <div className="bg-amber-50/70 p-3.5 sm:p-4 rounded-lg border border-amber-200 shadow-sm">
            <h4 className="font-semibold text-sm sm:text-md text-slate-800 mb-1.5 sm:mb-2">Vantaggi Esclusivi:</h4>
            <ul className="list-disc list-inside space-y-1 sm:space-y-1.5 text-xs sm:text-sm">
              <li>Accesso anticipato a nuove funzionalità.</li>
              <li>Inviti speciali a eventi e degustazioni.</li>
              <li>Badge "Ambassador" <Star size={14} className="inline fill-amber-400 text-amber-500" /> sul profilo.</li>
              <li>Sconti e offerte dedicate.</li>
              <li>Collabora a contenuti e guide.</li>
            </ul>
          </div>
          <div className="bg-sky-50/70 p-3.5 sm:p-4 rounded-lg border border-sky-200 shadow-sm">
            <h4 className="font-semibold text-sm sm:text-md text-slate-800 mb-1.5 sm:mb-2">Chi stiamo cercando?</h4>
            <ul className="list-disc list-inside space-y-1 sm:space-y-1.5 text-xs sm:text-sm">
              <li>Appassionati di cibo ed esperienze.</li>
              <li>Persone che amano scoprire e condividere.</li>
              <li>Utenti attivi e propositivi.</li>
              <li>Presenza social è un plus!</li>
            </ul>
          </div>
          <p className="text-xs sm:text-sm text-center text-slate-500 pt-1.5 sm:pt-2">Se pensi di avere la stoffa giusta, non esitare!</p>
        </div>
        <div className="p-4 sm:p-5 border-t border-slate-200 mt-auto sticky bottom-0 bg-white/80 backdrop-blur-sm rounded-b-2xl">
          <button
            onClick={() => {
              showToast("Candidatura inviata! Ti faremo sapere presto.", "success", <Send size={18} />);
              onClose();
            }}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 sm:py-3.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 shadow-md hover:shadow-lg active:scale-95"
          >
            <Send size={18} /> Invia Candidatura
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default AmbassadorModal;
