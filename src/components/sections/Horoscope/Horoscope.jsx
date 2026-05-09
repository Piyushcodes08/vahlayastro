import React, { useEffect, useMemo, useState } from "react";
import { horoscopeData } from "../../../data/horoscopeData";
import "./Horoscope.css";

const Horoscope = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [screenWidth, setScreenWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const cardPositions = useMemo(() => {
    const total = horoscopeData.length;
    const isMobile = screenWidth < 640;
    const isTablet = screenWidth >= 640 && screenWidth <= 1080;

    return horoscopeData.map((_, index) => {
      if (isMobile) {
        return {
          left: "50%",
          top: "50%",
          width: "90%",
          height: "auto",
          transform: "translate(-50%, -50%) scale(0.92)",
        };
      }

      // Larger radiusY to avoid overlap with the growing active center card
      const radiusX = isTablet ? 240 : 390;
      const radiusY = isTablet ? 195 : 260;

      const angle = (360 / total) * index - 90;
      const radian = (angle * Math.PI) / 180;

      const x = Math.cos(radian) * radiusX;
      const y = Math.sin(radian) * radiusY;

      return {
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y}px)`,
        width: isTablet ? "60px" : "88px",
        height: isTablet ? "60px" : "88px",
        transform: "translate(-50%, -50%)",
      };
    });
  }, [screenWidth]);

  const handlePrev = () => {
    setActiveIndex((prev) =>
      prev === 0 ? horoscopeData.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((prev) =>
      prev === horoscopeData.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <section className="horoscope-section">
      {/* Heading stays inside constrained container */}
      <div className="section-container">
        <div className="flex flex-col gap-2 mb-12 text-center">
          <h2 className="title-batangas text-4xl md:text-5xl font-bold uppercase tracking-tight">
            Cosmic Forecast
          </h2>
          <p className="subtitle-poppins text-lg text-white/60">
            Check your daily astrological predictions for cosmic guidance.
          </p>
        </div>
      </div>

      {/* Orbit + active card — full viewport width so left:50% = true center */}
      <div className="quote-row">
        {horoscopeData.map((item, index) => {
          const isActive = activeIndex === index;
          return (
            <button
              type="button"
              key={item.name}
              className={`quote-column horoscope-float ${isActive ? "col-active show" : ""}`}
              style={isActive ? undefined : cardPositions[index]}
              onClick={() => setActiveIndex(index)}
              aria-label={`Open ${item.name} horoscope`}
            >
              <div className="col-inner">
                <div className="author-meta">
                  <div className="image-cover">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="author-info">
                    <div className="author-name">
                      <p className="person-name">{item.name}</p>
                    </div>
                    <div className="author-status">
                      <p className="person-title">{item.title}</p>
                    </div>
                  </div>
                </div>
                <div className="quote-wrapper">
                  <div className="box-text-inner">
                    <p>{item.quote}</p>
                  </div>
                </div>
              </div>
            </button>
          );
        })} 
      </div>
    </section>
  );
};

export default Horoscope;