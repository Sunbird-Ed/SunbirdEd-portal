const bodyParser = require('body-parser');
const envHelper = require('../helpers/environmentVariablesHelper.js');
const request = require('request-promise');
var qs = require('querystring');
var DOMParser = require('xmldom').DOMParser;
const parser = new DOMParser();
const { logger } = require('@project-sunbird/logger');

module.exports = (app) => {
  app.post('/keycloak/login', bodyParser.json(), async (req, res) => {
    let config = req.body.loginConfig;
    let formData = {
      username: req.body.emailId,
      password: req.body.password
    }
    let redirect_uri = "";
    let queryArr = [];
    (config.params).forEach(item => {
      if (item['key'] == 'redirect_uri') {
        redirect_uri = item['value'];
      }
      queryArr.push((Object.values(item)))
    });
    let reqOption = getRequestOptions(config.host+config.path, getHeaders(), qs.stringify(Object.fromEntries(queryArr)));
    request(reqOption, ((err, response, data) => {
      if (!err && response.statusCode == 200) {
        logger.info({msg: 'keyclaok Signin route: initialized ' + reqOption.method + reqOption.url})
        var htmlObject = parser.parseFromString(data, 'text/html');
        let ele = htmlObject.getElementById("kc-form-login");
        let loginUrl = ele.getAttribute('action');
        let loginOption = getRequestOptions(loginUrl, getHeaders(response.headers['set-cookie'].toString(), response.request.href+'?'+response.request.body), formData)
        request(loginOption, ((e, resp, dataObj) => {
          if (e) {
            logger.error({msg: 'keyclaok Signin route : login failed ' + resp.statusCode + dataObj + 'error:'+ JSON.stringify(e)})
            res.error(e + dataObj);
          } else if (resp.statusCode == 302 && dataObj == "") {
            logger.info({msg: 'keyclaok Signin route : successfully login with a keycloak user'});
            let code = resp.headers.location.split('=');
            let reqTokenOption = getRequestOptions(`${envHelper.PORTAL_AUTH_SERVER_URL}/realms/${envHelper.PORTAL_REALM}/protocol/openid-connect/token`, 
              getHeaders(), qs.stringify({redirect_uri: redirect_uri, code: code[code.length - 1], grant_type: 'authorization_code',client_id: req.body.client_id}))
            request(reqTokenOption, ((err, response, data) => {
              if (!err && response.statusCode == 200) {
                logger.info({msg: 'keyclaok Signin route : generated access token and refresh token - login sucessful'});
                res.status(response.statusCode).send(data)
              } else {
                logger.error({msg: 'keyclaok Signin route : error while getting access token ' + resp.statusCode + ' error: ' + JSON.parse(data)})
                res.send(JSON.parse(data));
              }
            }));
          } else {
            if (resp.statusCode == 200) {
              let errMsg = extractErrorMsg(dataObj, "error-summary");
              logger.error({msg: 'keyclaok Signin route : validation error ' + resp.statusCode + ' error: ' + errMsg.trim()});
              res.status(resp.statusCode).send({error_msg: errMsg.trim()});
            } else {
              let errMsg = extractErrorMsg(dataObj, "kc-error-message");
              logger.error({msg: 'keyclaok Signin route : error on Keyclaok login ' + resp.statusCode + ' error: ' + errMsg.trim()});
              res.status(resp.statusCode).send({error_msg: errMsg.trim()});
            }
          }
        }))
      } else {
        let errMsg = extractErrorMsg(data, "kc-error-message");
        logger.error({ msg: 'keyclaok Signin route : initialize keyclaok error: '+ response.statusCode, data, error: errMsg.trim() });
        res.status(response.statusCode).send({error_msg: errMsg.trim()});
      }
    }))
  });

  function extractErrorMsg(data, id) {
    let errObj = parser.parseFromString(data, 'text/html');
    let err_res = errObj.getElementById(id).textContent;
    err_res.replace(/\\\n/g, '');
    return err_res;
  }
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