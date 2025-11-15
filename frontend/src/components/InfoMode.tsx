import React, { useState } from 'react';
import './InfoMode.css';

export const InfoMode: React.FC = () => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const toggleTooltip = (id: string) => {
    setActiveTooltip(activeTooltip === id ? null : id);
  };

  return (
    <div className="mode-container info-mode">
      <h2 className="mode-title">How the Berlin Clock Works</h2>
      <p className="mode-description">
        The Berlin Clock (Mengenlehreuhr) displays time using colored lamps instead of digits.
      </p>

      <div className="info-content">
        {/* Seconds Lamp */}
        <div className="info-section">
          <div className="info-lamp-container">
            <div className="info-lamp circle yellow on"></div>
            <div className="info-multiplier">Seconds</div>
          </div>
          <div className="info-explanation">
            <h3>Seconds Lamp</h3>
            <p>The top circular lamp blinks every second:</p>
            <ul>
              <li><strong>ON (Yellow):</strong> Odd seconds (1, 3, 5, ...)</li>
              <li><strong>OFF:</strong> Even seconds (0, 2, 4, ...)</li>
            </ul>
          </div>
        </div>

        {/* Five Hours Row */}
        <div className="info-section">
          <div className="info-lamp-container">
            <div className="info-row">
              <div className="info-lamp rectangle red on"></div>
              <div className="info-lamp rectangle red on"></div>
              <div className="info-lamp rectangle red off"></div>
              <div className="info-lamp rectangle red off"></div>
            </div>
            <div className="info-multiplier">× 5 hours</div>
          </div>
          <div className="info-explanation">
            <h3>Five Hours Row</h3>
            <p>Each red lamp represents <strong>5 hours</strong>:</p>
            <ul>
              <li>1 lamp ON = 5 hours</li>
              <li>2 lamps ON = 10 hours</li>
              <li>3 lamps ON = 15 hours</li>
              <li>4 lamps ON = 20 hours</li>
            </ul>
            <div className="example-box" onClick={() => toggleTooltip('fiveHours')}>
              <span className="example-icon">💡</span> Example
              {activeTooltip === 'fiveHours' && (
                <div className="tooltip-content">
                  2 red lamps ON = 2 × 5 = <strong>10 hours</strong>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Single Hours Row */}
        <div className="info-section">
          <div className="info-lamp-container">
            <div className="info-row">
              <div className="info-lamp rectangle red on"></div>
              <div className="info-lamp rectangle red on"></div>
              <div className="info-lamp rectangle red on"></div>
              <div className="info-lamp rectangle red off"></div>
            </div>
            <div className="info-multiplier">× 1 hour</div>
          </div>
          <div className="info-explanation">
            <h3>Single Hours Row</h3>
            <p>Each red lamp represents <strong>1 hour</strong>:</p>
            <ul>
              <li>Each lamp adds 1 hour to the total</li>
              <li>Maximum: 4 hours</li>
            </ul>
            <div className="example-box" onClick={() => toggleTooltip('singleHours')}>
              <span className="example-icon">💡</span> Example
              {activeTooltip === 'singleHours' && (
                <div className="tooltip-content">
                  3 red lamps ON = 3 × 1 = <strong>3 hours</strong>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Five Minutes Row */}
        <div className="info-section">
          <div className="info-lamp-container">
            <div className="info-row">
              <div className="info-lamp small yellow on"></div>
              <div className="info-lamp small yellow on"></div>
              <div className="info-lamp small red on"></div>
              <div className="info-lamp small yellow on"></div>
              <div className="info-lamp small yellow on"></div>
              <div className="info-lamp small red on"></div>
              <div className="info-lamp small yellow off"></div>
              <div className="info-lamp small yellow off"></div>
              <div className="info-lamp small red off"></div>
              <div className="info-lamp small yellow off"></div>
              <div className="info-lamp small yellow off"></div>
            </div>
            <div className="info-multiplier">× 5 minutes</div>
          </div>
          <div className="info-explanation">
            <h3>Five Minutes Row</h3>
            <p>Each lamp represents <strong>5 minutes</strong>:</p>
            <ul>
              <li>Yellow lamps = 5 minutes each</li>
              <li><strong>Red lamps</strong> (every 3rd) = <strong>Quarter hours</strong> (15, 30, 45 min)</li>
              <li>Maximum: 11 lamps = 55 minutes</li>
            </ul>
            <div className="example-box" onClick={() => toggleTooltip('fiveMinutes')}>
              <span className="example-icon">💡</span> Example
              {activeTooltip === 'fiveMinutes' && (
                <div className="tooltip-content">
                  6 lamps ON = 6 × 5 = <strong>30 minutes</strong>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Single Minutes Row */}
        <div className="info-section">
          <div className="info-lamp-container">
            <div className="info-row">
              <div className="info-lamp rectangle yellow on"></div>
              <div className="info-lamp rectangle yellow on"></div>
              <div className="info-lamp rectangle yellow off"></div>
              <div className="info-lamp rectangle yellow off"></div>
            </div>
            <div className="info-multiplier">× 1 minute</div>
          </div>
          <div className="info-explanation">
            <h3>Single Minutes Row</h3>
            <p>Each yellow lamp represents <strong>1 minute</strong>:</p>
            <ul>
              <li>Each lamp adds 1 minute to the total</li>
              <li>Maximum: 4 minutes</li>
            </ul>
            <div className="example-box" onClick={() => toggleTooltip('singleMinutes')}>
              <span className="example-icon">💡</span> Example
              {activeTooltip === 'singleMinutes' && (
                <div className="tooltip-content">
                  2 yellow lamps ON = 2 × 1 = <strong>2 minutes</strong>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Complete Example */}
        <div className="complete-example">
          <h3>Complete Example: 13:32</h3>
          <div className="calculation-steps">
            <div className="calc-step">
              <span className="calc-label">Five Hours:</span>
              <span className="calc-value">2 lamps × 5 = 10 hours</span>
            </div>
            <div className="calc-step">
              <span className="calc-label">Single Hours:</span>
              <span className="calc-value">3 lamps × 1 = 3 hours</span>
            </div>
            <div className="calc-separator">+</div>
            <div className="calc-total">
              <strong>Total Hours: 13</strong>
            </div>
          </div>
          <div className="calculation-steps">
            <div className="calc-step">
              <span className="calc-label">Five Minutes:</span>
              <span className="calc-value">6 lamps × 5 = 30 minutes</span>
            </div>
            <div className="calc-step">
              <span className="calc-label">Single Minutes:</span>
              <span className="calc-value">2 lamps × 1 = 2 minutes</span>
            </div>
            <div className="calc-separator">+</div>
            <div className="calc-total">
              <strong>Total Minutes: 32</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};