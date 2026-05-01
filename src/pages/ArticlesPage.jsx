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
            <div className="min-h-screen flex items-center justify-center bg-black">
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
                 {/* Articles Hero Banner (Classic & Premium Style - Perfected Spacing) */}
                <section className="relative w-full pt-10 pb-4 md:pt-16 md:pb-16 lg:pt-10 lg:pb-10 flex items-center justify-center overflow-hidden bg-transparent border-b border-white/5 min-h-[50vh]">
                    <div className="relative z-10 max-w-5xl w-full mx-4 text-center">
                        {/* Red Pill Label */}
                        <div className="inline-block mb-8 px-10 py-2.5 rounded-full border border-[#dd2727]/30 bg-[#dd2727]/5 shadow-[0_0_30px_rgba(221,39,39,0.1)]">
                            <span className="text-[#dd2727] text-sm font-bold uppercase tracking-[0.4em]">
                                Sacred Insights
                            </span>
                        </div>
                        
                        {/* Bold White Title */}
                        <h1 className="title-batangas text-5xl md:text-7xl text-white font-black mb-8 leading-[1.1] tracking-tight">
                            Cosmic Insights <br /> & Wisdom
                        </h1>

                        {/* Red Subtitle */}
                        <p className="subtitle-poppins text-lg text-[#dd2727] max-w-2xl mx-auto leading-relaxed  drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)]">
                            Explore our collection of sacred articles and astrological guidance <br className="hidden md:block" /> 
                            to navigate your journey through the infinite stars.
                        </p>

                        {/* Red Dot Divider with extra breathing room */}
                        <div className="mt-16 flex items-center justify-center gap-6">
                            <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-white/10"></div>
                            <div className="w-3 h-3 rounded-full bg-[#dd2727] shadow-[0_0_20px_#dd2727,0_0_40px_#dd2727]"></div>
                            <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-white/10"></div>
                        </div>
                    </div>
                </section>
                
                {/* Main Content Area with Sidebar */}
                <section className="max-w-[1300px] mx-auto px-4 py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                        
                        {/* Article Grid (Main Content) */}
                        <div className="lg:col-span-9">
                            {filteredArticles.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-20 gap-x-10">
                                    {filteredArticles.map((article, index) => (
                                        <div className="article-item" key={article.id || index}>
                                            <div className="article-wrapper">
                                                {/* Inner page content — revealed when cover opens */}
                                                <div className="article-inner">
                                                    <h4 className="article-inner-title">{article.title}</h4>
                                                    {article.hindi && <h5 className="article-inner-hindi-title">{article.hindi}</h5>}
                                                    <div className="article-inner-meta">
                                                        {article.author && <span className="article-inner-author">By {article.author}</span>}
                                                        {article.data && <span className="article-inner-date">{article.data}</span>}
                                                    </div>
                                                    <Link to={`/articles/${article.id || index}`} className="article-read-more">Read More</Link>
                                                </div>
                                                {/* Cover — rotates open on hover */}
                                                <div className="article-cover-container">
                                                    <img
                                                        src={article.imageUrl || article.img}
                                                        alt={article.title}
                                                        className="article-cover"
                                                        loading="lazy"
                                                    />
                                                    <div className="article-cover-content">
                                                        <h4 className="article-cover-title">{article.title}</h4>
                                                        {article.author && <p className="article-cover-author">By {article.author}</p>}
                                                        {article.data && <p className="article-cover-date">{article.data}</p>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-xl">
                                    <h3 className="title-batangas text-3xl mb-4 text-white">No Wisdom Found</h3>
                                    <p className="subtitle-poppins text-white/60">Try searching with different celestial keywords.</p>
                                    <button 
                                        onClick={() => setSearchQuery('')}
                                        className="mt-8 text-[#dd2727] font-bold uppercase tracking-widest hover:text-white transition-colors"
                                    >
                                        Clear Search
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <aside className="lg:col-span-3 space-y-12">
                            
                            {/* Search Widget */}
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-4 shadow-xl">
                                <h4 className="title-batangas text-xl mb-6 text-white border-b border-white/10 pb-4">Search Wisdom</h4>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search topics..." 
                                        className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#dd2727]/50 subtitle-poppins text-sm transition-all"
                                    />
                                    <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[#dd2727]">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                    </button>
                                </div>
                            </div>

                            {/* Sacred Wisdom (Dynamic Articles List) */}
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-xl">
                                <h4 className="title-batangas text-xl mb-6 text-white border-b border-white/10 pb-4">Sacred Wisdom</h4>
                                <ul className="space-y-5 subtitle-poppins text-sm">
                                    {articlesData.map((article, i) => (
                                        <li key={article.id || i} className="group">
                                            <Link to={`/articles/${article.id}`} className="flex gap-3 text-white/60 hover:text-[#dd2727] transition-all duration-300">
                                                <span className="text-[#dd2727] mt-1">•</span>
                                                <span className="leading-relaxed group-hover:translate-x-1 transition-transform">{article.title}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Premium CTA Sidebar Banner */}
                            <div className="relative rounded-[2rem] overflow-hidden group shadow-[0_20px_50px_rgba(221,39,39,0.3)]">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#dd2727] via-[#dd2727] to-[#ff6b35] opacity-100"></div>
                                <div className="relative z-10 p-10 text-center">
                                    <h4 className="title-batangas text-3xl mb-4 !text-white leading-tight drop-shadow-lg">
                                        Unlock Your <br /> Personal Destiny
                                    </h4>
                                    <p className="subtitle-poppins text-sm text-white/90 mb-8 leading-relaxed">
                                        Get a personalized cosmic consultation today and align with your true purpose.
                                    </p>
                                    <Link to="/contact" className="inline-block w-full py-4 rounded-full bg-white text-[#dd2727] font-bold uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-all shadow-xl hover:scale-105 active:scale-95 duration-300">
                                        Book Now
                                    </Link>
                                </div>
                                {/* Decorative Element */}
                                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                            </div>

                        </aside>
                    </div>
                </section>

                {/* Newsletter Section */}
                <section className="max-w-[1170px] mx-auto px-4 pb-28">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-12 md:p-20 text-center max-w-5xl mx-auto shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
                        <div className="inline-block mb-6 px-6 py-1.5 rounded-full border border-white/10 bg-white/5">
                            <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Stay Connected</span>
                        </div>
                        <h2 className="title-batangas text-4xl md:text-5xl mb-6 text-white">Never Miss a Cosmic Update</h2>
                        <p className="subtitle-poppins text-white/70 mb-10 max-w-xl mx-auto text-lg leading-relaxed">
                            Subscribe to our newsletter to receive the latest astrological insights and exclusive offers directly in your inbox.
                        </p>
                        <form className="flex flex-col md:flex-row gap-4 justify-center max-w-2xl mx-auto" onSubmit={(e) => e.preventDefault()}>
                            <input 
                                type="email" 
                                placeholder="Enter your email address" 
                                className="px-8 py-5 rounded-full bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#dd2727]/50 flex-grow subtitle-poppins transition-all"
                            />
                            <button className="px-12 py-5 rounded-full font-bold uppercase tracking-widest transition-all duration-500 bg-white text-black hover:bg-[#dd2727] hover:text-white shadow-xl">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
};

export default ArticlesPage;

