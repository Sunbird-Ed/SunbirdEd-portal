const desktopAppHelper = require('../helpers/desktopAppHelper.js');
const bodyParser = require('body-parser');
const envHelper = require('./../helpers/environmentVariablesHelper.js');

module.exports = function (app) {
    app.post('/v1/desktop/update', bodyParser.urlencoded({ extended: true }),
        bodyParser.json(),
        desktopAppHelper.getAppUpdate())
}
