
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "../../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
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

  const [isEnrolled, setIsEnrolled] = useState(false);

  const { slug, courseType } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { slugMap, loading: contextLoading } = useCourses();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      
      if (currentUser && slug) {
        // Check enrollment status
        try {
          const userRef = doc(db, "subscriptions", currentUser.email);
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            const courseId = slug; // The ID usually matches the slug or is passed in courseData
            
            const enrolledFree = userData.freecourses && userData.freecourses.includes(courseId);
            const enrolledPaid = userData.DETAILS && userData.DETAILS.some(d => Object.keys(d)[0] === courseId);
            
            if (enrolledFree || enrolledPaid) {
              setIsEnrolled(true);
            }
          }
        } catch (err) {
          console.error("Error checking enrollment:", err);
        }
      }
    });
    return () => unsubscribe();
  }, [slug]);

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
      <div className="min-h-screen flex justify-center items-center bg-transparent backdrop-blur-sm">
        
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

  const enrollUrl = isEnrolled 
    ? `/course/${encodeURIComponent(courseData.id || slug)}`
    : user 
      ? (courseData.type === 'free' ? `/enrollfree/${courseData.id || slug}/${courseType}` : `/enroll/${courseData.id || slug}/${courseType}`) 
      : `/login?redirectTo=${encodeURIComponent(courseData.type === 'free' ? `/enrollfree/${courseData.id || slug}/${courseType}` : `/enroll/${courseData.id || slug}/${courseType}`)}`;

  const enrollText = isEnrolled 
    ? 'Go to Course'
    : courseData.type === 'free' 
      ? 'Enroll Free' 
      : 'Secure Your Seat';

  return (
    <div className="text-white selection:bg-[#dd2727]/80 font-poppins bg-transparent">
      <Header />
      <div id="top-sentinel" className="h-0 w-full pt-[80px]"></div>
      {getMetaTags()}

      {/* Premium Hero Section */}
      <section className="relative flex items-center pt-10 pb-20 overflow-hidden">
        {/* Dynamic Background */}
        {/* Dynamic Background Removed to show GlobalBackground */}

        <div className="relative z-10 premium-container flex flex-col lg:flex-row justify-between items-center gap-12 lg:gap-20">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-10 text-center lg:text-left lg:flex-1"
          >

            <h1 className="title-batangas text-5xl md:text-7xl leading-[0.95] tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/40 drop-shadow-[0_0_30px_rgba(221,39,39,0.2)]">
              {courseData.title}
            </h1>

            <p className="text-xl md:text-2xl text-white/50 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-light">
              {courseData.Subtitle || "Embark on a journey to master ancient cosmic wisdom and transform your life path."}
            </p>

            {/* Social Proof / Avatar Stack */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
               <div className="flex -space-x-3 overflow-hidden">
                  {[1,2,3,4].map(i => (
                    <img 
                      key={i}
                      className="inline-block h-10 w-10 rounded-full ring-2 ring-black" 
                      src={`https://i.pravatar.cc/100?img=${i+10}`} 
                      alt="" 
                    />
                  ))}
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white/10 ring-2 ring-black backdrop-blur-md text-[10px] font-bold text-white/60">
                    +1k
                  </div>
               </div>
               <div className="text-sm font-medium text-white/40 tracking-wide">
                  <span className="text-white font-bold">1,200+</span> students already enrolled
               </div>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 pt-8">
               <Link to={enrollUrl} className="group/btn relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#dd2727] to-orange-500 rounded-full blur opacity-40 group-hover/btn:opacity-100 transition duration-1000 group-hover/btn:duration-200"></div>
                  <button className="relative px-10 py-4 bg-white text-black rounded-full font-black uppercase tracking-[0.2em] text-[11px] hover:bg-black hover:text-white transition-all duration-300">
                    {isEnrolled ? 'Open Course' : 'Join the Journey'}
                  </button>
               </Link>
              
               <button 
                 onClick={shareArticle}
                 className="flex items-center gap-3 text-white/40 hover:text-white transition-all text-[11px] uppercase tracking-[0.3em] font-black group/share"
               >
                 <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover/share:border-[#dd2727] group-hover/share:text-[#dd2727] transition-all">
                    <RiShareForwardFill className="text-lg" />
                 </div>
                 Share
               </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative lg:w-[45%] w-full max-w-[600px] flex flex-col gap-6"
          >
            <div className="relative rounded-[2.5rem] overflow-hidden border border-white/20 shadow-[0_0_50px_rgba(221,39,39,0.2)] group transition-all duration-700 hover:shadow-[0_0_80px_rgba(221,39,39,0.4)]">
              <img 
                src={courseData.imageUrl || "/src/assets/images/common/team/hansal sir.jpg"} 
                alt={courseData.title}
                className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-1000"
              />
            </div>
            
            <div className="w-full">
               <Link to={enrollUrl}>
                  <button className="w-full py-5 rounded-2xl bg-[#dd2727] text-white font-black uppercase tracking-[0.3em] text-xs shadow-2xl hover:bg-white hover:text-[#dd2727] transition-all duration-500 transform hover:-translate-y-1">
                    {enrollText}
                  </button>
               </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="relative z-20 -mt-16">
        <div className="premium-container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
            {[
              { icon: <FaClock />, label: "Duration", val: courseData.duration || "24 Sessions" },
              { icon: <FaUserGraduate />, label: "Level", val: courseData.level || "All Levels" },
              { icon: <FaBookOpen />, label: "Format", val: "Online Portal" },
              { icon: <FaCertificate />, label: "Certification", val: "Verified ID" }
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/[0.03] transition-colors group relative z-10">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-[#dd2727] text-xl group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(221,39,39,0.2)]">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40">{stat.label}</p>
                  <p className="font-bold text-white tracking-wide">{stat.val}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Highlights / Highlights Bar */}
      <section className="py-20 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee gap-20">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-20 items-center z-10">
              <span className="text-3xl md:text-5xl font-black uppercase tracking-[0.5em] text-white">Ancient Wisdom</span>
              <span className="text-3xl md:text-5xl font-black uppercase tracking-[0.5em] text-[#dd2727] italic">Personal Growth</span>
              <span className="text-3xl md:text-5xl font-black uppercase tracking-[0.5em] text-white Sacred Wisdom">Sacred Remedies</span>
              <span className="text-3xl md:text-5xl font-black uppercase tracking-[0.5em] text-[#dd2727] italic">Cosmic Laws</span>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-32">
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

            {/* Learning Journey (Experimental Layout) */}
            <div className="space-y-16 relative">
               <div className="absolute top-0 -right-20 w-64 h-64 bg-[#dd2727]/5 rounded-full blur-[80px] pointer-events-none"></div>
               <div className="flex items-center gap-6">
                  <div className="w-12 h-[1px] bg-[#dd2727]"></div>
                  <h3 className="title-batangas text-4xl">Your Cosmic <span className="text-[#dd2727]">Evolution</span></h3>
               </div>
               <div className="grid grid-cols-1 gap-12 relative pl-8">
                 <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-[#dd2727] via-white/10 to-transparent"></div>
                 {[
                   { t: "The Awakening", d: "Introduction to cosmic principles and the ancient foundations of astrology.", i: "01" },
                   { t: "Sacred Techniques", d: "Mastering the art of chart reading and understanding planetary influences.", i: "02" },
                   { t: "Divine Applications", d: "Learning practical remedies and life-changing rituals for various life situations.", i: "03" },
                   { t: "The Master's Path", d: "Advanced synthesis, professional ethics, and final certification process.", i: "04" }
                 ].map((step, i) => (
                   <motion.div 
                    key={i}
                    whileInView={{ opacity: 1, x: 0 }}
                    initial={{ opacity: 0, x: -20 }}
                    className="relative group flex gap-8 items-start"
                   >
                     <div className="text-4xl font-black text-white/5 group-hover:text-[#dd2727]/20 transition-all duration-500 mt-[-8px]">
                        {step.i}
                     </div>
                     <div>
                        <h4 className="font-bold text-2xl mb-3 group-hover:text-[#dd2727] transition-colors flex items-center gap-3">
                           {step.t}
                           <span className="w-2 h-2 rounded-full bg-[#dd2727] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                        </h4>
                        <p className="text-white/50 leading-relaxed max-w-xl font-light">{step.d}</p>
                     </div>
                   </motion.div>
                 ))}
               </div>
            </div>

            {/* Sacred Modules (Refined Bento Grid) */}
            <div className="space-y-12">
              <div className="flex items-end justify-between border-b border-white/5 pb-8">
                 <h3 className="title-batangas text-4xl md:text-5xl">Sacred <br /><span className="text-[#dd2727]">Modules</span></h3>
                 <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] hidden md:block">The Curriculum of Stars</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { t: "The Foundation of Vedic Thought", i: "✦", c: "Understanding the origins and the cosmic map." },
                  { t: "Practical Remedies & Rituals", i: "⚡", c: "Actionable steps to balance planetary energies." },
                  { t: "The Art of Predictions", i: "👁", c: "Synthesizing charts to see the unfolding destiny." },
                  { t: "Spiritual Growth & Ethics", i: "☯", c: "The responsibilities of a cosmic guide." }
                ].map((mod, i) => (
                   <div key={i} className="p-10 rounded-[2.5rem] bg-white/[0.03] backdrop-blur-xl border border-white/10 flex flex-col justify-between group hover:bg-white/[0.08] transition-all duration-500 shadow-2xl hover:-translate-y-2 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#dd2727]/20 to-transparent rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-150 transition-transform"></div>
                      <div className="relative z-10">
                        <div className="text-3xl mb-8 group-hover:scale-125 transition-transform origin-left">{mod.i}</div>
                        <h4 className="font-bold tracking-wide text-2xl leading-tight mb-4">{mod.t}</h4>
                        <p className="text-white/40 text-sm leading-relaxed mb-8">{mod.c}</p>
                      </div>
                      <div className="flex items-center gap-4 relative z-10">
                         <span className="text-[10px] font-black text-[#dd2727] uppercase tracking-widest">Module 0{i+1}</span>
                         <div className="h-px flex-1 bg-white/5"></div>
                         <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-all">→</div>
                      </div>
                   </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="lg:w-[450px]">
            <div className="sticky top-32 space-y-8">
                <div className="p-10 rounded-[3rem] bg-black/40 border border-white/10 backdrop-blur-2xl relative overflow-hidden shadow-2xl group">
                   <div className="absolute inset-0 bg-gradient-to-br from-[#dd2727]/5 to-transparent pointer-events-none"></div>
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

               <div className="relative rounded-[3rem] overflow-hidden border border-white/10 group h-[300px]">
                  <img src="/src/assets/images/common/team/hansal sir.jpg" alt="Acharya Hansal" className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                  <div className="absolute bottom-8 left-8 right-8">
                    <p className="text-[10px] uppercase tracking-[0.4em] text-[#dd2727] font-black mb-1">Your Guru</p>
                    <p className="title-batangas text-2xl">Acharya Hansal Ji</p>
                  </div>
               </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Who this is for? */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#dd2727]/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="premium-container relative z-10">
          <div className="text-center mb-20">
            <h2 className="title-batangas text-4xl md:text-7xl mb-4">Is This <span className="text-[#dd2727]">For You?</span></h2>
            <p className="text-white/40 uppercase tracking-[0.5em] text-[10px] font-black">Aligning with the Right Souls</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[
               { t: "Spiritual Seekers", d: "Those looking to understand the cosmic laws governing our lives and find deeper meaning.", i: "✦" },
               { t: "Aspiring Astrologers", d: "Individuals wanting a solid, authentic foundation in Vedic astrology to guide others.", i: "✧" },
               { t: "Practical Souls", d: "People seeking real, actionable remedies to overcome life's obstacles and find peace.", i: "❂" }
             ].map((item, i) => (
               <motion.div 
                 key={i} 
                 whileHover={{ y: -12 }}
                 className="p-12 rounded-[3.5rem] bg-black/40 backdrop-blur-2xl border border-white/10 text-center hover:bg-white/[0.05] hover:border-[#dd2727]/30 transition-all duration-500 group shadow-2xl relative overflow-hidden"
               >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#dd2727]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="w-24 h-24 rounded-[2rem] bg-white/[0.03] border border-white/5 flex items-center justify-center text-[#dd2727] text-4xl mx-auto mb-10 group-hover:scale-110 group-hover:bg-[#dd2727]/10 transition-all duration-500 shadow-inner">
                     {item.i}
                  </div>
                  <h4 className="title-batangas text-3xl mb-6 group-hover:text-[#dd2727] transition-colors">{item.t}</h4>
                  <p className="text-white/50 leading-relaxed text-lg font-light">{item.d}</p>
               </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* Certification Section */}
      <section className="py-32">
        <div className="premium-container flex flex-col md:flex-row items-center gap-20 bg-black/40 backdrop-blur-2xl rounded-[4rem] border border-white/10 p-12 md:p-24 overflow-hidden relative shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#dd2727]/10 rounded-full blur-[100px]"></div>
          <div className="flex-1 space-y-8 relative z-10 text-center md:text-left">
             <div className="inline-block px-4 py-1.5 rounded-full border border-[#dd2727]/30 bg-[#dd2727]/5">
                <span className="text-[#dd2727] text-[10px] font-black uppercase tracking-widest">Official Credentials</span>
             </div>
             <h2 className="title-batangas text-4xl md:text-6xl text-white">Verified <br /><span className="text-[#dd2727]">Certification</span></h2>
             <p className="text-white/60 text-lg leading-relaxed">
               Upon successful completion of the final assessment, you will receive a prestigious certificate from Vahlay Astro, signed by Acharya Hansal, validating your expertise in this sacred domain.
             </p>
             <ul className="space-y-4 inline-block md:block text-left">
                {["Industry Recognized", "Blockchain Verified", "Shareable on LinkedIn", "Print-Ready High Resolution"].map((p, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-white/80">
                     <FaCheckCircle className="text-[#dd2727]" /> {p}
                  </li>
                ))}
             </ul>
          </div>
          <div className="flex-1 relative z-10 w-full max-w-[500px]">
             <div className="aspect-[1.4/1] bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-4 md:p-8 relative transform rotate-3 hover:rotate-0 transition-transform duration-700">
                <div className="w-full h-full border border-[#dd2727]/20 rounded flex flex-col items-center justify-center gap-4 text-center p-8">
                   <div className="w-16 h-16 rounded-full bg-[#dd2727]/10 flex items-center justify-center text-3xl">𓁿</div>
                   <h3 className="title-batangas text-xl">Certificate of Completion</h3>
                   <div className="w-20 h-[1px] bg-[#dd2727]/40"></div>
                   <p className="text-[10px] text-white/40 uppercase tracking-[0.2em]">Awarded to</p>
                   <p className="font-bold text-white tracking-widest">[Your Name Here]</p>
                   <div className="mt-8 pt-8 border-t border-white/10 w-full flex justify-between">
                      <div className="text-[8px] text-white/20 uppercase">Signature</div>
                      <div className="text-[8px] text-white/20 uppercase italic">Acharya Hansal</div>
                   </div>
                </div>
                <div className="absolute top-4 right-4 text-[#dd2727] opacity-20 text-4xl">✦</div>
             </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 bg-transparent relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-[#dd2727]/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="title-batangas text-4xl md:text-6xl text-white">Essential <span className="text-[#dd2727]">Inquiries</span></h2>
            <p className="text-white/40 uppercase tracking-[0.4em] text-[10px] font-black mt-4">Resolving Your Cosmic Doubts</p>
          </div>
          <div className="space-y-6">
            {defaultFaqs.map((faq, i) => (
              <div 
                key={i} 
                className={`rounded-[2rem] transition-all duration-500 border ${
                  activeFaq === i 
                    ? 'bg-white/[0.08] border-[#dd2727]/30 shadow-[0_20px_50px_rgba(0,0,0,0.3)]' 
                    : 'bg-black/40 border-white/10 hover:border-white/20'
                } backdrop-blur-2xl overflow-hidden`}
              >
                <button 
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full flex justify-between items-center p-8 text-left group"
                >
                  <span className={`font-bold text-lg md:text-xl tracking-wide transition-colors ${activeFaq === i ? 'text-white' : 'text-white/70 group-hover:text-white'}`}>
                    {faq.q}
                  </span>
                  <div className={`w-10 h-10 rounded-full border border-white/10 flex items-center justify-center transition-all duration-500 ${activeFaq === i ? 'bg-[#dd2727] border-[#dd2727] rotate-180' : 'group-hover:border-[#dd2727]'}`}>
                    <FaChevronDown className={`text-xs transition-colors ${activeFaq === i ? 'text-white' : 'text-[#dd2727]'}`} />
                  </div>
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-8 pt-0 text-white/50 leading-relaxed text-base border-t border-white/5 font-light">
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
      <section className="py-32 bg-transparent relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#dd2727]/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="premium-container relative z-10">
          <div className="text-center mb-20">
            <h2 className="title-batangas text-4xl md:text-7xl">Student <span className="text-[#dd2727]">Insights</span></h2>
            <p className="text-white/30 uppercase tracking-[0.5em] text-[10px] font-black mt-4">Voices from the Cosmic Journey</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { q: "Finally, a course that respects the sacredness of the Vedas while keeping them applicable to modern challenges.", a: "Sarah Johnson", r: "Yoga Instructor", i: "https://i.pravatar.cc/100?img=32" },
              { q: "This course transformed how I view the cosmos. Hansal Ji is a master of explaining complex concepts.", a: "Rajesh Kumar", r: "Enthusiast", i: "https://i.pravatar.cc/100?img=44" },
              { q: "The practical remedies provided have brought immense peace to my family life.", a: "Anita Desai", r: "Homemaker", i: "https://i.pravatar.cc/100?img=47" }
            ].map((t, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="p-10 rounded-[3rem] bg-black/40 backdrop-blur-2xl border border-white/10 hover:border-[#dd2727]/30 transition-all duration-500 group relative flex flex-col justify-between shadow-2xl"
              >
                <div className="absolute top-10 right-10 text-6xl text-[#dd2727]/10 group-hover:text-[#dd2727]/20 transition-colors pointer-events-none font-serif">“</div>
                
                <div className="space-y-6 relative z-10">
                  <FaQuoteLeft className="text-3xl text-[#dd2727] opacity-40 group-hover:opacity-100 transition-opacity" />
                  <p className="text-white/80 text-lg leading-relaxed font-light italic">
                    "{t.q}"
                  </p>
                </div>

                <div className="mt-12 flex items-center gap-4 relative z-10 border-t border-white/5 pt-8">
                  <img src={t.i} alt={t.a} className="w-12 h-12 rounded-full border-2 border-white/10 group-hover:border-[#dd2727]/50 transition-all" />
                  <div>
                    <p className="font-bold text-white uppercase tracking-[0.2em] text-[10px]">{t.a}</p>
                    <p className="text-[#dd2727] font-black uppercase tracking-[0.3em] text-[9px] mt-1">{t.r}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20">
        <div className="premium-container">
           <div className="bg-[#dd2727]/50 rounded-[3rem] p-10 md:p-16 text-center relative overflow-hidden shadow-[0_20px_60px_rgba(221,39,39,0.2)]">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent opacity-10 mix-blend-overlay"></div>
              <div className="relative z-10 space-y-10">
                 <h2 className="title-batangas text-3xl md:text-5xl text-white">Join the <br /> Sacred Community</h2>
                 <p className="text-white/80 text-base max-w-xl mx-auto leading-relaxed">
                   Connect with like-minded souls on the same spiritual path. Share insights, participate in live discussions, and grow together in our exclusive student portal.
                 </p>
                 <div className="flex flex-wrap justify-center gap-12 pt-8">
                    {[
                      { l: "Active Students", v: "15,000+" },
                      { l: "Daily Discussions", v: "200+" },
                      { l: "Success Stories", v: "1,200+" }
                    ].map((s, i) => (
                      <div key={i} className="text-center">
                         <p className="text-3xl md:text-4xl font-black text-white mb-2">{s.v}</p>
                         <p className="text-[10px] uppercase tracking-[0.4em] text-white/60 font-black">{s.l}</p>
                      </div>
                    ))}
                 </div>
                 <div className="pt-12">
                   <Link to={enrollUrl}>
                      <button className="px-16 py-6 rounded-full bg-white text-[#dd2727] font-black uppercase tracking-[0.3em] text-xs hover:bg-black hover:text-white transition-all duration-500 shadow-2xl scale-110">
                        Enroll in Course
                      </button>
                   </Link>
                 </div>
              </div>
           </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CourseDetail;

