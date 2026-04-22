import React from 'react';
import Slider from '../../ui/Slider/Slider';
import { coursesData } from '../../../data/coursesData';
import './CourseSection.css';

/**
 * CourseSection
 * Main entry point for the professional slider section.
 */
const CourseSection = () => {
  return (
    <section className="course-section-container">
      <Slider 
        items={coursesData} 
        title="Courses for Astrologer" 
        subTitle="It's Not Just A Course, It’s A Life-Changing Experience!"
      />
    </section>
  );
};

export default CourseSection;
