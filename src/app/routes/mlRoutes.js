/**
 * @file
 * @description - ML routes handler
 * @version 1.0
 */
const proxyUtils = require('../proxy/proxyUtils.js')
const envHelper = require('../helpers/environmentVariablesHelper.js')
const mlURL = envHelper.ML_SERVICE_BASE_URL
const telemetryHelper = require('../helpers/telemetryHelper.js')
const proxy = require('express-http-proxy')
const bodyParser = require('body-parser')
const healthService = require('../helpers/healthCheckService.js')
const isAPIWhitelisted = require('../helpers/apiWhiteList');
const reqDataLimitOfContentUpload = '50mb'
const { logger } = require('@project-sunbird/logger');
const request = require('request');
// import * as fs from "fs";
const fs = require('fs');
const multiparty = require('multiparty');

module.exports = function (app) {

  app.all('/kendra/*',
    bodyParser.json(),
    isAPIWhitelisted.isAllowed(),
    healthService.checkDependantServiceHealth([]),
    telemetryHelper.generateTelemetryForLearnerService,
    telemetryHelper.generateTelemetryForProxy,
    handleRequest('/kendra/api/')
  )

  app.all('/assessment/*',
    bodyParser.json(),
    isAPIWhitelisted.isAllowed(),
    healthService.checkDependantServiceHealth([]),
    telemetryHelper.generateTelemetryForLearnerService,
    telemetryHelper.generateTelemetryForProxy,
    handleRequest('/assessment/api/')
  )

  app.put('/cloudUpload/*', async (req, res) => {
    debugger
    const form = new multiparty.Form();
    form.parse(req, function (err, fields, files) {
      console.log(fields.url)
      // console.log(JSON.parse(fields.url))
      console.log(JSON.stringify(fields.url[0]))
      console.log(files['file'][0]['path'])
      let writer = fs.createWriteStream(files['file'][0]['path'], files['file'][0]['originalFilename']) 
      debugger

      // fs.createReadStream(files['file'][0]['path']).pipe(() => {
      //   const options = {
      //     url: fields.url[0],
      //     headers: {
      //       "x-ms-blob-type":"BlockBlob"
      //     }
      //   };

      //   request(options, (error, response, body) => {
      //     debugger
      //   });
      // })

      // fs.createReadStream(files['file'][0]['path']).pipe(request.put({
      //   url: fields.url[0],
      //   headers: {
      //     "x-ms-blob-type":"BlockBlob"
      //   },
      // }, (err, httpResponse, body) => {
      //   debugger
      // })
      // .on('response', function (response) {
      //   debugger
      //   console.log(response.statusCode) // 200
      //   console.log(response.headers['content-type']) // 'image/png'
      // }).on('error', function (err) {
      //   debugger
      //   console.error(err)
      // })
      // )
   
      let formData = request.put(fields.url[0], {
        headers: {
          "x-ms-blob-type": "BlockBlob"
        }
      }, (err, response) => {
        debugger
        const data = fs.createReadStream(files['file'][0]['path'])
        debugger
      });
      let form = formData.form();
      // form.append("filePath",filePath);
      // form.append("bucketName",bucketName);
      form.append("attachment", fs.createReadStream(files['file'][0]['path']));







      // request.put(fields.url[0],{
      //   // url: fields.url[0], 
      //   body: fs.createReadStream(files['file'][0]['path']),
      //   //  json:false,
      //   headers: {
      //     "x-ms-blob-type": "BlockBlob",
      //     // "x-ms-original-content-length":files['file'][0].size
      //   },
      //   // multipart:[
      //   //   {
      //   //     // "x-ms-blob-type": "BlockBlob",
      //   //     body: fs.createReadStream(files['file'][0]['path'])
      //   //   }
      //   // ]
      // }, function optionalCallback(err, httpResponse, body) {
      //   debugger
      //   if (err) {
      //     return console.error('upload failed:', err);
      //   }
      //   console.log('Upload successful!  Server responded with:', body);
      // });
    });
    //   request({
    //     method: 'PUT',
    //     // preambleCRLF: true,
    //     // postambleCRLF: true,
    //     uri: req.body.url,
    //     // multipart: [
    //     //   {
    //     //     'content-type': 'application/json',
    //     //     body: JSON.stringify({foo: 'bar', _attachments: {'message.txt': {follows: true, length: 18, 'content_type': 'text/plain' }}})
    //     //   },
    //     //   { body: 'I am an attachment' },
    //     //   { body: fs.createReadStream('image.png') }
    //     // ],
    //     // alternatively pass an object containing additional options
    //     multipart: {
    //       chunked: false,
    //       data: [
    //         {
    //           'content-type': 'multipart/form-data',
    //           "x-ms-blob-type":"BlockBlob",
    //           body: JSON.stringify(req.body.data) 
    //         }
    //       ]
    //     }
    //   },
    //   function (error, response, body) {
    //     debugger
    //     if (error) {
    //       return console.error('upload failed:', error);
    //     }
    //     console.log('Upload successful!  Server responded with:', body);
    //   })




    debugger

    // request.put({ url: req.body.url, formData:req.body,   
    //   headers: {
    //     // "Content-Type": "multipart/form-data",
    //     "x-ms-blob-type":"BlockBlob"
    // } }, function optionalCallback(err, httpResponse, body) {
    //   debugger
    //   if (err) {
    //     return console.error('upload failed:', err);
    //   }
    //   console.log('Upload successful!  Server responded with:', body);
    // });







    // fs.writeFileSync('./sample', req.body.data);
    // debugger
  })

  // cloudeImageUpload(),() => {
  //   debugger
  // })
  // desktopAppHelper.getAppUpdate(), () => {
  //     logger.info({msg: '/v1/desktop/update called'});
  // })

  // app.all('/cloudUpload/*',
  //   bodyParser.json(),
  //   isAPIWhitelisted.isAllowed(),
  //   healthService.checkDependantServiceHealth([]),
  //   telemetryHelper.generateTelemetryForLearnerService,
  //   telemetryHelper.generateTelemetryForProxy,
  //   // handleRequest('/assessment/api/')
  //   proxy(mlURL, {
  //     limit: reqDataLimitOfContentUpload,
  //     proxyReqOptDecorator: function(req) {
  //        req.headers = {
  //          'Content-Type':'multipart/form-data'
  //        }
  //       return req
  //       debugger
  //     },
  //     proxyReqBodyDecorator: function(body){
  //       return body.data
  //       debugger
  //     },
  //     proxyReqPathResolver: function (req) {
  //       let urlParam = encodeURI(req.body['url']);
  //       console.log(urlParam)
  //       return urlParam
  //       // let query = require('url').parse(req.url).query
  //       // logger.info({ msg: '==============================/ML_URL/* ===================================called - ' + mlURL + req.method + ' - ' + req.url });
  //       // if (query) {
  //       //   const url = require('url').parse(mlURL + serviceUrl + urlParam + '?' + query).path;
  //       //   return url
  //       // } else {
  //       //   const url = require('url').parse(mlURL + serviceUrl + urlParam).path
  //       //   return url
  //       // }
  //     },
  //     userResDecorator: (proxyRes, proxyResData, req, res) => {
  //       try {
  //         const parsedData = JSON.parse(proxyResData.toString('utf8'));
  //         if (proxyRes.statusCode === 404) res.redirect('/')
  //         else {
  //           const data = proxyUtils.handleSessionExpiry(proxyRes, parsedData, req, res);
  //           data.status === 200 ? data.responseCode = "OK" : null;
  //           return data
  //         }
  //       } catch (err) {
  //         logger.error({ msg: 'ML route : userResDecorator json parse error:', proxyResData, error: JSON.stringify(err) })
  //         return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res);
  //       }
  //     }
  //   })
  // )
}

function handleRequest(serviceUrl) {
  return proxy(mlURL, {
    limit: reqDataLimitOfContentUpload,
    proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(mlURL),
    proxyReqPathResolver: function (req) {
      let urlParam = req.params['0']
      let query = require('url').parse(req.url).query
      logger.info({ msg: '==============================/ML_URL/* ===================================called - ' + mlURL + req.method + ' - ' + req.url });
      if (query) {
        const url = require('url').parse(mlURL + serviceUrl + urlParam + '?' + query).path;
        return url
      } else {
        const url = require('url').parse(mlURL + serviceUrl + urlParam).path
        return url
      }
    },
    userResDecorator: (proxyRes, proxyResData, req, res) => {
      try {
        const parsedData = JSON.parse(proxyResData.toString('utf8'));
        if (proxyRes.statusCode === 404) res.redirect('/')
        else {
          const data = proxyUtils.handleSessionExpiry(proxyRes, parsedData, req, res);
          data.status === 200 ? data.responseCode = "OK" : null;
          return data
        }
      } catch (err) {
        logger.error({ msg: 'ML route : userResDecorator json parse error:', proxyResData, error: JSON.stringify(err) })
        return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res);
      }
    }
  })
}
