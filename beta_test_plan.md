# BETA TEST PLAN    
**Document Name**: beta_test_plan.md    
**Repository**: [Github Finna](https://github.com/eipFinna/FINNA_MIRROR)

---

## 1. Selection of Core Functionalities    
Les fonctionnalités essentielles pour la version bêta de Finna sont :    
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

## 2. Definition of Beta Testing Scenarios    
Les scénarios de tests couvrent les rôles suivants :    
- **End-User** : Utilisateur final de l'extension.    
- **Administrator** : Responsable de la maintenance et de la gestion des données.    
- **External Partner** : Collaborateur tiers fournissant du contenu ou des retours.  

### Scénario 1 : Vérification des informations    
- **User Role**: End-User    
- **Feature**: Soumettre un extrait et obtenir les sources.    
- **Expected Outcome**: Finna affiche toutes les sources pertinentes pour l'extrait soumis.    
- **Steps**:    
  1. Copier un extrait d'article ou de tweet.    
  2. Coller dans le champ de recherche de l'extension.    
  3. Cliquer sur "Vérifier".    
  4. Vérifier que les sources s'affichent correctement.    
- **Success Criteria**: Toutes les sources pertinentes sont affichées avec des liens cliquables.  

### Scénario 2 : Résumé automatique    
- **User Role**: End-User    
- **Feature**: Génération d'un résumé par l'IA LLM.    
- **Expected Outcome**: Un résumé concis et pertinent est généré.    
- **Steps**:    
  1. Soumettre un extrait d'article.    
  2. Vérifier que le résumé apparaît en dessous des sources.    
  3. Comparer le résumé avec le contenu des articles sourcés pour valider la pertinence.    
- **Success Criteria**: Le résumé est concis (moins de 100 mots) et couvre les points clés de l'information.  

### Scénario 3 : Extension web    
- **User Role**: End-User    
- **Feature**: Utilisation de l'extension dans un navigateur.    
- **Expected Outcome**: L'extension fonctionne de manière fluide sans ralentir le navigateur.    
- **Steps**:    
  1. Installer l'extension depuis la landing page.    
  2. Vérifier sa présence dans la barre d'extensions.    
  3. Tester son utilisation sur différents sites web.    
- **Success Criteria**: L'extension répond instantanément et n'affecte pas les performances du navigateur.  

---

## 3. Coverage of Key User Journeys    
Pour garantir une couverture complète des parcours utilisateurs, les scénarios de tests incluent :    
- **Recherche d'informations** : Vérification de la fiabilité d'un extrait copié depuis les réseaux sociaux.    
- **Exploration des sources** : Navigation entre les différentes sources affichées.    
- **Retour utilisateur** : Envoi de feedback via la landing page.    
- **Edge Cases** :    
  - Aucun résultat trouvé : Message informant l'utilisateur qu'aucune source pertinente n'a été trouvée.    
  - Erreurs de connexion : Gestion des erreurs réseau et affichage de messages clairs.  

---

## 4. Clear Evaluation Criteria    
- **Stabilité** : Aucune interruption lors de l'utilisation de l'extension sur au moins 10 sessions consécutives.    
- **Performance** : L'application doit être réactive et fournir une expérience utilisateur fluide sans ralentissements ni interruptions.    
- **Précision** : Taux de précision des résumés supérieur à 85% par rapport aux sources.    
- **Usabilité**
