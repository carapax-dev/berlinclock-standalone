import React from 'react';
import type { AppMode } from '../types';
import './Navigation.css';

interface NavigationProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentMode, onModeChange }) => {
  return (
    <nav className="navigation">
      <button
        className={`nav-button ${currentMode === 'realtime' ? 'active' : ''}`}
        onClick={() => onModeChange('realtime')}
      >
        <span className="nav-icon">🕐</span>
        <span className="nav-label">Real-Time</span>
      </button>
      <button
        className={`nav-button ${currentMode === 'convert' ? 'active' : ''}`}
        onClick={() => onModeChange('convert')}
      >
        <span className="nav-icon">🔄</span>
        <span className="nav-label">Convert</span>
      </button>
      <button
        className={`nav-button ${currentMode === 'decode' ? 'active' : ''}`}
        onClick={() => onModeChange('decode')}
      >
        <span className="nav-icon">🔍</span>
        <span className="nav-label">Decode</span>
      </button>
      <button
        className={`nav-button ${currentMode === 'info' ? 'active' : ''}`}
        onClick={() => onModeChange('info')}
      >
        <span className="nav-icon">ℹ️</span>
        <span className="nav-label">Info</span>
      </button>
    </nav>
  );
};