import React from 'react';
import Header from '../components/sections/Header/Header';
import Footer from '../components/sections/Footer/Footer';

const FAQPage = () => {
    const faqs = [
        {
            question: "What is Vedic Astrology?",
            answer: "Vedic Astrology, also known as Jyotish, is an ancient Indian science that explains planetary motions and positions with respect to time and their effect on humans and other entities on Earth."
        },
        {
            question: "How can astrology help me?",
            answer: "Astrology provides insights into your personality, strengths, and life path. It can guide you in making informed decisions regarding career, relationships, and personal growth."
        },
        {
            question: "Are consultations strictly confidential?",
            answer: "Yes, we maintain strict confidentiality for all our clients. Your personal information and consultation details are never shared with third parties."
        },
        {
            question: "How do I book an appointment?",
            answer: "You can book an appointment by visiting our Appointment page to schedule a session, or by reaching out to us via the Contact page for general inquiries."
        }
    ];

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
                    <h1 className="title-batangas text-6xl mb-6 text-white">Frequently Asked Questions</h1>
                    <p className="subtitle-poppins text-lg text-white/80 max-w-2xl mx-auto">
                        Find answers to the most common questions about our astrological services and consultation processes.
                    </p>
                </div>

                <section className="max-w-[1170px] mx-auto px-4 py-16">
                    <div className="max-w-4xl mx-auto space-y-6">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-[#dd2727]/40 shadow-[0_10px_40px_rgba(0,0,0,0.25)] transition-all duration-500">
                                <h3 className="title-batangas text-2xl md:text-3xl mb-4 text-[#dd2727]">{faq.question}</h3>
                                <p className="subtitle-poppins text-white/80 leading-relaxed text-lg">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
};

export default FAQPage;
