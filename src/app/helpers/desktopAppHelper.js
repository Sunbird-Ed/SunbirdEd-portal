const envHelper = require('./../helpers/environmentVariablesHelper.js');
const dateFormat = require('dateformat');
const uuidv1 = require('uuid/v1');
const request = require('request');
const _ = require('lodash');

function getAppUpdate() {
    return function (req, res) {

        request(`${envHelper.DESKTOP_APP_STORAGE_URL}/latest/latest.json`, function (error, resp, data) {
            if (error) {
                res.status(500).send({
                    'id': 'api.desktop.update',
                    'ver': '1.0',
                    'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'),
                    'params': {
                        'resmsgid': uuidv1(),
                        'msgid': null,
                        'status': 'failed',
                        'err': 'SERVER_ERROR',
                        'errmsg': 'Failed to get app details'
                    },
                    'responseCode': 'SERVER_ERROR',
                    'result': {}
                });
            } else {
                try { data = JSON.parse(data); } catch (e) { }
                let updateAvailable = false;
                let response = { updateAvailable: updateAvailable };

                if (_.get(data, 'version') > _.get(req, 'body.request.appVersion')) {
                    response.updateAvailable = true;
                    let artifactName = data[_.get(req, 'body.request.os')][_.get(req, 'body.request.arch')];
                    response.url = `${envHelper.DOMAIN_NAME}/desktop/latest/artifactUrl/${artifactName}`;
                }

                res.status(200).send({
                    'id': 'api.desktop.update',
                    'ver': '1.0',
                    'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'),
                    'params': {
                        'resmsgid': uuidv1(),
                        'msgid': null,
                        'status': 'success',
                        'err': null,
                        'errmsg': null
                    },
                    'responseCode': 'OK',
                    'result': response
                });
            }
        })
    }
}

module.exports.getAppUpdate = getAppUpdate
