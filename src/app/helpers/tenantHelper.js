const fs = require('fs'),
  path = require('path'),
  async = require('async'),
  envHelper = require('./environmentVariablesHelper.js'),
  default_tenant = envHelper.DEFAUULT_TENANT;

module.exports = {
  getInfo: function(req, res) {
    var tenantId = req.params.tenantId || envHelper.DEFAUULT_TENANT;
    var responseObj = {
      logo: (req.get('X-Forwarded-Protocol') || req.protocol) + '://' + req.get('host') + '/images/sunbird_logo.png',
      favicon: (req.get('X-Forwarded-Protocol') || req.protocol) + '://' + req.get('host') +'/images/favicon.ico',
      poster: (req.get('X-Forwarded-Protocol') || req.protocol) + '://' + req.get('host') +'/images/sunbird_logo.png',
    }
    //TODO: make file checking async for performance
    if (tenantId) {
      if (fs.existsSync(path.join(__dirname, '../tenant', tenantId, 'logo.png'))) {
        responseObj.logo = (req.get('X-Forwarded-Protocol') || req.protocol) + '://' + req.get('host') + '/tenant/' + tenantId + '/logo.png';
      }else if (default_tenant && fs.existsSync(path.join(__dirname, '../tenant', default_tenant, 'logo.png'))) {
        responseObj.logo = (req.get('X-Forwarded-Protocol') || req.protocol) + '://' + req.get('host') + '/tenant/' + default_tenant + '/logo.png';
      }
      if (fs.existsSync(path.join(__dirname, '../tenant', tenantId, 'favicon.ico'))) {
        responseObj.favicon = (req.get('X-Forwarded-Protocol') || req.protocol) + '://' + req.get('host') + '/tenant/' + tenantId + '/favicon.ico';
      }else if (default_tenant && fs.existsSync(path.join(__dirname, '../tenant', default_tenant, 'favicon.ico'))) {
        responseObj.favicon = (req.get('X-Forwarded-Protocol') || req.protocol) + '://' + req.get('host') + '/tenant/' + default_tenant + '/favicon.ico';
      }
      if (fs.existsSync(path.join(__dirname, '../tenant', tenantId, 'poster.png'))) {
        responseObj.poster = (req.get('X-Forwarded-Protocol') || req.protocol) + '://' + req.get('host') + '/tenant/' + tenantId + '/poster.png';
      }else if (default_tenant && fs.existsSync(path.join(__dirname, '../tenant', default_tenant, 'poster.png'))) {
        responseObj.poster = (req.get('X-Forwarded-Protocol') || req.protocol) + '://' + req.get('host') + '/tenant/' + default_tenant + '/poster.png';
      }
      module.exports.getSucessResponse(res, "api.tenant.info", responseObj);
    } else {
      module.exports.getErrorResponse(res);
    }
  },
  getSucessResponse: function(res, id, result) {
    res.status(200);
    res.send({
      "id": id,
      "ver": "1.0",
      "ts": dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss:lo"),
      "params": {
        "resmsgid": uuidv1(),
        "msgid": null,
        "status": "successful",
        "err": "",
        "errmsg": ""
      },
      "responseCode": "OK",
      "result": result
    });
    res.end();
  },
  getErrorResponse: function(res) {
    res.status(404);
    res.send({
      "id": "api.error",
      "ver": "1.0",
      "ts": dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss:lo"),
      "params": {
        "resmsgid": uuidv1(),
        "msgid": null,
        "status": "failed",
        "err": "NOT_FOUND",
        "errmsg": "Unable to find resourse requested."
      },
      "responseCode": "NOT_FOUND",
      "result": {}
    });
    res.end();
  }
}
