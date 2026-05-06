import React, { useState, useEffect } from "react";
import { db, storage } from "../../firebaseConfig";
import SideBar from "./Admin";
import Header from "../../components/sections/Header/Header";
import Footer from "../../components/sections/Footer/Footer";
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
  // ORIGINAL LOGIC: State from old folder
  const [articles, setArticles] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
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
      showAlert("Error fetching articles. Please try again.", "error");
    }
    setIsLoading(false);
  };

  const handleSaveArticle = async () => {
    setIsSaving(true);
    try {
      let imageUrl = formState.imageUrl;
      if (selectedImage) {
        const imageRef = ref(storage, `articles/${selectedImage.name}`);
        const uploadTask = await uploadBytes(imageRef, selectedImage);
        imageUrl = await getDownloadURL(uploadTask.ref);
      }

      // ORIGINAL LOGIC: Date formatting
      let formattedDate = "";
      if (formState.rawDate) {
        const dateObj = new Date(formState.rawDate);
        const options = { month: "long", day: "numeric", year: "numeric" };
        formattedDate = dateObj.toLocaleDateString("en-US", options);
      }
      
      const keywordArray = formState.sKeywords
        ? formState.sKeywords.split(',').map((kw) => kw.trim()).filter((kw) => kw.length > 0)
        : [];

      const articleData = {
        ...formState,
        sKeywords: keywordArray,
        imageUrl,
        createdAt: serverTimestamp(),
        data: formattedDate,
      };

      if (editMode) {
        const { createdAt, ...updatedArticleData } = articleData;
        await updateDoc(doc(db, "Articles", formState.id), updatedArticleData);
        showAlert("Article updated successfully!", "success");
      } else {
        await addDoc(collection(db, "Articles"), articleData);
        showAlert("Article added successfully!", "success");
      }

      fetchArticles();
      resetForm();
    } catch (error) {
      showAlert("Error saving article. Please try again.", "error");
    }
    setIsSaving(false);
  };

  const handleDeleteArticle = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this article?");
    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, "Articles", id));
      showAlert("Article deleted successfully!", "success");
      fetchArticles();
    } catch (error) {
      showAlert("Error deleting article. Please try again.", "error");
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
    setUploadProgress(0);
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
    <div className="admin-layout">
      <div id="top-sentinel" className="absolute top-0 left-0 w-full h-px pointer-events-none z-[-1]" />
      <Header />
      <div className="flex flex-col md:flex-row min-h-screen pt-[80px] relative z-10 admin-fluid-container gap-8 pb-20">
        <SideBar />

        <main className="flex-1 py-8">
          <div className="space-y-12">
            <div className="flex justify-between items-center">
               <h2 className="text-4xl font-bold text-white uppercase tracking-tighter">
                Manage <span className="text-[#dd2727]">Articles</span>
              </h2>
              <button
                onClick={() => { resetForm(); setFormVisible(true); }}
                className="bg-[#dd2727] text-white px-8 py-3 rounded-2xl font-bold uppercase tracking-widest hover:shadow-[0_0_30px_rgba(221,39,39,0.5)] transition-all"
              >
                {formVisible ? "X" : "Upload New Article"}
              </button>
            </div>

            {alertMessage && (
              <div className={`p-5 rounded-3xl text-center text-[10px] font-bold uppercase tracking-[0.2em] animate-in fade-in border ${alertType === "success" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"}`}>
                {alertMessage}
              </div>
            )}

            {formVisible && (
              <div className="bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 md:p-16 shadow-2xl animate-in zoom-in-95 duration-500 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#dd2727]/5 rounded-full blur-[100px]"></div>
                
                <h3 className="text-2xl font-bold text-white mb-12 uppercase tracking-widest border-b border-white/5 pb-6">
                  {editMode ? "Edit Article" : "Add Article"}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Title</label>
                    <input type="text" value={formState.title} onChange={(e) => setFormState({ ...formState, title: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-[#dd2727] outline-none transition-all placeholder:text-gray-700" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Hindi Title</label>
                    <input type="text" value={formState.hindi} onChange={(e) => setFormState({ ...formState, hindi: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-[#dd2727] outline-none transition-all placeholder:text-gray-700" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Author</label>
                    <input type="text" value={formState.author} onChange={(e) => setFormState({ ...formState, author: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-[#dd2727] outline-none transition-all placeholder:text-gray-700" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Date</label>
                    <input type="date" value={formState.rawDate} onChange={(e) => setFormState({ ...formState, rawDate: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-[#dd2727] outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Reference Video Link</label>
                    <input type="url" placeholder="https://youtube.com/..." value={formState.referenceLink} onChange={(e) => setFormState({ ...formState, referenceLink: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-[#dd2727] outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Upload Image</label>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 relative cursor-pointer group/upload hover:border-[#dd2727]/50 transition-all">
                      <input type="file" onChange={(e) => setSelectedImage(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                      <div className="w-10 h-10 bg-white/5 flex items-center justify-center rounded-xl text-gray-500 group-hover/upload:text-[#dd2727]">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                      </div>
                      <p className="text-[10px] text-gray-500 font-bold truncate">{selectedImage ? selectedImage.name : "Select Image"}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 relative z-10">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Denglish</label>
                    <textarea value={formState.denglish} onChange={(e) => setFormState({ ...formState, denglish: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-[#dd2727] outline-none h-32 resize-none" placeholder="Enter Denglish content"></textarea>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Dhindi</label>
                    <textarea value={formState.dhindi} onChange={(e) => setFormState({ ...formState, dhindi: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-[#dd2727] outline-none h-32 resize-none" placeholder="Enter Dhindi content"></textarea>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">SEO Title</label>
                    <textarea value={formState.sTitle} onChange={(e) => setFormState({ ...formState, sTitle: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-[#dd2727] outline-none h-24 resize-none"></textarea>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">SEO Description</label>
                    <textarea value={formState.sDesc} onChange={(e) => setFormState({ ...formState, sDesc: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-[#dd2727] outline-none h-24 resize-none"></textarea>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">SEO Keywords (comma separated)</label>
                    <textarea value={formState.sKeywords} onChange={(e) => setFormState({ ...formState, sKeywords: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-[#dd2727] outline-none h-20 resize-none"></textarea>
                  </div>
                </div>

                <div className="mt-12 flex flex-col sm:flex-row gap-5 relative z-10">
                  <button onClick={handleSaveArticle} disabled={isSaving} className="flex-1 bg-[#dd2727] text-white py-5 rounded-2xl font-bold uppercase tracking-[0.2em] hover:shadow-[0_0_30px_rgba(221,39,39,0.5)] transition-all transform hover:scale-[1.01] active:scale-95 disabled:opacity-50">
                    {isSaving ? "Saving..." : editMode ? "Update Article" : "Add Article"}
                  </button>
                  <button onClick={resetForm} className="px-12 py-5 bg-white/5 border border-white/10 rounded-2xl font-bold uppercase tracking-widest text-gray-400 hover:bg-white/10 hover:text-white transition-all">Discard</button>
                </div>
              </div>
            )}

            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-white flex items-center gap-4">
                <span className="w-1.5 h-8 bg-[#b0a102] rounded-full shadow-[0_0_15px_rgba(176,161,2,0.5)]"></span>
                Editorial Archive
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {isLoading ? (
                  Array(6).fill(0).map((_, i) => (
                    <div key={i} className="h-40 bg-white/5 border border-white/5 rounded-[2.5rem] animate-pulse"></div>
                  ))
                ) : articles.map((article) => (
                  <div key={article.id} className="group bg-white/5 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 hover:border-white/20 transition-all duration-500 flex flex-col h-full shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#dd2727]/5 rounded-full blur-2xl group-hover:bg-[#dd2727]/10 transition-all"></div>
                    
                    <div className="flex-1 space-y-4 relative z-10">
                      <div className="flex justify-between items-start">
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{article.data || "Eternal"}</p>
                        <p className="text-[10px] text-[#b0a102] font-bold uppercase tracking-widest">BY {article.author}</p>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white group-hover:text-[#dd2727] transition-colors line-clamp-1 uppercase tracking-tight">{article.title}</h4>
                        <p className="text-[10px] text-gray-500 font-medium line-clamp-1 mt-1">Hindi: {article.hindi}</p>
                      </div>
                    </div>

                    <div className="mt-8 flex gap-4 relative z-10">
                      <button onClick={() => { setEditMode(true); setFormState({ ...article, rawDate: "" }); setFormVisible(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex-1 bg-white/5 border border-white/10 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-all">Edit</button>
                      <button onClick={() => handleDeleteArticle(article.id)} disabled={isDeleting} className="px-5 py-3.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AdminArticles;
