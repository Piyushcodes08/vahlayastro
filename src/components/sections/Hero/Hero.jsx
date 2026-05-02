import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../ui/Button/Button';
import { heroData } from '../../../data/heroData';
import './Hero.css';

const Hero = () => {
    const navigate = useNavigate();

    const { title, intro, description, buttonText } = heroData;

    return (
        <section className="hero">
            <div className="hero-content">
                <span className="block text-xl md:text-2xl font-medium tracking-wide mb-2 opacity-95">
                    {intro}
                </span>
                <h1 id="hero-title">
                    {title}
                </h1>
                <p className="subtitle !pb-5">
                    {description}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                    <Button 
                        variant="primary"
                        onClick={() => navigate('/appointment')}
                    >
                        {buttonText}
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default Hero;
