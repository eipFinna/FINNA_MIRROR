const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedBackController');

router.post('/', feedbackController.postFeedback);

module.exports = router;
