const _ = require('lodash');
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const request = require('request-promise');
const envHelper = require('./../helpers/environmentVariablesHelper.js')
const dateFormat = require('dateformat')
const uuidv1 = require('uuid/v1')

const keyClockMobileClients = {
}
if(envHelper.KEYCLOAK_TRAMPOLINE_ANDROID_CLIENT.clientId){
  keyClockMobileClients[envHelper.KEYCLOAK_TRAMPOLINE_ANDROID_CLIENT.clientId] = {
    client_id: envHelper.KEYCLOAK_TRAMPOLINE_ANDROID_CLIENT.clientId,
    client_secret: envHelper.KEYCLOAK_TRAMPOLINE_ANDROID_CLIENT.secret
  }
}
if(envHelper.KEYCLOAK_GOOGLE_ANDROID_CLIENT.clientId){
  keyClockMobileClients[envHelper.KEYCLOAK_GOOGLE_ANDROID_CLIENT.clientId] = {
    client_id: envHelper.KEYCLOAK_GOOGLE_ANDROID_CLIENT.clientId,
    client_secret: envHelper.KEYCLOAK_GOOGLE_ANDROID_CLIENT.secret
  }
}
if(envHelper.KEYCLOAK_ANDROID_CLIENT.clientId){
  keyClockMobileClients[envHelper.KEYCLOAK_ANDROID_CLIENT.clientId] = {
    client_id: envHelper.KEYCLOAK_ANDROID_CLIENT.clientId
  }
}

module.exports = (app) => {

  app.post('/auth/v1/refresh/token', bodyParser.urlencoded({ extended: false }), bodyParser.json({ limit: '10mb' }),
    async (req, res) => {
      try {
        if(!req.body.refresh_token){
          throw { error: 'REFRESH_TOKEN_REQUIRED', message: "refresh_token is required", statusCode: 400 }
        }
        const jwtPayload = jwt.decode(req.body.refresh_token, {complete: true});
        if(!jwtPayload || !jwtPayload.payload){
          throw { error: 'INVALID_REFRESH_TOKEN', message: "refresh_token is invalid", statusCode: 400 }
        }
        const clientDetails = keyClockMobileClients[jwtPayload.payload.aud]
        if(!clientDetails){
          throw { error: 'INVALID_CLIENT', message: "client not supported", statusCode: 400 }
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
        res.send({
          'id': 'api.refresh.token',
          'ver': '1.0',
          'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'),
          'params': {
            'resmsgid': uuidv1(),
            'status': 'SUCCUSS',
          },
          'responseCode': 'OK',
          'result': typeof tokenResponse === 'string' ? JSON.parse(tokenResponse) : tokenResponse
        })
      } catch(error) {
        console.log('refresh token error', error.error);
        res.status(error.statusCode || 500).json({
          'id': 'api.refresh.token',
          'ver': '1.0',
          'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'),
          'params': {
            'resmsgid': uuidv1(),
            'status': 'FAILED',
            'err': error.message || 'Something went wrong while processing request',
            'errmsg': error.error || 'UNHANDLED_EXCEPTION'
          },
          'responseCode': error.error || 'UNHANDLED_EXCEPTION',
          'result': {}
        })
      }
  })
}
const handleError = (error) => {
  console.log('refresh token api error', error.error);
  const errorRes = JSON.parse(error.error)
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
      authorization: req.get('authorization')
    }
  }
  return request(options);
}
