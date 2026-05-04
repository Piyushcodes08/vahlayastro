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
        className="md:hidden fixed top-24 left-4 text-white p-2 rounded z-[60]"
      >
        <img
         src="https://cdn-icons-png.flaticon.com/512/14025/14025507.png" 
         alt="menu" 
         className="h-8"
         />
      </button>

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-[55] md:hidden"
        ></div>
      )}

      <aside
        ref={sidebarRef}
        className={`p-4 fixed md:relative z-50 inset-y-0 left-0 bg-black/60 backdrop-blur-xl border-r border-white/10 text-white shadow-[4px_0_24px_rgba(221,39,39,0.15)] transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:w-64 w-4/5 flex-shrink-0 min-h-[calc(100vh-70px)]`}
      >
        <div className="p-6 flex flex-col items-center">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#dd2727] to-[#b0a102] rounded-full blur opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <img
              src={formData.profilePic || '/assets/vahlay_astro.png'}
              alt="Profile"
              className="relative w-28 h-28 rounded-full object-cover border-2 border-white/20 bg-black" 
            />
          </div>
          <h2 className="text-lg font-bold mt-4 tracking-wide">{formData.fullName}</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-2xl font-bold absolute top-4 right-4 md:hidden text-gray-400 hover:text-white transition-colors"
          >
            ✖
          </button>
        </div>
        <nav className="p-4 mt-2">
          <ul className="space-y-4">
            <li>
              <Link to="/profile" className="block p-3 bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 rounded-xl transition-all duration-300 font-medium text-gray-300 hover:text-white hover:shadow-[0_0_15px_rgba(221,39,39,0.3)] hover:translate-x-1">
                My Profile
              </Link>
            </li>
            <li>
              <Link to="/enrolledcourse" className="block p-3 bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 rounded-xl transition-all duration-300 font-medium text-gray-300 hover:text-white hover:shadow-[0_0_15px_rgba(221,39,39,0.3)] hover:translate-x-1">
                Enrolled Courses
              </Link>
            </li>
            <li>
              <Link to="/courses" className="block p-3 bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 rounded-xl transition-all duration-300 font-medium text-gray-300 hover:text-white hover:shadow-[0_0_15px_rgba(221,39,39,0.3)] hover:translate-x-1">
                Add Courses
              </Link>
            </li>
            <li>
              <Link to="/finalize" className="block p-3 bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 rounded-xl transition-all duration-300 font-medium text-gray-300 hover:text-white hover:shadow-[0_0_15px_rgba(221,39,39,0.3)] hover:translate-x-1">
                Payments
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Aside;
