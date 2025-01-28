import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

test('renders footer with copyright and social media links', () => {
  render(<Footer />);
  expect(screen.getByText(/© 2024 Finna. Tous droits réservés./i)).toBeInTheDocument();
  const twitterLink = screen.getByRole('link', { name: /Twitter/i });
  const instagramLink = screen.getByRole('link', { name: /Instagram/i });

  expect(twitterLink).toHaveAttribute('href', 'https://twitter.com/Finna');
  expect(instagramLink).toHaveAttribute('href', 'https://instagram.com/Finna');
});
