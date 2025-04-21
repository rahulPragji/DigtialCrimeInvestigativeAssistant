{/* this will show each individual artefact and its location, it can be clicked to view it in more detail*/}

import React from 'react';

interface ArtefactCardProps {
  name: string;
  location: string;
  iconSrc?: string;
  onClick: () => void;
}

const ArtefactCard: React.FC<ArtefactCardProps> = ({
  name,
  location,
  iconSrc,
  onClick
}) => {
  return (
    <div className="artefact-card" onClick={onClick}>
      <div className="artefact-card-inner">
        <div className="artefact-icon-container">
          {iconSrc ? (
            <img src={iconSrc} alt={name} className="artefact-icon" />
          ) : (
            <div className="artefact-icon-placeholder">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
              </svg>
            </div>
          )}
        </div>
        <div className="artefact-details">
          <h3 className="artefact-name">{name}</h3>
          <p className="artefact-location">{location}</p>
        </div>
        <div className="artefact-arrow">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ArtefactCard;