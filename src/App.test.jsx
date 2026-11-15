import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import App from './App';
import { stats } from './data/providers';

describe('App accessibility & interaction', () => {
  it('gives the search input an accessible name', () => {
    render(<App />);
    expect(screen.getByRole('textbox', { name: /search ai providers/i })).toBeInTheDocument();
  });

  it('reports the true provider count derived from the dataset', () => {
    render(<App />);
    const status = screen.getByRole('status');
    expect(status.textContent.replace(/\s+/g, ' ')).toContain(`Showing ${stats.totalProviders} providers`);
    expect(document.title).toContain(String(stats.totalProviders));
  });

  it('filters providers by search term', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByRole('textbox', { name: /search ai providers/i }), 'anthropic');
    expect(await screen.findByText(/matching/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Anthropic' })).toBeInTheDocument();
  });

  it('marks the active category filter with aria-pressed', async () => {
    const user = userEvent.setup();
    render(<App />);
    const frontier = screen.getByRole('button', { name: /Frontier Labs/i });
    expect(frontier).toHaveAttribute('aria-pressed', 'false');
    await user.click(frontier);
    expect(frontier).toHaveAttribute('aria-pressed', 'true');
  });

  it('has no detectable axe violations on initial render', async () => {
    const { container } = render(<App />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
