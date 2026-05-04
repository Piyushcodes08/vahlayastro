import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Admin from "./Admin";
import Header from "../../components/sections/Header/Header";
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

  const groupedVideos = videoModules.reduce((acc, module) => {
    const key = module.title || "Untitled";
    if (!acc[key]) acc[key] = [];
    acc[key].push(module);
    return acc;
  }, {});

  return (
    <>
      <div id="top-sentinel" className="absolute top-0 left-0 w-full h-px pointer-events-none z-[-1]" />
      <Header />
      <div className="flex flex-col md:flex-row min-h-screen bg-transparent text-white pt-[70px] relative z-10 premium-container">
        <Aside />

        <main className="flex-1 p-4 md:p-8">
          <div className="space-y-8">
          {/* Course Selection */}
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-[0_0_30px_rgba(221,39,39,0.1)]">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Select Course to Manage</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#dd2727] transition-all appearance-none cursor-pointer"
            >
              <option value="" className="bg-[#1a1a1a]">-- Choose a Course --</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id} className="bg-[#1a1a1a]">
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          {selectedCourse && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Upload Video Section */}
              <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-[0_0_30px_rgba(221,39,39,0.1)]">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="text-[#dd2727]">✦</span> UPLOAD VIDEO SESSION
                </h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Video Title"
                    value={newVideoTitle}
                    onChange={(e) => setNewVideoTitle(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#dd2727]"
                  />
                  <textarea
                    placeholder="Video Description"
                    value={newVideoDescription}
                    onChange={(e) => setNewVideoDescription(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#dd2727] min-h-[100px]"
                  />
                  <div className="relative group">
                    <input
                      type="file"
                      onChange={(e) => setNewVideoFile(e.target.files[0])}
                      className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#dd2727]/20 file:text-[#dd2727] hover:file:bg-[#dd2727]/30 cursor-pointer"
                    />
                  </div>

                  {videoUploadProgress > 0 && (
                    <div className="space-y-2">
                      <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#dd2727] to-[#b0a102] h-full transition-all duration-300"
                          style={{ width: `${videoUploadProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">
                        {Math.round(videoUploadProgress)}% UPLOADED
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleUpload(newVideoTitle, newVideoDescription, newVideoFile, "videos")}
                      disabled={uploading}
                      className="flex-1 bg-[#dd2727] text-white py-3 rounded-xl font-bold uppercase tracking-wider hover:bg-red-600 disabled:opacity-50 transition-all"
                    >
                      {uploading ? "Uploading..." : "Upload Video"}
                    </button>
                    {uploading && (
                      <button onClick={cancelUpload} className="px-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Upload Material Section */}
              <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-[0_0_30px_rgba(221,39,39,0.1)]">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="text-[#b0a102]">✦</span> UPLOAD STUDY MATERIAL
                </h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Material Title"
                    value={newMaterialTitle}
                    onChange={(e) => setNewMaterialTitle(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#b0a102]"
                  />
                  <input
                    type="file"
                    onChange={(e) => setNewMaterialFile(e.target.files[0])}
                    className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#b0a102]/20 file:text-[#b0a102] hover:file:bg-[#b0a102]/30 cursor-pointer"
                  />

                  {materialUploadProgress > 0 && (
                    <div className="space-y-2">
                      <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-[#b0a102] h-full transition-all duration-300"
                          style={{ width: `${materialUploadProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">
                        {Math.round(materialUploadProgress)}% UPLOADED
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => handleUpload(newMaterialTitle, "", newMaterialFile, "materials")}
                    disabled={uploading}
                    className="w-full bg-[#b0a102] text-white py-3 rounded-xl font-bold uppercase tracking-wider hover:bg-yellow-600 disabled:opacity-50 transition-all"
                  >
                    Upload Material
                  </button>
                </div>
              </div>
            </div>
          )}

          {selectedCourse && (
            <div className="space-y-8 pb-20">
              {/* Video Sessions List */}
              <section>
                <h2 className="text-2xl font-bold mb-6 border-b border-white/10 pb-4 flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#dd2727]"></span> VIDEO SESSIONS
                </h2>
                <div className="space-y-6">
                  {Object.entries(groupedVideos).map(([title, modules]) => (
                    <div key={title} className="bg-white/5 rounded-3xl p-6 border border-white/5">
                      <h3 className="text-lg font-bold mb-4 text-[#dd2727] flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/></svg>
                        {title}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {modules.map((module) => (
                          <div key={module.id} className="bg-black/40 p-5 rounded-2xl border border-white/5 hover:border-white/20 transition-all">
                            <div className="flex justify-between items-start mb-3">
                              <p className="text-sm text-gray-300 font-medium line-clamp-2 italic">
                                "{module.description || 'No description provided'}"
                              </p>
                              <div className="flex gap-2 shrink-0">
                                <button onClick={() => setEditVideo(module)} className="p-2 bg-yellow-500/10 text-yellow-500 rounded-lg hover:bg-yellow-500 hover:text-white transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg></button>
                                <button onClick={() => handleDelete(module.id, "videos")} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
                              </div>
                            </div>
                            <a href={module.url} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-[#dd2727] uppercase tracking-widest hover:text-white transition-colors">WATCH VIDEO ↗</a>
                            
                            {editVideo?.id === module.id && (
                              <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                                <input type="text" defaultValue={module.title} onChange={(e) => module.title = e.target.value} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs" />
                                <textarea defaultValue={module.description} onChange={(e) => module.description = e.target.value} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs" />
                                <div className="flex gap-2">
                                  <button onClick={() => handleEdit(module.id, module.title, module.description, module.newFile, "videos")} className="flex-1 bg-green-600 text-white py-2 rounded-lg text-xs font-bold uppercase">Save</button>
                                  <button onClick={() => setEditVideo(null)} className="flex-1 bg-white/10 text-white py-2 rounded-lg text-xs font-bold uppercase">Cancel</button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Study Materials List */}
              <section>
                <h2 className="text-2xl font-bold mb-6 border-b border-white/10 pb-4 flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#b0a102]"></span> STUDY MATERIALS
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {studyMaterials.map((material) => (
                    <div key={material.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-[#b0a102]/20 flex items-center justify-center text-[#b0a102]">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                        </div>
                        <h3 className="font-bold text-white text-sm line-clamp-1">{material.title}</h3>
                      </div>
                      <div className="flex gap-3">
                        <a href={material.url} target="_blank" rel="noopener noreferrer" className="flex-1 bg-white/5 border border-white/10 text-center py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-all">View</a>
                        <button onClick={() => setEditMaterial(material)} className="p-2 bg-yellow-500/10 text-yellow-500 rounded-xl hover:bg-yellow-500 hover:text-white transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg></button>
                        <button onClick={() => handleDelete(material.id, "materials")} className="p-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
                      </div>
                      {editMaterial?.id === material.id && (
                        <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                          <input type="text" defaultValue={material.title} onChange={(e) => material.title = e.target.value} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs" />
                          <div className="flex gap-2">
                            <button onClick={() => handleEdit(material.id, material.title, "", material.newFile, "materials")} className="flex-1 bg-green-600 text-white py-2 rounded-lg text-xs font-bold uppercase">Save</button>
                            <button onClick={() => setEditMaterial(null)} className="flex-1 bg-white/10 text-white py-2 rounded-lg text-xs font-bold uppercase">Cancel</button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </main>
      </div>
    </>
  );
};

export default AddModule;
