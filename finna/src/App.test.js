import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Test de base pour s'assurer que le composant App se rend sans erreur
test('renders App component without crashing', () => {
  render(<App />);
});

// Test de l'affichage du logo
test('renders logo image', () => {
  render(<App />);
  const logo = screen.getByAltText(/logo/i);
  expect(logo).toBeInTheDocument();
});

// Test du titre principal
test('renders main title "Finna : Votre Extension Révolutionnaire"', () => {
  render(<App />);
  const mainTitle = screen.getByText(/Finna : Votre Extension Révolutionnaire/i);
  expect(mainTitle).toBeInTheDocument();
});

// Test de la première section "Qu'est-ce que Finna ?"
test('renders "Qu\'est-ce que Finna ?" section', () => {
  render(<App />);
  const sectionTitle = screen.getByText(/Qu'est-ce que Finnaaaa ?/i);
  const sectionText = screen.getByText(/Finna est une extension web conçue pour vous aider à retrouver les sources des informations que vous lisez en ligne/i);
  expect(sectionTitle).toBeInTheDocument();
  expect(sectionText).toBeInTheDocument();
});

// Test de la deuxième section "Pourquoi utiliser Finna ?"
test('renders "Pourquoi utiliser Finna ?" section', () => {
  render(<App />);
  const sectionTitle = screen.getByText(/Pourquoi utiliser Finna ?/i);
  const sectionText = screen.getByText(/Elle est simple, rapide et vous garantit une transparence totale des sources/i);
  expect(sectionTitle).toBeInTheDocument();
  expect(sectionText).toBeInTheDocument();
});

// Test de la troisième section "Disponible sur les principaux navigateurs"
test('renders "Disponible sur les principaux navigateurs" section', () => {
  render(<App />);
  const sectionTitle = screen.getByText(/Disponible sur les principaux navigateurs/i);
  const sectionText = screen.getByText(/Compatible avec Chrome, Firefox, Edge et, peut-être, Safari/i);
  expect(sectionTitle).toBeInTheDocument();
  expect(sectionText).toBeInTheDocument();
});

// Test de la section de téléchargement
test('renders "Prêt à l\'essayer ?" section and download button', () => {
  render(<App />);
  const sectionTitle = screen.getByText(/Prêt à l'essayer ?/i);
  const downloadButton = screen.getByRole('button', { name: /Télécharger Finna/i });
  expect(sectionTitle).toBeInTheDocument();
  expect(downloadButton).toBeInTheDocument();
});
