import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/sections/Header/Header";

const SubmissionSuccess = () => {
  const location = useLocation(); // Retrieve data passed from the previous page
  const navigate = useNavigate();

  // Extract data from location state
  const { firstName, availableDate, isNewUser } = location.state || {};

  const handleExploreMore = () => {
    navigate("/home"); // Redirect to home page
  };

  return (
    <>
      <div id="top-sentinel" className="absolute top-0 left-0 w-full h-px pointer-events-none z-[-1]" />
      <Header />
      <div className="min-h-screen bg-[#0a0a0a] text-white pt-[120px] pb-20 px-4 flex items-center justify-center relative z-10">
        <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-10 md:p-16 rounded-[2.5rem] w-full max-w-2xl text-center shadow-[0_0_50px_rgba(221,39,39,0.2)]">
          <div className="w-24 h-24 bg-gradient-to-r from-[#dd2727] to-[#b0a102] rounded-full flex items-center justify-center mx-auto mb-10 shadow-[0_0_30px_rgba(221,39,39,0.4)] animate-pulse">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white uppercase tracking-tight">
            Transmission <span className="text-[#dd2727]">Received</span>
          </h2>

          <div className="text-lg md:text-xl text-gray-300 mb-12 leading-relaxed space-y-4">
            {isNewUser && !availableDate ? (
              <p>
                Greetings, <span className="text-white font-bold">{firstName}</span>. 
                <br />
                Your connection to the celestial network has been established. Our guides will reach out to you shortly to harmonize your schedule.
              </p>
            ) : (
              <p>
                Greetings, <span className="text-white font-bold">{firstName}</span>.
                <br />
                Your cosmic appointment is aligned for <span className="text-[#b0a102] font-bold">{availableDate}</span>. Our agent will initiate contact then.
              </p>
            )}
          </div>

          <button
            onClick={handleExploreMore}
            className="px-12 py-5 bg-gradient-to-r from-[#dd2727] to-[#b0a102] text-white font-bold uppercase tracking-[0.3em] rounded-2xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(221,39,39,0.4)]"
          >
            Explore More
          </button>
        </div>
      </div>
    </>
  );
};

export default SubmissionSuccess;
