import React from "react";
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
            <button className="footer-login-btn">Login</button>
          </div>

          {/* Column 2: Overview */}
          <div className="footer-col">
            <h3 className="title-batangas footer-col-title">Overview</h3>
            <ul className="footer-links">
              <li><a href="#about">About Us</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#articles">Articles</a></li>
              <li><a href="#courses">Courses</a></li>
              <li><a href="#appointment">Appointment</a></li>
              <li><a href="#consulting">Consulting</a></li>
            </ul>
          </div>

          {/* Column 3: Courses */}
          <div className="footer-col">
            <h3 className="title-batangas footer-col-title">Courses</h3>
            <ul className="footer-links">
              <li><a href="#">Basics</a></li>
              <li><a href="#">The Essentials of Self-Discovery</a></li>
              <li><a href="#">Narad Puran</a></li>
              <li><a href="#">Foundation of Vedic Astrology</a></li>
              <li><a href="#">New edge Bhadvad Geeta</a></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="footer-col">
            <h3 className="title-batangas footer-col-title">Contact Details</h3>
            <div className="footer-contact-info">
              <p className="subtitle-poppins"><strong>Email:</strong> contact@vahlayastro.com</p>
              <p className="subtitle-poppins"><strong>LandLine:</strong> +91 79 4921 7538</p>
              
              <h4 className="title-batangas location-title">Locations</h4>
              <p className="subtitle-poppins footer-address">
                C 515, Dev Aurum Commercial Complex, Prahlad Nagar,
                Ahmedabad, Gujarat 380015
              </p>

              <div className="footer-map-container">
                <iframe
                  title="Google Maps"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.921345432!2d72.511!3d23.011!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDAwJzM5LjYiTiA3MsKwMzAnMzkuNiJF!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin"
                  width="100%"
                  height="130"
                  style={{ border: 0 }}
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
               <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/></svg>
             </a>
             <a href="#" className="social-icon">
               <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.6.75zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633z"/></svg>
             </a>
             <a href="#" className="social-icon">
               <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.917 3.917 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.999 0h.002zm-.003 1.441c2.137 0 2.39.081 3.23.127.778.036 1.2.166 1.482.276.374.145.64.319.92.599.28.28.453.546.598.92.11.281.24.704.276 1.482.046.84.051 1.093.051 3.23s-.005 2.39-.051 3.23c-.036.778-.166 1.2-.276 1.482-.145.374-.319.64-.599.92-.28.28-.546.453-.92.598-.282.11-.705.24-1.482.276-.84.046-1.093.051-3.23.051s-2.39-.005-3.23-.051c-.778-.036-1.2-.166-1.482-.276a2.473 2.473 0 0 1-.92-.599 2.48 2.48 0 0 1-.601-.92c-.11-.282-.24-.705-.276-1.482-.045-.84-.049-1.093-.049-3.23s.004-2.39.049-3.23c.036-.778.166-1.2.276-1.482.145-.374.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.482-.276.84-.046 1.093-.051 3.23-.051s2.39.005 3.23.051zM8 3.891a4.11 4.11 0 1 0 0 8.219 4.11 4.11 0 0 0 0-8.219zm0 1.441a2.669 2.669 0 1 1 0 5.338 2.669 2.669 0 0 1 0-5.338zm4.407-.818a1.022 1.022 0 1 0 0 2.044 1.022 1.022 0 0 0 0-2.044z"/></svg>
             </a>
             <a href="#" className="social-icon">
               <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z"/></svg>
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
        <svg width="40" height="40" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.06 3.974L0 16l4.104-1.077c1.163.633 2.478.963 3.817.964h.003c4.367 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/></svg>
      </a>
    </footer>
  );
};

export default Footer;