# PLAN DE TEST BÊTA  
**Nom du document** : beta_test_plan.md  
**Dépôt GitHub** : [Github Finna](https://github.com/eipFinna/FINNA_MIRROR)

---

## 1. Sélection des fonctionnalités essentielles  
Les fonctionnalités clés de la version bêta de Finna sont :  
- **Vérification des informations** : L’utilisateur peut soumettre un extrait (article, tweet, etc.), et Finna recherche les sources correspondantes.  
  - **Priorité** : Haute  

- **Résumé automatique** : L'IA LLM synthétise les articles trouvés pour en produire un résumé.  
  - **Priorité** : Haute  

- **Extension web** : Accès rapide et intégration dans le navigateur.  
  - **Priorité** : Haute  

- **Site web (landing + feedback)** : Permet de télécharger l'extension et de recueillir des retours.  
  - **Priorité** : Moyenne  

- **Scraping et stockage** : Scripts Python pour récupérer automatiquement des articles.  
  - **Priorité** : Moyenne  

---

## 2. Définition des scénarios de test bêta  
Les tests couvrent les rôles suivants :  
- **Utilisateur final** : Celui qui utilise l’extension.  
- **Administrateur** : Gère les données et la maintenance.  
- **Partenaire externe** : Fournit du contenu ou du feedback.  

### Scénario 1 : Vérification des informations  
- **Priorité** : Haute  
- **Rôle** : Utilisateur final  
- **Fonctionnalité** : Soumettre un extrait et obtenir les sources.  
- **Résultat attendu** : Finna affiche toutes les sources pertinentes.  
- **Étapes** :  
  1. Copier un extrait.  
  2. Le coller dans la barre de recherche.  
  3. Cliquer sur "Vérifier".  
  4. Vérifier que les sources sont affichées.  
- **Critères de succès** : Les sources pertinentes sont listées avec des liens.  

### Scénario 2 : Résumé automatique  
- **Priorité** : Haute  
- **Rôle** : Utilisateur final  
- **Fonctionnalité** : Génération d'un résumé par IA.  
- **Résultat attendu** : Un résumé concis et pertinent est généré.  
- **Étapes** :  
  1. Soumettre un extrait.  
  2. Vérifier que le résumé apparaît.  
  3. Comparer avec les articles.  
- **Critères de succès** : Le résumé fait moins de 100 mots et résume l'essentiel.  

### Scénario 3 : Extension Web  
- **Priorité** : Haute  
- **Rôle** : Utilisateur final  
- **Fonctionnalité** : Utilisation de l’extension dans le navigateur.  
- **Résultat attendu** : L’extension fonctionne sans ralentissement.  
- **Étapes** :  
  1. Installer l’extension.  
  2. Vérifier sa présence.  
  3. L’utiliser sur plusieurs sites.  
- **Critères de succès** : L’extension est fluide et réactive.  

---

## 3. Couverture des parcours utilisateurs clés  
Les scénarios couvrent :  
- **Recherche d’information** : Depuis les réseaux sociaux.  
- **Exploration des sources** : Navigation dans les résultats.  
- **Retour utilisateur** : Feedback via la page d’accueil.  
- **Cas limites** :  
  - Aucune source trouvée : message informatif.  
  - Erreur de connexion : message d’erreur clair.  

---

## 4. Critères d’évaluation clairs  
- **Stabilité** : Aucun crash en 10 sessions consécutives.  
- **Performance** : Application fluide et réactive.  
- **Précision** : Résumés avec au moins 85% de pertinence.  
- **Utilisabilité** : 80% de retours positifs sur l’expérience.  
- **Interactions utilisateurs** : Voir le document des interacteurs de Finna pour plus de détails.  

---

## 5. Livrables & format  
- **Plan de test bêta** : Ce document.  
- **Rapports de tests** : Produits à chaque phase.  
- **Retours testeurs** : Collectés via Discord et le site.  
- **Documentation** : Mise à jour basée sur les retours.  

---

## 6. Résultat attendu  
Ce plan de test a pour but de :  
- **Valider les fonctionnalités essentielles** pour une mise en production.  
- **Évaluer stabilité, performance, utilisabilité**.  
- **Collecter du feedback réel** pour finaliser le développement.  
- **Préparer la démonstration** pour le jury de fin d’année.
