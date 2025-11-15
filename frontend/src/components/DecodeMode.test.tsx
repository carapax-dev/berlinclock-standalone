import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DecodeMode } from './DecodeMode';
import { api } from '../services/api';

vi.mock('../services/api');

describe('DecodeMode', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    vi.mocked(api.decodeTime).mockResolvedValue({ time: '00:00:00' });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('renders the decode mode with title and description', () => {
    render(<DecodeMode />);

    expect(screen.getByText('Decode Berlin Clock')).toBeInTheDocument();
    expect(screen.getByText(/Click on the lamps to turn them on\/off/i)).toBeInTheDocument();
  });

  it('renders an interactive Berlin Clock', () => {
    render(<DecodeMode />);

    expect(document.querySelector('.berlin-clock')).toBeInTheDocument();
    const lamps = document.querySelectorAll('.lamp.interactive');
    expect(lamps.length).toBeGreaterThan(0);
  });

  it('renders a reset button', () => {
    render(<DecodeMode />);

    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
  });

  it('initializes with all lamps off', () => {
    render(<DecodeMode />);

    const lamps = document.querySelectorAll('.lamp.on');
    expect(lamps).toHaveLength(0);
  });

  it('loads saved state from localStorage on mount', () => {
    const savedState = {
      secondsLamp: 'Y',
      fiveHoursRow: 'RROO',
      singleHoursRow: 'OOOO',
      fiveMinutesRow: 'OOOOOOOOOOO',
      singleMinutesRow: 'OOOO',
      currentTime: '',
    };
    localStorage.setItem('berlinClockDecodeState', JSON.stringify(savedState));

    render(<DecodeMode />);

    // Check seconds lamp is on
    const secondsLamp = document.querySelector('.seconds-row .lamp');
    expect(secondsLamp).toHaveClass('on');

    // Check five hours row
    const fiveHoursLamps = document.querySelectorAll('.five-hours .lamp');
    expect(fiveHoursLamps[0]).toHaveClass('on');
    expect(fiveHoursLamps[1]).toHaveClass('on');
  });

  it('toggles seconds lamp on click', async () => {
    const user = userEvent.setup();
    render(<DecodeMode />);

    const secondsLamp = document.querySelector('.seconds-row .lamp')!;

    // Initially off
    expect(secondsLamp).toHaveClass('off');

    // Click to turn on
    await user.click(secondsLamp);
    await waitFor(() => {
      expect(secondsLamp).toHaveClass('on');
    });

    // Click to turn off
    await user.click(secondsLamp);
    await waitFor(() => {
      expect(secondsLamp).toHaveClass('off');
    });
  });

  it('allows sequential lamp selection in five hours row', async () => {
    const user = userEvent.setup();
    render(<DecodeMode />);

    const lamps = document.querySelectorAll('.five-hours .lamp');

    // Click first lamp - should turn on
    await user.click(lamps[0]);
    await waitFor(() => {
      expect(lamps[0]).toHaveClass('on');
    });

    // Click second lamp - should turn on
    await user.click(lamps[1]);
    await waitFor(() => {
      expect(lamps[1]).toHaveClass('on');
    });

    // Click third lamp - should turn on
    await user.click(lamps[2]);
    await waitFor(() => {
      expect(lamps[2]).toHaveClass('on');
    });
  });

  it('prevents skipping lamps in sequential selection', async () => {
    const user = userEvent.setup();
    render(<DecodeMode />);

    const lamps = document.querySelectorAll('.five-hours .lamp');

    // Try to click third lamp without clicking first and second
    await user.click(lamps[2]);

    // Lamp should still be off
    expect(lamps[2]).toHaveClass('off');
  });

  it('turns off subsequent lamps when a lamp is turned off', async () => {
    const user = userEvent.setup();
    render(<DecodeMode />);

    const lamps = document.querySelectorAll('.five-hours .lamp');

    // Turn on first three lamps
    await user.click(lamps[0]);
    await user.click(lamps[1]);
    await user.click(lamps[2]);

    await waitFor(() => {
      expect(lamps[0]).toHaveClass('on');
      expect(lamps[1]).toHaveClass('on');
      expect(lamps[2]).toHaveClass('on');
    });

    // Click second lamp to turn it off
    await user.click(lamps[1]);

    // Second and third lamps should now be off
    await waitFor(() => {
      expect(lamps[1]).toHaveClass('off');
      expect(lamps[2]).toHaveClass('off');
    });

    // First lamp should still be on
    expect(lamps[0]).toHaveClass('on');
  });

  it('auto-decodes when lamp state changes', async () => {
    const user = userEvent.setup();
    vi.mocked(api.decodeTime).mockResolvedValue({ time: '05:00:00' });

    render(<DecodeMode />);

    const lamp = document.querySelectorAll('.five-hours .lamp')[0];
    await user.click(lamp);

    await waitFor(() => {
      expect(api.decodeTime).toHaveBeenCalled();
    });
  });

  it('displays decoded time when available', async () => {
    const user = userEvent.setup();
    vi.mocked(api.decodeTime).mockResolvedValue({ time: '13:32:45' });

    render(<DecodeMode />);

    const lamp = document.querySelectorAll('.five-hours .lamp')[0];
    await user.click(lamp);

    await waitFor(() => {
      expect(screen.getByText('13:32:45')).toBeInTheDocument();
    });
  });

  it('displays error message when decode fails', async () => {
    const user = userEvent.setup();
    vi.mocked(api.decodeTime).mockRejectedValueOnce(new Error('API Error'));

    render(<DecodeMode />);

    const lamp = document.querySelectorAll('.five-hours .lamp')[0];
    await user.click(lamp);

    await waitFor(() => {
      expect(screen.getByText('Failed to decode the Berlin Clock configuration')).toBeInTheDocument();
    });
  });

  it('resets all lamps when reset button is clicked', async () => {
    const user = userEvent.setup();
    render(<DecodeMode />);

    // Turn on some lamps
    const fiveHoursLamps = document.querySelectorAll('.five-hours .lamp');
    await user.click(fiveHoursLamps[0]);
    await user.click(fiveHoursLamps[1]);

    await waitFor(() => {
      expect(fiveHoursLamps[0]).toHaveClass('on');
      expect(fiveHoursLamps[1]).toHaveClass('on');
    });

    // Click reset
    await user.click(screen.getByRole('button', { name: /reset/i }));

    // All lamps should be off
    await waitFor(() => {
      expect(fiveHoursLamps[0]).toHaveClass('off');
      expect(fiveHoursLamps[1]).toHaveClass('off');
    });
  });

  it('clears decoded time when reset button is clicked', async () => {
    const user = userEvent.setup();
    vi.mocked(api.decodeTime).mockResolvedValue({ time: '10:00:00' });

    render(<DecodeMode />);

    // Turn on a lamp to trigger decode
    const lamp = document.querySelectorAll('.five-hours .lamp')[0];
    await user.click(lamp);

    await waitFor(() => {
      expect(screen.getByText('10:00:00')).toBeInTheDocument();
    });

    // Click reset
    await user.click(screen.getByRole('button', { name: /reset/i }));

    // Decoded time should be cleared
    await waitFor(() => {
      expect(screen.queryByText('10:00:00')).not.toBeInTheDocument();
    });
  });

  it('saves clock state to localStorage when changed', async () => {
    const user = userEvent.setup();
    render(<DecodeMode />);

    const lamp = document.querySelectorAll('.five-hours .lamp')[0];
    await user.click(lamp);

    await waitFor(() => {
      const saved = localStorage.getItem('berlinClockDecodeState');
      expect(saved).toBeTruthy();
      const parsed = JSON.parse(saved!);
      expect(parsed.fiveHoursRow).toContain('R');
    });
  });

  it('handles five minutes row with quarter markers correctly', async () => {
    const user = userEvent.setup();
    render(<DecodeMode />);

    const lamps = document.querySelectorAll('.five-minutes .lamp');

    // Turn on first lamp (should be yellow)
    await user.click(lamps[0]);
    await waitFor(() => {
      expect(lamps[0]).toHaveClass('on');
    });

    // Turn on second lamp (should be yellow)
    await user.click(lamps[1]);
    await waitFor(() => {
      expect(lamps[1]).toHaveClass('on');
    });

    // Turn on third lamp (should be red, quarter marker)
    await user.click(lamps[2]);
    await waitFor(() => {
      expect(lamps[2]).toHaveClass('on');
      expect(lamps[2]).toHaveClass('red');
    });
  });

  it('applies sequential logic to all rows', async () => {
    const user = userEvent.setup();
    render(<DecodeMode />);

    // Test single hours row
    const singleHoursLamps = document.querySelectorAll('.single-hours .lamp');
    await user.click(singleHoursLamps[2]); // Try to skip
    expect(singleHoursLamps[2]).toHaveClass('off'); // Should not turn on

    // Test five minutes row
    const fiveMinutesLamps = document.querySelectorAll('.five-minutes .lamp');
    await user.click(fiveMinutesLamps[5]); // Try to skip
    expect(fiveMinutesLamps[5]).toHaveClass('off'); // Should not turn on

    // Test single minutes row
    const singleMinutesLamps = document.querySelectorAll('.single-minutes .lamp');
    await user.click(singleMinutesLamps[3]); // Try to skip
    expect(singleMinutesLamps[3]).toHaveClass('off'); // Should not turn on
  });

  it('sends correct clock state to decode API', async () => {
    const user = userEvent.setup();
    render(<DecodeMode />);

    const fiveHoursLamps = document.querySelectorAll('.five-hours .lamp');
    await user.click(fiveHoursLamps[0]);
    await user.click(fiveHoursLamps[1]);

    await waitFor(() => {
      expect(api.decodeTime).toHaveBeenCalledWith(
        expect.objectContaining({
          fiveHoursRow: 'RROO',
        })
      );
    });
  });
});