import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/sections/Header/Header';
import Footer from '../components/sections/Footer/Footer';
import { db } from '../firebaseConfig';
import { collection, getDocs, limit, query } from 'firebase/firestore';

/* ─── Consulting Services Data ──────────────────────────────── */
const consultServices = [
    {
        title: 'Personalized Astrological Guidance',
        description:
            'Dive deep into your unique astrological chart for clarity on relationships, career, and personal growth.',
        img: '/src/assets/img/about-1.webp',
        icon: '⭐',
    },
    {
        title: 'Life Path & Destiny Consultation',
        description:
            "Unlock your life's purpose, navigate challenges, and seize opportunities by exploring your unique astrological blueprint.",
        img: '/src/assets/img/self.webp',
        icon: '🌙',
    },
    {
        title: 'Career & Success Consultation',
        description:
            'Identify your ideal career path, unlock potential, and align your work with the strengths in your astrological chart.',
        img: '/src/assets/img/foundation.webp',
        icon: '🚀',
    },
    {
        title: 'Relationship Compatibility Reading',
        description:
            'Analyze relationship dynamics for better communication and harmony through astrological compatibility.',
        img: '/src/assets/img/about-2.webp',
        icon: '💫',
    },
    {
        title: 'Remedial Astrology Consultation',
        description:
            'Address planetary imbalances with proven astrological remedies tailored to your birth chart.',
        img: '/src/assets/img/about-3.webp',
        icon: '🔮',
    },
    {
        title: 'Ongoing Support & Guidance',
        description:
            'Stay aligned with personalized follow-up sessions and continuous cosmic support on your journey.',
        img: '/src/assets/img/about-4.webp',
        icon: '✨',
    },
];

const processSteps = [
    { step: '01', title: 'Book a Session', desc: 'Choose your preferred consultation type and schedule at your convenience.' },
    { step: '02', title: 'Share Your Details', desc: 'Provide your birth date, time, and place for accurate chart analysis.' },
    { step: '03', title: 'Get Insights', desc: 'Receive personalized cosmic insights from our expert astrologers.' },
    { step: '04', title: 'Transform Your Life', desc: 'Apply the guidance and experience meaningful positive changes.' },
];

