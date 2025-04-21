{/* this page will allow users to select the device they are investigating*/}
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AndroidCard from '../components/AndroidCard';
import WindowsCard from '../components/WindowsCard';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

/**
 * DeviceSelectionPage Component
 * 
 * This page allows users to select the device type they are investigating (Android or Windows).
 * It receives the crime type from URL parameters and displays device options accordingly.
 */
const DeviceSelectionPage: React.FC = () => {
  const { crimeType } = useParams<{ crimeType: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // If no crime type is provided, redirect to home
  useEffect(() => {
    if (!crimeType) {
      navigate('/home');
    }
  }, [crimeType, navigate]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="container">
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <main className="device-selection-main">
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

        <div className="device-selection-container">
          <h2>Select Device Type</h2>
          <p className="selection-description">
            Select the device type you're investigating for {crimeType || 'this crime type'}
          </p>

          <div className="device-cards-container">
            <AndroidCard crimeType={crimeType || ''} />
            <WindowsCard crimeType={crimeType || ''} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DeviceSelectionPage;