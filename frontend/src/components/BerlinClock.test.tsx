import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BerlinClock } from './BerlinClock';
import type { BerlinClockTime } from '../types';

describe('BerlinClock', () => {
  const mockTime: BerlinClockTime = {
    secondsLamp: 'Y',
    fiveHoursRow: 'RROO',
    singleHoursRow: 'RRRO',
    fiveMinutesRow: 'YYRYYROOOOO',
    singleMinutesRow: 'YYOO',
    currentTime: '13:32:01',
  };

  it('renders the Berlin Clock with all lamp rows', () => {
    render(<BerlinClock time={mockTime} />);

    const clock = document.querySelector('.berlin-clock');
    expect(clock).toBeInTheDocument();

    // Check that all rows are present
    expect(document.querySelector('.seconds-row')).toBeInTheDocument();
    expect(document.querySelector('.five-hours')).toBeInTheDocument();
    expect(document.querySelector('.single-hours')).toBeInTheDocument();
    expect(document.querySelector('.five-minutes')).toBeInTheDocument();
    expect(document.querySelector('.single-minutes')).toBeInTheDocument();
  });

  it('displays the digital time when provided', () => {
    render(<BerlinClock time={mockTime} />);

    expect(screen.getByText('13:32:01')).toBeInTheDocument();
  });

  it('does not display digital time when not provided', () => {
    const timeWithoutDigital = { ...mockTime, currentTime: '' };
    render(<BerlinClock time={timeWithoutDigital} />);

    expect(screen.queryByText('13:32:01')).not.toBeInTheDocument();
  });

  it('renders seconds lamp correctly when ON', () => {
    render(<BerlinClock time={mockTime} />);

    const secondsLamp = document.querySelector('.seconds-row .lamp');
    expect(secondsLamp).toHaveClass('yellow', 'on', 'circle');
  });

  it('renders seconds lamp correctly when OFF', () => {
    const timeWithSecondsOff = { ...mockTime, secondsLamp: 'O' };
    render(<BerlinClock time={timeWithSecondsOff} />);

    const secondsLamp = document.querySelector('.seconds-row .lamp');
    expect(secondsLamp).toHaveClass('yellow', 'off', 'circle');
  });

  it('renders correct number of lamps in each row', () => {
    render(<BerlinClock time={mockTime} />);

    expect(document.querySelectorAll('.five-hours .lamp')).toHaveLength(4);
    expect(document.querySelectorAll('.single-hours .lamp')).toHaveLength(4);
    expect(document.querySelectorAll('.five-minutes .lamp')).toHaveLength(11);
    expect(document.querySelectorAll('.single-minutes .lamp')).toHaveLength(4);
  });

  it('renders five hours row with correct lamp states', () => {
    render(<BerlinClock time={mockTime} />);

    const lamps = document.querySelectorAll('.five-hours .lamp');
    expect(lamps[0]).toHaveClass('red', 'on');
    expect(lamps[1]).toHaveClass('red', 'on');
    expect(lamps[2]).toHaveClass('red', 'off');
    expect(lamps[3]).toHaveClass('red', 'off');
  });

  it('renders single hours row with correct lamp states', () => {
    render(<BerlinClock time={mockTime} />);

    const lamps = document.querySelectorAll('.single-hours .lamp');
    expect(lamps[0]).toHaveClass('red', 'on');
    expect(lamps[1]).toHaveClass('red', 'on');
    expect(lamps[2]).toHaveClass('red', 'on');
    expect(lamps[3]).toHaveClass('red', 'off');
  });

  it('renders five minutes row with quarter markers as red', () => {
    render(<BerlinClock time={mockTime} />);

    const lamps = document.querySelectorAll('.five-minutes .lamp');
    // Positions 2, 5, 8 (indices in 0-based) should have quarter markers
    expect(lamps[2]).toHaveClass('red');
    expect(lamps[5]).toHaveClass('red');
    expect(lamps[8]).toHaveClass('red');

    // Other lamps should be yellow
    expect(lamps[0]).toHaveClass('yellow');
    expect(lamps[1]).toHaveClass('yellow');
  });

  it('renders five minutes row with correct lamp states', () => {
    render(<BerlinClock time={mockTime} />);

    const lamps = document.querySelectorAll('.five-minutes .lamp');
    // Based on 'YYRYYROOOOO' - first 6 lamps should be on
    expect(lamps[0]).toHaveClass('on');
    expect(lamps[1]).toHaveClass('on');
    expect(lamps[2]).toHaveClass('on'); // Quarter marker, red
    expect(lamps[3]).toHaveClass('on');
    expect(lamps[4]).toHaveClass('on');
    expect(lamps[5]).toHaveClass('on'); // Quarter marker, red
    expect(lamps[6]).toHaveClass('off');
  });

  it('renders single minutes row with correct lamp states', () => {
    render(<BerlinClock time={mockTime} />);

    const lamps = document.querySelectorAll('.single-minutes .lamp');
    expect(lamps[0]).toHaveClass('yellow', 'on');
    expect(lamps[1]).toHaveClass('yellow', 'on');
    expect(lamps[2]).toHaveClass('yellow', 'off');
    expect(lamps[3]).toHaveClass('yellow', 'off');
  });

  it('does not make lamps interactive by default', () => {
    render(<BerlinClock time={mockTime} />);

    const lamps = document.querySelectorAll('.lamp');
    lamps.forEach(lamp => {
      expect(lamp).not.toHaveClass('interactive');
    });
  });

  it('makes lamps interactive when interactive prop is true', () => {
    const mockOnLampClick = vi.fn();
    render(<BerlinClock time={mockTime} interactive onLampClick={mockOnLampClick} />);

    const lamps = document.querySelectorAll('.lamp');
    lamps.forEach(lamp => {
      expect(lamp).toHaveClass('interactive');
    });
  });

  it('calls onLampClick when clicking a lamp in interactive mode', async () => {
    const user = userEvent.setup();
    const mockOnLampClick = vi.fn();
    render(<BerlinClock time={mockTime} interactive onLampClick={mockOnLampClick} />);

    const firstFiveHourLamp = document.querySelectorAll('.five-hours .lamp')[0];
    await user.click(firstFiveHourLamp);

    expect(mockOnLampClick).toHaveBeenCalledWith('fiveHours', 0);
  });

  it('does not call onLampClick when clicking a lamp in non-interactive mode', async () => {
    const user = userEvent.setup();
    const mockOnLampClick = vi.fn();
    render(<BerlinClock time={mockTime} onLampClick={mockOnLampClick} />);

    const firstFiveHourLamp = document.querySelectorAll('.five-hours .lamp')[0];
    await user.click(firstFiveHourLamp);

    expect(mockOnLampClick).not.toHaveBeenCalled();
  });

  it('calls onLampClick with correct parameters for different rows', async () => {
    const user = userEvent.setup();
    const mockOnLampClick = vi.fn();
    render(<BerlinClock time={mockTime} interactive onLampClick={mockOnLampClick} />);

    // Click seconds lamp
    await user.click(document.querySelector('.seconds-row .lamp')!);
    expect(mockOnLampClick).toHaveBeenCalledWith('seconds', 0);

    mockOnLampClick.mockClear();

    // Click single hours lamp
    await user.click(document.querySelectorAll('.single-hours .lamp')[1]);
    expect(mockOnLampClick).toHaveBeenCalledWith('singleHours', 1);

    mockOnLampClick.mockClear();

    // Click five minutes lamp
    await user.click(document.querySelectorAll('.five-minutes .lamp')[3]);
    expect(mockOnLampClick).toHaveBeenCalledWith('fiveMinutes', 3);

    mockOnLampClick.mockClear();

    // Click single minutes lamp
    await user.click(document.querySelectorAll('.single-minutes .lamp')[2]);
    expect(mockOnLampClick).toHaveBeenCalledWith('singleMinutes', 2);
  });
});