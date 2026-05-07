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
        // Fetch metadata for all courses to get images
        const coursesRef = collection(db, "courses");
        const coursesSnap = await getDocs(coursesRef);
        const coursesMetadata = {};
        coursesSnap.forEach(courseDoc => {
            const courseData = courseDoc.data();
            coursesMetadata[courseData.Title || courseData.title] = courseData.imageUrl || courseData.image;
        });

        const freeCourses =
          data.freecourses?.map((courseName) => ({
            name: courseName,
            type: "Free",
            enrolled: true,
            image: coursesMetadata[courseName] || "/assets/img/courses.webp"
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
  }
  return (
    <>
      <div id="top-sentinel" className="absolute top-0 left-0 w-full h-px pointer-events-none z-[-1]" />
      <Header />
      <div className="flex flex-col md:flex-row min-h-screen pt-[70px] relative z-10 premium-container">
      {/* Sidebar */}
      <Aside />
      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-10 shadow-[0_0_30px_rgba(221,39,39,0.1)] w-full mx-auto overflow-x-hidden">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 border-b border-white/10 pb-6">
            Your <span className="text-[#dd2727]">Courses</span>
          </h2>

        {/* Show message if no courses are enrolled */}
        {courses.length === 0 ? (
          <div className="text-center p-12 bg-white/5 border border-white/10 rounded-2xl">
            <h3 className="text-2xl font-bold text-white mb-4">
              You are not enrolled in any courses yet.
            </h3>
            <p className="text-gray-400 mb-8">
              Explore our courses and start your learning journey today.
            </p>
            <Link to="/courses">
              <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#dd2727] to-[#b0a102] text-white font-bold uppercase tracking-wider hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(221,39,39,0.3)]">
                Browse Courses
              </button>
            </Link>
          </div>
        ) : (
          <>
            {/* Mobile: Grid View */}
            <div className="grid gap-6 md:hidden">
              {courses.map((course, index) => {
                return (
                  <div
                    key={index}
                    className="border border-white/10 p-6 rounded-2xl bg-white/5 hover:border-white/20 transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)] group"
                  >
                    <div className="relative h-40 mb-6 rounded-xl overflow-hidden border border-white/10">
                      <img src={course.image} alt={course.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute top-3 right-3 bg-[#dd2727] text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">{course.type}</div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {course.name}
                    </h3>
                    <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Type: <span className="text-white font-medium">{course.type}</span></p>
                    <p className="text-sm text-gray-400 uppercase tracking-wider mb-4">
                      Enrolled: <span className={course.enrolled ? "text-green-400" : "text-red-400"}>{course.enrolled ? "Yes" : "No"}</span>
                    </p>
                    {course.type === "Paid" && (
                      <div className="mt-4 mb-4 flex items-center space-x-4 bg-black/40 p-4 rounded-xl border border-white/5">
                        <MiniPieChart
                          usedDays={course.usedDays}
                          daysLeft={course.daysLeft}
                        />
                        <span className="text-sm text-gray-300 font-medium tracking-wider">
                          VALIDITY LEFT: <span className="text-white">{course.daysLeft} DAYS</span>
                        </span>
                      </div>
                    )}
                    <button
                      onClick={() =>
                        navigate(`/course/${encodeURIComponent(course.name)}`)
                      }
                      className="mt-2 w-full bg-gradient-to-r from-[#dd2727] to-[#b0a102] text-white py-3 rounded-xl font-bold uppercase tracking-wider hover:scale-[1.02] transition-all shadow-[0_0_15px_rgba(221,39,39,0.3)]"
                    >
                      Start Learning
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Desktop: Table View */}
            <div className="hidden md:block overflow-x-auto pb-4">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-4 px-6 font-bold text-gray-400 uppercase tracking-wider text-sm">Course Name</th>
                    <th className="py-4 px-6 font-bold text-gray-400 uppercase tracking-wider text-sm">Type</th>
                    <th className="py-4 px-6 font-bold text-gray-400 uppercase tracking-wider text-sm">Enrolled</th>
                    <th className="py-4 px-6 font-bold text-gray-400 uppercase tracking-wider text-sm">Validity</th>
                    <th className="py-4 px-6 font-bold text-gray-400 uppercase tracking-wider text-sm text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {courses.map((course, index) => {
                    return (
                      <tr
                        key={index}
                        className="hover:bg-white/5 transition-colors group"
                      >
                        <td className="py-5 px-6">
                          <div className="flex items-center gap-4">
                             <div className="w-16 h-10 rounded-lg overflow-hidden border border-white/10 bg-black/40">
                               <img src={course.image} alt={course.name} className="w-full h-full object-cover" />
                             </div>
                             <span className="text-white font-medium text-lg">{course.name}</span>
                          </div>
                        </td>
                        <td className="py-5 px-6 text-gray-300">{course.type}</td>
                        <td className="py-5 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider ${course.enrolled ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                            {course.enrolled ? "YES" : "NO"}
                          </span>
                        </td>
                        <td className="py-5 px-6">
                          {course.type === "Paid" ? (
                            <div className="flex items-center space-x-3">
                              <MiniPieChart
                                usedDays={course.usedDays}
                                daysLeft={course.daysLeft}
                              />
                              <span className="text-sm text-gray-300">
                                Left: <span className="text-white font-bold">{course.daysLeft}d</span>
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500 font-medium">LIFETIME</span>
                          )}
                        </td>
                        <td className="py-5 px-6 text-right">
                          <button
                            onClick={() =>
                              navigate(
                                `/course/${encodeURIComponent(course.name)}`
                              )
                            }
                            className="bg-white/5 border border-white/10 hover:border-[#dd2727] hover:bg-[#dd2727]/20 text-white py-2 px-6 rounded-xl font-bold uppercase tracking-wider text-xs transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 md:transform md:translate-x-2 md:group-hover:translate-x-0"
                          >
                            Start Learning
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Video Sessions Section */}
        <div className="mt-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 border-b border-white/10 pb-4">Video <span className="text-[#dd2727]">Sessions</span></h2>
          {Object.entries(groupedVideos).map(([title, modules]) => (
            <div key={title} className="mb-8">
              <h3 className="text-xl font-bold text-white mb-4 bg-white/5 px-4 py-2 rounded-lg border-l-4 border-[#dd2727]">{title}</h3>
              {modules.map((module) => (
                <div key={module.id} className="p-6 border border-white/10 rounded-2xl mb-4 ml-0 md:ml-6 bg-black/20 hover:bg-white/5 transition-colors">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                      <h4 className="font-bold text-lg text-white mb-2">
                        {module.description?.substring(0, 60)}...
                      </h4>
                      <a
                        href={module.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#dd2727] hover:text-white font-medium uppercase tracking-wider text-sm flex items-center gap-2 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/></svg>
                        Watch Video
                      </a>
                    </div>
                    <div className="mt-4 md:mt-0 flex gap-2 w-full md:w-auto">
                      <button
                        onClick={() => setEditVideo(module)}
                        className="flex-1 md:flex-none bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500 hover:text-white border border-yellow-500/50 px-4 py-2 rounded-lg text-sm font-bold uppercase transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(module.id, "videos")}
                        className="flex-1 md:flex-none bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/50 px-4 py-2 rounded-lg text-sm font-bold uppercase transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  {editVideo && editVideo.id === module.id && (
                    <div className="mt-6 p-6 bg-black/40 border border-white/10 rounded-xl space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                          Edit Video Title
                        </label>
                        <input
                          type="text"
                          defaultValue={module.title}
                          onChange={(e) => (module.title = e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#dd2727]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                          Edit Video Description
                        </label>
                        <textarea
                          defaultValue={module.description}
                          onChange={(e) => (module.description = e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#dd2727]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                          Upload New Video (Optional)
                        </label>
                        <input
                          type="file"
                          onChange={(e) => (module.newFile = e.target.files[0])}
                          className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer"
                        />
                      </div>

                      <div className="flex space-x-4 pt-4 border-t border-white/10">
                        <button
                          onClick={() =>
                            handleEdit(
                              module.id,
                              module.title,
                              module.description,
                              module.newFile,
                              "videos"
                            )
                          }
                          className="bg-gradient-to-r from-green-600 to-green-800 text-white px-6 py-2 rounded-xl font-bold uppercase tracking-wider w-full hover:shadow-[0_0_15px_rgba(22,163,74,0.4)] transition-all"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditVideo(null)}
                          className="bg-white/5 border border-white/10 text-white px-6 py-2 rounded-xl font-bold uppercase tracking-wider w-full hover:bg-white/10 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Study Materials Section */}
        <div className="mt-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 border-b border-white/10 pb-4">Study <span className="text-[#dd2727]">Materials</span></h2>
          {studyMaterials.map((material) => (
            <div key={material.id} className="p-6 border border-white/10 rounded-2xl mb-4 bg-black/20 hover:bg-white/5 transition-colors">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h3 className="font-bold text-lg text-white mb-2">{material.title}</h3>
                  <a
                    href={material.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#dd2727] hover:text-white font-medium uppercase tracking-wider text-sm flex items-center gap-2 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/></svg>
                    View Document
                  </a>
                </div>
                <div className="mt-4 md:mt-0 flex gap-2 w-full md:w-auto">
                  <button
                    onClick={() => setEditMaterial(material)}
                    className="flex-1 md:flex-none bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500 hover:text-white border border-yellow-500/50 px-4 py-2 rounded-lg text-sm font-bold uppercase transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(material.id, "materials")}
                    className="flex-1 md:flex-none bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/50 px-4 py-2 rounded-lg text-sm font-bold uppercase transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {editMaterial && editMaterial.id === material.id && (
                <div className="mt-6 p-6 bg-black/40 border border-white/10 rounded-xl space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Edit Material Title</label>
                    <input
                      type="text"
                      defaultValue={material.title}
                      onChange={(e) => (material.title = e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#dd2727]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Upload New File (Optional)</label>
                    <input
                      type="file"
                      onChange={(e) => (material.newFile = e.target.files[0])}
                      className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer"
                    />
                  </div>
                  <div className="flex space-x-4 pt-4 border-t border-white/10">
                    <button
                      onClick={() =>
                        handleEdit(
                          material.id,
                          material.title,
                          "", // no desc for materials
                          material.newFile,
                          "materials"
                        )
                      }
                      className="bg-gradient-to-r from-green-600 to-green-800 text-white px-6 py-2 rounded-xl font-bold uppercase tracking-wider w-full hover:shadow-[0_0_15px_rgba(22,163,74,0.4)] transition-all"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditMaterial(null)}
                      className="bg-white/5 border border-white/10 text-white px-6 py-2 rounded-xl font-bold uppercase tracking-wider w-full hover:bg-white/10 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        </div>
      </main>
      </div>
      <Footer />
    </>
  );
};

export default EnrollCourse;
