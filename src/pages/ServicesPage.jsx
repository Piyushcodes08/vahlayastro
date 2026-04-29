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
                {/* Premium Transparent Cosmic Background */}
                <div className="absolute inset-0 -z-10 "></div>

                {/* Glow Effects */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#dd2727]/20 blur-[180px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-400/10 blur-[180px] rounded-full pointer-events-none"></div>

                <div className="pt-32 pb-16 text-center px-4">
                    <h1 className="title-batangas text-5xl md:text-7xl mb-6 text-white">Our Premium Services</h1>
                    <p className="subtitle-poppins text-lg text-white/80 max-w-2xl mx-auto">
                        Personalized astrological guidance, spiritual counseling, and cosmic remedies tailored for your life's journey.
                    </p>
                </div>

                <section className="max-w-[1170px] mx-auto px-4 py-12">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { 
                                title: "Personalized Astrological Guidance", 
                                desc: "Dive deep into your unique astrological chart for clarity on relationships, career, and personal growth.",
                                img: "/src/assets/img/foundation.webp"
                            },
                            { 
                                title: "Life Path and Destiny Consultation", 
                                desc: "Unlock your life's purpose, navigate challenges, and seize opportunities by exploring your unique astrological blueprint.",
                                img: "/src/assets/img/self.webp"
                            },
                            { 
                                title: "Career and Success Consultation", 
                                desc: "Identify your ideal career path, unlock potential, and align your work with the strengths in your astrological chart.",
                                img: "/src/assets/img/about-1.webp"
                            },
                            { 
                                title: "Relationship Compatibility Reading", 
                                desc: "Analyze relationship dynamics for better communication and harmony.",
                                img: "/src/assets/img/about-2.webp"
                            },
                            { 
                                title: "Remedial Astrology Consultation", 
                                desc: "Address planetary imbalances with proven astrological remedies.",
                                img: "/src/assets/img/about-3.webp"
                            },
                            { 
                                title: "Ongoing Support and Guidance", 
                                desc: "Stay aligned with personalized follow-up sessions and continuous support.",
                                img: "/src/assets/img/about-4.webp"
                            }
                        ].map((srv, i) => (
                            <Link to="/appointment" key={i} className="bg-[#150a0a]/80 backdrop-blur-xl border border-white/5 rounded-[2rem] overflow-hidden hover:-translate-y-2 hover:border-[#dd2727]/30 shadow-[0_15px_50px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_60px_rgba(221,39,39,0.2)] transition-all duration-500 text-left block group">
                                <div className="h-56 w-full overflow-hidden relative">
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all z-10"></div>
                                    <img src={srv.img} alt={srv.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                </div>
                                <div className="p-8 flex flex-col justify-between" style={{ minHeight: "260px" }}>
                                    <div>
                                        <h3 className="title-batangas text-2xl mb-4 text-[#dd2727]">{srv.title}</h3>
                                        <p className="subtitle-poppins text-white/80 leading-relaxed text-[15px] mb-6">{srv.desc}</p>
                                    </div>
                                    <span className="text-[#dd2727] font-bold text-sm tracking-wider uppercase group-hover:text-white transition-colors">
                                        Book An Appointment NOW &gt;
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                <section className="max-w-[1170px] mx-auto px-4 py-12">
                    <div className="text-center mb-12">
                        <p className="subtitle-poppins text-white/90 max-w-2xl mx-auto text-xl">
                            We provide a range of astrology services designed to help you unlock deeper insights into your life.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Courses Card */}
                        <Link to="/courses" className="rounded-3xl overflow-hidden shadow-2xl hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(221,39,39,0.2)] transition-all duration-500 group border border-white/20 block">
                            <div className="h-64 overflow-hidden relative">
                                <img src="/src/assets/img/courses.webp" alt="Courses" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            </div>
                            <div className="p-6 pt-5 pb-8 text-center">
                                <h3 className="title-batangas text-2xl text-[#dd2727] font-bold">Courses</h3>
                            </div>
                        </Link>
                        
                        {/* Consultation Card */}
                        <Link to="/contact" className="bg-white rounded-3xl overflow-hidden shadow-2xl hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(221,39,39,0.2)] transition-all duration-500 group border border-white/20 block">
                            <div className="h-64 overflow-hidden relative">
                                <img src="/src/assets/img/consulting.webp" alt="Consultation" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            </div>
                            <div className="p-6 pt-5 pb-8 bg-white text-left">
                                <h3 className="title-batangas text-2xl text-[#dd2727] font-bold">Consultation</h3>
                            </div>
                        </Link>

                        {/* Articles Card */}
                        <Link to="/articles" className="bg-white rounded-3xl overflow-hidden shadow-2xl hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(221,39,39,0.2)] transition-all duration-500 group border border-white/20 block">
                            <div className="h-64 overflow-hidden relative">
                                <img src="/src/assets/img/books.webp" alt="Articles" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            </div>
                            <div className="p-6 pt-5 pb-8 bg-white text-left">
                                <h3 className="title-batangas text-2xl text-[#dd2727] font-bold">Articles</h3>
                            </div>
                        </Link>
                    </div>
                </section>

                <section className="max-w-[1170px] mx-auto px-4 py-20">
                    <div className=" border border-white/10 rounded-[2rem] p-12 text-center shadow-[0_15px_60px_rgba(221,39,39,0.35)]">
                        <h2 className="title-batangas text-3xl md:text-5xl mb-6 text-white">Need Personal Guidance?</h2>
                        <p className="subtitle-poppins text-white/90 text-lg mb-10 max-w-xl mx-auto">Book a one-on-one session with our expert astrologers and transform your life today.</p>
                        <Link to="/contact" className="inline-block bg-white/10 backdrop-blur-lg border border-white/20 text-white px-10 py-4 rounded-full font-bold uppercase tracking-wider transition-all duration-500 hover:bg-white hover:text-[#dd2727]">
                            Schedule Appointment
                        </Link>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
};

export default ServicesPage;
