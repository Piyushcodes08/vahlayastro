import React from "react";
import Button from "../../ui/Button/Button";
import { aboutData } from "../../../data/aboutData";
import "./About.css";

const About = () => {
  const { intro, title, images, paragraphs, buttonText } = aboutData;

  return (
    <section className="about-section">
      <div className="section-container">
        <div className="about-container">
          <div className="about-content-left">
            <div className="about-img-grid">
              {images.map((img, idx) => (
                <div key={`about_img_${idx}`} className="about-img-wrapper">
                  <img src={img.src} alt={img.alt} />
                </div>
              ))}
            </div>
          </div>

          <div className="about-content-right">
            <div className="about-text-content">
              {intro && (
                <div className="about-intro-wrapper">
                  <span className="about-intro-line"></span>
                  <span className="about-intro">{intro}</span>
                </div>
              )}
              <h2 className="about-title">{title}</h2>

              <div className="about-desc-wrapper">
                {paragraphs.map((text, idx) => (
                  <p key={`about_p_${idx}`} className="about-description">
                    {text}
                  </p>
                ))}
              </div>

              <div className="about-btn-wrapper">
                <Button variant="secondary">{buttonText}</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;