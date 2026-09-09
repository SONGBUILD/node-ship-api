'use strict';

const { Router } = require('express');
const router = Router();

router.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'node-ship-api', ts: new Date().toISOString() });
});

module.exports = router;
