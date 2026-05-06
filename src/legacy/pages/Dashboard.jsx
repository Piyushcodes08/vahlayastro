import Aside from './Aside'
import Header from '../../components/sections/Header/Header'
import Footer from '../../components/sections/Footer/Footer'
import { db } from '../../firebaseConfig'
import { getAuth } from 'firebase/auth'
import { doc, getDoc, collection, getDocs } from 'firebase/firestore'

const Dashboard = () => {
    const [courses, setCourses] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchDashboardData = async () => {
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) return;

            try {
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
                    ].slice(0, 3); // Just show top 3

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
        <div className="bg-[#050505] min-h-screen">
            <div id="top-sentinel" className="absolute top-0 left-0 w-full h-px pointer-events-none z-[-1]" />
            <Header />
            <div className="flex flex-col md:flex-row min-h-screen pt-[80px] relative z-10 premium-container gap-8 pb-12">
                <Aside />
                <main className="flex-1 py-8">
                    <div className="space-y-12">
                        {/* Welcome Banner */}
                        <div className="relative overflow-hidden bg-gradient-to-br from-black/60 to-[#dd2727]/10 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 md:p-16 shadow-[0_40px_100px_rgba(0,0,0,0.4)] group">
                            <div className="relative z-10 max-w-2xl">
                                <span className="inline-block px-4 py-1.5 bg-[#dd2727]/20 text-[#dd2727] rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 border border-[#dd2727]/30">
                                    75% Journey Complete
                                </span>
                                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-[1.1]">
                                    Welcome back, <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#dd2727] to-[#b0a102]">Wise Seeker.</span>
                                </h1>
                                <p className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed mb-10">
                                    The celestial alignment is perfect for your next lesson. You have 2 pending assignments waiting for your insight.
                                </p>
                                <div className="flex flex-wrap gap-5">
                                    <button className="bg-[#dd2727] text-white px-10 py-4 rounded-2xl font-bold uppercase tracking-widest hover:shadow-[0_0_30px_rgba(221,39,39,0.5)] transition-all transform hover:scale-105">
                                        Resume Journey
                                    </button>
                                    <button className="bg-white/5 border border-white/10 text-white px-10 py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-white/10 transition-all">
                                        View Map
                                    </button>
                                </div>
                            </div>
                            {/* Decorative element */}
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#dd2727]/20 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/4 opacity-40 group-hover:opacity-60 transition-opacity"></div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: "Active Courses", value: "03", icon: "📚", color: "#dd2727" },
                                { label: "Hours Learned", value: "12.5", icon: "🕒", color: "#b0a102" },
                                { label: "Certificates", value: "01", icon: "🎓", color: "#dd2727" },
                                { label: "Spirit Points", value: "850", icon: "✨", color: "#b0a102" }
                            ].map((stat, i) => {
                                return (
                                    <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] hover:border-white/20 transition-all duration-500 group relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-[#dd2727]/10 transition-all"></div>
                                        <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-500">{stat.icon}</div>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                                        <h3 className="text-3xl font-bold text-white tracking-tight">{stat.value}</h3>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Recent Activity & Quick Links */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                            <div className="lg:col-span-2 space-y-8">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-2xl font-bold text-white flex items-center gap-4">
                                        <span className="w-1.5 h-8 bg-[#dd2727] rounded-full shadow-[0_0_15px_rgba(221,39,39,0.5)]"></span>
                                        Curriculum Progress
                                    </h3>
                                    <button className="text-[10px] font-bold text-[#b0a102] uppercase tracking-widest hover:text-white transition-colors">View All Insights</button>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { title: "Vedic Foundations & Astronomy", date: "Yesterday", progress: "80%", type: "Video" },
                                        { title: "Astrological House Analysis", date: "2 days ago", progress: "45%", type: "Quiz" },
                                        { title: "Planetary Aspects & Yogas", date: "5 days ago", progress: "100%", type: "Reading" }
                                    ].map((lesson, i) => {
                                        return (
                                            <div key={i} className="bg-white/5 backdrop-blur-md border border-white/5 p-6 rounded-3xl flex items-center justify-between hover:bg-white/10 hover:border-white/10 transition-all group cursor-pointer shadow-lg shadow-black/20">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-2xl border border-white/5 group-hover:bg-[#dd2727]/10 group-hover:text-[#dd2727] transition-all">
                                                        {lesson.type === 'Video' ? '▶️' : lesson.type === 'Quiz' ? '📝' : '📖'}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-white font-bold text-lg leading-tight mb-1 group-hover:text-[#dd2727] transition-colors">{lesson.title}</h4>
                                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{lesson.date} • {lesson.type}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right hidden sm:block">
                                                    <span className="text-xs font-bold text-[#b0a102]">{lesson.progress}</span>
                                                    <div className="w-32 h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                                                        <div className="h-full bg-gradient-to-r from-[#dd2727] to-[#b0a102]" style={{ width: lesson.progress }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="space-y-8">
                                <h3 className="text-2xl font-bold text-white">Divine Help</h3>
                                <div className="bg-gradient-to-br from-[#dd2727]/20 to-[#b0a102]/10 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden group">
                                    <div className="relative z-10">
                                        <p className="text-[#dd2727] font-bold uppercase tracking-widest text-[10px] mb-4">Elite Guidance</p>
                                        <p className="text-2xl font-bold text-white mb-4 leading-tight">Need Spiritual Clarity?</p>
                                        <p className="text-sm text-gray-400 mb-8 leading-relaxed">Connect with Guru Ji for a 1-on-1 cosmic consultation session.</p>
                                        <button className="w-full bg-[#dd2727] text-white hover:bg-white hover:text-black py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all shadow-[0_10px_30px_rgba(221,39,39,0.3)]">
                                            Book Consultation
                                        </button>
                                    </div>
                                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#b0a102]/20 rounded-full blur-3xl group-hover:bg-[#b0a102]/40 transition-all"></div>
                                </div>
                            </div>
                        </div>
                        {/* Enrolled Courses Section */}
                        <div className="mt-16">
                            <h3 className="text-2xl font-bold text-white mb-8 border-b border-white/10 pb-4">Recent <span className="text-[#dd2727]">Enrolled Courses</span></h3>
                            {loading ? (
                                <div className="flex justify-center p-12">
                                    <div className="w-8 h-8 border-2 border-[#dd2727] border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : courses.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {courses.map((course, idx) => {
                                        return (
                                            <div key={idx} className="bg-white/5 border border-white/10 rounded-3xl p-6 group hover:border-[#dd2727]/30 transition-all duration-500 overflow-hidden">
                                                <div className="relative h-40 mb-6 rounded-2xl overflow-hidden border border-white/10">
                                                    <img src={course.image} alt={course.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                </div>
                                                <h4 className="text-lg font-bold text-white mb-4 line-clamp-1">{course.name}</h4>
                                                <a href={`/course/${encodeURIComponent(course.name)}`} className="inline-block px-6 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-bold uppercase tracking-wider text-white hover:bg-[#dd2727] hover:border-[#dd2727] transition-all">Start Now</a>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center p-12 bg-white/5 rounded-3xl border border-white/5">
                                    <p className="text-gray-400">No courses enrolled yet.</p>
                                    <a href="/courses" className="inline-block mt-4 text-[#dd2727] font-bold uppercase tracking-widest text-sm hover:underline">Browse Courses</a>
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
