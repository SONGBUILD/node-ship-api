'use strict';

const { Router } = require('express');
const authService = require('../services/authService');
const { requireAuth } = require('../middleware/auth');

const router = Router();

router.post('/login', (req, res, next) => {
  try {
    const { username, password } = req.body || {};
    res.json(authService.login({ username, password }));
  } catch (err) {
    next(err);
  }
});

router.get('/me', requireAuth, (req, res) => {
  res.json(authService.me(req.user));
});

module.exports = router;
