import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/sections/Header/Header';
import Footer from '../components/sections/Footer/Footer';
import { useArticles } from '../context/ArticlesContext';
import '../components/sections/Article/ArticleSection.css';

const ArticlesPage = () => {
    const { slugMap, loading } = useArticles();
    const [searchQuery, setSearchQuery] = useState('');

    const articlesData = useMemo(() => {
        return Object.values(slugMap).sort((a, b) => {
            let dateA = 0;
            let dateB = 0;
            if (a.createdAt && a.createdAt.seconds) {
                dateA = a.createdAt.seconds * 1000;
            } else if (a.rawDate) {
                dateA = new Date(a.rawDate).getTime();
            } else if (a.data) {
                dateA = new Date(a.data).getTime();
            }

            if (b.createdAt && b.createdAt.seconds) {
                dateB = b.createdAt.seconds * 1000;
            } else if (b.rawDate) {
                dateB = new Date(b.rawDate).getTime();
            } else if (b.data) {
                dateB = new Date(b.data).getTime();
            }
            return dateB - dateA;
        });
    }, [slugMap]);

    // Filter articles based on search query
    const filteredArticles = useMemo(() => {
        if (!searchQuery.trim()) return articlesData;

        const query = searchQuery.toLowerCase();
        return articlesData.filter(article =>
            article.title?.toLowerCase().includes(query) ||
            article.description?.toLowerCase().includes(query)
        );
    }, [searchQuery, articlesData]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-transparent backdrop-blur-sm">
                <div className="text-[#dd2727] text-2xl font-bold animate-pulse uppercase tracking-widest">
                    Consulting Stars...
                </div>
            </div>
        );
    }

    return (
        <>
            <Header />
            <main className="min-h-screen relative z-10 text-white overflow-hidden bg-transparent">
                {/* Articles Hero Banner */}
                <section className="hero-section">
                    {/* Background Glows */}
                    <div className="bg-glow-container">
                        <div className="absolute top-[20%] left-[10%] w-[600px] h-[600px] bg-glow-red opacity-50"></div>
                        <div className="absolute top-[10%] right-[15%] w-[500px] h-[500px] bg-glow-gold opacity-20"></div>
                    </div>

                    <div className="section-container">
                        <div className="relative z-10 max-w-5xl w-full mx-auto text-center">
                            {/* Red Pill Label */}
                            <div className="inline-block mb-8 px-10 py-2.5 rounded-full border border-[#dd2727]/30 bg-[#dd2727]/5 shadow-[0_0_30px_rgba(221,39,39,0.1)]">
                                <span className="text-[#dd2727] text-sm font-bold uppercase tracking-[0.4em]">
                                    Sacred Insights
                                </span>
                            </div>

                            {/* Bold White Title */}
                            <h1 className="title-batangas text-5xl md:text-7xl text-white font-black mb-8 leading-[1.1] tracking-tight">
                                Cosmic Insights <br /> & <span className="text-[#dd2727]">Sacred Wisdom</span>
                            </h1>

                            {/* Red Subtitle */}
                            <p className="subtitle-poppins text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                                Explore our collection of sacred articles and astrological guidance <br className="hidden md:block" />
                                to navigate your journey through the infinite stars.
                            </p>

                            {/* Red Dot Divider */}
                            <div className="mt-16 flex items-center justify-center gap-6">
                                <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-white/10"></div>
                                <div className="w-3 h-3 rounded-full bg-[#dd2727] shadow-[0_0_20px_#dd2727,0_0_40px_#dd2727]"></div>
                                <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-white/10"></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main Content Area with Sidebar */}
                <section>
                    <div className="section-container">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                            {/* Article Grid (Main Content) */}
                            <div className="lg:col-span-9">
                                {filteredArticles.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-24 gap-x-12">
                                        {filteredArticles.map((article, index) => (
                                            <div className="article-item" key={article.id || index}>
                                                <div className="article-wrapper">
                                                    {/* Inner page content — revealed when cover opens */}
                                                    <div className="article-inner">
                                                        <h4 className="article-inner-title">{article.title}</h4>
                                                        {article.hindi && <h5 className="article-inner-hindi-title">{article.hindi}</h5>}
                                                        <div className="article-inner-meta">
                                                            {article.author && <span className="article-inner-author">By {article.author}</span>}
                                                            {(article.data || article.createdAt) && (
                                                                <span className="article-inner-date">
                                                                    {article.data || (article.createdAt?.seconds ? new Date(article.createdAt.seconds * 1000).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "")}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <Link to={`/articles/${article.id || index}`} className="article-read-more">Read More</Link>
                                                    </div>
                                                    {/* Cover — rotates open on hover */}
                                                    <div className="article-cover-container">
                                                        <div className="w-full aspect-video overflow-hidden">
                                                            <img
                                                                src={article.imageUrl || article.img}
                                                                alt={article.title}
                                                                className="w-full h-full object-cover"
                                                                loading="lazy"
                                                            />
                                                        </div>
                                                        <div className="article-cover-content">
                                                            <h4 className="article-cover-title">{article.title}</h4>
                                                            {article.author && <p className="article-cover-author">By {article.author}</p>}
                                                            {(article.data || article.createdAt) && (
                                                                <p className="article-cover-date">
                                                                    {article.data || (article.createdAt?.seconds ? new Date(article.createdAt.seconds * 1000).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "")}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-24 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-2xl">
                                        <h3 className="title-batangas text-4xl mb-6 text-white">No Wisdom Found</h3>
                                        <p className="subtitle-poppins text-white/60 text-lg">Try searching with different celestial keywords.</p>
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="mt-10 text-[#dd2727] font-bold uppercase tracking-[0.3em] hover:text-white transition-all duration-300"
                                        >
                                            Clear Search
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Sidebar */}
                            <aside className="lg:col-span-3 space-y-12">

                                {/* Search Widget */}
                                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] py-8 px-[15px] md:px-[50px] shadow-2xl">
                                    <h4 className="title-batangas text-2xl mb-8 text-white border-b border-white/10 pb-4">Search Wisdom</h4>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search topics..."
                                            className="w-full bg-white/5 border border-white/10 rounded-full px-8 py-4 text-white placeholder-white/30 focus:outline-none focus:border-[#dd2727]/50 subtitle-poppins text-sm transition-all"
                                        />
                                        <button className="absolute right-6 top-1/2 -translate-y-1/2 text-[#dd2727] hover:scale-110 transition-transform">
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Sacred Wisdom (Dynamic Articles List) */}
                                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] py-10 px-[15px] md:px-[50px] shadow-2xl">
                                    <h4 className="title-batangas text-2xl mb-8 text-white border-b border-white/10 pb-4">Sacred Wisdom</h4>
                                    <ul className="space-y-6 subtitle-poppins text-base">
                                        {articlesData.map((article, i) => (
                                            <li key={article.id || i} className="group">
                                                <Link to={`/articles/${article.id}`} className="flex gap-4 text-white/60 hover:text-[#dd2727] transition-all duration-300">
                                                    <span className="text-[#dd2727] font-black text-xl group-hover:scale-125 transition-transform">•</span>
                                                    <span className="leading-relaxed group-hover:translate-x-2 transition-transform font-medium">{article.title}</span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Premium CTA Sidebar Banner */}
                                <div className="relative rounded-[2.5rem] overflow-hidden group shadow-[0_25px_60px_rgba(221,39,39,0.4)] transition-all duration-700 hover:-translate-y-2">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#dd2727] via-[#dd2727] to-[#801313] opacity-100"></div>
                                    <div className="relative z-10 py-12 px-[15px] md:px-[50px] text-center">
                                        <h4 className="title-batangas text-4xl mb-6 !text-white leading-tight drop-shadow-2xl">
                                            Unlock Your <br /> Destiny
                                        </h4>
                                        <p className="subtitle-poppins text-base text-white/95 mb-10 leading-relaxed font-medium">
                                            Get a personalized cosmic consultation today and align with your true purpose.
                                        </p>
                                        <Link to="/consulting" className="inline-block w-full py-5 rounded-full bg-white text-[#dd2727] font-bold uppercase tracking-[0.2em] text-sm hover:bg-black hover:text-white transition-all shadow-2xl hover:scale-105 active:scale-95 duration-500">
                                            Book Now
                                        </Link>
                                    </div>
                                    <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-white/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                                </div>

                            </aside>
                        </div>
                    </div>
                </section>

                {/* Newsletter Section */}
                <section>
                    <div className="bg-glow-container">
                        <div className="absolute bottom-0 right-[10%] w-[700px] h-[700px] bg-glow-red opacity-20"></div>
                    </div>
                    <div className="section-container">
                        <div className="bg-white/5 backdrop-blur-2xl border border-[#dd2727]/30 rounded-[4rem] py-16 md:py-24 px-[15px] md:px-[50px] text-center max-w-5xl mx-auto shadow-[0_30px_100px_rgba(221,39,39,0.15)] relative overflow-hidden group">
                            <div className="absolute inset-0 bg-glow-red opacity-0 group-hover:opacity-40 transition-opacity duration-1000"></div>
                            <div className="relative z-10">
                                <div className="inline-block mb-8 px-8 py-2 rounded-full border border-white/10 bg-white/5">
                                    <span className="text-white/60 text-xs font-bold uppercase tracking-[0.4em]">Stay Connected</span>
                                </div>
                                <h2 className="title-batangas text-4xl md:text-7xl mb-8 text-white">Never Miss a <span className="text-[#dd2727]">Cosmic Update</span></h2>
                                <p className="subtitle-poppins text-white/80 mb-12 max-w-2xl mx-auto text-xl leading-relaxed">
                                    Subscribe to our newsletter to receive the latest astrological insights and exclusive offers directly in your inbox.
                                </p>
                                <form className="flex flex-col md:flex-row gap-6 justify-center max-w-2xl mx-auto" onSubmit={(e) => e.preventDefault()}>
                                    <input
                                        type="email"
                                        placeholder="Enter your email address"
                                        className="px-10 py-6 rounded-full bg-white/5 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-[#dd2727]/50 flex-grow subtitle-poppins text-lg transition-all"
                                    />
                                    <button className="px-14 py-6 rounded-full font-bold uppercase tracking-[0.2em] transition-all duration-500 bg-white text-black hover:bg-[#dd2727] hover:text-white shadow-2xl hover:-translate-y-1">
                                        Subscribe
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
};

export default ArticlesPage;

