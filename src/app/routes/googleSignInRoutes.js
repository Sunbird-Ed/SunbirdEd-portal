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
   * steps to be followed in callback url
   * 1. Parse 'state' query param and check mandatory field. If error redirect to '/library'.
   * 2. Fetch profile from access code.
   * 3. Fetch userProfile from sunbird middleware.
   * 4. If userProfile found do step 5.
   * 5. Redirect based on client_id obtained from req query.
   *    a. If portal, create session and redirect to redirect url, if not '/library'.
   *    b. If mobile, crete session redirect to redirect url obtained from query with jwt token and refresh token.
   * 6. userProfile not found, make create user api, then do step 5
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
      sunbirdProfile = await fetchUserById(googleProfile.emailId, req)
        .then(data => ({ userName: data.result.response.userName }))
        .catch(handleGetUserByIdError)
      if (!sunbirdProfile.userName) {
        await createUserWithMailId(googleProfile, req).catch(handleCreateUserError)
      }
      token = await createSession(googleProfile.emailId, req, res)
      let redirect_uri;
      if (reqQuery.client_id === 'android') {
        const query = Object.keys(token).map(key => key + '=' + token[key]).join('&');
        redirect_uri = reqQuery.redirect_uri.split('?')[0] + '?' + query
      } else {
        redirect_uri = reqQuery.redirect_uri.split('?')[0] || '/resources'
      }
      res.redirect(redirect_uri)
    } catch (error) {
      let redirect_uri = '/resources';
      if (reqQuery.error_callback) {
        const queryObj = _.pick(reqQuery, ['client_id', 'redirect_uri', 'scope', 'state', 'response_type'])
        queryObj.error_message = getErrorMessage(error);
        const query = Object.keys(queryObj).map(key => key + '=' + queryObj[key]).join('&');
        redirect_uri = reqQuery.error_callback + '?' + query
      }
      console.log('google sign in failed with', error, googleProfile, sunbirdProfile, token); // log error
      res.redirect(redirect_uri) // change it to error_callback with queryParams
    }
  });
}
const getErrorMessage = (error) => {
  if(error instanceof Error && error.message === 'USER_NAME_NOT_PRESENT') {
    return 'Your account could not be created on Diksha due to your Google Security settings.';
  } else {
    return 'Your account could not be created on Diksha due to some internal error.'
  }
}
const handleCreateUserError = (error) => {
  if (_.get(error, 'error.params')) {
    throw error.error.params
  } else if (error instanceof Error) {
    throw error.message
  } else {
    throw 'unhandled exception while getting userDetails'
  }
}
const handleGetUserByIdError = (error) => {
  if(_.get(error, 'error.params.err') === 'USER_NOT_FOUND' || _.get(error, 'error.params.status') === 'USER_NOT_FOUND'){
    return {};
  }
  throw error.error || error.message || error
}
