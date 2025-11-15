import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConvertMode } from './ConvertMode';
import { api } from '../services/api';
import type { BerlinClockTime } from '../types';

vi.mock('../services/api');

describe('ConvertMode', () => {
  const mockConvertedTime: BerlinClockTime = {
    secondsLamp: 'Y',
    fiveHoursRow: 'RROO',
    singleHoursRow: 'RROO',
    fiveMinutesRow: 'YYRYYROOOOO',
    singleMinutesRow: 'OOOO',
    currentTime: '12:30:45',
  };

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    vi.mocked(api.convertTime).mockResolvedValue(mockConvertedTime);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('renders the convert mode with title and description', () => {
    render(<ConvertMode />);

    expect(screen.getByText('Convert Time to Berlin Clock')).toBeInTheDocument();
    expect(screen.getByText(/Select a time to see it displayed as a Berlin Clock/i)).toBeInTheDocument();
  });

  it('renders three time selectors (hours, minutes, seconds)', () => {
    render(<ConvertMode />);

    expect(screen.getByText('Hours')).toBeInTheDocument();
    expect(screen.getByText('Minutes')).toBeInTheDocument();
    expect(screen.getByText('Seconds')).toBeInTheDocument();

    const selects = document.querySelectorAll('select');
    expect(selects).toHaveLength(3);
  });

  it('initializes with default values from localStorage or defaults', () => {
    render(<ConvertMode />);

    const selects = document.querySelectorAll('select');
    const hoursSelect = selects[0] as HTMLSelectElement;
    const minutesSelect = selects[1] as HTMLSelectElement;
    const secondsSelect = selects[2] as HTMLSelectElement;

    expect(hoursSelect.value).toBe('12');
    expect(minutesSelect.value).toBe('30');
    expect(secondsSelect.value).toBe('45');
  });

  it('loads saved values from localStorage on mount', () => {
    localStorage.setItem('berlinClockConvertHours', '8');
    localStorage.setItem('berlinClockConvertMinutes', '15');
    localStorage.setItem('berlinClockConvertSeconds', '30');

    render(<ConvertMode />);

    const selects = document.querySelectorAll('select');
    const hoursSelect = selects[0] as HTMLSelectElement;
    const minutesSelect = selects[1] as HTMLSelectElement;
    const secondsSelect = selects[2] as HTMLSelectElement;

    expect(hoursSelect.value).toBe('8');
    expect(minutesSelect.value).toBe('15');
    expect(secondsSelect.value).toBe('30');
  });

  it('auto-converts time on component mount', async () => {
    render(<ConvertMode />);

    await waitFor(() => {
      expect(api.convertTime).toHaveBeenCalledWith('12:30:45');
    });
  });

  it('updates hours and triggers auto-conversion', async () => {
    const user = userEvent.setup();
    render(<ConvertMode />);

    // Wait for initial conversion
    await waitFor(() => {
      expect(api.convertTime).toHaveBeenCalledWith('12:30:45');
    });

    vi.clearAllMocks();

    const hoursSelect = document.querySelectorAll('select')[0];
    await user.selectOptions(hoursSelect, '15');

    await waitFor(() => {
      expect(api.convertTime).toHaveBeenCalledWith('15:30:45');
    });
  });

  it('updates minutes and triggers auto-conversion', async () => {
    const user = userEvent.setup();
    render(<ConvertMode />);

    await waitFor(() => {
      expect(api.convertTime).toHaveBeenCalledWith('12:30:45');
    });

    vi.clearAllMocks();

    const minutesSelect = document.querySelectorAll('select')[1];
    await user.selectOptions(minutesSelect, '45');

    await waitFor(() => {
      expect(api.convertTime).toHaveBeenCalledWith('12:45:45');
    });
  });

  it('updates seconds and triggers auto-conversion', async () => {
    const user = userEvent.setup();
    render(<ConvertMode />);

    await waitFor(() => {
      expect(api.convertTime).toHaveBeenCalledWith('12:30:45');
    });

    vi.clearAllMocks();

    const secondsSelect = document.querySelectorAll('select')[2];
    await user.selectOptions(secondsSelect, '0');

    await waitFor(() => {
      expect(api.convertTime).toHaveBeenCalledWith('12:30:00');
    });
  });

  it('saves hours to localStorage when changed', async () => {
    const user = userEvent.setup();
    render(<ConvertMode />);

    const hoursSelect = document.querySelectorAll('select')[0];
    await user.selectOptions(hoursSelect, '20');

    await waitFor(() => {
      expect(localStorage.getItem('berlinClockConvertHours')).toBe('20');
    });
  });

  it('saves minutes to localStorage when changed', async () => {
    const user = userEvent.setup();
    render(<ConvertMode />);

    const minutesSelect = document.querySelectorAll('select')[1];
    await user.selectOptions(minutesSelect, '50');

    await waitFor(() => {
      expect(localStorage.getItem('berlinClockConvertMinutes')).toBe('50');
    });
  });

  it('saves seconds to localStorage when changed', async () => {
    const user = userEvent.setup();
    render(<ConvertMode />);

    const secondsSelect = document.querySelectorAll('select')[2];
    await user.selectOptions(secondsSelect, '10');

    await waitFor(() => {
      expect(localStorage.getItem('berlinClockConvertSeconds')).toBe('10');
    });
  });

  it('displays the Berlin Clock when conversion is successful', async () => {
    render(<ConvertMode />);

    await waitFor(() => {
      expect(document.querySelector('.berlin-clock')).toBeInTheDocument();
    });
  });

  it('displays error message when conversion fails', async () => {
    vi.mocked(api.convertTime).mockRejectedValueOnce(new Error('API Error'));

    render(<ConvertMode />);

    await waitFor(() => {
      expect(screen.getByText('Failed to convert time')).toBeInTheDocument();
    });
  });

  it('hours selector has all 24 hour options', () => {
    render(<ConvertMode />);

    const hoursSelect = document.querySelectorAll('select')[0] as HTMLSelectElement;
    const options = Array.from(hoursSelect.options);

    expect(options).toHaveLength(24);
    expect(options[0].value).toBe('0');
    expect(options[23].value).toBe('23');
  });

  it('minutes selector has all 60 minute options', () => {
    render(<ConvertMode />);

    const minutesSelect = document.querySelectorAll('select')[1] as HTMLSelectElement;
    const options = Array.from(minutesSelect.options);

    expect(options).toHaveLength(60);
    expect(options[0].value).toBe('0');
    expect(options[59].value).toBe('59');
  });

  it('seconds selector has all 60 second options', () => {
    render(<ConvertMode />);

    const secondsSelect = document.querySelectorAll('select')[2] as HTMLSelectElement;
    const options = Array.from(secondsSelect.options);

    expect(options).toHaveLength(60);
    expect(options[0].value).toBe('0');
    expect(options[59].value).toBe('59');
  });

  it('formats time with leading zeros when calling API', async () => {
    const user = userEvent.setup();
    render(<ConvertMode />);

    await waitFor(() => {
      expect(api.convertTime).toHaveBeenCalled();
    });

    vi.clearAllMocks();

    const selects = document.querySelectorAll('select');
    // Select single digit values
    await user.selectOptions(selects[0], '5');
    await user.selectOptions(selects[1], '3');
    await user.selectOptions(selects[2], '1');

    await waitFor(() => {
      expect(api.convertTime).toHaveBeenCalledWith('05:03:01');
    });
  });

  it('clears error when conversion succeeds after a failure', async () => {
    const user = userEvent.setup();
    vi.mocked(api.convertTime).mockRejectedValueOnce(new Error('API Error'));

    render(<ConvertMode />);

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText('Failed to convert time')).toBeInTheDocument();
    });

    // Mock successful response
    vi.mocked(api.convertTime).mockResolvedValueOnce(mockConvertedTime);

    // Change time to trigger new conversion
    const hoursSelect = document.querySelectorAll('select')[0];
    await user.selectOptions(hoursSelect, '10');

    // Error should disappear
    await waitFor(() => {
      expect(screen.queryByText('Failed to convert time')).not.toBeInTheDocument();
    });
  });
});