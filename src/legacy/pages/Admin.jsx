import React, { useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  IoIosArrowBack,
  IoIosPaper,
  IoIosCalendar,
  IoIosAddCircle,
  IoIosListBox,
  IoIosVideocam,
  IoIosPeople,
  IoIosCash,
  IoIosStats,
  IoIosCard,
  IoIosHelpCircle,
  IoIosContact,
  IoIosChatbubbles,
  IoIosCart,
  IoIosPlay
} from "react-icons/io";

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);
  const location = useLocation();

  const menuItems = [
    { title: "ADD ARTICLES", path: "/admin/adminarticle", icon: <IoIosPaper size={20} /> },
    { title: "CALENDAR", path: "/admin/admincalendar", icon: <IoIosCalendar size={20} /> },
    { title: "ADD COURSE", path: "/admin/addcourse", icon: <IoIosAddCircle size={20} /> },
    { title: "ADD MODULE", path: "/admin/addmodule", icon: <IoIosListBox size={20} /> },
    { title: "ADD LIVE SESSION", path: "/admin/adminlivesession", icon: <IoIosVideocam size={20} /> },
    { title: "SUBSCRIBE LIST", path: "/admin/adminsubscribecourselist", icon: <IoIosPeople size={20} /> },
    { title: "ADD EMI PLANS", path: "/admin/addemi", icon: <IoIosCash size={20} /> },
    { title: "TRACK EMI PLANS", path: "/admin/emailuserlist", icon: <IoIosStats size={20} /> },
    { title: "PAYMENT LIST", path: "/admin/payment", icon: <IoIosCard size={20} /> },
    { title: "COURSE INQUIRY", path: "/admin/admininquiry", icon: <IoIosHelpCircle size={20} /> },
    { title: "CONTACTUS INQUIRY", path: "/admin/admincontact", icon: <IoIosContact size={20} /> },
    { title: "QUESTION & ANS", path: "/admin/question-ans", icon: <IoIosChatbubbles size={20} /> },
    { title: "COURSE ORDER", path: "/admin/admincourseorder", icon: <IoIosCart size={20} /> },
    { title: "VIDEO ORDER", path: "/admin/vedio-order", icon: <IoIosPlay size={20} /> },
  ];

  return (
    <>
      {/* Toggle Button for Mobile */}
      {!isOpen && (
        <button
          className="lg:hidden fixed top-24 left-4 bg-white text-[#dd2727] p-3 rounded-2xl shadow-lg z-[100] transition-all border border-[#dd2727]/10"
          onClick={() => setIsOpen(true)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      )}

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] lg:hidden"
        ></div>
      )}

      {/* Sidebar - Perfect Premium Theme with Restored Paths */}
      <aside
        ref={sidebarRef}
        className={`bg-gradient-to-b from-[#dd2727] to-[#b91c1c] h-[calc(100vh-64px)] md:w-56 w-[85%] sticky top-16 left-0 transition-all duration-500 ease-in-out z-[95] overflow-y-auto scrollbar-hide self-start ${isOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 shadow-[10px_0_40px_rgba(221,39,39,0.1)]`}
      >
        <div className="pt-10 px-3 space-y-12 pb-10">
          {/* Header Section - Modern & Clean */}
          <div className="flex justify-between items-center relative">
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-black text-white tracking-tighter">VAHLAY <span className="text-white/40 not-italic font-light">ASTRO</span></h2>
              </div>
              <p className="text-[9px] text-white/50 font-bold uppercase tracking-[0.4em]  leading-none">ADMINISTRATION HQ</p>
            </div>

            <button
              className="lg:hidden p-2 text-white/70 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <IoIosArrowBack size={24} />
            </button>
          </div>

          <nav className="space-y-1.5">
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={index}
                  to={item.path}
                  onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
                  className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                    isActive 
                    ? "bg-white/10 backdrop-blur-md text-white shadow-[0_4px_15px_rgba(0,0,0,0.1)] border border-white/10" 
                    : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className={`${isActive ? "text-white scale-110" : "text-white/30 group-hover:text-white/80 group-hover:scale-110"} transition-all duration-300`}>
                    {item.icon}
                  </div>
                  <span className={`text-[11px] font-bold uppercase tracking-[0.15em] ${isActive ? "opacity-100" : "opacity-80 group-hover:opacity-100"}`}>{item.title}</span>
                  
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full shadow-[0_0_10px_white]"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="pt-6">
            <button className="w-full group bg-black/10 backdrop-blur-sm border border-white/5 text-white/50 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-[#dd2727] hover:border-white transition-all duration-500 flex items-center justify-center gap-2">
              <span className="group-hover:translate-x-1 transition-transform">TERMINATE</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">SESSION</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
