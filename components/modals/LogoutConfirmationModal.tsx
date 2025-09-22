import React from 'react';
import ModalWrapper from './ModalWrapper';
import { X, LogOut, AlertTriangle } from 'lucide-react';

interface LogoutConfirmationModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutConfirmationModal: React.FC<LogoutConfirmationModalProps> = ({ onClose, onConfirm }) => {
  return (
    <ModalWrapper open={true} onClose={onClose} customClasses="max-w-sm w-full">
      <div className="bg-white dark:bg-black rounded-2xl shadow-2xl w-full">
        <div className="p-5 sm:p-6 flex flex-col items-center text-center">
            <div className="p-3 bg-red-100 dark:bg-red-500/20 rounded-full mb-3 sm:mb-4">
                <AlertTriangle size={32} className="text-red-500" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100">Conferma Logout</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Sei sicuro di voler uscire dal tuo account?</p>
            <div className="flex gap-3 mt-5 sm:mt-6 w-full">
                <button 
                  onClick={onClose} 
                  className="flex-1 py-2.5 px-4 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold transition-all duration-200 ease-out active:scale-95 border border-slate-200 dark:border-slate-600 shadow hover:-translate-y-0.5 hover:shadow-lg active:shadow-sm active:translate-y-0">
                    Annulla
                </button>
                <button 
                  onClick={onConfirm} 
                  className="flex-1 py-2.5 px-4 rounded-lg bg-red-500 text-white font-semibold transition-all duration-200 ease-out flex items-center justify-center gap-1.5 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 active:shadow-md">
                    <LogOut size={16} /> Esci
                </button>
            </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default LogoutConfirmationModal;