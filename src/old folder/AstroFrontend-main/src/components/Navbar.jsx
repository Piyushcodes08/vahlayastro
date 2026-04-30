import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { db, app } from "../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import Notification from "./Emi/Notification";
import LanguageSelector from "./LanguageSelector";
import "./Navbar.css";

const auth = getAuth(app);

const Path = (props) => (
  <motion.path
    fill="transparent"
    strokeWidth="2.5"
    stroke="currentColor"
    strokeLinecap="round"
    {...props}
  />
);

const Navbar = () => {
  const [userName, setUserName] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const sidebarRef = useRef();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || "User");
        checkAdminStatus(user.email);
      } else {
        setUserName(null);
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const checkAdminStatus = async (email) => {
    try {
      const q = query(collection(db, "users"), where("email", "==", email));
      const usersSnapshot = await getDocs(q);
      usersSnapshot.forEach((doc) => {
        if (doc.data().isAdmin) setIsAdmin(true);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      setUserName(null);
      setIsAdmin(false);
      navigate("/home");
    }).catch(console.error);
  };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about-us", label: "About" },
    { path: "/articles", label: "Articles" },
    { path: "/courses", label: "Courses" },
    { path: "/appointment", label: "Appointment" },
    { path: "/contact-us", label: "Contact" },
    ...(userName ? [{ path: "/enrolledcourse", label: "Dashboard" }] : []),
    ...(isAdmin ? [{ path: "/admin", label: "Admin" }] : []),
  ];

  return (
    <header className={`fixed top-0 z-[1000] w-full transition-all duration-500 ${
      isScrolled ? 'bg-white/95 shadow-xl py-3 border-b border-gray-100' : 'bg-transparent py-6 border-b border-white/10'
    }`}>
      <div className="max-w-[1400px] mx-auto px-6 flex justify-between items-center relative z-[1001]">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3 group relative z-[5000]">
            <motion.img 
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              src="/assets/vahlay_astro.png" 
              className="h-10 md:h-12 w-10 md:w-12 drop-shadow-md" 
              alt="logo" 
            />
            <span className={`font-batangas text-xl md:text-2xl font-bold tracking-tight transition-colors duration-300 uppercase ${
              isScrolled ? 'text-red-700' : 'text-white'
            }`}>
              VAHLAY
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-5 py-2.5 rounded-full text-[13px] font-black uppercase tracking-widest transition-all duration-300 ${
                    active 
                      ? (isScrolled ? "bg-red-700 text-white shadow-lg shadow-red-200" : "bg-white text-red-700 shadow-xl") 
                      : (isScrolled ? "text-gray-600 hover:text-red-700 hover:bg-red-50" : "text-white/80 hover:text-white hover:bg-white/10")
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* DESKTOP ACTIONS */}
          <div className="hidden lg:flex items-center gap-4">
            <div className={`flex items-center gap-3 px-4 py-2 rounded-full border transition-all ${
              isScrolled ? 'bg-gray-50 border-gray-100' : 'bg-black/10 border-white/10'
            }`}>
               <LanguageSelector />
               <div className={`w-[1px] h-4 ${isScrolled ? 'bg-gray-200' : 'bg-white/20'}`} />
               <Notification />
            </div>

            {userName ? (
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="px-6 py-2.5 bg-red-600 text-white rounded-xl font-bold text-[10px] shadow-lg shadow-red-200 hover:bg-red-700 transition-all uppercase tracking-[0.2em]"
                >
                  Logout
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-colors ${
                  isScrolled ? 'text-gray-600 hover:text-red-600' : 'text-white/80 hover:text-white'
                }`}>
                  Login
                </Link>
                <Link to="/signup" className="px-6 py-2.5 bg-red-600 text-white rounded-xl font-bold text-[10px] shadow-lg shadow-red-200 hover:bg-red-700 transition-all uppercase tracking-widest">
                  Join
                </Link>
              </div>
            )}
          </div>

          {/* MOBILE TOGGLE & NOTIF */}
          <div className="flex lg:hidden items-center gap-3 relative z-[5000]">
             <div className="sm:hidden">
               <Notification />
             </div>
             <motion.button
              initial={false}
              animate={menuOpen ? "open" : "closed"}
              whileTap={{ scale: 0.9 }}
              onClick={() => setMenuOpen(!menuOpen)}
              className={`p-3 rounded-xl transition-all duration-300 shadow-xl ${
                menuOpen 
                  ? "bg-white text-red-600" 
                  : "bg-red-600 text-white shadow-red-200"
              }`}
            >
              <svg width="23" height="23" viewBox="0 0 23 23">
                <Path
                  variants={{
                    closed: { d: "M 2 2.5 L 20 2.5" },
                    open: { d: "M 3 16.5 L 17 2.5" }
                  }}
                />
                <Path
                  d="M 2 9.423 L 20 9.423"
                  variants={{
                    closed: { opacity: 1 },
                    open: { opacity: 0 }
                  }}
                  transition={{ duration: 0.1 }}
                />
                <Path
                  variants={{
                    closed: { d: "M 2 16.346 L 20 16.346" },
                    open: { d: "M 3 2.5 L 17 16.346" }
                  }}
                />
              </svg>
            </motion.button>
          </div>
      </div>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {menuOpen && (
          <div key="mobile-menu-container" className="fixed inset-0 z-[4000] lg:hidden overflow-hidden">
            {/* Backdrop */}
            <motion.div 
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)} 
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            
            {/* Sidebar Shell */}
            <motion.div 
              key="sidebar"
              ref={sidebarRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 h-full w-[85%] max-w-[340px] bg-red-700 shadow-2xl flex flex-col z-[4001] border-l border-white/10"
              style={{ backgroundColor: '#b91c1c' }}
            >
              <div className="flex flex-col h-full relative">
                {/* Header Spacer */}
                <div className="h-20 shrink-0 border-b border-white/10 flex items-center px-6 bg-black/20">
                   <div className="flex items-center gap-3">
                    <img src="/assets/vahlay_astro.png" className="h-10 w-10" alt="logo" />
                    <span className="font-batangas text-xl font-bold text-white uppercase tracking-tight">VAHLAY</span>
                  </div>
                </div>

                {/* Nav Links Scroller */}
                <nav className="flex-1 overflow-y-auto px-4 py-8 space-y-3 custom-scrollbar">
                  {userName && (
                    <div className="mx-2 mb-8 p-5 rounded-2xl bg-black/20 border border-white/10 shadow-lg">
                      <p className="text-[10px] text-white/50 uppercase font-black mb-1 tracking-widest">Signed In As</p>
                      <p className="text-white font-batangas text-lg truncate uppercase">{userName}</p>
                    </div>
                  )}

                  {navLinks.map((link, idx) => (
                    <motion.div
                      key={link.path}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 + idx * 0.05 }}
                    >
                      <Link
                        to={link.path}
                        onClick={() => setMenuOpen(false)}
                        className={`flex items-center justify-between px-6 py-4 rounded-xl text-[13px] font-black uppercase tracking-widest border-2 transition-all ${
                          location.pathname === link.path 
                            ? "bg-white text-red-700 border-white shadow-xl scale-[1.02]" 
                            : "text-white/90 hover:bg-white/10 bg-black/5 border-transparent"
                        }`}
                      >
                        <span className="font-batangas">{link.label}</span>
                        {location.pathname === link.path && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* Footer Controls */}
                <div className="p-8 bg-black/20 border-t border-white/10 space-y-6 shrink-0 mt-auto">
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em]">Preferences</span>
                    <LanguageSelector />
                  </div>
                  
                  {userName ? (
                    <button 
                      onClick={handleLogout} 
                      className="w-full py-4 rounded-xl bg-white text-red-700 font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-transform"
                    >
                      LOGOUT ACCOUNT
                    </button>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <Link 
                        to="/login" 
                        onClick={() => setMenuOpen(false)} 
                        className="py-4 text-center text-white bg-white/10 border-2 border-white/10 rounded-xl font-bold text-[10px] uppercase tracking-widest"
                      >
                        LOGIN
                      </Link>
                      <Link 
                        to="/signup" 
                        onClick={() => setMenuOpen(false)} 
                        className="py-4 text-center bg-white text-red-700 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-xl"
                      >
                        JOIN
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;