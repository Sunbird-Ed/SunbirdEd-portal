const envHelper = require('./../helpers/environmentVariablesHelper.js');
const dateFormat = require('dateformat');
const { v1: uuidv1 } = require('uuid');
const request = require('request');
const _ = require('lodash');
const compareVersions = require('compare-versions');

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
                try {
                    data = JSON.parse(data);
                } catch (e) {
                    console.log('Parsing error: ', e);
                }
                let updateAvailable = false;
                let response = { updateAvailable: updateAvailable };

                if (_.get(data, 'version') && _.get(req, 'body.request.appVersion') && compareVersions.compare(_.get(data, 'version'), _.get(req, 'body.request.appVersion'), '>')) {
                    response.updateAvailable = true;
                    let artifactName = data[_.toLower(_.get(req, 'body.request.os'))][_.toLower(_.get(req, 'body.request.arch'))];
                    response.version = _.get(data, 'version');
                    response.url = `${envHelper.SUNBIRD_PORTAL_BASE_URL}/desktop/latest/${artifactName}`;
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
