'use strict';

const config = require('../config');
const { sign } = require('../middleware/auth');

function login({ username, password }) {
  if (username !== config.demoUser || password !== config.demoPass) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 12;
  return { token: sign({ sub: username, exp }), expiresIn: 12 * 60 * 60 };
}

function me(user) {
  return { username: user.sub };
}

module.exports = { login, me };
