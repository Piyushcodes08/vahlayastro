import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { coursesData } from '../../../data/coursesData';
import './CourseSection.css';

const CourseSection = () => {
  const [activeCard, setActiveCard] = useState(0);

  return (
    <section className="course-section-container">
      <div className="section-container">
        {/* Section Header */}
        <div className="flex flex-col gap-2 mb-12 text-center md:text-left">
          <h2 className="title-batangas text-4xl md:text-5xl font-bold uppercase tracking-tight">
            Our Sacred Courses
          </h2>
          <p className="subtitle-poppins text-lg text-white/60">
            Master ancient wisdom for modern living with our expertly crafted courses.
          </p>
        </div>

        <div className="slider-wrapper">
          <div className="slider">
            <div className="track">
              {coursesData.map((course, index) => (
                <div
                  key={course.id}
                  className="project-card"
                  active={activeCard === index ? "true" : undefined}
                  onMouseEnter={() => setActiveCard(index)}
                >
                  <img
                    src={course.bgImage}
                    alt={course.title}
                    className="project-card__bg"
                  />
                  <div className="project-card__content">
                    <h3 className="project-card__title">
                      {course.title}
                    </h3>

                    {activeCard === index && (
                      <div className="project-card__active-layout">
                        <img
                          src={course.bgImage}
                          alt={course.title}
                          className="project-card__thumb"
                        />
                        <Link to="/contact" className="project-card__btn-circle">
                          Enroll <br /> Now
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="dots">
              {coursesData.map((_, index) => (
                <div
                  key={index}
                  className={`dot ${activeCard === index ? 'active' : ''}`}
                  onClick={() => setActiveCard(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseSection;
