import React from 'react';
import Header from '../components/sections/Header/Header';
import Footer from '../components/sections/Footer/Footer';

const PrivacyPolicyPage = () => {
    return (
        <>
            <Header />
            <main className="min-h-screen relative z-10 text-white overflow-hidden bg-transparent">
                {/* Premium Transparent Cosmic Background */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-black via-[#1a0f0f]/90 to-[#2b0b0b]/95"></div>

                {/* Glow Effects */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#dd2727]/20 blur-[180px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-400/10 blur-[180px] rounded-full pointer-events-none"></div>

                <div className="relative w-full min-h-[40vh] pt-32 pb-16 flex flex-col items-center justify-center text-center px-4">
                    <h1 className="title-batangas text-6xl mb-6 text-white">Privacy Policy</h1>
                </div>

                <section className="max-w-[1170px] mx-auto px-4 py-12">
                    <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-10 md:p-16 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">

                        <div className="subtitle-poppins text-white/80 space-y-8 text-lg">
                            <p className="text-white/50 border-b border-white/10 pb-6">Last updated: April 2026</p>

                            <div>
                                <h2 className="title-batangas text-3xl text-white mb-4">1. Information We Collect</h2>
                                <p className="leading-relaxed">We collect information that you provide directly to us when you use our services, book an appointment, or contact us for support. This may include your name, email address, phone number, birth details (for astrological purposes), and any other information you choose to provide.</p>
                            </div>

                            <div>
                                <h2 className="title-batangas text-3xl text-white mb-4">2. How We Use Your Information</h2>
                                <p className="leading-relaxed">We use the information we collect to provide, maintain, and improve our services. Specifically, your birth details are used solely for the purpose of generating astrological charts and providing consultations.</p>
                            </div>

                            <div>
                                <h2 className="title-batangas text-3xl text-white mb-4">3. Data Security</h2>
                                <p className="leading-relaxed">We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.</p>
                            </div>

                            <div>
                                <h2 className="title-batangas text-3xl text-white mb-4">4. Contact Us</h2>
                                <p className="leading-relaxed">If you have any questions about this Privacy Policy, please contact us at <strong className="text-[#dd2727]">contact@vahlayastro.com</strong>.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
};

export default PrivacyPolicyPage;
