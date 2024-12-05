import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimes, faInfoCircle, faExclamationTriangle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info' | 'loading' | 'custom' | 'default';
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, type = 'success', duration = 3000, onClose }: ToastProps): JSX.Element {
  useEffect((): (() => void) => {
    const timer: ReturnType<typeof setTimeout> = setTimeout((): void => {
      onClose();
    }, duration);

    return (): void => clearTimeout(timer);
  }, [duration, onClose]);

  const getIconAndColor = (): { icon: IconDefinition; color: string } => {
    switch (type) {
      case 'success':
        return { icon: faCheckCircle, color: 'text-green-500' };
      case 'error':
        return { icon: faTimes, color: 'text-red-500' };
      case 'warning':
        return { icon: faExclamationTriangle, color: 'text-yellow-500' };
      case 'info':
        return { icon: faInfoCircle, color: 'text-blue-500' };
      case 'loading':
        return { icon: faSpinner, color: 'text-gray-500' };
      default:
        return { icon: faInfoCircle, color: 'text-gray-500' };
    }
  };

  const { icon, color } = getIconAndColor();

  return (
    <div className="fixed top-4 right-4 z-50 animate-fade-in">
      <div className="glass-card p-4 rounded-lg shadow-lg flex items-center gap-3">
        <FontAwesomeIcon 
          icon={icon}
          className={`${color} ${type === 'loading' ? 'animate-spin' : ''}`}
        />
        <p className="text-gray-800">{message}</p>
      </div>
    </div>
  );
}