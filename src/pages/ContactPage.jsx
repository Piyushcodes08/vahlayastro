import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { IoCallOutline, IoMailOutline } from "react-icons/io5";
import Header from '../components/sections/Header/Header';
import Footer from '../components/sections/Footer/Footer';
import Contact from '../components/sections/Contact/Contact';

const ContactPage = () => {
    const location = useLocation();

    useEffect(() => {
        if (location.hash) {
            const id = location.hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        } else {
            window.scrollTo(0, 0);
        }
    }, [location]);

    return (
        <>
            <Header />
            <main className="min-h-screen relative z-10 text-white overflow-hidden bg-transparent">
                {/* Header Spacer */}
                <div className="pt-24"></div>

                {/* Contact Hero Banner (Classic & Premium Style) */}
                <section className="relative w-full flex items-center justify-center overflow-hidden bg-transparent">
                    <div className="relative z-10 max-w-4xl w-full mx-4 text-center">
                        {/* Red Pill Label */}
                        <div className="inline-block mb-6 px-8 py-2 rounded-full border border-[#dd2727]/30 bg-[#dd2727]/5">
                            <span className="text-[#dd2727] text-sm font-bold uppercase tracking-[0.3em]">
                                Connectivity & Support
                            </span>
                        </div>
                        
                        {/* Bold White Title */}
                        <h1 className="title-batangas text-5xl md:text-7xl text-white font-black mb-6 leading-[1.1]">
                            Get in Touch <br /> with the Universe
                        </h1>

                        {/* Red Subtitle */}
                        <p className="subtitle-poppins text-lg text-[#dd2727] max-w-2xl mx-auto leading-relaxed font-bold drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                            We are here to answer your questions and guide you on your cosmic journey.
                        </p>

                        {/* Red Dot Divider */}
                        <div className="mt-12 flex items-center justify-center gap-4">
                            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-white/10"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-[#dd2727] shadow-[0_0_15px_#dd2727]"></div>
                            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-white/10"></div>
                        </div>
                    </div>
                </section>
                
                <Contact />

                <section className="max-w-[1170px] mx-auto px-4 py-12">
                    <div className="grid md:grid-cols-2 gap-12 items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-10 md:p-16 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
                        <div>
                            <h2 className="title-batangas text-4xl mb-6 text-white">Need immediate assistance?</h2>
                            <p className="subtitle-poppins text-white/80 mb-6 leading-relaxed">
                                Our team is ready to help you schedule your consultation or answer any questions you might have about our services and courses.
                            </p>
                            <p className="subtitle-poppins text-white/80 leading-relaxed mb-8">
                                For urgent matters, please use our WhatsApp line or call our landline directly during business hours (9:00 AM - 6:00 PM IST).
                            </p>
                        </div>
                        <div className="space-y-6">
                            <a 
                                href="tel:+917949217538" 
                                className="flex items-center gap-6 bg-white/5 backdrop-blur-lg p-6 rounded-3xl border border-white/10 hover:border-[#dd2727]/60 hover:bg-white/10 transition-all duration-500 group"
                            >
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#dd2727]/40 to-orange-500/20 border border-[#dd2727]/30 flex items-center justify-center text-white text-2xl shadow-[0_0_15px_rgba(221,39,39,0.3)] group-hover:scale-110 transition-transform duration-500">
                                    <IoCallOutline />
                                </div>
                                <div>
                                    <p className="subtitle-poppins text-sm text-white/50 mb-1">Call Us Directly</p>
                                    <p className="title-batangas text-xl text-white group-hover:text-[#dd2727] transition-colors">+91 79 4921 7538</p>
                                </div>
                            </a>
                            
                            <a 
                                href="mailto:contact@vahlayastro.com" 
                                className="flex items-center gap-6 bg-white/5 backdrop-blur-lg p-6 rounded-3xl border border-white/10 hover:border-[#dd2727]/60 hover:bg-white/10 transition-all duration-500 group"
                            >
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#dd2727]/40 to-orange-500/20 border border-[#dd2727]/30 flex items-center justify-center text-white text-2xl shadow-[0_0_15px_rgba(221,39,39,0.3)] group-hover:scale-110 transition-transform duration-500">
                                    <IoMailOutline />
                                </div>
                                <div>
                                    <p className="subtitle-poppins text-sm text-white/50 mb-1">Email Support</p>
                                    <p className="title-batangas text-xl text-white group-hover:text-[#dd2727] transition-colors">contact@vahlayastro.com</p>
                                </div>
                            </a>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
};

export default ContactPage;
