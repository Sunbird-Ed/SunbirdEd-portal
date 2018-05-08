var envHelper = require('./environmentVariablesHelper.js')
var publicUri = ''

module.exports = function (app) {
  app.all('/app', function (req, res) {
    var redirectUrl = envHelper.MOBILE_REDIRECT_URL
    res.redirect(redirectUrl)
  })
}
