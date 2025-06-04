const express = require('express');
const router = express.Router();
// Récupère directement le handler de recherche
const { getSummarizedArticles } = require('../controllers/searchController');

// Route GET /search pour la recherche via query string
router.get('/', getSummarizedArticles);
// Route POST /search pour la recherche via body
router.post('/', getSummarizedArticles);

module.exports = router;
