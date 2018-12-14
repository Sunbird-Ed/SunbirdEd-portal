const _ = require('lodash');
const googleOauth = require('./../helpers/googleOauthHelper');

module.exports = (app, keycloak) => {

  app.get('/auth/google', (req, res) => {
    const state = JSON.stringify(req.query);
    let googleAuthUrl = googleOauth.generateAuthUrl(req) + '&state='+state
    res.redirect(googleAuthUrl);
  });

  app.get('/auth/google/callback', async (req, res) => {
    const config = JSON.parse(req.query.state)
    const { data, error } = await googleOauth.getProfile(req).then(data => ({data})).catch(error => ({error}))
    res.json('/');
  });
}
