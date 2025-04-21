import React from 'react';
import appLogo from '../assets/Icons/android-chrome-192x192.png';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  return (
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
  );
};

export default Navbar;
