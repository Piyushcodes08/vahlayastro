import Hero from '../components/sections/Hero/Hero';
import About from '../components/sections/About/About';
import CourseSection from '../components/sections/Courses/CourseSection';
import Header from '../components/sections/Header/Header';
import ArticleSection from '../components/sections/Article/ArticleSection';
import Numerology from '../components/sections/Numerology/Numerology';

const Home = () => {
    return (
        <>
            {/* Sentinel for Header IntersectionObserver */}
            <div id="top-sentinel" className="absolute top-0 left-0 w-full h-[1px] pointer-events-none z-[-1]" />
            
            <Header />
            <main>
                <Hero />
                <About />
                <CourseSection />
                <Numerology />
                <ArticleSection />
            </main>
        </>
    );
};

export default Home;
