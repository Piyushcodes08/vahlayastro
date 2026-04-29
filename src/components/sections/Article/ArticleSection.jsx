import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import SliderHeader from '../../ui/Slider/SliderHeader';
import { articlesData } from '../../../data/articleData';
import './ArticleSection.css';

const ArticleSection = () => {
  // We clone items for seamless loop: items at end added to start, items at start added to end
  const [currentIndex, setCurrentIndex] = useState(4); // Start at index of first real item
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [visibleItems, setVisibleItems] = useState(4);
  const sliderRef = useRef(null);
  const autoPlayRef = useRef(null);
  const touchStartRef = useRef(0);
  const isMovingRef = useRef(false);

  // Extend data for seamless cloning
  // Prepend last 4 items, Append first 4 items
  const clonedData = [
    ...articlesData.slice(-4),
    ...articlesData,
    ...articlesData.slice(0, 4)
  ];

  const totalRealItems = articlesData.length;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setVisibleItems(1);
      else if (window.innerWidth < 1024) setVisibleItems(2);
      else if (window.innerWidth < 1280) setVisibleItems(3);
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
    if (isMovingRef.current) return;
    moveToIndex(currentIndex + 1);
  }, [currentIndex, moveToIndex]);

  const prevSlide = useCallback(() => {
    if (isMovingRef.current) return;
    moveToIndex(currentIndex - 1);
  }, [currentIndex, moveToIndex]);

  // Boundary check for infinite loop
  useEffect(() => {
    // Jump from end clone back to real start
    if (currentIndex >= totalRealItems + 4) {
      const timer = setTimeout(() => {
        moveToIndex(4, false);
      }, 600);
      return () => clearTimeout(timer);
    }
    // Jump from start clone forward to real end
    if (currentIndex <= 3) {
      const timer = setTimeout(() => {
        moveToIndex(totalRealItems + 3, false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, totalRealItems, moveToIndex]);

  // Auto-play
  const startAutoPlay = useCallback(() => {
    stopAutoPlay();
    autoPlayRef.current = setInterval(nextSlide, 4000);
  }, [nextSlide]);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
  }, []);

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [startAutoPlay, stopAutoPlay]);

  // Touch Handling
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

  const getTranslateX = () => {
    const percentage = (100 / visibleItems) * currentIndex;
    return `translateX(-${percentage}%)`;
  };

  return (
    <section
      className="article-section"
      onMouseEnter={stopAutoPlay}
      onMouseLeave={startAutoPlay}
    >
      <div className="section-container">
        <SliderHeader
          title="Featured Articles"
          subTitle="Explore our latest insights and sacred wisdom."
          onNext={nextSlide}
          onPrev={prevSlide}
          isPrevDisabled={false}
          isNextDisabled={false}
        />

        <div
          className="article-slider-container"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="article-track"
            style={{
              transform: getTranslateX(),
              transition: isTransitioning ? 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none'
            }}
          >
            {clonedData.map((article, index) => (
              <div
                key={`${article.id}-${index}`}
                className="article-slide"
                style={{ flex: `0 0 ${100 / visibleItems}%` }}
              >
                <div className="article-item">
                  <div className="article-wrapper">
                    {/* Inner page content — revealed when cover opens */}
                    <div className="article-inner">
                      <h4 className="article-inner-title">{article.title}</h4>
                      <p className="article-inner-desc">{article.description}</p>
                      <Link to={`/articles/${article.id}`} className="article-read-more">Read More</Link>
                    </div>
                    {/* Cover — rotates open on hover */}
                    <img
                      src={article.img}
                      alt={article.title}
                      className="article-cover"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="article-title">{article.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArticleSection;
