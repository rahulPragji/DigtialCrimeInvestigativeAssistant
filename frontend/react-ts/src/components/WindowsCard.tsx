import React from 'react';
import { Link } from 'react-router-dom';

// Props interface for the WindowsCard component
interface WindowsCardProps {
  crimeType: string;
  onClick?: () => void;
}

/**
 * WindowsCard Component
 * 
 * Displays a card for Windows device selection with styling and information specific to Windows.
 * When clicked, it navigates to the artefacts page for Windows devices with the specific crime type.
 */
const WindowsCard: React.FC<WindowsCardProps> = ({ crimeType, onClick }) => {
  return (
    <Link 
      to={`/artefacts/windows/${encodeURIComponent(crimeType)}`} 
      className="device-card windows-card"
      onClick={onClick}
    >
      <div className="device-card-inner">
        <div className="device-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="windows-icon">
            <path d="M0,0v11.408h11.408V0H0z M12.594,0v11.408H24V0H12.594z M0,12.594v11.408h11.408V12.594H0z M12.594,12.594v11.408H24V12.594H12.594z"/>
          </svg>
        </div>
        <h3>Windows</h3>
        <p>View artefacts related to {crimeType} on Windows systems</p>
      </div>
    </Link>
  );
};

export default WindowsCard;