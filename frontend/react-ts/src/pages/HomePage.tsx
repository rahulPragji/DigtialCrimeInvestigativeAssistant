import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import appLogo from '../assets/Icons/android-chrome-192x192.png';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const HomePage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeOption, setActiveOption] = useState<string | null>(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const handleOptionClick = (option: string) => {
    setActiveOption(option);
    // Future functionality would be added here
  };

  return (
    <div className="container">
      <Navbar toggleSidebar={toggleSidebar} />

      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <main className="home-main">
        <div className="cyber-grid"></div>
        <div className="forensic-particles">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="particle" style={{
              '--random-size': `${Math.random() * 2 + 0.5}px`,
              '--random-x': `${Math.random() * 100}%`,
              '--random-y': `${Math.random() * 100}%`,
              '--random-duration': `${Math.random() * 30 + 10}s`,
              '--random-delay': `${Math.random() * 5}s`,
            } as React.CSSProperties} />
          ))}
        </div>
        
        <div className="search-container">
          <h2>What are you looking for ?</h2>
          {/*buttons populated with crime types from database and one button that says describe*/}
          <div className="search-options">
            <Link to="/device-selection/identity-theft" className="search-option special-option">Identity theft</Link>
            <Link to="/device-selection/poaching" className="search-option special-option">Poaching</Link>
            <Link to="/device-selection/ransomware" className="search-option special-option">Ransomware</Link>
            <Link to="/device-selection/social-engineering" className="search-option special-option">Social engineering</Link>
            <Link to="/device-selection/custom" className="search-option special-option">Describe it</Link>
          </div>
          {/* buttons link to device selection page */}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
