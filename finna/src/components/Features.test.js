import React from 'react';
import { render, screen } from '@testing-library/react';
import Features from './Features';

test('renders all feature cards with correct titles and descriptions', () => {
  render(<Features />);
  const features = [
    'Fiabilité instantanée',
    'Simplicité d’utilisation',
    'Compatible tous navigateurs',
  ];

  features.forEach((feature) => {
    expect(screen.getByText(feature)).toBeInTheDocument();
  });

  expect(screen.getByText(/Trouvez les sources des informations en un clic/i)).toBeInTheDocument();
});
