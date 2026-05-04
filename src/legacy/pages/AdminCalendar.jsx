// AdminCalendar.js (Professionally Styled and Responsive)
import React, { useState, useEffect } from "react";
import Admin from "./Admin";
import Header from "../../components/sections/Header/Header";
import { db } from "../../firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { Link } from "react-router-dom";

import Aside from "./Aside";

const AdminCalendar = () => {
  const [calendarEntries, setCalendarEntries] = useState([]);
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCalendarEntries();
  }, []);

  const fetchCalendarEntries = async () => {
    setIsLoading(true);
    try {
      const data = await getDocs(collection(db, "Calendar"));
      const entries = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setCalendarEntries(entries);
    } catch (error) {
      console.error("Error fetching calendar entries:", error);
    }
    setIsLoading(false);
  };

  const handleAddCalendarEntry = async () => {
    if (!date || !timeSlot) return;
    try {
      const newEntry = { date, timeSlot };
      await addDoc(collection(db, "Calendar"), newEntry);
      fetchCalendarEntries();
      setDate("");
      setTimeSlot("");
    } catch (error) {
      console.error("Error adding calendar entry:", error);
    }
  };

  const handleDeleteCalendarEntry = async (id) => {
    if (!window.confirm("Are you sure you want to delete this slot?")) return;
    try {
      await deleteDoc(doc(db, "Calendar", id));
      fetchCalendarEntries();
    } catch (error) {
      console.error("Error deleting calendar entry:", error);
    }
  };

  return (
    <>
      <div id="top-sentinel" className="absolute top-0 left-0 w-full h-px pointer-events-none z-[-1]" />
      <Header />
      <div className="flex flex-col md:flex-row min-h-screen bg-transparent text-white pt-[70px] relative z-10">
        <Aside />

        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-4xl mx-auto space-y-8">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight uppercase">
                Appointment <span className="text-[#dd2727]">Calendar</span>
              </h2>
              <p className="text-gray-400 text-sm mt-1">Manage available slots for consultations</p>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-5">
              <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl sticky top-24">
                <h3 className="text-lg font-bold uppercase tracking-widest mb-6 border-b border-white/10 pb-4">
                  Add New <span className="text-[#b0a102]">Slot</span>
                </h3>
                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleAddCalendarEntry(); }}>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Select Date</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#dd2727] outline-none transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Select Time</label>
                    <input
                      type="time"
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#dd2727] outline-none transition-all"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#dd2727] to-[#b0a102] py-4 rounded-xl font-bold uppercase tracking-widest hover:shadow-[0_0_20px_rgba(221,39,39,0.3)] transition-all"
                  >
                    Add Entry
                  </button>
                </form>
              </div>
            </div>

            {/* List Section */}
            <div className="lg:col-span-7">
              <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl">
                <h3 className="text-lg font-bold uppercase tracking-widest mb-6 border-b border-white/10 pb-4 flex justify-between items-center">
                  Available Slots
                  <span className="text-xs bg-white/5 px-3 py-1 rounded-full text-gray-400">{calendarEntries.length} Total</span>
                </h3>
                
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse"></div>)}
                  </div>
                ) : calendarEntries.length > 0 ? (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {calendarEntries.sort((a, b) => new Date(a.date) - new Date(b.date)).map((entry) => (
                      <div
                        key={entry.id}
                        className="group flex justify-between items-center p-5 border border-white/5 bg-white/5 rounded-2xl hover:bg-white/10 transition-all duration-300"
                      >
                        <div className="flex items-center gap-4">
                          <div className="bg-[#dd2727]/10 p-3 rounded-xl text-[#dd2727]">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                          </div>
                          <div>
                            <p className="font-bold text-white tracking-wide">{entry.date}</p>
                            <p className="text-sm text-gray-400 flex items-center gap-1">
                              <svg className="w-3 h-3 text-[#b0a102]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/></svg>
                              {entry.timeSlot}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteCalendarEntry(entry.id)}
                          className="opacity-0 group-hover:opacity-100 p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    <p>No available slots found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      </div>
    </>
  );
};

export default AdminCalendar;
