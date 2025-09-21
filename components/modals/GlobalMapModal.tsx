import React from 'react';
import ModalWrapper from './ModalWrapper';
import { X, Globe, Navigation } from 'lucide-react';

interface GlobalMapModalProps {
  onClose: () => void;
}

const GlobalMapModal: React.FC<GlobalMapModalProps> = ({ onClose }) => (
  <ModalWrapper open={true} onClose={onClose} customClasses="w-full max-w-4xl">
    <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl h-[85vh] flex flex-col p-3 sm:p-5">
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 sm:gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-orange-400 to-red-500 shadow-sm">
             <Globe size={18} className="text-white" />
          </div>
          Mappa Globale
        </h2>
        <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 sm:p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
          <X size={26} />
        </button>
      </div>
      <div className="flex-1 bg-slate-200 dark:bg-slate-800 rounded-xl sm:rounded-2xl flex items-center justify-center border border-slate-300 dark:border-slate-700">
        <div className="text-center text-slate-500 dark:text-slate-400 p-4 sm:p-5">
          <Navigation size={72} className="mx-auto mb-4 sm:mb-6 text-orange-400" />
          <p className="text-lg sm:text-xl font-medium">Caricamento mappa...</p>
          <p className="text-sm sm:text-md mt-1">(Demo: mappa non implementata)</p>
        </div>
      </div>
    </div>
  </ModalWrapper>
);

export default GlobalMapModal;