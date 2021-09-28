const { createSession, fetchUserByEmailId, createUserWithMailId } = require('../../helpers/googleOauthHelper');
const jwt = require('jsonwebtoken');
const APPLE_SIGN_IN_DELAY = 3000;
const envHelper = require('../../helpers/environmentVariablesHelper.js');
const { logger } = require('@project-sunbird/logger');
const jwksClient = require('jwks-rsa');
const bodyParser = require('body-parser');

module.exports = (app) => {

    app.use('/api/data/v1/form/read', bodyParser.json(), IOSFormMiddleware);

    app.post('/apple/auth/ios', bodyParser.json(), appleSininHandler);

}
