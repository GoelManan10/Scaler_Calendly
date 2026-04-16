import { Link } from 'react-router-dom';

const COLOR_BARS = [
  'bg-primary',
  'bg-accent',
  'bg-[#7B61FF]',
  'bg-[#E91E63]',
  'bg-[#00BCD4]',
  'bg-[#FF7043]',
];

export default function EventCard({ event, onEdit, onDelete, index = 0 }) {
  const barColor = COLOR_BARS[index % COLOR_BARS.length];
  const durationLabel = event.duration >= 60
    ? `${event.duration / 60} hr`
    : `${event.duration} min`;

  return (
    <div className="bg-card rounded-lg border border-border-light hover:shadow-md transition-all duration-200 overflow-hidden group animate-fade-in">
      {/* Colored top bar — Calendly signature */}
      <div className={`h-1.5 ${barColor}`} />

      <div className="p-5">
        {/* Event name */}
        <h3 className="text-base font-semibold text-text-primary mb-1 leading-snug">
          {event.name}
        </h3>

        {/* Duration + Slug */}
        <p className="text-sm text-text-tertiary mb-1">
          {durationLabel}, One-on-One
        </p>
        <p className="text-sm text-text-link font-medium mb-4">
          <Link to={`/book/${event.slug}`} className="hover:underline">
            View booking page
          </Link>
        </p>

        {/* Divider */}
        <div className="border-t border-border-light pt-3 flex items-center justify-between">
          {/* Copy link */}
          <button
            onClick={() => {
              navigator.clipboard.writeText(`${window.location.origin}/book/${event.slug}`);
            }}
            className="text-sm text-primary font-medium hover:text-primary-hover transition-colors flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy link
          </button>

          {/* Action buttons */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(event)}
              className="p-2 rounded-md text-text-tertiary hover:text-text-primary hover:bg-bg transition-colors"
              title="Edit"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(event.id)}
              className="p-2 rounded-md text-text-tertiary hover:text-danger hover:bg-danger-bg transition-colors"
              title="Delete"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
