\# BETA TEST PLAN    
\*\*Document Name\*\*: beta\_test\_plan.md    
\*\*Repository\*\*: \[Github Finna\](https://github.com/eipFinna/FINNA\_MIRROR)

\---

\#\# 1\. Selection of Core Functionalities    
Les fonctionnalités essentielles pour la version bêta de Finna sont :    
\- \*\*Vérification des informations\*\* : L’utilisateur peut soumettre un extrait (article, tweet, etc.), et Finna recherche les sources correspondantes.    
\- \*\*Résumé automatique\*\* : L'IA LLM synthétise les articles trouvés pour en produire un résumé.    
\- \*\*Extension web\*\* : Accès rapide et intégration dans le navigateur.    
\- \*\*Site web\*\* : Landing page pour télécharger l'extension et recueillir des retours d’utilisateurs.    
\- \*\*Scraping et stockage\*\* : Récupération automatisée d'articles via des scripts Python pour alimenter la base de données.  

\---

\#\# 2\. Definition of Beta Testing Scenarios    
Les scénarios de tests couvrent les rôles suivants :    
\- \*\*End-User\*\* : Utilisateur final de l'extension.    
\- \*\*Administrator\*\* : Responsable de la maintenance et de la gestion des données.    
\- \*\*External Partner\*\* : Collaborateur tiers fournissant du contenu ou des retours.  

\#\#\# Scénario 1 : Vérification des informations    
\- \*\*User Role\*\*: End-User    
\- \*\*Feature\*\*: Soumettre un extrait et obtenir les sources.    
\- \*\*Expected Outcome\*\*: Finna affiche toutes les sources pertinentes pour l'extrait soumis.    
\- \*\*Steps\*\*:    
  1\. Copier un extrait d'article ou de tweet.    
  2\. Coller dans le champ de recherche de l'extension.    
  3\. Cliquer sur "Vérifier".    
  4\. Vérifier que les sources s'affichent correctement.    
\- \*\*Success Criteria\*\*: Toutes les sources pertinentes sont affichées avec des liens cliquables.  

\#\#\# Scénario 2 : Résumé automatique    
\- \*\*User Role\*\*: End-User    
\- \*\*Feature\*\*: Génération d'un résumé par l'IA LLM.    
\- \*\*Expected Outcome\*\*: Un résumé concis et pertinent est généré.    
\- \*\*Steps\*\*:    
  1\. Soumettre un extrait d'article.    
  2\. Vérifier que le résumé apparaît en dessous des sources.    
  3\. Comparer le résumé avec le contenu des articles sourcés pour valider la pertinence.    
\- \*\*Success Criteria\*\*: Le résumé est concis (moins de 100 mots) et couvre les points clés de l'information.  

\#\#\# Scénario 3 : Extension web    
\- \*\*User Role\*\*: End-User    
\- \*\*Feature\*\*: Utilisation de l'extension dans un navigateur.    
\- \*\*Expected Outcome\*\*: L'extension fonctionne de manière fluide sans ralentir le navigateur.    
\- \*\*Steps\*\*:    
  1\. Installer l'extension depuis la landing page.    
  2\. Vérifier sa présence dans la barre d'extensions.    
  3\. Tester son utilisation sur différents sites web.    
\- \*\*Success Criteria\*\*: L'extension répond instantanément et n'affecte pas les performances du navigateur.  

\---

\#\# 3\. Coverage of Key User Journeys    
Pour garantir une couverture complète des parcours utilisateurs, les scénarios de tests incluent :    
\- \*\*Recherche d'informations\*\* : Vérification de la fiabilité d'un extrait copié depuis les réseaux sociaux.    
\- \*\*Exploration des sources\*\* : Navigation entre les différentes sources affichées.    
\- \*\*Retour utilisateur\*\* : Envoi de feedback via la landing page.    
\- \*\*Edge Cases\*\* :    
  \- Aucun résultat trouvé : Message informant l'utilisateur qu'aucune source pertinente n'a été trouvée.    
  \- Erreurs de connexion : Gestion des erreurs réseau et affichage de messages clairs.  

\---

\#\# 4\. Clear Evaluation Criteria    
\- \*\*Stabilité\*\* : Aucune interruption lors de l'utilisation de l'extension sur au moins 10 sessions consécutives.    
\- \*\*Performance\*\* : L'application doit être réactive et fournir une expérience utilisateur fluide sans ralentissements ni interruptions.    
\- \*\*Précision\*\* : Taux de précision des résumés supérieur à 85% par rapport aux sources.    
\- \*\*Usabilité\*\* : Feedback positif de 80% des testeurs bêta sur l'ergonomie de l'extension.    
\- \*\*Interactions Utilisateurs\*\* : Pour une évaluation détaillée des interactions utilisateurs, veuillez vous référer au document sur les interacteurs fourni dans la documentation de Finna.  

\---

\#\# 5\. Deliverables & Format    
\- \*\*Beta Test Plan\*\* : Ce document fournira les détails de chaque scénario de test.    
\- \*\*Rapports de Test\*\* : Des rapports structurés seront générés pour chaque itération de test.    
\- \*\*Feedback des Testeurs\*\* : Collecte de retours sur Discord et via le site web.    
\- \*\*Documentation\*\* : Mise à jour de la documentation utilisateur en fonction des retours de tests.  

\---

\#\# 6\. Expected Outcome    
Ce plan de test bêta vise à :    
\- \*\*Valider les fonctionnalités essentielles\*\* de Finna pour un usage public.    
\- \*\*Évaluer la stabilité, la performance et l'utilisabilité\*\* de l'extension.    
\- \*\*Collecter des retours utilisateurs\*\* pour guider les améliorations finales avant le lancement officiel.    
\- \*\*Préparer la démonstration\*\* pour le jury de fin d'année en montrant l'alignement avec les objectifs du projet.