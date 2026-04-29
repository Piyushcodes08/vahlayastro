import React, { useRef, useState } from 'react';

import Button from '../../ui/Button/Button';
import AppointmentModal from '../../modals/AppointmentModal/AppointmentModal';
import { heroData } from '../../../data/heroData';
import './Hero.css';

const Hero = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const toggleModal = () => setIsModalOpen(!isModalOpen);

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
