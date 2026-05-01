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
                <section className="relative w-full py-10 md:py-16 flex items-center justify-center overflow-hidden border-b border-white/5 bg-transparent">
                    <div className="relative z-10 max-w-4xl w-full mx-4 text-center">
                        {/* Red Pill Label */}
                        <div className="inline-block mb-2 px-8 py-2 rounded-full border border-[#dd2727]/30 bg-[#dd2727]/5">
                            <span className="text-[#dd2727] text-sm font-bold uppercase tracking-[0.3em]">
                                Our Journey & Mission
                            </span>
                        </div>

                        {/* Bold White Title */}
                        <h1 className="title-batangas text-5xl md:text-7xl text-white font-black mb-6 leading-[1.1]">
                            Welcome to <br /> Vahlay Astro
                        </h1>

                        {/* Red Subtitle */}
                        <p className="subtitle-poppins text-lg text-[#dd2727] max-w-2xl mx-auto leading-relaxed font-bold drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                            Discover the celestial wisdom that guides your path to success,
                            harmony, and spiritual enlightenment.
                        </p>

                        {/* Red Dot Divider */}
                        <div className="mt-12 flex items-center justify-center gap-4">
                            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-white/10"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-[#dd2727] shadow-[0_0_10px_#dd2727]"></div>
                            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-white/10"></div>
                        </div>
                    </div>
                </section>

                {/* 1. Who We Are */}
                <section className="max-w-[1170px] mx-auto px-4 py-16">
                    <div className="grid md:grid-cols-2 gap-12 items-center">

                        <div className="rounded-[2rem] overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.35)] flex items-center justify-center">
                            <img
                                src={aboutuspg}
                                alt="Who We Are"
                                className="h-[300px] md:h-full object-cover"
                            />
                        </div>

                        <div className="space-y-8">
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                                <h2 className="title-batangas text-4xl md:text-5xl mb-4 text-white">
                                    Who We Are
                                </h2>
                                <p className="subtitle-poppins text-white/80 leading-relaxed text-lg">
                                    At <strong className="text-[#dd2727]">Vahlay Astro</strong>, we blend
                                    ancient Vedic astrology with modern spiritual insights to guide
                                    individuals and businesses through life’s most important journeys.
                                </p>
                            </div>

                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                                <h2 className="title-batangas text-4xl md:text-5xl mb-4 text-[#dd2727]">
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
                </section>

                {/* 2. Ambition & Vision */}
                <section className="max-w-[1170px] mx-auto px-4 py-8">
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
                                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-10 text-center shadow-[0_10px_40px_rgba(0,0,0,0.25)] hover:scale-[1.02] transition-all duration-500"
                            >
                                <h3 className="title-batangas text-3xl mb-4 text-[#dd2727]">
                                    {item.title}
                                </h3>
                                <p className="subtitle-poppins text-white/75 leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 3. Core Values */}
                <section className="max-w-[1170px] mx-auto px-4 py-12">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-10 md:p-16">
                        <h2 className="title-batangas text-4xl md:text-5xl text-center mb-12 text-white">
                            Core Values
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { title: "Integrity", desc: "Transparency and honesty in all guidance.", icon: <LuShieldCheck /> },
                                { title: "Empathy", desc: "Deep understanding of every client’s journey.", icon: <LuHeart /> },
                                { title: "Innovation", desc: "Modernizing ancient cosmic wisdom.", icon: <LuLightbulb /> },
                                { title: "Excellence", desc: "Delivering premium spiritual experiences.", icon: <LuTrophy /> },
                            ].map((val, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white/5 border border-white/10 backdrop-blur-lg rounded-3xl p-8 text-center hover:border-[#dd2727]/40 transition-all duration-500 flex flex-col items-center"
                                >
                                    <div className="text-5xl mb-6  text-white">{val.icon}</div>
                                    <h4 className="title-batangas text-2xl mb-2 text-white">
                                        {val.title}
                                    </h4>
                                    <p className="subtitle-poppins text-sm text-white/70 leading-relaxed">
                                        {val.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 4. Services */}
                <section className="max-w-[1170px] mx-auto px-4 py-12 text-center">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-10 md:p-14">
                        <h2 className="title-batangas text-4xl mb-12 text-[#dd2727]">
                            Services We Offer
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
                                    title: "Books",
                                    desc: "Discover profound astrological knowledge.",
                                    link: "/articles"
                                },
                            ].map((srv, idx) => (
                                <Link
                                    key={idx}
                                    to={srv.link}
                                    className="bg-[#150a0a]/80 backdrop-blur-lg border border-white/10 rounded-3xl p-8 hover:scale-[1.03] hover:border-[#dd2727]/40 shadow-xl hover:shadow-[0_10px_30px_rgba(221,39,39,0.2)] transition-all duration-500 block text-center group flex flex-col items-center justify-between"
                                >
                                    <div>
                                        <h3 className="title-batangas text-2xl mb-4 text-[#dd2727] group-hover:scale-105 transition-transform duration-300">
                                            {srv.title}
                                        </h3>
                                        <p className="subtitle-poppins text-white/70 leading-relaxed mb-6">
                                            {srv.desc}
                                        </p>
                                    </div>
                                    <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#dd2727] group-hover:text-white transition-colors duration-300">
                                        Read More
                                        <LuArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 5. CTA */}
                <section className="max-w-[1170px] mx-auto px-4 pb-20">
                    <div className="border border-white/10 rounded-[2rem] p-12 text-center shadow-[0_15px_60px_rgba(221,39,39,0.35)]">
                        <h2 className="title-batangas text-3xl md:text-5xl mb-4 text-white">
                            Ready to Align with the Stars?
                        </h2>

                        <p className="subtitle-poppins text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                            Let <strong>Vahlay Astro</strong> guide you toward
                            clarity, abundance, and spiritual harmony.
                        </p>

                        <Link
                            to="/services"
                            className="inline-block bg-white/10 backdrop-blur-lg border border-white/20 text-white px-10 py-4 rounded-full font-bold uppercase tracking-wider transition-all duration-500 hover:bg-white hover:text-[#dd2727]"
                        >
                            Explore Services
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
};

export default AboutPage;