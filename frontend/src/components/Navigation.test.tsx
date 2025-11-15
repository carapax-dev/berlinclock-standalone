import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Navigation } from './Navigation';
import type { AppMode } from '../types';

describe('Navigation', () => {
  const mockOnModeChange = vi.fn();

  afterEach(() => {
    mockOnModeChange.mockClear();
  });

  it('renders all navigation buttons', () => {
    render(<Navigation currentMode="realtime" onModeChange={mockOnModeChange} />);

    expect(screen.getByRole('button', { name: /real-time/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /convert/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /decode/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /info/i })).toBeInTheDocument();
  });

  it('marks realtime button as active when currentMode is realtime', () => {
    render(<Navigation currentMode="realtime" onModeChange={mockOnModeChange} />);

    const realtimeButton = screen.getByRole('button', { name: /real-time/i });
    expect(realtimeButton).toHaveClass('active');
  });

  it('marks convert button as active when currentMode is convert', () => {
    render(<Navigation currentMode="convert" onModeChange={mockOnModeChange} />);

    const convertButton = screen.getByRole('button', { name: /convert/i });
    expect(convertButton).toHaveClass('active');
  });

  it('calls onModeChange with correct mode when clicking a button', async () => {
    const user = userEvent.setup();
    render(<Navigation currentMode="realtime" onModeChange={mockOnModeChange} />);

    await user.click(screen.getByRole('button', { name: /convert/i }));
    expect(mockOnModeChange).toHaveBeenCalledWith('convert');
  });

  it('calls onModeChange with info mode when clicking info button', async () => {
    const user = userEvent.setup();
    render(<Navigation currentMode="realtime" onModeChange={mockOnModeChange} />);

    await user.click(screen.getByRole('button', { name: /info/i }));
    expect(mockOnModeChange).toHaveBeenCalledWith('info');
  });
});