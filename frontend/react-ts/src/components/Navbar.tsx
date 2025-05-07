import React from 'react';
import { Link } from 'react-router-dom';
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
      <Link to="/home" className="logo-link">
        <div className="logo">
          <img src={appLogo} alt="DCIA Logo" className="header-logo" />
          <span>DCIA</span>
        </div>
      </Link>
    </header>
  );
};

export default Navbar;
