import React from 'react';
import { Link } from 'react-router-dom';
import { LuArrowRight } from "react-icons/lu";
import { useCourses } from '../../../context/CoursesContext';
import './CourseSection.css';

/**
 * CourseGrid
 * This is the high-fidelity grid version used for the dedicated Courses Page.
 */
const CourseGrid = () => {
  const { slugMap, loading } = useCourses();
  const coursesData = React.useMemo(() => Object.values(slugMap), [slugMap]);

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center">
        <div className="text-[#dd2727] text-xl font-bold animate-pulse uppercase tracking-[0.3em]">
          Unveiling Wisdom...
        </div>
      </div>
    );
  }
  return (
    <section className="course-grid-section py-16">
      <div className="section-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {coursesData.map((course) => (
            <div 
              key={course.id} 
              className="course-card-simple group relative bg-[#150a0a]/40 backdrop-blur-3xl border border-white/5 rounded-[2rem] overflow-hidden hover:border-[#dd2727]/40 transition-all duration-700 shadow-2xl flex flex-col h-full hover:-translate-y-2"
            >
              {/* Image Header - Optimized for Premium Full View */}
              <div className="relative aspect-[3/2] overflow-hidden bg-[#0a0101]/80">
                {/* Main Image - Full Fill */}
                <img 
                  src={course.imageUrl || course.bgImage} 
                  alt={course.title} 
                  className="relative z-10 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#150a0a] via-transparent to-transparent opacity-80 z-20"></div>
              </div>

              {/* Premium Content Body */}
              <div className="p-7 md:p-8 flex flex-col flex-grow relative z-30">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#dd2727] shadow-[0_0_8px_#dd2727]"></div>
                  <span className="text-[10px] uppercase tracking-[0.4em] text-[#dd2727] font-bold">Divine Mastery</span>
                </div>

                <h3 className="title-batangas text-xl md:text-2xl mb-4 text-white group-hover:text-[#dd2727] transition-colors duration-300 leading-snug">
                  {course.title}
                </h3>
                
                <p className="subtitle-poppins text-white/50 text-[13px] leading-relaxed mb-8 flex-grow line-clamp-3">
                  {course.description}
                </p>

                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                  <Link 
                    to={course.type === 'free' ? `/enrollfree/${course.id}/${course.type}` : `/enroll/${course.id}/${course.type}`} 
                    className="inline-flex items-center gap-2 text-[#dd2727] font-bold uppercase tracking-[0.2em] text-[10px] group/link py-1 hover:text-white transition-colors duration-300"
                  >
                    Enroll Now
                    <LuArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1.5" />
                  </Link>
                  <div className="w-8 h-[1px] bg-[#dd2727]/20"></div>
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
