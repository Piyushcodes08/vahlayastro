import React, { useState, useEffect, useCallback } from 'react';
import Button from '../../ui/Button/Button';
import './AppointmentModal.css';

const AppointmentModal = ({ isOpen, onClose }) => {
    const [view, setView] = useState('CHOICE'); // CHOICE, SIGNUP, LOGIN, BOOKING
    const [isLoading, setIsLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Reset view when modal opens
    useEffect(() => {
        if (isOpen) {
            setView('CHOICE');
            setIsMounted(true);
            document.body.style.overflow = 'hidden';
        } else {
            const timer = setTimeout(() => setIsMounted(false), 300);
            document.body.style.overflow = 'unset';
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape') onClose();
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, handleKeyDown]);

    const handleMockSubmit = (e, type) => {
        if (e) e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            if (type === 'SIGNUP' || type === 'LOGIN' || type === 'GOOGLE') {
                setView('BOOKING');
            } else {
                onClose();
                alert("Appointment scheduled successfully! Our astrologer will contact you soon.");
            }
        }, 1200);
    };

    if (!isMounted && !isOpen) return null;

    return (
        <div className={`modal-overlay ${isOpen ? 'show' : ''}`} onClick={onClose}>
            <div 
                className={`modal-container ${isOpen ? 'show' : ''} view-${view}`} 
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-accent-line"></div>

                {view === 'CHOICE' && (
                    <div className="view-content animate-in">
                        <div className="modal-header auth-header">
                            <div className="title-group">
                                <span className="modal-label">Welcome to Vahlay Astro</span>
                                <h2>Identify Yourself</h2>
                            </div>
                            <button className="close-btn" onClick={onClose}>&times;</button>
                        </div>
                        <div className="choice-grid">
                            <div className="choice-card" onClick={() => setView('SIGNUP')}>
                                <div className="choice-icon">✦</div>
                                <h3>New User</h3>
                                <p>Start your journey with a new account</p>
                                <span className="choice-action">Create Account</span>
                            </div>
                            <div className="choice-card" onClick={() => setView('LOGIN')}>
                                <div className="choice-icon">⚡</div>
                                <h3>Old User</h3>
                                <p>Welcome back! Access your profile</p>
                                <span className="choice-action">Login</span>
                            </div>
                        </div>
                    </div>
                )}

                {view === 'SIGNUP' && (
                    <div className="view-content animate-in auth-view">
                        <div className="modal-header auth-header">
                            <h2>Sign Up</h2>
                            <button className="close-btn" onClick={onClose}>&times;</button>
                        </div>
                        
                        <form className="auth-form" onSubmit={(e) => handleMockSubmit(e, 'SIGNUP')}>
                            <div className="auth-input-group">
                                <input type="text" placeholder="Username" required className="pill-input" />
                            </div>
                            <div className="auth-input-group">
                                <input type="email" placeholder="Email" required className="pill-input" />
                            </div>
                            <div className="auth-input-group password-wrap">
                                <span className="eye-icon">visibility</span>
                                <input type="password" placeholder="Password" required className="pill-input highlight-border" />
                                <div className="strength-bar-wrap">
                                    <div className="strength-bar"><div className="fill"></div></div>
                                    <span className="strength-text">Weak</span>
                                </div>
                            </div>
                            <div className="auth-input-group">
                                <input type="password" placeholder="Confirm Password" required className="pill-input" />
                            </div>

                            <div className="auth-checkbox">
                                <input type="checkbox" id="terms" required />
                                <label htmlFor="terms">I agree to the <span>Terms of Service</span> and <span>Privacy Policy</span>.</label>
                            </div>

                            <div className="recaptcha-box">
                                <div className="recaptcha-left">
                                    <div className="check-box"></div>
                                    <span>I'm not a robot</span>
                                </div>
                                <div className="recaptcha-right">
                                    <div className="captcha-logo"></div>
                                    <span>reCAPTCHA</span>
                                </div>
                            </div>

                            <Button type="submit" variant="secondary" className="pill-btn auth-btn" disabled={isLoading}>
                                {isLoading ? 'Processing...' : 'Sign Up'}
                            </Button>

                            <button type="button" className="pill-btn google-btn" onClick={() => handleMockSubmit(null, 'GOOGLE')}>
                                Sign In with Google
                            </button>

                            <div className="auth-footer">
                                <p>If you already have an account | <span onClick={() => setView('LOGIN')}>LogIn</span></p>
                            </div>
                        </form>
                    </div>
                )}

                {view === 'LOGIN' && (
                    <div className="view-content animate-in auth-view">
                        <div className="modal-header auth-header">
                            <h2>Log In</h2>
                            <button className="close-btn" onClick={onClose}>&times;</button>
                        </div>
                        
                        <form className="auth-form" onSubmit={(e) => handleMockSubmit(e, 'LOGIN')}>
                            <div className="auth-input-group">
                                <input type="email" placeholder="Email" required className="pill-input" />
                            </div>
                            <div className="auth-input-group password-wrap">
                                <span className="eye-icon">visibility</span>
                                <input type="password" placeholder="Password" required className="pill-input highlight-border" />
                            </div>

                            <Button type="submit" variant="secondary" className="pill-btn auth-btn" disabled={isLoading}>
                                {isLoading ? 'Processing...' : 'Log In'}
                            </Button>

                            <div className="auth-options">
                                <p>Don't have an account? <span onClick={() => setView('SIGNUP')}>Sign Up</span></p>
                                <span className="forgot-link">Forget Password?</span>
                            </div>

                            <button type="button" className="pill-btn google-btn" onClick={() => handleMockSubmit(null, 'GOOGLE')}>
                                Sign In with Google
                            </button>
                        </form>
                    </div>
                )}

                {view === 'BOOKING' && (
                    <div className="view-content animate-in scrollable-view">
                        <div className="modal-header">
                            <div className="title-group">
                                <span className="modal-label">Personal & Birth Details</span>
                                <h2>Book an Appointment</h2>
                            </div>
                            <button className="close-btn" onClick={onClose}>&times;</button>
                        </div>
                        <form className="appointment-form" onSubmit={(e) => handleMockSubmit(e, 'FINAL')}>
                            
                            <div className="form-section">
                                <h4 className="section-title">Personal Details</h4>
                                <div className="form-grid">
                                    <div className="input-group">
                                        <label>First Name</label>
                                        <input type="text" placeholder="Enter your first name" required />
                                    </div>
                                    <div className="input-group">
                                        <label>Last Name</label>
                                        <input type="text" placeholder="Enter your last name" required />
                                    </div>
                                </div>

                                <div className="input-group mt-15">
                                    <label>Gender</label>
                                    <div className="radio-group">
                                        <label className="radio-label">
                                            <input type="radio" name="gender" value="male" defaultChecked />
                                            <span>Male</span>
                                        </label>
                                        <label className="radio-label">
                                            <input type="radio" name="gender" value="female" />
                                            <span>Female</span>
                                        </label>
                                        <label className="radio-label">
                                            <input type="radio" name="gender" value="other" />
                                            <span>Other</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="form-grid-three mt-15">
                                    <div className="input-group">
                                        <label>Day</label>
                                        <input type="text" placeholder="DD" required />
                                    </div>
                                    <div className="input-group">
                                        <label>Month</label>
                                        <input type="text" placeholder="MM" required />
                                    </div>
                                    <div className="input-group">
                                        <label>Year</label>
                                        <input type="text" placeholder="YYYY" required />
                                    </div>
                                </div>

                                <div className="form-grid-three mt-15">
                                    <div className="input-group">
                                        <label>Hour</label>
                                        <input type="text" placeholder="HH" required />
                                    </div>
                                    <div className="input-group">
                                        <label>Minute</label>
                                        <input type="text" placeholder="MM" required />
                                    </div>
                                    <div className="input-group">
                                        <label>AM/PM</label>
                                        <select required>
                                            <option value="AM">AM</option>
                                            <option value="PM">PM</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="input-group full-width mt-15">
                                    <label>Birth Place</label>
                                    <input type="text" placeholder="Enter your birth place" required />
                                </div>
                            </div>

                            <div className="form-section mt-25">
                                <h4 className="section-title">Contact Details</h4>
                                <div className="input-group">
                                    <label>Phone</label>
                                    <div className="phone-input">
                                        <span className="prefix">+91</span>
                                        <input type="tel" placeholder="1234567890" required />
                                    </div>
                                </div>

                                <div className="available-date-box mt-20">
                                    <label>Available Date</label>
                                    <select required>
                                        <option value="" disabled selected>Select a date</option>
                                        <option value="1">Available Date 1</option>
                                        <option value="2">Available Date 2</option>
                                    </select>
                                </div>

                                <div className="input-group mt-15">
                                    <label>Email</label>
                                    <input type="email" placeholder="example@example.com" required />
                                </div>
                            </div>

                            <div className="form-section mt-25">
                                <div className="input-group full-width">
                                    <label>Consultation Details</label>
                                    <textarea placeholder="Enter Consultation Details"></textarea>
                                </div>
                            </div>

                            <div className="form-actions mt-25">
                                <Button type="submit" variant="secondary" className="submit-btn" disabled={isLoading}>
                                    {isLoading ? 'Submitting...' : 'Submit'}
                                </Button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppointmentModal;
