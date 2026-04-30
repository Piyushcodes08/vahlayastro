import React, { useState } from "react";
import { IoLocationOutline, IoCallOutline, IoTimeOutline } from "react-icons/io5";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setStatus("loading");
    try {
      await addDoc(collection(db, "Astro_Contact"), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      setStatus("success");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      console.error("Contact form error:", err);
      setStatus("error");
    }
  };

  return (
    <section className="contact-section" id="contact">
      <div className="section-container">
        <div className="contact-header">
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
                <div className="contact-icon">
                  <IoLocationOutline size={24} />
                </div>
                <div className="contact-text-group">
                  <h3 className="title-batangas">Our Address</h3>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=C+515,+Dev+Aurum+Commercial+Complex,+Prahlad+Nagar,+Ahmedabad,+Gujarat+380015"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-link"
                  >
                    <p className="subtitle-poppins">C 515, Dev Aurum Commercial Complex,</p>
                    <p className="subtitle-poppins">Prahlad Nagar, Ahmedabad, Gujarat 380015</p>
                  </a>
                </div>
              </li>

              <li>
                <div className="contact-icon">
                  <IoCallOutline size={24} />
                </div>
                <div className="contact-text-group">
                  <h3 className="title-batangas">Contact</h3>
                  <a href="tel:+917949217538" className="contact-link">
                    <p className="subtitle-poppins">LandLine: +91 79 4921 7538</p>
                  </a>
                  <a href="mailto:contact@vahlayastro.com" className="contact-link">
                    <p className="subtitle-poppins">Email: contact@vahlayastro.com</p>
                  </a>
                </div>
              </li>

              <li>
                <div className="contact-icon">
                  <IoTimeOutline size={24} />
                </div>
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

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your email address"
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Your phone number"
                />
              </div>
              <div className="input-group">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Write your message..."
                  required
                />
              </div>

              {status === "success" && (
                <p className="text-green-400 text-sm text-center subtitle-poppins mb-2">
                  ✅ Message sent! We'll get back to you shortly.
                </p>
              )}
              {status === "error" && (
                <p className="text-red-400 text-sm text-center subtitle-poppins mb-2">
                  ❌ Something went wrong. Please try again.
                </p>
              )}

              <button
                type="submit"
                className="contact-submit-btn"
                disabled={status === "loading"}
              >
                {status === "loading" ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;