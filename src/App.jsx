import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import ChatBot from './components/ChatBot/ChatBot';
import ScrollToTop from './components/ScrollToTop';
import GlobalBackground from './components/GlobalBackground';
import { CoursesProvider } from './context/CoursesContext';
import { ArticlesProvider } from './context/ArticlesContext';
import { HelmetProvider } from 'react-helmet-async';
import './App.css';

const App = () => {
  return (
    <Router>
        <HelmetProvider>
            <CoursesProvider>
                <ArticlesProvider>
                    <ScrollToTop />
                    <GlobalBackground />
                    <AppRoutes />
                    <ChatBot />
                </ArticlesProvider>
            </CoursesProvider>
        </HelmetProvider>
    </Router>
  );
};

export default App;