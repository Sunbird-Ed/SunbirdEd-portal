const _ = require('lodash');
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const request = require('request-promise');
const envHelper = require('./../helpers/environmentVariablesHelper.js')

const keyClockMobileClients = {
  'trampoline': {
    client_id: envHelper.PORTAL_TRAMPOLINE_CLIENT_ID,
    client_secret: envHelper.PORTAL_TRAMPOLINE_SECRET
  },
  'android': {
    client_id: 'android'
  },
  'google-auth': {
    client_id: envHelper.KEYCLOAK_GOOGLE_CLIENT.clientId,
    client_secret: envHelper.KEYCLOAK_GOOGLE_CLIENT.secret
  }
}

module.exports = (app) => {

  app.post('/v1/refresh/token', bodyParser.urlencoded({ extended: false }), bodyParser.json({ limit: '10mb' }),
    async (req, res) => {
      const jwtPayload = jwt.decode(req.body.refresh_token);
      const clientDetails = keyClockMobileClients[jwtPayload.aud]
      if(!clientDetails){
        req.status(401).json({
          errorCode: "INVALID_CLIENT"
        })
        return;
      }
      let options = {
        method: 'POST',
        url: `${envHelper.PORTAL_AUTH_SERVER_URL}/realms/${envHelper.PORTAL_REALM}/protocol/openid-connect/token`,
        form: {
          client_id: clientDetails.client_id,
          grant_type: 'refresh_token',
          refresh_token: req.body.refresh_token
        }
      }
      if(clientDetails.client_secret){
        options.form.client_secret = clientDetails.client_secret
      }
      try {
        const tokenResponse = await request(options)
        console.log('tokenResponse', tokenResponse)
        res.send(tokenResponse)
      } catch(error) {
        console.log(error.message, '\n', error.error, '\n', Object.keys(error))
        res.status(402).json({errorMsg: 'fetching refresh token failed'})
      }
  })
}