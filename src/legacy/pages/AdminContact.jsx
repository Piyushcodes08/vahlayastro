import React, { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import Admin from "./Admin";
import Header from "../../components/sections/Header/Header";

import Aside from "./Aside";

const AdminContact = () => {
  const [inquiries, setInquiries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const inquiriesRef = collection(db, "Astro_Contact");
      const inquirySnapshot = await getDocs(inquiriesRef);
      const inquiryList = inquirySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setInquiries(inquiryList);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      setLoading(false);
    }
  };

  const handleDeleteInquiry = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      await deleteDoc(doc(db, "Astro_Contact", id));
      setInquiries(inquiries.filter((inquiry) => inquiry.id !== id));
    } catch (error) {
      console.error("Error deleting inquiry:", error);
    }
  };

  const filteredInquiries = inquiries.filter(
    (inquiry) =>
      inquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div id="top-sentinel" className="absolute top-0 left-0 w-full h-px pointer-events-none z-[-1]" />
      <Header />
      <div className="flex flex-col md:flex-row min-h-screen bg-transparent text-white pt-[70px] relative z-10 premium-container">
        <Aside />

        <main className="flex-1 p-4 md:p-8">
          <div className="space-y-8">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight uppercase">
                Contact <span className="text-[#dd2727]">Messages</span>
              </h2>
              <p className="text-gray-400 text-sm mt-1">Review and manage general contact form submissions</p>
            </div>
            
            <div className="w-full md:w-auto relative group">
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full md:w-64 bg-white/5 border border-white/10 rounded-full px-5 py-2 text-sm focus:ring-2 focus:ring-[#dd2727] outline-none transition-all pr-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg className="w-4 h-4 text-gray-500 absolute right-4 top-1/2 -translate-y-1/2 group-focus-within:text-[#dd2727] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
          </header>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-64 bg-white/5 rounded-3xl animate-pulse"></div>)}
            </div>
          ) : filteredInquiries.length === 0 ? (
            <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl">
              <p className="text-gray-500">No messages found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredInquiries.map((inquiry) => (
                <div key={inquiry.id} className="group bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden hover:bg-black/60 transition-all duration-300">
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#dd2727] to-[#b0a102] rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                          {inquiry.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white group-hover:text-[#dd2727] transition-colors">{inquiry.name}</h3>
                          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{inquiry.createdAt?.toDate().toLocaleString() || inquiry.timestamp?.toDate().toLocaleString()}</p>
                        </div>
                      </div>
                      <button onClick={() => handleDeleteInquiry(inquiry.id)} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Email</p>
                        <p className="text-sm text-gray-300 truncate">{inquiry.email}</p>
                      </div>
                      <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Phone</p>
                        <p className="text-sm text-gray-300">{inquiry.phone || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-2xl p-5 border border-white/5 relative">
                      <svg className="w-8 h-8 text-white/5 absolute top-2 right-4" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 17.2091 20.2261 19 18.017 19H14.017V21ZM5.017 21L5.017 18C5.017 16.8954 5.91243 16 7.017 16H10.017C10.5693 16 11.017 15.5523 11.017 15V9C11.017 8.44772 10.5693 8 10.017 8H6.017C5.46472 8 5.017 8.44772 5.017 9V11C5.017 11.5523 4.56929 12 4.017 12H3.017V5H13.017V15C13.017 17.2091 11.2261 19 9.017 19H5.017V21Z"/></svg>
                      <p className="text-gray-400 text-sm leading-relaxed italic">{inquiry.message}</p>
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                       <a href={`mailto:${inquiry.email}`} className="bg-gradient-to-r from-[#dd2727] to-[#b0a102] px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg hover:scale-105 transition-all">Reply to {inquiry.name?.split(' ')[0]}</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      </div>
    </>
  );
};

export default AdminContact;
