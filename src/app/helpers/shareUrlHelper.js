let publicUri = '/public/#!'
let privateUri = '/private/#!'

module.exports = function (app) {
  app.all('/content/:id', function (req, res) {
    let redirectUrl = publicUri + req.path
    res.redirect(redirectUrl)
  })

  app.all('/course/:id', function (req, res) {
    let redirectUrl = publicUri + req.path
    res.redirect(redirectUrl)
  })
  app.all('/announcement/:id', function (req, res) {
    let redirectUrl = privateUri + req.path
    res.redirect(redirectUrl)
  })
  app.all('/unlisted/:hash', function (req, res) {
    let hash = req.params.hash
    let uri = Buffer.from(hash, 'base64').toString()
    let redirectUrl = publicUri + '/' + uri + '/unlisted'
    if (redirectUrl.indexOf('collection') > -1) {
      redirectUrl = redirectUrl.replace('collection', 'content')
      redirectUrl = redirectUrl + '/'
    }
    res.redirect(redirectUrl)
  })
}
