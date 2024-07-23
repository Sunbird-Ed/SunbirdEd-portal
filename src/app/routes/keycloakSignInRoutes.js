const bodyParser = require('body-parser');
const envHelper = require('../helpers/environmentVariablesHelper.js');
const request = require('request-promise');
const qs = require('querystring');
const DOMParser = require('@xmldom/xmldom').DOMParser;
const parser = new DOMParser();
const { logger } = require('@project-sunbird/logger');
const _ = require('lodash');

let formData = {
  username: "",
  password: ""
}
let redirect_uri = "";
let client_id = "";

module.exports = (app) => {
  app.post('/keycloak/login', bodyParser.json(), async (req, res) => {
    if(_.get(req, 'body.loginConfig')) {
      let config = _.get(req, 'body.loginConfig');
      client_id = _.get(req, 'body.client_id');
      formData.username = _.get(req, 'body.emailId');
      formData.password = _.get(req, 'body.password');
      let queryArr = [];
      (config.params).forEach(item => {
        let arr = [];
        if (item['key'] == 'redirect_uri') {
          redirect_uri = item['value'];
        }
        arr.push(item['key'])
        arr.push(item['value']);
        queryArr.push(arr)
      });
      let reqOption = getRequestOptions(config.host+config.path, getHeaders(), qs.stringify(Object.fromEntries(queryArr)));
      handleRequest(reqOption, "reqLogin", res);
    } else {
      logger.info({msg: 'Keycloak Signin route: Cannot read a Property of undefined'})
      res.send('Cannot read property of undefined');
    }
  });
}

function handleRequest(option, type, res) {
  request(option, ((err, response, data) => {
    if(!err && (_.get(response, 'statusCode') == 200)) {
      handleSuccessResponse(option, response, data, type, res);
    } else {
      handleResponse(err, response, data, type, res);
    }
  }))
}

function handleSuccessResponse(option, response, data, type, res) {
  if(type == "reqLogin") {
    logger.info({msg: 'keyclaok Signin route: initialized ' + option.method + option.url})
    let htmlObject = parser.parseFromString(data, 'text/html');
    let ele = htmlObject.getElementById("kc-form-login");
    let loginUrl = ele.getAttribute('action');
    let header = _.get(response, 'headers');
    let request = _.get(response, 'request');
    let loginOption = getRequestOptions(loginUrl, getHeaders(header['set-cookie'].toString(), request.href+'?'+request.body), formData)
    handleRequest(loginOption, "reqData", res);
  } else if(type == "reqData") {
    let errMsg = extractErrorMsg(data, "error-summary");
    logger.error({msg: 'keyclaok Signin route : validation error ' + _.get(response, 'statusCode') + ' error: ' + errMsg.trim()});
    res.status(_.get(response, 'statusCode')).send({error_msg: errMsg.trim()});
  } else {
    logger.info({msg: 'keyclaok Signin route : generated access token and refresh token - login sucessful'});
    res.status(_.get(response, 'statusCode')).send(data)
  }
}

function handleResponse(err, response, data, type, res) {
  if(type == "reqLogin") {
    let errMsg = extractErrorMsg(data, "kc-error-message");
    logger.error({ msg: 'keyclaok Signin route : initialize keyclaok error: '+ _.get(response, 'statusCode'), error: errMsg.trim() });
    res.status(_.get(response, 'statusCode')).send({error_msg: errMsg.trim()});
  } else if(type == "reqData") {
    if (err) {
      logger.error({msg: 'keyclaok Signin route : login failed ' + _.get(response, 'statusCode') + 'error:'+ JSON.stringify(err)})
      res.error(err + data);
    } else if ((_.get(response, 'statusCode') == 302) && data == "") {
      logger.info({msg: 'keyclaok Signin route : successfully login with a keycloak user'});
      let code = _.get(response, 'headers').location.split('=');
      let reqTokenOption = getRequestOptions(`${envHelper.PORTAL_AUTH_SERVER_URL}/realms/${envHelper.PORTAL_REALM}/protocol/openid-connect/token`, 
      getHeaders(), qs.stringify({redirect_uri: redirect_uri, code: code[code.length - 1], grant_type: 'authorization_code',client_id: client_id}))
      handleRequest(reqTokenOption, 'reqToken', res);
    } else {
      let errMsg = extractErrorMsg(data, "kc-error-message");
      logger.error({msg: 'keyclaok Signin route : error on Keyclaok login ' + _.get(response, 'statusCode') + ' error: ' + errMsg.trim()});
      res.status(_.get(response, 'statusCode')).send({error_msg: errMsg.trim()});
    }
  } else {
    logger.error({msg: 'keyclaok Signin route : error while getting access token ' + _.get(response, 'statusCode') + 'error'})
    if(data) {
      try {
        let resData = JSON.parse(data);
        res.send(resData);
      }
      catch(err) {
        res.send(data);
      }
    }
  }
}

function extractErrorMsg(data, id) {
  let errObj = parser.parseFromString(data, 'text/html');
  let err_res = errObj.getElementById(id).textContent;
  err_res.replace(/\\\n/g, '');
  return err_res;
}

function getHeaders(cookie, referer) {
  return {
    "Content-type": "application/x-www-form-urlencoded",
    "Accept": "application/x-www-form-urlencoded, multipart/form-data,text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "Cookie": cookie,
    'Referer': referer
  } 
}

function getRequestOptions(url, header, formData) {
  return {
    method: 'POST',
    url: url,
    headers: header,
    form: formData
  }
}