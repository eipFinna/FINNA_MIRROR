const express = require('express');
const metricsService = require('../services/metricsService');
const router = express.Router();
const client = metricsService.client;

async function metricRouteHandler(req, res) {
  // 1) Récupère toutes les métriques en JSON
  let metricsJson = await client.register.getMetricsAsJSON();

  // 2) Ne garder que celles dont le nom commence par "finna_"
  metricsJson = metricsJson.filter(m => m.name.startsWith('finna_'));

  // 3) Si le navigateur demande HTML, on génère le dashboard
  if (req.accepts('html')) {
    let html = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <title>Finna Metrics</title>
        <style>
          body { font-family: sans-serif; padding: 1rem; }
          h1 { margin-bottom: .5rem; }
          h2 { margin-top: 1.5rem; }
          table { border-collapse: collapse; width: 100%; margin-bottom: 1rem; }
          th, td { border: 1px solid #999; padding: .25rem .5rem; text-align: left; }
          th { background: #eee; }
          pre { background: #f8f8f8; padding: .5rem; }
        </style>
      </head>
      <body>
        <h1>Finna Metrics Dashboard</h1>
        <p>Metrics de Finna.</p>
    `;

    if (metricsJson.length === 0) {
      html += `<p><em>Aucune métrique personnalisée disponible</em></p>`;
    } else {
      for (const metric of metricsJson) {
        html += `<h2>${metric.name}</h2>`;
        if (metric.values.length === 0) {
          html += `<p><em>Aucune donnée disponible</em></p>`;
        } else {
            for (const val of metric.values) {
            if (val.labels && Object.values(val.labels).length === 0) {
              if (metric.help) {
                html += `<pre>${metric.help} = ${val.value}</pre>`;
                break;
              }
            }
          }
        }
      }
    }

    html += `
      </body>
      </html>
    `;
    res.set('Content-Type', 'text/html');
    return res.send(html);
  }

  // Sinon on sert le format Prometheus standard,
  // mais uniquement vos métriques filtrées :
  // (vous pouvez aussi renvoyer tout si vous préférez)
  res.set('Content-Type', client.register.contentType);
  // retransformer metricsJson en format Prometheus textuel
  // (ici on renvoie tout brut, y compris les filtres déjà faits par Prom-client)
  res.send(await client.register.metrics());
}

router.get('/', metricRouteHandler);

module.exports = router;
