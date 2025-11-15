import React, { useState, useEffect } from 'react';
import { BerlinClock } from './BerlinClock';
import type { BerlinClockTime } from '../types';
import { api } from '../services/api';
import './Mode.css';

const initialState: BerlinClockTime = {
  secondsLamp: 'O',
  fiveHoursRow: 'OOOO',
  singleHoursRow: 'OOOO',
  fiveMinutesRow: 'OOOOOOOOOOO',
  singleMinutesRow: 'OOOO',
  currentTime: '',
};

export const DecodeMode: React.FC = () => {
  const [clockState, setClockState] = useState<BerlinClockTime>(() => {
    const saved = localStorage.getItem('berlinClockDecodeState');
    return saved ? JSON.parse(saved) : initialState;
  });
  const [decodedTime, setDecodedTime] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Save to localStorage when clock state changes
  useEffect(() => {
    localStorage.setItem('berlinClockDecodeState', JSON.stringify(clockState));
  }, [clockState]);

  const toggleLamp = (row: string, index: number) => {
    setClockState((prev) => {
      const newState = { ...prev };

      switch (row) {
        case 'seconds':
          newState.secondsLamp = prev.secondsLamp === 'Y' ? 'O' : 'Y';
          break;

        case 'fiveHours': {
          const arr = prev.fiveHoursRow.split('');
          // Check if previous lamps are on (if not the first lamp)
          if (index > 0 && arr[index - 1] === 'O') {
            return prev; // Can't turn on if previous is off
          }

          if (arr[index] === 'R') {
            // Turning off: turn off all lamps to the right as well
            for (let i = index; i < arr.length; i++) {
              arr[i] = 'O';
            }
          } else {
            // Turning on
            arr[index] = 'R';
          }
          newState.fiveHoursRow = arr.join('');
          break;
        }

        case 'singleHours': {
          const arr = prev.singleHoursRow.split('');
          if (index > 0 && arr[index - 1] === 'O') {
            return prev;
          }

          if (arr[index] === 'R') {
            for (let i = index; i < arr.length; i++) {
              arr[i] = 'O';
            }
          } else {
            arr[index] = 'R';
          }
          newState.singleHoursRow = arr.join('');
          break;
        }

        case 'fiveMinutes': {
          const arr = prev.fiveMinutesRow.split('');
          if (index > 0 && arr[index - 1] === 'O') {
            return prev;
          }

          const isQuarterMarker = (index + 1) % 3 === 0;
          const onChar = isQuarterMarker ? 'R' : 'Y';

          if (arr[index] !== 'O') {
            for (let i = index; i < arr.length; i++) {
              arr[i] = 'O';
            }
          } else {
            arr[index] = onChar;
          }
          newState.fiveMinutesRow = arr.join('');
          break;
        }

        case 'singleMinutes': {
          const arr = prev.singleMinutesRow.split('');
          if (index > 0 && arr[index - 1] === 'O') {
            return prev;
          }

          if (arr[index] === 'Y') {
            for (let i = index; i < arr.length; i++) {
              arr[i] = 'O';
            }
          } else {
            arr[index] = 'Y';
          }
          newState.singleMinutesRow = arr.join('');
          break;
        }
      }

      return newState;
    });
  };

  // Auto-decode when clock state changes
  useEffect(() => {
    handleDecode();
  }, [clockState]);

  const handleDecode = async () => {
    try {
      const result = await api.decodeTime(clockState);
      setDecodedTime(result.time);
      setError('');
    } catch (err) {
      setError('Failed to decode the Berlin Clock configuration');
      console.error(err);
    }
  };

  const handleReset = () => {
    setClockState(initialState);
    setDecodedTime('');
    setError('');
  };

  return (
    <div className="mode-container">
      <h2 className="mode-title">Decode Berlin Clock</h2>
      <p className="mode-description">
        Click on the lamps to turn them on/off and create your own Berlin Clock configuration.
      </p>

      {decodedTime && (
        <div className="decoded-result">
          <div className="decoded-time">{decodedTime}</div>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      <BerlinClock time={clockState} interactive onLampClick={toggleLamp} />

      <div className="button-group">
        <button className="reset-button" onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  );
};