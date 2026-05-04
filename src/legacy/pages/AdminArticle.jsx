import React, { useState, useEffect } from "react";
import { db, storage } from "../../firebaseConfig";
import Admin from "./Admin";
import Header from "../../components/sections/Header/Header";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { MdEditSquare, MdDelete } from "react-icons/md";


const AdminArticles = () => {
  const [articles, setArticles] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formState, setFormState] = useState({
    title: "",
    author: "",
    rawDate: "",
    data: "",
    denglish: "",
    dhindi: "",
    hindi: "",
    imageUrl: "",
    description: "",
    type: "",
    content: "",
    sTitle: '',
    sDesc:'',
    sKeywords: '',
    referenceLink: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const data = await getDocs(collection(db, "Articles"));
      const articlesData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setArticles(articlesData);
    } catch (error) {
      showAlert("Error fetching articles.", "error");
    }
    setIsLoading(false);
  };

  const handleSaveArticle = async () => {
    if (!formState.title || !formState.author) {
      showAlert("Title and Author are required.", "error");
      return;
    }
    setIsSaving(true);
    try {
      let imageUrl = formState.imageUrl;
      if (selectedImage) {
        const imageRef = ref(storage, `articles/${Date.now()}_${selectedImage.name}`);
        const uploadTask = await uploadBytes(imageRef, selectedImage);
        imageUrl = await getDownloadURL(uploadTask.ref);
      }

      let formattedDate = formState.data;
      if (formState.rawDate) {
        const dateObj = new Date(formState.rawDate);
        const options = { month: "long", day: "numeric", year: "numeric" };
        formattedDate = dateObj.toLocaleDateString("en-US", options);
      }

      const keywordArray = typeof formState.sKeywords === 'string'
        ? formState.sKeywords.split(',').map(kw => kw.trim()).filter(kw => kw.length > 0)
        : formState.sKeywords;

      const articleData = {
        ...formState,
        sKeywords: keywordArray,
        imageUrl,
        createdAt: serverTimestamp(),
        data: formattedDate,
      };

      if (editMode) {
        const { id, createdAt, ...updatedArticleData } = articleData;
        await updateDoc(doc(db, "Articles", formState.id), updatedArticleData);
        showAlert("Article updated successfully!", "success");
      } else {
        await addDoc(collection(db, "Articles"), articleData);
        showAlert("Article added successfully!", "success");
      }

      fetchArticles();
      resetForm();
    } catch (error) {
      console.error("Error saving article:", error);
      showAlert("Error saving article.", "error");
    }
    setIsSaving(false);
  };

  const handleDeleteArticle = async (id) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, "Articles", id));
      showAlert("Article deleted!", "success");
      fetchArticles();
    } catch (error) {
      showAlert("Error deleting article.", "error");
    }
    setIsDeleting(false);
  };

  const resetForm = () => {
    setFormState({
      title: "",
      author: "",
      rawDate: "",
      data: "",
      denglish: "",
      dhindi: "",
      hindi: "",
      imageUrl: "",
      description: "",
      type: "",
      content: "",
      sTitle: '',
      sDesc:'',
      sKeywords: '',
      referenceLink: "",
    });
    setSelectedImage(null);
    setEditMode(false);
    setFormVisible(false);
  };

  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => {
      setAlertMessage("");
      setAlertType("");
    }, 3000);
  };

  return (
    <>
      <div id="top-sentinel" className="absolute top-0 left-0 w-full h-px pointer-events-none z-[-1]" />
      <Header />
      <div className="flex flex-col md:flex-row min-h-screen bg-transparent text-white pt-[70px] relative z-10 premium-container">
        <Aside />

        <main className="flex-1 p-4 md:p-8">
          <div className="space-y-8">
          {/* Header & Stats */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight uppercase">
                Manage <span className="text-[#dd2727]">Articles</span>
              </h2>
              <p className="text-gray-400 text-sm mt-1">Create, update, and organize your blog content</p>
            </div>
            <button
              onClick={() => { resetForm(); setFormVisible(true); }}
              className="bg-gradient-to-r from-[#dd2727] to-[#b0a102] px-8 py-3 rounded-xl font-bold uppercase tracking-widest hover:shadow-[0_0_20px_rgba(221,39,39,0.4)] transition-all"
            >
              + Create New Article
            </button>
          </div>

          {/* Alert */}
          {alertMessage && (
            <div className={`p-4 rounded-xl text-center font-bold animate-in fade-in slide-in-from-top-2 duration-300 ${alertType === "success" ? "bg-green-500/20 text-green-500 border border-green-500/30" : "bg-red-500/20 text-red-500 border border-red-500/30"}`}>
              {alertMessage}
            </div>
          )}

          {/* Article Form Overlay/Section */}
          {formVisible && (
            <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-[0_0_50px_rgba(221,39,39,0.15)] animate-in zoom-in-95 duration-300">
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/10">
                <h3 className="text-xl font-bold uppercase tracking-widest">
                  {editMode ? "Edit" : "Create"} <span className="text-[#dd2727]">Article</span>
                </h3>
                <button onClick={() => setFormVisible(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">✕</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Title (English)</label>
                  <input type="text" value={formState.title} onChange={(e) => setFormState({ ...formState, title: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#dd2727] outline-none transition-all" placeholder="Enter title" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Title (Hindi)</label>
                  <input type="text" value={formState.hindi} onChange={(e) => setFormState({ ...formState, hindi: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#dd2727] outline-none transition-all" placeholder="हिंदी शीर्षक" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Author Name</label>
                  <input type="text" value={formState.author} onChange={(e) => setFormState({ ...formState, author: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#dd2727] outline-none transition-all" placeholder="Author" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Publish Date</label>
                  <input type="date" value={formState.rawDate} onChange={(e) => setFormState({ ...formState, rawDate: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#dd2727] outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Article Type</label>
                  <select value={formState.type} onChange={(e) => setFormState({ ...formState, type: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#dd2727] outline-none transition-all appearance-none cursor-pointer">
                    <option value="" className="bg-[#1a1a1a]">Select Type</option>
                    <option value="Daily Horoscope" className="bg-[#1a1a1a]">Daily Horoscope</option>
                    <option value="Vedic Astrology" className="bg-[#1a1a1a]">Vedic Astrology</option>
                    <option value="Remedies" className="bg-[#1a1a1a]">Remedies</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Reference Video</label>
                  <input type="url" value={formState.referenceLink} onChange={(e) => setFormState({ ...formState, referenceLink: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#dd2727] outline-none transition-all" placeholder="YouTube Link" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Description (Short)</label>
                  <textarea value={formState.description} onChange={(e) => setFormState({ ...formState, description: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#dd2727] outline-none transition-all h-24" placeholder="Brief summary..." />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Denglish Content</label>
                  <textarea value={formState.denglish} onChange={(e) => setFormState({ ...formState, denglish: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#dd2727] outline-none transition-all h-24" placeholder="Denglish content..." />
                </div>
              </div>

              <div className="space-y-2 mt-6">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Full Article Content</label>
                <textarea value={formState.content} onChange={(e) => setFormState({ ...formState, content: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#dd2727] outline-none transition-all h-40" placeholder="Write full article here..." />
              </div>

              <div className="bg-white/5 rounded-2xl p-6 mt-8 border border-white/5">
                <h4 className="text-sm font-bold uppercase tracking-widest text-gray-300 mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#b0a102]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.944-.209.385-.34.864-.34 1.388a4 4 0 01-2.99 3.898L6 8.65V15.35l.243.081a4 4 0 012.99 3.898c0 .524.131 1.003.34 1.388.208.386.477.713.822.944a1 1 0 001.45-.385c.345-.23.614-.558.822-.944.209-.385.34-.864.34-1.388a1 1 0 011-1h1.382a1 1 0 00.948-1.316l-1.24-3.72a1 1 0 01.948-1.316h1.382a1 1 0 00.948-1.316l-1.24-3.72a1 1 0 01.948-1.316h-1.382a1 1 0 01-1-1c0-.524-.131-1.003-.34-1.388a1.233 1.233 0 00-.822-.944z" clipRule="evenodd" /></svg>
                  SEO & Meta Data
                </h4>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">SEO Title</label>
                    <input type="text" value={formState.sTitle} onChange={(e) => setFormState({ ...formState, sTitle: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">SEO Keywords</label>
                    <input type="text" value={formState.sKeywords} onChange={(e) => setFormState({ ...formState, sKeywords: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none" placeholder="keyword1, keyword2..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Feature Image</label>
                    <input type="file" onChange={(e) => setSelectedImage(e.target.files[0])} className="w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#dd2727]/10 file:text-[#dd2727] cursor-pointer" />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-10">
                <button onClick={handleSaveArticle} disabled={isSaving} className="flex-1 bg-gradient-to-r from-[#dd2727] to-[#b0a102] py-4 rounded-2xl font-bold uppercase tracking-[0.2em] hover:scale-[1.01] transition-all disabled:opacity-50">
                  {isSaving ? "Processing..." : editMode ? "Update Content" : "Publish Article"}
                </button>
                <button onClick={resetForm} className="px-10 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold uppercase tracking-widest hover:bg-white/10 transition-all">Cancel</button>
              </div>
            </div>
          )}

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {isLoading ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-64 bg-white/5 rounded-3xl animate-pulse"></div>
              ))
            ) : articles.map((article) => (
              <div key={article.id} className="group bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-all duration-500 flex flex-col h-full shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                <div className="aspect-video relative overflow-hidden">
                  <img src={article.imageUrl || "https://images.unsplash.com/photo-1506318137071-a8e063b4bcc0?q=80&w=2070&auto=format&fit=crop"} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                  <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#dd2727] border border-[#dd2727]/30">
                    {article.type || "General"}
                  </span>
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">{article.data || "Recent"}</p>
                    <p className="text-[10px] text-[#b0a102] font-bold uppercase tracking-widest">BY {article.author}</p>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2 group-hover:text-[#dd2727] transition-colors line-clamp-1">{article.title}</h4>
                  <p className="text-gray-400 text-sm line-clamp-2 mb-6 italic">"{article.description || article.content?.substring(0, 80) + '...'}"</p>
                  
                  <div className="mt-auto flex gap-3">
                    <button onClick={() => { setFormState({ ...article, rawDate: "" }); setEditMode(true); setFormVisible(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex-1 bg-white/5 border border-white/10 py-2 rounded-xl text-xs font-bold uppercase hover:bg-white/10 transition-all">Edit</button>
                    <button onClick={() => handleDeleteArticle(article.id)} disabled={isDeleting} className="px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      </div>
    </>
  );
};

export default AdminArticles;
