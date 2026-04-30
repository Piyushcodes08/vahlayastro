import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './input.css'
import { CoursesProvider } from "./context/CoursesContext.jsx"; 
createRoot(document.getElementById('root')).render(
  <StrictMode>
     <CoursesProvider>
    <App />
    </CoursesProvider>
  </StrictMode>,
)
