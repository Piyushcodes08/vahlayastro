import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db, storage } from "../../firebaseConfig"; // Firebase configuration file
import ActiveLink from "./ActiveLink"; // Custom Link component
import { PieChart, Pie, Cell } from "recharts";
import Aside from "./Aside";
import Header from "../../components/sections/Header/Header";
import Footer from "../../components/sections/Footer/Footer";

const EnrollCourse = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    profilePic: "",
    fullName: "NA",
    email: "NA",
  });
  const [videoModules, setVideoModules] = useState([]);
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [newVideoTitle, setNewVideoTitle] = useState("");
  const [newVideoFile, setNewVideoFile] = useState(null);
  const [newVideoDescription, setNewVideoDescription] = useState("");
  const [newMaterialTitle, setNewMaterialTitle] = useState("");
  const [newMaterialFile, setNewMaterialFile] = useState(null);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);
  const [materialUploadProgress, setMaterialUploadProgress] = useState(0);
  const [editVideo, setEditVideo] = useState(null);
  const [editMaterial, setEditMaterial] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadTask, setUploadTask] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState("");

  const navigate = useNavigate();
  const auth = getAuth();

  // Fetch courses from both freeCourses and paidCourses collections
  const fetchCourses = async (email) => {
    try {
      const docRef = doc(db, "subscriptions", email);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data(); // ✅ Fix: subscription document data
        // Fetch metadata for all courses from correct collections
        const courseTypes = ["freeCourses", "paidCourses"];
        const coursesMetadata = {};
        
        for (const type of courseTypes) {
          const coursesSnap = await getDocs(collection(db, type));
          coursesSnap.forEach(courseDoc => {
            const courseData = courseDoc.data();
            const courseName = courseData.Title || courseData.title;
            if (courseName) {
              coursesMetadata[courseName] = courseData.imageUrl || courseData.image || courseData.thumbnail || courseData.courseImage || courseData.imgUrl || "";
            }
          });
        }

        const freeCourses =
          data.freecourses?.map((courseName) => ({
            name: courseName,
            type: "Free",
            enrolled: true,
            image: coursesMetadata[courseName] || "/assets/courses.jpg"
          })) || [];

        const paidCourses =
          data.DETAILS?.map((courseObj) => {
            const courseName = Object.keys(courseObj)[0];
            const details = courseObj[courseName];

            let daysLeft = 0;
            let usedDays = 0;
            let totalDays = 0;

            if (details.subscriptionDate && details.expiryDate) {
              const subDate = new Date(details.subscriptionDate);
              const expDate = new Date(details.expiryDate);
              const now = new Date();

              const totalTime = expDate.getTime() - subDate.getTime();
              totalDays = Math.floor(totalTime / (1000 * 3600 * 24));

              const usedTime = now.getTime() - subDate.getTime();
              usedDays =
                usedTime > 0 ? Math.floor(usedTime / (1000 * 3600 * 24)) : 0;

              const rawDaysLeft = totalDays - usedDays;
              daysLeft = rawDaysLeft < 0 ? 0 : rawDaysLeft;
            }

            return {
              name: courseName,
              type: "Paid",
              enrolled: details.status === "active",
              expiryDate: details.expiryDate,
              subscriptionDate: details.subscriptionDate,
              daysLeft,
              usedDays,
              totalDays,
              image: coursesMetadata[courseName] || "/assets/img/courses.webp"
            };
          }) || [];

        setCourses([...freeCourses, ...paidCourses]);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchCourses(currentUser.email);
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [auth, navigate]);

  // Fetch profile data for the current user
  useEffect(() => {
    setLoading(true);
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
      const fetchProfile = async () => {
        const userDocRef = doc(db, "students", currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFormData({
            profilePic: userData.profilePic || "",
            fullName: userData.fullName || "NA",
            email: currentUser.email || "NA",
          });
        } else {
          setFormData({
            profilePic: "",
            fullName: "NA",
            email: currentUser.email || "NA",
          });
        }
        setLoading(false);
      };
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [db]);

  // Handle file upload for videos and study materials
  const handleUpload = async (title, description, file, type) => {
    try {
      if (!file) {
        alert("Please select a file to upload.");
        return;
      }
      setUploading(true);
      const storageRef = ref(
        storage,
        `${type}/${selectedCourse}/${Date.now()}_${file.name}`
      );
      const uploadTaskInstance = uploadBytesResumable(storageRef, file);
      setUploadTask(uploadTaskInstance);

      uploadTaskInstance.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setVideoUploadProgress(progress);
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
          // Update state if uploading a video
          if (type === "videos") {
            setVideoModules([
              ...videoModules,
              { title, description, url: fileUrl },
            ]);
          }
          setVideoUploadProgress(0);
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
      alert("Upload canceled.");
    }
  };

  const handleDelete = async (id, type) => {
    try {
      await deleteDoc(doc(db, `${type}_${selectedCourse}`, id));
      if (type === "videos") {
        setVideoModules(videoModules.filter((module) => module.id !== id));
      } else {
        setStudyMaterials(
          studyMaterials.filter((material) => material.id !== id)
        );
      }
      alert("Deleted successfully");
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const handleEdit = async (
    id,
    updatedTitle,
    updatedDescription,
    file,
    type
  ) => {
    try {
      let fileUrl = null;
      if (file) {
        const storageRef = ref(
          storage,
          `${type}/${selectedCourse}/${Date.now()}_${file.name}`
        );
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
          "state_changed",
          () => {},
          (error) => {
            console.error("File upload failed:", error);
          },
          async () => {
            fileUrl = await getDownloadURL(uploadTask.snapshot.ref);
            const updatedData = {
              title: updatedTitle,
              description: updatedDescription,
            };
            if (fileUrl) updatedData.url = fileUrl;
            await updateDoc(
              doc(db, `${type}_${selectedCourse}`, id),
              updatedData
            );
            alert("Updated successfully");
            setEditVideo(null);
          }
        );
      } else {
        await updateDoc(doc(db, `${type}_${selectedCourse}`, id), {
          title: updatedTitle,
          description: updatedDescription,
        });
        alert("Updated successfully");
        setEditVideo(null);
      }
    } catch (error) {
      console.error("Error updating:", error);
    }
  };

  // Group video modules by title for structured display
  const groupedVideos = videoModules.reduce((acc, module) => {
    const key = module.title || "Untitled";
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(module);
    return acc;
  }, {});

  // Mini pie chart for paid course validity
  const MiniPieChart = ({ usedDays, daysLeft }) => {
    const data = [
      { name: "Days Used", value: usedDays },
      { name: "Days Left", value: daysLeft },
    ];
    const COLORS = ["#FF6347", "#FFDAB9"];

    if (usedDays === 0 && daysLeft === 0) {
      return <span className="text-red-400 font-medium">N/A</span>;
    }
    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-500"></div>
        </div>
      );
    }
    return (
      <div className="w-20 h-20 flex items-center justify-center">
        <PieChart width={80} height={80}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={35}
            labelLine={false}
            label={({ value }) => `${value}d`}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center py-10 px-4">
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-8 text-center max-w-sm w-full">
          <div className="w-12 h-12 border-4 border-[#dd2727] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300 font-medium tracking-wider animate-pulse">LOADING COURSES...</p>
        </div>
      </div>
    );
  }  return (
    <div className="admin-layout min-h-screen flex flex-col">
      <div id="top-sentinel" className="absolute top-0 left-0 w-full h-px pointer-events-none z-[-1]" />
      <Header />
      
      <div className="flex flex-1 relative z-10 pt-16">
        <Aside />
        
        <main className="flex-1 admin-fluid-container bg-gray-50/50 backdrop-blur-sm p-4 md:p-10">
          <div className="max-w-7xl mx-auto space-y-10">
            
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
              <div>
                <h4 className="text-[#dd2727] font-black uppercase tracking-[0.3em] text-[10px] mb-2">Learning Path</h4>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                  My Enrolled <span className="text-[#dd2727]">Courses</span>
                </h1>
              </div>
              <Link to="/courses" className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:shadow-xl transition-all hover:-translate-y-0.5 self-start md:self-center">
                Explore More
              </Link>
            </div>

            {courses.length === 0 ? (
              <div className="admin-card p-20 text-center bg-white">
                <div className="text-4xl mb-6">🔭</div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tight">No Courses Found</h3>
                <p className="text-slate-500 font-medium mb-8 max-w-md mx-auto">
                  You are not enrolled in any courses yet. Start your cosmic journey by exploring our sacred teachings.
                </p>
                <Link to="/courses" className="bg-[#dd2727] text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] hover:shadow-xl transition-all">
                  Browse Catalog
                </Link>
              </div>
            ) : (
              <div className="space-y-10">
                {/* Desktop: Table View */}
                <div className="hidden md:block admin-card overflow-hidden bg-white">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="py-5 px-8 font-black text-slate-400 uppercase tracking-widest text-[9px]">Course Details</th>
                        <th className="py-5 px-8 font-black text-slate-400 uppercase tracking-widest text-[9px]">Type</th>
                        <th className="py-5 px-8 font-black text-slate-400 uppercase tracking-widest text-[9px]">Validity</th>
                        <th className="py-5 px-8 font-black text-slate-400 uppercase tracking-widest text-[9px] text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {courses.map((course, index) => (
                        <tr key={index} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="py-6 px-8">
                            <div className="flex items-center gap-5">
                               <div className="w-20 h-12 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex-shrink-0 flex items-center justify-center">
                                 <img 
                                   src={course.image} 
                                   alt={course.name} 
                                   className="w-full h-full object-contain" 
                                   onError={(e) => {
                                     e.target.onerror = null;
                                     e.target.src = "/assets/courses.jpg";
                                   }}
                                 />
                               </div>
                               <span className="text-slate-800 font-bold text-base tracking-tight">{course.name}</span>
                            </div>
                          </td>
                          <td className="py-6 px-8">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest ${course.type === 'Paid' ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>
                              {course.type.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-6 px-8">
                            {course.type === "Paid" ? (
                              <div className="flex items-center space-x-4">
                                <MiniPieChart usedDays={course.usedDays} daysLeft={course.daysLeft} />
                                <div className="flex flex-col">
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Days Left</span>
                                  <span className="text-slate-900 font-bold">{course.daysLeft} Days</span>
                                </div>
                              </div>
                            ) : (
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lifetime Access</span>
                            )}
                          </td>
                          <td className="py-6 px-8 text-right">
                            <button
                              onClick={() => navigate(`/course/${encodeURIComponent(course.name)}`)}
                              className="bg-white border border-slate-200 text-slate-600 hover:bg-[#dd2727] hover:text-white hover:border-[#dd2727] px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                            >
                              Continue Learning
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile: Card View */}
                <div className="grid gap-6 md:hidden">
                  {courses.map((course, index) => (
                    <div key={index} className="admin-card overflow-hidden group bg-white flex flex-col h-full shadow-sm border border-slate-100">
                      <div className="relative overflow-hidden bg-slate-50">
                        <img 
                          src={course.image} 
                          alt={course.name} 
                          className="w-full h-auto group-hover:scale-105 transition-transform duration-700 block" 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/assets/courses.jpg";
                          }}
                        />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-900 shadow-sm border border-slate-100">
                          {course.type}
                        </div>
                        <div className="absolute inset-0 bg-slate-900/5 group-hover:bg-slate-900/0 transition-all"></div>
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight mb-6 group-hover:text-[#dd2727] transition-colors">{course.name}</h3>
                        
                        <div className="mt-auto space-y-6">
                          {course.type === "Paid" && (
                            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                              <MiniPieChart usedDays={course.usedDays} daysLeft={course.daysLeft} />
                              <div className="flex flex-col">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Validity Remaining</span>
                                <span className="text-slate-900 font-bold">{course.daysLeft} Days</span>
                              </div>
                            </div>
                          )}
                          
                          <button
                            onClick={() => navigate(`/course/${encodeURIComponent(course.name)}`)}
                            className="w-full py-4 bg-[#dd2727] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-[0_10px_20px_rgba(221,39,39,0.2)] hover:shadow-[0_15px_25px_rgba(221,39,39,0.3)] transition-all"
                          >
                            Continue Learning
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Video Sessions Section */}
            <div className="space-y-8 pt-10">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Recorded <span className="text-[#dd2727]">Sessions</span></h2>
                <div className="flex-1 h-px bg-slate-200"></div>
              </div>

              {Object.entries(groupedVideos).length === 0 ? (
                <div className="admin-card p-12 text-center border-dashed">
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No recorded sessions available for your courses yet.</p>
                </div>
              ) : (
                Object.entries(groupedVideos).map(([title, modules]) => (
                  <div key={title} className="space-y-4">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">{title}</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {modules.map((module) => (
                        <div key={module.id} className="admin-card p-5 bg-white group hover:border-[#dd2727] transition-all">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-[#dd2727] flex-shrink-0 group-hover:bg-[#dd2727] group-hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/></svg>
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-800 tracking-tight leading-tight mb-1">
                                  {module.description?.substring(0, 80) || "Video Session"}...
                                </h4>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sacred Lecture</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 w-full md:w-auto">
                              <a
                                href={module.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 md:flex-none text-center bg-slate-900 text-white px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#dd2727] transition-all"
                              >
                                Watch Now
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Study Materials Section */}
            <div className="space-y-8 pt-10 pb-10">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Study <span className="text-[#dd2727]">Materials</span></h2>
                <div className="flex-1 h-px bg-slate-200"></div>
              </div>

              {studyMaterials.length === 0 ? (
                 <div className="admin-card p-12 text-center border-dashed">
                   <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Reference documents will appear here once available.</p>
                 </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {studyMaterials.map((material) => (
                    <div key={material.id} className="admin-card p-6 bg-white hover:border-[#dd2727] transition-all group">
                      <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 mb-6 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/></svg>
                      </div>
                      <h3 className="font-bold text-slate-800 tracking-tight mb-4 line-clamp-2 min-h-[3rem]">{material.title}</h3>
                      <a
                        href={material.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[10px] font-black text-[#dd2727] uppercase tracking-widest hover:underline"
                      >
                        Download PDF
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default EnrollCourse;

