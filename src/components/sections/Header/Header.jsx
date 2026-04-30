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
                        className="transition-all duration-500 object-contain hover:scale-105 h-16 w-16 md:h-[84px] md:w-[84px]"
                    />
                </Link>

                {/* Desktop Navigation */}
                <ul className="hidden md:flex items-center gap-8 ">
                    {navLinks.map((link) => (
                        <li key={link.name}>
                            <Link 
                                to={link.href} 
                                className="text-[12px] lg:text-[14px] font-medium uppercase tracking-[0.2em] transition-all duration-300 hover:text-[#dd2727]"
                            >
                                {link.name}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* CTA Button & Mobile Toggle */}
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-4">
                        {!user ? (
                            <>
                                <Link 
                                    to="/login" 
                                    className="text-[11px] lg:text-[13px] font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:text-[#dd2727] px-6 py-2"
                                >
                                    Login
                                </Link>
                                <Link 
                                    to="/signup" 
                                    className="px-6 py-2.5 rounded-full font-bold text-[11px] lg:text-[13px] uppercase tracking-[0.2em] transition-all duration-500 border border-white/20 hover:border-[#dd2727] text-white hover:bg-[#dd2727]"
                                >
                                    Sign Up
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link 
                                    to="/profile" 
                                    className="text-[11px] lg:text-[13px] font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:text-[#dd2727] px-6 py-2"
                                >
                                    Profile
                                </Link>
                                <button 
                                    onClick={handleLogout}
                                    className="text-[11px] lg:text-[13px] font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:text-red-500 px-6 py-2"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                        <Link
                            to="/contact"
                            className="ml-2 px-6 py-2.5 rounded-full font-bold text-[11px] lg:text-[13px] uppercase tracking-[0.2em] transition-all duration-500 bg-[#dd2727] text-white hover:bg-white hover:text-[#dd2727]"
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
                            className="text-3xl font-bold uppercase tracking-widest hover:text-[#dd2727] transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                    
                    <div className="flex flex-col items-center gap-6 mt-4">
                        {!user ? (
                            <>
                                <Link 
                                    to="/login" 
                                    onClick={() => setIsOpen(false)}
                                    className="text-[13px] font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:text-[#dd2727] py-2"
                                >
                                    Login
                                </Link>
                                <Link 
                                    to="/signup" 
                                    onClick={() => setIsOpen(false)}
                                    className="px-8 py-3 rounded-full font-bold text-[13px] uppercase tracking-[0.2em] transition-all duration-500 border border-white/20 hover:border-[#dd2727] text-white hover:bg-[#dd2727]"
                                >
                                    Sign Up
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link 
                                    to="/profile" 
                                    onClick={() => setIsOpen(false)}
                                    className="text-[13px] font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:text-[#dd2727] py-2"
                                >
                                    Profile
                                </Link>
                                <button 
                                    onClick={() => {
                                        setIsOpen(false);
                                        handleLogout();
                                    }}
                                    className="text-[13px] font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:text-red-500 py-2"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                        <Link 
                            to="/contact" 
                            onClick={() => setIsOpen(false)}
                            className="mt-2 px-8 py-3 rounded-full font-bold text-[13px] uppercase tracking-[0.2em] transition-all duration-500 bg-[#dd2727] text-white hover:bg-white hover:text-[#dd2727]"
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
