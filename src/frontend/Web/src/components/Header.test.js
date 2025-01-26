import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from './Header';

test('renders header with title, description, and CTA button', () => {
  render(<Header />);
  expect(screen.getByText(/Finna : Votre Extension Révolutionnaire/i)).toBeInTheDocument();
  expect(
    screen.getByText(/Vérifiez rapidement la fiabilité des informations grâce à notre outil/i)
  ).toBeInTheDocument();
  const button = screen.getByRole('link', { name: /Télécharger Finna/i });
  expect(button).toHaveAttribute('href', '#download');
});
