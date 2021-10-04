const { createSession, fetchUserByEmailId, createUserWithMailId } = require('../googleOauthHelper');
const envHelper = require('../environmentVariablesHelper.js');
const { logger } = require('@project-sunbird/logger');
const jwksClient = require('jwks-rsa');
const jwt = require('jsonwebtoken');
const APPLE_SIGN_IN_DELAY = 3000;

const client = jwksClient({
        jwksUri: envHelper.APPLE_SIGNIN_KEY_URL
});
    
async function getAppleSignInKey(kid, res) {
        try {
            const key = await client.getSigningKey(kid);
            if (!key) {
                return null;
            }
            const signingKey = key.getPublicKey();
            return signingKey;
        } catch (err) {
            logger.info({ msg: "Apple signin key error"});
            throw "Invalid identifierToken!";
        }
}
    
async function verifyAppleJWTToken(json, applePublicKey, res) {
        return new Promise( (resolve, reject) => {
            try {
                jwt.verify(json, applePublicKey, (err, payload) => {
                    if (err) {
                        console.log(err);
                        console.log('JWT was not valid or error occured during verification');
                        resolve({ msg: "Invalid identifierToken" });
                        return;
                    }
                    resolve(payload);
                });
            } catch (err) {
                throw " asdas d asd asdasd";
            }
        });
}
    
async function handleVerifiedUser(criticalUserDetails, req, res, json) {
        let newUserDetails = {};
        const clientId = req.body.clientId || 'android';
        let { email, sub, iss, aud } = criticalUserDetails;
        if (
        email === json.payload.email &&
        sub === json.payload.sub &&
        iss === json.payload.iss &&
        aud === json.payload.aud
        ) {
            let isUserExist = await fetchUserByEmailId(email, req).catch(handleGetUserByIdError);
            if (!isUserExist) {
                try{
                    let newAppleUserDetails = {};
                    newAppleUserDetails['name']= criticalUserDetails.name ? criticalUserDetails.name : email;
                    newAppleUserDetails['emailId'] = email;
                    logger.info({msg: 'creating new google user'});
                    errType = 'USER_CREATE_API';
                    newUserDetails = await createUserWithMailId(newAppleUserDetails, clientId, req).catch(handleCreateUserError);
                    await utils.delay(APPLE_SIGN_IN_DELAY);
                } catch (err) {
                    logger.info({ msg: "Error while creating new user", err });
                    throw "Error while creating new user";
                } 
            }
    
            const keyCloakToken = await createSession(email, {client_id: clientId}, req, res).catch(handleCreateSessionError);
    
            res.status(200).send({ sessionId: keyCloakToken, msg: "User Verification Succesfull" });
            return;
        } else {
            logger.info({
                msg: "verifiying the user failed"
            });
            res.status(200).send({ msg: "User Verification Failed or User didn't match" });
            throw "User Verification Failed or User didn't match";
        }
}
    
const handleCreateUserError = (error) => {
        logger.info({
            msg: 'ERROR_CREATING_USER',
            error: error,
        });
        if (_.get(error, 'error.params')) {
            throw error.error.params;
        } else if (error instanceof Error) {
            throw error.message;
        } else {
            throw 'unhandled exception while getting userDetails';
        }
}
    
const handleGetUserByIdError = (error) => {
        if (_.get(error, 'error.params.err') === 'USER_NOT_FOUND' || _.get(error, 'error.params.status') === 'USER_NOT_FOUND') {
            return {};
        }
        throw error.error || error.message || error;
}
    
const handleCreateSessionError = (error) => {
        logger.info({
            msg: 'ERROR_CREATING_SESSION',
            error: error,
        });
        throw error.error || error.message || error;
};

const appleSininHandler = async (req, res) => {
        try {
            const { identityToken, platform } = req.body;
            if (platform.toLowerCase() === 'ios') {
                let kid = "";
                let jwtjson = "";
                jwtjson = jwt.decode(identityToken, { complete: true });
                if (jwtjson && jwtjson.header && jwtjson.header.kid) {
                    kid = jwtjson.header.kid;
                } else {
                    logger.info({ msg : "Error while decoding identifierToken" });
                    throw "Invalid identifierToken!";
                }
                
                const appleKey = await getAppleSignInKey(kid, res);
    
                if (!appleKey) {
                    logger.info({ msg: 'Can\'t reteive Signing Key'});
                    throw 'Can\'t reteive Signing Key'
                }
    
                const userDetails = await verifyAppleJWTToken(identityToken, appleKey, res);
    
                if (!userDetails) {
                    console.log('Error while verifiying user');
                    throw "User verification failed";
                }
                const sessonId = handleVerifiedUser(userDetails, req, res, jwtjson);
    
            }
        } catch (error) {
            res.status(400).send({ error });
            throw error;
        }
}

module.exports = { appleSininHandler };
