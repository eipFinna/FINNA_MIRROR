import React from 'react';
import { render, screen } from '@testing-library/react';
import DownloadSection from './DownloadSection';

test('renders download section with title, description, and download button', () => {
  render(<DownloadSection />);
  expect(screen.getByText(/Prêt à essayer Finna ?/i)).toBeInTheDocument();
  expect(
    screen.getByText(/Téléchargez notre extension maintenant et rejoignez une communauté engagée/i)
  ).toBeInTheDocument();
  const button = screen.getByRole('link', { name: /Télécharger Finna/i });
  expect(button).toHaveAttribute('href', './extension-finna-test.html');
});
