import { Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/', label: 'Event Types' },
  { path: '/availability', label: 'Availability' },
  { path: '/meetings', label: 'Scheduled Events' },
];

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mr-10">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="16" fill="#2D9F3F"/>
              <path d="M10 16.5L14 20.5L22 12.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-[1.25rem] font-bold text-text-primary tracking-tight">
              Calendly
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden sm:flex items-center gap-1">
            {NAV_ITEMS.map(({ path, label }) => {
              const isActive = pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                    isActive
                      ? 'text-primary'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {label}
                  {isActive && (
                    <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-primary rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-3">
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-card bg-primary rounded-full hover:bg-primary-hover transition-colors"
            >
              + Create
            </Link>

            {/* Mobile Nav */}
            <div className="flex sm:hidden items-center gap-1">
              {NAV_ITEMS.map(({ path, label }) => {
                const isActive = pathname === path;
                return (
                  <Link
                    key={path}
                    to={path}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                      isActive
                        ? 'bg-primary-light text-primary'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {label.split(' ')[0]}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
