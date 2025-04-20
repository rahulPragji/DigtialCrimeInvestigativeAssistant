import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import appLogo from '../assets/Icons/android-chrome-512x512.png';

const LandingPage: React.FC = () => {
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  
  const scrollToHowItWorks = () => {
    setShowHowItWorks(true);
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight / 2) {
        setShowHowItWorks(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="container">
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
      
      <div className="hero-section">
        <div className="cyber-grid"></div>
        <div className="title-container">
          <div className="logo-container">
            <img src={appLogo} alt="DCIA Logo" className="app-logo" />
          </div>
          <h1 className="main-title">
            Digital Crime Investigative<br />
            Assistant - DCIA
          </h1>
          <div className="button-group">
            <Link to="/home" className="btn btn-primary">
              Get Started
            </Link>
            <button onClick={scrollToHowItWorks} className="btn btn-secondary">
              Learn More
            </button>
          </div>
        </div>
      </div>
      
      <div className={`how-it-works-section ${showHowItWorks ? 'show' : ''}`} ref={howItWorksRef}>
        <h2>How it Works</h2>
        <div className="steps-container">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam dapibus velit in magna fringilla, in pharetra magna fermentum. Phasellus in porta eros, nec faucibus nisl. Mauris ac purus vel ex malesuada aliquet. Vivamus sit amet nulla nec lacus vulputate finibus.</p>
          
          <p>Suspendisse gravida metus non neque congue, eget elementum nibh fermentum. Quisque interdum, eros id vulputate dignissim, eros nulla varius massa, a ullamcorper nisi sapien ut odio. Etiam convallis, justo at dictum vestibulum, tortor dui pharetra orci, nec hendrerit ex risus quis ex.</p>
          
          <p>Praesent fermentum, elit vel scelerisque faucibus, magna libero faucibus nulla, ut euismod metus turpis quis dui. In malesuada magna eget massa porta, at dictum neque rhoncus. Nulla luctus volutpat lectus, at pulvinar magna sollicitudin eget.</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
