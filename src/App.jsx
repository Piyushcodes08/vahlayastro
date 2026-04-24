import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import ChatBot from './components/ChatBot/ChatBot';
import './App.css';

const App = () => {
  return (
    <Router>
        <AppRoutes />
        <ChatBot />
    </Router>
  );
};

export default App;