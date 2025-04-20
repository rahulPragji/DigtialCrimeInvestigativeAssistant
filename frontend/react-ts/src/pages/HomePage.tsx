import React, { useState } from 'react';
import appLogo from '../assets/Icons/android-chrome-192x192.png';
import Sidebar from '../components/Sidebar';

const HomePage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="container">
      <header className="header">
        <div className="menu-toggle" onClick={toggleSidebar}>
          <div className="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <div className="logo">
          <img src={appLogo} alt="DCIA Logo" className="header-logo" />
          <span>DCIA</span>
        </div>
      </header>

      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <main className="home-main">
        <div className="search-container">
          <h2>What are you looking for?</h2>
          <div className="search-options">
            <button className="search-option">Digital Evidence</button>
            <button className="search-option">Network Analysis</button>
            <button className="search-option">Case Files</button>
            <button className="search-option">User Activity</button>
            <button className="search-option">System Logs</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
