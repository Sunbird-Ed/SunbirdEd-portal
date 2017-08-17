const fs = require('fs'),
  path = require('path'),
  async = require('async');

module.exports = {
  getInfo: function(req, res) {
    var tenantId = req.params.tenantId;
    var responseObj = {
      logo: null,
      favicon: null,
      poster: null
    }
    //TODO: make file checking async for performance
    if (tenantId) {
      if (fs.existsSync(path.join(__dirname, '../tenant', tenantId, 'logo.png'))) {
        responseObj.logo = (req.get('X-Forwarded-Protocol') || req.protocol) + '://' + req.get('host') + '/tenant/' + tenantId + '/logo.png';
      }
      if (fs.existsSync(path.join(__dirname, '../tenant', tenantId, 'favicon.ico'))) {
        responseObj.favicon = (req.get('X-Forwarded-Protocol') || req.protocol) + '://' + req.get('host') + '/tenant/' + tenantId + '/favicon.ico';
      }
      if (fs.existsSync(path.join(__dirname, '../tenant', tenantId, 'poster.png'))) {
        responseObj.poster = (req.get('X-Forwarded-Protocol') || req.protocol) + '://' + req.get('host') + '/tenant/' + tenantId + '/poster.png';
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
