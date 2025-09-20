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
      <div className="bg-white rounded-2xl shadow-2xl w-full">
        <div className="p-5 sm:p-6 flex flex-col items-center text-center">
            <div className="p-3 bg-red-100 rounded-full mb-3 sm:mb-4">
                <AlertTriangle size={32} className="text-red-500" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-800">Conferma Logout</h3>
            <p className="text-sm text-slate-500 mt-2">Sei sicuro di voler uscire dal tuo account?</p>
            <div className="flex gap-3 mt-5 sm:mt-6 w-full">
                <button 
                  onClick={onClose} 
                  className="flex-1 py-2.5 px-4 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold transition-colors active:scale-95">
                    Annulla
                </button>
                <button 
                  onClick={onConfirm} 
                  className="flex-1 py-2.5 px-4 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg active:scale-95">
                    <LogOut size={16} /> Esci
                </button>
            </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default LogoutConfirmationModal;