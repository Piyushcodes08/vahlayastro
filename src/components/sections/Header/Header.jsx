import logo from "../../../assets/img/vahlay_astro logo.png";
import { auth, db } from '../../../firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = (e) => {
            // Get scroll position from window, document, or the scrolling target itself
            const scrollTop = 
                window.scrollY || 
                document.documentElement.scrollTop || 
                document.body.scrollTop || 
                (e.target && e.target.scrollTop) || 
                0;
                
            setScrolled(scrollTop > 20);
        };
        
        // Use capture phase (true) to catch scroll events from any nested scrollable container
        window.addEventListener('scroll', handleScroll, true);
        
        // Cleanup
        return () => window.removeEventListener('scroll', handleScroll, true);
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                try {
                    const q = query(collection(db, "users"), where("email", "==", currentUser.email));
                    const querySnapshot = await getDocs(q);
                    let adminStatus = false;
                    querySnapshot.forEach((doc) => {
                        if (doc.data().isAdmin) {
                            adminStatus = true;
                        }
                    });
                    setIsAdmin(adminStatus);
                } catch (error) {
                    console.error("Error checking admin status:", error);
                }
            } else {
                setIsAdmin(false);
            }
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
  className={`fixed top-0 left-0 right-0 z-[1000] w-full text-white transition-all duration-500 overflow-hidden ${
    scrolled
      ? "shadow-[0_10px_30px_rgba(0,0,0,0.8)] border-b border-white/20"
      : "bg-transparent"
  }`}
>
  {/* Premium Custom Glowing Background when scrolled */}
  <div
    className={`absolute inset-0 pointer-events-none z-0 transition-opacity duration-700 ${
      scrolled ? "opacity-[0.9]" : "opacity-0"
    }`}
    style={{
      background: "linear-gradient(145deg, #dd2727 30%, #b0a102 70%)",
      filter: "blur(80px)",
      transform: "scale(1.1)",
    }}
  />
            
            {/* Add a subtle dark overlay so the text remains perfectly readable over the bright glow */}
            <div className={`absolute inset-0 pointer-events-none transition-all duration-700 -z-10 ${scrolled ? 'bg-black/40' : 'bg-transparent'}`} />

            <nav className={`max-w-[1170px] mx-auto flex justify-between items-center px-4 md:px-12 transition-all duration-500 relative ${scrolled ? 'py-1' : 'py-1'}`}>
                
                {/* Logo Section */}
                <Link to="/" className="flex items-center" aria-label="Vahlay Astro Home">
                        <img 
                            src={logo} 
                            alt="Vahlay Astro Logo" 
                            loading="lazy"
                            className={`transition-all duration-500 object-contain hover:scale-105 ${scrolled ? 'h-12 w-12 md:h-14 md:w-14' : 'h-16 w-16 md:h-[70px] md:w-[70px]'}`}
                        />
                    </Link>

                {/* Desktop Navigation */}
                <ul className="hidden lg:flex items-center gap-6 xl:gap-8 ">
                    {navLinks.map((link) => (
                        <li key={link.name}>
                            <Link 
                                to={link.href} 
                                className="text-[14px] font-medium uppercase tracking-[0.2em] transition-all duration-300 hover:text-[#dd2727]"
                            >
                                {link.name}
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="flex items-center gap-2 md:gap-4">
                    <div className="hidden lg:flex items-center gap-2">
                        {user ? (
                            <>
                                <Link
                                    to={isAdmin ? "/admin" : "/dashboard"}
                                    className="ml-2 px-4 py-1.5 rounded-full font-bold text-[14px]  uppercase tracking-[0.2em] transition-all duration-500 border border-white text-white hover:bg-white hover:text-black whitespace-nowrap"
                                >
                                    {isAdmin ? "Admin" : "Dashboard"}
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="ml-2 px-4 py-1.5 rounded-full font-bold text-[14px]  uppercase tracking-[0.2em] transition-all duration-500 border border-white text-white hover:bg-white hover:text-black whitespace-nowrap"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className="ml-2 px-6 py-1.5 rounded-full font-bold text-[14px]  uppercase tracking-[0.2em] transition-all duration-500 border border-white text-white hover:bg-white hover:text-black whitespace-nowrap"
                            >
                                Login
                            </Link>
                        )}
                        <Link
                            to="/contact"
                             className="ml-2 px-4 lg:px-6 py-2 rounded-full font-bold text-[14px] uppercase tracking-[0.2em] transition-all duration-500 bg-[#dd2727] text-white hover:bg-white hover:text-[#dd2727] whitespace-nowrap shadow-[0_0_20px_rgba(221,39,39,0.3)]"
                        >
                            Contact Us
                        </Link>
                    </div>

                    {/* Hamburger Menu Toggle */}
                    <button 
                        className="lg:hidden flex flex-col gap-1.5 p-2 z-50 focus:outline-none"
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
                    className={`fixed inset-0 bg-[#0a0a0a]/95 backdrop-blur-2xl transition-all duration-500 lg:hidden flex flex-col items-center justify-center gap-8 z-40 ${
                        isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-full'
                    }`}
                >
                    {navLinks.map((link) => (
                        <Link 
                            key={`mobile_${link.name}`}
                            to={link.href} 
                            onClick={() => setIsOpen(false)}
                            className="text-2xl md:text-3xl font-bold uppercase tracking-[0.2em] text-white/90 hover:text-[#dd2727] hover:scale-105 transition-all duration-300 whitespace-nowrap"
                        >
                            {link.name}
                        </Link>
                    ))}
                    
                    <div className="flex flex-col items-center gap-6 mt-4">
                        {user ? (
                            <>
                                <Link
                                    to={isAdmin ? "/admin" : "/dashboard"}
                                    onClick={() => setIsOpen(false)}
                                    className="mt-2 px-10 py-4 rounded-full font-bold text-[15px] uppercase tracking-[0.2em] transition-all duration-500 border border-white text-white hover:bg-white hover:text-black whitespace-nowrap"
                                >
                                    {isAdmin ? "Admin" : "Dashboard"}
                                </Link>
                                <button
                                    onClick={() => { setIsOpen(false); handleLogout(); }}
                                    className="mt-2 px-10 py-4 rounded-full font-bold text-[15px] uppercase tracking-[0.2em] transition-all duration-500 border border-white text-white hover:bg-white hover:text-black whitespace-nowrap"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                onClick={() => setIsOpen(false)}
                                className="mt-2 px-10 py-4 rounded-full font-bold text-[15px] uppercase tracking-[0.2em] transition-all duration-500 border border-white text-white hover:bg-white hover:text-black whitespace-nowrap"
                            >
                                Login
                            </Link>
                        )}
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
