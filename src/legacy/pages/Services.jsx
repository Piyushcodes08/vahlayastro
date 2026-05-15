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
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <Header />

      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="relative min-h-[70vh] flex items-center pt-24 pb-12 overflow-hidden hero-section">
          <div className="bg-glow-container">
            <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-glow-red opacity-40"></div>
            <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-glow-gold opacity-10"></div>
          </div>

          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="flex flex-col items-center text-center space-y-8"
            >
              <div className="inline-block px-6 py-1.5 rounded-full border border-[#dd2727]/30 bg-[#dd2727]/5">
                <span className="text-[#dd2727] text-[10px] font-black uppercase tracking-[0.4em]">
                  Sacred Portfolio
                </span>
              </div>
              
              <h1 className="title-batangas text-5xl md:text-8xl text-white leading-[1.1] drop-shadow-2xl">
                Explore Our <br />
                <span className="text-[#dd2727]">Divine Services</span>
              </h1>
              
              <p className="subtitle-poppins text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed font-medium">
                We offer a wide range of astrology-based solutions to help you navigate
                life's cosmic path with clarity, purpose, and spiritual wisdom.
              </p>

              {/* Red Dot Divider */}
              <div className="flex items-center justify-center gap-4 pt-4">
                  <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-white/10"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#dd2727] shadow-[0_0_15px_#dd2727]"></div>
                  <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-white/10"></div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Services Grid Section */}
        <section className="relative overflow-hidden no-full-height">
          <div className="section-container">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
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
                  <div className="relative bg-white/[0.03] backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden h-full flex flex-col shadow-2xl transition-all duration-700 hover:border-[#dd2727]/50 hover:bg-white/[0.08] hover:-translate-y-2">

                    {/* Image Area */}
                    <div className="relative h-64 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent z-10"></div>
                      <img
                        src={service.img}
                        alt={service.title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute top-6 left-6 z-20">
                        <div className="w-10 h-10 flex items-center justify-center bg-[#dd2727] text-xl rounded-lg shadow-xl transform -rotate-6 group-hover:rotate-0 transition-transform duration-500">
                          {service.icon}
                        </div>
                      </div>
                      <div className="absolute bottom-6 left-6 z-20">
                        <h3 className="title-batangas text-2xl text-white leading-none">
                          {service.title.split(' ')[0]} <br />
                          <span className="text-[#dd2727]">{service.title.split(' ').slice(1).join(' ')}</span>
                        </h3>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-8 flex flex-col flex-1">
                      <p className="subtitle-poppins text-white/50 leading-relaxed mb-8 font-medium text-base">
                        {service.description}
                      </p>

                      <div className="mt-auto">
                        <Link
                          to={service.link}
                          className="flex items-center justify-center gap-3 w-full py-4 bg-[#dd2727] text-white rounded-lg font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white hover:text-[#dd2727] transition-all shadow-[0_10px_40px_-10px_rgba(221,39,39,0.5)] active:scale-95 group/btn"
                        >
                          Continue Path
                          <svg className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Large Background Text */}
          <div className="absolute top-0 right-0 text-[20vw] font-black text-white/[0.01] leading-none select-none -z-10 tracking-tighter translate-x-1/4">
            VAHLAY
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="no-full-height">
          <div className="section-container">
            <div className="bg-gradient-to-br from-[#dd2727]/20 to-black border border-[#dd2727]/30 rounded-xl p-12 md:p-20 text-center relative overflow-hidden group shadow-2xl">
              <div className="relative z-10 space-y-8">
                <h2 className="title-batangas text-3xl md:text-5xl text-white">Ready to Begin Your <br /> <span className="text-[#dd2727]">Celestial Journey?</span></h2>
                <Link to="/contact">
                  <button className="px-12 py-5 bg-white text-black rounded-full font-black uppercase tracking-[0.2em] text-[11px] hover:bg-[#dd2727] hover:text-white transition-all duration-500 shadow-2xl hover:-translate-y-1">
                    Book a Consultation
                  </button>
                </Link>
              </div>

              <div className="absolute inset-0 bg-glow-red opacity-0 group-hover:opacity-40 transition-opacity duration-1000"></div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Services;


