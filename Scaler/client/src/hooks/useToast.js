import { useState, useCallback } from 'react';

/**
 * Custom hook for managing toast notifications.
 * Provides consistent toast state management across all pages.
 *
 * @returns {{ toast, showToast, clearToast }}
 *
 * Usage:
 *   const { toast, showToast, clearToast } = useToast();
 *   showToast('Event saved!');
 *   showToast('Something failed', 'error');
 */
export default function useToast() {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  const clearToast = useCallback(() => {
    setToast(null);
  }, []);

  return { toast, showToast, clearToast };
}
