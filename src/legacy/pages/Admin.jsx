import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import {
  MdArticle,
  MdCalendarMonth,
  MdLibraryAdd,
  MdViewModule,
  MdVideoCall,
  MdSubscriptions,
  MdAttachMoney,
  MdTrackChanges,
  MdPayment,
  MdQuestionAnswer,
  MdContactMail,
  MdLiveHelp,
  MdVideoLibrary,
  MdShoppingCart,
} from "react-icons/md";

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef();

  // ORIGINAL LOGIC: Click outside to close sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        window.innerWidth < 768
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  // ORIGINAL LOGIC & TITLES: Menu items from old folder
  const menuItems = [
    { name: "Add Articles", path: "/admin/adminarticle", icon: <MdArticle /> },
    { name: "Calendar", path: "/admin/admincalendar", icon: <MdCalendarMonth /> },
    { name: "Add Course", path: "/admin/addcourse", icon: <MdLibraryAdd /> },
    { name: "Add Module", path: "/admin/addmodule", icon: <MdViewModule /> },
    { name: "Add Live Session", path: "/admin/addmeeting", icon: <MdVideoCall /> },
    { name: "Subscribe List", path: "/admin/adminsubscribecourselist", icon: <MdSubscriptions /> },
    { name: "Add EMI Plans", path: "/admin/addemi", icon: <MdAttachMoney /> },
    { name: "Track EMI Plans", path: "/admin/emailuserlist", icon: <MdTrackChanges /> },
    { name: "Payment List", path: "/admin/payment", icon: <MdPayment /> },
    { name: "Course Inquiry", path: "/admin/admininquiry", icon: <MdLiveHelp /> },
    { name: "ContactUs Inquiry", path: "/admin/admincontact", icon: <MdContactMail /> },
    { name: "Question & Ans", path: "/admin/question-ans", icon: <MdQuestionAnswer /> },
    { name: "Course Order", path: "/admin/admincourseorder", icon: <MdShoppingCart /> },
    { name: "Video Order", path: "/admin/vedio-order", icon: <MdVideoLibrary /> },
  ];

  return (
    <>
      {/* Toggle Button for Mobile */}
      {!isOpen && (
        <button
          className="lg:hidden fixed top-[85px] left-4 bg-black/60 backdrop-blur-md p-3 rounded-2xl border border-white/10 z-40 hover:bg-[#dd2727] transition-all"
          onClick={() => setIsOpen(true)}
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
      )}

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
        ></div>
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`bg-[#050505] border-r border-white/5 h-screen md:w-72 w-[85%] fixed lg:sticky top-0 left-0 transition-transform duration-500 ease-out z-50 overflow-y-auto scrollbar-hide shadow-2xl ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="p-8 space-y-10">
          {/* Header Section */}
          <div className="flex justify-between items-center relative">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#dd2727] animate-pulse shadow-[0_0_10px_rgba(221,39,39,0.5)]"></div>
                {/* ORIGINAL TITLE: Admin Portal */}
                <h2 className="text-xl font-bold text-white uppercase tracking-tighter">Admin <span className="text-[#dd2727]">Portal</span></h2>
              </div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em] ml-5">Vahlay Astro HQ</p>
            </div>
            
            <button
              className="lg:hidden p-2 text-gray-500 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              <IoIosArrowBack size={20} />
            </button>
          </div>

          {/* User Profile Hook */}
          <div className="bg-white/5 border border-white/5 rounded-[2rem] p-5 flex items-center gap-4 group hover:border-[#dd2727]/30 transition-all duration-500">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#dd2727] to-[#b0a102] flex items-center justify-center text-white font-bold text-lg shadow-lg">A</div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">Grand Architect</p>
              <p className="text-[9px] text-[#dd2727] font-bold uppercase tracking-widest mt-0.5">Primary Root</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {menuItems.map((item, index) => (
              <Link 
                key={index} 
                to={item.path}
                onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
                className="flex items-center gap-4 px-6 py-4 rounded-2xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute left-0 top-0 w-1 h-full bg-[#dd2727] -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                <span className="text-xl group-hover:scale-110 transition-transform duration-300 text-gray-600 group-hover:text-[#dd2727]">{item.icon}</span>
                <span className="text-[11px] font-bold uppercase tracking-widest">{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Logout Button Placeholder */}
          <div className="pt-10">
            <button className="w-full bg-white/5 border border-white/5 text-gray-500 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-red-500/10 hover:text-red-500 transition-all">
              Terminate Session
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SideBar;
