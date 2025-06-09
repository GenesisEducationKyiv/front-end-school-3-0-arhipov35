import { useState, useEffect } from 'react';
import { Toast as ToastType, ToastType as ToastVariant } from '../../../contexts/ToastContext';
import '../../../styles/toast.scss';

interface ToastProps {
  toast: ToastType;
  onClose: (id: string) => void;
}

const Toast = ({ toast, onClose }: ToastProps) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isClosing) {
      const timeout = setTimeout(() => {
        onClose(toast.id);
      }, 300); // Matching the animation duration
      
      return () => clearTimeout(timeout);
    }
  }, [isClosing, onClose, toast.id]);

  const handleClose = () => {
    setIsClosing(true);
  };

  const getIcon = (type: ToastVariant) => {
    switch (type) {
      case 'success':
        return <i className="bi bi-check-circle-fill"></i>;
      case 'error':
        return <i className="bi bi-x-circle-fill"></i>;
      case 'warning':
        return <i className="bi bi-exclamation-triangle-fill"></i>;
      case 'info':
        return <i className="bi bi-info-circle-fill"></i>;
      default:
        return <i className="bi bi-bell-fill"></i>;
    }
  };

  return (
    <div 
      className={`toast toast--${toast.type} ${isClosing ? 'toast--closing' : ''}`}
      data-testid={`toast-${toast.type}`}
      role="alert"
      aria-live="assertive"
    >
      <div className="toast__icon">
        {getIcon(toast.type)}
      </div>
      <div className="toast__content">
        <p className="toast__message">{toast.message}</p>
      </div>
      <button 
        className="toast__close" 
        onClick={handleClose}
        aria-label="Close"
      >
        <i className="bi bi-x"></i>
      </button>
      {toast.duration !== Infinity && (
        <div 
          className="toast__progress"
          style={{
            animation: `progress ${toast.duration}ms linear forwards`
          }}
        ></div>
      )}
    </div>
  );
};

// Компонент-контейнер для всіх сповіщень
interface ToastContainerProps {
  toasts: ToastType[];
  onClose: (id: string) => void;
}

export const ToastContainer = ({ toasts, onClose }: ToastContainerProps) => {
  if (toasts.length === 0) return null;
  
  return (
    <div className="toast-container" data-testid="toast-container">
      {toasts.map(toast => (
        <Toast 
          key={toast.id} 
          toast={toast} 
          onClose={onClose}
        />
      ))}
    </div>
  );
};

export default Toast;
