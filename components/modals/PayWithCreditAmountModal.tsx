import React, { useState, useEffect } from 'react';
import ModalWrapper from './ModalWrapper';
import { X, Banknote, CheckCircle, AlertTriangle } from 'lucide-react';
import { PayWithCreditAmountModalData } from '../../types';
import { useUserStore, useDataStore, useUIStore } from '../../stores';

interface PayWithCreditAmountModalProps {
  data: PayWithCreditAmountModalData;
  onClose: () => void;
}

const PayWithCreditAmountModal: React.FC<PayWithCreditAmountModalProps> = ({ 
    data, onClose 
}) => {
  // Fix: Corrected property name from `userCredit` to `credit`.
  const { credit, payEventFeeWithCredit } = useUserStore();
  const { applyCreditToBill } = useDataStore();
  const { showToast } = useUIStore();
  const [amountToPay, setAmountToPay] = useState("");

  useEffect(() => {
    if (data) {
      if (data.isEventFee && data.maxAmount) { // Event fee
        setAmountToPay(data.maxAmount.toFixed(2));
      } else { // Locale bill contribution
        setAmountToPay(""); 
      }
    }
  }, [data]);

  const onConfirmPayment = (itemType: 'locale' | 'event', itemId: string, amount: number, isEventFee?: boolean) => {
    if (isEventFee) {
      payEventFeeWithCredit(itemId, amount);
    } else {
      applyCreditToBill(itemId, amount);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(amountToPay);

    if (isNaN(amount) || amount <= 0) {
      showToast("Inserisci un importo valido.", "error", <AlertTriangle size={18}/>);
      return;
    }
    if (amount > credit) {
      showToast("Credito insufficiente per questo importo.", "error", <AlertTriangle size={18}/>);
      return;
    }

    if (data.isEventFee && data.maxAmount && amount !== data.maxAmount) {
         showToast(`L'importo deve essere €${data.maxAmount.toFixed(2)} per la quota evento.`, "error", <AlertTriangle size={18}/>);
        return;
    }
    
    if (!data.isEventFee && data.maxAmount !== undefined) { // Locale bill
        const totalBill = data.maxAmount; 
        const alreadyContributed = data.currentContribution || 0;
        const remainingOnBill = totalBill - alreadyContributed;
        if (amount > remainingOnBill) {
            showToast(`Puoi applicare al massimo €${remainingOnBill.toFixed(2)} (il rimanente del conto).`, "error", <AlertTriangle size={18}/>);
            return;
        }
    }
    
    onConfirmPayment(data.itemType, data.itemId, amount, data.isEventFee);
    onClose();
  };

  let maxAllowedInput: number;
  let placeholderText: string;
  let titleText = "Paga con Credito";
  let itemDetailsText = `Stai pagando per: ${data.itemName}`;

  if (data.isEventFee && data.maxAmount) { // Event Fee
    titleText = "Paga Quota Evento";
    itemDetailsText = `Quota per ${data.itemName}: €${data.maxAmount.toFixed(2)}`;
    maxAllowedInput = Math.min(credit, data.maxAmount);
    placeholderText = `€${data.maxAmount.toFixed(2)}`; 
  } else if (!data.isEventFee && data.maxAmount !== undefined) { // Locale Bill
    titleText = "Applica Credito al Conto";
    const totalBill = data.maxAmount;
    const alreadyContributedByPlayer = data.currentContribution || 0;
    const remainingOnBill = totalBill - alreadyContributedByPlayer;
    itemDetailsText = `Conto per ${data.itemName}: €${totalBill.toFixed(2)} (Già applicato da te: €${alreadyContributedByPlayer.toFixed(2)})`;
    maxAllowedInput = Math.min(credit, remainingOnBill);
    placeholderText = `Max €${maxAllowedInput.toFixed(2)} (Rimanente: €${remainingOnBill.toFixed(2)})`;
  } else { // Fallback
    maxAllowedInput = credit;
    placeholderText = `Max €${credit.toFixed(2)}`;
  }

  return (
    <ModalWrapper open={!!data} onClose={onClose} customClasses="max-w-sm w-full">
      <form onSubmit={handleSubmit} className="bg-gradient-to-br from-orange-100 via-yellow-50 to-emerald-100 rounded-2xl shadow-2xl w-full max-h-[90vh] flex flex-col">
        <div className="p-4 sm:p-5 border-b border-emerald-200 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-sm rounded-t-2xl z-10">
          <h2 className="text-lg sm:text-xl font-bold text-emerald-700 flex items-center gap-1.5 sm:gap-2">
            <Banknote size={22} />{titleText}
          </h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-emerald-600 p-1 sm:p-1.5 rounded-full hover:bg-emerald-100 transition-colors">
            <X size={22} />
          </button>
        </div>
        <div className="overflow-y-auto p-4 sm:p-5 space-y-3 sm:space-y-4">
          <p className="text-xs sm:text-sm text-slate-700">
            {itemDetailsText}
          </p>
          <p className="text-xs sm:text-sm text-slate-600">
            Credito disponibile: <span className="font-bold text-emerald-600">€{credit.toFixed(2)}</span>
          </p>
          <div>
            <label htmlFor="amountToPay" className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
                {data.isEventFee ? "Importo Quota (€)*" : "Credito da Applicare Ora (€)*"}
            </label>
            <input
              id="amountToPay"
              type="number"
              value={amountToPay}
              onChange={e => setAmountToPay(e.target.value)}
              readOnly={data.isEventFee && !!data.maxAmount} 
              step="0.01"
              min="0.01"
              max={maxAllowedInput > 0 ? maxAllowedInput : undefined}
              required
              placeholder={placeholderText}
              className={`form-input focus:ring-emerald-500 focus:border-emerald-500 ${data.isEventFee && !!data.maxAmount ? 'bg-slate-100' : ''}`}
              autoFocus
            />
          </div>
           {maxAllowedInput <= 0 && !data.isEventFee && (
                <p className="text-[10px] text-orange-600">Il conto è già coperto o non hai credito sufficiente per il rimanente.</p>
           )}
           {amountToPay && parseFloat(amountToPay) > maxAllowedInput && maxAllowedInput > 0 && (
             <p className="text-[10px] text-red-600">L'importo supera il massimo applicabile di €{maxAllowedInput.toFixed(2)}.</p>
           )}
        </div>
        <div className="p-4 sm:p-5 border-t border-emerald-200 mt-auto sticky bottom-0 bg-white/80 backdrop-blur-sm rounded-b-2xl">
          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 sm:py-3.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 shadow-md hover:shadow-lg active:scale-95"
            disabled={maxAllowedInput <=0 && !data.isEventFee} 
          >
            <CheckCircle size={18} /> {data.isEventFee ? "Conferma Pagamento Quota" : "Applica Credito"}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

export default PayWithCreditAmountModal;