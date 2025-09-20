
import React, { useEffect, useRef } from 'react';

interface ModalWrapperProps {
  children: React.ReactNode;
  onClose: () => void;
  open: boolean;
  customClasses?: string;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({
  children,
  onClose,
  open,
  customClasses = "max-w-lg w-full",
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.keyCode === 27) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && e.target === modalRef.current) {
      onClose();
    }
  };

  return (
    <div
      ref={modalRef}
      onClick={handleBackdropClick}
      className={`fixed inset-0 flex items-center justify-center p-3 sm:p-4 z-50 transition-opacity duration-300 ease-out ${
        open ? 'opacity-100 visible bg-black/70 backdrop-blur-md' : 'opacity-0 invisible'
      }`}
    >
      <div
        className={`transition-all duration-300 ease-out ${
          open ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-10'
        } ${customClasses}`}
      >
        {children}
      </div>
    </div>
  );
};

export default ModalWrapper;
