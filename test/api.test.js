'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const { createApp } = require('../src/app');

function request(app, { method = 'GET', path, body, headers = {} }) {
  return new Promise((resolve, reject) => {
    const server = http.createServer(app);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      const payload = body ? JSON.stringify(body) : null;
      const req = http.request(
        {
          hostname: '127.0.0.1',
          port,
          path,
          method,
          headers: {
            ...(payload ? { 'content-type': 'application/json', 'content-length': Buffer.byteLength(payload) } : {}),
            ...headers,
          },
        },
        (res) => {
          let data = '';
          res.on('data', (c) => { data += c; });
          res.on('end', () => {
            server.close();
            let json = null;
            try { json = JSON.parse(data); } catch (_) { /* ignore */ }
            resolve({ status: res.statusCode, json });
          });
        }
      );
      req.on('error', (err) => {
        server.close();
        reject(err);
      });
      if (payload) req.write(payload);
      req.end();
    });
  });
}

describe('node-ship-api', () => {
  const app = createApp();

  it('health is ok', async () => {
    const res = await request(app, { path: '/health' });
    assert.equal(res.status, 200);
    assert.equal(res.json.ok, true);
  });

  it('rejects bad login', async () => {
    const res = await request(app, {
      method: 'POST',
      path: '/auth/login',
      body: { username: 'nope', password: 'wrong' },
    });
    assert.equal(res.status, 401);
  });

  it('login then me', async () => {
    const login = await request(app, {
      method: 'POST',
      path: '/auth/login',
      body: { username: 'demo', password: 'demo-pass' },
    });
    assert.equal(login.status, 200);
    assert.ok(login.json.token);
    const me = await request(app, {
      path: '/auth/me',
      headers: { authorization: `Bearer ${login.json.token}` },
    });
    assert.equal(me.status, 200);
    assert.equal(me.json.username, 'demo');
  });
});
