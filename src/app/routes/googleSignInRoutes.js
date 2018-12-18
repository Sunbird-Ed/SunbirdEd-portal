const _ = require('lodash');
const { googleOauth, createSession, fetchUserById, createUserWithMailId } = require('./../helpers/googleOauthHelper');

module.exports = (app) => {

  app.get('/google/auth', (req, res) => {
    if (!req.query.client_id || !req.query.redirect_uri || !req.query.error_callback) {
      res.redirect('/library')
      return
    }
    const state = JSON.stringify(req.query);
    let googleAuthUrl = googleOauth.generateAuthUrl(req) + '&state=' + state
    res.redirect(googleAuthUrl)
  });
  /**
   * steps followed in callback url
   * 1. Parse 'state' query param and check mandatory field. If error redirect to '/library'.
   * 2. Fetch profile from access code.
   * 3. Fetch userProfile from sunbird middleware.
   * 4. If userProfile found do step 5.
   * 5. Redirect based on client_id obtained from req query.
   *    a. If portal, create session and redirect to redirect url, if not '/library'.
   *    b. If mobile, crete session redirect to redirect url obtained from query with jwt token and refresh token.
   * 6. userProfile not found, make create user api, get userName and do step 5
   * 7. If any error in the flow, redirect to error_callback with all query param.
   */
  app.get('/google/auth/callback', async (req, res) => {
    const reqQuery = _.pick(JSON.parse(req.query.state), ['client_id', 'redirect_uri', 'error_callback', 'scope', 'state', 'response_type'])
    let googleProfile, sunbirdProfile, token;
    try {
      if (!reqQuery.client_id || !reqQuery.redirect_uri || !reqQuery.error_callback) {
        throw 'some of the query params are missing'
      }
      googleProfile = await googleOauth.getProfile(req);
      sunbirdProfile = await fetchUserById(googleProfile.emailId)
        .then(data => ({ userName: data.result.response.userName }))
        .catch(result => ({}))
      if (!sunbirdProfile.userName) {
        await createUserWithMailId(googleProfile)
          .catch(handleLearnerServiceError)
      }
      token = await createSession(googleProfile.emailId, req, res)
      let redirect_uri;
      if (reqQuery.client_id === 'android') {
        const query = Object.keys(token).map(key => key + '=' + token.key).join('&');
        redirect_uri = redirect_uri + '?' + query
      } else {
        redirect_uri = reqQuery.redirect_uri.split('?')[0] || '/resources'
      }
      res.redirect(redirect_uri)
    } catch (error) {
      let redirect_uri = '/resources';
      if (reqQuery.error_callback) {
        const queryObj = _.pick(reqQuery, ['client_id', 'redirect_uri', 'scope', 'state', 'response_type'])
        queryObj.error_message = getErrorMessage(error);
        const query = Object.keys(queryObj).map(key => key + '=' + reqQuery[key]).join('&');
        redirect_uri = reqQuery.error_callback + '?' + query
      }
      console.log('error while logging in-----------', error, googleProfile, sunbirdProfile, token); // log error
      res.redirect(redirect_uri) // change it to error_callback with queryParams
    }
  });
}
const getErrorMessage = (error) => {
  if(error instanceof Error && error.message === 'User name not present in request') {
    return 'Your account could not be created on Diksha due to your Google Security settings.';
  } else {
    return 'Your account could not be created on Diksha due to some internal error.'
  }
}
const handleLearnerServiceError = (error) => {
  if (_.get(error, 'error.params')) {
    throw error.error.params
  } else if (error instanceof Error) {
    throw error.message
  } else {
    throw 'unhandled exception while getting userDetails'
  }
}
