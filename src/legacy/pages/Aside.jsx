import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { 
  IoIosArrowBack, 
  IoIosContact, 
  IoIosBook, 
  IoIosTelescope, 
  IoIosCard, 
  IoIosLogOut,
  IoIosHome
} from "react-icons/io";

const Aside = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    profilePic: "",
    fullName: "Student",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const db = getFirestore();
  const auth = getAuth();
  const sidebarRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        window.innerWidth < 1024
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDocRef = doc(db, "students", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFormData({
            profilePic: userData.profilePic || "",
            fullName: userData.fullName || "Student",
          });
        }
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [db, auth, navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const menuItems = [
    { title: "MY DASHBOARD", path: "/dashboard", icon: <IoIosHome size={20} /> },
    { title: "MY PROFILE", path: "/profile", icon: <IoIosContact size={20} /> },
    { title: "ENROLLED COURSES", path: "/enrolledcourse", icon: <IoIosBook size={20} /> },
    { title: "BROWSE COURSES", path: "/courses", icon: <IoIosTelescope size={20} /> },
    { title: "PAYMENTS", path: "/finalize", icon: <IoIosCard size={20} /> },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed top-24 left-4 bg-white text-[#dd2727] p-3 rounded-2xl shadow-lg z-[100] border border-[#dd2727]/10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
      )}

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] lg:hidden"
        ></div>
      )}

      <aside
        ref={sidebarRef}
        className={`bg-gradient-to-b from-[#dd2727] to-[#b91c1c] h-[calc(100vh-64px)] md:w-56 w-[85%] sticky top-16 left-0 transition-all duration-500 ease-in-out z-[95] overflow-y-auto scrollbar-hide self-start ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 shadow-[10px_0_40px_rgba(221,39,39,0.1)]`}
      >
        <div className="pt-10 px-3 space-y-12 pb-10 flex flex-col h-full">
          {/* Header Section */}
          <div className="flex justify-between items-center relative px-2">
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-black text-white tracking-tighter">VAHLAY <span className="text-white/40 not-italic font-light">ASTRO</span></h2>
              </div>
              <p className="text-[9px] text-white/50 font-bold uppercase tracking-[0.4em] leading-none">STUDENT PORTAL</p>
            </div>
            <button
              className="lg:hidden p-2 text-white/70 hover:text-white transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <IoIosArrowBack size={24} />
            </button>
          </div>

          {/* Profile Quick Look */}
          <div className="px-2 flex flex-col items-center gap-4">
             <div className="relative group">
                <div className="absolute -inset-1 bg-white/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <img
                  src={formData.profilePic || '/assets/vahlay_astro.png'}
                  alt="Profile"
                  className="relative w-16 h-16 rounded-full object-cover border-2 border-white/20 shadow-xl"
                />
             </div>
             <div className="text-center">
                <h3 className="text-white font-bold text-xs uppercase tracking-wider">{formData.fullName}</h3>
                <p className="text-[8px] text-white/40 uppercase tracking-[0.2em] mt-1">Sacred Seeker</p>
             </div>
          </div>

          <nav className="space-y-1.5 flex-1">
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={index}
                  to={item.path}
                  onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                  className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                    isActive 
                    ? "bg-white/10 backdrop-blur-md text-white shadow-[0_4px_15px_rgba(0,0,0,0.1)] border border-white/10" 
                    : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className={`${isActive ? "text-white scale-110" : "text-white/30 group-hover:text-white/80 group-hover:scale-110"} transition-all duration-300`}>
                    {item.icon}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-[0.15em] ${isActive ? "opacity-100" : "opacity-80 group-hover:opacity-100"}`}>{item.title}</span>
                  
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full shadow-[0_0_10px_white]"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="pt-6">
            <button 
              onClick={handleLogout}
              className="w-full group bg-black/10 backdrop-blur-sm border border-white/5 text-white/50 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-[#dd2727] hover:border-white transition-all duration-500 flex items-center justify-center gap-2"
            >
              <IoIosLogOut size={18} />
              <span className="group-hover:translate-x-1 transition-transform">SIGNOUT</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Aside;
