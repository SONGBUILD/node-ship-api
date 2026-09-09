'use strict';

const express = require('express');
const health = require('./routes/health');
const auth = require('./routes/auth');
const errorHandler = require('./middleware/error');

function createApp() {
  const app = express();
  app.use(express.json({ limit: '32kb' }));
  app.get('/', (_req, res) => {
    res.json({
      name: 'node-ship-api',
      docs: 'See README.md',
      health: '/health',
    });
  });
  app.use(health);
  app.use('/auth', auth);
  app.use(errorHandler);
  return app;
}

module.exports = { createApp };
