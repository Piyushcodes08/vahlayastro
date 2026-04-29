import React from 'react';
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

const SliderHeader = ({ title, subTitle, onNext, onPrev, isPrevDisabled, isNextDisabled }) => {
  return (
    <div className="head flex flex-col md:flex-row items-center md:items-center justify-between gap-6 pb-8">
      <div className='flex flex-col text-center md:text-left gap-1 max-w-3xl'>
        <h2 className="title-batangas text-4xl md:text-5xl font-bold uppercase tracking-tight leading-tight">
          {title}
        </h2>
        <p className="subtitle-poppins text-lg md:text-xl font-medium">
         {subTitle}
        </p>
      </div>
      <div className="controls flex items-center gap-4">
        <button 
          className="nav-btn flex items-center justify-center" 
          onClick={onPrev} 
          disabled={isPrevDisabled} 
          aria-label="Previous"
        >
          <HiChevronLeft size={24} />
        </button>
        <button 
          className="nav-btn flex items-center justify-center" 
          onClick={onNext} 
          disabled={isNextDisabled} 
          aria-label="Next"
        >
          <HiChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default SliderHeader;
