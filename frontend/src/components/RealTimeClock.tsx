import React, { useEffect, useState } from 'react';
import { BerlinClock } from './BerlinClock';
import type { BerlinClockTime } from '../types';
import { api } from '../services/api';
import './Mode.css';

export const RealTimeClock: React.FC = () => {
  const [time, setTime] = useState<BerlinClockTime | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchTime = async () => {
      try {
        const currentTime = await api.getCurrentTime();
        setTime(currentTime);
        setError('');
      } catch (err) {
        setError('Failed to fetch time from server');
        console.error(err);
      }
    };

    // Fetch immediately
    fetchTime();

    // Then fetch every second
    const interval = setInterval(fetchTime, 1000);

    return () => clearInterval(interval);
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!time) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="mode-container">
      <h2 className="mode-title">Real-Time Berlin Clock</h2>
      <p className="mode-description">
        Watch the Berlin Clock display the current time in real-time.
        The lamps update every second.
      </p>
      <BerlinClock time={time} />
    </div>
  );
};