import React from 'react';

export const PlanetDetails = React.memo(function PlanetDetails({ planet, isOpen, onClose }) {
  if (!planet) return null;

  return (
    <div className={`details-panel ${isOpen ? 'open' : ''}`}>
      <div className="details-overlay" onClick={onClose}></div>
      <div className="details-content">
        <button className="details-back" onClick={onClose}>
          ← BACK
        </button>

        <div className="details-header">
           <img src={planet.img} alt={planet.name} className="details-planet-img" loading="lazy" width="800" height="800" />
        </div>

        <div className="details-body">
          <div className="details-name-wrap">
            <div className="details-type" style={{ color: planet.color }}>PLANET</div>
            <h1 className="details-name" style={{ borderBottomColor: planet.color }}>{planet.name}</h1>
            <div className="details-au">{planet.au} FROM THE SUN</div>
          </div>

          <div className="details-facts">
            {planet.details?.map((fact) => (
              <div key={fact.id} className="fact-item">
                <div className="fact-id" style={{ color: 'rgba(255,255,255,0.1)' }}>{fact.id}</div>
                <div className="fact-text-wrap">
                  <h3 className="fact-title" style={{ color: planet.color }}>{fact.title}.</h3>
                  <p className="fact-text">{fact.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
