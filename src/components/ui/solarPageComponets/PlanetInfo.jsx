import React from 'react';

export const PlanetInfo = React.memo(function PlanetInfo({ planets, currentIndex, onReadMore }) {
  return (
    <>
      <div className="top-labels">
        {planets.map((p, i) => {
          const d = i - currentIndex;
          let stateClass = '';
          if (d === -1) stateClass = 'active';
          else if (d < -1) stateClass = 'exit';
          else stateClass = 'hidden';

          return (
            <div key={p.id} className={`top-block ${stateClass}`}>
              <div className="tb-type" style={{ color: p.color }}>PLANET</div>
              <div className="tb-name">{p.name.toUpperCase()}</div>
            </div>
          );
        })}
      </div>

      <div className="main-labels">
        {planets.map((p, i) => {
          const d = i - currentIndex;
          let stateClass = '';
          if (d === 0) stateClass = 'active';
          else if (d < 0) stateClass = 'exit-up';
          else stateClass = 'exit-down';

          return (
            <div key={p.id} className={`main-block ${stateClass}`}>
              <div className="mb-type" style={{ color: p.color }}>PLANET</div>
              <div className="mb-name">{p.name.toUpperCase()}</div>
              <div className="mb-desc">{p.desc}</div>
              <div
                className="mb-more"
                style={{ borderBottomColor: p.color, color: p.color }}
                onClick={onReadMore}
              >
                READ MORE
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
});