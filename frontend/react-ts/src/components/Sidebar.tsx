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
          <ul className="sidebar-menu">
            <li>
              <Link to="/home" onClick={toggleSidebar}>Home</Link>
            </li>
            <li>
              <Link to="/cases" onClick={toggleSidebar}>Identity theft</Link>
            </li>
            <li>
              <Link to="/evidence" onClick={toggleSidebar}>type2</Link>
            </li>
            <li>
              <Link to="/analytics" onClick={toggleSidebar}>typ3</Link>
            </li>
            <li>
              <Link to="/reports" onClick={toggleSidebar}>4</Link>
            </li>
            <li>
              <Link to="/tools" onClick={toggleSidebar}>5</Link>
            </li>
            <li>
              <Link to="/network" onClick={toggleSidebar}>6</Link>
            </li>
            <li>
              <Link to="/logs" onClick={toggleSidebar}>7</Link>
            </li>
            <li>
              <Link to="/settings" onClick={toggleSidebar}>8</Link>
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
