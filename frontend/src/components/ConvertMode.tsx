import React, { useState, useEffect } from 'react';
import { BerlinClock } from './BerlinClock';
import type { BerlinClockTime } from '../types';
import { api } from '../services/api';
import './Mode.css';

export const ConvertMode: React.FC = () => {
  const [hours, setHours] = useState(() => {
    const saved = localStorage.getItem('berlinClockConvertHours');
    return saved ? Number(saved) : 12;
  });
  const [minutes, setMinutes] = useState(() => {
    const saved = localStorage.getItem('berlinClockConvertMinutes');
    return saved ? Number(saved) : 30;
  });
  const [seconds, setSeconds] = useState(() => {
    const saved = localStorage.getItem('berlinClockConvertSeconds');
    return saved ? Number(saved) : 45;
  });
  const [convertedTime, setConvertedTime] = useState<BerlinClockTime | null>(null);
  const [error, setError] = useState<string>('');

  // Save to localStorage when values change
  useEffect(() => {
    localStorage.setItem('berlinClockConvertHours', String(hours));
  }, [hours]);

  useEffect(() => {
    localStorage.setItem('berlinClockConvertMinutes', String(minutes));
  }, [minutes]);

  useEffect(() => {
    localStorage.setItem('berlinClockConvertSeconds', String(seconds));
  }, [seconds]);

  const handleConvert = async () => {
    try {
      const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      const result = await api.convertTime(timeString);
      setConvertedTime(result);
      setError('');
    } catch (err) {
      setError('Failed to convert time');
      console.error(err);
    }
  };

  // Auto-convert when time changes
  useEffect(() => {
    handleConvert();
  }, [hours, minutes, seconds]);

  return (
    <div className="mode-container">
      <h2 className="mode-title">Convert Time to Berlin Clock</h2>
      <p className="mode-description">
        Select a time to see it displayed as a Berlin Clock.
      </p>

      <div className="time-selector-group">
        <div className="time-selector">
          <label>Hours</label>
          <select value={hours} onChange={(e) => setHours(Number(e.target.value))}>
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={i}>
                {String(i).padStart(2, '0')}
              </option>
            ))}
          </select>
        </div>
        <span className="time-separator">:</span>
        <div className="time-selector">
          <label>Minutes</label>
          <select value={minutes} onChange={(e) => setMinutes(Number(e.target.value))}>
            {Array.from({ length: 60 }, (_, i) => (
              <option key={i} value={i}>
                {String(i).padStart(2, '0')}
              </option>
            ))}
          </select>
        </div>
        <span className="time-separator">:</span>
        <div className="time-selector">
          <label>Seconds</label>
          <select value={seconds} onChange={(e) => setSeconds(Number(e.target.value))}>
            {Array.from({ length: 60 }, (_, i) => (
              <option key={i} value={i}>
                {String(i).padStart(2, '0')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {convertedTime && (
        <div className="result-container">
          <BerlinClock time={convertedTime} />
        </div>
      )}
    </div>
  );
};