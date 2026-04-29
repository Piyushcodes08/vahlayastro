import React from 'react';
import { Link } from 'react-router-dom';
import { LuArrowRight } from "react-icons/lu";
import { coursesData } from '../../../data/coursesData';
import './CourseSection.css';

/**
 * CourseGrid
 * This is the high-fidelity grid version used for the dedicated Courses Page.
 */
const CourseGrid = () => {
  return (
    <section className="course-grid-section py-16">
      <div className="section-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {coursesData.map((course) => (
            <div 
              key={course.id} 
              className="course-card-simple group relative bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] overflow-hidden hover:border-[#dd2727]/50 transition-all duration-700 shadow-2xl flex flex-col h-full hover:-translate-y-2"
            >
              {/* Image Header - Optimized to NOT cut images */}
              <div className="relative aspect-[4/5] overflow-hidden bg-[#0a0101]">
                {/* Blurred Background for full-view containment */}
                <img 
                  src={course.bgImage} 
                  alt="" 
                  className="absolute inset-0 w-full h-full object-cover blur-xl opacity-30 scale-110"
                />
                {/* Main Image - Fully visible */}
                <img 
                  src={course.bgImage} 
                  alt={course.title} 
                  className="relative z-10 w-full h-full object-contain p-4 transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0101] via-transparent to-transparent opacity-60 z-20"></div>
              </div>

              {/* Refined Content Body */}
              <div className="p-8 md:p-10 flex flex-col flex-grow relative z-30">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#dd2727] animate-pulse"></div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#dd2727] font-bold">Sacred Wisdom</span>
                </div>

                <h3 className="title-batangas text-2xl mb-4 text-white group-hover:text-[#dd2727] transition-colors duration-300 leading-snug">
                  {course.title}
                </h3>
                
                <p className="subtitle-poppins text-white/60 text-sm leading-relaxed mb-8 flex-grow line-clamp-4">
                  {course.description}
                </p>

                <div className="mt-auto pt-8 border-t border-white/10 flex items-center justify-between">
                  <Link 
                    to="/contact" 
                    className="inline-flex items-center gap-2 text-[#dd2727] font-bold uppercase tracking-widest text-[11px] group/link py-1"
                  >
                    Enroll Now
                    <LuArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1.5" />
                  </Link>
                  <div className="w-10 h-[1px] bg-[#dd2727]/30"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourseGrid;
