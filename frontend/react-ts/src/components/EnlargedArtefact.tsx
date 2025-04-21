{/* this is an elarged version of the artefact card which displays more details about the artefact (possibly its significance based on the crime) */}

import React from 'react';
import { useNavigate } from 'react-router-dom';

interface EnlargedArtefactProps {
  name: string;
  location: string;
  description: string;
  iconSrc?: string;
  deviceType: string;
  crimeType: string;
  onClose: () => void;
}

const EnlargedArtefact: React.FC<EnlargedArtefactProps> = ({
  name,
  location,
  description,
  iconSrc,
  deviceType,
  crimeType,
  onClose
}) => {
  const navigate = useNavigate();

  const handleAskAI = () => {
    // Navigate to the chat page with the relevant parameters
    navigate(`/chat/${deviceType}/${crimeType}?artefact=${encodeURIComponent(name)}`);
  };

  return (
    <div className="enlarged-artefact-overlay">
      <div className="enlarged-artefact">
        <button className="close-btn" onClick={onClose}>×</button>
        
        <div className="enlarged-artefact-header">
          <div className="artefact-icon-large">
            {iconSrc ? (
              <img src={iconSrc} alt={name} />
            ) : (
              <div className="artefact-icon-placeholder large">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
                </svg>
              </div>
            )}
          </div>
          <div className="artefact-title-container">
            <h2 className="artefact-title">{name}</h2>
            <div className="artefact-subtitle">
              <span className="artefact-device-type">{deviceType}</span>
              <span className="artefact-location-full">{location}</span>
            </div>
          </div>
        </div>
        
        <div className="enlarged-artefact-content">
          <h3>Description</h3>
          <p className="artefact-description">{description}</p>
          
          <h3>Forensic Significance</h3>
          <p>This artifact is important in {crimeType} investigations because it may contain crucial evidence about user activities, communications, and digital trails related to the crime.</p>
          
          <div className="forensic-details">
            <div className="detail-item">
              <strong>Data Type:</strong> 
              <span>{name.includes('Database') ? 'Database File' : 'System File'}</span>
            </div>
            <div className="detail-item">
              <strong>Typical Size:</strong>
              <span>Varies based on usage</span>
            </div>
            <div className="detail-item">
              <strong>Encryption:</strong>
              <span>{name.toLowerCase().includes('whatsapp') ? 'Yes (Signal Protocol)' : 'No'}</span>
            </div>
          </div>
        </div>
        
        <div className="enlarged-artefact-footer">
          <button className="ask-ai-button" onClick={handleAskAI}>
            <span>Ask AI about this artefact</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnlargedArtefact;