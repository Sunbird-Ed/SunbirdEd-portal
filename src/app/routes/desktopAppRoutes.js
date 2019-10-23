const desktopAppHelper = require('../helpers/desktopAppHelper.js')
const bodyParser = require('body-parser')

module.exports = function (app) {
    app.use(
        bodyParser.urlencoded({
            extended: true
        })
    )

    app.use(bodyParser.json())

    app.post('/appUpdateAvailable',
        desktopAppHelper.getAppDetails())
}
