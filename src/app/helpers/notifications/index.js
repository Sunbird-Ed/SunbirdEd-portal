let express = require('express')
let router = express.Router()
const Response = require('./responseHelper.js')
let HttpStatus = require('http-status-codes')
let notificationController = require('./controller.js');


router.post('/pull', validateRequestObj, function(req, resp) {
    notificationController.pull(req, function(err, data) {
        if (err) return Response.error(resp, err.message, err.httpCode);
        if (data) return Response.success(resp, 'pull', data, HttpStatus.OK);
    });
});


router.post('/create', validateRequestObj, function(req, resp) {
    notificationController.create(req, function(err, data) {
        if (err) return Response.error(resp, err.message, err.httpCode);
        if (data) return Response.success(resp, 'create', data, HttpStatus.CREATED)
    });
});


function validateRequestObj(requestObj, responseObj, cb) {
    if (typeof requestObj.body !== 'object' || typeof requestObj.body.request !== 'object') return Response.error(responseObj, 'Invalid request structure', HttpStatus.BAD_REQUEST)
    cb();
}

module.exports = router