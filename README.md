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
- **(Optionnel)** Docker & Docker Compose pour une installation simplifiée
- **Git**

### Instructions

## Installation locale

**Cloner le dépôt**  
   ```bash
   git clone https://github.com/eipFinna/FINNA_MIRROR.git
   cd FINNA_MIRROR/src/backend
   ```

# Finna Backend (src/backend)

Ce dossier contient le backend Node.js (API Express) et le service Python (Flask) pour l’IA.

1. **Configurer la base de données**  
   - Créer la base et les tables (voir `/database/dbInit.sql`).
   - Créer un fichier `config/dbConfig.json` avec vos identifiants PostgreSQL.
   - Exemple de fichier `dbConfig.json` vide :
     ```json
         {
            "host": "",
            "user": "",
            "password": "",
            "database": "",
            "port": 5432,
            "ssl": {
               "rejectUnauthorized": true,
               "ca": "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----"
            }
         }
     ```

2. **Installer les dépendances Node.js**  
   ```bash
   npm install
   ```

3. **Installer les dépendances Python**  
   ```bash
   cd services/python_api
   pip install -r ../../requirements.txt
   python3 -m spacy download fr_core_news_lg
   ```

4. **Exporter le modèle ONNX pour l’IA**  
   ```bash
   python3 export_onnx.py --model plguillou/t5-base-fr-sum-cnndm --output onnx-t5-base-fr-quant --quantize
   ```

5. **Configurer les variables d’environnement**  
   - Créer un fichier `.env` à la racine du backend (voir `.env.example`).

6. **Lancer les serveurs**  
   - **Backend Node.js**  
     ```bash
     npm start
     ```
   - **API Python (Flask)**  
     ```bash
     cd services/python_api
     python3 aiAPI.py
     ```

## Tests & Monitoring

- Les métriques Prometheus sont exposées sur `/metrics`.
- Les logs sont affichés en console.

# Finna Web (src/frontend/web)

Ce dossier contient le frontend React pour le site web.

1. **Installer les dépendances**
   ```bash
   npm install
   ```

2. **Lancer l’application en développement**
   ```bash
   npm start
   ```
   L’application sera accessible sur [http://localhost:3000](http://localhost:3000).

## Scripts utiles

- `npm start` : Lance l’application en mode développement.
- `npm test` : Lance les tests unitaires avec Jest.
- `npm run build` : Crée une version optimisée pour la production dans le dossier `build/`.

# Finna Extension (src/frontend/extension)

Ce dossier contient le code pour l’extension.

1. **Installer les dépendances**
   ```bash
   npm install
   ```

2. **Construire l’extension**
   ```bash
   npm start
   ```
   L’extension sera construite dans le dossier `build/`.

3. **Installation de l’extension dans le navigateur**
   - Pour Chrome, Firefox ou Edge, vous pouvez charger l’extension non empaquetée
   # Exemple pour Chrome :
   - Ouvrir Chrome et aller dans `chrome://extensions/`.
   - Activer le mode développeur.
   - Cliquer sur "Charger l’extension non empaquetée" et sélectionner le dossier `src/frontend/extension/build`.
   - L’extension sera disponible dans la barre d’outils.

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
