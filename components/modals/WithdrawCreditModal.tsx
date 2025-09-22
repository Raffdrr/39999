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
      <form onSubmit={handleSubmit} className="bg-slate-50 dark:bg-black/90 dark:backdrop-blur-xl rounded-2xl shadow-2xl w-full max-h-[90vh] flex flex-col border border-slate-200/80 dark:border-slate-700/60">
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-700/80 flex justify-between items-center sticky top-0 bg-slate-50/80 dark:bg-black/80 backdrop-blur-lg rounded-t-2xl z-10">
          <h2 className="text-lg sm:text-xl font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5 sm:gap-2">
            <Banknote size={22} />Ritira Credito
          </h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-300 p-1 sm:p-1.5 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors">
            <X size={22} />
          </button>
        </div>
        <div className="overflow-y-auto p-4 sm:p-5 space-y-3 sm:space-y-4">
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">Credito disponibile: <span className="font-bold text-emerald-600 dark:text-emerald-400">€{currentCredit.toFixed(2)}</span></p>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Importo da Ritirare (€)*</label>
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
          <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 bg-emerald-50 dark:bg-emerald-500/10 p-2.5 sm:p-3 rounded-md border border-emerald-200 dark:border-emerald-500/20">
            Il ritiro del credito è simulato.
          </p>
        </div>
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-700/80 mt-auto sticky bottom-0 bg-slate-50/80 dark:bg-black/80 backdrop-blur-lg rounded-b-2xl">
          <button
            type="submit"
            className="w-full bg-gradient-to-br from-emerald-500 to-green-500 text-white font-semibold py-3 sm:py-3.5 px-4 rounded-xl transition-all duration-200 ease-out flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 active:shadow-md"
          >
            <TrendingUp size={18} /> Conferma Ritiro
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

export default WithdrawCreditModal;