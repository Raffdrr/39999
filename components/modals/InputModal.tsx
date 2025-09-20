
import React, { useState, useEffect } from 'react';
import ModalWrapper from './ModalWrapper';
import { X, CheckCircle, AlertTriangle } from 'lucide-react';

interface InputModalProps {
  title: string;
  message?: string;
  inputLabel: string;
  inputType?: string;
  inputMode?: 'numeric' | 'decimal' | 'text' | 'tel' | 'search' | 'email' | 'url';
  placeholder?: string;
  initialValue?: string;
  confirmText?: string;
  min?: string;
  step?: string;
  onClose: () => void;
  onConfirm: (value: string) => void;
  showToast: (text: string, type?: "success" | "error" | "info", icon?: React.ReactNode) => void;
}

const InputModal: React.FC<InputModalProps> = ({
  title,
  message,
  inputLabel,
  inputType = 'text',
  inputMode,
  placeholder,
  initialValue = '',
  confirmText = 'Conferma',
  min,
  step,
  onClose,
  onConfirm,
  showToast,
}) => {
  const [inputValue, setInputValue] = useState(initialValue);

  useEffect(() => {
    // Update internal state if initialValue prop changes (e.g., if modal is reused with different data)
    setInputValue(initialValue);
  }, [initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() && inputType !== 'number' && inputType !== 'tel' && inputType !== 'date' && inputType !== 'time') {
      showToast("Il campo non può essere vuoto.", "error", <AlertTriangle size={18}/>);
      return;
    }
     if ((inputType === 'number' || inputType === 'tel') && min !== undefined) {
        const numericValue = parseFloat(inputValue);
        const minValue = parseFloat(min);
        if (!isNaN(numericValue) && !isNaN(minValue) && numericValue < minValue) {
            showToast(`Il valore deve essere almeno ${min}.`, "error", <AlertTriangle size={18}/>);
            return;
        }
        if (isNaN(numericValue) && inputValue.trim() !== "") { // if it's supposed to be a number but isn't
           showToast(`Inserisci un numero valido.`, "error", <AlertTriangle size={18}/>);
           return;
        }
    }
    onConfirm(inputValue);
  };

  return (
    <ModalWrapper open={true} onClose={onClose}>
      <form onSubmit={handleSubmit} className="bg-gradient-to-br from-orange-100 via-yellow-50 to-emerald-100 rounded-2xl shadow-2xl w-full max-h-[90vh] flex flex-col">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-sm rounded-t-2xl z-10">
          <h2 className="text-lg sm:text-xl font-bold text-slate-700 flex items-center gap-1.5 sm:gap-2">
            {/* You can add an icon here if needed, passed via props or fixed */}
            {title}
          </h2>
          <button type="button" onClick={onClose} aria-label="Chiudi modale" className="text-slate-400 hover:text-slate-600 p-1 sm:p-1.5 rounded-full hover:bg-slate-200 transition-colors">
            <X size={22} />
          </button>
        </div>
        <div className="overflow-y-auto p-4 sm:p-5 space-y-3 sm:space-y-4">
          {message && <p className="text-xs sm:text-sm text-slate-600">{message}</p>}
          <div>
            <label htmlFor="inputValueModalField" className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">{inputLabel}</label>
            <input
              id="inputValueModalField"
              type={inputType}
              inputMode={inputMode}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder={placeholder}
              min={min}
              step={step}
              required
              className="form-input w-full focus:ring-emerald-500 focus:border-emerald-500" // Added w-full assuming form-input might need it
              autoFocus
            />
          </div>
        </div>
        <div className="p-4 sm:p-5 border-t border-slate-200 mt-auto sticky bottom-0 bg-white/80 backdrop-blur-sm rounded-b-2xl">
          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 sm:py-3.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 shadow-md hover:shadow-lg active:scale-95"
          >
            <CheckCircle size={18} /> {confirmText}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

export default InputModal;