import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { 
    IoIosArrowBack, 
    IoIosContact, 
    IoIosLogOut
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
        { title: "My Profile", path: "/profile" },
        { title: "Enrolled Courses", path: "/enrolledcourse" },
        { title: "Add Courses", path: "/courses" },
        { title: "Payments", path: "/finalize" },
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
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90] lg:hidden"
                ></div>
            )}

            <aside
                ref={sidebarRef}
                className={`fixed lg:sticky top-0 lg:top-14 left-0 w-72 bg-[#dd2727] transition-all duration-300 transform z-[100] flex flex-col h-screen lg:h-[calc(100vh-56px)] overflow-y-auto custom-scrollbar self-start
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
            >
                {/* Profile Section */}
                <div className="pt-10 pb-8 flex flex-col items-center flex-shrink-0 text-center">
                    <div className="w-32 h-32 rounded-full border-4 border-white/40 overflow-hidden shadow-2xl mb-4 bg-white/10 flex items-center justify-center transition-transform hover:scale-105 duration-500">
                        {formData.profilePic ? (
                            <img
                                src={formData.profilePic}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <IoIosContact size={80} className="text-white/40" />
                        )}
                    </div>
                    <h2 className="text-white text-xl font-black tracking-tight uppercase px-4">{formData.fullName}</h2>
                    <p className="text-[8px] text-white/40 uppercase tracking-[0.3em] mt-1 font-bold">Sacred Seeker</p>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 px-8 space-y-4 pb-10">
                    {menuItems.map((item, index) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <button
                                key={index}
                                onClick={() => {
                                    navigate(item.path);
                                    if (window.innerWidth < 1024) setSidebarOpen(false);
                                }}
                                className={`w-full text-center px-4 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-300
                                ${isActive 
                                    ? "bg-white text-[#dd2727] shadow-xl transform scale-105" 
                                    : "bg-white/10 text-white hover:bg-white/20 hover:translate-x-1"}`}
                            >
                                {item.title}
                            </button>
                        );
                    })}
                </nav>

                {/* Logout Section */}
                <div className="p-8 border-t border-white/10 mt-auto flex-shrink-0">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-black text-white bg-black/20 hover:bg-black/40 transition-all uppercase tracking-[0.3em] text-[9px]"
                    >
                        <IoIosLogOut size={16} />
                        Logout Session
                    </button>
                </div>

                {/* Close button for mobile */}
                <button
                    onClick={() => setSidebarOpen(false)}
                    className="lg:hidden absolute top-6 right-6 text-white hover:scale-110 transition-transform"
                >
                    <IoIosArrowBack size={28} />
                </button>
            </aside>
        </>
    );
};

export default Aside;
