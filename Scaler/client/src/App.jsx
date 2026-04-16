import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import EventsPage from './pages/EventsPage';
import AvailabilityPage from './pages/AvailabilityPage';
import BookingPage from './pages/BookingPage';
import ConfirmationPage from './pages/ConfirmationPage';
import MeetingsPage from './pages/MeetingsPage';
import ContactsPage from './pages/ContactsPage';

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <Router>
      <div className="app-layout">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          <TopHeader />
          <Routes>
            <Route path="/" element={<EventsPage />} />
            <Route path="/availability" element={<AvailabilityPage />} />
            <Route path="/book/:slug" element={<BookingPage />} />
            <Route path="/confirmation" element={<ConfirmationPage />} />
            <Route path="/meetings" element={<MeetingsPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
          </Routes>
        </div>

        {/* Chat widget — Calendly's Intercom-style bubble */}
        <button className="chat-widget" title="Chat with us">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      </div>
    </Router>
  );
}
