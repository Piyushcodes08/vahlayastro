import React, { useState, useEffect } from 'react'
import Aside from './Aside'
import Header from '../../components/sections/Header/Header'
import Footer from '../../components/sections/Footer/Footer'
import { db } from '../../firebaseConfig'
import { getAuth } from 'firebase/auth'
import { doc, getDoc, collection, getDocs, updateDoc, arrayRemove } from 'firebase/firestore'
import { Link, useNavigate } from 'react-router-dom'

const Dashboard = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const auth = getAuth();

    useEffect(() => {
        const fetchDashboardData = async () => {
            const auth = getAuth();
            const currentUser = auth.currentUser;
            if (!currentUser) return;
            setUser(currentUser);

            try {
                // Fetch user subscriptions
                const docRef = doc(db, "subscriptions", currentUser.email);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();

                    // Fetch metadata for images from correct collections
                    const courseTypes = ["freeCourses", "paidCourses"];
                    const coursesMetadata = {};

                    for (const type of courseTypes) {
                        const coursesSnap = await getDocs(collection(db, type));
                        coursesSnap.forEach(doc => {
                            const d = doc.data();
                            const courseName = d.Title || d.title;
                            if (courseName) {
                                coursesMetadata[courseName] = d.imageUrl || d.image || d.thumbnail || d.courseImage || d.imgUrl || "";
                            }
                        });
                    }

                    const enrolled = [
                        ...(data.freecourses || []),
                        ...(data.DETAILS?.map(c => Object.keys(c)[0]) || [])
                    ].slice(0, 3); // Top 3 for dashboard

                    setCourses(enrolled.map(name => ({
                        name,
                        image: coursesMetadata[name] || "/src/assets/images/pages/courses/courses.jpg"
                    })));
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    return (
        <div className="admin-layout min-h-screen flex flex-col">
            <div id="top-sentinel" className="absolute top-0 left-0 w-full h-px pointer-events-none z-[-1]" />
            <Header />

            <div className="flex flex-1 relative z-10">
                <Aside />

                <main className="flex-1 admin-fluid-container bg-gray-50/50 backdrop-blur-sm p-4 md:p-10 pt-28 md:pt-32">
                    <div className="max-w-7xl mx-auto space-y-10">

                        {/* Welcome Banner */}
                        <div className="bg-white p-6 md:p-12 rounded-[2rem] md:rounded-[2.5rem] border border-red-100 shadow-sm relative overflow-hidden group text-center flex flex-col items-center">
                            <div className="relative z-10 w-full">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-12 mb-8">
                                    <div className="text-left">
                                        <h4 className="text-[#dd2727] font-black uppercase tracking-[0.4em] text-[10px] mb-2">Student Dashboard</h4>
                                        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                                            Welcome Back, <span className="text-[#dd2727]">{user?.displayName?.split(' ')[0] || 'Seeker'}</span>
                                        </h2>
                                    </div>
                                    <div className="hidden md:flex items-center gap-3 px-6 py-3 bg-slate-50 rounded-[2rem] border border-slate-100">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Account Active</span>
                                    </div>
                                </div>

                                <p className="text-slate-500 text-lg leading-relaxed mb-10 font-medium max-w-2xl mx-auto">
                                    Your cosmic journey continues. You have enrolled in {courses.length} sacred courses. Review your progress and continue your learning below.
                                </p>

                                <div className="flex flex-wrap justify-center gap-6">
                                    <Link to="/enrolledcourse" className="bg-[#dd2727] text-white px-10 py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] hover:shadow-2xl transition-all hover:-translate-y-1">
                                        Resume Learning
                                    </Link>
                                    <Link to="/courses" className="bg-slate-900 text-white px-10 py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] hover:shadow-2xl transition-all hover:-translate-y-1">
                                        Explore More
                                    </Link>
                                </div>
                            </div>
                            {/* Decorative element */}
                            <div className="absolute top-0 right-0 w-80 h-80 bg-[#dd2727]/5 rounded-full -mr-20 -mt-20 blur-3xl opacity-50 group-hover:opacity-100 transition-all duration-700"></div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                { label: "Enrolled Courses", value: courses.length.toString().padStart(2, '0') },
                                { label: "Learning Hours", value: "12" },
                                { label: "Active Path", value: "Cosmic" },
                            ].map((stat, idx) => (
                                <div key={idx} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm text-center flex flex-col items-center justify-center hover:border-red-100 transition-all group">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 group-hover:text-red-600 transition-colors">{stat.label}</h4>
                                    <div className="text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</div>
                                </div>
                            ))}
                        </div>

                        {/* Recent Courses Preview */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-4">
                                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Recent <span className="text-[#dd2727]">Enrolled</span></h2>
                                <div className="flex-1 h-px bg-slate-200"></div>
                            </div>

                            {loading ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {[1, 2, 3].map(i => <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-[2rem]" />)}
                                </div>
                            ) : courses.length === 0 ? (
                                <div className="bg-white p-20 rounded-[2.5rem] border-2 border-dashed border-slate-100 text-center flex flex-col items-center">
                                    <div className="text-4xl mb-6">🔭</div>
                                    <p className="text-slate-400 font-black uppercase tracking-widest text-[10px] mb-8">No sacred courses found in your journey yet.</p>
                                    <Link to="/courses" className="bg-[#dd2727] text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] hover:shadow-xl transition-all">Browse Catalog</Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {courses.map((course, idx) => (
                                        <div key={idx} className="group bg-white border border-red-600 rounded-[2.5rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col cursor-pointer" onClick={() => navigate(`/course/${encodeURIComponent(course.name)}`)}>
                                            <div className="p-6 bg-[#fffcf8] relative">
                                                <div className="absolute top-4 left-4 z-20">
                                                    <img src="/src/assets/images/common/logos/vahlay_astro.png" alt="" className="w-10 h-10 bg-white rounded-full shadow-lg border border-red-50 p-1" />
                                                </div>
                                                <div className="relative rounded-2xl overflow-hidden border-8 border-orange-100 aspect-[16/10] bg-white">
                                                    <img
                                                        src={course.image}
                                                        alt={course.name}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = "/src/assets/images/pages/courses/courses.jpg";
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="p-6 flex-1 flex flex-col items-center text-center">
                                                <h3 className="text-lg font-black text-red-600 uppercase tracking-tight mb-4 leading-tight truncate w-full">{course.name}</h3>
                                                <button className="mt-auto text-[9px] font-black text-white bg-slate-900 px-6 py-2.5 rounded-lg uppercase tracking-widest hover:bg-[#dd2727] transition-all">
                                                    Continue Path
                                                </button>
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
}

export default Dashboard

