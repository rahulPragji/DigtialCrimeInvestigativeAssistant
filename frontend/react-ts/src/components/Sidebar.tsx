import React from 'react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Investigation Tools</h3>
          <button className="close-sidebar" onClick={toggleSidebar}>×</button>
        </div>
        <div className="sidebar-content">
          <ul className="sidebar-menu">
            <li><a href="#cases">Active Cases</a></li>
            <li><a href="#evidence">Evidence Database</a></li>
            <li><a href="#analytics">Analytics Dashboard</a></li>
            <li><a href="#reports">Investigation Reports</a></li>
            <li><a href="#tools">Forensic Tools</a></li>
            <li><a href="#network">Network Analysis</a></li>
            <li><a href="#logs">System Logs</a></li>
            <li><a href="#settings">Settings</a></li>
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
