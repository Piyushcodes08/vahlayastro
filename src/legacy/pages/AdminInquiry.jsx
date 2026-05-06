import React, { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import SideBar from "./Admin";
import Header from "../../components/sections/Header/Header";


const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedInquiry, setExpandedInquiry] = useState(null);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const inquiriesRef = collection(db, "Astroinquiries");
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
    if (!window.confirm("Are you sure you want to delete this inquiry?")) return;
    try {
      await deleteDoc(doc(db, "Astroinquiries", id));
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
      inquiry.course?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-layout">
      <div id="top-sentinel" className="absolute top-0 left-0 w-full h-px pointer-events-none z-[-1]" />
      <Header />
      <div className="flex flex-col md:flex-row min-h-screen pt-[70px] relative z-10 premium-container">
        <SideBar />

        <main className="flex-1 p-4 md:p-8">
          <div className="space-y-8">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight uppercase text-[#1a1a1a]">
                Course <span className="text-[#dd2727]">Inquiries</span>
              </h2>
              <p className="text-gray-500 text-sm mt-1">Manage student queries and leads</p>
            </div>
            
            <div className="w-full md:w-auto relative group">
              <input
                type="text"
                placeholder="Search queries..."
                className="w-full md:w-64 bg-gray-50 border border-black/5 rounded-full px-5 py-2 text-sm text-[#1a1a1a] focus:ring-2 focus:ring-[#dd2727] outline-none transition-all pr-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 group-focus-within:text-[#dd2727] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
          </header>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-48 bg-gray-100 rounded-3xl animate-pulse"></div>)}
            </div>
          ) : filteredInquiries.length === 0 ? (
            <div className="text-center py-20 bg-white border border-black/5 rounded-3xl shadow-sm">
              <p className="text-gray-500">No inquiries found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInquiries.map((inquiry) => (
                <div key={inquiry.id} className="group bg-white border border-black/5 rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 relative p-1">
                  <div className="bg-gray-50 rounded-[2.25rem] p-6 h-full border border-black/5">
                    <div className="flex justify-between items-start mb-6">
                      <div className="bg-[#dd2727]/10 p-3 rounded-2xl text-[#dd2727]">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                      </div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{inquiry.timestamp?.toDate().toLocaleDateString()}</span>
                    </div>

                    <h3 className="text-xl font-bold text-[#1a1a1a] mb-1 group-hover:text-[#dd2727] transition-colors">{inquiry.name}</h3>
                    <p className="text-sm text-[#b0a102] font-semibold mb-6 tracking-wide">{inquiry.course || 'General Interest'}</p>
                    
                    <div className="space-y-3 mb-8">
                      <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-black/5">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                        <span className="text-sm text-gray-600 font-medium truncate">{inquiry.email}</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-black/5">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                        <span className="text-sm text-gray-600 font-medium">{inquiry.phone}</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <a href={`mailto:${inquiry.email}`} className="flex-1 bg-[#1a1a1a] text-white text-center py-3.5 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-[#dd2727] transition-all shadow-lg shadow-black/5">Reply</a>
                      <button onClick={() => handleDeleteInquiry(inquiry.id)} className="px-5 py-3.5 bg-red-50 text-red-500 border border-red-100 rounded-2xl hover:bg-red-500 hover:text-white transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      </div>
    </div>
  );
};

export default AdminInquiries;
