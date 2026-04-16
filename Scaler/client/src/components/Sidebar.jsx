import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Sidebar({ collapsed, onToggle }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleCreate = () => {
    if (pathname !== '/') {
      navigate('/?action=create');
    } else {
      window.dispatchEvent(new Event('open-create-modal'));
    }
  };

  const NAV_ITEMS = [
    {
      path: '/',
      label: 'Scheduling',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      path: '/meetings',
      label: 'Meetings',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      path: '/availability',
      label: 'Availability',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      path: '/contacts',
      label: 'Contacts',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      path: '#workflows',
      label: 'Workflows',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      path: '#integrations',
      label: 'Integrations & apps',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
        </svg>
      ),
    },
    {
      path: '#routing',
      label: 'Routing',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
    },
  ];

  const BOTTOM_ITEMS = [
    {
      path: '#analytics',
      label: 'Analytics',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      path: '#admin',
      label: 'Admin center',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
  ];

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`} id="sidebar">
      {/* Logo & Collapse */}
      <div className="sidebar-logo">
        <Link to="/">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="14" fill="#006BFF" />
            <path
              d="M8.5 14.5L12.5 18.5L19.5 11.5"
              stroke="white"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="sidebar-logo-text">Calendly</span>
        </Link>
        <button
          className="sidebar-collapse-btn"
          onClick={onToggle}
          title="Collapse sidebar"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M10 4L6 8l4 4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14 4L10 8l4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Create Button */}
      <button className="sidebar-create-btn" id="sidebar-create-btn" onClick={handleCreate}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7 1v12M1 7h12" strokeLinecap="round" />
        </svg>
        Create
      </button>

      {/* Main Navigation */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map(({ path, label, icon }) => {
          const isActive = path === '/' ? pathname === '/' : pathname.startsWith(path);
          const isHash = path.startsWith('#');

          if (isHash) {
            return (
              <button
                key={path}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              >
                <span className="nav-icon">{icon}</span>
                {label}
              </button>
            );
          }

          return (
            <Link
              key={path}
              to={path}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="sidebar-bottom">
        <button className="sidebar-upgrade-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          Upgrade plan
        </button>
        {BOTTOM_ITEMS.map(({ path, label, icon }) => (
          <button key={path} className="sidebar-nav-item">
            <span className="nav-icon">{icon}</span>
            {label}
          </button>
        ))}
        <button className="sidebar-nav-item">
          <span className="nav-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          Help
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginLeft: '4px' }}>
            <path d="M3 4l2 2 2-2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
