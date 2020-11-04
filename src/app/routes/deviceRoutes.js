const deviceService = require('../helpers/deviceService');
const bodyParser = require('body-parser');

module.exports = function (app) {
  app.get('/device/profile/:deviceId', bodyParser.json({limit: '1mb'}), deviceService.getDeviceProfile);
  app.post('/device/register/:deviceId', bodyParser.json({limit: '1mb'}), deviceService.registerDeviceProfile)

};
