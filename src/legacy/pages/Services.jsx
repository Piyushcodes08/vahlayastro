import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../../components/sections/Header/Header";
import Footer from "../../components/sections/Footer/Footer";
import courseImg from "../../assets/images/pages/courses/courses.jpg";
import consultingImg from "../../assets/images/pages/consulting/consulting.webp";
import articlesImg from "../../assets/images/pages/blogs/books.webp";

const Services = () => {
  const services = [
    {
      title: "Sacred Courses",
      img: courseImg,
      description: "Dive deep into the ancient knowledge of Astrology through our comprehensive courses designed for modern seekers.",
      link: "/courses",
      icon: "📚"
    },
    {
      title: "Cosmic Consultation",
      img: consultingImg,
      description: "Get personalized guidance and planetary insights through one-on-one sessions with our expert astrologers.",
      link: "/consulting",
      icon: "🧘"
    },
    {
      title: "Celestial Articles",
      img: articlesImg,
      description: "Explore a vast library of celestial wisdom and planetary insights through our curated spiritual articles.",
      link: "/articles",
      icon: "📜"
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <Header />

      <main className="flex-1 relative z-10">
        {/* Hero Section - Matching Landing Page Style */}
        <section className="relative h-[100dvh] flex items-center overflow-hidden text-center">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="flex flex-col items-center"
            >
              <span className="text-[#dd2727] font-black uppercase tracking-[0.5em] text-[10px] mb-6 block bg-red-600/10 px-4 py-2 rounded-full border border-red-600/20 backdrop-blur-sm">
                Sacred Portfolio
              </span>
              <h1 className="text-5xl md:text-8xl font-black text-white leading-[1.1] mb-8 uppercase tracking-tighter">
                Explore Our <br />
                <span className="text-[#dd2727]">Divine Services</span>
              </h1>
              <p className="text-gray-400 text-lg md:text-xl max-w-3xl leading-relaxed font-medium">
                We offer a wide range of astrology-based solutions to help you navigate
                life's cosmic path with clarity, purpose, and spiritual wisdom.
              </p>
            </motion.div>
          </div>

          {/* Decorative Elements matching landing page */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/10 rounded-full blur-[150px] pointer-events-none z-0"></div>
        </section>

        {/* Services Grid Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-12"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  className="group relative"
                  variants={cardVariants}
                >
                  {/* Glassmorphic Card */}
                  <div className="relative bg-white/5 backdrop-blur-md rounded-[3rem] border border-white/10 overflow-hidden h-full flex flex-col shadow-2xl transition-all duration-500 hover:border-red-600/50 hover:bg-white/10 group-hover:-translate-y-4">

                    {/* Image Area */}
                    <div className="relative h-72 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent z-10"></div>
                      <img
                        src={service.img}
                        alt={service.title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute top-6 left-8 z-20">
                        <span className="w-12 h-12 flex items-center justify-center bg-[#dd2727] text-2xl rounded-2xl shadow-xl transform -rotate-12 group-hover:rotate-0 transition-transform duration-500">
                          {service.icon}
                        </span>
                      </div>
                      <div className="absolute bottom-6 left-8 z-20">
                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-none mb-1">
                          {service.title.split(' ')[0]} <br />
                          <span className="text-[#dd2727]">{service.title.split(' ')[1]}</span>
                        </h3>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-10 flex flex-col flex-1">
                      <p className="text-gray-400 leading-relaxed mb-10 font-medium text-lg">
                        {service.description}
                      </p>

                      <div className="mt-auto">
                        <Link
                          to={service.link}
                          className="flex items-center justify-center gap-3 w-full py-5 bg-[#dd2727] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white hover:text-black transition-all shadow-[0_10px_40px_-10px_rgba(221,39,39,0.5)] active:scale-95"
                        >
                          Continue Path
                          <svg className="w-4 h-4 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Red Glow Background Effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-[3rem] blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Large Background Text */}
          <div className="absolute top-0 right-0 text-[20vw] font-black text-white/[0.02] leading-none select-none -z-10 tracking-tighter translate-x-1/4 translate-y-1/4">
            VAHLAY
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-r from-[#dd2727] to-[#b91c1c] rounded-[4rem] p-12 md:p-20 text-center relative overflow-hidden group shadow-2xl">
              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-black text-white mb-8 uppercase tracking-tighter">Ready to Begin Your <br /> <span className="text-white/60">Celestial Journey?</span></h2>
                <Link to="/contact" className="inline-block px-12 py-5 bg-white text-[#dd2727] rounded-2xl font-black uppercase tracking-[0.3em] text-xs hover:shadow-2xl transition-all hover:-translate-y-1 active:scale-95">
                  Book a Consultation
                </Link>
              </div>

              {/* Animated Background Sparkles */}
              <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-black/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Services;

