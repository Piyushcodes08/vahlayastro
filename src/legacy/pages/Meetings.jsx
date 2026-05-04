import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import Draggable from 'react-draggable';
import { useParams } from 'react-router-dom';
import Aside from '../pages/Aside';
import Header from "../../components/sections/Header/Header";

const CourseMeetingPopup = () => {
    const { courseName } = useParams();
    const [meetings, setMeetings] = useState([]);
    const [iframeUrl, setIframeUrl] = useState('');
    const [showIframe, setShowIframe] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const fetchMeetings = async () => {
            const meetingsRef = collection(db, 'meetings');
            const q = query(meetingsRef, where('courseId', '==', courseName));
            const querySnapshot = await getDocs(q);
            let meetingDocs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Sort by start date
            meetingDocs.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

            // Transform roomUrl to embedUrl for iframe usage
            meetingDocs = meetingDocs.map(m => {
                if (m.ringCentralMeeting?.roomUrl) {
                    const roomName = m.ringCentralMeeting.roomUrl.split('/').pop();
                    return {
                        ...m,
                        ringCentralMeeting: {
                            ...m.ringCentralMeeting,
                            embedUrl: `https://whereby.com/embed/${roomName}`
                        }
                    };
                }
                return m;
            });

            setMeetings(meetingDocs);
        };

        fetchMeetings();
    }, [courseName]);

    const handleOpenPopup = (url) => {
        // If user passes the normal room URL, convert to embed automatically
        let finalUrl = url;
        if (url.includes('whereby.com') && !url.includes('/embed/')) {
            const roomName = url.split('/').pop();
            finalUrl = `https://whereby.com/embed/${roomName}`;
        }

        setIframeUrl(finalUrl);
        setShowIframe(true);
        setIsFullscreen(false);
    };

    const handleClosePopup = () => {
        setShowIframe(false);
        setIframeUrl('');
        setIsFullscreen(false);
    };

    if (!meetings) return <h1>Loading...</h1>;

    return (
        <>
            <div id="top-sentinel" className="absolute top-0 left-0 w-full h-px pointer-events-none z-[-1]" />
            <Header />
            <div className="flex flex-col md:flex-row min-h-screen bg-[#0a0a0a] text-white pt-[70px] relative z-10">
                <Aside />
                <main className="flex-1 p-4 md:p-8">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-[0_0_30px_rgba(221,39,39,0.1)]">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 uppercase tracking-tight">
                                Live <span className="text-[#dd2727]">Sessions</span>
                            </h2>
                            <p className="text-gray-400 font-medium uppercase tracking-widest text-xs">Course: {courseName}</p>
                        </div>

                        {meetings.length === 0 ? (
                            <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center">
                                <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                                <p className="text-gray-500 font-medium italic">No meetings scheduled for this course yet.</p>
                            </div>
                        ) : (
                            <div className="grid gap-6">
                                {meetings.map((m) => (
                                    <div
                                        key={m.id}
                                        className="group bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-lg"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                                <h3 className="text-xl font-bold text-white group-hover:text-[#dd2727] transition-colors">{m.subject}</h3>
                                            </div>
                                            <p className="text-sm text-gray-400 font-medium flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                                {new Date(m.startDate).toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="w-full md:w-auto">
                                            {m.ringCentralMeeting?.roomUrl ? (
                                                <button
                                                    onClick={() => handleOpenPopup(m.ringCentralMeeting.roomUrl)}
                                                    className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-[#dd2727] to-[#b0a102] text-white rounded-xl font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_20px_rgba(221,39,39,0.3)]"
                                                >
                                                    Join Now
                                                </button>
                                            ) : (
                                                <span className="text-xs text-gray-500 font-bold uppercase tracking-widest bg-white/5 px-4 py-2 rounded-lg border border-white/5">Link Pending</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>

                {showIframe && (
                    <div className={`fixed inset-0 z-[10000] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4`}>
                        <div className={`relative bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(221,39,39,0.3)] flex flex-col ${isFullscreen ? 'w-screen h-screen rounded-none' : 'w-full max-w-5xl h-[80vh]'}`}>
                            <div className="flex justify-between items-center p-4 bg-black/40 border-b border-white/10">
                                <div className="flex items-center gap-3">
                                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                                    <span className="text-sm font-bold text-white uppercase tracking-[0.2em]">🔴 Cosmic Live Session</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setIsFullscreen(!isFullscreen)}
                                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                                        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                                    >
                                        {isFullscreen ? 
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 9L4 4m0 0l5 0M4 4l0 5m11 0l5-5m0 0l-5 0m5 0l0 5M9 15l-5 5m0 0l5 0m-5 0l0-5m11 0l5 5m0 0l-5 0m5 0l0-5"/></svg> :
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/></svg>
                                        }
                                    </button>
                                    <button
                                        onClick={handleClosePopup}
                                        className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-full transition-all"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                                    </button>
                                </div>
                            </div>
                            <iframe
                                src={iframeUrl}
                                className="w-full flex-grow border-0"
                                allow="camera; microphone; fullscreen; speaker; display-capture"
                                allowFullScreen
                                title="Cosmic Meeting"
                            ></iframe>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default CourseMeetingPopup;
