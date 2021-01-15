import * as _ from "lodash";
import Response from "./../utils/response";
import { manifest } from "./../manifest";
import AuthController from "../controllers/authController";
import { containerAPI } from '@project-sunbird/OpenRAP/api';
import { logger } from '@project-sunbird/logger';
const proxy = require('express-http-proxy');
const uuidv1 = require('uuid/v1');
import { decorateRequestHeaders, handleSessionExpiry } from "../helper/proxyUtils";
import { ILoggedInUser } from '../../OpenRAP/interfaces/IUser';

export default (app, proxyURL) => {

    const authController = new AuthController(manifest);
    app.post(
        "/api/user/v1/startSession", authController.startUserSession.bind(authController),
    );

    app.get("/learner/user/v3/read/:id", proxy(proxyURL, {
            proxyReqOptDecorator: decorateRequestHeaders(proxyURL),
            proxyReqPathResolver(req) {
                return `${proxyURL}${req.originalUrl.replace('/learner/', '/api/')}`;
            },
            proxyErrorHandler: function (err, res, next) {
                logger.warn(`While /user/v3/read from online`, err);
                next();
            },
            userResDecorator: function (proxyRes, proxyResData, req, res) {
                return new Promise(async function (resolve) {
                    try {
                        const userResp = JSON.parse(proxyResData.toString('utf8'));
                        if (userResp.responseCode === 'OK' && _.get(userResp, 'result.response')) {
                            const userSDK = containerAPI.getUserSdkInstance();
                            let user = userResp.result.response;
                            const userToken = userSDK.getUserToken();
                            user.accessToken = userToken;
                            await userSDK.insertLoggedInUser(user);
                        }
                    } catch (error) {
                        logger.error(`Unable to parse or do DB update of user data after fetching from online`, error)
                    }
                    resolve(proxyResData);
                });
            }
        }), async (req, res) => {
            logger.debug(`Received API call to read User data`);
            const userSDK = containerAPI.getUserSdkInstance();
            const user = await userSDK.getLoggedInUser(req.params.id);
            res.send(Response.success("api.user.read", { response: user }, req));
        }
    );

    app.get(
        ["/learner/user/v1/feed/:userId", "/learner/certreg/v2/certs/download/:id"],
        proxy(proxyURL, {
        proxyReqOptDecorator: decorateRequestHeaders(proxyURL),
        proxyReqPathResolver(req) {
            logger.debug({ msg: `${req.originalUrl}  called` });
            return `${proxyURL}${req.originalUrl.replace('/learner/', '/api/')}`;
        },
        userResDecorator: function (proxyRes, proxyResData, req, res) {
            try {
                const data = JSON.parse(proxyResData.toString('utf8'));
                if (req.method === 'GET' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
                else return handleSessionExpiry(proxyRes, proxyResData, req, res, data);
            } catch (err) {
                logger.error({ msg: 'learner route : userResDecorator json parse error:', proxyResData, error: JSON.stringify(err) })
                return handleSessionExpiry(proxyRes, proxyResData, req, res);
            }
        }
    }));

    app.patch(['/learner/user/v1/update', '/learner/user/v1/declarations'], proxy(proxyURL, {
        proxyReqOptDecorator: decorateRequestHeaders(proxyURL),
        proxyReqPathResolver: (req) => {
            logger.debug({ msg: `${req.originalUrl}  called` });
            return `${proxyURL}${req.originalUrl.replace('/learner/', '/api/')}`;
        },
        userResDecorator: (proxyRes, proxyResData, req, res) => {
            try {
                logger.info({ msg: `${req.originalUrl} update called` });
                const data = JSON.parse(proxyResData.toString('utf8'));
                if (req.method === 'GET' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
                else return handleSessionExpiry(proxyRes, proxyResData, req, res, data);
            } catch (err) {
                logger.error({ msg: 'learner route : userResDecorator json parse error:', proxyResData });
                return handleSessionExpiry(proxyRes, proxyResData, req, res);
            }
        }
    }));

    app.get('/learner/user/v1/managed/*', proxy(proxyURL, {
        proxyReqOptDecorator: decorateRequestHeaders(proxyURL),
        proxyReqPathResolver: function (req) {
          let urlParam = req.originalUrl.replace('/learner/', '/api/');
          let query = require('url').parse(req.url).query;
          if (query) {
            return require('url').parse(proxyURL + urlParam + '?' + query).path
          } else {
            return require('url').parse(proxyURL + urlParam).path
          }
        },
        proxyErrorHandler: function (err, res, next) {
          logger.warn(`While /user/v3/read from online`, err);
          next();
        },
        userResDecorator: async (proxyRes, proxyResData, req, res) => {
          try {
            let data = JSON.parse(proxyResData.toString('utf8'));
            _.forEach(_.get(data.result.response, 'content'), (managedUser, index) => {
              if (managedUser.managedToken) {
                delete data.result.response.content[index].managedToken
              }
            });
            if (req.method === 'GET' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
            else return handleSessionExpiry(proxyRes, data, req, res, data);
          } catch (err) {
            logger.error({ msg: 'learner route : userResDecorator json parse error:', proxyResData })
            return handleSessionExpiry(proxyRes, proxyResData, req, res);
          }
        }
    }), async (req, res) => {
      logger.debug(`Received API call to read User data`);
      const userSDK = containerAPI.getUserSdkInstance();
      let users: any = await userSDK.getAllManagedUsers();
      users = _.orderBy(users, ['createdDate'], ['desc'])
      res.send(Response.success("api.user.managed", { response: { content: users, count: users.length } }, req));
    });
   
    app.get('/learner/isUserExists/user/v1/get/phone/*', proxyObj());
    app.get('/learner/isUserExists/user/v1/get/email/*', proxyObj());

    app.post([
        "/learner/otp/v1/generate", 
        "/learner/otp/v1/verify", 
        "/learner/user/v1/consent/read",
        "/learner/user/v1/tnc/accept"
    ], proxy(proxyURL, {
        proxyReqOptDecorator: decorateRequestHeaders(proxyURL),
        proxyReqPathResolver(req) {
            logger.debug({ msg: `${req.originalUrl}  called` });
            return `${proxyURL}${req.originalUrl.replace('/learner/', '/api/')}`;
        },
        userResDecorator: function (proxyRes, proxyResData, req, res) {
            try {
                const data = JSON.parse(proxyResData.toString('utf8'));
                if (req.method === 'POST' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
                else return handleSessionExpiry(proxyRes, proxyResData, req, res, data);
            } catch (err) {
                logger.error({ msg: 'learner route : userResDecorator json parse error:', proxyResData, error: JSON.stringify(err) })
                return handleSessionExpiry(proxyRes, proxyResData, req, res);
            }
        }
    }));
  
    app.post("/learner/user/v4/create", proxy(proxyURL, {
        proxyReqOptDecorator: decorateRequestHeaders(proxyURL),
        proxyReqPathResolver(req) {
            logger.debug({ msg: `${req.originalUrl}  called` });
            return `${proxyURL}${req.originalUrl.replace('/learner/', '/api/')}`;
        },
        userResDecorator: async (proxyRes, proxyResData, req, res) => {
            try {
                const data = JSON.parse(proxyResData.toString('utf8'));
                const userSDK: any = containerAPI.getUserSdkInstance();
                const userId = _.get(data, 'result.userId');
                const userToken: string = await userSDK.getUserToken().catch(error => { logger.debug("Unable to get the user token", error); })
                const user: ILoggedInUser = {
                    id: userId,
                    userId,
                    identifier: userId,
                    firstName: _.get(req, 'body.request.firstName'),
                    accessToken: userToken
                }
                await authController.saveUserInDB(user);
                await authController.setUserSession(userId);
                if (req.method === 'POST' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
                else return handleSessionExpiry(proxyRes, proxyResData, req, res, data);
            } catch (err) {
                logger.error({ msg: 'Error while creating managed user', proxyResData, error: JSON.stringify(err) })
                return handleSessionExpiry(proxyRes, proxyResData, req, res);
            }
        }
    }));

  app.get('/user/v1/switch/:userId', async (req, res) => {
    const userSDK = containerAPI.getUserSdkInstance();
    if (!req.params.userId) {
      logger.info({ msg: 'switch user rejected missing userID' });
      res.status(400).send(Response.error("api.user.switch", 400, "failed to switch user", "BAD_REQUEST"));
    }

    try {
      const sessionData = { userId: req.params.userId, sessionId: uuidv1() };
      await userSDK.setUserSession(sessionData);
      const result = {
        response: "Success",
        userSid: sessionData.sessionId
      }
      res.status(200).send(Response.success("api.user.switch", result, req));
    } catch (error) {
      logger.error({ msg: "Error while switching user", error });
      res.status(500).send(Response.error("api.user.switch", 500, "failed to switch user"));
    }
  });

    function proxyObj (){
        return proxy(proxyURL, {
          proxyReqOptDecorator: decorateRequestHeaders(proxyURL),
          proxyReqPathResolver: function (req) {
            let urlParam = req.originalUrl.replace('/learner/', '/api/')
            let query = require('url').parse(req.url).query
            if (urlParam.indexOf('isUserExists') > -1) urlParam = urlParam.replace('isUserExists/', '');
            if (query) {
              return require('url').parse(proxyURL + urlParam + '?' + query).path
            } else {
              return require('url').parse(proxyURL + urlParam).path
            }
          },
          userResDecorator: function (proxyRes, proxyResData,  req, res) {
            try {
              logger.info({msg: 'proxyObj'});
              let data = JSON.parse(proxyResData.toString('utf8'));
              let response = data.result.response;
              data.result.response = {id: '', rootOrgId: '',isUserExists:''};
              if (data.responseCode === 'OK') {
                data.result.response.id = response.id;
                data.result.response.rootOrgId = response.rootOrgId;
                data.result.response.isUserExists = true;
              }
              if(req.method === 'GET' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
              else return handleSessionExpiry(proxyRes, data, req, res, data);
            } catch (err) {
              logger.error({msg:'learner route : userResDecorator json parse error:', proxyResData})
              return handleSessionExpiry(proxyRes, proxyResData, req, res);
            }
          }
        });
    }
}