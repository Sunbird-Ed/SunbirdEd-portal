const envHelper = require('./environmentVariablesHelper.js')
let publicUri = '/public/#!'
let privateUri = '/private/#!'

module.exports = function (app) {
  app.all('/get', function (req, res) {
  	let redirectUrl = publicUri + req.path
    res.redirect(redirectUrl)
  })
  app.all('/get/dial/**', function (req, res) {
  	let redirectUrl = publicUri + req.path
    res.redirect(redirectUrl)
  })
  app.all('/app', function (req, res) {
  	let redirectUrl = envHelper.MOBILE_APP_URL
    res.redirect(redirectUrl)
  })
}
