
import React, { useState } from "react";
import axios from "axios";

import Aside from "../Aside";
import Header from "../../../components/sections/Header/Header";

const CreateLiveSession = () => {
  const [sessionData, setSessionData] = useState({
    title: "",
    roomName: "",
    date: "",
    time: "",
  });
  const [meetings, setMeetings] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSessionData({ ...sessionData, [name]: value });
  };

  const createZoomMeeting = async () => {
    const { title, roomName, date, time } = sessionData;

    if (!title || !roomName || !date || !time) {
      alert("Please fill in all cosmic coordinates");
      return;
    }

    // This is a placeholder logic from original file
    const newMeeting = {
      id: Date.now(),
      topic: title,
      room: roomName,
      join_url: "#",
      date,
      time
    };

    setMeetings((prev) => [...prev, newMeeting]);
    setSessionData({ title: "", roomName: "", date: "", time: "" });
    alert("Cosmic session scheduled!");
  };

  const deleteMeeting = (id) => {
    setMeetings(meetings.filter((meeting) => meeting.id !== id));
  };

  return (
    <>
      <div id="top-sentinel" className="absolute top-0 left-0 w-full h-px pointer-events-none z-[-1]" />
      <Header />
      <div className="flex flex-col md:flex-row min-h-screen bg-transparent text-white pt-[70px] relative z-10 premium-container">
        <Aside />
        
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-4xl mx-auto space-y-10">
            <header className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-[0_0_30px_rgba(221,39,39,0.1)]">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight uppercase">
                Live <span className="text-[#dd2727]">Sessions</span>
              </h2>
              <p className="text-gray-400 font-medium uppercase tracking-widest text-xs mt-2">Schedule real-time spiritual transmissions</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <section className="bg-white/5 border border-white/10 rounded-3xl p-8 shadow-xl">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#dd2727] mb-8 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  New Transmission
                </h3>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Room Orbit</label>
                    <div className="relative">
                      <select
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#dd2727] outline-none appearance-none cursor-pointer text-white"
                        name="roomName"
                        value={sessionData.roomName}
                        onChange={handleInputChange}
                      >
                        <option value="" className="bg-[#0a0a0a]">Select Room</option>
                        <option value="Basics" className="bg-[#0a0a0a]">Basics (Free Orbit)</option>
                        <option value="Advanced" className="bg-[#0a0a0a]">Advanced (Paid Orbit)</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Session Title</label>
                    <input
                      type="text"
                      name="title"
                      placeholder="e.g. Mercury Retrograde Deep Dive"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#dd2727] outline-none text-white"
                      value={sessionData.title}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Launch Date</label>
                      <input
                        type="date"
                        name="date"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#dd2727] outline-none text-white"
                        value={sessionData.date}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Transm. Time</label>
                      <input
                        type="time"
                        name="time"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#dd2727] outline-none text-white"
                        value={sessionData.time}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <button
                    onClick={createZoomMeeting}
                    className="w-full bg-gradient-to-r from-[#dd2727] to-[#b0a102] py-4 rounded-xl font-bold uppercase tracking-[0.2em] hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(221,39,39,0.3)] mt-4"
                  >
                    Schedule Transmission
                  </button>
                </div>
              </section>

              <section className="space-y-6">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 h-full">
                  <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#b0a102] mb-8">Scheduled Queue</h3>
                  
                  {meetings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
                      <svg className="w-16 h-16 mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                      <p className="italic text-xs font-medium uppercase tracking-widest">No transmissions in the current queue</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {meetings.map((meeting) => (
                        <div key={meeting.id} className="p-6 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all group shadow-lg">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <span className="text-[10px] font-bold text-[#b0a102] uppercase tracking-[0.2em] mb-1 block">{meeting.room} Orbit</span>
                              <h4 className="font-bold text-white text-lg tracking-tight group-hover:text-[#dd2727] transition-colors">{meeting.topic}</h4>
                            </div>
                            <button
                              onClick={() => deleteMeeting(meeting.id)}
                              className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                            </button>
                          </div>
                          <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                            <div className="flex gap-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                              <span className="flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                {meeting.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                {meeting.time}
                              </span>
                            </div>
                            <a
                              href={meeting.join_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-6 py-2 bg-gradient-to-r from-[#dd2727] to-[#b0a102] text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-lg hover:scale-105 transition-all shadow-md"
                            >
                              Launch
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default CreateLiveSession;
