const desktopAppHelper = require('../helpers/desktopAppHelper.js')
const bodyParser = require('body-parser')

module.exports = function (app) {
    app.post('/v1/desktop/update', bodyParser.urlencoded({ extended: true }),
        bodyParser.json({ limit: '10mb' }),
        desktopAppHelper.getAppUpdate())
}
