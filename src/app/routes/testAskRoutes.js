/**
 * Test Ask Routes - Simple test routes for debugging
 */

const express = require('express');
const router = express.Router();

/**
 * Simple test endpoint
 * GET /api/ask/test
 */
router.get('/test', (req, res) => {
  res.json({
    status: 'success',
    message: 'Ask routes are working!',
    timestamp: new Date().toISOString()
  });
});

/**
 * Test proxy endpoint
 * POST /api/ask/test-proxy
 */
router.post('/test-proxy', (req, res) => {
  console.log('Test proxy called with body:', req.body);
  res.json({
    status: 'success',
    message: 'Test proxy is working!',
    receivedData: req.body,
    timestamp: new Date().toISOString()
  });
});

module.exports = (app) => {
  app.use('/api/ask', router);
};
