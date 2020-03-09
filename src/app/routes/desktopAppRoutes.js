const desktopAppHelper = require('../helpers/desktopAppHelper.js');
const crashReporter = require('../helpers/desktopCrashReporter.js');
const bodyParser = require('body-parser');
const logger = require('sb_logger_util_v2');
module.exports = function (app) {
    app.post('/v1/desktop/update', bodyParser.urlencoded({ extended: true }),
        bodyParser.json(),
        desktopAppHelper.getAppUpdate(), () => {
            logger.info({msg: '/v1/desktop/update called'});
        })

    app.post('/v1/desktop/upload-crash-logs', crashReporter.storeCrashLogsToAzure());
}
