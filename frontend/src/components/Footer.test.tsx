import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';

describe('Footer', () => {
  it('renders copyright text with current year', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`© ${currentYear} Carapax Software`))).toBeInTheDocument();
  });

  it('renders "All rights reserved" text', () => {
    render(<Footer />);
    expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument();
  });

  it('renders GitHub link with correct URL', () => {
    render(<Footer />);
    const githubLink = screen.getByRole('link', { name: /view on github/i });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', 'https://github.com/carapax-dev/berlinclock');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders GitHub icon', () => {
    render(<Footer />);
    const svg = screen.getByRole('link', { name: /view on github/i }).querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});