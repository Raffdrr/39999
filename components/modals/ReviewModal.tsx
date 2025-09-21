import React, { useState } from 'react';
import ModalWrapper from './ModalWrapper';
import { X, ThumbsUp, Star, Send, AlertTriangle } from 'lucide-react';
import { Locale, Event } from '../../types';
import { useDataStore, useUIStore } from '../../stores';

interface ReviewModalProps {
  itemType: 'locale' | 'event';
  item: Locale | Event;
  onClose: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ itemType, item, onClose }) => {
  const { addReview } = useDataStore();
  const { showToast } = useUIStore();
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  if (!item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !reviewText.trim()) {
      showToast("Per favore, inserisci una valutazione e un testo per la recensione.", "error", <AlertTriangle size={18}/>);
      return;
    }
    addReview(itemType, item.id, rating, reviewText);
    onClose();
  };

  return (
    <ModalWrapper open={true} onClose={onClose}>
      <form onSubmit={handleSubmit} className="bg-gradient-to-br from-orange-100 via-yellow-50 to-emerald-100 dark:from-slate-900 dark:via-slate-800 dark:to-gray-900 rounded-2xl shadow-2xl w-full max-h-[90vh] flex flex-col">
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-t-2xl z-10">
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 sm:gap-2">
            <ThumbsUp size={22} className="text-amber-500" />Recensione per {item.name}
          </h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 sm:p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
            <X size={22} />
          </button>
        </div>
        <div className="overflow-y-auto p-4 sm:p-5 space-y-3 sm:space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 sm:mb-1.5">Valutazione*</label>
            <div className="flex items-center gap-0.5 sm:gap-1">
              {[1, 2, 3, 4, 5].map(starValue => (
                <Star
                  key={starValue}
                  size={30}
                  className={`cursor-pointer transition-colors ${rating >= starValue ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-600 hover:text-amber-300'}`}
                  onClick={() => setRating(starValue)}
                />
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">La tua recensione*</label>
            <textarea
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              rows={4}
              required
              placeholder={`Cosa ne pensi di ${item.name}?`}
              className="form-input"
            />
          </div>
        </div>
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-700 mt-auto sticky bottom-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-b-2xl">
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 sm:py-3.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 shadow-md hover:shadow-lg active:scale-95"
          >
            <Send size={18} /> Invia Recensione
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

export default ReviewModal;