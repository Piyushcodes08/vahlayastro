import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SideBar from "./Admin";
import Header from "../../components/sections/Header/Header";
import Footer from "../../components/sections/Footer/Footer";
import { db, storage } from "../../firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const AddModule = () => {
  // ORIGINAL LOGIC: State from old folder
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [videoModules, setVideoModules] = useState([]);
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [newVideoTitle, setNewVideoTitle] = useState("");
  const [newVideoFile, setNewVideoFile] = useState(null);
  const [newMaterialTitle, setNewMaterialTitle] = useState("");
  const [newMaterialFile, setNewMaterialFile] = useState(null);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);
  const [materialUploadProgress, setMaterialUploadProgress] = useState(0);
  const [editVideo, setEditVideo] = useState(null);
  const [editMaterial, setEditMaterial] = useState(null);
  const [newVideoDescription, setNewVideoDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadTask, setUploadTask] = useState(null);

  // ORIGINAL LOGIC: Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const freeCoursesSnapshot = await getDocs(collection(db, "freeCourses"));
        const paidCoursesSnapshot = await getDocs(collection(db, "paidCourses"));

        const freeCourses = freeCoursesSnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title || `Untitled (ID: ${doc.id})`,
        }));
        const paidCourses = paidCoursesSnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title || `Untitled (ID: ${doc.id})`,
        }));

        setCourses([...freeCourses, ...paidCourses]);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  // ORIGINAL LOGIC: Fetch modules when course changes
  useEffect(() => {
    if (selectedCourse) {
      const fetchModules = async () => {
        try {
          const videosSnapshot = await getDocs(collection(db, `videos_${selectedCourse}`));
          const materialsSnapshot = await getDocs(collection(db, `materials_${selectedCourse}`));

          const videoModules = videosSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          const studyMaterials = materialsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

          setVideoModules(videoModules);
          setStudyMaterials(studyMaterials);
        } catch (error) {
          console.error("Error fetching modules:", error);
        }
      };

      fetchModules();
    } else {
      setVideoModules([]);
      setStudyMaterials([]);
    }
  }, [selectedCourse]);

  // ORIGINAL LOGIC: handleUpload
  const handleUpload = async (title, description, file, type) => {
    try {
      if (!file) {
        alert("Please select a file to upload.");
        return;
      }

      setUploading(true);
      const storageRef = ref(storage, `${type}/${selectedCourse}/${Date.now()}_${file.name}`);
      const uploadTaskInstance = uploadBytesResumable(storageRef, file);
      setUploadTask(uploadTaskInstance);

      uploadTaskInstance.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (type === "videos") setVideoUploadProgress(progress);
          else setMaterialUploadProgress(progress);
        },
        (error) => {
          console.error("File upload failed:", error);
          setUploading(false);
        },
        async () => {
          const fileUrl = await getDownloadURL(uploadTaskInstance.snapshot.ref);
          const collectionRef = collection(db, `${type}_${selectedCourse}`);

          await addDoc(collectionRef, { title, description, url: fileUrl });
          alert("Uploaded successfully");

          if (type === "videos") {
            setVideoModules([...videoModules, { title, description, url: fileUrl }]);
            setVideoUploadProgress(0);
          } else {
            setStudyMaterials([...studyMaterials, { title, url: fileUrl }]);
            setMaterialUploadProgress(0);
          }
          setUploading(false);
        }
      );
    } catch (error) {
      console.error("Error uploading:", error);
      setUploading(false);
    }
  };

  const cancelUpload = () => {
    if (uploadTask) {
      uploadTask.cancel();
      setUploadTask(null);
      setUploading(false);
      setVideoUploadProgress(0);
      setMaterialUploadProgress(0);
      alert("Upload canceled.");
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;
    try {
      await deleteDoc(doc(db, `${type}_${selectedCourse}`, id));
      if (type === "videos") {
        setVideoModules(videoModules.filter((module) => module.id !== id));
      } else {
        setStudyMaterials(studyMaterials.filter((material) => material.id !== id));
      }
      alert("Deleted successfully");
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const handleEdit = async (id, updatedTitle, updatedDescription, file, type) => {
    try {
      let fileUrl = null;

      if (file) {
        const storageRef = ref(storage, `${type}/${selectedCourse}/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          "state_changed",
          () => {},
          (error) => {
            console.error("File upload failed:", error);
          },
          async () => {
            fileUrl = await getDownloadURL(uploadTask.snapshot.ref);
            const updatedData = { title: updatedTitle, description: updatedDescription };

            if (fileUrl) updatedData.url = fileUrl;

            await updateDoc(doc(db, `${type}_${selectedCourse}`, id), updatedData);
            alert("Updated successfully");
            setEditVideo(null);
            setEditMaterial(null);
          }
        );
      } else {
        const updatedData = { title: updatedTitle };
        if (type === "videos") updatedData.description = updatedDescription;
        
        await updateDoc(doc(db, `${type}_${selectedCourse}`, id), updatedData);
        alert("Updated successfully");
        setEditVideo(null);
        setEditMaterial(null);
      }
    } catch (error) {
      console.error("Error updating:", error);
    }
  };

  // ORIGINAL LOGIC: groupedVideos
  const groupedVideos = videoModules.reduce((acc, module) => {
    const key = module.title || "Untitled";
    if (!acc[key]) acc[key] = [];
    acc[key].push(module);
    return acc;
  }, {});

  return (
    <div className="admin-layout">
      <div id="top-sentinel" className="absolute top-0 left-0 w-full h-px pointer-events-none z-[-1]" />
      <Header />
      <div className="flex flex-col md:flex-row min-h-screen pt-[70px] relative z-10 admin-fluid-container gap-8 pb-20">
        <SideBar />

        <main className="flex-1 py-8">
          <div className="space-y-10">
            {/* ORIGINAL TITLE: Select Course: */}
            <div className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 ml-1">Select Course:</label>
              <div className="relative">
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-[#dd2727] outline-none appearance-none cursor-pointer"
                >
                  <option value="" className="bg-[#050505]">-- Select a Course --</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id} className="bg-[#050505]">
                      {course.title}
                    </option>
                  ))}
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"/></svg>
                </div>
              </div>
            </div>

            {selectedCourse && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* ORIGINAL TITLE: Upload New Video Session */}
                <div className="bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
                  <h2 className="text-xl font-bold text-white mb-8 uppercase tracking-widest">Upload New Video Session</h2>
                  <div className="space-y-5">
                    <input
                      type="text"
                      placeholder="Video Title"
                      value={newVideoTitle}
                      onChange={(e) => setNewVideoTitle(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-[#dd2727] outline-none transition-all"
                    />
                    <textarea
                      placeholder="Video Description"
                      value={newVideoDescription}
                      onChange={(e) => setNewVideoDescription(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white h-32 focus:ring-2 focus:ring-[#dd2727] outline-none transition-all resize-none"
                    />
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                      <input
                        type="file"
                        onChange={(e) => setNewVideoFile(e.target.files[0])}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#dd2727] file:text-white hover:file:bg-red-700 cursor-pointer"
                      />
                    </div>

                    {videoUploadProgress > 0 && (
                      <div className="space-y-2">
                        <div className="w-full bg-white/5 rounded-full h-2">
                          <div className="bg-[#dd2727] h-full rounded-full transition-all" style={{ width: `${videoUploadProgress}%` }}></div>
                        </div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase">{Math.round(videoUploadProgress)}% Transmitted</p>
                      </div>
                    )}

                    <div className="flex gap-4">
                      <button
                        onClick={() => handleUpload(newVideoTitle, newVideoDescription, newVideoFile, "videos")}
                        disabled={uploading}
                        className="flex-1 bg-[#dd2727] text-white py-4 rounded-2xl font-bold uppercase tracking-widest hover:shadow-[0_0_30px_rgba(221,39,39,0.5)] transition-all disabled:opacity-50"
                      >
                        {uploading ? "Transmitting..." : "Upload Video"}
                      </button>
                      {uploading && (
                        <button onClick={cancelUpload} className="px-8 bg-white/5 border border-white/10 text-white rounded-2xl font-bold uppercase text-[10px]">Cancel</button>
                      )}
                    </div>
                  </div>
                </div>

                {/* ORIGINAL TITLE: Upload New Study Material */}
                <div className="bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
                  <h2 className="text-xl font-bold text-white mb-8 uppercase tracking-widest">Upload New Study Material</h2>
                  <div className="space-y-5">
                    <input
                      type="text"
                      placeholder="Material Title"
                      value={newMaterialTitle}
                      onChange={(e) => setNewMaterialTitle(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-[#dd2727] outline-none transition-all"
                    />
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                      <input
                        type="file"
                        onChange={(e) => setNewMaterialFile(e.target.files[0])}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#b0a102] file:text-white hover:file:bg-yellow-700 cursor-pointer"
                      />
                    </div>

                    {materialUploadProgress > 0 && (
                      <div className="space-y-2">
                        <div className="w-full bg-white/5 rounded-full h-2">
                          <div className="bg-[#b0a102] h-full rounded-full transition-all" style={{ width: `${materialUploadProgress}%` }}></div>
                        </div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase">{Math.round(materialUploadProgress)}% Transmitted</p>
                      </div>
                    )}

                    <button
                      onClick={() => handleUpload(newMaterialTitle, "", newMaterialFile, "materials")}
                      className="w-full bg-[#b0a102] text-white py-4 rounded-2xl font-bold uppercase tracking-widest hover:shadow-[0_0_30px_rgba(176,161,2,0.3)] transition-all"
                    >
                      Upload Material
                    </button>
                  </div>
                </div>
              </div>
            )}

            {selectedCourse && (
              <div className="space-y-12">
                {/* ORIGINAL TITLE: Video Sessions */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-4">
                    <span className="w-1.5 h-8 bg-[#dd2727] rounded-full"></span>
                    Video Sessions
                  </h3>
                  <div className="space-y-6">
                    {Object.entries(groupedVideos).map(([title, modules]) => (
                      <div key={title} className="bg-white/5 border border-white/5 rounded-[2.5rem] p-8 space-y-6">
                        <h4 className="text-lg font-bold text-[#b0a102] uppercase tracking-widest">{title}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {modules.map((module) => (
                            <div key={module.id} className="bg-black/40 border border-white/5 p-6 rounded-3xl relative group/item">
                              <div className="flex justify-between items-start mb-4">
                                <h5 className="text-sm font-bold text-white line-clamp-1">{module.description?.substring(0, 40)}...</h5>
                                <div className="flex gap-2">
                                  <button onClick={() => setEditVideo(module)} className="p-2 bg-white/5 hover:bg-yellow-500/20 text-yellow-500 rounded-xl transition-all">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                                  </button>
                                  <button onClick={() => handleDelete(module.id, "videos")} className="p-2 bg-white/5 hover:bg-red-500/20 text-red-500 rounded-xl transition-all">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                  </button>
                                </div>
                              </div>
                              <a href={module.url} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-[#dd2727] uppercase tracking-widest hover:underline">View Session →</a>

                              {editVideo && editVideo.id === module.id && (
                                <div className="mt-6 p-6 bg-white/5 border border-white/10 rounded-2xl space-y-4">
                                  <input type="text" defaultValue={module.title} onChange={(e) => (module.title = e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-xs outline-none" />
                                  <textarea defaultValue={module.description} onChange={(e) => (module.description = e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-xs outline-none h-24" />
                                  <input type="file" onChange={(e) => (module.newFile = e.target.files[0])} className="text-[10px] text-gray-500" />
                                  <div className="flex gap-2">
                                    <button onClick={() => handleEdit(module.id, module.title, module.description, module.newFile, "videos")} className="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold uppercase text-[10px]">Save</button>
                                    <button onClick={() => setEditVideo(null)} className="flex-1 bg-white/5 text-white py-3 rounded-xl font-bold uppercase text-[10px]">Cancel</button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ORIGINAL TITLE: Study Materials */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-4">
                    <span className="w-1.5 h-8 bg-[#b0a102] rounded-full"></span>
                    Study Materials
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {studyMaterials.map((material) => (
                      <div key={material.id} className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] group relative">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="text-sm font-bold text-white">{material.title}</h4>
                          <div className="flex gap-2">
                            <button onClick={() => setEditMaterial(material)} className="p-2 bg-white/5 hover:bg-yellow-500/20 text-yellow-500 rounded-xl transition-all">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                            </button>
                            <button onClick={() => handleDelete(material.id, "materials")} className="p-2 bg-white/5 hover:bg-red-500/20 text-red-500 rounded-xl transition-all">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                            </button>
                          </div>
                        </div>
                        <a href={material.url} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-[#b0a102] uppercase tracking-widest hover:underline">View Material →</a>
                        
                        {editMaterial && editMaterial.id === material.id && (
                          <div className="mt-6 p-6 bg-white/5 border border-white/10 rounded-2xl space-y-4">
                            <input type="text" defaultValue={material.title} onChange={(e) => (material.title = e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-xs outline-none" />
                            <input type="file" onChange={(e) => (material.newFile = e.target.files[0])} className="text-[10px] text-gray-500" />
                            <div className="flex gap-2">
                              <button onClick={() => handleEdit(material.id, material.title, "", material.newFile, "materials")} className="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold uppercase text-[10px]">Save</button>
                              <button onClick={() => setEditMaterial(null)} className="flex-1 bg-white/5 text-white py-3 rounded-xl font-bold uppercase text-[10px]">Cancel</button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AddModule;
