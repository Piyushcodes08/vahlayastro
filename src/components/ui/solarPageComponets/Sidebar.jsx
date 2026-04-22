import React from 'react';

export const Sidebar = React.memo(function Sidebar({ planets, currentIndex, onPlanetSelect }) {
  return (
    <aside className="sidebar">
      {planets.map((p, i) => {
        const isActive = currentIndex === i;
        return (
          <button
            key={p.id}
            onClick={() => onPlanetSelect(i)}
            className={`sb-item ${isActive ? 'active' : ''}`}
          >
            <div className="sb-icon-wrapper" style={{ borderColor: isActive ? p.color : 'rgba(255,255,255,0.2)' }}>
              <div className="sb-mini-planet" style={{ backgroundImage: `url(${p.img})`, opacity: isActive ? 1 : 0.3 }}></div>
            </div>
            <div className="sb-line" style={{ backgroundColor: isActive ? p.color : 'transparent' }} />
            <div className="sb-text">
              <div className="sb-name" style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.4)' }}>{p.name.toUpperCase()}</div>
              <div className="sb-au" style={{ color: isActive ? p.color : 'rgba(255,255,255,0.2)' }}>{p.au}</div>
            </div>
          </button>
        );
      })}
    </aside>
  );
});
