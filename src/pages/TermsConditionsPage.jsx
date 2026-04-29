import React from 'react';
import Header from '../components/sections/Header/Header';
import Footer from '../components/sections/Footer/Footer';

const TermsConditionsPage = () => {
    return (
        <>
            <Header />
            <main className="min-h-screen relative z-10 text-white overflow-hidden bg-transparent">
                {/* Premium Transparent Cosmic Background */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-black via-[#1a0f0f]/90 to-[#2b0b0b]/95"></div>

                {/* Glow Effects */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#dd2727]/20 blur-[180px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-400/10 blur-[180px] rounded-full pointer-events-none"></div>

                <div className="pt-32 pb-8 text-center px-4">
                    <h1 className="title-batangas text-5xl md:text-7xl mb-6 text-white">Terms & Conditions</h1>
                </div>

                <section className="max-w-[1170px] mx-auto px-4 py-12">
                    <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-10 md:p-16 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
                        
                        <div className="subtitle-poppins text-white/80 space-y-8 text-lg">
                            <p className="text-white/50 border-b border-white/10 pb-6">Last updated: April 2026</p>
                            
                            <div>
                                <h2 className="title-batangas text-3xl text-white mb-4">1. Acceptance of Terms</h2>
                                <p className="leading-relaxed">By accessing and using Vahlay Astro's website and services, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not use our services.</p>
                            </div>

                            <div>
                                <h2 className="title-batangas text-3xl text-white mb-4">2. Nature of Services</h2>
                                <p className="leading-relaxed">Astrology is an ancient art and science. The consultations, courses, and readings provided by Vahlay Astro are for guidance and self-reflection purposes. They should not replace professional medical, legal, or financial advice.</p>
                            </div>

                            <div>
                                <h2 className="title-batangas text-3xl text-white mb-4">3. Bookings and Cancellations</h2>
                                <p className="leading-relaxed">Appointments must be booked in advance. Cancellations must be made at least 24 hours prior to the scheduled consultation time. We reserve the right to reschedule appointments in case of unforeseen circumstances.</p>
                            </div>

                            <div>
                                <h2 className="title-batangas text-3xl text-white mb-4">4. Intellectual Property</h2>
                                <p className="leading-relaxed">All content on this website, including courses, articles, graphics, and logos, is the property of Vahlay Astro and is protected by copyright laws. Unauthorized use or distribution is prohibited.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
};

export default TermsConditionsPage;
