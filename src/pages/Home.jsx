import Hero from '../components/sections/Hero/Hero';
import About from '../components/sections/About/About';
import CourseSection from '../components/sections/Courses/CourseSection';
import Header from '../components/sections/Header/Header';
import ArticleSection from '../components/sections/Article/ArticleSection';
import Numerology from '../components/sections/Numerology/Numerology';
import Testimonials from '../components/sections/Testimonials/Testimonials';
import Partners from '../components/sections/Partners/Partners';
import Contact from '../components/sections/Contact/Contact';
import Footer from '../components/sections/Footer/Footer';
import Horoscope from '../components/sections/Horoscope/Horoscope';

const Home = () => {
    return (
        <>
            {/* Sentinel for Header IntersectionObserver */}
            <div id="top-sentinel" className="absolute top-0 left-0 w-full h-px pointer-events-none z-[-1]" />
            
            <Header />
            <main>
                <Hero />
                <CourseSection />
                <ArticleSection />
                <About />
                <Numerology />
                <Horoscope/>
                <Testimonials />
                <Partners />
                <Contact />
            </main>
            <Footer/>
        </>
    );
};

export default Home;
