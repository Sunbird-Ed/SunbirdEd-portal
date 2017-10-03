const request = require("request"),
        envHelper = require('./environmentVariablesHelper.js'),
        learnerURL = envHelper.LEARNER_URL,
        learner_authorization = envHelper.PORTAL_API_AUTH_TOKEN;


module.exports = {
    updateLoginTime: function (req, callback) {
        var data = this.prepareRequestBody(req);
        this.sendUpdateTimeReq(req, data, function (status) {
            callback(null, status);
        });
    },
    prepareRequestBody: function (req) {
        var userId = req.kauth.grant.access_token.content.sub;
        var token = req.kauth.grant.access_token.token;
        var data = {
            "params": {},
            "request": {"userId": userId}
        };
        return data;
    },
    sendUpdateTimeReq: function (req,token, data, callback) {
        var options = {
            method: 'PATCH',
            url: learnerURL + 'user/v1/update/logintime',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ learner_authorization,
                'x-authenticated-user-token': token
            },
            body: data,
            json: true
        };
        request(options, function (error, response, body) {
            console.log(options,"\n",body);
            if (callback) {
                if (error) {
                    callback(false);
                } else if (body && body.params && body.params.err) {
                    callback(false);
                } else {
                    callback(true);
                }
            }
        });
    }
}