import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/sections/Header/Header';
import Footer from '../components/sections/Footer/Footer';
import { useArticles } from '../context/ArticlesContext';
import { RiShareForwardFill, RiFacebookFill, RiTwitterFill, RiLinkedinFill, RiWhatsappFill } from "react-icons/ri";
import { Helmet } from 'react-helmet';

const ArticleDetailsPage = () => {
    const { id } = useParams();
    const { slugMap, loading } = useArticles();
    
    const [language, setLanguage] = useState("hindi");
    const [expandedArticle, setExpandedArticle] = useState(null);
    const [expandedAccordion, setExpandedAccordion] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showShareOptions, setShowShareOptions] = useState(false);

    // Find article by ID or Slug
    const article = React.useMemo(() => {
        const values = Object.values(slugMap);
        return values.find(a => a.id === id || a.slug === id);
    }, [id, slugMap]);

    const otherArticles = React.useMemo(() => {
        return Object.values(slugMap).filter(a => a.id !== article?.id).sort((a, b) => {
            return (new Date(b.createdAt?.seconds * 1000) || 0) - (new Date(a.createdAt?.seconds * 1000) || 0);
        });
    }, [slugMap, article]);

    // Language toggle
    const toggleLanguage = () => {
        setLanguage(prev => prev === "hindi" ? "english" : "hindi");
    };

    // Share functionality
    const handleShareClick = () => setShowShareOptions(!showShareOptions);
    const handleClickOutside = (e) => {
        if (!e.target.closest('.share-container')) setShowShareOptions(false);
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Social sharing functions
    const shareOnFacebook = () => window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
        'facebook-share-dialog',
        'width=800,height=600'
    );

    const shareOnTwitter = () => window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(article?.title || '')}&url=${encodeURIComponent(window.location.href)}`,
        'twitter-share',
        'width=800,height=600'
    );

    const shareOnWhatsApp = () => window.open(
        `whatsapp://send?text=${encodeURIComponent(`${article?.title || ''} ${window.location.href}`)}`,
        '_blank'
    );

    const shareOnLinkedIn = () => window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
        'linkedin-share',
        'width=800,height=600'
    );

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const toggleDropdown = (articleId) => setExpandedArticle(prev => prev === articleId ? null : articleId);
    const toggleAccordion = (index) => setExpandedAccordion(prev => prev === index ? null : index);

    const getMetaTags = () => {
        if (!article) return null;
        const descriptionText = language === "hindi" ?
            (article.dhindi || "").substring(0, 160) :
            (article.denglish || article.description || "").substring(0, 160);

        return (
            <Helmet>
                <title>{article.sTitle || article.title || 'Astrology Article'} - Vahlay Astro</title>
                <meta name="description" content={article.sDesc || article.description || descriptionText || 'Astrology Article'} />
                <meta
                    name="keywords"
                    content={
                        Array.isArray(article.sKeywords)
                            ? article.sKeywords.join(', ')
                            : article.sKeywords || 'astrology, vahlay astro'
                    }
                />
            </Helmet>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-transparent backdrop-blur-sm">
                <div className="text-[#dd2727] text-2xl font-bold animate-pulse">
                    Decoding Celestial Message...
                </div>
            </div>
        );
    }

    if (!article) {
        return (
            <>
                <Header />
                <main className="min-h-screen relative z-10 text-white flex items-center justify-center bg-black">
                    <div className="text-center">
                        <h1 className="title-batangas text-5xl mb-6">Article Not Found</h1>
                        <Link to="/articles" className="text-[#dd2727] hover:text-white transition-colors font-bold uppercase tracking-widest">
                            ← Back to Articles
                        </Link>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            {getMetaTags()}
            <Header />
            <main className="min-h-screen relative z-10 text-white overflow-hidden bg-transparent">
                
                {/* Page Title Header */}
                <div className="pt-24 md:pt-32 pb-12 px-4 text-center border-b border-white/5 mb-8 bg-black/40 backdrop-blur-sm shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                    <h1 className="title-batangas text-6xl font-bold tracking-wide text-white uppercase">
                        <span className="text-[#dd2727]">Astrology</span> Articles & Publications
                    </h1>
                    {article && (
                        <p className="mt-4 text-white/70 subtitle-poppins text-sm md:text-base tracking-wide">
                            Articles on Astrology By <strong className="text-white">Valay Patel</strong>
                        </p>
                    )}
                </div>

                <section className="max-w-[1170px] mx-auto px-4 pb-20 flex flex-col lg:flex-row gap-8">
                    
                    {/* Left Column: Article Content */}
                    <article className="lg:w-3/4 bg-white/5 backdrop-blur-md p-6 md:p-10 rounded-[2rem] border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
                        
                        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6 gap-2">
                            {/* Left: Back to Articles */}
                            <div className="flex-1 flex justify-start">
                                <Link to="/articles" className="inline-flex items-center bg-[#dd2727] text-white px-3 md:px-5 py-2 text-[10px] md:text-sm font-bold tracking-widest uppercase rounded-full hover:bg-white hover:text-[#dd2727] transition-colors whitespace-nowrap shadow-[0_0_15px_rgba(221,39,39,0.3)]">
                                    ← <span className="hidden sm:inline ml-2">Back</span>
                                </Link>
                            </div>

                            {/* Center: Language Toggle */}
                            <div className="flex-1 flex justify-center">
                                <button
                                    onClick={toggleLanguage}
                                    className="bg-[#dd2727] text-white px-3 md:px-5 py-2 text-[10px] md:text-sm font-bold tracking-widest uppercase rounded-full hover:bg-white hover:text-[#dd2727] transition-colors whitespace-nowrap shadow-[0_0_15px_rgba(221,39,39,0.3)]"
                                >
                                    {language === "hindi" ? "In English" : "हिंदी में"}
                                </button>
                            </div>

                            {/* Right: Share Button */}
                            <div className="flex-1 flex justify-end relative share-container">
                                <button
                                    onClick={handleShareClick}
                                    className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-3 md:px-5 py-2 rounded-full transition-colors border border-white/20 text-[10px] md:text-sm"
                                >
                                    <RiShareForwardFill className="w-4 h-4 md:w-5 md:h-5" />
                                    <span className="font-medium tracking-wider uppercase hidden sm:inline">Share</span>
                                </button>

                                {showShareOptions && (
                                    <div className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-lg rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-white/20 z-50 overflow-hidden">
                                        {[
                                            { icon: RiFacebookFill, color: "text-blue-500", action: shareOnFacebook, text: "Facebook" },
                                            { icon: RiTwitterFill, color: "text-blue-400", action: shareOnTwitter, text: "Twitter" },
                                            { icon: RiLinkedinFill, color: "text-blue-600", action: shareOnLinkedIn, text: "LinkedIn" },
                                            { icon: RiWhatsappFill, color: "text-green-500", action: shareOnWhatsApp, text: "WhatsApp" },
                                            { icon: RiShareForwardFill, color: "text-gray-300", action: copyToClipboard, text: "Copy Link" },
                                        ].map((item, index) => (
                                            <button
                                                key={index}
                                                onClick={item.action}
                                                className="w-full px-4 py-3 text-left hover:bg-white/10 flex items-center transition-colors border-b border-white/5 last:border-0"
                                            >
                                                <item.icon className={`${item.color} mr-3 text-lg`} />
                                                <span className="text-sm tracking-wide text-white/90">{item.text}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="w-full h-64 md:h-[400px] rounded-[1.5rem] overflow-hidden mb-8 border border-white/10 bg-white/5 flex items-center justify-center">
                            <img src={article.imageUrl || article.img} alt={article.title} className="w-full h-full object-cover" />
                        </div>

                        <h1 className="title-batangas text-2xl md:text-3xl lg:text-4xl mb-6 leading-tight text-white">
                            {language === "hindi" && article.hindi ? article.hindi : article.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-white/10">
                            <span className="text-[#dd2727] font-bold text-lg">Vahlay Astro</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-white/50"></span>
                            <span className="subtitle-poppins text-white/60">{article.data || "Sacred Date"}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-white/50"></span>
                            <span className="subtitle-poppins text-white/60">{article.author || "By Valay Patel"}</span>
                        </div>

                        <div className="subtitle-poppins text-white/80 space-y-8 text-lg leading-relaxed">
                            {article.description && (
                                <p className="text-xl md:text-2xl font-medium text-white/95 border-l-4 border-[#dd2727] pl-8 py-2 italic mb-8">
                                    {article.description}
                                </p>
                            )}
                            <div className="whitespace-pre-wrap">
                                {language === "hindi" && article.dhindi 
                                    ? article.dhindi 
                                    : (article.denglish || article.content || "No content available for this article.")}
                            </div>

                            {article.referenceLink && (
                                <div className="mt-8 pt-8 border-t border-white/10">
                                    <a
                                        href={article.referenceLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-[#dd2727] hover:text-white transition-colors font-medium tracking-wide"
                                    >
                                        <span className="bg-[#dd2727]/20 p-2 rounded-full">▶</span> 
                                        Watch Reference Video
                                    </a>
                                </div>
                            )}
                        </div>          
                    </article>

                    {/* Right Column: Sidebar (Desktop) */}
                    <aside className="hidden lg:block w-1/4 bg-white/5 backdrop-blur-md p-6 rounded-[2rem] border border-white/10 shadow-lg h-fit sticky top-10">
                        <h3 className="text-2xl title-batangas text-white mb-6 border-b border-white/10 pb-4">Other Articles</h3>
                        <ul className="space-y-4">
                            {otherArticles.slice(0, 8).map((item) => (
                                <li key={item.id} className="flex flex-col">
                                    <div
                                        className="flex items-center cursor-pointer p-3 rounded-xl hover:bg-white/10 transition-colors border border-transparent hover:border-white/10"
                                        onClick={() => toggleDropdown(item.id)}
                                    >
                                        <span className="text-[#dd2727] mr-3">✦</span>
                                        <span className="text-white/90 font-medium tracking-wide text-sm line-clamp-2">
                                            {language === "hindi" && item.hindi ? item.hindi : item.title}
                                        </span>
                                    </div>

                                    {expandedArticle === item.id && (
                                        <div className="bg-black/30 border-l-4 border-[#dd2727] mt-2 p-4 rounded-r-xl shadow-inner ml-2">
                                            <p className="text-white/70 text-sm leading-relaxed mb-3 line-clamp-3">
                                                {(language === "hindi" && item.dhindi ? item.dhindi : (item.denglish || item.content))?.substring(0, 150) + "..."}
                                            </p>
                                            <Link
                                                to={`/articles/${item.slug || item.id}`}
                                                className="text-[#dd2727] text-sm font-bold uppercase tracking-widest hover:text-white transition-colors"
                                            >
                                                Read More →
                                            </Link>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </aside>


                    {/* Mobile Side-drawer */}
                    {isSidebarOpen && (
                        <div className="lg:hidden fixed inset-0 z-50 flex justify-end">
                            <div 
                                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                                onClick={() => setIsSidebarOpen(false)}
                            />
                            <aside className="relative w-[85%] max-w-sm h-full bg-[#0a0a0a] border-l border-white/10 shadow-2xl overflow-y-auto transform transition-transform p-6 flex flex-col">
                                <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                                    <h3 className="text-2xl title-batangas text-white">Other Articles</h3>
                                    <button 
                                        onClick={() => setIsSidebarOpen(false)}
                                        className="text-white/60 hover:text-white text-2xl"
                                    >
                                        ×
                                    </button>
                                </div>
                                <ul className="space-y-4 flex-1">
                                    {otherArticles.map((item) => (
                                        <li key={item.id} className="flex flex-col">
                                            <div
                                                className="flex items-center cursor-pointer p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
                                                onClick={() => toggleDropdown(item.id)}
                                            >
                                                <span className="text-[#dd2727] mr-3">✦</span>
                                                <span className="text-white/90 font-medium tracking-wide text-sm">
                                                    {language === "hindi" && item.hindi ? item.hindi : item.title}
                                                </span>
                                            </div>

                                            {expandedArticle === item.id && (
                                                <div className="bg-white/5 border-l-4 border-[#dd2727] mt-2 p-4 rounded-r-xl ml-2">
                                                    <p className="text-white/70 text-sm leading-relaxed mb-3 line-clamp-3">
                                                        {(language === "hindi" && item.dhindi ? item.dhindi : (item.denglish || item.content))?.substring(0, 150) + "..."}
                                                    </p>
                                                    <Link
                                                        to={`/articles/${item.slug || item.id}`}
                                                        onClick={() => setIsSidebarOpen(false)}
                                                        className="text-[#dd2727] text-sm font-bold uppercase tracking-widest hover:text-white transition-colors"
                                                    >
                                                        Read More →
                                                    </Link>
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </aside>
                        </div>
                    )}

                </section>

                {/* Related Articles Accordion */}
                <section className="max-w-[1170px] mx-auto px-4 pb-32">
                    <h2 className="title-batangas text-4xl text-white mb-10 text-center">
                        <span className="text-[#dd2727]">Related</span> Celestial Knowledge
                    </h2>
                    
                    <div className="grid grid-cols-1 gap-4 max-w-4xl mx-auto">
                        {otherArticles.slice(0, 5).map((faq, index) => (
                            <div key={faq.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden transition-all duration-300">
                                <button
                                    onClick={() => toggleAccordion(index)}
                                    className="w-full text-left p-6 font-semibold text-white flex justify-between items-center hover:bg-white/5 transition-colors"
                                >
                                    <span className="text-lg tracking-wide pr-8">
                                        {language === "hindi" && faq.hindi ? faq.hindi : faq.title}
                                    </span>
                                    <span className={`text-[#dd2727] text-xl transition-transform duration-300 ${expandedAccordion === index ? 'rotate-180' : ''}`}>
                                        ▼
                                    </span>
                                </button>
                                
                                {expandedAccordion === index && (
                                    <div className="p-6 pt-0 border-t border-white/5 bg-black/20">
                                        <p className="text-white/70 leading-relaxed mb-6 mt-4">
                                            {(language === "hindi" && faq.dhindi ? faq.dhindi : (faq.denglish || faq.content))?.substring(0, 300) + "..."}
                                        </p>
                                        <div className="flex gap-4">
                                            <Link to={`/articles/${faq.slug || faq.id}`}>
                                                <button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold uppercase tracking-widest text-xs py-3 px-6 rounded-full transition-colors">
                                                    Read Full Article
                                                </button>
                                            </Link>
                                            <Link to="/courses">
                                                <button className="bg-[#dd2727] hover:bg-white hover:text-[#dd2727] text-white font-bold uppercase tracking-widest text-xs py-3 px-6 rounded-full transition-colors shadow-[0_0_20px_rgba(221,39,39,0.3)]">
                                                    Explore Courses
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
                
            </main>
            <Footer />
        </>
    );
};

export default ArticleDetailsPage;
