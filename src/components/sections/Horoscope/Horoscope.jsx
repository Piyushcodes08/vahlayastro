import React, { useEffect, useMemo, useState } from "react";
import { horoscopeData } from "../../../data/horoscopeData";
import "./Horoscope.css";

const Horoscope = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const cardPositions = useMemo(() => {
    return horoscopeData.map((_, index) => {
      const isMobile = screenWidth < 640;
      const isTablet = screenWidth <= 1080 && screenWidth >= 640;

      if (isMobile) {
        return {
          left: "50%",
          top: "50%",
          width: "90%",
          height: "auto",
        };
      }

      if (isTablet) {
        return {
          left: `${(100 / (horoscopeData.length - 1)) * index}%`,
          bottom: "0px",
          width: `${60 + index * 4}px`,
          height: `${60 + index * 4}px`,
        };
      }

      const leftSide = index < horoscopeData.length / 2;
      const sideIndex = leftSide ? index : index - (horoscopeData.length / 2);
      
      return {
        [leftSide ? "left" : "right"]: `${80 + sideIndex * 35}px`,
        top: `${60 + (sideIndex % 3) * 150}px`,
        width: `${80 + (sideIndex % 3) * 20}px`,
        height: `${80 + (sideIndex % 3) * 20}px`,
      };
    });
  }, [screenWidth]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? horoscopeData.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === horoscopeData.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="horoscope-section">
      <div className="horoscope-wrapper">
        <div className="flex flex-col items-center text-center gap-2 pb-12 mx-auto max-w-3xl">
          <h2 className="title-batangas text-4xl md:text-5xl font-bold uppercase tracking-tight leading-tight">
            Your Daily Horoscope
          </h2>
          <p className="subtitle-poppins text-lg md:text-xl font-medium">
            Check your daily astrological predictions for cosmic guidance.
          </p>
        </div>

        <div className="quote-row">
          {horoscopeData.map((item, index) => {
            const isActive = activeIndex === index;

            return (
              <div
                key={index}
                className={`quote-column horoscope-float ${
                  isActive ? "col-active show" : ""
                }`}
                style={isActive ? undefined : cardPositions[index]}
                onClick={() => setActiveIndex(index)}
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
                    <div className="quote-symbol">❛</div>
                    <div className="box-text-inner">
                      <p>{item.quote}</p>
                    </div>
                    <div className="quote-symbol">❜</div>
                  </div>
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
};

export default Horoscope;