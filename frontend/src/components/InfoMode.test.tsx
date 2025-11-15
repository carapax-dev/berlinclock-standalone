import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InfoMode } from './InfoMode';

describe('InfoMode', () => {
  it('renders the info mode with title and description', () => {
    render(<InfoMode />);

    expect(screen.getByText('How the Berlin Clock Works')).toBeInTheDocument();
    expect(screen.getByText(/The Berlin Clock \(Mengenlehreuhr\) displays time using colored lamps/i)).toBeInTheDocument();
  });

  it('renders all section titles', () => {
    render(<InfoMode />);

    expect(screen.getByText('Seconds Lamp')).toBeInTheDocument();
    expect(screen.getByText('Five Hours Row')).toBeInTheDocument();
    expect(screen.getByText('Single Hours Row')).toBeInTheDocument();
    expect(screen.getByText('Five Minutes Row')).toBeInTheDocument();
    expect(screen.getByText('Single Minutes Row')).toBeInTheDocument();
  });

  it('renders complete example section', () => {
    render(<InfoMode />);

    expect(screen.getByText('Complete Example: 13:32')).toBeInTheDocument();
  });

  it('displays seconds lamp explanation', () => {
    render(<InfoMode />);

    expect(screen.getByText(/The top circular lamp blinks every second/i)).toBeInTheDocument();
    expect(screen.getByText(/ON \(Yellow\):/i)).toBeInTheDocument();
    expect(screen.getByText(/Odd seconds/i)).toBeInTheDocument();
  });

  it('displays five hours row explanation with multiplier', () => {
    render(<InfoMode />);

    expect(screen.getByText(/Each red lamp represents/i)).toBeInTheDocument();
    expect(screen.getByText('× 5 hours')).toBeInTheDocument();
    expect(screen.getByText(/1 lamp ON = 5 hours/i)).toBeInTheDocument();
  });

  it('displays single hours row explanation with multiplier', () => {
    render(<InfoMode />);

    expect(screen.getByText('× 1 hour')).toBeInTheDocument();
    expect(screen.getByText(/Each lamp adds 1 hour to the total/i)).toBeInTheDocument();
  });

  it('displays five minutes row explanation with quarter marker info', () => {
    render(<InfoMode />);

    expect(screen.getByText('× 5 minutes')).toBeInTheDocument();
    expect(screen.getByText(/Yellow lamps = 5 minutes each/i)).toBeInTheDocument();
    expect(screen.getByText(/Red lamps.*Quarter hours/i)).toBeInTheDocument();
  });

  it('displays single minutes row explanation with multiplier', () => {
    render(<InfoMode />);

    expect(screen.getByText('× 1 minute')).toBeInTheDocument();
    expect(screen.getByText(/Maximum: 4 minutes/i)).toBeInTheDocument();
  });

  it('renders example boxes with icons', () => {
    render(<InfoMode />);

    const exampleBoxes = screen.getAllByText(/Example/i);
    expect(exampleBoxes).toHaveLength(5);
  });

  it('shows tooltip when example box is clicked', async () => {
    const user = userEvent.setup();
    render(<InfoMode />);

    const exampleBoxes = document.querySelectorAll('.example-box');
    const fiveHoursExample = exampleBoxes[0];

    // Tooltip should not be visible initially
    expect(within(fiveHoursExample as HTMLElement).queryByText(/2 × 5 = 10 hours/i)).not.toBeInTheDocument();

    // Click to show tooltip
    await user.click(fiveHoursExample);

    // Tooltip should now be visible
    expect(within(fiveHoursExample as HTMLElement).getByText(/2 × 5 = 10 hours/i)).toBeInTheDocument();
  });

  it('hides tooltip when example box is clicked again', async () => {
    const user = userEvent.setup();
    render(<InfoMode />);

    const exampleBoxes = document.querySelectorAll('.example-box');
    const fiveHoursExample = exampleBoxes[0];

    // Click to show tooltip
    await user.click(fiveHoursExample);
    expect(within(fiveHoursExample as HTMLElement).getByText(/2 × 5 = 10 hours/i)).toBeInTheDocument();

    // Click again to hide tooltip
    await user.click(fiveHoursExample);
    expect(within(fiveHoursExample as HTMLElement).queryByText(/2 × 5 = 10 hours/i)).not.toBeInTheDocument();
  });

  it('shows only one tooltip at a time', async () => {
    const user = userEvent.setup();
    render(<InfoMode />);

    const exampleBoxes = document.querySelectorAll('.example-box');
    const fiveHoursExample = exampleBoxes[0];
    const singleHoursExample = exampleBoxes[1];

    // Click first example box
    await user.click(fiveHoursExample);
    expect(within(fiveHoursExample as HTMLElement).getByText(/2 × 5 = 10 hours/i)).toBeInTheDocument();

    // Click second example box
    await user.click(singleHoursExample);
    expect(within(singleHoursExample as HTMLElement).getByText(/3 × 1 = 3 hours/i)).toBeInTheDocument();

    // First tooltip should be hidden
    expect(within(fiveHoursExample as HTMLElement).queryByText(/2 × 5 = 10 hours/i)).not.toBeInTheDocument();
  });

  it('displays correct tooltip content for five hours example', async () => {
    const user = userEvent.setup();
    render(<InfoMode />);

    const exampleBoxes = document.querySelectorAll('.example-box');
    await user.click(exampleBoxes[0]);

    expect(screen.getByText(/2 × 5 = 10 hours/i)).toBeInTheDocument();
  });

  it('displays correct tooltip content for single hours example', async () => {
    const user = userEvent.setup();
    render(<InfoMode />);

    const exampleBoxes = document.querySelectorAll('.example-box');
    await user.click(exampleBoxes[1]);

    expect(screen.getByText(/3 × 1 = 3 hours/i)).toBeInTheDocument();
  });

  it('displays correct tooltip content for five minutes example', async () => {
    const user = userEvent.setup();
    render(<InfoMode />);

    const exampleBoxes = document.querySelectorAll('.example-box');
    await user.click(exampleBoxes[2]);

    expect(screen.getByText(/6 × 5 = 30 minutes/i)).toBeInTheDocument();
  });

  it('displays correct tooltip content for single minutes example', async () => {
    const user = userEvent.setup();
    render(<InfoMode />);

    const exampleBoxes = document.querySelectorAll('.example-box');
    await user.click(exampleBoxes[3]);

    expect(screen.getByText(/2 × 1 = 2 minutes/i)).toBeInTheDocument();
  });

  it('renders visual lamp examples for each row', () => {
    render(<InfoMode />);

    // Check that info lamps are rendered
    const infoLamps = document.querySelectorAll('.info-lamp');
    expect(infoLamps.length).toBeGreaterThan(0);
  });

  it('renders correct lamp colors in visual examples', () => {
    render(<InfoMode />);

    // Check seconds lamp is yellow
    const secondsLamp = document.querySelector('.info-section .info-lamp.circle.yellow');
    expect(secondsLamp).toBeInTheDocument();

    // Check five hours lamps are red
    const redLamps = document.querySelectorAll('.info-lamp.red');
    expect(redLamps.length).toBeGreaterThan(0);

    // Check yellow lamps exist
    const yellowLamps = document.querySelectorAll('.info-lamp.yellow');
    expect(yellowLamps.length).toBeGreaterThan(0);
  });

  it('displays complete calculation example with steps', () => {
    render(<InfoMode />);

    expect(screen.getByText(/Five Hours:/i)).toBeInTheDocument();
    expect(screen.getByText(/2 lamps × 5 = 10 hours/i)).toBeInTheDocument();
    expect(screen.getByText(/Single Hours:/i)).toBeInTheDocument();
    expect(screen.getByText(/3 lamps × 1 = 3 hours/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Hours: 13/i)).toBeInTheDocument();

    expect(screen.getByText(/Five Minutes:/i)).toBeInTheDocument();
    expect(screen.getByText(/6 lamps × 5 = 30 minutes/i)).toBeInTheDocument();
    expect(screen.getByText(/Single Minutes:/i)).toBeInTheDocument();
    expect(screen.getByText(/2 lamps × 1 = 2 minutes/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Minutes: 32/i)).toBeInTheDocument();
  });

  it('renders all five example boxes', () => {
    render(<InfoMode />);

    const exampleBoxes = document.querySelectorAll('.example-box');
    expect(exampleBoxes).toHaveLength(5);
  });

  it('all example boxes have the light bulb icon', () => {
    render(<InfoMode />);

    const icons = document.querySelectorAll('.example-icon');
    expect(icons).toHaveLength(5);
    icons.forEach(icon => {
      expect(icon.textContent).toBe('💡');
    });
  });

  it('renders lamp multiplier labels', () => {
    render(<InfoMode />);

    expect(screen.getByText('Seconds')).toBeInTheDocument();
    expect(screen.getByText('× 5 hours')).toBeInTheDocument();
    expect(screen.getByText('× 1 hour')).toBeInTheDocument();
    expect(screen.getByText('× 5 minutes')).toBeInTheDocument();
    expect(screen.getByText('× 1 minute')).toBeInTheDocument();
  });
});