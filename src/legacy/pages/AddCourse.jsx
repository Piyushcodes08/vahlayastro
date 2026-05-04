import React, { useState, useEffect } from "react";
import Admin from "./Admin";
import Header from "../../components/sections/Header/Header";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../../firebaseConfig";
import { serverTimestamp } from "firebase/firestore";
import { Link } from "react-router-dom";

import Aside from "./Aside";

const AddCourse = () => {
  const [courseTitle, setCourseTitle] = useState("");
  const [courseSubTitle, setCourseSubTitle] = useState("");
  const [courseType, setCourseType] = useState("free");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("active");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const storage = getStorage();

  const fetchCourses = async () => {
    try {
      const freeCoursesSnapshot = await getDocs(collection(db, "freeCourses"));
      const paidCoursesSnapshot = await getDocs(collection(db, "paidCourses"));
      const allCourses = [
        ...freeCoursesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        ...paidCoursesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      ];
      setCourses(allCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleAddOrUpdateCourse = async () => {
    if (!courseTitle || !courseSubTitle || !description || (!imageFile && !editingCourseId)) {
      alert("Course title, description, and image are required");
      return;
    }

    try {
      setIsUploading(true);
      let imageUrl = null;

      if (imageFile) {
        const imageRef = ref(storage, `course-images/${courseTitle}_${Date.now()}`);
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      const courseData = {
        title: courseTitle,
        Subtitle: courseSubTitle,
        type: courseType,
        description,
        seoTitle,
        seoDescription,
        seoKeywords: seoKeywords.split(',').map(kw => kw.trim()).filter(kw => kw.length > 0),
        imageUrl: imageUrl || (courses.find((c) => c.id === editingCourseId)?.imageUrl || ""),
      };

      if (!editingCourseId) {
        courseData.createdAt = serverTimestamp();
      }

      if (courseType === "paid") {
        if (!price) {
          alert("Price is required for paid courses");
          return;
        }
        courseData.price = parseFloat(price);
        courseData.status = status;
      }

      const collectionName = courseType === "free" ? "freeCourses" : "paidCourses";
      const courseDocRef = doc(db, collectionName, editingCourseId || courseTitle);
      await setDoc(courseDocRef, courseData, { merge: true });

      alert(editingCourseId ? "Course updated successfully" : "Course added successfully");
      resetForm();
      fetchCourses();
    } catch (error) {
      console.error("Error adding or updating course:", error);
      alert("Failed to save course.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteCourse = async (id, type) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      const collectionName = type === "free" ? "freeCourses" : "paidCourses";
      await deleteDoc(doc(db, collectionName, id));
      fetchCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const handleEditCourse = (course) => {
    setCourseTitle(course.title);
    setCourseSubTitle(course.Subtitle);
    setDescription(course.description);
    setSeoTitle(course.seoTitle || '');
    setSeoDescription(course.seoDescription || '');
    setSeoKeywords(course.seoKeywords?.join(', ') || '');
    setCourseType(course.type);
    setPrice(course.price || "");
    setStatus(course.status || "active");
    setEditingCourseId(course.id);
    setIsFormVisible(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setCourseTitle("");
    setCourseSubTitle("");
    setDescription("");
    setSeoTitle('');
    setSeoDescription('');
    setSeoKeywords('');
    setCourseType("free");
    setPrice("");
    setStatus("active");
    setImageFile(null);
    setEditingCourseId(null);
    setIsFormVisible(false);
  };

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
                Manage <span className="text-[#dd2727]">Courses</span>
              </h2>
              <p className="text-gray-400 text-sm mt-1">Catalog your divine knowledge and offerings</p>
            </div>
            <button
              onClick={() => { resetForm(); setIsFormVisible(true); }}
              className="bg-gradient-to-r from-[#dd2727] to-[#b0a102] px-8 py-3 rounded-xl font-bold uppercase tracking-widest hover:shadow-[0_0_20px_rgba(221,39,39,0.3)] transition-all"
            >
              + Create New Course
            </button>
          </header>

          {isFormVisible && (
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/10">
                <h3 className="text-xl font-bold uppercase tracking-widest">
                  {editingCourseId ? "Edit" : "Add"} <span className="text-[#b0a102]">Course</span>
                </h3>
                <button onClick={resetForm} className="p-2 hover:bg-white/10 rounded-full transition-colors">✕</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Course Title</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#dd2727] transition-all" value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} placeholder="e.g. Vedic Astrology Basics" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Course Subtitle</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#dd2727] transition-all" value={courseSubTitle} onChange={(e) => setCourseSubTitle(e.target.value)} placeholder="A short catchy phrase" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Access Type</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#dd2727] transition-all appearance-none cursor-pointer" value={courseType} onChange={(e) => setCourseType(e.target.value)}>
                    <option value="free" className="bg-[#1a1a1a]">Free Course</option>
                    <option value="paid" className="bg-[#1a1a1a]">Paid Course</option>
                  </select>
                </div>
                
                {courseType === "paid" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Price (INR)</label>
                      <input type="number" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Status</label>
                      <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none" value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="active" className="bg-[#1a1a1a]">Active</option>
                        <option value="inactive" className="bg-[#1a1a1a]">Inactive</option>
                      </select>
                    </div>
                  </div>
                )}
                
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Full Description</label>
                  <textarea className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none h-32" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Tell students what they will learn..." />
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-6 mt-8 border border-white/5">
                <h4 className="text-sm font-bold uppercase tracking-widest text-gray-300 mb-4">SEO & Media</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="lg:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">SEO Title</label>
                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
                  </div>
                  <div className="lg:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">SEO Keywords</label>
                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none" value={seoKeywords} onChange={(e) => setSeoKeywords(e.target.value)} placeholder="keyword1, keyword2..." />
                  </div>
                  <div className="lg:col-span-4 space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Course Cover Image</label>
                    <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#dd2727]/10 file:text-[#dd2727] cursor-pointer" />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-10">
                <button onClick={handleAddOrUpdateCourse} disabled={isUploading} className="flex-1 bg-gradient-to-r from-[#dd2727] to-[#b0a102] py-4 rounded-2xl font-bold uppercase tracking-[0.2em] hover:scale-[1.01] transition-all disabled:opacity-50 shadow-lg">
                  {isUploading ? "Uploading..." : editingCourseId ? "Update Course" : "Create Course"}
                </button>
                <button onClick={resetForm} className="px-10 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold uppercase tracking-widest hover:bg-white/10 transition-all">Cancel</button>
              </div>
            </div>
          )}

          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8">
            <h3 className="text-xl font-bold uppercase tracking-widest mb-6 flex justify-between items-center">
              Existing Courses
              <span className="text-xs bg-white/5 px-3 py-1 rounded-full text-gray-400">{courses.length} Total</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300">
                  <div className="aspect-[16/9] relative">
                    <img src={course.imageUrl || "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=2000&auto=format&fit=crop"} alt={course.title} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-white/10">
                      {course.type}
                    </div>
                  </div>
                  <div className="p-5">
                    <h4 className="font-bold text-white mb-1 truncate">{course.title}</h4>
                    <p className="text-xs text-gray-500 mb-4 line-clamp-1">{course.Subtitle}</p>
                    <div className="flex gap-2">
                      <button onClick={() => handleEditCourse(course)} className="flex-1 bg-white/5 border border-white/10 py-2 rounded-xl text-[10px] font-bold uppercase hover:bg-white/10 transition-all">Edit</button>
                      <button onClick={() => handleDeleteCourse(course.id, course.type)} className="p-2 bg-red-500/10 text-red-500 border border-red-500/10 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      </div>
    </>
  );
};

export default AddCourse;
