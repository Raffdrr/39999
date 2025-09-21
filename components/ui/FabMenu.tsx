import React, { useState } from 'react';
import { CalendarPlusIcon, ClipboardIcon } from '../icons/secondary';
import { useUIStore } from '../../stores';

// Custom fluid icon component for a smoother animation between + and X
const FluidIcon: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  const lineBaseClasses = "absolute h-[2px] w-5 bg-white rounded-full transition-transform duration-300 ease-in-out";
  return (
    <div className="relative w-6 h-6 flex items-center justify-center">
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

  return (
      <div className="relative flex-shrink-0" onClick={(e) => e.stopPropagation()}>
        {/* Overlay to catch outside clicks and dim the background */}
        {isOpen && (
          <div
            className="fixed inset-0 z-30 animate-fade-in"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
        )}
        
        {/* Menu items container, needs to be above the overlay */}
        {isOpen && (
          <div className="absolute bottom-full right-0 mb-3 flex flex-col items-end gap-3 w-max animate-fab-menu-open z-40">
            <div className="flex items-center gap-3">
              <span className="bg-white dark:bg-slate-700 text-xs text-slate-700 dark:text-slate-200 font-semibold px-3 py-1.5 rounded-md shadow-sm">
                Crea Evento
              </span>
              <button
                onClick={() => handleActionClick('isCreateEventModalOpen')}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 text-white flex items-center justify-center shadow-md transition-all duration-200 ease-out hover:shadow-lg hover:-translate-y-1 active:scale-95 active:shadow-md active:translate-y-0"
                aria-label="Crea un nuovo evento"
              >
                <CalendarPlusIcon size={20} />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-white dark:bg-slate-700 text-xs text-slate-700 dark:text-slate-200 font-semibold px-3 py-1.5 rounded-md shadow-sm">
                Proponi Tavolo
              </span>
              <button
                onClick={() => handleActionClick('isProposeTableModalOpen')}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-500 text-white flex items-center justify-center shadow-md transition-all duration-200 ease-out hover:shadow-lg hover:-translate-y-1 active:scale-95 active:shadow-md active:translate-y-0"
                aria-label="Proponi un tavolo"
              >
                <ClipboardIcon size={20} />
              </button>
            </div>
          </div>
        )}

        {/* The FAB button itself, needs to be above the overlay */}
        <button
          onClick={handleToggle}
          className="relative z-40 w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white flex items-center justify-center shadow-lg transition-all duration-300 ease-out hover:shadow-xl hover:scale-105 active:scale-95 active:shadow-md"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Chiudi menu azioni" : "Apri menu azioni"}
        >
          <FluidIcon isOpen={isOpen} />
        </button>
      </div>
  );
};

export default FabMenu;