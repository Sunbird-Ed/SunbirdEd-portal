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

  app.post('/auth/v1/refresh/token', bodyParser.urlencoded({ extended: false }), bodyParser.json({ limit: '10mb' }),
    async (req, res) => {
      try {
        if(!req.body.refresh_token){
          throw { error: 'REFRESH_TOKEN_REQUIRED', message: "refresh_token is required", statusCode: 400 }
        }
        const jwtPayload = jwt.decode(req.body.refresh_token);
        const clientDetails = keyClockMobileClients[jwtPayload.aud]
        if(!clientDetails){
          throw { error: 'INVALID_CLIENT', message: "client sent is not supported", statusCode: 400 }
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
        clientDetails.client_secret && (options.form.client_secret = clientDetails.client_secret)
        await verifyAuthToken(req).catch(handleError);
        const tokenResponse = await request(options).catch(handleError)
        res.send(tokenResponse)
      } catch(error) {
        res.status(error.statusCode || 500).json({
          errorMessage: error.message,
          errorCode: error.error || 'unhandled exception'
        })
      }
  })
}
const handleError = (error) => {
  const errorRes = JSON.parse('error.error')
  throw {
    statusCode: error.statusCode,
    error: errorRes.error || 'INVALID_REQUEST',
    message: errorRes.message || errorRes.error_description,
  }
}
const verifyAuthToken = async (req) => {
  let options = {
    method: 'GET',
    url: envHelper.PORTAL_ECHO_API_URL + 'test',
    'rejectUnauthorized': false,
    headers: {
      'cache-control': 'no-cache',
      authorization: req.get('authorization')
    }
  }
  const echoRes = await request(options);
}