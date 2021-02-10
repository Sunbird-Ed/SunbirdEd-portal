const desktopAppHelper = require('../helpers/desktopAppHelper.js');
const envHelper = require('../helpers/environmentVariablesHelper.js');
const crashReporter = require('../helpers/desktopCrashReporter.js');
const bodyParser = require('body-parser');
const { logger } = require('@project-sunbird/logger');
const path = require('path');
module.exports = function (app) {
    app.post('/v1/desktop/update', bodyParser.urlencoded({ extended: true }),
        bodyParser.json(),
        desktopAppHelper.getAppUpdate(), () => {
            logger.info({msg: '/v1/desktop/update called'});
        })

    app.post('/v1/desktop/upload-crash-logs', crashReporter.storeCrashLogsToAzure());

    /**
     * @param  {Object} req - Request Object
     * @param  {Object} res - Response Object
     * @description Used to store users access token information in session and redirect to new route
     */
    app.get('/v1/desktop/handleGauth', (req, res) => {
        logger.info({ msg: `/v1/desktop/handleGauth called` });
        req.session.desktopAuthdata = req.query;
        res.redirect('/v1/desktop/google/auth/success');
    })
    /**
     * @param  {Object} req - Request Object
     * @param  {Object} res - Response Object
     * @description used to prepare custom url to open desktop app and render google signin success page
     */
    app.get('/v1/desktop/google/auth/success', (req, res) => {
        logger.info({ msg: `/v1/desktop/google/auth/success called` });
        const data = req.session.desktopAuthdata;
        delete req.session.desktopAuthdata;
        const protocol = envHelper.DESKTOP_APP_ID.replace(/\./g, "");
        const reponseData = `${protocol}://google/signin?access_token=${data.access_token}&refresh_token=${data.refresh_token}`;
        res.render(
            path.join(__dirname, "googleResponse.ejs"), 
            {data: reponseData}
        );
    })
}