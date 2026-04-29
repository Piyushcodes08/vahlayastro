import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import ChatBot from './components/ChatBot/ChatBot';
import ScrollToTop from './components/ScrollToTop';
import GlobalBackground from './components/GlobalBackground';
import './App.css';

const App = () => {
  return (
    <Router>
        <ScrollToTop />
        <GlobalBackground />
        <AppRoutes />
        <ChatBot />
    </Router>
  );
};

export default App;