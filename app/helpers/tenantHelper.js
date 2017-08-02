const fs = require('fs'),
    path = require('path');

module.exports = {
    getLogo: function(req, res){
        var tenantId = req.params.tenantId;
        console.log(req.get('X-Forwarded-Protocol'), req.protocol);
        if(tenantId && fs.existsSync(path.join(__dirname, '../tenant', tenantId, 'logo.png'))){
            module.exports.getSucessResponse(res, "api.tenant.logo", { "logo" : (req.get('X-Forwarded-Protocol') || req.protocol) + '://' + req.get('host') + '/tenant/' + tenantId + '/logo.png' });
        }else{
            module.exports.getErrorResponse(res);
        }
    },
    getFavicon: function(req, res){
        var tenantId = req.params.tenantId;
        if(tenantId && fs.existsSync(path.join(__dirname, '../tenant', tenantId, 'favicon.png'))){
            module.exports.getSucessResponse(res, "api.tenant.favicon", { "favicon" : (req.get('X-Forwarded-Protocol') || req.protocol) + '://' + req.get('host') + '/tenant/' + tenantId + '/favicon.png' });
        }else{
            module.exports.getErrorResponse(res);
        }
    },
    getSucessResponse: function(res, id, result){
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
    getErrorResponse: function(res){
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