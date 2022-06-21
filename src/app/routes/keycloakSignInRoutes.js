const bodyParser = require('body-parser');
const envHelper = require('../helpers/environmentVariablesHelper.js');
const request = require('request-promise');
var qs = require('querystring');
var DOMParser = require('xmldom').DOMParser;
const parser = new DOMParser();

module.exports = (app) => {
  app.post('/keycloak/login', bodyParser.json(), async (req, res) => {
    const userName = req.body.emailId;
    const pswd = req.body.password;
    let redirect_uri = "";
    let queryArr = [];
    (req.body.loginConfig.params).forEach(item => {
      if (item['key'] == 'redirect_uri') {
        redirect_uri = item['value'];
      }
      queryArr.push((Object.values(item)))
    });
    const opt = {
      method: 'POST',
      url: req.body.loginConfig.host+req.body.loginConfig.path,
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
        "accept": "application/x-www-form-urlencoded, multipart/form-data,text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9"
      },
      form: qs.stringify(Object.fromEntries(queryArr))
    };
    request(opt, ((err, response, data) => {
      if (!err && response.statusCode == 200) {
        var htmlObject = parser.parseFromString(data, 'text/html');
        let ele = htmlObject.getElementById("kc-form-login");
        const loginOpt = {
          method: 'POST',
          url: ele.getAttribute('action'),
          headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'Content-Type': 'application/x-www-form-urlencoded',
            "Cookie": response.headers['set-cookie'].toString(),
            'Referer': response.request.href + '?' + response.request.body
          },
          form: {
            username: userName,
            password: pswd
          }
        };
        request(loginOpt, ((e, resp, dataObj) => {
            if (e) {
              res.error(err + dataObj);
            } else if (resp.statusCode == 302 && dataObj == "") {
              let code = resp.headers.location.split('=');
                const options2 = {
                method: 'POST',
                url: `${envHelper.PORTAL_AUTH_SERVER_URL}/realms/${envHelper.PORTAL_REALM}/protocol/openid-connect/token`,
                headers: {
                  "Content-type": "application/x-www-form-urlencoded",
                },
                form: qs.stringify({
                  redirect_uri: redirect_uri,
                  code: code[code.length - 1],
                  grant_type: 'authorization_code',
                  client_id: req.body.client_id
                })
              };
              request(options2, ((err, response, data) => {
                if (!err && response.statusCode == 200) {
                  res.status(response.statusCode).send(data)
                } else {
                  res.error(err);
                }
              }));
            } else {
              var errObj = parser.parseFromString(dataObj, 'text/html');
              let err_res = errObj.getElementById("error-summary").textContent;
              err_res.replace(/\\\n/g, '');
              res.status(resp.statusCode).send({error_msg: err_res.trim()});
            }
          }))
      } else {
        res.status(response.statusCode).send(err + data);
      }
    }))
  });
}