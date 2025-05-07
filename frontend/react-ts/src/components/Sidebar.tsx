import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCrimeSubtypes } from '../services/api';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  // State for crime subtypes and loading state
  const [crimeSubtypes, setCrimeSubtypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch crime subtypes from API on component mount
  useEffect(() => {
    const fetchSubtypes = async () => {
      try {
        setLoading(true);
        setError(null);
        const subtypes = await fetchCrimeSubtypes();
        setCrimeSubtypes(subtypes);
      } catch (err) {
        console.error('Failed to fetch crime subtypes:', err);
        setError('Failed to load crime types. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubtypes();
  }, []);

  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Quick Find</h3>
          <button className="close-sidebar" onClick={toggleSidebar}>×</button>
        </div>
        <div className="sidebar-content">
          {/* Crime subtypes from API are displayed as links to device selection */}
          <ul className="sidebar-menu">
            <li>
              <Link to="/home" onClick={toggleSidebar}>Home</Link>
            </li>
            
            {loading ? (
              <li className="sidebar-loading">Loading crime types...</li>
            ) : error ? (
              <li className="sidebar-error">{error}</li>
            ) : (
              // Map through the fetched crime subtypes
              crimeSubtypes.map((subtype, index) => (
                <li key={`subtype-${index}`}>
                  <Link 
                    to={`/device-selection/${encodeURIComponent(subtype.toLowerCase())}`} 
                    onClick={toggleSidebar}
                    className="sidebar-item-link"
                  >
                    {subtype}
                  </Link>
                </li>
              ))
            )}
            
            {/* Always show the custom search option */}
            <li>
              <Link to="/chat/custom" onClick={toggleSidebar} className="sidebar-custom-link">Ask AI</Link>
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
