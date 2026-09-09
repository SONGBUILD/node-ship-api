'use strict';

function required(name, fallback) {
  const value = process.env[name];
  if (value) return value;
  return fallback;
}

module.exports = {
  port: Number(required('PORT', '3000')),
  jwtSecret: required('JWT_SECRET', 'dev-only-secret'),
  demoUser: required('DEMO_USER', 'demo'),
  demoPass: required('DEMO_PASS', 'demo-pass'),
};
