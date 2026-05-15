
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../sections/Header/Header";
import Footer from "../sections/Footer/Footer";
import { motion, AnimatePresence } from "framer-motion";
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

const PremiumCourseLayout = ({ 
  title, 
  subtitle, 
  heroImage, 
  instructorImage = "/src/assets/images/common/team/hansal sir.jpg",
  rating = "4.9",
  reviews = "120+",
  duration = "24 Sessions",
  level = "Beginner to Advanced",
  language = "Hindi / English",
  whatYouWillLearn = [],
  curriculum = [],
  faqs = [],
  enrollLink,
  isFree = false,
  description = ""
}) => {
  const [activeFaq, setActiveFaq] = useState(null);

  return (
    <div className="min-h-screen bg-[#0a0101] text-white selection:bg-brand-red/30 font-poppins overflow-x-hidden">
      <Header />
      <div id="top-sentinel" className="h-0 w-full pt-[80px]"></div>

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center pt-20 pb-32">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="" 
            className="w-full h-full object-cover opacity-10 blur-2xl scale-125"
          />
          <div className="absolute inset-0 bg-linear-to-b from-[#0a0101] via-transparent to-[#0a0101]"></div>
          {/* Subtle Red/Gold Glows */}
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-red/10 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#b0a102]/10 rounded-full blur-[120px] pointer-events-none"></div>
        </div>

        <div className="relative z-10 premium-container flex flex-col lg:flex-row justify-between items-center gap-16 pt-[50px]">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8 lg:max-w-[60%]"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
              <span className="flex text-brand-red gap-0.5">
                {[...Array(5)].map((_, i) => <FaStar key={i} size={10} />)}
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">Premium Vedic Education</span>
            </div>

            <h1 className="title-batangas text-5xl md:text-7xl leading-[1.1] text-white">
              {title}
            </h1>

            <p className="text-xl text-white/60 leading-relaxed max-w-xl">
              {subtitle || "Unveil the ancient secrets of Vedic wisdom through our comprehensive, professionally guided curriculum."}
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-4">
              <Link to={enrollLink}>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 rounded-full bg-[#dd2727] text-white font-black uppercase tracking-[0.3em] text-sm shadow-[0_15px_40px_rgba(221,39,39,0.3)] hover:bg-white hover:text-[#dd2727] transition-all duration-500"
                >
                  {isFree ? "Start Learning Free" : "Secure Your Seat"}
                </motion.button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0a0101] bg-gray-800 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?u=${i + title}`} alt="" loading="lazy" />
                    </div>
                  ))}
                </div>
                <span className="text-sm font-bold text-white/40 tracking-widest uppercase">{reviews} Enrolled</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-linear-to-r from-brand-red/30 to-[#b0a102]/30 rounded-[3rem] blur-3xl opacity-30 animate-pulse"></div>
            <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl aspect-4/3 max-w-[500px] mx-auto lg:ml-auto">
              <img 
                src={heroImage} 
                alt={title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8 p-6 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-red mb-2">Sacred Mastery</p>
                <p className="text-sm text-white/70 italic leading-relaxed">
                  "This journey is not just about knowledge, but about personal transformation."
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="relative z-10 -mt-20 px-6">
        <div className="premium-container grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#150a0a]/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
          {[
            { icon: <FaClock />, label: "Duration", val: duration },
            { icon: <FaUserGraduate />, label: "Level", val: level },
            { icon: <FaBookOpen />, label: "Language", val: language },
            { icon: <FaCertificate />, label: "Outcome", val: isFree ? "Access" : "Verified Cert" }
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/3 transition-colors border border-transparent hover:border-white/5">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-brand-red text-xl">
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

      {/* Overview & Outcomes */}
      <section className="py-32 px-6">
        <div className="premium-container flex flex-col lg:flex-row gap-24">
          <div className="flex-1 space-y-12">
            <div>
              <h2 className="title-batangas text-4xl md:text-5xl mb-8">Course <span className="text-brand-red">Overview</span></h2>
              <div className="prose prose-invert prose-lg max-w-none text-white/70 leading-relaxed space-y-6">
                <p>{description || "Dive deep into the metaphysical realms of Vedic science. This course is meticulously designed to bridge the gap between ancient spiritual texts and modern life applications."}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
              {whatYouWillLearn.map((item, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ x: 10 }}
                  className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-[#dd2727]/30 transition-all"
                >
                  <FaCheckCircle className="text-brand-red mt-1 shrink-0" />
                  <span className="text-white/80 font-medium">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="lg:w-[450px]">
            <div className="sticky top-32 space-y-8">
              <div className="p-10 rounded-[3rem] bg-gradient-to-br from-white/10 to-transparent border border-white/10 backdrop-blur-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-40 h-40 bg-[#dd2727]/10 rounded-full blur-3xl"></div>
                <h3 className="title-batangas text-2xl mb-8">The Experience</h3>
                <ul className="space-y-6">
                  {[
                    "Live Interactive Q&A Sessions",
                    "Downloadable Sacred Resources",
                    "Personal Mentorship Path",
                    "Private Community Access",
                    "Lifetime Portal Updates"
                  ].map((feat, i) => (
                    <li key={i} className="flex items-center gap-4 text-sm font-bold text-white/80 uppercase tracking-widest">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-red"></div>
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link to={enrollLink}>
                  <button className="w-full mt-10 py-4 rounded-xl bg-white text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-brand-red hover:text-white transition-all duration-500">
                    Get Started Today
                  </button>
                </Link>
              </div>

              <div className="relative rounded-[3rem] overflow-hidden border border-white/10 aspect-video group">
                <img src={instructorImage} alt="Instructor" loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-red mb-1">Guided By</p>
                  <p className="title-batangas text-xl">Acharya Hansal Ji</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Section */}
      {curriculum.length > 0 && (
        <section className="py-32 px-6 bg-white/2">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="title-batangas text-4xl md:text-6xl mb-6">Course <span className="text-brand-red">Curriculum</span></h2>
              <p className="text-white/40 uppercase tracking-[0.3em] text-xs font-black">Path to Enlightenment</p>
            </div>

            <div className="space-y-6">
              {curriculum.map((item, i) => (
                <div key={i} className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-brand-red/30 transition-all">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-6">
                      <span className="text-2xl font-black text-white/10 group-hover:text-brand-red/50 transition-colors">0{i+1}</span>
                      <h4 className="text-xl font-bold text-white/90">{item.title}</h4>
                    </div>
                    {item.duration && <span className="text-xs font-black text-white/30 uppercase tracking-widest">{item.duration}</span>}
                  </div>
                  {item.content && (
                    <p className="mt-4 text-white/50 leading-relaxed text-sm">
                      {item.content}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {faqs.length > 0 && (
        <section className="py-32 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="title-batangas text-4xl md:text-5xl mb-6 text-brand-red">Common Inquiries</h2>
              <p className="text-white/40 uppercase tracking-[0.2em] text-[10px] font-black">Resolving Cosmic Doubts</p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="rounded-2xl bg-white/3 border border-white/5 overflow-hidden">
                  <button 
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                    className="w-full flex justify-between items-center p-6 text-left hover:bg-white/2 transition-colors"
                  >
                    <span className="font-bold text-white/90">{faq.q}</span>
                    <FaChevronDown className={`text-brand-red transition-transform duration-500 ${activeFaq === i ? 'rotate-180' : ''}`} />
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
      )}

      {/* Certification Section */}
      <section className="py-32 px-6">
        <div className="premium-container p-12 md:p-20 rounded-[4rem] bg-linear-to-br from-brand-red/10 to-transparent border border-brand-red/20 flex flex-col md:flex-row items-center gap-16 relative overflow-hidden">
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-brand-red/5 rounded-full blur-[100px]"></div>
          <div className="flex-1 text-center md:text-left space-y-8 relative z-10">
            <h2 className="title-batangas text-4xl md:text-6xl">Vedic <span className="text-brand-red">Certification</span></h2>
            <p className="text-white/60 leading-relaxed text-lg">
              Upon successful completion of the {title}, you will receive a verified digital certificate. This credential honors your dedication to sacred knowledge and serves as a testament to your expertise in Vedic traditions.
            </p>
            <div className="flex items-center gap-6 justify-center md:justify-start">
              <div className="text-center">
                <p className="text-3xl font-black text-white">100%</p>
                <p className="text-[10px] font-bold text-brand-red uppercase tracking-widest">Verified</p>
              </div>
              <div className="w-px h-10 bg-white/10"></div>
              <div className="text-center">
                <p className="text-3xl font-black text-white">Sharable</p>
                <p className="text-[10px] font-bold text-brand-red uppercase tracking-widest">Digital ID</p>
              </div>
            </div>
          </div>
          <div className="md:w-1/3 relative group">
            <div className="absolute inset-0 bg-white/20 blur-3xl opacity-0 group-hover:opacity-30 transition-opacity"></div>
            <img src="/src/assets/images/common/team/hansal sir.jpg" alt="Certificate" loading="lazy" className="w-full rounded-2xl shadow-2xl border border-white/20 grayscale group-hover:grayscale-0 transition-all duration-700 rotate-3 group-hover:rotate-0" />
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-32 px-6">
        <div className="premium-container">
          <div className="text-center mb-20">
            <h2 className="title-batangas text-4xl md:text-6xl mb-6">Student <span className="text-brand-red">Echoes</span></h2>
            <p className="text-white/40 uppercase tracking-[0.3em] text-xs font-black">Life-Changing Results</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { q: "This course transformed how I view the cosmos. Hansal Ji is a master of explaining complex concepts with simplicity.", a: "Priya Sharma", r: "Professional Astrologer" },
              { q: "The practical remedies provided in the sessions have already brought immense peace to my family life.", a: "Amit Patel", r: "Business Owner" },
              { q: "Finally, a course that respects the sacredness of the Vedas while keeping them applicable to modern challenges.", a: "Sarah Johnson", r: "Yoga Instructor" }
            ].map((t, i) => (
              <div key={i} className="p-10 rounded-[3rem] bg-white/3 border border-white/5 hover:border-brand-red/30 transition-all duration-500 group">
                <FaQuoteLeft className="text-3xl text-brand-red opacity-20 mb-8 group-hover:opacity-100 transition-opacity" />
                <p className="text-white/70 italic leading-relaxed mb-8">"{t.q}"</p>
                <div>
                  <p className="font-bold text-white uppercase tracking-widest text-[10px] mb-1">{t.a}</p>
                  <p className="text-brand-red font-black uppercase tracking-[0.2em] text-[10px]">{t.r}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-radial-gradient from-brand-red/10 to-transparent blur-[150px] opacity-50"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-12">
          <h2 className="title-batangas text-5xl md:text-8xl leading-tight">Begin Your <br /><span className="text-brand-red">Sacred Path</span></h2>
          <p className="text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
            Don't just learn. Transform. Join thousands of students who have embarked on this journey toward cosmic enlightenment.
          </p>
          <Link to={enrollLink}>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-16 py-6 rounded-full bg-brand-red text-white font-black uppercase tracking-[0.4em] text-sm shadow-[0_20px_50px_rgba(221,39,39,0.5)] hover:bg-white hover:text-brand-red transition-all duration-700"
            >
              Enroll Now
            </motion.button>
          </Link>
          <p className="text-white/30 text-[10px] uppercase tracking-[0.4em] font-black pt-4">Limited Cosmic Slots Available</p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PremiumCourseLayout;

