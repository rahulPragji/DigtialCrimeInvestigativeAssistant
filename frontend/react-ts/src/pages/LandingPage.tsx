import React from 'react';
import { Link } from 'react-router-dom';
import appLogo from '../assets/Icons/android-chrome-512x512.png';



const LandingPage: React.FC = () => {
  return (
    <div className="landing-container">
      <section className="hero-section-wrapper">
        <div className="hero-section">
          <div className="cyber-grid"></div>
          <div className="forensic-particles">
            {Array.from({ length: 20 }).map((_, index) => (
              <div key={index} className="particle" style={{
                '--random-size': `${Math.random() * 3 + 0.5}px`,
                '--random-x': `${Math.random() * 100}%`,
                '--random-y': `${Math.random() * 100}%`,
                '--random-duration': `${Math.random() * 50 + 10}s`,
                '--random-delay': `${Math.random() * 5}s`,
              } as React.CSSProperties} />
            ))}
          </div>
          <div className="title-container">
            <div className="logo-container">
              <img src={appLogo} alt="DCIA Logo" className="app-logo" />
            </div>
            <h1 className="main-title">
              Digital Crime Investigative<br />
              Assistant - DCIA
            </h1>
            <div className="button-group">
              <Link to="/home" className="btn btn-primary full-width-btn">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
