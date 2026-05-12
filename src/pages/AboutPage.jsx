import React from 'react';
import { Link } from 'react-router-dom';
import { LuShieldCheck, LuHeart, LuLightbulb, LuTrophy, LuArrowRight } from "react-icons/lu";
import Header from '../components/sections/Header/Header';
import Footer from '../components/sections/Footer/Footer';
import aboutuspg from '../assets/img/Aboutus-pg.webp';

const AboutPage = () => {
    return (
        <>
            <Header />

            <main className="min-h-screen relative z-10 text-white overflow-hidden bg-transparent">
                {/* Refined Minimalist Premium Banner */}
                <section className="hero-section">
                    {/* Background Glows */}
                    <div className="bg-glow-container">
                        <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-glow-red opacity-60"></div>
                        <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-glow-gold opacity-30"></div>
                    </div>

                    <div className="section-container">
                        <div className="relative z-10 max-w-4xl w-full mx-auto text-center">
                            {/* Red Pill Label */}
                            <div className="inline-block mb-2 px-8 py-2 rounded-full border border-[#dd2727]/30 bg-[#dd2727]/5">
                                <span className="text-[#dd2727] text-sm font-bold uppercase tracking-[0.3em]">
                                    Our Journey & Mission
                                </span>
                            </div>

                            {/* Bold White Title */}
                            <h1 className="title-batangas text-5xl md:text-7xl text-white font-black mb-6 leading-[1.1]">
                                Welcome to <br /> <span className="text-[#dd2727]">Vahlay Astro</span>
                            </h1>

                            {/* Red Subtitle */}
                            <p className="subtitle-poppins text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed font-medium">
                                Discover the celestial wisdom that guides your path to success,
                                harmony, and spiritual enlightenment.
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

                {/* 1. Who We Are */}
                <section>
                    <div className="section-container">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="rounded-[2.5rem] overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.35)] flex items-center justify-center p-2">
                                <img
                                    src={aboutuspg}
                                    alt="Who We Are"
                                    className="w-full h-full rounded-[2rem] object-cover"
                                />
                            </div>

                            <div className="space-y-8">
                                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-10 hover:border-[#dd2727]/30 transition-all duration-500">
                                    <h2 className="title-batangas text-4xl md:text-5xl mb-6 text-white">
                                        Who We Are
                                    </h2>
                                    <p className="subtitle-poppins text-white/80 leading-relaxed text-lg">
                                        At <strong className="text-[#dd2727]">Vahlay Astro</strong>, we blend
                                        ancient Vedic astrology with modern spiritual insights to guide
                                        individuals and businesses through life’s most important journeys.
                                    </p>
                                </div>

                                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-10 hover:border-[#dd2727]/30 transition-all duration-500">
                                    <h2 className="title-batangas text-4xl md:text-5xl mb-6 text-[#dd2727]">
                                        Our Philosophy
                                    </h2>
                                    <p className="subtitle-poppins text-white/80 leading-relaxed text-lg">
                                        We empower our clients with personalized cosmic guidance that
                                        provides clarity in relationships, career, prosperity, and life
                                        purpose.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. Services Grid */}
                 <section className="text-center">
                    <div className="bg-glow-container">
                        <div className="absolute top-[50%] right-0 w-[600px] h-[600px] bg-glow-red opacity-20"></div>
                    </div>
                    <div className="section-container">
                        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-10 md:p-20 shadow-2xl relative z-10">
                            <h2 className="title-batangas text-4xl md:text-6xl mb-14 text-white">
                                Our <span className="text-[#dd2727]">Cosmic</span> Services
                            </h2>

                            <div className="grid md:grid-cols-3 gap-8">
                                {[
                                    {
                                        title: "Courses",
                                        desc: "Learn astrology deeply and master cosmic sciences.",
                                        link: "/courses"
                                    },
                                    {
                                        title: "Consultation",
                                        desc: "Personalized guidance for major life decisions.",
                                        link: "/consulting"
                                    },
                                    {
                                        title: "Articles",
                                        desc: "Discover profound astrological knowledge.",
                                        link: "/articles"
                                    },
                                ].map((srv, idx) => (
                                    <Link
                                        key={idx}
                                        to={srv.link}
                                        className="bg-[#150a0a]/80 backdrop-blur-lg border border-white/10 rounded-[2rem] p-10 hover:scale-[1.05] hover:border-[#dd2727]/40 shadow-xl hover:shadow-[0_20px_50px_rgba(221,39,39,0.25)] transition-all duration-500 block text-center group flex flex-col items-center justify-between min-h-[300px]"
                                    >
                                        <div className="w-full">
                                            <h3 className="title-batangas text-3xl mb-4 text-[#dd2727] group-hover:scale-110 transition-transform duration-300">
                                                {srv.title}
                                            </h3>
                                            <p className="subtitle-poppins text-white/70 leading-relaxed mb-6 text-base">
                                                {srv.desc}
                                            </p>
                                        </div>
                                        <span className="inline-flex items-center gap-3 text-sm font-bold uppercase tracking-[0.2em] text-[#dd2727] group-hover:text-white transition-colors duration-300">
                                            Explore
                                            <LuArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. Ambition & Vision */}
                <section>
                    <div className="section-container">
                        <div className="grid md:grid-cols-2 gap-8">
                            {[
                                {
                                    title: "Our Ambition",
                                    desc: "To empower individuals to live with awareness, harmony, and purpose by unlocking the timeless wisdom of astrology.",
                                },
                                {
                                    title: "Our Vision",
                                    desc: "To become a trusted spiritual and astrological partner for people seeking clarity, transformation, and cosmic alignment.",
                                },
                            ].map((item, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-12 text-center shadow-[0_15px_50px_rgba(0,0,0,0.3)] hover:border-[#dd2727]/30 transition-all duration-500"
                                >
                                    <h3 className="title-batangas text-4xl mb-6 text-[#dd2727]">
                                        {item.title}
                                    </h3>
                                    <p className="subtitle-poppins text-white/80 leading-relaxed text-lg">
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 4. Core Values */}
                <section>
                    <div className="section-container">
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-12 md:p-20">
                            <h2 className="title-batangas text-4xl md:text-6xl text-center mb-16 text-white">
                                Core <span className="text-[#dd2727]">Values</span>
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                {[
                                    { title: "Integrity", desc: "Transparency and honesty in all guidance.", icon: <LuShieldCheck /> },
                                    { title: "Empathy", desc: "Deep understanding of every client’s journey.", icon: <LuHeart /> },
                                    { title: "Innovation", desc: "Modernizing ancient cosmic wisdom.", icon: <LuLightbulb /> },
                                    { title: "Excellence", desc: "Delivering premium spiritual experiences.", icon: <LuTrophy /> },
                                ].map((val, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-white/5 border border-white/10 backdrop-blur-lg rounded-[2rem] p-10 text-center hover:border-[#dd2727]/60 hover:bg-white/10 transition-all duration-500 flex flex-col items-center group"
                                    >
                                        <div className="text-6xl mb-8 text-white group-hover:scale-110 group-hover:text-[#dd2727] transition-all duration-500">{val.icon}</div>
                                        <h4 className="title-batangas text-2xl mb-4 text-white">
                                            {val.title}
                                        </h4>
                                        <p className="subtitle-poppins text-base text-white/70 leading-relaxed">
                                            {val.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 5. CTA */}
                <section>
                    <div className="section-container">
                        <div className="bg-gradient-to-br from-[#dd2727]/20 to-black border border-[#dd2727]/30 rounded-[3rem] p-16 md:p-24 text-center shadow-[0_30px_100px_rgba(221,39,39,0.25)] relative overflow-hidden group">
                            <div className="absolute inset-0 bg-glow-red opacity-0 group-hover:opacity-40 transition-opacity duration-1000"></div>
                            <div className="relative z-10">
                                <h2 className="title-batangas text-4xl md:text-7xl mb-8 text-white">
                                    Ready to Align with the Stars?
                                </h2>

                                <p className="subtitle-poppins text-white/90 text-xl mb-12 max-w-3xl mx-auto leading-relaxed">
                                    Let <strong>Vahlay Astro</strong> guide you toward
                                    clarity, abundance, and spiritual harmony.
                                </p>

                                <Link
                                    to="/consulting"
                                    className="inline-block bg-[#dd2727] text-white px-14 py-5 rounded-full font-bold uppercase tracking-[0.2em] transition-all duration-500 hover:bg-white hover:text-[#dd2727] hover:-translate-y-2 shadow-[0_10px_40px_rgba(221,39,39,0.4)]"
                                >
                                    Explore Services
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

export default AboutPage;