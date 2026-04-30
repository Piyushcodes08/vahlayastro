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
                            <Link to="/appointment" key={i} className="bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden hover:-translate-y-2 hover:border-[#dd2727]/50 hover:bg-white/[0.09] shadow-[0_10px_40px_rgba(0,0,0,0.25)] hover:shadow-[0_20px_60px_rgba(221,39,39,0.25)] transition-all duration-500 text-left block group">
                                <div className="aspect-[3/2] w-full overflow-hidden relative">
                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-all z-10"></div>
                                    <img src={srv.img} alt={srv.title} className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700" />
                                </div>
                                <div className="p-7 flex flex-col justify-between" style={{ minHeight: "220px" }}>
                                    <div>
                                        <h3 className="title-batangas text-2xl mb-4 text-[#dd2727]">{srv.title}</h3>
                                        <p className="subtitle-poppins text-white/90 leading-relaxed text-[15px] mb-6">{srv.desc}</p>
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
                        <h2 className="title-batangas text-4xl md:text-5xl mb-4 text-white">Our Key Services</h2>
                        <p className="subtitle-poppins text-white/90 max-w-2xl mx-auto text-lg">
                            We provide a range of astrology services designed to help you unlock deeper insights into your life.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: "Courses", img: "/src/assets/img/courses.webp", link: "/courses" },
                            { title: "Consultation", img: "/src/assets/img/consulting.webp", link: "/contact" },
                            { title: "Articles", img: "/src/assets/img/books.webp", link: "/articles" }
                        ].map((item, idx) => (
                            <Link 
                                key={idx}
                                to={item.link} 
                                className="bg-white/[0.08] backdrop-blur-xl rounded-[2rem] overflow-hidden border border-[#dd2727]/20 hover:-translate-y-3 hover:border-[#dd2727]/70 shadow-[0_10px_40px_rgba(221,39,39,0.15)] hover:shadow-[0_25px_70px_rgba(221,39,39,0.4)] transition-all duration-500 group block ring-1 ring-transparent hover:ring-[#dd2727]/30"
                            >
                                <div className="aspect-[3/2] overflow-hidden relative">
                                    <img 
                                        src={item.img} 
                                        alt={item.title} 
                                        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700" 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                                </div>
                                <div className="p-7 text-center">
                                    <h3 className="title-batangas text-2xl text-[#dd2727] font-bold mb-5 group-hover:drop-shadow-[0_0_12px_rgba(221,39,39,0.8)] transition-all duration-300">
                                        {item.title}
                                    </h3>
                                    <span className="inline-block px-7 py-2 rounded-full bg-[#dd2727]/10 border border-[#dd2727]/50 text-[#dd2727] text-xs font-bold uppercase tracking-[0.2em] group-hover:bg-[#dd2727] group-hover:text-white transition-all duration-300">
                                        Explore More
                                    </span>
                                </div>
                            </Link>
                        ))}
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
