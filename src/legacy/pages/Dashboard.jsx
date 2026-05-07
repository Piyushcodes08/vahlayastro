import React, { useState, useEffect } from 'react'
import Aside from './Aside'
import Header from '../../components/sections/Header/Header'
import Footer from '../../components/sections/Footer/Footer'
import { db } from '../../firebaseConfig'
import { getAuth } from 'firebase/auth'
import { doc, getDoc, collection, getDocs } from 'firebase/firestore'
import { Link } from 'react-router-dom'

const Dashboard = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) return;

            try {
                // Fetch user subscriptions
                const docRef = doc(db, "subscriptions", user.email);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    
                    // Fetch metadata for images
                    const coursesRef = collection(db, "courses");
                    const coursesSnap = await getDocs(coursesRef);
                    const coursesMetadata = {};
                    coursesSnap.forEach(doc => {
                        const d = doc.data();
                        coursesMetadata[d.Title || d.title] = d.imageUrl || d.image;
                    });

                    const enrolled = [
                        ...(data.freecourses || []),
                        ...(data.DETAILS?.map(c => Object.keys(c)[0]) || [])
                    ].slice(0, 3); // Top 3 for dashboard

                    setCourses(enrolled.map(name => ({
                        name,
                        image: coursesMetadata[name] || "/assets/img/courses.webp"
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
            
            <div className="flex flex-1 relative z-10 pt-16">
                <Aside />
                
                <main className="flex-1 admin-fluid-container bg-gray-50/50 backdrop-blur-sm p-4 md:p-10">
                    <div className="max-w-7xl mx-auto space-y-10">
                        
                        {/* Welcome Banner - Admin Style */}
                        <div className="admin-card p-8 md:p-12 relative overflow-hidden group border-l-8 border-l-[#dd2727]">
                            <div className="relative z-10">
                                <h4 className="text-[#dd2727] font-black uppercase tracking-[0.3em] text-[10px] mb-4">Student Dashboard</h4>
                                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                                    Welcome back, <span className="text-[#dd2727]">Wise Seeker.</span>
                                </h1>
                                <p className="text-slate-500 text-lg max-w-2xl leading-relaxed mb-8 font-medium">
                                    Your cosmic journey continues. You have enrolled in {courses.length} sacred courses. Review your progress and continue your learning below.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <Link to="/enrolledcourse" className="bg-[#dd2727] text-white px-8 py-3.5 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:shadow-xl transition-all hover:-translate-y-0.5">
                                        Resume Learning
                                    </Link>
                                    <Link to="/courses" className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:shadow-xl transition-all hover:-translate-y-0.5">
                                        Explore More
                                    </Link>
                                </div>
                            </div>
                            {/* Decorative element */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#dd2727]/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-[#dd2727]/10 transition-all duration-700"></div>
                        </div>

                        {/* Stats Grid - Clean Admin Style */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: "Enrolled", value: courses.length.toString().padStart(2, '0'), unit: "Courses" },
                                { label: "Completed", value: "01", unit: "Certificates" },
                                { label: "Learning", value: "12.5", unit: "Hours" },
                                { label: "Spirit", value: "850", unit: "Points" }
                            ].map((stat, i) => (
                                <div key={i} className="admin-card p-6 flex flex-col items-center justify-center text-center group">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">{stat.label}</span>
                                    <div className="flex items-baseline gap-1">
                                        <h3 className="text-3xl font-black text-slate-900 group-hover:text-[#dd2727] transition-colors">{stat.value}</h3>
                                        <span className="text-[10px] font-bold text-slate-400">{stat.unit}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Recent Courses - Cards matching Admin UI */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">My Recent <span className="text-[#dd2727]">Courses</span></h3>
                                <Link to="/enrolledcourse" className="text-[10px] font-black text-[#dd2727] uppercase tracking-widest hover:underline">View All Map</Link>
                            </div>

                            {loading ? (
                                <div className="flex justify-center p-20">
                                    <div className="w-10 h-10 border-4 border-[#dd2727] border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : courses.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {courses.map((course, idx) => (
                                        <div key={idx} className="admin-card group hover:border-[#dd2727] transition-all duration-500 overflow-hidden">
                                            <div className="relative h-48 overflow-hidden bg-slate-100">
                                                <img src={course.image} alt={course.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition-all"></div>
                                            </div>
                                            <div className="p-6">
                                                <h4 className="text-lg font-black text-slate-800 mb-6 line-clamp-1 group-hover:text-[#dd2727] transition-colors">{course.name}</h4>
                                                <Link 
                                                    to={`/course/${encodeURIComponent(course.name)}`} 
                                                    className="w-full inline-block py-3 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 text-center hover:bg-[#dd2727] hover:text-white hover:border-[#dd2727] transition-all"
                                                >
                                                    Start Learning
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="admin-card p-20 text-center bg-white/50">
                                    <div className="text-4xl mb-6">🔭</div>
                                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-8">No sacred courses found in your journey yet.</p>
                                    <Link to="/courses" className="bg-[#dd2727] text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] hover:shadow-xl transition-all">Browse Catalog</Link>
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
