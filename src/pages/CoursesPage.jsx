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
               

                {/* Courses Hero Banner (Classic & Premium Redesign) */}
                <section className="relative w-full py-10 md:py-12 flex items-center justify-center overflow-hidden bg-transparent ">
                    <div className="relative z-10 max-w-4xl w-full mx-4 text-center">
                        {/* Red Pill Label */}
                        <div className="inline-block mb-2 px-8 py-2 rounded-full border border-[#dd2727]/30 bg-[#dd2727]/5">
                            <span className="text-[#dd2727] text-sm font-bold uppercase tracking-[0.3em]">
                                Sacred Learning
                            </span>
                        </div>
                        
                        {/* Bold White Title */}
                        <h1 className="title-batangas text-5xl md:text-7xl text-white font-black mb-6 leading-[1.1]">
                            Align Your Life <br /> With the Stars
                        </h1>

                        {/* Red Subtitle */}
                        <p className="subtitle-poppins text-lg text-[#dd2727] max-w-2xl mx-auto leading-relaxed font-bold drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
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
                </section>

                <CourseGrid />

                <section className="max-w-[1170px] mx-auto px-4 pb-20">
                    <div className=" border border-white/10 rounded-[2rem] p-12 text-center shadow-[0_15px_60px_rgba(221,39,39,0.35)]">
                        <h2 className="title-batangas text-3xl md:text-5xl mb-6 text-white">Ready to start learning?</h2>
                        <p className="subtitle-poppins text-white/90 text-lg mb-10 max-w-xl mx-auto">Enroll in our upcoming batches and begin your journey into cosmic wisdom.</p>
                        <Link to="/contact" className="inline-block bg-white/10 backdrop-blur-lg border border-white/20 text-white px-10 py-4 rounded-full font-bold uppercase tracking-wider transition-all duration-500 hover:bg-white hover:text-[#dd2727]">
                            Enroll Now
                        </Link>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
};

export default CoursesPage;
