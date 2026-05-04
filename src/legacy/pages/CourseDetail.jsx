import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useParams } from "react-router-dom";
import { RiShareForwardFill } from "react-icons/ri";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaWhatsapp, FaEnvelope, FaTelegram, FaRedditAlien, FaPinterestP } from "react-icons/fa";
import { useCourses } from "../../context/CoursesContext";
import { Helmet } from "react-helmet-async";
import Header from "../../components/sections/Header/Header";
import Footer from "../../components/sections/Footer/Footer";



const CourseDetail = () => {
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showShareOptions, setShowShareOptions] = useState(false);

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
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-500"></div>
      </div>
    );
  }

  if (!courseData) {
    return <div className="text-center mt-10 text-red-500">Course not found.</div>;
  }

  // Function to share the article
  const currentUrl = window.location.href;
  const imageUrl = courseData.imageUrl || "/assets/default-course.jpg";
  const shareText = `Check out this course: ${courseData.title} - ${courseData.Subtitle}`;

  const shareArticle = () => {
    if (navigator.share) {
      navigator
        .share({
          title: courseData.title,
          text: shareText,
          url: currentUrl
        })
        .then(() => console.log("Course shared successfully!"))
        .catch((error) => console.error("Error sharing course:", error));
    } else {
      setShowShareOptions(!showShareOptions);
    }
  };
   const getMetaTags = () => {
      if (!courseData) return null;
      
      return (
        <Helmet>
          <title>{courseData?.seoTitle || 'Default Title'}</title>
          <meta name="description" content={courseData?.seoDescription || 'Default description'} />
          <meta
            name="keywords"
            content={
              Array.isArray(courseData?.seoKeywords)
                ? courseData.seoKeywords.join(', ')
                : courseData?.seoKeywords || 'default, keywords'
            }
          />
        </Helmet>
  
      );
    };
  return (
    <div className="min-h-screen bg-[#0a0101] text-white selection:bg-[#dd2727]/30">
      <Header />
      <div id="top-sentinel" className="h-0 w-full pt-[80px]"></div>
      {getMetaTags()}

      {/* Premium Hero Banner */}
      <section className="relative w-full min-h-[60vh] flex items-center overflow-hidden">
        {/* Dynamic Background with Glow */}
        <div className="absolute inset-0 z-0">
          <img 
            src={courseData.imageUrl || courseData.bgImage} 
            alt="" 
            className="w-full h-full object-cover opacity-20 blur-xl scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0101] via-transparent to-[#0a0101]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-12">
          {/* Left: Course Info */}
          <div className="flex-1 space-y-8 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#dd2727]/30 bg-[#dd2727]/5">
              <span className="text-[#dd2727] text-[10px] font-black uppercase tracking-[0.4em]">Sacred Knowledge</span>
            </div>

            <h1 className="title-batangas text-4xl md:text-6xl font-black leading-[1.1] text-white drop-shadow-2xl">
              {courseData.title}
            </h1>

            <p className="subtitle-poppins text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed">
              {courseData.Subtitle || "Embark on a journey to master ancient cosmic wisdom and transform your life path."}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-4">
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl">
                <div className="flex text-[#dd2727]">
                  {"★★★★★".split("").map((s, i) => <span key={i}>{s}</span>)}
                </div>
                <span className="text-sm font-bold text-white/90">4.9 (1.2k+ Students)</span>
              </div>
              
              <button 
                onClick={shareArticle}
                className="flex items-center gap-2 text-white/50 hover:text-[#dd2727] transition-colors duration-300 text-sm uppercase tracking-widest font-bold"
              >
                <RiShareForwardFill className="text-xl" /> Share Wisdom
              </button>
            </div>
          </div>

          {/* Right: Premium Image Frame */}
          <div className="relative md:w-[400px] shrink-0 group">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#dd2727]/20 to-purple-500/20 rounded-[2.5rem] blur-2xl group-hover:opacity-100 transition-opacity duration-700 opacity-50"></div>
            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
              <img 
                src={courseData.imageUrl || "/assets/hansal sir.jpg"} 
                alt={courseData.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Features Bar */}
      <section className="relative z-20 -mt-10 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-1 bg-[#150a0a]/80 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-4 p-8 border-b md:border-b-0 md:border-r border-white/5 hover:bg-white/[0.02] transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-[#dd2727]/10 flex items-center justify-center text-[#dd2727]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider">24 Sacred Sessions</h4>
              <p className="text-xs text-white/50">Live + Recorded Q&A</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-8 border-b md:border-b-0 md:border-r border-white/5 hover:bg-white/[0.02] transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-[#dd2727]/10 flex items-center justify-center text-[#dd2727]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider">Self-Paced Mastery</h4>
              <p className="text-xs text-white/50">Lifetime Portal Access</p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 p-8 hover:bg-white/[0.02] transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#dd2727]/10 flex items-center justify-center text-[#dd2727]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider">{courseData.type === 'free' ? 'Free Access' : 'Verified Cert'}</h4>
                <p className="text-xs text-white/50">Secure Enrollment</p>
              </div>
            </div>
            {authLoading ? (
               <div className="w-8 h-8 rounded-full border-2 border-[#dd2727]/30 border-t-[#dd2727] animate-spin"></div>
            ) : (
              <Link to={user ? (courseData.type === 'free' ? `/enrollfree/${courseData.id || slug}/${courseType}` : `/enroll/${courseData.id || slug}/${courseType}`) : `/login?redirectTo=${encodeURIComponent(courseData.type === 'free' ? `/enrollfree/${courseData.id || slug}/${courseType}` : `/enroll/${courseData.id || slug}/${courseType}`)}`}>
                <button className="bg-[#dd2727] text-white text-[10px] font-black uppercase tracking-[0.2em] px-6 py-3 rounded-xl hover:bg-white hover:text-[#dd2727] transition-all duration-300">
                  {courseData.type === 'free' ? 'Get Free' : 'Enroll Now'}
                </button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20">
          {/* Left: Syllabus/Topics */}
          <div className="flex-1">
            <h2 className="title-batangas text-3xl md:text-5xl mb-12">
              Curriculum of <br /><span className="text-[#dd2727]">Divine Wisdom</span>
            </h2>
            
            <div className="space-y-4">
              {courseData.description?.split(".").map((item, index) =>
                item.trim() ? (
                  <div key={index} className="group flex items-start gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#dd2727]/30 hover:bg-white/[0.05] transition-all duration-500">
                    <div className="mt-1 w-5 h-5 rounded-full border border-[#dd2727] flex items-center justify-center shrink-0 group-hover:bg-[#dd2727] transition-colors">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#dd2727] group-hover:bg-white"></div>
                    </div>
                    <p className="subtitle-poppins text-lg text-white/80 leading-relaxed">
                      {item.trim()}
                    </p>
                  </div>
                ) : null
              )}
            </div>
          </div>

          {/* Right: Expert Guidance Card */}
          <div className="lg:w-[450px] space-y-8">
            <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 backdrop-blur-xl">
              <h3 className="title-batangas text-2xl mb-6 text-white">How You Learn</h3>
              <p className="subtitle-poppins text-white/60 mb-8 leading-relaxed">
                Experience hands-on guidance from industry luminaries. Our unique methodology blends ancient Vedic principles with modern practical application.
              </p>
              
              <ul className="space-y-4">
                {['Industry Experts', 'Practical Labs', 'Community Access', 'Vedic Insights'].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-bold text-white/90">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#dd2727]"></div> {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10">
              <img src={courseData.imageUrl} alt="" className="w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0101] via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8">
                <p className="text-[10px] uppercase tracking-[0.4em] text-[#dd2727] font-black mb-2">Next Batch Starting</p>
                <p className="title-batangas text-2xl">Register Today</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="title-batangas text-3xl md:text-5xl mb-4">Voice of the <span className="text-[#dd2727]">Enlightened</span></h2>
            <p className="subtitle-poppins text-white/50 tracking-widest uppercase text-xs font-black">Student Success Stories</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { q: "This course helped me land my first job in business analysis!", a: "John Doe", r: "Business Analyst" },
              { q: "A great resource for anyone looking to upskill quickly.", a: "Jane Smith", r: "Vedic Scholar" },
              { q: "The guided project was very practical and easy to follow.", a: "Alex Taylor", r: "Professional Astrologer" }
            ].map((t, index) => (
              <div key={index} className="p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:border-[#dd2727]/20 transition-all duration-500">
                <div className="text-4xl text-[#dd2727] mb-6 opacity-30">“</div>
                <p className="subtitle-poppins text-white/70 italic mb-8 leading-relaxed">
                  {t.q}
                </p>
                <div>
                  <p className="font-bold text-white tracking-widest uppercase text-[10px] mb-1">{t.a}</p>
                  <p className="text-[#dd2727] text-[10px] font-black tracking-widest uppercase">{t.r}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 text-center px-6">
        <div className="max-w-3xl mx-auto space-y-10">
          <h2 className="title-batangas text-4xl md:text-6xl leading-tight">
            Begin Your <span className="text-[#dd2727]">Transformation</span> Today
          </h2>
          
          <div className="flex justify-center">
            {authLoading ? (
              <div className="w-12 h-12 rounded-full border-2 border-[#dd2727]/30 border-t-[#dd2727] animate-spin"></div>
            ) : (
              <Link to={user ? (courseData.type === 'free' ? `/enrollfree/${courseData.id || slug}/${courseType}` : `/enroll/${courseData.id || slug}/${courseType}`) : `/login?redirectTo=${encodeURIComponent(courseData.type === 'free' ? `/enrollfree/${courseData.id || slug}/${courseType}` : `/enroll/${courseData.id || slug}/${courseType}`)}`}>
                <button className="bg-[#dd2727] text-white px-12 py-5 rounded-full font-black uppercase tracking-[0.3em] text-sm hover:bg-white hover:text-[#dd2727] hover:scale-105 transition-all duration-500 shadow-[0_15px_50px_rgba(221,39,39,0.4)]">
                  {courseData.type === "free" ? "Enroll for Free" : "Claim Your Spot"}
                </button>
              </Link>
            )}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default CourseDetail;