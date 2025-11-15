import React from 'react';
import type {BerlinClockTime} from '../types';
import './BerlinClock.css';

interface BerlinClockProps {
  time: BerlinClockTime;
  interactive?: boolean;
  onLampClick?: (row: string, index: number) => void;
}

export const BerlinClock: React.FC<BerlinClockProps> = ({ time, interactive = false, onLampClick }) => {
  const renderLamp = (
    color: string,
    isOn: boolean,
    rowName: string,
    index: number,
    shape: 'circle' | 'rectangle' = 'rectangle'
  ) => {
    const lampClass = `lamp ${shape} ${color} ${isOn ? 'on' : 'off'} ${interactive ? 'interactive' : ''}`;

    return (
      <div
        key={index}
        className={lampClass}
        onClick={() => interactive && onLampClick && onLampClick(rowName, index)}
      />
    );
  };

  const renderSecondsLamp = () => {
    const isOn = time.secondsLamp === 'Y';
    return (
      <div className="seconds-row">
        {renderLamp('yellow', isOn, 'seconds', 0, 'circle')}
      </div>
    );
  };

  const renderFiveHoursRow = () => {
    return (
      <div className="hours-row five-hours">
        {time.fiveHoursRow.split('').map((lamp, index) =>
          renderLamp('red', lamp !== 'O', 'fiveHours', index)
        )}
      </div>
    );
  };

  const renderSingleHoursRow = () => {
    return (
      <div className="hours-row single-hours">
        {time.singleHoursRow.split('').map((lamp, index) =>
          renderLamp('red', lamp !== 'O', 'singleHours', index)
        )}
      </div>
    );
  };

  const renderFiveMinutesRow = () => {
    return (
      <div className="minutes-row five-minutes">
        {time.fiveMinutesRow.split('').map((lamp, index) => {
          const isOn = lamp !== 'O';
          // Every 3rd lamp (at positions 2, 5, 8) should be red when it's a quarter marker
          const isQuarterMarker = (index + 1) % 3 === 0;
          const color = isQuarterMarker ? 'red' : 'yellow';
          return renderLamp(color, isOn, 'fiveMinutes', index);
        })}
      </div>
    );
  };

  const renderSingleMinutesRow = () => {
    return (
      <div className="minutes-row single-minutes">
        {time.singleMinutesRow.split('').map((lamp, index) =>
          renderLamp('yellow', lamp !== 'O', 'singleMinutes', index)
        )}
      </div>
    );
  };

  return (
    <div className="berlin-clock">
      {renderSecondsLamp()}
      {renderFiveHoursRow()}
      {renderSingleHoursRow()}
      {renderFiveMinutesRow()}
      {renderSingleMinutesRow()}
      {time.currentTime && (
        <div className="digital-time">{time.currentTime}</div>
      )}
    </div>
  );
};