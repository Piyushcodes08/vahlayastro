import React, { useState, useEffect } from "react";
import { db, storage } from "../../firebaseConfig";
import { Link } from "react-router-dom";
import {
    collection,
    getDocs,
    doc,
    setDoc,
    updateDoc,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import Aside from "./Aside";

const AdminPortal = () => {
    const [courses, setCourses] = useState([]); // List of courses
    const [selectedCourse, setSelectedCourse] = useState(""); // Selected course
    const [videoTitle, setVideoTitle] = useState(""); // Video title
    const [selectedVideo, setSelectedVideo] = useState(null); // Selected video file
    const [videoUploadProgress, setVideoUploadProgress] = useState(0); // Video upload progress
    const [materialTitle, setMaterialTitle] = useState(""); // Study material title
    const [selectedMaterial, setSelectedMaterial] = useState(null); // Selected study material
    const [materialUploadProgress, setMaterialUploadProgress] = useState(0); // Material upload progress

    // Fetch courses from Firestore
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

    // Handle video upload
    const handleVideoUpload = async () => {
        if (!selectedCourse || !videoTitle || !selectedVideo) {
            alert("Please select a course, enter a video title, and upload a video file.");
            return;
        }

        const storageRef = ref(
            storage,
            `videos/${selectedCourse}/${Date.now()}_${selectedVideo.name}`
        );
        const uploadTask = uploadBytesResumable(storageRef, selectedVideo);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setVideoUploadProgress(progress);
            },
            (error) => {
                console.error("Video upload failed:", error);
            },
            async () => {
                const videoUrl = await getDownloadURL(uploadTask.snapshot.ref);

                // Update Firestore
                const videosRef = doc(db, `videos_${selectedCourse}`, `${Date.now()}`);
                await setDoc(videosRef, {
                    title: videoTitle,
                    url: videoUrl,
                });

                setVideoTitle("");
                setSelectedVideo(null);
                setVideoUploadProgress(0);
                alert("Video uploaded successfully!");
            }
        );
    };

    // Handle study material upload
    const handleMaterialUpload = async () => {
        if (!selectedCourse || !materialTitle || !selectedMaterial) {
            alert("Please select a course, enter a material title, and upload a material file.");
            return;
        }

        const storageRef = ref(
            storage,
            `studyMaterials/${selectedCourse}/${Date.now()}_${selectedMaterial.name}`
        );
        const uploadTask = uploadBytesResumable(storageRef, selectedMaterial);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setMaterialUploadProgress(progress);
            },
            (error) => {
                console.error("Material upload failed:", error);
            },
            async () => {
                const materialUrl = await getDownloadURL(uploadTask.snapshot.ref);

                // Update Firestore
                const materialsRef = doc(db, `materials_${selectedCourse}`, `${Date.now()}`);
                await setDoc(materialsRef, {
                    title: materialTitle,
                    url: materialUrl,
                });

                setMaterialTitle("");
                setSelectedMaterial(null);
                setMaterialUploadProgress(0);
                alert("Study material uploaded successfully!");
            }
        );
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-[#0a0a0a] text-white">
            <Aside />

            <main className="flex-1 p-4 md:p-8 pt-20">
                <div className="max-w-4xl mx-auto space-y-10">
                    <header>
                        <h2 className="text-3xl font-bold tracking-tight uppercase">
                            Content <span className="text-[#dd2727]">Uploader</span>
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">Upload cosmic videos and study materials</p>
                    </header>

                    {/* Select Course Card */}
                    <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-4">Select Target Course</label>
                        <select
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:ring-2 focus:ring-[#dd2727] outline-none transition-all appearance-none cursor-pointer"
                        >
                            <option value="" className="bg-[#1a1a1a]">-- Choose a Course --</option>
                            {courses.map((course) => (
                                <option key={course.id} value={course.id} className="bg-[#1a1a1a]">
                                    {course.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Upload Video Card */}
                        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-[#dd2727]/10 p-3 rounded-xl text-[#dd2727]">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                                </div>
                                <h3 className="text-lg font-bold uppercase tracking-widest">Video <span className="text-[#dd2727]">Module</span></h3>
                            </div>
                            
                            <div className="space-y-4 flex-1">
                                <input
                                    type="text"
                                    placeholder="e.g. Introduction to Kundalini"
                                    value={videoTitle}
                                    onChange={(e) => setVideoTitle(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-[#dd2727] transition-all"
                                />
                                <div className="relative group">
                                    <input
                                        type="file"
                                        accept="video/*"
                                        onChange={(e) => setSelectedVideo(e.target.files[0])}
                                        className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-white/5 file:text-gray-300 cursor-pointer"
                                    />
                                </div>
                            </div>

                            {videoUploadProgress > 0 && (
                                <div className="mt-6 space-y-2">
                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                        <span>Progress</span>
                                        <span>{videoUploadProgress.toFixed(0)}%</span>
                                    </div>
                                    <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                                        <div className="bg-[#dd2727] h-full transition-all duration-300" style={{ width: `${videoUploadProgress}%` }}></div>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={handleVideoUpload}
                                disabled={videoUploadProgress > 0 && videoUploadProgress < 100}
                                className="w-full bg-gradient-to-r from-[#dd2727] to-[#b0a102] py-4 rounded-xl font-bold uppercase tracking-widest mt-6 hover:shadow-[0_0_20px_rgba(221,39,39,0.3)] transition-all disabled:opacity-50"
                            >
                                {videoUploadProgress > 0 && videoUploadProgress < 100 ? "Uploading..." : "Upload Video"}
                            </button>
                        </div>

                        {/* Upload Study Material Card */}
                        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-[#b0a102]/10 p-3 rounded-xl text-[#b0a102]">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                                </div>
                                <h3 className="text-lg font-bold uppercase tracking-widest">Study <span className="text-[#b0a102]">Material</span></h3>
                            </div>
                            
                            <div className="space-y-4 flex-1">
                                <input
                                    type="text"
                                    placeholder="e.g. Planet Positions PDF"
                                    value={materialTitle}
                                    onChange={(e) => setMaterialTitle(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-[#b0a102] transition-all"
                                />
                                <input
                                    type="file"
                                    onChange={(e) => setSelectedMaterial(e.target.files[0])}
                                    className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-white/5 file:text-gray-300 cursor-pointer"
                                />
                            </div>

                            {materialUploadProgress > 0 && (
                                <div className="mt-6 space-y-2">
                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                        <span>Progress</span>
                                        <span>{materialUploadProgress.toFixed(0)}%</span>
                                    </div>
                                    <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                                        <div className="bg-[#b0a102] h-full transition-all duration-300" style={{ width: `${materialUploadProgress}%` }}></div>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={handleMaterialUpload}
                                disabled={materialUploadProgress > 0 && materialUploadProgress < 100}
                                className="w-full border border-[#b0a102]/30 bg-[#b0a102]/10 py-4 rounded-xl font-bold uppercase tracking-widest mt-6 hover:bg-[#b0a102] hover:text-black transition-all disabled:opacity-50"
                            >
                                {materialUploadProgress > 0 && materialUploadProgress < 100 ? "Uploading..." : "Upload Material"}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminPortal;
