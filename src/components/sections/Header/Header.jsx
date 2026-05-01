import logo from "../../../assets/img/vahlay_astro logo.png";
import { auth } from '../../../firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            alert("Logged out successfully!");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Consulting", href: "/consulting" },
        { name: "Courses", href: "/courses" },
        { name: "Articles", href: "/articles" },
    ];

    return (
        <header 
            className="sticky left-0 right-0 w-full bg-transparent z-1000 transition-all duration-500 text-white"
        >
            <nav className="max-w-[1170px] mx-auto flex justify-between items-center px-4 md:px-12 py-1">
                
                {/* Logo Section */}
                <Link to="/" className="flex items-center" aria-label="Vahlay Astro Home">
                    <img 
                        src={logo} 
                        alt="Vahlay Astro Logo" 
                        loading="lazy"
                        className="transition-all duration-500 object-contain hover:scale-105 h-20 w-20 md:h-[80px] md:w-[80px]"
                    />
                </Link>

                {/* Desktop Navigation */}
                <ul className="hidden md:flex items-center gap-8 ">
                    {navLinks.map((link) => (
                        <li key={link.name}>
                            <Link 
                                to={link.href} 
                                className="text-[14px] lg:text-[16px] font-medium uppercase tracking-[0.2em] transition-all duration-300 hover:text-[#dd2727]"
                            >
                                {link.name}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* CTA Button & Mobile Toggle */}
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-4">
                        <Link
                            to="/contact"
                             className="ml-2 px-6 py-2 rounded-full font-bold text-[14px] lg:text-[16px] uppercase tracking-[0.2em] transition-all duration-500 bg-[#dd2727] text-white hover:bg-white hover:text-[#dd2727] whitespace-nowrap shadow-[0_0_20px_rgba(221,39,39,0.3)]"
                        >
                            Contact us
                        </Link>
                    </div>

                    {/* Hamburger Menu Toggle */}
                    <button 
                        className="md:hidden flex flex-col gap-1.5 p-2 z-50 focus:outline-none"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle Menu"
                    >
                        <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                        <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
                        <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                    </button>
                </div>

                {/* Mobile Navigation Menu */}
                <div 
                    className={`fixed inset-0 bg-black transition-all duration-500 md:hidden flex flex-col items-center justify-center gap-10 z-40 ${
                        isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-full'
                    }`}
                >
                    {navLinks.map((link) => (
                        <Link 
                            key={`mobile_${link.name}`}
                            to={link.href} 
                            onClick={() => setIsOpen(false)}
                            className="text-3xl font-bold uppercase tracking-widest hover:text-[#dd2727] transition-colors whitespace-nowrap"
                        >
                            {link.name}
                        </Link>
                    ))}
                    
                    <div className="flex flex-col items-center gap-6 mt-4">
                        <Link 
                            to="/contact" 
                            onClick={() => setIsOpen(false)}
                             className="mt-2 px-10 py-4 rounded-full font-bold text-[15px] uppercase tracking-[0.2em] transition-all duration-500 bg-[#dd2727] text-white hover:bg-white hover:text-[#dd2727] whitespace-nowrap"
                        >
                            Contact us
                        </Link>
                    </div>
                </div>

            </nav>
        </header>
    );
};

export default Header;
