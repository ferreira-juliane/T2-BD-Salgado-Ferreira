'use strict';

const db = require('./queries');
const express = require('express');
const app = express();

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
app.use(express.json());
app.get('/', (req, res) => {
  res.status(200).send("API funcionando!");
})


// Rotas
app.get('/tag/api/contest/:contestId/tags/:entityType([a-zA-Z0-9]+\/[a-zA-Z0-9]+|[^/]+)/:entityId', db.getByTag);
app.post('/tag/api/contest/:contestId/tags', db.postByTag);
app.put('/tag/api/contest/:contestId/tags', db.putByTag);
app.delete('/tag/api/contest/:contestId/tags', db.deleteByTag);


app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});