import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LuArrowRight, LuCalendar, LuStar, LuClock, LuUserPlus, LuRocket } from 'react-icons/lu';
import Header from '../components/sections/Header/Header';
import Footer from '../components/sections/Footer/Footer';
import { db } from '../firebaseConfig';
import { collection, getDocs, limit, query } from 'firebase/firestore';

// Images
import about1 from '../assets/images/pages/about/about-1.webp';
import about2 from '../assets/images/pages/about/about-2.webp';
import about3 from '../assets/images/pages/about/about-3.webp';
import about4 from '../assets/images/pages/about/about-4.webp';
import self from '../assets/images/pages/courses/self.webp';
import foundation from '../assets/images/pages/courses/foundation.webp';
import consultingHero from '../assets/images/pages/consulting/consulting.webp';

const consultServices = [
    {
        title: 'Personalized Astrological Guidance',
        description: 'Dive deep into your unique astrological chart for clarity on relationships, career, and personal growth.',
        img: about1,
        icon: '⭐',
        tag: 'Popular'
    },
    {
        title: 'Life Path & Destiny Consultation',
        description: "Unlock your life's purpose, navigate challenges, and seize opportunities by exploring your unique astrological blueprint.",
        img: self,
        icon: '🌙',
        tag: 'Deep Insights'
    },
    {
        title: 'Career & Success Consultation',
        description: 'Identify your ideal career path, unlock potential, and align your work with the strengths in your astrological chart.',
        img: foundation,
        icon: '🚀',
        tag: 'Success'
    },
    {
        title: 'Relationship Compatibility Reading',
        description: 'Analyze relationship dynamics for better communication and harmony through astrological compatibility.',
        img: about2,
        icon: '💫',
        tag: 'Harmony'
    },
    {
        title: 'Remedial Astrology Consultation',
        description: 'Address planetary imbalances with proven astrological remedies tailored to your birth chart.',
        img: about3,
        icon: '🔮',
        tag: 'Healing'
    },
    {
        title: 'Ongoing Support & Guidance',
        description: 'Stay aligned with personalized follow-up sessions and continuous cosmic support on your journey.',
        img: about4,
        icon: '✨',
        tag: 'Growth'
    },
];

const processSteps = [
    { step: '01', title: 'Book a Session', desc: 'Choose your preferred consultation type and schedule at your convenience.', icon: <LuCalendar /> },
    { step: '02', title: 'Share Your Details', desc: 'Provide your birth date, time, and place for accurate chart analysis.', icon: <LuUserPlus /> },
    { step: '03', title: 'Get Insights', desc: 'Receive personalized cosmic insights from our expert astrologers.', icon: <LuClock /> },
    { step: '04', title: 'Transform Your Life', desc: 'Apply the guidance and experience meaningful positive changes.', icon: <LuRocket /> },
];