/* ─── Component ─────────────────────────────────────────────── */
const ConsultingPage = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [activeCard, setActiveCard] = useState(null);

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

    return (
        <>
            <Header />
            <main className="min-h-screen relative z-10 text-white overflow-hidden bg-transparent">

                {/* ── Hero Banner ───────────────────────────────────────── */}
                <section className="relative w-full min-h-[50vh] pt-32 pb-16 px-4 flex flex-col items-center justify-center text-center overflow-hidden">
                    {/* Glowing orbs */}
                    <div
                        className="absolute top-20 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
                        style={{
                            background: 'radial-gradient(circle, rgba(221,39,39,0.18) 0%, transparent 70%)',
                            filter: 'blur(60px)',
                        }}
                    />
                    <div
                        className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
                        style={{
                            background: 'radial-gradient(circle, rgba(221,39,39,0.12) 0%, transparent 70%)',
                            filter: 'blur(80px)',
                        }}
                    />

                    <div className="relative z-10 max-w-4xl mx-auto">
                        <span
                            className="inline-block px-5 py-2 rounded-full text-xs font-bold uppercase tracking-[0.25em] mb-6 border"
                            style={{
                                background: 'rgba(221,39,39,0.12)',
                                borderColor: 'rgba(221,39,39,0.35)',
                                color: '#ff6b6b',
                            }}
                        >
                            ✦ Expert Astrological Consulting
                        </span>

                        <h1
                            className="title-batangas text-6xl mb-6 leading-tight"
                            style={{ color: '#fff' }}
                        >
                            Empower Your Life with{' '}
                            <span style={{ color: '#dd2727' }}>Vahlay Astro</span>
                        </h1>

                        <p className="subtitle-poppins text-lg md:text-xl text-white/75 max-w-2xl mx-auto mb-10 leading-relaxed">
                            Unlock your potential with expert astrological consulting. Discover clarity,
                            purpose, and balance in every aspect of your life's cosmic journey.
                        </p>

                        <div className="flex flex-wrap gap-4 justify-center">
                            <Link
                                to="/appointment"
                                className="inline-block px-10 py-4 rounded-full font-bold uppercase tracking-wider text-white transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(221,39,39,0.5)]"
                                style={{
                                    background: 'linear-gradient(135deg, #dd2727, #a01818)',
                                    boxShadow: '0 8px 30px rgba(221,39,39,0.35)',
                                }}
                            >
                                Book Consultation Now
                            </Link>
                            <a
                                href="#services"
                                className="inline-block px-10 py-4 rounded-full font-bold uppercase tracking-wider transition-all duration-500 hover:-translate-y-1"
                                style={{
                                    background: 'rgba(255,255,255,0.06)',
                                    border: '1px solid rgba(255,255,255,0.15)',
                                    color: '#fff',
                                    backdropFilter: 'blur(12px)',
                                }}
                            >
                                Explore Services
                            </a>
                        </div>

                        {/* Stats row */}
                        <div className="flex flex-wrap justify-center gap-8 mt-16">
                            {[
                                { num: '5000+', label: 'Consultations Done' },
                                { num: '98%', label: 'Client Satisfaction' },
                                { num: '10+', label: 'Years Experience' },
                                { num: '50+', label: 'Cosmic Services' },
                            ].map((s, i) => (
                                <div key={i} className="text-center">
                                    <div
                                        className="title-batangas text-3xl md:text-4xl font-bold"
                                        style={{ color: '#dd2727' }}
                                    >
                                        {s.num}
                                    </div>
                                    <div className="subtitle-poppins text-white/60 text-sm mt-1">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Consulting Services Grid ──────────────────────────── */}
                <section id="services" className="max-w-[1170px] mx-auto px-4 py-20">
                    <div className="text-center mb-14">
                        <span
                            className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-4 border"
                            style={{
                                background: 'rgba(221,39,39,0.1)',
                                borderColor: 'rgba(221,39,39,0.3)',
                                color: '#ff6b6b',
                            }}
                        >
                            What We Offer
                        </span>
                        <h2 className="title-batangas text-4xl md:text-5xl text-white mb-4">
                            Explore Our Consulting Services
                        </h2>
                        <p className="subtitle-poppins text-white/65 max-w-xl mx-auto text-base">
                            Each session is crafted personally — no two readings are ever the same.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {consultServices.map((srv, i) => (
                            <div
                                key={i}
                                onMouseEnter={() => setActiveCard(i)}
                                onMouseLeave={() => setActiveCard(null)}
                                className="group rounded-[2rem] overflow-hidden flex flex-col transition-all duration-500 cursor-pointer"
                                style={{
                                    background: activeCard === i
                                        ? 'rgba(255,255,255,0.08)'
                                        : 'rgba(255,255,255,0.04)',
                                    border: activeCard === i
                                        ? '1px solid rgba(221,39,39,0.45)'
                                        : '1px solid rgba(255,255,255,0.08)',
                                    backdropFilter: 'blur(16px)',
                                    boxShadow: activeCard === i
                                        ? '0 20px 60px rgba(221,39,39,0.25)'
                                        : '0 10px 40px rgba(0,0,0,0.2)',
                                    transform: activeCard === i ? 'translateY(-8px)' : 'translateY(0)',
                                }}
                            >
                                {/* Image */}
                                <div className="aspect-[3/2] overflow-hidden relative">
                                    <img
                                        src={srv.img}
                                        alt={srv.title}
                                        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            background:
                                                'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)',
                                        }}
                                    />
                                    <span className="absolute top-4 left-4 text-3xl">{srv.icon}</span>
                                </div>

                                {/* Content */}
                                <div className="p-7 flex flex-col flex-1">
                                    <h3
                                        className="title-batangas text-xl mb-3 transition-colors duration-300"
                                        style={{ color: activeCard === i ? '#ff6b6b' : '#dd2727' }}
                                    >
                                        {srv.title}
                                    </h3>
                                    <p className="subtitle-poppins text-white/70 text-sm leading-relaxed flex-1">
                                        {srv.description}
                                    </p>
                                    <Link
                                        to="/appointment"
                                        className="mt-6 inline-block font-bold text-sm uppercase tracking-wider transition-all duration-300"
                                        style={{ color: '#dd2727' }}
                                        onMouseOver={(e) => (e.currentTarget.style.color = '#fff')}
                                        onMouseOut={(e) => (e.currentTarget.style.color = '#dd2727')}
                                    >
                                        Book An Appointment →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── How It Works ─────────────────────────────────────── */}
                <section className="max-w-[1170px] mx-auto px-4 py-16">
                    <div
                        className="rounded-[2.5rem] p-12 relative overflow-hidden"
                        style={{
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            backdropFilter: 'blur(20px)',
                        }}
                    >
                        {/* BG glow */}
                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                background:
                                    'radial-gradient(ellipse at center, rgba(221,39,39,0.08) 0%, transparent 70%)',
                            }}
                        />

                        <div className="relative z-10">
                            <div className="text-center mb-12">
                                <span
                                    className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-4 border"
                                    style={{
                                        background: 'rgba(221,39,39,0.1)',
                                        borderColor: 'rgba(221,39,39,0.3)',
                                        color: '#ff6b6b',
                                    }}
                                >
                                    Simple Process
                                </span>
                                <h2 className="title-batangas text-4xl md:text-5xl text-white">
                                    How It Works
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                {processSteps.map((step, i) => (
                                    <div key={i} className="text-center group">
                                        <div
                                            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 transition-all duration-300 group-hover:scale-110"
                                            style={{
                                                background: 'linear-gradient(135deg, rgba(221,39,39,0.3), rgba(221,39,39,0.1))',
                                                border: '1px solid rgba(221,39,39,0.4)',
                                                boxShadow: '0 0 20px rgba(221,39,39,0.2)',
                                            }}
                                        >
                                            <span
                                                className="title-batangas text-xl font-bold"
                                                style={{ color: '#dd2727' }}
                                            >
                                                {step.step}
                                            </span>
                                        </div>
                                        <h3 className="title-batangas text-lg text-white mb-2">{step.title}</h3>
                                        <p className="subtitle-poppins text-white/60 text-sm leading-relaxed">
                                            {step.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Testimonials ─────────────────────────────────────── */}
                {testimonials.length > 0 && (
                    <section className="max-w-[1170px] mx-auto px-4 py-16">
                        <div className="text-center mb-12">
                            <span
                                className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-4 border"
                                style={{
                                    background: 'rgba(221,39,39,0.1)',
                                    borderColor: 'rgba(221,39,39,0.3)',
                                    color: '#ff6b6b',
                                }}
                            >
                                Client Stories
                            </span>
                            <h2 className="title-batangas text-4xl md:text-5xl text-white">
                                What Our Clients Say
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {testimonials.map((t, i) => (
                                <div
                                    key={t.id || i}
                                    className="rounded-[2rem] p-8 flex flex-col transition-all duration-500 hover:-translate-y-2"
                                    style={{
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        backdropFilter: 'blur(16px)',
                                        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                                    }}
                                >
                                    <div className="text-3xl mb-4" style={{ color: '#dd2727' }}>
                                        "
                                    </div>
                                    <p className="subtitle-poppins text-white/80 italic leading-relaxed flex-1 text-sm">
                                        {t.review || t.message || t.text || 'Incredible experience!'}
                                    </p>
                                    <div className="mt-6 flex items-center gap-3">
                                        <div
                                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                                            style={{ background: 'linear-gradient(135deg, #dd2727, #a01818)' }}
                                        >
                                            {(t.name || t.clientName || 'C')[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="text-white font-semibold text-sm">
                                                {t.name || t.clientName || 'Happy Client'}
                                            </div>
                                            <div className="text-white/45 text-xs">Verified Client</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ── Consulting Image Highlight ────────────────────────── */}
                <section className="max-w-[1170px] mx-auto px-4 py-12">
                    <div
                        className="rounded-[2.5rem] overflow-hidden relative"
                        style={{
                            border: '1px solid rgba(221,39,39,0.2)',
                            boxShadow: '0 20px 70px rgba(221,39,39,0.15)',
                        }}
                    >
                        <img
                            src="/src/assets/img/consulting.webp"
                            alt="Consulting"
                            className="w-full h-[400px] md:h-[520px] object-cover object-center"
                        />
                        <div
                            className="absolute inset-0 flex flex-col items-center justify-center text-center p-8"
                            style={{
                                background:
                                    'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
                            }}
                        >
                            <h2
                                className="title-batangas text-4xl md:text-6xl text-white mb-4"
                                style={{ textShadow: '0 4px 30px rgba(0,0,0,0.8)' }}
                            >
                                Align with the Stars
                            </h2>
                            <p className="subtitle-poppins text-white/80 max-w-xl mb-8 text-lg">
                                Book your personalized consultation today and step into a world of clarity, purpose, and cosmic balance.
                            </p>
                            <Link
                                to="/appointment"
                                className="inline-block px-12 py-4 rounded-full font-bold uppercase tracking-wider transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(221,39,39,0.6)]"
                                style={{
                                    background: 'linear-gradient(135deg, #dd2727, #a01818)',
                                    boxShadow: '0 8px 30px rgba(221,39,39,0.4)',
                                    color: '#fff',
                                }}
                            >
                                Schedule a Session
                            </Link>
                        </div>
                    </div>
                </section>

                {/* ── Final CTA ─────────────────────────────────────────── */}
                <section className="max-w-[1170px] mx-auto px-4 py-20">
                    <div
                        className="rounded-[2rem] p-12 text-center"
                        style={{
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(221,39,39,0.25)',
                            backdropFilter: 'blur(20px)',
                            boxShadow: '0 15px 60px rgba(221,39,39,0.2)',
                        }}
                    >
                        <h2 className="title-batangas text-3xl md:text-5xl text-white mb-5">
                            Ready to Transform Your Life?
                        </h2>
                        <p className="subtitle-poppins text-white/70 text-lg mb-10 max-w-xl mx-auto">
                            Our expert astrologers are ready to guide you through life's challenges with personalized cosmic insights.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Link
                                to="/appointment"
                                className="inline-block px-10 py-4 rounded-full font-bold uppercase tracking-wider text-white transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(221,39,39,0.5)]"
                                style={{
                                    background: 'linear-gradient(135deg, #dd2727, #a01818)',
                                    boxShadow: '0 8px 30px rgba(221,39,39,0.35)',
                                }}
                            >
                                Book Now
                            </Link>
                            <Link
                                to="/contact"
                                className="inline-block px-10 py-4 rounded-full font-bold uppercase tracking-wider transition-all duration-500 hover:-translate-y-1"
                                style={{
                                    background: 'rgba(255,255,255,0.06)',
                                    border: '1px solid rgba(255,255,255,0.15)',
                                    color: '#fff',
                                    backdropFilter: 'blur(12px)',
                                }}
                            >
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </section>

            </main>
            <Footer />
        </>
    );
};

export default ConsultingPage;
