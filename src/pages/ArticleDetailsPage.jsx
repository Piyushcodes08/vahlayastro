import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/sections/Header/Header';
import Footer from '../components/sections/Footer/Footer';
import { useArticles } from '../context/ArticlesContext';

const ArticleDetailsPage = () => {
    const { id } = useParams();
    const { slugMap, loading } = useArticles();
    
    // Find article by ID or Slug
    const article = React.useMemo(() => {
        const values = Object.values(slugMap);
        return values.find(a => a.id === id || a.slug === id);
    }, [id, slugMap]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
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
            <Header />
            <main className="min-h-screen relative z-10 text-white overflow-hidden bg-transparent">
             

                <div className="pt-32 pb-8 px-4 max-w-[1170px] mx-auto">
                    <Link to="/articles" className="inline-flex items-center text-[#dd2727] hover:text-white transition-colors mb-8 font-bold tracking-widest uppercase text-sm">
                        ← Back to Articles
                    </Link>
                </div>

                <section className="max-w-[1170px] mx-auto px-4 pb-20">
                    <article className="max-w-4xl mx-auto">
                        <div className="w-full h-64 md:h-[500px] rounded-[2rem] overflow-hidden mb-12 border border-white/10 bg-white/5 flex items-center justify-center shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
                            <img src={article.imageUrl || article.img} alt={article.title} className="w-full h-full object-cover" />
                        </div>

                        <h1 className="title-batangas text-5xl md:text-7xl mb-8 leading-tight">
                            {article.title}
                        </h1>

                        <div className="flex items-center gap-4 mb-12 pb-8 border-b border-white/10">
                            <span className="text-[#dd2727] font-bold text-lg">Vahlay Astro</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-white/50"></span>
                            <span className="subtitle-poppins text-white/60">{article.data || "Sacred Date"}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-white/50"></span>
                            <span className="subtitle-poppins text-white/60">{article.author || "By Celestial Guide"}</span>
                        </div>

                        <div className="subtitle-poppins text-white/80 space-y-10 text-lg md:text-xl leading-relaxed">
                            <p className="text-xl md:text-2xl font-medium text-white/95 border-l-4 border-[#dd2727] pl-8 py-2">
                                {article.description}
                            </p>
                            
                            <div className="whitespace-pre-wrap">
                                {article.content || article.denglish || article.dhindi || "No content available for this article."}
                            </div>

                            <div className="p-10 my-16 border-l-4 border-[#dd2727] bg-white/5 backdrop-blur-lg rounded-r-[2rem] italic text-2xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] text-white">
                                "The cosmos is within us. We are made of star-stuff. We are a way for the universe to know itself."
                            </div>

                            <p className="font-medium text-white/90">
                                As we continue to explore the cosmos, let us also turn our gaze inward. The answers we seek are often written not just in the stars, but within our own hearts. By aligning ourselves with universal rhythms, we can unlock our true potential and lead lives of greater harmony and fulfillment.
                            </p>
                        </div>
                    </article>
                </section>
            </main>
            <Footer />
        </>
    );
};

export default ArticleDetailsPage;

