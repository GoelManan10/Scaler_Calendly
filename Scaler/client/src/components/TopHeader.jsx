export default function TopHeader() {
  return (
    <header className="top-header" id="top-header">
      {/* User/Team icon */}
      <button className="top-header-icon" title="Team members">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Avatar */}
      <div className="top-header-avatar" style={{ position: 'relative' }}>
        M
        <svg
          width="8" height="8"
          viewBox="0 0 8 8"
          style={{ position: 'absolute', bottom: '-1px', right: '-1px' }}
        >
          <path d="M2 3l2 2 2-2" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </header>
  );
}
