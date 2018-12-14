const { google } = require('googleapis');
const _ = require('lodash');
const { GOOGLE_OAUTH_CONFIG } = require('./environmentVariablesHelper.js')
const redirectPath = '/auth/google/callback';
const defaultScope = ['https://www.googleapis.com/auth/plus.me', 'https://www.googleapis.com/auth/userinfo.email'];
class GoogleOauth {
  createConnection(req) {
    const  { clientId, clientSecret } = GOOGLE_OAUTH_CONFIG;
    const redirect = `${req.protocol}://${req.get('host')}${redirectPath}`;
    return new google.auth.OAuth2(clientId, clientSecret, redirect);
  }
  generateAuthUrl(req) {
    const connection = this.createConnection(req);
    return connection.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: defaultScope
    });
  }
  async getProfile(req) {
    const client = this.createConnection(req);
    const { tokens } = await client.getToken(req.query.code).catch(this.handleError)
    client.setCredentials(tokens)
    const plus = google.plus({ version: 'v1', auth: client})
    const { data } = await plus.people.get({ userId: 'me' }).catch(this.handleError)
    return data
  }
  handleError(error){
    if(_.get(error, 'response.data')){
      throw error.response.data
    } else if(error instanceof Error) {
      throw error.message
    } else {
      throw 'unhandled exception while getting tokens'
    } 
  }
}

const googleOauth = new GoogleOauth()
module.exports = googleOauth;