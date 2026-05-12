import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/sections/Header/Header';
import Footer from '../components/sections/Footer/Footer';
import CourseSection from '../components/sections/Courses/CourseSection';
import ArticleSection from '../components/sections/Article/ArticleSection';

const ServicesPage = () => {
    return (
        <>
            <Header />
            <main className="min-h-screen relative z-10 text-white overflow-hidden bg-transparent">
                {/* ── Services Hero Banner ─────────────────────────────────── */}
                <section className="hero-section">
                    {/* Background Glows */}
                    <div className="bg-glow-container">
                        <div className="absolute top-[20%] left-[10%] w-[600px] h-[600px] bg-glow-red opacity-50"></div>
                        <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-glow-gold opacity-30"></div>
                    </div>

                    <div className="section-container">
                        <div className="relative z-10 max-w-4xl mx-auto text-center">
                            <span className="inline-block px-8 py-2 rounded-full border border-[#dd2727]/30 bg-[#dd2727]/5 mb-6">
                                <span className="text-[#dd2727] text-sm font-bold uppercase tracking-[0.3em]">
                                    Our Sacred Services
                                </span>
                            </span>

                            <h1 className="title-batangas text-5xl md:text-7xl mb-8 leading-[1.1] text-white">
                                Premium <br /> <span className="text-[#dd2727]">Astrological</span> Guidance
                            </h1>

                            <p className="subtitle-poppins text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
                                Personalized astrological guidance, spiritual counseling, and cosmic remedies 
                                tailored for your life's journey toward prosperity and enlightenment.
                            </p>

                            <div className="flex flex-wrap gap-4 justify-center">
                                <Link
                                    to="/appointment"
                                    className="inline-block bg-[#dd2727] text-white px-10 py-4 rounded-full font-bold uppercase tracking-wider transition-all duration-500 hover:bg-white hover:text-[#dd2727] hover:-translate-y-1 shadow-[0_10px_30px_rgba(221,39,39,0.3)]"
                                >
                                    Book Session
                                </Link>
                                <a
                                    href="#all-services"
                                    className="inline-block bg-white/5 backdrop-blur-md border border-white/15 text-white px-10 py-4 rounded-full font-bold uppercase tracking-wider transition-all duration-500 hover:bg-white hover:text-[#000] hover:-translate-y-1"
                                >
                                    Explore More
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Services Grid ────────────────────────────────────────── */}
                <section id="all-services">
                    <div className="section-container">
                        <div className="text-center mb-16">
                            <h2 className="title-batangas text-4xl md:text-6xl mb-6 text-white">
                                Explore Our <span className="text-[#dd2727]">Offerings</span>
                            </h2>
                            <p className="subtitle-poppins text-white/70 max-w-2xl mx-auto text-lg leading-relaxed">
                                We provide a comprehensive range of cosmic sciences to help you unlock deeper 
                                insights into your personality, destiny, and life purpose.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                {
                                    title: "Personalized Guidance",
                                    desc: "Deep astrological analysis for clarity on relationships, career, and personal growth.",
                                    img: "/src/assets/img/foundation.webp"
                                },
                                {
                                    title: "Destiny Consultation",
                                    desc: "Navigate life's challenges and seize cosmic opportunities via your unique blueprint.",
                                    img: "/src/assets/img/self.webp"
                                },
                                {
                                    title: "Career & Success",
                                    desc: "Identify your ideal path and align your professional work with planetary strengths.",
                                    img: "/src/assets/img/about-1.webp"
                                },
                                {
                                    title: "Relationship Compatibility",
                                    desc: "Analyze connection dynamics for better communication and spiritual harmony.",
                                    img: "/src/assets/img/about-2.webp"
                                },
                                {
                                    title: "Remedial Astrology",
                                    desc: "Address planetary imbalances with proven Vedic remedies tailored to your chart.",
                                    img: "/src/assets/img/about-3.webp"
                                },
                                {
                                    title: "Ongoing Support",
                                    desc: "Stay aligned with personalized follow-ups and continuous spiritual guidance.",
                                    img: "/src/assets/img/about-4.webp"
                                }
                            ].map((srv, i) => (
                                <Link 
                                    to="/appointment" 
                                    key={i} 
                                    className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden hover:-translate-y-2 hover:border-[#dd2727]/50 shadow-2xl transition-all duration-500 block"
                                >
                                    <div className="w-full relative bg-[#080101]/40">
                                        <img 
                                            src={srv.img} 
                                            alt={srv.title} 
                                            className="w-full h-auto block transition-transform duration-700 group-hover:scale-105" 
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                    </div>
                                    <div className="p-8">
                                        <h3 className="title-batangas text-2xl mb-4 text-[#dd2727]">{srv.title}</h3>
                                        <p className="subtitle-poppins text-white/80 leading-relaxed text-sm mb-6">{srv.desc}</p>
                                        <span className="text-[#dd2727] font-bold text-xs tracking-widest uppercase flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                                            Schedule Consultation →
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Key Portals ──────────────────────────────────────────── */}
                <section>
                    <div className="section-container">
                        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-12 md:p-20 shadow-2xl">
                            <div className="text-center mb-16">
                                <h2 className="title-batangas text-4xl md:text-5xl text-white">Our Main <span className="text-[#dd2727]">Portals</span></h2>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8">
                                {[
                                    { title: "Courses", img: "/src/assets/img/courses.webp", link: "/courses", desc: "Learn the secrets of the cosmos." },
                                    { title: "Consultation", img: "/src/assets/img/consulting.webp", link: "/contact", desc: "Get personalized expert guidance." },
                                    { title: "Articles", img: "/src/assets/img/books.webp", link: "/articles", desc: "Read profound spiritual wisdom." }
                                ].map((item, idx) => (
                                    <Link
                                        key={idx}
                                        to={item.link}
                                        className="bg-[#000]/40 rounded-[2rem] overflow-hidden border border-white/10 hover:border-[#dd2727]/50 transition-all duration-500 group block"
                                    >
                                        <div className="aspect-[16/10] overflow-hidden">
                                            <img
                                                src={item.img}
                                                alt={item.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        </div>
                                        <div className="p-8 text-center">
                                            <h3 className="title-batangas text-2xl text-[#dd2727] mb-2">{item.title}</h3>
                                            <p className="subtitle-poppins text-white/60 text-sm mb-6">{item.desc}</p>
                                            <span className="inline-block px-8 py-2 rounded-full bg-[#dd2727]/10 border border-[#dd2727]/30 text-[#dd2727] text-xs font-bold uppercase tracking-widest group-hover:bg-[#dd2727] group-hover:text-white transition-all">
                                                Enter Portal
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Final CTA ───────────────────────────────────────────── */}
                <section className="no-full-height">
                    <div className="section-container">
                        <div className="bg-gradient-to-br from-[#dd2727]/20 to-black/60 border border-[#dd2727]/30 rounded-[3rem] p-16 md:p-24 text-center shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-glow-red opacity-0 group-hover:opacity-30 transition-opacity duration-1000"></div>
                            <div className="relative z-10">
                                <h2 className="title-batangas text-4xl md:text-7xl mb-8 text-white leading-tight">
                                    Ready to Begin Your <br /> <span className="text-[#dd2727]">Transformation?</span>
                                </h2>
                                <p className="subtitle-poppins text-white/90 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
                                    Book a one-on-one session with our expert astrologers and transform your life today.
                                </p>
                                <Link 
                                    to="/appointment" 
                                    className="inline-block bg-[#dd2727] text-white px-14 py-5 rounded-full font-bold uppercase tracking-[0.2em] transition-all duration-500 hover:bg-white hover:text-[#dd2727] hover:-translate-y-2 shadow-[0_15px_50px_rgba(221,39,39,0.4)]"
                                >
                                    Schedule Now
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
};


export default ServicesPage;
