const express = require('express');
const router = express.Router();
const { pastUserSearch, getPastUserSearches } = require('../controllers/pastUserSearchController');

router.get('/', pastUserSearch);

module.exports = router;