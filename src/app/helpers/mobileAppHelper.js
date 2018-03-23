const envHelper = require('./environmentVariablesHelper.js')
const publicUri = '/public/#!'

module.exports = function (app) {
  app.all('/get', function (req, res) {
    const redirectUrl = publicUri + req.path
    res.redirect(redirectUrl)
  })
  app.all('/get/dial/**', function (req, res) {
    const redirectUrl = publicUri + req.path
    res.redirect(redirectUrl)
  })
  app.all('/app', function (req, res) {
    const redirectUrl = envHelper.MOBILE_APP_URL
    res.redirect(redirectUrl)
  })
}
