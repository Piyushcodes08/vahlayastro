import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../ui/Button/Button';
import { homeData } from '../../../data/pages/home';

const Hero = () => {
    const navigate = useNavigate();

    const { hero } = homeData;
    const { title, intro, description, buttonText } = hero;

    return (
        <section className="relative min-h-screen min-h-[100svh] w-full overflow-hidden bg-transparent text-white flex items-center justify-center text-center px-4 ">

            {/* Canvas Background Support */}
            <canvas
                id="canvas"
                className="fixed inset-0 z-[1] pointer-events-none"
            />

            {/* Main Content Container */}
            <div className="relative z-10 w-full max-w-[1170px] min-h-[100svh] mx-auto px-[50px] max-lg:px-[30px] max-md:px-[15px] flex pt-12 items-center justify-center">
                
                <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center">
                    
                    {/* Red Pill Label */}
                    <div className="inline-flex items-center justify-center mb-3 px-8 py-2 rounded-full border border-[#dd2727]/30 bg-[#dd2727]/5 backdrop-blur-md max-md:px-5 max-md:py-[7px] max-md:mb-4">
                        <span className="text-[#dd2727] text-sm max-md:text-[11px] font-extrabold uppercase tracking-[0.3em] max-md:tracking-[0.22em]">
                            {intro}
                        </span>
                    </div>

                    {/* Hero Title */}
                    <h1
                        id="hero-title"
                        className="font-['Batangas'] text-white font-black text-center leading-[1.08] mb-6 text-[clamp(3rem,8vw,7rem)] max-lg:text-[clamp(3rem,9vw,5.8rem)] max-md:text-[clamp(2.4rem,12vw,4rem)] max-md:leading-[1.12] max-md:mb-[18px]"
                    >
                        {title}
                    </h1>

                    {/* Hero Description */}
                    <p className="text-[18px] max-lg:text-[17px] max-md:text-sm text-white/80 max-w-[760px] mx-auto leading-[1.8] max-md:leading-[1.7] font-medium">
                        {description}
                    </p>

                    {/* CTA Button */}
                    <div className="mt-[34px] max-md:mt-7 flex flex-wrap items-center justify-center gap-4">
                        <Button
                            variant="primary"
                            onClick={() => navigate('/appointment')}
                        >
                            {buttonText}
                        </Button>
                    </div>

                    {/* Red Dot Divider */}
                    <div className="mt-12 max-md:mt-9 flex items-center justify-center gap-4">
                        <div className="h-px w-12 max-md:w-[38px] bg-gradient-to-r from-transparent to-white/20" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#dd2727] shadow-[0_0_18px_#dd2727]" />
                        <div className="h-px w-12 max-md:w-[38px] bg-gradient-to-l from-transparent to-white/20" />
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Hero;