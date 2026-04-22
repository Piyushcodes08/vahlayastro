import { useState, useCallback, useRef } from 'react';
import './SolarPlanet.css';
import { PLANETS } from '../../../data/planetData';
import { usePlanetNavigation } from '../../../hooks/usePlanetNavigation.js';
import { useBodyScrollLock } from '../../../hooks/useBodyScrollLock.js';

import { Sidebar } from '../../ui/solarPageComponets/Sidebar.jsx';
import { PlanetScene } from '../../ui/solarPageComponets/PlanetScene.jsx';
import { PlanetInfo } from '../../ui/solarPageComponets/PlanetInfo.jsx';
import { PlanetDetails } from '../../ui/solarPageComponets/PlanetDetails.jsx';

const SolarPlanet = () => {
  const containerRef = useRef(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { idx, go } = usePlanetNavigation(isDetailsOpen, containerRef);

  useBodyScrollLock(isDetailsOpen);

  const activePlanet = PLANETS[idx];

  const handleReadMore = useCallback(() => {
    setIsDetailsOpen(true);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setIsDetailsOpen(false);
  }, []);

  return (
    <div className="solar-page" ref={containerRef}>

      <Sidebar planets={PLANETS} currentIndex={idx} onPlanetSelect={go} />
      <PlanetScene planets={PLANETS} currentIndex={idx} />
      <PlanetInfo
        planets={PLANETS}
        currentIndex={idx}
        onReadMore={handleReadMore}
      />
      <PlanetDetails
        planet={activePlanet}
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
      />
    </div>
  );
};

export default SolarPlanet;