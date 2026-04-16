import { useEffect, useRef } from 'react';

/**
 * Custom hook that fires a callback when the user clicks
 * outside of the referenced element.
 *
 * @param {Function} handler - callback to invoke on outside click
 * @param {boolean}  active  - only listen when true (default: true)
 * @returns {React.RefObject}
 *
 * Usage:
 *   const ref = useClickOutside(() => setOpen(false), isOpen);
 *   <div ref={ref}>...</div>
 */
export default function useClickOutside(handler, active = true) {
  const ref = useRef(null);

  useEffect(() => {
    if (!active) return;

    const listener = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        handler();
      }
    };

    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [handler, active]);

  return ref;
}
