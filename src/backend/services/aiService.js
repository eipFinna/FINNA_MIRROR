const axios = require('axios');
const { iaBatch } = require('../services/metricsService');
const FLASK_URL = process.env.FLASK_URL || 'http://localhost:5001';

// Extrait les mots-clés
async function getKeywords(text) {
  const resp = await axios.post(`${FLASK_URL}/keywords`, { text });
  return resp.data.keywords; 
}

// Résume un article
async function summarizeArticle(text) {
  const resp = await axios.post(`${FLASK_URL}/summarize`, { text });
  return resp.data.summary;
}

async function summarizeAggregate(text) {
  return summarizeArticle(text);
}

async function summarizeBatch(texts) {
  const end = iaBatch.startTimer();
  const resp = await axios.post(`${FLASK_URL}/batch_summarize`, { texts });
  end();
  return resp.data.summaries;
}

module.exports = {
  getKeywords,
  summarizeArticle,
  summarizeAggregate,
  summarizeBatch,
};