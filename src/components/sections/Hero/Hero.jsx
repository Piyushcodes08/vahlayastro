import React, { useRef, useState } from 'react';
import useParticles from '../../../hooks/useParticles';
import Button from '../../ui/Button/Button';
import AppointmentModal from '../../modals/AppointmentModal/AppointmentModal';
import { heroData } from '../../../data/heroData';
import './Hero.css';

const Hero = () => {
    const canvasRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Initialize particles animation using the custom hook
    useParticles(canvasRef);
    
    const toggleModal = () => setIsModalOpen(!isModalOpen);

    // Text splitting natively handled via React instead of raw manipulation
    const { title, intro, description, buttonText } = heroData;
    let letterIndex = 0;

    // Construct the animated title 
    const splitTextReact = title.split(' ').map((word, wordIdx) => {
        const wordChars = word.split('');
        return (
            <React.Fragment key={`wordFrag_${wordIdx}`}>
                <span
                    style={{
                        display: 'inline-block',
                        whiteSpace: 'nowrap',
                        transformStyle: 'preserve-3d'
                    }}
                >
                    {wordChars.map((char) => {
                        const currentIdx = letterIndex++;
                        return (
                            <span
                                key={`char_${currentIdx}`}
                                className="letter"
                                style={{ animationDelay: `${150 + currentIdx * 55}ms` }}
                            >
                                {char}
                            </span>
                        );
                    })}
                </span>
                {wordIdx < title.split(' ').length - 1 && ' '}
            </React.Fragment>
        );
    });

    return (
        <section className="hero">
            <canvas id="canvas" ref={canvasRef}></canvas>

            <div className="hero-content">
                <span className="block text-xl md:text-2xl font-medium tracking-wide mb-2 opacity-95">
                    {intro}
                </span>
                <h1 id="hero-title">
                    {splitTextReact}
                </h1>
                <p className="subtitle !pb-5">
                    {description}
                </p>
                <Button 
                    variant="primary"
                    onClick={toggleModal}
                >
                    {buttonText}
                </Button>
            </div>

            <AppointmentModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
        </section>
    );
};

export default Hero;
