import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

import { fetchEvidenceItems, EvidenceItem as ApiEvidenceItem } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import EnlargedArtefact from '../components/EnlargedArtefact';
import Loader from '../components/Loader';
import SearchBar from '../components/SearchBar';

// Artefact type definition
interface Artefact {
  id: string;
  name: string;
  location: string;
  description: string;
  significance: string;
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
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeDeviceType, setActiveDeviceType] = useState<string>(urlDeviceType || 'android');
  const [selectedArtefact, setSelectedArtefact] = useState<Artefact | null>(null);
  const [artefacts, setArtefacts] = useState<Artefact[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredArtefacts, setFilteredArtefacts] = useState<Artefact[]>([]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleDeviceTypeChange = (deviceType: string) => {
    setActiveDeviceType(deviceType);
  };

  const handleArtefactClick = (artefact: Artefact) => {
    setSelectedArtefact(artefact);
  };

  const handleAskAI = () => {
    // Navigate to the chat page with the same URL structure as EnlargedArtefact
    navigate(`/chat/${activeDeviceType}/${crimeType}`);
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  };

  /* 
   * Note: getArtefactIcon function has been removed as it's not currently used.
   * This can be re-added when implementing icons for artefacts.
   */

  // Filter artefacts based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredArtefacts(artefacts);
    } else {
      const filtered = artefacts.filter(artefact => 
        artefact.name.toLowerCase().includes(searchQuery) || 
        artefact.location.toLowerCase().includes(searchQuery) ||
        artefact.significance.toLowerCase().includes(searchQuery)
      );
      setFilteredArtefacts(filtered);
    }
  }, [searchQuery, artefacts]);

  // Fetch evidence items from API based on crime subtype and device type
  useEffect(() => {
    // Only fetch if we have both crimeType and device type
    if (!crimeType) return;
    
    const fetchArtefacts = async () => {
      setLoading(true);
      
      try {
        // Call API to get evidence items
        const evidenceItems = await fetchEvidenceItems(
          crimeType,
          activeDeviceType as 'android' | 'windows'
        );
        
        // Filter out items with no locations for the selected device
        const filteredItems = evidenceItems.filter(item => 
          item.locations && item.locations.length > 0
        );
        
        // Map API response to Artefact interface
        const mappedArtefacts: Artefact[] = filteredItems.map((item: ApiEvidenceItem, index: number) => {
          // Get the first location or an empty string if no locations
          const mainLocation = item.locations && item.locations.length > 0 
            ? item.locations[0] 
            : 'Location not specified';
            
          // Join additional locations for the description
          const additionalLocations = item.locations && item.locations.length > 1
            ? `Also found at: ${item.locations.slice(1).join(', ')}`
            : '';
            
          // Create description from significance and additional locations
          const description = [
            item.significance,
            additionalLocations
          ].filter(Boolean).join('\n\n');
          
          return {
            id: `${index + 1}`,
            name: item.name,
            location: mainLocation,
            description: description,
            significance: item.significance
          };
        });
        
        setArtefacts(mappedArtefacts);
        setFilteredArtefacts(mappedArtefacts);
      } catch (error) {
        console.error(`Error fetching evidence items for ${crimeType} on ${activeDeviceType}:`, error);
        // Set empty array to show no results instead of showing an error
        setArtefacts([]);
        setFilteredArtefacts([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchArtefacts();
  }, [activeDeviceType, crimeType]);

  return (
    <div className="container">
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <main className="artefacts-main">
        <div className="cyber-grid"></div>
        
        <div className="artefacts-container">
          <h2 className="artefacts-title">{crimeType}</h2>
          
          <div className="device-tabs-container">
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
    <SearchBar
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      placeholder="Search evidence items..."
    />
              <button className="ask-ai-button" onClick={handleAskAI}>
            <span>Ask AI about this artefact</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
          </button>
  </div>
</div>
          
          {loading ? (
            <Loader />
          ) : (
            <div className="artefacts-list-container">
              <div className="artefacts-list">
                {filteredArtefacts.length === 0 ? (
                  <div className="no-artefacts-message">
                    {searchQuery.trim() !== '' ? (
                      <p>No matches found for "{searchQuery}".</p>
                    ) : (
                      <>
                        <p>No evidence items found for {crimeType} on {activeDeviceType} devices.</p>
                        <p>Try selecting a different crime type or device.</p>
                      </>
                    )}
                  </div>
                ) : filteredArtefacts.map(artefact => (
                  <div 
                    key={artefact.id} 
                    className="artefact-list-item"
                    onClick={() => handleArtefactClick(artefact)}
                  >
                    <div className="artefact-list-content">
                      <h3 className="artefact-name">{artefact.name}</h3>
                      <div className="artefact-divider"></div>
                      <p className="artefact-location">{artefact.location}</p>
                      {artefact.significance && (
                        <p className="artefact-significance">
                          {artefact.significance.length > 60 
                            ? `${artefact.significance.substring(0, 60)}...` 
                            : artefact.significance}
                        </p>
                      )}
                    </div>
                    {/* Add subtle blue glow effect on hover (as per user preference) */}
                    <div className="artefact-hover-effect"></div>
                  </div>
                ))}
              </div>
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