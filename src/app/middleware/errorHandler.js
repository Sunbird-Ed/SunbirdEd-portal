const { logger } = require('@project-sunbird/logger');

/**
 * Centralized Error Handler Middleware
 * Logs errors and returns a consistent JSON response
 */
const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Unexpected error occurred';

  logger.error({
    msg: `Error processing request: ${req.method} ${req.url}`,
    status: status,
    error: message,
    stack: err.stack
  });

  // Ensure headers aren't already sent
  if (res.headersSent) {
    return next(err);
  }

  res.status(status).json({
    success: false,
    message: message
  });
};

module.exports = errorHandler;
