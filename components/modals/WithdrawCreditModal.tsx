import React, { useState } from 'react';
import ModalWrapper from './ModalWrapper';
import { X, Banknote, TrendingUp, AlertTriangle } from 'lucide-react';
import { useUserStore, useUIStore } from '../../stores';

interface WithdrawCreditModalProps {
  currentCredit: number;
  onClose: () => void;
}

const WithdrawCreditModal: React.FC<WithdrawCreditModalProps> = ({ currentCredit, onClose }) => {
  // Fix: Corrected property name from `updateUserCredit` to `updateCredit`.
  const { updateCredit } = useUserStore();
  const { showToast } = useUIStore();
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      showToast("Inserisci un importo valido da ritirare.", "error", <AlertTriangle size={18}/>);
      return;
    }
    if (amount > currentCredit) {
      showToast("L'importo da ritirare non può superare il tuo credito disponibile.", "error", <AlertTriangle size={18}/>);
      return;
    }
    updateCredit(-amount);
    showToast(`Hai ritirato €${amount.toFixed(2)}. Il tuo novo saldo è €${(currentCredit - amount).toFixed(2)}. (Simulazione)`, "success", <Banknote size={18}/>);
    onClose();
  };

  return (
    <ModalWrapper open={true} onClose={onClose}>
      <form onSubmit={handleSubmit} className="bg-gradient-to-br from-orange-100 via-yellow-50 to-emerald-100 rounded-2xl shadow-2xl w-full max-h-[90vh] flex flex-col">
        <div className="p-4 sm:p-5 border-b border-emerald-200 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-sm rounded-t-2xl z-10">
          <h2 className="text-lg sm:text-xl font-bold text-emerald-700 flex items-center gap-1.5 sm:gap-2">
            <Banknote size={22} />Ritira Credito
          </h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-emerald-600 p-1 sm:p-1.5 rounded-full hover:bg-emerald-100 transition-colors">
            <X size={22} />
          </button>
        </div>
        <div className="overflow-y-auto p-4 sm:p-5 space-y-3 sm:space-y-4">
          <p className="text-xs sm:text-sm text-slate-600">Credito disponibile: <span className="font-bold text-emerald-600">€{currentCredit.toFixed(2)}</span></p>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">Importo da Ritirare (€)*</label>
            <input
              type="number"
              value={withdrawAmount}
              onChange={e => setWithdrawAmount(e.target.value)}
              step="0.01"
              min="0.01"
              max={currentCredit}
              required
              placeholder={`Max €${currentCredit.toFixed(2)}`}
              className="form-input focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <p className="text-[10px] sm:text-xs text-slate-500 bg-emerald-50 p-2.5 sm:p-3 rounded-md border border-emerald-200">
            Il ritiro del credito è simulato.
          </p>
        </div>
        <div className="p-4 sm:p-5 border-t border-emerald-200 mt-auto sticky bottom-0 bg-white/80 backdrop-blur-sm rounded-b-2xl">
          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 sm:py-3.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 shadow-md hover:shadow-lg active:scale-95"
          >
            <TrendingUp size={18} /> Conferma Ritiro
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

export default WithdrawCreditModal;