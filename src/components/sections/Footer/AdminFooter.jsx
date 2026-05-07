import React from 'react';
import { Link } from 'react-router-dom';

const AdminFooter = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-100 border-t border-slate-200 py-12 mt-10">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Column 1: Brand */}
          <div className="space-y-6">
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
              Vahlay <span className="text-[#dd2727]">Astro</span>
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
              Vahlay Astro is a premier cosmic guidance platform. We empower individuals 
              across the globe with innovative, scalable, and sustainable 
              astrological insights and tailored solutions for life.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-[#dd2727]"></span>
            </h4>
            <ul className="space-y-3">
              {['About Us', 'Services', 'Solutions', 'Courses', 'Articles'].map((item) => (
                <li key={item} className="flex items-center gap-2 group cursor-pointer">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-[#dd2727] transition-colors"></span>
                  <span className="text-sm text-slate-500 group-hover:text-slate-900 transition-colors font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] relative inline-block">
              Contact Us
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-[#dd2727]"></span>
            </h4>
            <div className="space-y-4">
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[#dd2727] shadow-sm group-hover:bg-[#dd2727] group-hover:text-white transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </div>
                <span className="text-sm text-slate-600 font-medium">contact@vahlayastro.com</span>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[#dd2727] shadow-sm group-hover:bg-[#dd2727] group-hover:text-white transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                </div>
                <span className="text-sm text-slate-600 font-medium">+91 79 4921 7538</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">
            © {year} Vahlay Astro. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {['Privacy Policy', 'Terms of Service', 'Support'].map(item => (
              <span key={item} className="text-[10px] text-slate-400 font-bold uppercase tracking-widest cursor-pointer hover:text-[#dd2727] transition-colors">{item}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Chat Bubble */}
      <div className="fixed bottom-8 right-8 flex items-center gap-3 z-[100]">
        <div className="bg-white px-4 py-2 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-2 animate-bounce">
          <span className="text-xs font-bold text-slate-700">Chat with us 👋</span>
        </div>
        <button className="w-14 h-14 bg-[#dd2727] rounded-full flex items-center justify-center text-white shadow-[0_10px_30px_rgba(221,39,39,0.4)] hover:scale-110 transition-transform relative">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.5 21.5l4.5-.838A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.477 0-2.854-.396-4.031-1.085l-2.617.487.487-2.617C5.161 16.036 4.765 14.659 4.765 13.182c0-3.992 3.243-7.235 7.235-7.235 3.992 0 7.235 3.243 7.235 7.235 0 3.992-3.243 7.235-7.235 7.235z"/></svg>
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-[#dd2727] text-[10px] font-black rounded-full flex items-center justify-center shadow-sm border border-slate-100">1</span>
        </button>
      </div>
    </footer>
  );
};

export default AdminFooter;
