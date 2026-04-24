import React, { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import SliderHeader from "../../ui/Slider/SliderHeader";
import "./Testimonials.css";

const testimonialsData = [
  {
    id: 1,
    name: "Amy Harrison",
    text: "Discovering Vahlay Astro was a game-changer! Their unmatched expertise skyrocketed my self-awareness and peace of mind. Highly recommended for anyone seeking clarity.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Johnathan Doe",
    text: "Thanks to Vahlay Astro, I've unlocked my true cosmic potential and transformed my professional life. Their personalized guidance is a must-have in today's world!",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Katherine Smith",
    text: "Working with Vahlay Astro was one of the best life decisions I've made. Their dedication resulted in a path forward that truly resonates with my soul's purpose.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=256&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Michael Chen",
    text: "The precision of their planetary readings is uncanny. It helped me time my business launch perfectly, and the results have been phenomenal.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=256&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Sarah Williams",
    text: "I was skeptical at first, but the depth of cosmic knowledge here is profound. It's not just astrology; it's a guide to living a better life.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop",
  },
];

const Testimonials = () => {
    const [currentIndex, setCurrentIndex] = useState(3); // Start at index of first real item
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [visibleItems, setVisibleItems] = useState(3);
    const autoPlayRef = useRef(null);
    const touchStartRef = useRef(0);

    const clonedData = [
        ...testimonialsData.slice(-3),
        ...testimonialsData,
        ...testimonialsData.slice(0, 3)
    ];

    const totalRealItems = testimonialsData.length;

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) setVisibleItems(1);
            else if (window.innerWidth < 1200) setVisibleItems(2);
            else setVisibleItems(3);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const moveToIndex = useCallback((index, smooth = true) => {
        setIsTransitioning(smooth);
        setCurrentIndex(index);
    }, []);

    const nextSlide = useCallback(() => {
        if (isTransitioning && (currentIndex >= totalRealItems + 3)) return;
        moveToIndex(currentIndex + 1);
    }, [currentIndex, isTransitioning, totalRealItems, moveToIndex]);

    const prevSlide = useCallback(() => {
        if (isTransitioning && (currentIndex <= 2)) return;
        moveToIndex(currentIndex - 1);
    }, [currentIndex, isTransitioning, moveToIndex]);

    const getTranslateX = () => {
        const percentage = (100 / visibleItems) * currentIndex;
        return `translateX(-${percentage}%)`;
    };

    // Use GSAP for the auto-loop to ensure it's "Perfectly Smooth"
    useEffect(() => {
        if (!isTransitioning) return;
        
        // When we hit a boundary, we jump without a visible jump
        if (currentIndex >= totalRealItems + 3) {
            const timer = setTimeout(() => {
                setIsTransitioning(false);
                setCurrentIndex(3);
            }, 700);
            return () => clearTimeout(timer);
        }
        if (currentIndex <= 2) {
            const timer = setTimeout(() => {
                setIsTransitioning(false);
                setCurrentIndex(totalRealItems + 2);
            }, 700);
            return () => clearTimeout(timer);
        }
    }, [currentIndex, isTransitioning, totalRealItems]);

    const startAutoPlay = useCallback(() => {
        stopAutoPlay();
        autoPlayRef.current = setInterval(nextSlide, 5000);
    }, [nextSlide]);

    const stopAutoPlay = useCallback(() => {
        if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    }, []);

    useEffect(() => {
        startAutoPlay();
        return () => stopAutoPlay();
    }, [startAutoPlay, stopAutoPlay]);

    const handleTouchStart = (e) => {
        touchStartRef.current = e.touches[0].clientX;
        stopAutoPlay();
    };

    const handleTouchEnd = (e) => {
        const touchEnd = e.changedTouches[0].clientX;
        const diff = touchStartRef.current - touchEnd;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextSlide();
            else prevSlide();
        }
        startAutoPlay();
    };

    return (
        <section 
            className="testimonial-section" 
            id="testimonials"
            onMouseEnter={stopAutoPlay}
            onMouseLeave={startAutoPlay}
        >
            <div className="section-container">
                <SliderHeader 
                    title="Celestial Experiences"
                    subTitle="Voices of those whose lives have been transformed by sacred cosmic insights."
                    onNext={nextSlide}
                    onPrev={prevSlide}
                    isPrevDisabled={false}
                    isNextDisabled={false}
                />

                <div 
                    className="testimonial-slider-container"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    <div 
                        className="testimonial-track"
                        style={{ 
                            transform: getTranslateX(),
                                        transition: isTransitioning ? 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
                        }}
                    >
                        {clonedData.map((item, index) => (
                            <div 
                                className="testimonial-slide" 
                                key={`${item.id}-${index}`}
                                style={{ flex: `0 0 ${100 / visibleItems}%` }}
                            >
                                <div className="testimonial-card">
                                   
                                    <p className="testimonial-text">{item.text}</p>
                                    <h3 className="testimonial-title">{item.name}</h3>
                                    <div className="review-stars">★★★★★</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;