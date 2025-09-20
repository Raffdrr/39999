import React from 'react';
import ModalWrapper from './ModalWrapper';
import { X, Shield, CheckCircle, Sparkles } from 'lucide-react';

interface SubscriptionModalProps {
  onClose: () => void;
  showToast: (text: string, type?: "success" | "error" | "info", icon?: React.ReactNode) => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ onClose, showToast }) => {
  return (
    <ModalWrapper open={true} onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-h-[90vh] flex flex-col">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-sm rounded-t-2xl z-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2 sm:gap-2.5">
            <Shield size={26} className="text-purple-500" />SocialMix Premium
          </h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 sm:p-1.5 rounded-full hover:bg-slate-200 transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="overflow-y-auto p-5 sm:p-6 space-y-4 sm:space-y-5 text-slate-700">
          <p className="text-md sm:text-lg text-center font-semibold text-purple-600">Sblocca il massimo dalla tua esperienza SocialMix!</p>
          <div className="space-y-3 sm:space-y-4">
            <div
              className="bg-purple-50/70 p-3.5 sm:p-4 rounded-xl border-2 border-purple-300 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => {
                showToast("Piano Mensile selezionato!", "success", <CheckCircle size={18} />);
                onClose();
              }}
            >
              <div className="flex flex-col sm:flex-row justify-between items-center mb-1">
                <h4 className="font-bold text-lg sm:text-xl text-purple-700 mb-1 sm:mb-0">Premium Mensile</h4>
                <p className="text-xl sm:text-2xl font-bold text-purple-700">€4<span className="text-md sm:text-lg">.99</span><span className="text-xs sm:text-sm font-normal text-slate-500">/mese</span></p>
              </div>
              <ul className="list-disc list-inside space-y-0.5 sm:space-y-1 text-xs sm:text-sm text-slate-600 pl-1">
                <li>Nessuna pubblicità</li>
                <li>Filtri di ricerca avanzati</li>
                <li>Offerte esclusive dai ristoranti</li>
                <li>Supporto prioritario</li>
              </ul>
            </div>
            <div
              className="relative bg-teal-50/70 p-3.5 sm:p-4 rounded-xl border-2 border-teal-400 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => {
                showToast("Piano Annuale selezionato! Risparmi il 20%!", "success", <CheckCircle size={18} />);
                onClose();
              }}
            >
              <span className="absolute top-2 right-2 bg-teal-500 text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded-full shadow-md"><Sparkles size={12} className="inline mr-1"/>PIÙ POPOLARE</span>
              <div className="flex flex-col sm:flex-row justify-between items-center mb-1">
                <h4 className="font-bold text-lg sm:text-xl text-teal-700 mb-1 sm:mb-0">Premium Annuale</h4>
                <p className="text-xl sm:text-2xl font-bold text-teal-700">€47<span className="text-md sm:text-lg">.99</span><span className="text-xs sm:text-sm font-normal text-slate-500">/anno</span></p>
              </div>
              <ul className="list-disc list-inside space-y-0.5 sm:space-y-1 text-xs sm:text-sm text-slate-600 pl-1">
                <li>Tutti i vantaggi del Mensile</li>
                <li><span className="font-semibold text-teal-600">Sconto del 20%</span> rispetto al piano mensile</li>
                <li>Icona profilo Premium speciale <Sparkles size={14} className="inline fill-teal-400 text-teal-500"/></li>
              </ul>
            </div>
          </div>
          <p className="text-xs text-center text-slate-500 pt-2 sm:pt-3">Puoi annullare l'abbonamento in qualsiasi momento.</p>
        </div>
        <div className="p-4 sm:p-5 border-t border-slate-200 mt-auto sticky bottom-0 bg-white/80 backdrop-blur-sm rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full bg-slate-500 hover:bg-slate-600 text-white font-semibold py-3 sm:py-3.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 shadow-md hover:shadow-lg active:scale-95"
          >
            Forse più Tardi
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default SubscriptionModal;