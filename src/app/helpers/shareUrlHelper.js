let publicUri = '/public/#!'

module.exports = function (app) {
  app.all('/content/*', function (req, res) {
    let redirectUrl = publicUri + req.path
    res.redirect(redirectUrl)
  })

  app.all('/course/*', function (req, res) {
    let redirectUrl = publicUri + req.path
    res.redirect(redirectUrl)
  })
}
