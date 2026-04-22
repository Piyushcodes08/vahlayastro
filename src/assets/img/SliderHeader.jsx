import React from 'react';

const SliderHeader = ({ title, onNext, onPrev, isPrevDisabled, isNextDisabled }) => {
  return (
    <div className="head">
      <h2>{title}</h2>
      <div className="controls">
        <button 
          className="nav-btn" 
          onClick={onPrev} 
          disabled={isPrevDisabled} 
          aria-label="Previous"
        >
          ‹
        </button>
        <button 
          className="nav-btn" 
          onClick={onNext} 
          disabled={isNextDisabled} 
          aria-label="Next"
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default SliderHeader;
