
import React from 'react';
import ModalWrapper from './ModalWrapper';
import { X, QrCode as QrCodeIcon, Info } from 'lucide-react';
import { PaymentCodeModalData } from '../../types';
import { SIMULATED_QR_CODE_URL } from '../../constants'; // Ensure this is added to constants

interface PaymentCodeModalProps {
  data: PaymentCodeModalData | null;
  onClose: () => void;
}

const PaymentCodeModal: React.FC<PaymentCodeModalProps> = ({ data, onClose }) => {
  if (!data) return null;

  return (
    <ModalWrapper open={!!data} onClose={onClose} customClasses="max-w-md w-full">
      <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-gray-900 rounded-2xl shadow-2xl w-full max-h-[90vh] flex flex-col text-white">
        <div className="p-4 sm:p-5 border-b border-slate-600 flex justify-between items-center sticky top-0 bg-slate-800/80 backdrop-blur-sm rounded-t-2xl z-10">
          <h2 className="text-lg sm:text-xl font-bold flex items-center gap-1.5 sm:gap-2">
            <QrCodeIcon size={22} className="text-emerald-400" />Codice Pagamento
          </h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-emerald-400 p-1 sm:p-1.5 rounded-full hover:bg-slate-700 transition-colors">
            <X size={22} />
          </button>
        </div>
        <div className="overflow-y-auto p-5 sm:p-6 space-y-4 sm:space-y-5 flex flex-col items-center">
          <p className="text-sm text-center text-slate-300">Mostra questo codice all'esercente per completare il pagamento.</p>
          
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-lg">
            <img 
              src={data.qrCodeUrl || SIMULATED_QR_CODE_URL} 
              alt="QR Code Pagamento" 
              className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
              onError={(e) => { (e.target as HTMLImageElement).src = SIMULATED_QR_CODE_URL; }}
            />
          </div>

          <div className="text-center mt-3 sm:mt-4">
            <p className="text-xs text-slate-400">oppure usa il codice:</p>
            <p className="text-2xl sm:text-3xl font-mono tracking-wider font-bold text-emerald-300 bg-slate-700 px-4 py-2 rounded-lg shadow-inner my-1 sm:my-2">
              {data.paymentCode}
            </p>
          </div>

          <div className="w-full mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-600 text-xs sm:text-sm text-slate-300 space-y-1.5">
            <div className="flex justify-between">
              <span className="font-semibold text-slate-200">Articolo:</span>
              <span>{data.itemName}</span>
            </div>
            {data.details && (
              <div className="flex justify-between">
                <span className="font-semibold text-slate-200">Dettagli:</span>
                <span>{data.details}</span>
              </div>
            )}
            {data.amount && (
              <div className="flex justify-between">
                <span className="font-semibold text-slate-200">Importo:</span>
                <span className="font-bold text-lg text-emerald-300">{data.amount}</span>
              </div>
            )}
          </div>
           <p className="text-[10px] sm:text-xs text-slate-500 mt-4 flex items-center gap-1">
            <Info size={12} /> Questo è un codice di pagamento simulato.
          </p>
        </div>
        <div className="p-4 sm:p-5 border-t border-slate-600 mt-auto sticky bottom-0 bg-slate-800/80 backdrop-blur-sm rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 sm:py-3.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 shadow-md hover:shadow-lg active:scale-95"
          >
            Chiudi
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default PaymentCodeModal;
