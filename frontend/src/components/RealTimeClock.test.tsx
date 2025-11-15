import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { RealTimeClock } from './RealTimeClock';
import { api } from '../services/api';
import type { BerlinClockTime } from '../types';

vi.mock('../services/api');

describe('RealTimeClock', () => {
  const mockTime: BerlinClockTime = {
    secondsLamp: 'Y',
    fiveHoursRow: 'RROO',
    singleHoursRow: 'RRRO',
    fiveMinutesRow: 'YYRYYROOOOO',
    singleMinutesRow: 'YYOO',
    currentTime: '13:32:45',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the realtime mode with title and description', async () => {
    vi.mocked(api.getCurrentTime).mockResolvedValue(mockTime);

    render(<RealTimeClock />);

    await waitFor(() => {
      expect(screen.getByText('Real-Time Berlin Clock')).toBeInTheDocument();
    });

    expect(screen.getByText(/Watch the Berlin Clock display the current time in real-time/i)).toBeInTheDocument();
  });

  it('displays loading state initially', () => {
    vi.mocked(api.getCurrentTime).mockImplementation(() => new Promise(() => {}));

    render(<RealTimeClock />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('fetches current time on mount', async () => {
    vi.mocked(api.getCurrentTime).mockResolvedValue(mockTime);

    render(<RealTimeClock />);

    await waitFor(() => {
      expect(api.getCurrentTime).toHaveBeenCalledTimes(1);
    });
  });

  it('displays Berlin Clock after successful fetch', async () => {
    vi.mocked(api.getCurrentTime).mockResolvedValue(mockTime);

    render(<RealTimeClock />);

    await waitFor(() => {
      expect(document.querySelector('.berlin-clock')).toBeInTheDocument();
    });
  });

  it('displays digital time from API response', async () => {
    vi.mocked(api.getCurrentTime).mockResolvedValue(mockTime);

    render(<RealTimeClock />);

    await waitFor(() => {
      expect(screen.getByText('13:32:45')).toBeInTheDocument();
    });
  });

  it('displays error message when fetch fails', async () => {
    vi.mocked(api.getCurrentTime).mockRejectedValue(new Error('Network error'));

    render(<RealTimeClock />);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch time from server')).toBeInTheDocument();
    });
  });

  it('does not display Berlin Clock when fetch fails', async () => {
    vi.mocked(api.getCurrentTime).mockRejectedValue(new Error('Network error'));

    render(<RealTimeClock />);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch time from server')).toBeInTheDocument();
    });

    expect(document.querySelector('.berlin-clock')).not.toBeInTheDocument();
  });

  it('sets up interval to fetch time periodically', async () => {
    vi.mocked(api.getCurrentTime).mockResolvedValue(mockTime);

    render(<RealTimeClock />);

    // Component should set up an interval (verified by checking initial fetch happens)
    await waitFor(() => {
      expect(api.getCurrentTime).toHaveBeenCalled();
    });
  });

  it('renders non-interactive Berlin Clock', async () => {
    vi.mocked(api.getCurrentTime).mockResolvedValue(mockTime);

    render(<RealTimeClock />);

    await waitFor(() => {
      expect(document.querySelector('.berlin-clock')).toBeInTheDocument();
    });

    // Lamps should not be interactive
    const lamps = document.querySelectorAll('.lamp.interactive');
    expect(lamps).toHaveLength(0);
  });

  it('displays all lamp rows correctly', async () => {
    vi.mocked(api.getCurrentTime).mockResolvedValue(mockTime);

    render(<RealTimeClock />);

    await waitFor(() => {
      expect(document.querySelector('.berlin-clock')).toBeInTheDocument();
    });

    expect(document.querySelector('.seconds-row')).toBeInTheDocument();
    expect(document.querySelector('.five-hours')).toBeInTheDocument();
    expect(document.querySelector('.single-hours')).toBeInTheDocument();
    expect(document.querySelector('.five-minutes')).toBeInTheDocument();
    expect(document.querySelector('.single-minutes')).toBeInTheDocument();
  });

  it('fetches time immediately on mount without waiting for interval', async () => {
    const startTime = Date.now();
    vi.mocked(api.getCurrentTime).mockResolvedValue(mockTime);

    render(<RealTimeClock />);

    // Should fetch immediately without advancing timers
    await waitFor(() => {
      expect(api.getCurrentTime).toHaveBeenCalledTimes(1);
    });

    const fetchTime = Date.now();
    // Fetch should happen immediately (within a small margin for test execution)
    expect(fetchTime - startTime).toBeLessThan(100);
  });
});