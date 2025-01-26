import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the App with all sections', () => {
  render(<App />);
  
  // Header
  expect(
    screen.getByText(/Finna : Votre Extension Révolutionnaire/i)
  ).toBeInTheDocument();
  
  // Section Features
  expect(screen.getByText(/Pourquoi choisir Finna ?/i)).toBeInTheDocument();
  expect(screen.getByText(/Fiabilité instantanée/i)).toBeInTheDocument();
  expect(screen.getByText(/Simplicité d’utilisation/i)).toBeInTheDocument();
  expect(screen.getByText(/Compatible tous navigateurs/i)).toBeInTheDocument();
  
  // Download
  expect(screen.getByText(/Prêt à essayer Finna ?/i)).toBeInTheDocument();
  
  // Footer
  expect(screen.getByText(/© 2024 Finna. Tous droits réservés./i)).toBeInTheDocument();
});
