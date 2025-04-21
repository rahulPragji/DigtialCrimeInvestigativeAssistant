import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ArtefactCard from '../components/ArtefactCard';
import EnlargedArtefact from '../components/EnlargedArtefact';
import Loader from '../components/Loader';

// Artefact type definition
interface Artefact {
  id: string;
  name: string;
  location: string;
  description: string;
  selected?: boolean;
}

/**
 * ArtefactsPage Component
 * 
 * Displays artefacts related to a specific crime type for a selected device type (Android or Windows).
 * This component receives deviceType and crimeType from URL parameters.
 */
const ArtefactsPage: React.FC = () => {
  const { deviceType: urlDeviceType, crimeType } = useParams<{ deviceType: string; crimeType: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeDeviceType, setActiveDeviceType] = useState<string>(urlDeviceType || 'android');
  const [selectedArtefact, setSelectedArtefact] = useState<Artefact | null>(null);
  const [artefacts, setArtefacts] = useState<Artefact[]>([]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleDeviceTypeChange = (deviceType: string) => {
    setActiveDeviceType(deviceType);
  };

  const handleArtefactClick = (artefact: Artefact) => {
    setSelectedArtefact(artefact);
  };

  // Function to determine icon based on artefact properties
  const getArtefactIcon = (artefact: Artefact): string => {
    const { name, location } = artefact;
    const lowerName = name.toLowerCase();
    const lowerLocation = location.toLowerCase();
    
    // Determine icon based on file type/location patterns
    if (lowerLocation.includes('database') || lowerLocation.endsWith('.db')) {
      return '💾'; // Database files
    } else if (lowerLocation.includes('cache')) {
      return '🔄'; // Cache files
    } else if (lowerLocation.includes('logs') || lowerLocation.includes('history')) {
      return '📋'; // Log files
    } else if (lowerLocation.includes('shared_prefs') || lowerLocation.includes('config')) {
      return '⚙️'; // Configuration/preferences
    } else if (lowerLocation.includes('messaging') || lowerName.includes('message')) {
      return '💬'; // Messaging related
    } else if (lowerLocation.includes('browser') || lowerName.includes('browser')) {
      return '🌐'; // Browser related
    } else if (activeDeviceType === 'android') {
      return '📱'; // Default for Android
    } else if (activeDeviceType === 'windows') {
      return '💻'; // Default for Windows
    }
    
    // Default fallback
    return '📄';
  };

  // Mock data - in a real app, this would come from an API call
  useEffect(() => {
    setLoading(true);
    
    // Simulate API call with setTimeout
    const timer = setTimeout(() => {
      // Different data based on device type
      if (activeDeviceType === 'android') {
        setArtefacts([
          {
            id: '1',
            name: 'User Database',
            location: '/data/data/com.app/databases/user_data.db',
            description: 'Contains user profile information and authentication data.'
          },
          {
            id: '2',
            name: 'Media Cache',
            location: '/data/data/com.messaging/files/cache/',
            description: 'Cached media files from messaging applications.'
          },
          {
            id: '3',
            name: 'App Preferences',
            location: '/sdcard/Android/data/com.social/shared_prefs/',
            description: 'Shared preferences containing login tokens and user details.'
          },
          {
            id: '4',
            name: 'Browser History',
            location: '/data/data/com.browser/databases/history.db',
            description: 'Browser history database with visited sites and timestamps.'
          }
        ]);
      } else {
        setArtefacts([
          {
            id: '1',
            name: 'User Database',
            location: 'C:\\Users\\AppData\\Roaming\\App\\Database.db',
            description: 'Main application database with user information.'
          },
          {
            id: '2',
            name: 'System Logs',
            location: 'C:\\Program Files\\App\\Logs\\',
            description: 'Application logs with user activity.'
          },
          {
            id: '3',
            name: 'Temp Cache',
            location: 'C:\\Users\\AppData\\Local\\Temp\\Cache\\',
            description: 'Temporary cache files that may contain sensitive information.'
          }
        ]);
      }
      
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [activeDeviceType, crimeType]);

  return (
    <div className="container">
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <main className="artefacts-main">
        <div className="cyber-grid"></div>
        
        <div className="artefacts-container">
          <h2 className="artefacts-title">{crimeType}</h2>
          
          <div className="device-tabs">
            <button 
              className={`device-tab ${activeDeviceType === 'android' ? 'active' : ''}`}
              onClick={() => handleDeviceTypeChange('android')}
            >
              Android
            </button>
            <button 
              className={`device-tab ${activeDeviceType === 'windows' ? 'active' : ''}`}
              onClick={() => handleDeviceTypeChange('windows')}
            >
              Windows
            </button>
          </div>
          
          {loading ? (
            <Loader />
          ) : (
            <div className="artefacts-list">
              {artefacts.map(artefact => (
                <div 
                  key={artefact.id} 
                  className="artefact-list-item"
                  onClick={() => handleArtefactClick(artefact)}
                >
                  <div className="artefact-list-content">
                    <h3 className="artefact-name">{artefact.name}</h3>
                    <div className="artefact-divider"></div>
                    <p className="artefact-location">location : {artefact.location}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Enlarged artefact modal */}
      {selectedArtefact && (
        <EnlargedArtefact
          name={selectedArtefact.name}
          location={selectedArtefact.location}
          description={selectedArtefact.description}
          deviceType={activeDeviceType}
          crimeType={crimeType || ''}
          onClose={() => setSelectedArtefact(null)}
        />
      )}
    </div>
  );
};

export default ArtefactsPage;