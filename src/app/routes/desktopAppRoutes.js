const desktopAppHelper = require('../helpers/desktopAppHelper.js');
const bodyParser = require('body-parser');
const envHelper = require('./../helpers/environmentVariablesHelper.js');
const logger = require('sb_logger_util_v2');

module.exports = function (app) {
    app.post('/v1/desktop/update', bodyParser.urlencoded({ extended: true }),
        bodyParser.json(),
        desktopAppHelper.getAppUpdate(), () => {
            logger.info({msg: '/v1/desktop/update called'});
        })
}
