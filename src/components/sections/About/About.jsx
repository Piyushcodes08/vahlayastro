import React from "react";
import Button from "../../ui/Button/Button";
import { aboutData } from "../../../data/aboutData";
import "./About.css";

import heroVideo from "../../../assets/video/v2.mp4";

const About = () => {
  const { title, images, paragraphs, buttonText } = aboutData;

  return (
    <div className="about-scroll-wrapper">
      <div className="project-hero">
        <video src={heroVideo} autoPlay muted loop playsInline />
      </div>

      <article className="about-article">
        <section className="about-section">
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
                <h2 className="about-title">{title}</h2>

                {paragraphs.map((text, idx) => (
                  <p key={`about_p_${idx}`} className="about-description">
                    {text}
                  </p>
                ))}

                <Button variant="secondary">{buttonText}</Button>
              </div>
            </div>
          </div>
        </section>
      </article>
    </div>
  );
};

export default About;