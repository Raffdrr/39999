import React, { useState } from 'react';
import ModalWrapper from './ModalWrapper';
import { X, Gift, Send, AlertTriangle } from 'lucide-react';
import { Event } from '../../types';
import { useDataStore, useUIStore } from '../../stores';

interface DonationModalProps {
  event: Event;
  onClose: () => void;
}

const DonationModal: React.FC<DonationModalProps> = ({ event, onClose }) => {
  const { makeDonation } = useDataStore();
  const { showToast } = useUIStore();
  const [amount, setAmount] = useState("");

  if (!event) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const donationAmount = parseFloat(amount);
    if (isNaN(donationAmount) || donationAmount <= 0) {
      showToast("Inserisci un importo valido per la donazione.", "error", <AlertTriangle size={18}/>);
      return;
    }
    makeDonation(event.id, donationAmount);
    onClose();
  };

  return (
    <ModalWrapper open={true} onClose={onClose}>
      <form onSubmit={handleSubmit} className="bg-gradient-to-br from-white via-pink-50 to-pink-100 rounded-2xl shadow-2xl w-full max-h-[90vh] flex flex-col">
        <div className="p-4 sm:p-5 border-b border-pink-200 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-sm rounded-t-2xl z-10">
          <h2 className="text-lg sm:text-xl font-bold text-pink-700 flex items-center gap-1.5 sm:gap-2">
            <Gift size={22} />Donazione per {event.name}
          </h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-pink-600 p-1 sm:p-1.5 rounded-full hover:bg-pink-100 transition-colors">
            <X size={22} />
          </button>
        </div>
        <div className="overflow-y-auto p-4 sm:p-5 space-y-3 sm:space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">Importo Donazione (€)*</label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              step="0.01"
              min="0.01"
              required
              placeholder="Es. 10.00"
              className="form-input focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
          <p className="text-[10px] sm:text-xs text-pink-600 bg-pink-50 p-2.5 sm:p-3 rounded-md border border-pink-200">
            La tua generosità fa la differenza! Obiettivo: €{event.donationGoal ? event.donationGoal.toLocaleString('it-IT') : 'N/D'}.
          </p>
        </div>
        <div className="p-4 sm:p-5 border-t border-pink-200 mt-auto sticky bottom-0 bg-white/80 backdrop-blur-sm rounded-b-2xl">
          <button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 sm:py-3.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 shadow-md hover:shadow-lg active:scale-95"
          >
            <Send size={18} /> Dona Ora
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

export default DonationModal;