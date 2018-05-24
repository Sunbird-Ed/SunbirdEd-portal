var envHelper = require('./environmentVariablesHelper.js')

module.exports = function (app) {
    app.all(['*/dial/:dialCode', '/dial/:dialCode'], function (req, res) {
      var redirectUrl = '/get/dial/' + req.params.dialCode
      res.redirect(redirectUrl)
    })
  app.all('/app', function (req, res) {
    var redirectUrl = envHelper.ANDROID_APP_URL
    res.redirect(redirectUrl)
  })
}
