import React, { useEffect, useRef } from 'react';

interface FullScreenModalWrapperProps {
  children: React.ReactNode;
  onClose: () => void;
  open: boolean;
}

const FullScreenModalWrapper: React.FC<FullScreenModalWrapperProps> = ({
  children,
  onClose,
  open,
}) => {
  const modalPaneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.keyCode === 27 && open) {
        onClose();
      }
    };
    if (open) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEsc);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose, open]);

  return (
    <div
      ref={modalPaneRef}
      className={`fixed inset-0 z-40 flex flex-col 
                  bg-gradient-to-br from-slate-100 via-slate-200 to-gray-200 
                  transition-transform duration-300 ease-in-out
                  ${open ? 'translate-y-0' : 'translate-y-full'}
                  ${open ? 'visible' : 'invisible'}`}
      role="dialog"
      aria-modal="true"
    >
      {children}
    </div>
  );
};

export default FullScreenModalWrapper;