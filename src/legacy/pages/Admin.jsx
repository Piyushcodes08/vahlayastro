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
      {/* Toggle Button */}
      {!isOpen && (
        <button
          className="lg:hidden fixed top-24 left-4 text-white p-3 rounded-xl z-40 bg-black/40 backdrop-blur-md border border-white/10 shadow-[0_0_15px_rgba(221,39,39,0.3)] transition-all hover:scale-110 active:scale-95"
          onClick={() => setIsOpen(true)}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/14025/14025507.png"
            alt="menu"
            className="h-6 w-6"
          />
        </button>
      )}

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
        ></div>
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`bg-black/80 backdrop-blur-2xl border-r border-white/10 text-white h-full md:w-64 w-[85%] p-6 fixed lg:relative transition-all duration-500 ease-in-out overflow-y-auto left-0 top-0 z-50 shadow-[4px_0_24px_rgba(221,39,39,0.15)] ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between mb-10 pb-4 border-b border-white/10">
          <h2 className="text-xl font-bold tracking-wider uppercase text-white">
            Admin <span className="text-[#dd2727]">Portal</span>
          </h2>
          <button
            className="lg:hidden text-gray-400 hover:text-white transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <IoIosArrowBack size={24} />
          </button>
        </div>

        <nav>
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  onClick={() => window.innerWidth < 768 && setIsOpen(false)}
                  className="group flex items-center gap-4 p-3 rounded-xl transition-all duration-300 hover:bg-white/5 border border-transparent hover:border-white/10 text-gray-400 hover:text-white"
                >
                  <span className="text-2xl text-[#dd2727] group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </span>
                  <span className="text-sm font-medium tracking-wide">
                    {item.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom decorative element */}
        <div className="mt-10 p-4 rounded-2xl bg-gradient-to-r from-[#dd2727]/10 to-transparent border border-[#dd2727]/20">
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold mb-1">Status</p>
          <p className="text-xs text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Server Online
          </p>
        </div>
      </aside>
    </>
  );
};

export default SideBar;

