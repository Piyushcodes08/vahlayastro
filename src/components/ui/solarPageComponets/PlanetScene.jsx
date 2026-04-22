import React from 'react';

export const PlanetScene = React.memo(function PlanetScene({ planets, currentIndex }) {
  return (
    <>
      {planets.map((p, i) => {
        const d = i - currentIndex;

        let stateClass = 'active';
        if (d === -1) stateClass = 'prev';
        else if (d === 1) stateClass = 'next';
        else if (d < -1) stateClass = 'hidden-before';
        else if (d > 1) stateClass = 'hidden-after';

        const sphereStyle = {
          backgroundImage: `url(${p.img})`,
          transform: 'translate(-50%, -50%) translateZ(0)',
          backfaceVisibility: 'hidden',
        };

        return (
          <div key={p.id} className={`planet-scene ${stateClass}`}>
            <div className="planet-sphere" style={sphereStyle}></div>
            <div className="planet-shadow-overlay"></div>

            {p.id === 'saturn' && <div className="planet-rings saturn-rings" />}
            {p.id === 'uranus' && <div className="planet-rings uranus-rings" />}
          </div>
        );
      })}
    </>
  );
});