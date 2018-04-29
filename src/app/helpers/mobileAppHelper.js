var envHelper = require('./environmentVariablesHelper.js')
var publicUri = '/public/#!'

module.exports = function (app) {
  app.all(['*/get', '/get'], function (req, res) {
    var redirectUrl = publicUri + '/get'
    res.redirect(redirectUrl)
  })
  app.all(['*/get/dial/:dialCode', '/get/dial/:dialCode', '*/dial/:dialCode', '/dial/:dialCode'], function (req, res) {
    var redirectUrl = publicUri + '/get/dial/' + req.params.dialCode
    res.redirect(redirectUrl)
  })
  app.all('/app', function (req, res) {
    var redirectUrl = envHelper.ANDROID_APP_URL
    res.redirect(redirectUrl)
  })
}
