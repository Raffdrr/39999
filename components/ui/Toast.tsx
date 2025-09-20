import React from 'react';
import { ToastMessage } from '../../types';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';

interface ToastProps {
  message: ToastMessage;
  onHide: () => void;
  onHomePage?: boolean;
}

const Toast: React.FC<ToastProps> = ({ message, onHide, onHomePage = false }) => {
  const { type, text, icon } = message;

  const typeStyles = {
    success: {
      bg: 'bg-green-500',
      icon: <CheckCircle className="w-5 h-5 text-white" />,
    },
    error: {
      bg: 'bg-red-500',
      icon: <AlertTriangle className="w-5 h-5 text-white" />,
    },
    info: {
      bg: 'bg-sky-500',
      icon: <Info className="w-5 h-5 text-white" />,
    },
  };

  const styles = typeStyles[type];
  const bottomPositionClass = onHomePage ? 'bottom-[150px]' : 'bottom-[90px]';

  return (
    <div
      className={`fixed ${bottomPositionClass} left-1/2 -translate-x-1/2 max-w-sm w-[90%] px-4 py-3 rounded-xl shadow-2xl text-white flex items-center gap-3 z-50 animate-toast-pop ${styles.bg}`}
      role="alert"
    >
      <div className="flex-shrink-0">
        {icon || styles.icon}
      </div>
      <span className="flex-1 text-sm font-medium">{text}</span>
    </div>
  );
};

export default Toast;