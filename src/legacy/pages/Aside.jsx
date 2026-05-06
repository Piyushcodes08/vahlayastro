import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";

const Aside = () => {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    profilePic: "",
    fullName: "NA",
    fathersName: "NA",
    mothersName: "NA",
    dob: "NA",
    email: "NA",
  });

  const navigate = useNavigate();
  const db = getFirestore();
  const auth = getAuth();
  const sidebarRef = useRef();

  // ORIGINAL LOGIC: Click outside to close sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        window.innerWidth < 768
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  // ORIGINAL LOGIC: Fetch profile
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
      const fetchProfile = async () => {
        const userDocRef = doc(db, "students", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFormData({
            profilePic: userData.profilePic || "",
            fullName: userData.fullName || "NA",
            fathersName: userData.fathersName || "NA",
            mothersName: userData.mothersName || "NA",
            dob: userData.dob || "NA",
            email: currentUser.email || "NA",
          });
        }
        setLoading(false);
      };
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [db, auth]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [auth, navigate]);

  return (
    <>
      {/* Mobile Sidebar Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-[85px] left-4 bg-black/60 backdrop-blur-md p-3 rounded-2xl border border-white/10 z-[60] hover:bg-[#dd2727] transition-all"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[55] md:hidden"
        ></div>
      )}

      <aside
        ref={sidebarRef}
        className={`p-6 fixed md:relative z-50 inset-y-0 left-0 bg-[#0a0a0a]/60 backdrop-blur-3xl border-r border-white/10 text-white shadow-[20px_0_60px_rgba(0,0,0,0.4)] transform transition-all duration-500 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:w-72 w-[85%] flex-shrink-0 min-h-[calc(100vh-80px)] flex flex-col`}
      >
        <div className="flex flex-col items-center mb-12 relative">
          <div className="relative group">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-[#dd2727] to-[#b0a102] rounded-full blur-xl opacity-20 group-hover:opacity-60 transition duration-1000"></div>
            <img
              src={formData.profilePic || '/assets/vahlay_astro.png'}
              alt="Profile"
              className="relative w-24 h-24 rounded-full object-cover border-4 border-white/10 shadow-2xl"
            />
            <div className="absolute bottom-1.5 right-1.5 w-5 h-5 bg-green-500 border-4 border-[#0a0a0a] rounded-full shadow-[0_0_15px_rgba(34,197,94,0.8)] animate-pulse"></div>
          </div>
          <div className="text-center mt-6">
            <h2 className="text-xl font-bold tracking-tight text-white uppercase">{formData.fullName}</h2>
            <p className="text-[10px] font-bold text-[#dd2727] uppercase tracking-[0.25em] mt-2 bg-[#dd2727]/10 px-4 py-1.5 rounded-full border border-[#dd2727]/20 shadow-[0_0_20px_rgba(221,39,39,0.1)]">Dashboard</p>
          </div>
          
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-2xl font-bold absolute -top-4 -right-4 md:hidden text-gray-500 hover:text-[#dd2727] transition-colors"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1">
          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em] ml-2 mb-6">Menu</p>
          <ul className="space-y-2">
            {[
              // ORIGINAL TITLES: My Profile, Enrolled Courses, Add Courses, Payments
              { to: "/profile", label: "My Profile", icon: "👤" },
              { to: "/enrolledcourse", label: "Enrolled Courses", icon: "📖" },
              { to: "/courses", label: "Add Courses", icon: "🔭" },
              { to: "/finalize", label: "Payments", icon: "💳" },
            ].map((link, i) => (
              <li key={i}>
                <Link 
                  to={link.to} 
                  className="group flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-white/5 border border-transparent hover:border-white/10"
                >
                  <span className="text-xl group-hover:scale-125 transition-transform duration-500">{link.icon}</span>
                  <span className="text-xs font-bold text-gray-400 group-hover:text-white uppercase tracking-widest transition-colors">{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto p-6 rounded-[2.5rem] bg-gradient-to-br from-white/5 to-transparent border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-[#dd2727]/5 rounded-full blur-2xl group-hover:bg-[#dd2727]/10 transition-all"></div>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-3 relative z-10">Support</p>
          <p className="text-[11px] text-gray-400 leading-relaxed font-medium relative z-10">Vahlay Astro Management System.</p>
        </div>
      </aside>
    </>
  );
};

export default Aside;
