const googleService = require('../helpers/googleService');
const bodyParser = require('body-parser');

module.exports = function (app) {
  app.post('/validate/recaptcha', bodyParser.json({limit: '1mb'}), googleService.validateRecaptcha)
};
