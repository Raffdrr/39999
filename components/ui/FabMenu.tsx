import React, { useState } from 'react';
import { CalendarPlusIcon, ClipboardIcon } from '../icons/secondary';
import { useUIStore } from '../../stores';

// Custom fluid icon component for a smoother animation between + and X
const FluidIcon: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  const lineBaseClasses = "absolute h-[3px] w-6 bg-white rounded-full transition-transform duration-300 ease-in-out";
  return (
    <div className="relative w-8 h-8 flex items-center justify-center">
      <div
        className={`${lineBaseClasses} ${isOpen ? 'rotate-45' : 'rotate-0'}`}
      />
      <div
        className={`${lineBaseClasses} ${isOpen ? '-rotate-45' : 'rotate-90'}`}
      />
    </div>
  );
};


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
          <div className="absolute bottom-full right-0 mb-3 flex flex-col items-end gap-4 w-max animate-fab-menu-open">
            <div className="flex items-center gap-3">
              <span className="bg-white dark:bg-slate-700 text-sm text-slate-700 dark:text-slate-200 font-semibold px-4 py-2 rounded-lg shadow-md">
                Crea Evento
              </span>
              <button
                onClick={() => handleActionClick('isCreateEventModalOpen')}
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 text-white flex items-center justify-center shadow-lg transition-all duration-200 ease-out hover:shadow-xl hover:-translate-y-1 active:scale-95 active:shadow-lg active:translate-y-0"
                aria-label="Crea un nuovo evento"
              >
                <CalendarPlusIcon size={28} />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-white dark:bg-slate-700 text-sm text-slate-700 dark:text-slate-200 font-semibold px-4 py-2 rounded-lg shadow-md">
                Proponi Tavolo
              </span>
              <button
                onClick={() => handleActionClick('isProposeTableModalOpen')}
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-500 text-white flex items-center justify-center shadow-lg transition-all duration-200 ease-out hover:shadow-xl hover:-translate-y-1 active:scale-95 active:shadow-lg active:translate-y-0"
                aria-label="Proponi un tavolo"
              >
                <ClipboardIcon size={28} />
              </button>
            </div>
          </div>
        )}

        <button
          onClick={handleToggle}
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-white flex items-center justify-center shadow-lg transition-all duration-300 ease-out hover:shadow-xl hover:scale-105 active:scale-95 active:shadow-md"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Chiudi menu azioni" : "Apri menu azioni"}
        >
          <FluidIcon isOpen={isOpen} />
        </button>
      </div>
  );
};

export default FabMenu;