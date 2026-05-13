import { useEffect, useState, useRef } from "react";
import './Horoscope.css';
import { horoscopeData } from "../../../data/common/horoscope";
import zodiacWheel from "../../../assets/images/sections/horoscope/new_wheel_s5ozry.png";

export default function Horoscope({ onGetDetails }) {
    const [rotation, setRotation] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollContainerRef = useRef(null);
    const lastScrollTime = useRef(0);
    const COOLDOWN = 300;

    const zodiacs = horoscopeData;

    const [isInView, setIsInView] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    const activeIndexRef = useRef(activeIndex);
    const isHoveringRef = useRef(isHovering);

    // Keep refs in sync with state to avoid re-attaching the event listener
    useEffect(() => {
        activeIndexRef.current = activeIndex;
    }, [activeIndex]);

    useEffect(() => {
        isHoveringRef.current = isHovering;
    }, [isHovering]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setIsInView(entry.isIntersecting),
            { threshold: 0.1 }
        );

        if (scrollContainerRef.current) {
            observer.observe(scrollContainerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const handleWheel = (e) => {
            if (!isHoveringRef.current) return;

            const currentIndex = activeIndexRef.current;
            const isAtEnd = currentIndex === zodiacs.length - 1;
            const isAtStart = currentIndex === 0;

            if (e.deltaY > 0 && isAtEnd) return;
            if (e.deltaY < 0 && isAtStart) return;

            e.preventDefault();

            if (Date.now() - lastScrollTime.current < COOLDOWN) return;
            const delta = Math.abs(e.deltaY);
            if (delta < 15) return;

            const power = Math.min(Math.max(Math.floor(delta / 100), 1), 4);

            if (e.deltaY > 0) {
                const nextIndex = Math.min(currentIndex + power, zodiacs.length - 1);
                if (nextIndex !== currentIndex) {
                    const actualSteps = nextIndex - currentIndex;
                    setActiveIndex(nextIndex);
                    setRotation(prev => prev - (actualSteps * 30));
                    lastScrollTime.current = Date.now();
                }
            } else if (e.deltaY < 0) {
                const prevIndex = Math.max(currentIndex - power, 0);
                if (prevIndex !== currentIndex) {
                    const actualSteps = currentIndex - prevIndex;
                    setActiveIndex(prevIndex);
                    setRotation(prev => prev + (actualSteps * 30));
                    lastScrollTime.current = Date.now();
                }
            }
        };

        window.addEventListener("wheel", handleWheel, { passive: false });
        return () => window.removeEventListener("wheel", handleWheel);
    }, [zodiacs.length]);

    return (
        <section className={`horoscope-section mx-auto max-w-7xl ${isInView ? "in-view" : ""}`} ref={scrollContainerRef}>
            <div className='flex flex-col text-center gap-2 pb-12  z-10'>
                <span className="text-[#dd2727] font-bold tracking-[0.3em] uppercase text-xs mb-2">Vahlay Astro</span>
                <h2 className="title-batangas text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-tight text-white">
                    Explore Your <span className="text-[#dd2727]">Cosmic Destiny</span>
                </h2>
                <p className="subtitle-poppins text-lg md:text-xl font-medium text-white/70 max-w-2xl mx-auto">
                    Navigate through the celestial wheel to uncover your personalized daily horoscope and planetary insights.
                </p>
            </div>

            <div className="zodiac-container">
                {/* Information Panel - Left */}
                <div className="zodiac-info-panel left">
                    <div className="zodiac-header" key={`name-${activeIndex}`}>
                        <div className="zodiac-symbol-bg">
                            <img
                                src={zodiacs[activeIndex].icon}
                                alt={zodiacs[activeIndex].name}
                                className="zodiac-active-icon-mini"
                            />
                        </div>
                        <h2 className="zodiac-name">{zodiacs[activeIndex].name}</h2>
                        <span className="zodiac-traits">{zodiacs[activeIndex].traits}</span>
                    </div>
                </div>

                {/* Central Wheel */}
                <div
                    className="zodiac-wheel-wrapper"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    <div className="zodiac-wheel-outer" style={{ transform: `rotate(${rotation}deg)` }}>
                        <img src={zodiacWheel} alt="Zodiac Wheel" className="zodiac-wheel-image" />
                    </div>

                    <div className="zodiac-pointer">
                        <div className="pointer-glow"></div>
                    </div>

                    <div className="zodiac-center-display">
                        <div className="active-zodiac-card" key={`card-${activeIndex}`}>
                            <div className="card-inner">
                                <img
                                    src={zodiacs[activeIndex].icon}
                                    alt=""
                                    className="active-icon-large"
                                />
                                <div className="zodiac-glow"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Information Panel - Right */}
                <div className="zodiac-info-panel right" key={`desc-${activeIndex}`}>
                    <div className="element-badge">
                        <span className="element-dot"></span>
                        {zodiacs[activeIndex].element} Element
                    </div>
                    <p className="zodiac-description">
                        {zodiacs[activeIndex].description}
                    </p>
                    <button className="read-more-btn" onClick={onGetDetails}>
                        Get Detailed <span className="arrow">→</span>
                    </button>
                </div>
            </div>


        </section>
    );
}
