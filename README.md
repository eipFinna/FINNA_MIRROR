# Finna

## Description

Finna est une extension web conçue pour aider les utilisateurs à vérifier rapidement et efficacement la fiabilité des informations qu’ils lisent en ligne. Notre outil offre une solution simple : fournir les sources des informations suspectes et, grâce à une intelligence artificielle, générer un résumé concis pour permettre aux utilisateurs de se faire une opinion éclairée.

## Contexte

En France, 39% des citoyens utilisent la presse numérique pour s'informer, mais 30% d’entre eux déclarent avoir des difficultés à détecter les fausses informations. Ce problème croissant de désinformation a inspiré la création de Finna. Notre mission est de simplifier la vérification d'informations pour tous.

## Fonctionnalités

- **Vérification des informations** : L’utilisateur peut soumettre un extrait (article, tweet, etc.), et Finna recherche les sources correspondantes.
- **Résumé automatique** : Une intelligence artificielle (IA LLM) synthétise les articles trouvés pour en produire un résumé.
- **Extension web** : Permet un accès rapide et une intégration fluide dans le navigateur.
- **Site web** : Fournit une landing page pour télécharger l'extension et recueillir des retours d’utilisateurs.
- **Scraping et stockage** : Récupération automatisée d'articles via des scripts Python pour alimenter la base de données.

## Technologies utilisées

- **Frontend** : React
- **Backend** : Node.js
- **Base de données** : MySQL / PostgreSQL
- **Scripts** : Python pour le scraping, Bash pour l’automatisation
- **CI/CD** : Git
- **IA LLM** : Modèle à définir (ex. Meta-Llama, Google Gemini)

## Installation

### Prérequis
- **Node.js** : Version 16+ recommandée
- **MySQL** : Version 8+
- **Python** : Version 3.8+
- **Git**

### Instructions

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/eipFinna/FINNA_MIRROR.git finna
   cd finna
   ```

2. Installez les dépendances pour le backend et le frontend :
   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

3. Configurez la base de données :
   - Créez une base de données MySQL et configurez le fichier `.env` dans `backend` avec vos informations d'identification.

4. Lancez l’application :
   ```bash
   # Dans le répertoire backend
   npm run dev

   # Dans le répertoire frontend
   npm start
   ```

5. (Facultatif) Exécutez le script de scraping :
   ```bash
   python scripts/scraper.py
   ```

## User Story

Un utilisateur peut :
1. Copier un texte suspect et le coller dans la barre de recherche de l'extension ou du site web.
2. Recevoir un résumé généré par l’IA avec les sources correspondantes.
3. Dans le cas où aucune source n'est trouvée, être informé avec une explication transparente.

## Roadmap

### Milestones actuelles :
- Apprendre les technologies nécessaires : React, Node.js, etc.
- Définir et entraîner un modèle d'IA adapté (ex. Meta-Llama).
- Améliorer l’UX/UI via des prototypes Figma.
- Implémenter le frontend et le backend de l’extension.
- Développer un algorithme de recherche pour relier les entrées utilisateur aux articles stockés.

## Contributions

Les contributions sont les bienvenues ! Veuillez soumettre une pull request ou ouvrir une issue pour proposer des améliorations ou signaler des problèmes.

## Contact

Pour toute question, suggestion ou retour, veuillez nous contacter via :
- **Email** : contact@finna.com
- **Discord** : [Lien Discord](https://discord.gg/HNCnBYXa)
- **Réseaux sociaux** : Twitter (@finna)
