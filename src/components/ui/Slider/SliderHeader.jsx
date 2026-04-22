import React from 'react';

const SliderHeader = ({ title, subTitle, onNext, onPrev, isPrevDisabled, isNextDisabled }) => {
  return (
    <div className="head flex flex-col md:flex-row items-center md:items-end justify-between gap-6 pb-12">
      <div className='flex flex-col text-center md:text-left gap-1 pb-10'>
        <h2 className="title-batangas text-4xl md:text-5xl font-bold uppercase tracking-tight leading-tight">
          {title}
        </h2>
        <p className="subtitle-poppins text-lg md:text-xl font-medium">
         {subTitle}
        </p>
      </div>
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
