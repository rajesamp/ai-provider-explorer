import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import ProviderCard from './ProviderCard';

const provider = {
  id: 'test-co',
  name: 'Test Co',
  category: 'frontier',
  tagline: 'A test provider tagline',
  description: 'A longer description used in the expanded panel.',
  features: ['Feature A', 'Feature B', 'Feature C', 'Feature D'],
  models: ['Model X', 'Model Y'],
  pricing: 'Pay-per-token',
  docs: 'https://example.com/docs',
  website: 'https://example.com',
};

const toggleButton = () =>
  screen.getByRole('button', { name: /details for Test Co/i });

describe('ProviderCard accessibility & interaction', () => {
  it('exposes a keyboard-operable toggle with aria-expanded/controls', () => {
    render(<ProviderCard provider={provider} index={0} />);
    const btn = toggleButton();
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    expect(btn).toHaveAttribute('aria-controls');
  });

  it('expands and collapses via the keyboard (Enter then Space)', async () => {
    const user = userEvent.setup();
    render(<ProviderCard provider={provider} index={0} />);
    const btn = toggleButton();

    await user.tab();
    expect(btn).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(btn).toHaveAttribute('aria-expanded', 'true');
    expect(await screen.findByText(provider.description)).toBeInTheDocument();

    await user.keyboard(' ');
    expect(btn).toHaveAttribute('aria-expanded', 'false');
  });

  it('exposes external links with safe rel and does not toggle the card', async () => {
    const user = userEvent.setup();
    render(<ProviderCard provider={provider} index={0} />);
    const btn = toggleButton();
    await user.click(btn);

    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    const docs = within(panel).getByRole('link', { name: /Docs/i });
    expect(docs).toHaveAttribute('href', provider.docs);
    expect(docs).toHaveAttribute('rel', expect.stringContaining('noopener'));
    expect(docs).toHaveAttribute('target', '_blank');

    // clicking a link must not collapse the card
    await user.click(docs);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
  });

  it('has no detectable axe violations when expanded', async () => {
    const { container } = render(<ProviderCard provider={provider} index={0} />);
    await userEvent.setup().click(toggleButton());
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
