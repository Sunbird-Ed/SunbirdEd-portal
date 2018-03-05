const envHelper = require('./environmentVariablesHelper.js')
module.exports = function (app) {
  app.all('/get/gg', function (req, res) {
    res.redirect(envHelper.MOBILE_REDIRECT_URL)
  })
}
