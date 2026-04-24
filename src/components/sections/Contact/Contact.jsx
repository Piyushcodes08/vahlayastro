import React from "react";
import "./Contact.css";

const Contact = () => {
  return (
    <section className="contact-section" id="contact">
      <div className="section-container">
        <div className="flex flex-col text-center md:text-left gap-1 pb-12 max-w-3xl w-1/2">
          <p className="contact-label">Contact Us</p>
          <h2 className="title-batangas text-4xl md:text-5xl font-bold uppercase tracking-tight leading-tight">
            Get in Touch
          </h2>
          <p className="subtitle-poppins text-lg md:text-xl font-medium">
            Connect with Vahlay Astro for consultation, guidance, and appointment support.
          </p>
        </div>

        <div className="contact-grid">
          <div className="contact-info">
            <p className="contact-desc subtitle-poppins">
              Have questions about astrology consultation, remedies, courses, or
              appointments? Send us your details and our team will connect with
              you shortly.
            </p>

            <ul className="contact-list">
              <li>
                <div className="contact-icon">📍</div>
                <div className="contact-text-group">
                  <h3 className="title-batangas">Our Address</h3>
                  <p className="subtitle-poppins">C 515, Dev Aurum Commercial Complex,</p>
                  <p className="subtitle-poppins">Prahlad Nagar, Ahmedabad, Gujarat 380015</p>
                </div>
              </li>

              <li>
                <div className="contact-icon">📞</div>
                <div className="contact-text-group">
                  <h3 className="title-batangas">Contact</h3>
                  <p className="subtitle-poppins">LandLine: +91 79 4921 7538</p>
                  <p className="subtitle-poppins">Email: contact@vahlayastro.com</p>
                </div>
              </li>

              <li>
                <div className="contact-icon">⏰</div>
                <div className="contact-text-group">
                  <h3 className="title-batangas">Working Hours</h3>
                  <p className="subtitle-poppins">Monday - Saturday: 10:00 AM - 7:00 PM</p>
                  <p className="subtitle-poppins">Sunday: By Appointment</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="contact-card">
            <h2 className="title-batangas">Ready to Get Started?</h2>

            <form className="contact-form">
              <div className="input-group">
                <input type="text" name="name" placeholder="Your name" required />
              </div>
              <div className="input-group">
                <input type="email" name="email" placeholder="Your email address" required />
              </div>
              <div className="input-group">
                <input type="tel" name="phone" placeholder="Your phone number" />
              </div>

              <div className="input-group">
                <textarea
                  name="message"
                  rows="4"
                  placeholder="Write your message..."
                  required
                />
              </div>

              <button type="submit" className="contact-submit-btn">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;