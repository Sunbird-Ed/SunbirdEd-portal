const proxyUtils        = require('../proxy/proxyUtils.js')
const envHelper         = require('../helpers/environmentVariablesHelper.js')
const learnerURL        = envHelper.LEARNER_URL
const telemetryHelper   = require('../helpers/telemetryHelper.js')
const proxy             = require('express-http-proxy')
const bodyParser        = require('body-parser')
const healthService     = require('../helpers/healthCheckService.js')
const { decrypt }       = require('../helpers/crypto');
const isAPIWhitelisted  = require('../helpers/apiWhiteList');
const googleService     = require('../helpers/googleService')
const reqDataLimitOfContentUpload = '50mb'
const { logger } = require('@project-sunbird/logger');
const {parseJson, isDateExpired, decodeNChkTime} = require('../helpers/utilityService');
const _ = require('lodash');
const fs = require('fs')
const path = require('path')

const telemtryEventConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '../helpers/telemetryEventConfig.json')))

module.exports = function (app) {
  require('./accountRecoveryRoute.js')(app) // account recovery route
// module.exports = function (app) {
  app.post('/learner/course/v1/attendance/read', proxyObj());
  app.post('/learner/course/v1/attendance/webhook/bigbluebutton', proxyObj());
}

function proxyObj (){
  console.log("learnerURL=======",learnerURL);
    return proxy(learnerURL, {
      limit: reqDataLimitOfContentUpload,
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(learnerURL),
      proxyReqPathResolver: function (req) {
        return req.originalUrl;
      },
    //   userResDecorator: function (proxyRes, proxyResData,  req, res) {
        
    //     try {
    //       logger.info({msg: 'proxyObj'});
    //       // let data = JSON.parse(proxyResData.toString('utf8'));
    //     let data = proxyResData.toString('utf8');
    //       // let response = data.result.response;
    //       // data.result.response = {id: '', rootOrgId: '',isUserExists:''};
    //       // if (data.responseCode === 'OK') {
    //       //   data.result.response.id = response.id;
    //       //   data.result.response.rootOrgId = response.rootOrgId;
    //       //   data.result.response.isUserExists = true;
    //       // }
    //       console.log('------------',data);
    //       return data;
    //       // if(req.method === 'GET' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
    //       // else return proxyUtils.handleSessionExpiry(proxyRes, data, req, res, data);
    //     } catch (err) {
    //       console.log('=========',err);
    //       return err;
    //       // logger.error({msg:'learner route : userResDecorator json parse error:', proxyResData})
    //       // return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res);
    //     }
    //   }
    // });
    userResDecorator: (proxyRes, proxyResData, req, res) => {
      try {
          logger.info({ msg: 'proxyObj' + req.method + ' - ' + req.url });
          console.log('++++++++++++++++++',proxyResData.toString('utf8'));
          const data = JSON.parse(proxyResData.toString('utf8'));
          console.log('------------',data);
          if (req.method === 'GET' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
          else return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res, data);
      } catch (err) {
          logger.error({ msg: 'Error occurred while featching the data' });
          return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res);
      }
  }
})
       
  }
