import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import "./Testimonials.css";

const testimonials = [
    {
        quote:
            "I was impressed by the food — every dish is bursting with flavor! And I could really tell that they use high-quality ingredients. The staff was friendly and attentive, going the extra mile. I'll be back for more!",
        name: "Tamar Mendelson",
        designation: "Restaurant Critic",
        src: "https://images.unsplash.com/photo-1512316609839-ce289d3eba0a?q=80&w=1368&auto=format&fit=crop",
    },
    {
        quote:
            "This place exceeded all expectations! The atmosphere is inviting, and the staff truly goes above and beyond to ensure a fantastic visit. I'll keep returning for more dining experience.",
        name: "Joe Charlescraft",
        designation: "Frequent Visitor",
        src: "https://images.unsplash.com/photo-1628749528992-f5702133b686?q=80&w=1368&auto=format&fit=crop",
    },
    {
        quote:
            "Shining Yam is a hidden gem! From the moment I walked in, I knew I was in for a treat. The impeccable service and overall attention to detail created a memorable experience. I highly recommend it!",
        name: "Martina Edelweist",
        designation: "Satisfied Customer",
        src: "https://images.unsplash.com/photo-1524267213992-b76e8577d046?q=80&w=1368&auto=format&fit=crop",
    },
];

const vertexSource = `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentSource = `
  precision mediump float;

  uniform float iTime;
  uniform vec2 iResolution;
  varying vec2 vUv;

  float random(vec2 uv) {
    return fract(sin(dot(uv.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  float noise(vec2 uv) {
    vec2 i = floor(uv);
    vec2 f = fract(uv);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  #define OCTAVES 6

  float fbm(vec2 uv) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;

    for (int i = 0; i < OCTAVES; i++) {
      value += amplitude * noise(uv * frequency);
      frequency *= 2.2;
      amplitude *= 0.5;
    }

    return value;
  }

  vec3 palette(float t) {
    vec3 a = vec3(0.02, 0.06, 0.12);
    vec3 b = vec3(0.10, 0.35, 0.55);
    vec3 c = vec3(0.20, 0.45, 0.85);
    vec3 d = vec3(0.65, 0.90, 1.00);
    return a + b * cos(6.28318 * (c * t + d));
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    uv *= 3.5;

    float t = iTime * 0.35;
    float n = fbm(uv + vec2(t, -t * 0.5));
    float n2 = fbm((uv * 1.4) - vec2(t * 0.6, t * 0.25));
    float mixVal = smoothstep(0.0, 1.0, n * 0.7 + n2 * 0.45);

    vec3 col = palette(mixVal);
    col *= 0.85;

    gl_FragColor = vec4(col, 1.0);
  }
`;

const Testimonials = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const canvasRef = useRef(null);
    const imageContainerRef = useRef(null);
    const nameRef = useRef(null);
    const designationRef = useRef(null);
    const quoteRef = useRef(null);
    const autoplayRef = useRef(null);
    const imagesRef = useRef([]);

    const current = testimonials[activeIndex];

    const calculateGap = (width) => {
        const minWidth = 320;
        const maxWidth = 1456;
        const minGap = 32;
        const maxGap = 86;

        if (width <= minWidth) return minGap;
        if (width >= maxWidth) return maxGap;

        return minGap + ((maxGap - minGap) * (width - minWidth)) / (maxWidth - minWidth);
    };

    const getOffset = (index, active, total) => {
        let raw = index - active;
        if (raw > total / 2) raw -= total;
        if (raw < -total / 2) raw += total;
        return raw;
    };

    const splitQuoteIntoWords = (text) =>
        text.split(" ").map((word, i) => (
            <span className="at-word" key={`${word}-${i}`}>
                {word}&nbsp;
            </span>
        ));

    const animateWords = () => {
        const words = quoteRef.current?.querySelectorAll(".at-word");
        if (!words?.length) return;

        gsap.fromTo(
            words,
            { opacity: 0, y: 12 },
            {
                opacity: 1,
                y: 0,
                stagger: 0.02,
                duration: 0.22,
                ease: "power2.out",
            }
        );
    };

    const updateImageStack = (nextIndex = activeIndex) => {
        const container = imageContainerRef.current;
        if (!container || !imagesRef.current.length) return;

        const containerWidth = container.offsetWidth;
        const gap = calculateGap(containerWidth);
        const stickUp = Math.min(gap * 0.45, 30);

        imagesRef.current.forEach((img, index) => {
            if (!img) return;

            const offset = getOffset(index, nextIndex, testimonials.length);

            let x = 0;
            let y = 0;
            let scale = 1;
            let rotateY = 0;
            let opacity = 1;
            let z = 0;
            let zIndex = 30;

            if (offset === 0) {
                x = 0;
                y = 0;
                scale = 1;
                rotateY = 0;
                z = 100;
                zIndex = 50;
                opacity = 1;
            } else if (offset === 1 || offset === -2) {
                x = containerWidth * 0.18;
                y = -stickUp;
                scale = 0.86;
                rotateY = -14;
                z = 0;
                zIndex = 20;
                opacity = 0.95;
            } else {
                x = -containerWidth * 0.18;
                y = -stickUp;
                scale = 0.86;
                rotateY = 14;
                z = 0;
                zIndex = 10;
                opacity = 0.95;
            }

            gsap.to(img, {
                x,
                y,
                z,
                scale,
                rotateY,
                opacity,
                zIndex,
                duration: 0.75,
                ease: "power3.out",
            });
        });
    };

    const animateText = () => {
        if (!nameRef.current || !designationRef.current || !quoteRef.current) return;

        gsap.fromTo(
            [nameRef.current, designationRef.current],
            { opacity: 0, y: -16 },
            {
                opacity: 1,
                y: 0,
                duration: 0.3,
                ease: "power2.out",
            }
        );

        gsap.fromTo(
            quoteRef.current,
            { opacity: 0, y: -16 },
            {
                opacity: 1,
                y: 0,
                duration: 0.3,
                ease: "power2.out",
                onComplete: animateWords,
            }
        );
    };

    const changeSlide = (direction) => {
        if (isAnimating) return;

        setIsAnimating(true);

        setActiveIndex((prev) => {
            const next = (prev + direction + testimonials.length) % testimonials.length;

            gsap.to([nameRef.current, designationRef.current, quoteRef.current], {
                opacity: 0,
                y: -16,
                duration: 0.2,
                ease: "power2.in",
                onComplete: () => {
                    requestAnimationFrame(() => {
                        updateImageStack(next);
                    });
                },
            });

            return next;
        });

        setTimeout(() => {
            setIsAnimating(false);
        }, 850);
    };

    const stopAutoplay = () => {
        if (autoplayRef.current) {
            clearInterval(autoplayRef.current);
            autoplayRef.current = null;
        }
    };

    const startAutoplay = () => {
        stopAutoplay();
        autoplayRef.current = setInterval(() => {
            changeSlide(1);
        }, 5000);
    };

    useEffect(() => {
        updateImageStack(activeIndex);
        animateText();
    }, [activeIndex]);

    useEffect(() => {
        startAutoplay();

        const handleResize = () => {
            updateImageStack(activeIndex);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            stopAutoplay();
            window.removeEventListener("resize", handleResize);
        };
    }, [activeIndex]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext("webgl", { antialias: true });
        if (!gl) return;

        const createShader = (type, source) => {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);

            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error(gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        };

        const createProgram = (vertexSrc, fragmentSrc) => {
            const vertexShader = createShader(gl.VERTEX_SHADER, vertexSrc);
            const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentSrc);

            if (!vertexShader || !fragmentShader) return null;

            const program = gl.createProgram();
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);

            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                console.error(gl.getProgramInfoLog(program));
                gl.deleteProgram(program);
                return null;
            }

            return program;
        };

        const program = createProgram(vertexSource, fragmentSource);
        if (!program) return;

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([
                -1, -1,
                1, -1,
                -1, 1,
                -1, 1,
                1, -1,
                1, 1,
            ]),
            gl.STATIC_DRAW
        );

        const positionLocation = gl.getAttribLocation(program, "position");
        const timeLocation = gl.getUniformLocation(program, "iTime");
        const resolutionLocation = gl.getUniformLocation(program, "iResolution");

        const resizeCanvas = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.floor(window.innerWidth * dpr);
            canvas.height = Math.floor(window.innerHeight * dpr);
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            gl.viewport(0, 0, canvas.width, canvas.height);
        };

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        let animationFrameId;

        const render = (now) => {
            const time = now * 0.001;

            gl.useProgram(program);
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

            gl.enableVertexAttribArray(positionLocation);
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

            gl.uniform1f(timeLocation, time);
            gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

            gl.drawArrays(gl.TRIANGLES, 0, 6);

            animationFrameId = requestAnimationFrame(render);
        };

        animationFrameId = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", resizeCanvas);
        };
    }, []);

    return (
        <section className="animated-testimonials-section">
      

            <div className="at-wrapper">
                <div className="at-container">
                    <div className="at-grid">
                        <div className="at-image-container" ref={imageContainerRef}>
                            {testimonials.map((item, index) => (
                                <img
                                    key={index}
                                    ref={(el) => (imagesRef.current[index] = el)}
                                    src={item.src}
                                    alt={item.name}
                                    className="at-testimonial-image"
                                />
                            ))}
                        </div>

                        <div className="at-content">
                            <div>
                                <h3 className="at-name" ref={nameRef}>
                                    {current.name}
                                </h3>
                                <p className="at-designation" ref={designationRef}>
                                    {current.designation}
                                </p>
                                <p className="at-quote" ref={quoteRef}>
                                    {splitQuoteIntoWords(current.quote)}
                                </p>
                            </div>

                            <div className="at-arrow-buttons">
                                <button
                                    className="at-arrow-button at-prev-button"
                                    onClick={() => {
                                        stopAutoplay();
                                        changeSlide(-1);
                                    }}
                                    aria-label="Previous testimonial"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                                    </svg>
                                </button>

                                <button
                                    className="at-arrow-button at-next-button"
                                    onClick={() => {
                                        stopAutoplay();
                                        changeSlide(1);
                                    }}
                                    aria-label="Next testimonial"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;