const envHelper = require('./environmentVariablesHelper.js')

module.exports = function (app) {
  app.all('/get', function (req, res) {
    res.redirect(envHelper.MOBILE_REDIRECT_URL)
  })
}
