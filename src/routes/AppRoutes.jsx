import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import AboutPage from '../pages/AboutPage';
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

// ── Legacy Pages (Admin) ── from src/legacy/ (old folder se copy kiya, safe to delete old folder)
import AdminArticle from '../legacy/pages/AdminArticle';
import AdminCourseOrder from '../legacy/pages/AdminCourseOrder';
import AdminContact from '../legacy/pages/AdminContact';
import AdminQuestion from '../legacy/pages/AdminQuestion';
import AdminCalendar from '../legacy/pages/AdminCalendar';
import AdminSubscribeCourseList from '../legacy/pages/AdminSubscribeCourseList';
import AdminInquiries from '../legacy/pages/AdminInquiry';
import AdminPaymentList from '../legacy/pages/AdminPaymentList';
import AdminVedioOrder from '../legacy/pages/AdminVedioOrder';
import AdminTitleArrange from '../legacy/pages/AdminTitleArrange';
import AddCourse from '../legacy/pages/AddCourse';
import AddModule from '../legacy/pages/AddModule';
import Upload from '../legacy/pages/Upload';
import AddMeeting from '../legacy/pages/AddMeeting';
import AdminLiveSession from '../legacy/pages/LiveSession/Adminlivesession';
import AddEmi from '../legacy/Emi/AddEmi';
import EmiUserList from '../legacy/Emi/EmiUserList';
import EmiDetails from '../legacy/Emi/EmiDetails';

// ── Legacy Pages (User) ──
import Dashboard from '../legacy/pages/Dashboard';
import Profile from '../legacy/pages/Profile';
import EnrolledCourses from '../legacy/pages/EnrolledCourses';
import Startlearning from '../legacy/pages/Startleraning';
import VedioDetail from '../legacy/pages/VedioDetail';
import Enroll from '../legacy/pages/Enroll';
import EnrollFree from '../legacy/pages/EnrollFree';
import SuccessPage from '../legacy/pages/SuccessPage';
import Meetings from '../legacy/pages/Meetings';
import StudentLiveSession from '../legacy/pages/LiveSession/StudentLiveSession';
import JitsiIframe from '../legacy/pages/LiveSession/JitsiIframe';
import PayEmi from '../legacy/Emi/PayEmi';
import Finalize from '../legacy/Emi/Finalize';
import Notifications from '../legacy/Emi/Notification';
import Payment from '../legacy/Emi/Payment';
import PaymentGuide from '../legacy/pages/PaymentGuide';
import CourseDetail from '../legacy/pages/CourseDetail';
import AudioVisualizer from '../components/AudioVisualizer/AudioVisualizer';
import QuestionAndAns from '../legacy/pages/QuestionAndAns';
import ConsultingPage from '../pages/ConsultingPage';

// ── Additional Legacy Sub-pages ──
import BhagavadGita from '../legacy/pages/courses/BhagavadGita';
import Narad from '../legacy/pages/courses/Narad';
import Paidcourse1 from '../legacy/pages/courses/paidcourse1';
import Calendar from '../legacy/pages/Calender';
import Calendar2 from '../legacy/pages/Calender2';
import Copartners from '../legacy/pages/Copartners';
import NewUser from '../legacy/pages/NewUser';
import OldUser from '../legacy/pages/OldUser';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:courseType/:slug" element={<CourseDetail />} />
            <Route path="/consulting" element={<ConsultingPage />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/articles/:id" element={<ArticleDetailsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/appointment" element={<ProtectedRoute><AppointmentPage /></ProtectedRoute>} />
            <Route path="/testimonials" element={<TestimonialsPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsConditionsPage />} />
            <Route path="/paymentguide" element={<PaymentGuide />} />
            <Route path="/finalize" element={<Finalize />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/pay/:courseId/:emiNumber/:planId/:encodedEmail" element={<Payment />} />

            {/* Additional Legacy Routes */}
            <Route path="/bhagavad-gita" element={<BhagavadGita />} />
            <Route path="/narad" element={<Narad />} />
            <Route path="/paidcourse1" element={<Paidcourse1 />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/calendar2" element={<Calendar2 />} />
            <Route path="/copartners" element={<Copartners />} />
            <Route path="/newuser" element={<NewUser />} />
            <Route path="/olduser" element={<OldUser />} />
            <Route path="/audio-experience" element={<AudioVisualizer />} />

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
            <Route path="/JitsiIframe" element={<ProtectedRoute><JitsiIframe /></ProtectedRoute>} />
            <Route path="/payemi" element={<ProtectedRoute><PayEmi /></ProtectedRoute>} />
            <Route path="/:courseName/meetings" element={<ProtectedRoute><Meetings /></ProtectedRoute>} />

            {/* Admin Protected Routes */}
            <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminArticle /></ProtectedRoute>} />
            <Route path="/admin/admincourseorder" element={<ProtectedRoute adminOnly={true}><AdminCourseOrder /></ProtectedRoute>} />
            <Route path="/admin/admincontact" element={<ProtectedRoute adminOnly={true}><AdminContact /></ProtectedRoute>} />
            <Route path="/admin/question-ans" element={<ProtectedRoute adminOnly={true}><AdminQuestion /></ProtectedRoute>} />
            <Route path="/admin/question-answer" element={<ProtectedRoute adminOnly={true}><QuestionAndAns /></ProtectedRoute>} />
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
            <Route path="/admin/addemi" element={<ProtectedRoute adminOnly={true}><AddEmi /></ProtectedRoute>} />
            <Route path="/admin/emailuserlist" element={<ProtectedRoute adminOnly={true}><EmiUserList /></ProtectedRoute>} />
            <Route path="/admin/emailuserlist/:email" element={<ProtectedRoute adminOnly={true}><EmiDetails /></ProtectedRoute>} />

            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default AppRoutes;