const ConsultingPage = () => {
    const [testimonials, setTestimonials] = useState([]);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const q = query(collection(db, 'testimonials'), limit(3));
                const snap = await getDocs(q);
                const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
                setTestimonials(data);
            } catch (err) {
                console.error('Testimonials fetch error:', err);
            }
        };
        fetchTestimonials();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <>
            <Header />
            <main className="min-h-screen relative z-10 text-white overflow-hidden bg-transparent">
                {/* ── Hero Section ────────────────────────────────────────── */}
                <section className="hero-section">
                    <div className="bg-glow-container">
                        <div className="absolute top-[20%] left-[10%] w-[600px] h-[600px] bg-glow-red opacity-50"></div>
                        <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-glow-gold opacity-25"></div>
                    </div>

                    <div className="section-container">
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative z-10 max-w-4xl mx-auto text-center"
                        >
                            <div className="inline-block mb-6 px-8 py-2 rounded-full border border-[#dd2727]/30 bg-[#dd2727]/5">
                                <span className="text-[#dd2727] text-sm font-black uppercase tracking-[0.4em]">
                                    Cosmic Consulting
                                </span>
                            </div>

                            <h1 className="title-batangas text-4xl md:text-6xl text-white font-black mb-8 leading-[1.1]">
                                Empower Your Life with <br /> <span className="text-[#dd2727]">Vahlay Astro</span>
                            </h1>

                            <p className="subtitle-poppins text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed font-medium mb-12">
                                Personalized guidance tailored to your unique birth chart. Experience 
                                deep insights that light your path toward success and harmony.
                            </p>

                            <div className="flex flex-wrap gap-6 justify-center items-center">
                                <Link
                                    to="/appointment"
                                    className="px-8 py-3.5 rounded-full font-black uppercase tracking-widest text-white transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(221,39,39,0.5)] bg-[#dd2727] shadow-[0_10px_30px_rgba(221,39,39,0.3)] flex items-center gap-3 text-sm"
                                >
                                    Book Session <LuCalendar className="w-5 h-5" />
                                </Link>
                                <a
                                    href="#offerings"
                                    className="px-8 py-3.5 rounded-full font-black uppercase tracking-widest transition-all duration-500 hover:-translate-y-2 bg-white/5 border border-white/10 text-white backdrop-blur-xl hover:bg-white hover:text-black text-sm"
                                >
                                    Explore More
                                </a>
                            </div>

                            {/* Red Dot Divider */}
                            <div className="mt-20 flex items-center justify-center gap-4">
                                <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-white/10"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-[#dd2727] shadow-[0_0_15px_#dd2727]"></div>
                                <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-white/10"></div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* ── Stats Section ───────────────────────────────────────── */}
                <section className="no-full-height">
                    <div className="section-container !py-0">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { num: '5000+', label: 'Consultations' },
                                { num: '98%', label: 'Satisfaction' },
                                { num: '10+', label: 'Years Exp' },
                                { num: '50+', label: 'Service Types' },
                            ].map((s, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white/5 border border-white/10 rounded-[2rem] p-10 backdrop-blur-xl text-center hover:border-[#dd2727]/40 transition-all duration-500 shadow-xl"
                                >
                                    <div className="title-batangas text-4xl md:text-5xl font-black text-[#dd2727] mb-2">
                                        {s.num}
                                    </div>
                                    <div className="subtitle-poppins text-white/50 text-xs font-black uppercase tracking-widest">{s.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Services Section ────────────────────────────────────── */}
                <section id="offerings" className="pt-32 pb-24">
                    <div className="section-container">
                        <div className="text-center mb-24">
                            <h2 className="title-batangas text-4xl md:text-7xl text-white mb-8">
                                Professional <span className="text-[#dd2727]">Solutions</span>
                            </h2>
                            <p className="subtitle-poppins text-white/70 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
                                We provide a comprehensive range of cosmic consultations to help you unlock deeper 
                                insights into your personality, destiny, and life purpose.
                            </p>
                        </div>

                        <motion.div 
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
                        >
                            {consultServices.map((srv, i) => (
                                <motion.div key={i} variants={itemVariants} className="group h-full">
                                    <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] overflow-hidden h-full flex flex-col shadow-2xl transition-all duration-500 hover:border-[#dd2727]/50 hover:-translate-y-3">
                                        {/* Image Area */}
                                        <div className="relative h-64 overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#080101] via-transparent to-transparent z-10"></div>
                                            <img
                                                src={srv.img}
                                                alt={srv.title}
                                                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                                            />
                                            {/* Tag */}
                                            <div className="absolute top-6 right-6 z-20">
                                                <span className="px-4 py-1.5 rounded-full bg-[#dd2727] text-white text-[10px] font-black uppercase tracking-widest shadow-xl">
                                                    {srv.tag}
                                                </span>
                                            </div>
                                            {/* Icon */}
                                            <div className="absolute top-6 left-6 z-20">
                                                <div className="w-12 h-12 flex items-center justify-center bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl text-2xl">
                                                    {srv.icon}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-10 flex flex-col flex-1">
                                            <h3 className="title-batangas text-2xl mb-4 text-white group-hover:text-[#dd2727] transition-colors leading-tight">
                                                {srv.title}
                                            </h3>
                                            <p className="subtitle-poppins text-white/60 text-base leading-relaxed mb-10 flex-1">
                                                {srv.description}
                                            </p>
                                            <div className="mt-auto flex items-center justify-between">
                                                <Link
                                                    to="/appointment"
                                                    className="inline-flex items-center gap-3 font-black text-xs uppercase tracking-[0.2em] text-[#dd2727] group-hover:text-white transition-all"
                                                >
                                                    Book Session <LuArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                                                </Link>
                                                <div className="flex text-yellow-500/30 gap-0.5">
                                                    {[...Array(5)].map((_, idx) => <LuStar key={idx} size={12} fill="currentColor" />)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* ── Process Section ─────────────────────────────────────── */}
                <section className="no-full-height py-24">
                    <div className="section-container">
                        <div className="bg-[#0a0505] backdrop-blur-3xl border border-[#dd2727]/20 rounded-[4rem] p-12 md:p-24 relative overflow-hidden shadow-2xl">
                            {/* Inner Red Glow */}
                            <div className="absolute inset-0 bg-[#dd2727]/5 pointer-events-none"></div>
                            
                            <div className="relative z-10 text-center mb-20">
                                <h2 className="title-batangas text-4xl md:text-7xl text-white mb-6">
                                    How It <span className="text-[#dd2727]">Works</span>
                                </h2>
                                <p className="subtitle-poppins text-white/50 text-lg md:text-xl font-medium tracking-wide">
                                    A seamless journey to your cosmic alignment.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
                                {processSteps.map((step, i) => (
                                    <motion.div 
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="text-center group"
                                    >
                                        <div className="relative mb-10 inline-block">
                                            <div className="w-20 h-20 bg-gradient-to-br from-[#dd2727] to-[#800000] rounded-[2rem] flex items-center justify-center text-3xl text-white shadow-[0_15px_40px_rgba(221,39,39,0.3)] transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
                                                {step.icon}
                                            </div>
                                            <div className="absolute -top-4 -right-4 w-10 h-10 bg-white text-black font-black flex items-center justify-center rounded-full text-sm shadow-xl">
                                                {step.step}
                                            </div>
                                        </div>
                                        <h3 className="title-batangas text-2xl text-white mb-4 group-hover:text-[#dd2727] transition-colors">{step.title}</h3>
                                        <p className="subtitle-poppins text-white/60 text-base leading-relaxed">
                                            {step.desc}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Testimonials ────────────────────────────────────────── */}
                {testimonials.length > 0 && (
                    <section className="py-32">
                        <div className="section-container">
                            <div className="text-center mb-24">
                                <h2 className="title-batangas text-4xl md:text-7xl text-white mb-8">
                                    Voices of <span className="text-[#dd2727]">Clarity</span>
                                </h2>
                                <p className="subtitle-poppins text-white/70 text-lg font-medium">Hear from those who found their path.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                {testimonials.map((t, i) => (
                                    <motion.div
                                        key={t.id || i}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-12 flex flex-col hover:border-[#dd2727]/40 transition-all duration-500 shadow-2xl group"
                                    >
                                        <div className="text-6xl mb-8 text-[#dd2727]/20 group-hover:text-[#dd2727]/50 transition-all duration-500 font-serif">"</div>
                                        <p className="subtitle-poppins text-white/80 italic leading-relaxed flex-1 text-lg mb-12">
                                            {t.review || t.message || t.text || 'Incredible experience! The insights were truly life-changing and provided exactly the clarity I was looking for.'}
                                        </p>
                                        <div className="flex items-center gap-6 mt-auto">
                                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl bg-[#dd2727] shadow-xl">
                                                {(t.name || t.clientName || 'C')[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="text-white font-black text-lg tracking-tight">
                                                    {t.name || t.clientName || 'Happy Client'}
                                                </div>
                                                <div className="flex text-yellow-500 gap-1 mt-1">
                                                    {[...Array(5)].map((_, idx) => <LuStar key={idx} size={14} fill="currentColor" />)}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* ── Highlights Section ──────────────────────────────────── */}
                <section className="mb-32">
                    <div className="section-container">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.98 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2 }}
                            className="rounded-[4rem] overflow-hidden relative border border-white/10 shadow-3xl group min-h-[600px] flex items-center justify-center"
                        >
                            <img
                                src={consultingHero}
                                alt="Consulting"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                            
                            <div className="relative z-10 text-center p-12 max-w-4xl mx-auto">
                                <h2 className="title-batangas text-5xl md:text-8xl text-white mb-10 drop-shadow-2xl uppercase tracking-tighter leading-none">
                                    Align with <span className="text-[#dd2727]">Stars</span>
                                </h2>
                                <p className="subtitle-poppins text-white/90 max-w-2xl mx-auto mb-14 text-xl md:text-2xl leading-relaxed font-medium drop-shadow-xl">
                                    Step into a world of cosmic clarity and purpose with our expert guidance.
                                </p>
                                <Link
                                    to="/appointment"
                                    className="px-16 py-7 rounded-full font-black uppercase tracking-[0.3em] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(221,39,39,0.8)] bg-[#dd2727] text-white shadow-3xl text-sm"
                                >
                                    Start Your Journey
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* ── Final CTA Section ───────────────────────────────────── */}
                <section className="pb-40">
                    <div className="section-container">
                        <div className="rounded-[4rem] p-16 md:p-32 text-center bg-gradient-to-br from-[#dd2727]/20 to-black border border-[#dd2727]/30 relative overflow-hidden group shadow-2xl">
                            <div className="absolute inset-0 bg-glow-red opacity-0 group-hover:opacity-40 transition-opacity duration-1000"></div>
                            
                            <div className="relative z-10">
                                <h2 className="title-batangas text-4xl md:text-8xl text-white mb-10 leading-tight tracking-tighter uppercase">
                                    Ready for <br /> <span className="text-[#dd2727]">Transformation?</span>
                                </h2>
                                <p className="subtitle-poppins text-white/80 text-xl md:text-2xl mb-16 max-w-3xl mx-auto leading-relaxed">
                                    Our master astrologers are ready to guide you through life's cosmic complexity.
                                </p>
                                <div className="flex flex-wrap gap-8 justify-center">
                                    <Link
                                        to="/appointment"
                                        className="px-14 py-6 rounded-full font-black uppercase tracking-widest text-white transition-all duration-500 hover:-translate-y-2 bg-[#dd2727] shadow-2xl hover:shadow-[#dd2727]/50"
                                    >
                                        Schedule Now
                                    </Link>
                                    <Link
                                        to="/contact"
                                        className="px-14 py-6 rounded-full font-black uppercase tracking-widest transition-all duration-500 hover:-translate-y-2 bg-white/5 border border-white/10 text-white backdrop-blur-xl hover:bg-white hover:text-black"
                                    >
                                        Contact Us
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
};

export default ConsultingPage;
