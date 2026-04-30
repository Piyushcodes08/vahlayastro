import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import AboutPage from '../pages/AboutPage';
import ServicesPage from '../pages/ServicesPage';
import CoursesPage from '../pages/CoursesPage';
import ArticlesPage from '../pages/ArticlesPage';
import ArticleDetailsPage from '../pages/ArticleDetailsPage';
import ContactPage from '../pages/ContactPage';
import AppointmentPage from '../pages/AppointmentPage';
import TestimonialsPage from '../pages/TestimonialsPage';
import FAQPage from '../pages/FAQPage';
import PrivacyPolicyPage from '../pages/PrivacyPolicyPage';
import TermsConditionsPage from '../pages/TermsConditionsPage';
import NotFoundPage from '../pages/NotFoundPage';

import Login from '../components/auth/Login';
import SignUp from '../components/auth/SignUp';
import ForgetPassword from '../components/auth/ForgetPassword';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import Unauthorized from '../pages/Unauthorized';

// Old Project Admin Pages
import AdminArticle from '../old folder/AstroFrontend-main/src/components/pages/AdminArticle';
import AdminCourseOrder from '../old folder/AstroFrontend-main/src/components/pages/AdminCourseOrder';
import AdminContact from '../old folder/AstroFrontend-main/src/components/pages/AdminContact';
import AdminQuestion from '../old folder/AstroFrontend-main/src/components/pages/AdminQuestion';
import AdminCalendar from '../old folder/AstroFrontend-main/src/components/pages/AdminCalendar';
import AdminSubscribeCourseList from '../old folder/AstroFrontend-main/src/components/pages/AdminSubscribeCourseList';
import AdminInquiries from '../old folder/AstroFrontend-main/src/components/pages/AdminInquiry';
import AdminPaymentList from '../old folder/AstroFrontend-main/src/components/pages/AdminPaymentList';
import AdminVedioOrder from '../old folder/AstroFrontend-main/src/components/pages/AdminVedioOrder';
import AdminTitleArrange from '../old folder/AstroFrontend-main/src/components/pages/AdminTitleArrange';
import AddCourse from '../old folder/AstroFrontend-main/src/components/pages/AddCourse';
import AddModule from '../old folder/AstroFrontend-main/src/components/pages/AddModule';
import Upload from '../old folder/AstroFrontend-main/src/components/pages/Upload';
import AddMeeting from '../old folder/AstroFrontend-main/src/components/pages/AddMeeting';
import AdminLiveSession from '../old folder/AstroFrontend-main/src/components/pages/LiveSession/Adminlivesession';

// Old Project User Pages
import Dashboard from '../old folder/AstroFrontend-main/src/components/pages/Dashboard';
import Profile from '../old folder/AstroFrontend-main/src/components/pages/Profile';
import EnrolledCourses from '../old folder/AstroFrontend-main/src/components/pages/EnrolledCourses';
import Startlearning from '../old folder/AstroFrontend-main/src/components/pages/Startleraning';
import VedioDetail from '../old folder/AstroFrontend-main/src/components/pages/VedioDetail';
import Enroll from '../old folder/AstroFrontend-main/src/components/pages/Enroll';
import EnrollFree from '../old folder/AstroFrontend-main/src/components/pages/EnrollFree';
import SuccessPage from '../old folder/AstroFrontend-main/src/components/pages/SuccessPage';
import Meetings from '../old folder/AstroFrontend-main/src/components/pages/Meetings';
import StudentLiveSession from '../old folder/AstroFrontend-main/src/components/pages/LiveSession/StudentLiveSession';
import PayEmi from '../old folder/AstroFrontend-main/src/components/Emi/PayEmi';

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
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgetpassword" element={<ForgetPassword />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* User Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/enrolledcourse" element={<ProtectedRoute><EnrolledCourses /></ProtectedRoute>} />
            <Route path="/course/:courseName" element={<ProtectedRoute><Startlearning /></ProtectedRoute>} />
            <Route path="/course/:courseName/video/:videoId" element={<ProtectedRoute><VedioDetail /></ProtectedRoute>} />
            <Route path="/enroll/:courseId/:courseType" element={<ProtectedRoute><Enroll /></ProtectedRoute>} />
            <Route path="/enrollfree/:courseId/:courseType" element={<ProtectedRoute><EnrollFree /></ProtectedRoute>} />
            <Route path="/submission-success" element={<ProtectedRoute><SuccessPage /></ProtectedRoute>} />
            <Route path="/studentlivesession" element={<ProtectedRoute><StudentLiveSession /></ProtectedRoute>} />
            <Route path="/payemi" element={<ProtectedRoute><PayEmi /></ProtectedRoute>} />
            <Route path="/:courseName/meetings" element={<ProtectedRoute><Meetings /></ProtectedRoute>} />

            {/* Admin Protected Routes */}
            <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminArticle /></ProtectedRoute>} />
            <Route path="/admin/admincourseorder" element={<ProtectedRoute adminOnly={true}><AdminCourseOrder /></ProtectedRoute>} />
            <Route path="/admin/admincontact" element={<ProtectedRoute adminOnly={true}><AdminContact /></ProtectedRoute>} />
            <Route path="/admin/question-ans" element={<ProtectedRoute adminOnly={true}><AdminQuestion /></ProtectedRoute>} />
            <Route path="/admin/admincalendar" element={<ProtectedRoute adminOnly={true}><AdminCalendar /></ProtectedRoute>} />
            <Route path="/admin/adminsubscribecourselist" element={<ProtectedRoute adminOnly={true}><AdminSubscribeCourseList /></ProtectedRoute>} />
            <Route path="/admin/admininquiry" element={<ProtectedRoute adminOnly={true}><AdminInquiries /></ProtectedRoute>} />
            <Route path="/admin/payment" element={<ProtectedRoute adminOnly={true}><AdminPaymentList /></ProtectedRoute>} />
            <Route path="/admin/vedio-order" element={<ProtectedRoute adminOnly={true}><AdminVedioOrder /></ProtectedRoute>} />
            <Route path="/admin/title-order" element={<ProtectedRoute adminOnly={true}><AdminTitleArrange /></ProtectedRoute>} />
            <Route path="/admin/addcourse" element={<ProtectedRoute adminOnly={true}><AddCourse /></ProtectedRoute>} />
            <Route path="/admin/addmodule" element={<ProtectedRoute adminOnly={true}><AddModule /></ProtectedRoute>} />
            <Route path="/admin/upload" element={<ProtectedRoute adminOnly={true}><Upload /></ProtectedRoute>} />
            <Route path="/admin/addmeeting" element={<ProtectedRoute adminOnly={true}><AddMeeting /></ProtectedRoute>} />
            <Route path="/admin/adminlivesession" element={<ProtectedRoute adminOnly={true}><AdminLiveSession /></ProtectedRoute>} />

            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default AppRoutes;
