'use strict';

const crypto = require('crypto');
const config = require('../config');

function b64url(input) {
  return Buffer.from(input).toString('base64url');
}

function sign(payload) {
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = b64url(JSON.stringify(payload));
  const data = `${header}.${body}`;
  const sig = crypto.createHmac('sha256', config.jwtSecret).update(data).digest('base64url');
  return `${data}.${sig}`;
}

function verify(token) {
  if (!token || token.split('.').length !== 3) {
    const err = new Error('Unauthorized');
    err.status = 401;
    throw err;
  }
  const [header, body, sig] = token.split('.');
  const data = `${header}.${body}`;
  const expected = crypto.createHmac('sha256', config.jwtSecret).update(data).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    const err = new Error('Unauthorized');
    err.status = 401;
    throw err;
  }
  const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
  if (payload.exp && Date.now() / 1000 > payload.exp) {
    const err = new Error('Token expired');
    err.status = 401;
    throw err;
  }
  return payload;
}

function requireAuth(req, _res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';
    req.user = verify(token);
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { sign, verify, requireAuth };
