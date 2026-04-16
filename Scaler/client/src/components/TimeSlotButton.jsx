import { formatTime } from '../utils/helpers';

export default function TimeSlotButton({ time, selected, disabled, onClick, showConfirm, onConfirm }) {
  if (disabled) {
    return (
      <button
        disabled
        className="w-full px-4 py-3 rounded-lg border border-border-light text-text-tertiary text-sm font-medium cursor-not-allowed line-through opacity-50"
      >
        {formatTime(time)}
      </button>
    );
  }

  /* Calendly: when selected, the slot turns to a dark bg + a "Next" button slides in beside it */
  if (selected) {
    return (
      <div className="flex gap-2 animate-scale-in">
        <button className="flex-1 px-4 py-3 rounded-lg bg-[#333333] text-white text-sm font-semibold">
          {formatTime(time)}
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 px-4 py-3 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors"
        >
          Next
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      className="w-full px-4 py-3 rounded-lg border border-primary text-primary text-sm font-semibold hover:bg-primary-light transition-all duration-150"
    >
      {formatTime(time)}
    </button>
  );
}
