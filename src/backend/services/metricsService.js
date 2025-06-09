const client = require('prom-client');

// Histogrammes pour chaque étape
const keywordExtraction = new client.Histogram({
  name: 'finna_keyword_extraction_duration_seconds',
  help: 'Durée en secondes de l\'extraction des mots-clés',
});

const dbQuery = new client.Histogram({
  name: 'finna_db_query_duration_seconds',
  help: 'Durée en secondes de la requête DB full-text',
});

const iaBatch = new client.Histogram({
  name: 'finna_ia_batch_duration_seconds',
  help: 'Durée en secondes de l\'appel batch à l\'IA',
});

const totalIaBatch = new client.Histogram({
  name: 'finna_ia_batch_total_duration_seconds',
  help: 'Durée totale en secondes de l\'appel batch à l\'IA',
});

const summaryAggregate = new client.Histogram({
  name: 'finna_summary_aggregate_duration_seconds',
  help: 'Durée en secondes de l\'agrégation finale des mini-résumés',
});

module.exports = {
  client,
  keywordExtraction,
  dbQuery,
  iaBatch,
  summaryAggregate,
  totalIaBatch,
};
