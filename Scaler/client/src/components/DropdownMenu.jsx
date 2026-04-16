import { useState } from 'react';

/**
 * Reusable dropdown menu triggered by a kebab (⋮) button.
 * Handles its own open/close state internally.
 *
 * @param {{ items: Array<{ label, icon?, onClick, danger?, href?, divider? }>, menuRef? }} props
 *
 * Usage:
 *   <DropdownMenu items={[
 *     { label: 'Edit', icon: <svg>...</svg>, onClick: () => openEdit(event) },
 *     { divider: true },
 *     { label: 'Delete', icon: <svg>...</svg>, onClick: handleDelete, danger: true },
 *   ]} />
 */
export default function DropdownMenu({ items, onToggle, isOpen, menuRef }) {
  return (
    <div style={{ position: 'relative' }} ref={menuRef}>
      <button
        className="more-menu-btn"
        title="More options"
        onClick={onToggle}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="8" cy="3" r="1.5" />
          <circle cx="8" cy="8" r="1.5" />
          <circle cx="8" cy="13" r="1.5" />
        </svg>
      </button>

      {isOpen && (
        <div className="event-dropdown-menu">
          {items.map((item, idx) => {
            if (item.divider) {
              return <div key={idx} className="event-dropdown-divider" />;
            }

            const className = `event-dropdown-item ${item.danger ? 'event-dropdown-danger' : ''}`;

            if (item.href) {
              return (
                <a
                  key={idx}
                  className={className}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={item.onClick}
                >
                  {item.icon}
                  {item.label}
                </a>
              );
            }

            return (
              <button key={idx} className={className} onClick={item.onClick}>
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
