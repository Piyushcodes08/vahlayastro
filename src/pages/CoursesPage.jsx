import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/sections/Header/Header';
import Footer from '../components/sections/Footer/Footer';
import CourseGrid from '../components/sections/Courses/CourseGrid';

const CoursesPage = () => {
    return (
        <>
            <Header />
            <main className="min-h-screen relative z-10 text-white overflow-hidden bg-transparent">
                {/* Courses Hero Banner */}
                <section className="hero-section">
                    {/* Background Glows */}
                    <div className="bg-glow-container">
                        <div className="absolute top-[20%] left-[10%] w-[600px] h-[600px] bg-glow-red opacity-50"></div>
                        <div className="absolute top-[10%] right-[5%] w-[500px] h-[500px] bg-glow-gold opacity-20"></div>
                    </div>

                    <div className="section-container">
                        <div className="relative z-10 max-w-4xl w-full mx-auto text-center">
                            {/* Red Pill Label */}
                            <div className="inline-block mb-4 px-8 py-2 rounded-full border border-[#dd2727]/30 bg-[#dd2727]/5">
                                <span className="text-[#dd2727] text-sm font-bold uppercase tracking-[0.3em]">
                                    Sacred Learning
                                </span>
                            </div>

                            {/* Bold White Title */}
                            <h1 className="title-batangas text-5xl md:text-7xl text-white font-black mb-6 leading-[1.1]">
                                Align Your Life <br /> With the <span className="text-[#dd2727]">Stars</span>
                            </h1>

                            {/* Red Subtitle */}
                            <p className="subtitle-poppins text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed font-medium">
                                Vahlay Astro: It's Not Just A Course, It's A Life-Changing Experience.
                                Master Ancient Wisdom for Modern Living.
                            </p>

                            {/* Red Dot Divider */}
                            <div className="mt-12 flex items-center justify-center gap-4">
                                <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-white/10"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-[#dd2727] shadow-[0_0_15px_#dd2727]"></div>
                                <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-white/10"></div>
                            </div>
                        </div>
                    </div>
                </section>

                <CourseGrid />

                <section>
                    <div className="bg-glow-container">
                        <div className="absolute bottom-0 left-[20%] w-[600px] h-[600px] bg-glow-red opacity-30"></div>
                    </div>
                    <div className="section-container">
                        <div className="bg-gradient-to-br from-[#dd2727]/20 to-black border border-[#dd2727]/30 rounded-xl py-16 md:py-24 px-[15px] md:px-[50px] text-center shadow-[0_30px_100px_rgba(221,39,39,0.25)] relative overflow-hidden group">
                            <div className="absolute inset-0 bg-glow-red opacity-0 group-hover:opacity-40 transition-opacity duration-1000"></div>
                            <div className="relative z-10">
                                <h2 className="title-batangas text-4xl md:text-7xl mb-8 text-white">Ready to start learning?</h2>
                                <p className="subtitle-poppins text-white/90 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">Enroll in our upcoming batches and begin your journey into cosmic wisdom.</p>
                                <Link to="/appointment" className="inline-block bg-[#dd2727] text-white px-14 py-5 rounded-full font-bold uppercase tracking-[0.2em] transition-all duration-500 hover:bg-white hover:text-[#dd2727] shadow-[0_10px_40px_rgba(221,39,39,0.4)]">
                                    Enroll Now
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

export default CoursesPage;

