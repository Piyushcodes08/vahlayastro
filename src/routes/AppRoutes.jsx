import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import AboutPage from '../pages/AboutPage';
import ServicesPage from '../pages/ServicesPage';
import CoursesPage from '../pages/CoursesPage';
import ArticlesPage from '../pages/ArticlesPage';
import ArticleDetailsPage from '../pages/ArticleDetailsPage';
import ContactPage from '../pages/ContactPage';
import TestimonialsPage from '../pages/TestimonialsPage';
import FAQPage from '../pages/FAQPage';
import PrivacyPolicyPage from '../pages/PrivacyPolicyPage';
import TermsConditionsPage from '../pages/TermsConditionsPage';
import NotFoundPage from '../pages/NotFoundPage';
import AppointmentPage from '../pages/AppointmentPage';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/articles/:id" element={<ArticleDetailsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/appointment" element={<AppointmentPage />} />
            <Route path="/testimonials" element={<TestimonialsPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsConditionsPage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default AppRoutes;
