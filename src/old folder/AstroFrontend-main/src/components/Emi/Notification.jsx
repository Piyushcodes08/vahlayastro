import React, { useState, useEffect, useRef } from "react";
import { db } from "../../firebaseConfig";
import { collection, query, where, onSnapshot, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { BellIcon, TrashIcon, CheckCircleIcon, CreditCardIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const currentUser = getAuth().currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return;
    const q = query(collection(db, "notifications"), where("userId", "==", currentUser.email));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setNotifications(fetched);
      setUnreadCount(fetched.filter((n) => n.status === "unread").length);
    });
    return () => unsubscribe();
  }, [currentUser]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (id) => await updateDoc(doc(db, "notifications", id), { status: "read" });
  const deleteNotification = async (id) => await deleteDoc(doc(db, "notifications", id));
  
  const clearAllNotifications = async () => {
    if (window.confirm("Clear all notifications?")) {
      for (const notif of notifications) await deleteDoc(doc(db, "notifications", notif.id));
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Premium Bell Button */}
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/10 border border-white/20 text-white transition-all hover:bg-white/20 active:scale-90"
      >
        <BellIcon className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-red-600 shadow-lg ring-2 ring-red-500">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Modern Dropdown Card */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-4 w-[320px] overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5 z-50 animate-in fade-in zoom-in duration-200">
          {/* Header */}
          <div className="bg-gray-50/80 px-5 py-4 flex justify-between items-center border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 tracking-tight">Notifications</h3>
            <div className="flex gap-2">
              <button onClick={clearAllNotifications} className="text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-red-500 transition">Clear</button>
              <button onClick={() => setDropdownOpen(false)}><XMarkIcon className="h-4 w-4 text-gray-400 hover:text-gray-600" /></button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="py-10 text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 text-gray-300 mb-2">
                   <BellIcon className="h-6 w-6" />
                </div>
                <p className="text-xs text-gray-400 font-medium">No new alerts</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {notifications.sort((a,b) => b.timestamp - a.timestamp).map((notif) => (
                  <div key={notif.id} className={`group relative p-4 transition-colors hover:bg-gray-50 ${notif.status === "unread" ? "bg-red-50/40" : ""}`}>
                    <div className="flex flex-col gap-1 pr-8">
                      <p className={`text-xs leading-relaxed ${notif.status === 'unread' ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                        {notif.message}
                      </p>
                      <span className="text-[10px] text-gray-400 uppercase font-medium tracking-tight">
                         {new Date(notif.timestamp?.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* Hover Actions */}
                    <div className="mt-3 flex items-center gap-2">
                      <button onClick={() => navigate("/finalize")} className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-full text-[10px] font-bold hover:bg-red-700 transition">
                        <CreditCardIcon className="h-3 w-3" /> Pay
                      </button>
                      {notif.status === "unread" && (
                        <button onClick={() => markAsRead(notif.id)} className="p-1.5 text-gray-400 hover:text-green-600 transition"><CheckCircleIcon className="h-4 w-4" /></button>
                      )}
                      <button onClick={() => deleteNotification(notif.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition"><TrashIcon className="h-4 w-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;