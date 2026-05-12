
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebaseConfig"; // Firebase configuration file
import Aside from "./Aside";
import Header from "../../components/sections/Header/Header";
import Footer from "../../components/sections/Footer/Footer";
import { PieChart, Pie, Cell } from "recharts";

const MiniPieChart = ({ usedDays, daysLeft }) => {
  const data = [
    { name: "Used", value: usedDays },
    { name: "Left", value: daysLeft },
  ];
  const COLORS = ["#f1f5f9", "#dd2727"];

  return (
    <PieChart width={40} height={40}>
      <Pie
        data={data}
        innerRadius={12}
        outerRadius={20}
        paddingAngle={0}
        dataKey="value"
        stroke="none"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
    </PieChart>
  );
};

const EnrollCourse = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [groupedVideos, setGroupedVideos] = useState({});
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchCourses(currentUser.email);
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [auth, navigate]);

  const fetchCourses = async (email) => {
    try {
      const docRef = doc(db, "subscriptions", email);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
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

        const freeCourses = data.freecourses?.map((courseName) => ({
          name: courseName,
          type: "Free",
          enrolled: true,
          image: coursesMetadata[courseName] || "/assets/courses.jpg"
        })) || [];

        const paidCourses = data.DETAILS?.map((courseObj) => {
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
            usedDays = usedTime > 0 ? Math.floor(usedTime / (1000 * 3600 * 24)) : 0;

            const rawDaysLeft = totalDays - usedDays;
            daysLeft = rawDaysLeft < 0 ? 0 : rawDaysLeft;
          }

          return {
            name: courseName,
            type: "Paid",
            enrolled: true,
            daysLeft,
            usedDays,
            image: coursesMetadata[courseName] || "/assets/courses.jpg"
          };
        }) || [];

        const allCourses = [...freeCourses, ...paidCourses];
        setCourses(allCourses);

        // Fetch all videos for grouped display
        const allVideosGrouped = {};
        for (const course of allCourses) {
            const videosRef = collection(db, `videos_${course.name}`);
            const videosSnapshot = await getDocs(videosRef);
            if (!videosSnapshot.empty) {
                allVideosGrouped[course.name] = videosSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
            }
        }
        setGroupedVideos(allVideosGrouped);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#dd2727] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300 font-medium tracking-wider animate-pulse uppercase">Syncing Cosmic Path...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <div className="flex flex-1 relative z-10">
        <Aside />
        
        <main className="flex-1 p-4 md:p-10 pt-10">
          <div className="max-w-7xl mx-auto space-y-12">
            
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 py-12">
              <div>
                <h4 className="text-[#dd2727] font-black uppercase tracking-[0.3em] text-[10px] mb-2">Academic Journey</h4>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">
                  My Enrolled <span className="text-[#dd2727]">Courses</span>
                </h1>
              </div>
              <Link to="/courses" className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-[#dd2727] transition-all">
                Browse Catalog
              </Link>
            </div>

            {courses.length === 0 ? (
              <div className="bg-white p-20 text-center rounded-[2.5rem] shadow-sm border border-slate-100">
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
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {courses.map((course, index) => (
                  <div 
                    key={index} 
                    className="group bg-white border border-red-600 shadow-lg rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:scale-[1.02] transform transition-all duration-500 flex flex-col"
                  >
                    {/* Image Container */}
                    <div className="relative p-6 bg-[#fffcf8]">
                      <div className="absolute top-4 left-4 z-20">
                        <img
                          src="/assets/vahlay_astro.png"
                          alt="logo"
                          className="w-12 h-12 bg-white object-contain rounded-full shadow-lg border border-red-100"
                        />
                      </div>
                      
                      <div className="relative rounded-2xl overflow-hidden border-8 border-orange-100 bg-white aspect-[16/10] flex items-center justify-center">
                        <img 
                          src={course.image} 
                          alt={course.name} 
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/assets/courses.jpg";
                          }}
                        />
                        <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">
                          {course.type}
                        </div>
                      </div>
                    </div>

                    {/* Course Info */}
                    <div className="p-8 flex-1 flex flex-col items-center text-center">
                      <h3 className="text-xl font-black text-red-600 mb-2 tracking-tight uppercase leading-tight">
                        {course.name}
                      </h3>
                      <p className="text-[10px] text-slate-400 mb-6 font-black uppercase tracking-[0.2em]">
                        Student Enrolled
                      </p>

                      <div className="w-full mt-auto space-y-6">
                        {/* Validity Section */}
                        <div className="flex items-center justify-center gap-6 py-4 px-6 bg-orange-50/50 rounded-2xl border border-orange-100">
                          {course.type === "Paid" ? (
                            <>
                              <MiniPieChart usedDays={course.usedDays} daysLeft={course.daysLeft} />
                              <div className="flex flex-col items-start">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Validity Remaining</span>
                                <span className="text-slate-900 font-bold">{course.daysLeft} Days Left</span>
                              </div>
                            </>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-amber-500 text-lg">♾️</span>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lifetime Cosmic Access</span>
                            </div>
                          )}
                        </div>

                        {/* Action Button */}
                        <button
                          onClick={() => navigate(`/course/${encodeURIComponent(course.name)}`)}
                          className="w-full py-4 bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-[0_10px_20px_rgba(221,39,39,0.1)] hover:bg-red-700 hover:shadow-[0_15px_30px_rgba(221,39,39,0.2)] transition-all active:scale-95 flex items-center justify-center gap-2 group/btn"
                        >
                          Enter Course Portal
                          <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Recorded Sessions Section */}
            <div className="space-y-8 pt-10">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Recorded <span className="text-[#dd2727]">Sessions</span></h2>
                <div className="flex-1 h-px bg-slate-200"></div>
              </div>

              {Object.entries(groupedVideos).length === 0 ? (
                <div className="bg-white p-12 text-center rounded-[2rem] border border-dashed border-slate-200">
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No recorded sessions available for your courses yet.</p>
                </div>
              ) : (
                <div className="space-y-12">
                  {Object.entries(groupedVideos).map(([title, modules]) => (
                    <div key={title} className="space-y-4">
                      <h3 className="text-[10px] font-black text-[#dd2727] uppercase tracking-[0.3em] ml-2">{title}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {modules.map((module) => (
                          <div key={module.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm group hover:border-red-500 transition-all cursor-pointer" onClick={() => navigate(`/course/${encodeURIComponent(title)}/video/${module.id}`)}>
                            <div className="flex items-center gap-5">
                              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-[#dd2727] flex-shrink-0 group-hover:bg-[#dd2727] group-hover:text-white transition-colors">
                                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/></svg>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-slate-800 tracking-tight leading-tight mb-1 truncate">
                                  {module.description || module.title || "Sacred Lecture"}
                                </h4>
                                <div className="flex items-center gap-3">
                                    <span className="text-[9px] font-black text-[#dd2727] uppercase tracking-widest bg-red-50 px-2 py-0.5 rounded">Module {module['title-order'] || 0}</span>
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Lesson {module.order || 0}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
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
