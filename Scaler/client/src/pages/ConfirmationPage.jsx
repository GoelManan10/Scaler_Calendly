import { useLocation, Link } from 'react-router-dom';
import { formatDate, formatTime } from '../utils/helpers';

export default function ConfirmationPage() {
  const { state } = useLocation();

  if (!state) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-text-primary mb-2">No Booking Found</h2>
          <p className="text-sm text-text-secondary mb-6">You arrived here without completing a booking.</p>
          <Link to="/" className="px-5 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors">
            Browse Events
          </Link>
        </div>
      </div>
    );
  }

  const { eventName, duration, date, time, name, email } = state;

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 sm:p-6 lg:p-10">
      <div className="bg-card rounded-xl shadow-lg border border-border-light w-full max-w-lg overflow-hidden animate-scale-in">
        {/* Success header bar */}
        <div className="bg-primary-light px-6 py-5 border-b border-border-light">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-text-primary">You are scheduled</h1>
              <p className="text-sm text-text-secondary">
                A calendar invitation has been sent to your email.
              </p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="p-6 space-y-4">
          <h2 className="text-base font-bold text-text-primary">{eventName}</h2>

          <div className="space-y-3">
            <DetailRow icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            } value={name} />

            <DetailRow icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            } value={email} />

            <DetailRow icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            } value={`${formatTime(time)}, ${formatDate(date)}`} />

            <DetailRow icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            } value={`${duration} minutes`} />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border-light bg-bg flex items-center justify-center gap-4">
          <Link
            to="/"
            className="text-sm font-medium text-text-link hover:underline"
          >
            Schedule another event
          </Link>
          <span className="text-border">|</span>
          <Link
            to="/meetings"
            className="text-sm font-medium text-text-link hover:underline"
          >
            View all meetings
          </Link>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ icon, value }) {
  return (
    <div className="flex items-center gap-3 text-sm text-text-secondary">
      <span className="text-text-tertiary flex-shrink-0">{icon}</span>
      <span>{value}</span>
    </div>
  );
}
