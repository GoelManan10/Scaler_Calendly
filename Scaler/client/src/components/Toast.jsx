import { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: 'bg-card border-primary text-text-primary',
    error: 'bg-card border-danger text-text-primary',
    info: 'bg-card border-accent text-text-primary',
  };
  const dots = { success: 'bg-primary', error: 'bg-danger', info: 'bg-accent' };

  return (
    <div className="fixed top-4 right-4 z-[100] animate-slide-up">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${styles[type]}`}>
        <span className={`w-2 h-2 rounded-full ${dots[type]} flex-shrink-0`} />
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={onClose}
          className="ml-2 text-text-tertiary hover:text-text-primary text-lg leading-none transition-colors"
        >
          ×
        </button>
      </div>
    </div>
  );
}
