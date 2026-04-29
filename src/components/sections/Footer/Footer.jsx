import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import "./Footer.css";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer-section">
      <div className="section-container">
        <div className="footer-grid">
          {/* Column 1: About */}
          <div className="footer-col">
            <h3 className="title-batangas footer-brand">Vahlay Astro</h3>
            <p className="subtitle-poppins footer-desc">
              <strong>Vahlay Astro</strong>, your trusted partner in unlocking the mysteries of the
              cosmos. We offer tailored solutions for personal growth, success, and
              happiness.
            </p>
            <p className="subtitle-poppins footer-mission">
              Our mission is to help you achieve a deeper understanding of the
              cosmic world, offering guidance for life decisions and insights into your
              future.
            </p>
          </div>

          {/* Column 2: Overview */}
          <div className="footer-col">
            <h3 className="title-batangas footer-col-title">Overview</h3>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/articles">Articles</Link></li>
              <li><Link to="/courses">Courses</Link></li>
              <li><Link to="/contact">Appointment</Link></li>
              <li><Link to="/contact">Consulting</Link></li>
            </ul>
          </div>

          {/* Column 3: Courses */}
          <div className="footer-col">
            <h3 className="title-batangas footer-col-title">Courses</h3>
            <ul className="footer-links">
              <li><Link to="/courses">Basics</Link></li>
              <li><Link to="/courses">The Essentials of Self-Discovery</Link></li>
              <li><Link to="/courses">Narad Puran</Link></li>
              <li><Link to="/courses">Foundation of Vedic Astrology</Link></li>
              <li><Link to="/courses">New edge Bhadvad Geeta</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="footer-col">
            <h3 className="title-batangas footer-col-title">Contact Details</h3>
            <div className="footer-contact-info">
              <a href="mailto:contact@vahlayastro.com" className="footer-contact-link">
                <p className="subtitle-poppins"><strong>Email:</strong> contact@vahlayastro.com</p>
              </a>
              <a href="tel:+917949217538" className="footer-contact-link">
                <p className="subtitle-poppins"><strong>LandLine:</strong> +91 79 4921 7538</p>
              </a>
              
              <h4 className="title-batangas location-title">Locations</h4>
              <a 
                href="https://www.google.com/maps/search/?api=1&query=C+515,+Dev+Aurum+Commercial+Complex,+Prahlad+Nagar,+Ahmedabad,+Gujarat+380015" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer-contact-link"
              >
                <p className="subtitle-poppins footer-address">
                  C 515, Dev Aurum Commercial Complex, Prahlad Nagar,
                  Ahmedabad, Gujarat 380015
                </p>
              </a>

              <div className="footer-map-container">
                <iframe
                  title="Google Maps"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.9263433602513!2d72.50841267593256!3d23.01081511617478!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e9b3806c9e011%3A0xa1939886026a090!2sDev%20Aurum%20Commercial%20Complex!5e0!3m2!1sen!2sin!4v1714327600000!5m2!1sen!2sin"
                  width="100%"
                  height="130"
                  style={{ border: 0, borderRadius: "12px" }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-social-icons">
             <a href="#" className="social-icon">
               <FaFacebookF size={18} />
             </a>
             <a href="#" className="social-icon">
               <FaXTwitter size={18} />
             </a>
             <a href="#" className="social-icon">
               <FaInstagram size={18} />
             </a>
             <a href="#" className="social-icon">
               <FaYoutube size={18} />
             </a>
          </div>
          <p className="footer-copyright">
            © {year} Vahlay Astro. All rights reserved.
          </p>
        </div>
      </div>

      {/* WhatsApp Floating Button */}
      <a 
        href="https://wa.me/917949217538" 
        className="whatsapp-float" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        <FaWhatsapp size={30} />
      </a>
    </footer>
  );
};

export default Footer;