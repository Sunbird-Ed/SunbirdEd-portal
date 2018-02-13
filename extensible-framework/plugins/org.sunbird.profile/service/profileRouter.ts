import { FrameworkAPI, envVariables } from '../../../src/framework/frameworkAPI'
import * as _ from 'lodash';
import * as proxy from 'express-http-proxy';
import { decorateRequestHeaders } from './proxyUtils'
import * as nodeURL from 'url';
import * as dateFormat from 'dateformat';
import * as uuidv1 from 'uuid/v1';

const ReqAuth = FrameworkAPI.getService('RequestAuthenticator');

export class PluginRoutes {

    static proxyToLearnerService() {
        return proxy(envVariables.LEARNER_URL, {
            limit: '30mb',
            proxyReqOptDecorator: decorateRequestHeaders(),
            proxyReqPathResolver: function (req) {
                let urlParam = req.params['0']
                let query = nodeURL.parse(req.url).query
                if (query) {
                    return nodeURL.parse(envVariables.LEARNER_URL + urlParam + '?' + query).path
                } else {
                    return nodeURL.parse(envVariables.LEARNER_URL + urlParam).path
                }
            }
        })
    }

    static verifyTokenMiddleware(req, res, next) {
        console.log(PluginRoutes.getUserToken(req));
        ReqAuth.verfiy(PluginRoutes.getUserToken(req), (err, validToken) => {
            if (validToken) {
                next();
            } else {
                res.status(440).send({
                    'id': 'api.error',
                    'ver': '1.0',
                    'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'),
                    'params': {
                        'resmsgid': uuidv1(),
                        'msgid': null,
                        'status': 'failed',
                        'err': 'LOGIN_TIMEOUT',
                        'errmsg': 'Session Expired'
                    },
                    'responseCode': 'LOGIN_TIMEOUT',
                    'result': {}
                });
            }
        })
    }

    private static getUserToken(requestObj) {
        return _.get(requestObj, 'kauth.grant.access_token.token') || _.get(requestObj, "headers['x-authenticated-user-token']")
    }
}




