import { useState, useEffect } from 'react';
import type { AppMode } from './types';
import { RealTimeClock } from './components/RealTimeClock';
import { ConvertMode } from './components/ConvertMode';
import { DecodeMode } from './components/DecodeMode';
import { InfoMode } from './components/InfoMode';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import './App.css';

function App() {
  const [currentMode, setCurrentMode] = useState<AppMode>(() => {
    const saved = localStorage.getItem('berlinClockMode');
    return (saved as AppMode) || 'realtime';
  });

  useEffect(() => {
    localStorage.setItem('berlinClockMode', currentMode);
  }, [currentMode]);

  const renderMode = () => {
    switch (currentMode) {
      case 'realtime':
        return <RealTimeClock />;
      case 'convert':
        return <ConvertMode />;
      case 'decode':
        return <DecodeMode />;
      case 'info':
        return <InfoMode />;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Berlin Clock</h1>
        <p className="app-subtitle">Mengenlehreuhr - The Time Teaching Clock</p>
      </header>

      <main className="app-main">
        {renderMode()}
        <Footer />
      </main>

      <Navigation currentMode={currentMode} onModeChange={setCurrentMode} />
    </div>
  );
}

export default App;