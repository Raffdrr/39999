import React, { useState } from 'react';
import { Plus, ClipboardList, CalendarPlus } from 'lucide-react';
import { useUIStore } from '../../stores';

const FabMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { openModal } = useUIStore();

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(prev => !prev);
  }

  const handleActionClick = (modalName: 'isProposeTableModalOpen' | 'isCreateEventModalOpen') => {
    openModal(modalName, true);
    setIsOpen(false);
  };
  
  // Close menu if clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => setIsOpen(false);
    if (isOpen) {
      window.addEventListener('click', handleClickOutside);
    }
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  return (
      <div className="relative flex-shrink-0" onClick={(e) => e.stopPropagation()}>
        {isOpen && (
          <div className="absolute bottom-full right-0 mb-2 flex flex-col items-end gap-3 w-max animate-fab-menu-open">
            <div className="flex items-center gap-3">
              <span className="bg-white text-xs text-slate-700 font-semibold px-3 py-1.5 rounded-lg shadow-md">
                Crea Evento
              </span>
              <button
                onClick={() => handleActionClick('isCreateEventModalOpen')}
                className="w-12 h-12 rounded-full bg-white text-rose-500 flex items-center justify-center shadow-lg hover:bg-rose-50 transition-colors"
                aria-label="Crea un nuovo evento"
              >
                <CalendarPlus size={24} />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-white text-xs text-slate-700 font-semibold px-3 py-1.5 rounded-lg shadow-md">
                Proponi Tavolo
              </span>
              <button
                onClick={() => handleActionClick('isProposeTableModalOpen')}
                className="w-12 h-12 rounded-full bg-white text-sky-500 flex items-center justify-center shadow-lg hover:bg-sky-50 transition-colors"
                aria-label="Proponi un tavolo"
              >
                <ClipboardList size={24} />
              </button>
            </div>
          </div>
        )}

        <button
          onClick={handleToggle}
          className="p-3 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-sm transition-all duration-300 hover:bg-rose-600 active:scale-95"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Chiudi menu azioni" : "Apri menu azioni"}
        >
          <div className="transition-transform duration-300" style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}>
            <Plus size={24} />
          </div>
        </button>
      </div>
  );
};

export default FabMenu;