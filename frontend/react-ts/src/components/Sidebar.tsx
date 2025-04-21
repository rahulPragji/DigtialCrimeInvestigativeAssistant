import React from 'react';
import { Link } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Quick Find</h3>
          <button className="close-sidebar" onClick={toggleSidebar}>×</button>
        </div>
        <div className="sidebar-content">
          {/*Gets all crime types from Databse using api and puts it in this list as a link */}
          {/* Items in list link to deviceSelection page to chose whether they want information on Android or Windows */}
          <ul className="sidebar-menu">
            <li>
              <Link to="/home" onClick={toggleSidebar}>Home</Link>
            </li>
            <li>
              <Link to="/device-selection/identity-theft" onClick={toggleSidebar}>Identity theft</Link>
            </li>
            <li>
              <Link to="/device-selection/phishing" onClick={toggleSidebar}>Phishing</Link>
            </li>
            <li>
              <Link to="/device-selection/malware" onClick={toggleSidebar}>Malware</Link>
            </li>
            <li>
              <Link to="/device-selection/data-breach" onClick={toggleSidebar}>Data Breach</Link>
            </li>
            <li>
              <Link to="/device-selection/ransomware" onClick={toggleSidebar}>Ransomware</Link>
            </li>
            <li>
              <Link to="/device-selection/social-engineering" onClick={toggleSidebar}>Social Engineering</Link>
            </li>
            <li>
              <Link to="/device-selection/custom" onClick={toggleSidebar}>Custom Search</Link>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Overlay that appears when sidebar is open */}
      <div 
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`} 
        onClick={toggleSidebar}
      />
    </>
  );
};

export default Sidebar;
