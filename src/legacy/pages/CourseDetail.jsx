
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "../../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useParams } from "react-router-dom";
import { RiShareForwardFill } from "react-icons/ri";
import { 
  FaStar, 
  FaClock, 
  FaUserGraduate, 
  FaCertificate, 
  FaBookOpen, 
  FaCheckCircle,
  FaChevronDown,
  FaQuoteLeft
} from "react-icons/fa";
import { useCourses } from "../../context/CoursesContext";
import { Helmet } from "react-helmet-async";
import Header from "../../components/sections/Header/Header";
import Footer from "../../components/sections/Footer/Footer";
import { motion, AnimatePresence } from "framer-motion";

const CourseDetail = () => {
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const location = useLocation();
  const navigate = useNavigate();
  const { slug, courseType } = useParams();
  const { slugMap, loading: contextLoading } = useCourses();

  useEffect(() => {
    if (!slug || !courseType || contextLoading) return;

    const key = `${courseType}/${slug}`;
    const foundCourse = slugMap[key];

    if (foundCourse) {
      setCourseData(foundCourse);
      setLoading(false);
    } else if (!contextLoading) {
      alert("Course not found.");
      navigate("/");
    }
  }, [slug, courseType, slugMap, contextLoading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0101] flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-[#dd2727] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!courseData) {
    return <div className="text-center mt-10 text-red-500">Course not found.</div>;
  }

  const currentUrl = window.location.href;
  const shareText = `Check out this course: ${courseData.title} - ${courseData.Subtitle}`;

  const shareArticle = () => {
    if (navigator.share) {
      navigator
        .share({
          title: courseData.title,
          text: shareText,
          url: currentUrl
        })
        .catch(console.error);
    } else {
      setShowShareOptions(!showShareOptions);
    }
  };

  const defaultFaqs = [
    { q: "Is this course live or recorded?", a: "This course primarily features high-quality recorded sessions, supplemented by live Q&A sessions with the instructor to ensure all your queries are resolved." },
    { q: "Do I get lifetime access?", a: "Yes! Once enrolled, you will have lifetime access to the course portal, including all future updates and study materials." },
    { q: "Will I receive a certificate?", a: "Absolutely. Upon completing all modules and assessments, you will receive a verified digital certificate from Vahlay Astro." }
  ];

  const getMetaTags = () => (
    <Helmet>
      <title>{courseData?.seoTitle || courseData.title}</title>
      <meta name="description" content={courseData?.seoDescription || courseData.Subtitle} />
    </Helmet>
  );

  const enrollUrl = user 
    ? (courseData.type === 'free' ? `/enrollfree/${courseData.id || slug}/${courseType}` : `/enroll/${courseData.id || slug}/${courseType}`) 
    : `/login?redirectTo=${encodeURIComponent(courseData.type === 'free' ? `/enrollfree/${courseData.id || slug}/${courseType}` : `/enroll/${courseData.id || slug}/${courseType}`)}`;

  return (
    <div className="min-h-screen bg-[#0a0101] text-white selection:bg-[#dd2727]/30 font-poppins">
      <Header />
      <div id="top-sentinel" className="h-0 w-full pt-[80px]"></div>
      {getMetaTags()}

      {/* Premium Hero Section */}
      <section className="relative min-h-[70vh] flex items-center pt-20 pb-32 overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src={courseData.imageUrl || courseData.bgImage} 
            alt="" 
            className="w-full h-full object-cover opacity-10 blur-2xl scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0101] via-transparent to-[#0a0101]"></div>
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#dd2727]/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="relative z-10 premium-container flex flex-col lg:flex-row justify-between items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8 text-center lg:text-left lg:max-w-[60%]"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mx-auto lg:mx-0">
              <span className="text-[#dd2727] text-[10px] font-black uppercase tracking-[0.4em]">Sacred Knowledge</span>
            </div>

            <h1 className="title-batangas text-5xl md:text-7xl leading-[1.1] text-white drop-shadow-2xl">
              {courseData.title}
            </h1>

            <p className="text-xl text-white/60 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {courseData.Subtitle || "Embark on a journey to master ancient cosmic wisdom and transform your life path."}
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4">
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 px-5 py-2.5 rounded-2xl">
                <div className="flex text-yellow-500 text-xs">
                  {[...Array(5)].map((_, i) => <FaStar key={i} />)}
                </div>
                <span className="text-sm font-bold text-white/90">4.9 (1.2k+ Students)</span>
              </div>
              
              <button 
                onClick={shareArticle}
                className="flex items-center gap-2 text-white/40 hover:text-[#dd2727] transition-all text-sm uppercase tracking-widest font-black"
              >
                <RiShareForwardFill className="text-xl" /> Share
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-[#dd2727]/20 to-purple-500/20 rounded-[3rem] blur-3xl opacity-50"></div>
            <div className="relative aspect-[4/3] max-w-[500px] mx-auto lg:ml-auto rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl group">
              <img 
                src={courseData.imageUrl || "/assets/hansal sir.jpg"} 
                alt={courseData.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8">
                 <Link to={enrollUrl}>
                    <button className="w-full py-5 rounded-2xl bg-[#dd2727] text-white font-black uppercase tracking-[0.3em] text-xs shadow-2xl hover:bg-white hover:text-[#dd2727] transition-all duration-500">
                      {courseData.type === 'free' ? 'Enroll Free' : 'Secure Seat'}
                    </button>
                 </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="relative z-20 -mt-16 px-6">
        <div className="premium-container grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#150a0a]/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
          {[
            { icon: <FaClock />, label: "Duration", val: "24 Sessions" },
            { icon: <FaUserGraduate />, label: "Level", val: "All Levels" },
            { icon: <FaBookOpen />, label: "Format", val: "Online Portal" },
            { icon: <FaCertificate />, label: "Certification", val: "Verified ID" }
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/[0.03] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-[#dd2727] text-xl">
                {stat.icon}
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">{stat.label}</p>
                <p className="font-bold text-white">{stat.val}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-32 px-6">
        <div className="premium-container flex flex-col lg:flex-row gap-24">
          <div className="flex-1 space-y-16">
            <div className="space-y-8">
              <h2 className="title-batangas text-4xl md:text-5xl">Curriculum of <br /><span className="text-[#dd2727]">Divine Wisdom</span></h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(courseData.description || "Divine knowledge awaits your arrival.").split(".").map((item, index) =>
                  item.trim() && (
                    <motion.div 
                      key={index}
                      whileHover={{ x: 10 }}
                      className="flex items-start gap-4 p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 hover:border-[#dd2727]/30 transition-all"
                    >
                      <FaCheckCircle className="text-[#dd2727] mt-1 shrink-0" />
                      <p className="text-white/80 leading-relaxed font-medium">{item.trim()}</p>
                    </motion.div>
                  )
                )}
              </div>
            </div>

            {/* Default Curriculum if none exists */}
            <div className="space-y-8">
              <h3 className="title-batangas text-3xl">Sacred Modules</h3>
              <div className="space-y-4">
                {["The Foundation of Vedic Thought", "Practical Remedies & Rituals", "The Art of Predictions", "Spiritual Growth & Ethics"].map((mod, i) => (
                   <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10 flex justify-between items-center group hover:bg-[#dd2727]/5 transition-all">
                      <div className="flex items-center gap-6">
                        <span className="text-2xl font-black text-white/10 group-hover:text-[#dd2727]/50">0{i+1}</span>
                        <h4 className="font-bold tracking-wide">{mod}</h4>
                      </div>
                      <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Module {i+1}</span>
                   </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="lg:w-[450px]">
            <div className="sticky top-32 space-y-8">
               <div className="p-10 rounded-[3rem] bg-gradient-to-br from-white/10 to-transparent border border-white/10 backdrop-blur-2xl relative overflow-hidden">
                  <h3 className="title-batangas text-2xl mb-8">What's Included</h3>
                  <ul className="space-y-6">
                    {[
                      "Lifetime Portal Access",
                      "Verified Digital Certificate",
                      "Exclusive Study Materials",
                      "Community Support Group",
                      "Expert Q&A Support"
                    ].map((f, i) => (
                      <li key={i} className="flex items-center gap-4 text-xs font-bold text-white/70 uppercase tracking-widest">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#dd2727]"></div>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link to={enrollUrl}>
                    <button className="w-full mt-12 py-5 rounded-2xl bg-white text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-[#dd2727] hover:text-white transition-all duration-500">
                      Join the Batch
                    </button>
                  </Link>
               </div>

               <div className="relative rounded-[3rem] overflow-hidden border border-white/10">
                  <img src="/assets/hansal sir.jpg" alt="Acharya Hansal" className="w-full h-full object-cover opacity-60" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  <div className="absolute bottom-8 left-8">
                    <p className="text-[10px] uppercase tracking-[0.4em] text-[#dd2727] font-black mb-1">Your Guru</p>
                    <p className="title-batangas text-2xl">Acharya Hansal Ji</p>
                  </div>
               </div>
            </div>
          </aside>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 px-6 bg-white/[0.01]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="title-batangas text-4xl md:text-5xl text-[#dd2727]">Essential Inquiries</h2>
            <p className="text-white/40 uppercase tracking-[0.3em] text-[10px] font-black mt-2">Resolving Your Cosmic Doubts</p>
          </div>
          <div className="space-y-4">
            {defaultFaqs.map((faq, i) => (
              <div key={i} className="rounded-2xl bg-white/[0.03] border border-white/5 overflow-hidden">
                <button 
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full flex justify-between items-center p-6 text-left hover:bg-white/[0.05] transition-colors"
                >
                  <span className="font-bold text-white/90">{faq.q}</span>
                  <FaChevronDown className={`text-[#dd2727] transition-transform duration-500 ${activeFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 text-white/50 leading-relaxed text-sm border-t border-white/5">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-6">
        <div className="premium-container">
          <div className="text-center mb-16">
            <h2 className="title-batangas text-4xl md:text-6xl">Student <span className="text-[#dd2727]">Insights</span></h2>
            <p className="text-white/30 uppercase tracking-[0.3em] text-xs font-black">Success from the Cosmic Path</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { q: "Finally, a course that respects the sacredness of the Vedas while keeping them applicable to modern challenges.", a: "Sarah Johnson", r: "Yoga Instructor" },
              { q: "This course transformed how I view the cosmos. Hansal Ji is a master of explaining complex concepts.", a: "Rajesh Kumar", r: "Enthusiast" },
              { q: "The practical remedies provided have brought immense peace to my family life.", a: "Anita Desai", r: "Homemaker" }
            ].map((t, i) => (
              <div key={i} className="p-10 rounded-[3rem] bg-white/[0.03] border border-white/5 hover:border-[#dd2727]/30 transition-all duration-500 group">
                <FaQuoteLeft className="text-3xl text-[#dd2727] opacity-20 mb-8 group-hover:opacity-100 transition-opacity" />
                <p className="text-white/70 italic leading-relaxed mb-8">"{t.q}"</p>
                <div>
                  <p className="font-bold text-white uppercase tracking-widest text-[10px] mb-1">{t.a}</p>
                  <p className="text-[#dd2727] font-black uppercase tracking-[0.2em] text-[10px]">{t.r}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CourseDetail;