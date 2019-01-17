const envHelper = require('./../helpers/environmentVariablesHelper.js')
const _ = require('lodash')
var azure = require('azure-storage')
const dateFormat = require('dateformat')
const uuidv1 = require('uuid/v1')

function isValidSlug() {
    return function (req, res, next) {
        if (_.get(req, 'session.rootOrg.slug') !== req.params.slug) {
            res.status(403)
            res.send({
                'id': 'api.error',
                'ver': '1.0',
                'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'),
                'params': {
                    'resmsgid': uuidv1(),
                    'msgid': null,
                    'status': 'failed',
                    'err': 'FORBIDDEN',
                    'errmsg': 'Forbidden'
                },
                'responseCode': 'FORBIDDEN',
                'result': {}
            })
        } else {
            next()
        }
    }
}

function azureBlobStream() {
    return function (req, res, next) {
        var blobService = azure.createBlobService(envHelper.sunbird_azure_account_name, envHelper.sunbird_azure_account_key);
        blobService.getBlobToText(envHelper.sunbird_azure_report_container_name, req.params.slug + '/config1.json', function (error, text) {
            if (error) {
                console.error(error);
                res.status(500).send({
                    'id': 'api.error',
                    'ver': '1.0',
                    'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'),
                    'params': {
                        'resmsgid': uuidv1(),
                        'msgid': null,
                        'status': 'failed',
                        'err': 'CLIENT_ERROR',
                        'errmsg': 'Failed to stream blob'
                    },
                    'responseCode': 'CLIENT_ERROR',
                    'result': {}
                });
            } else {
                try { text = JSON.parse(text); } catch (e) { }
                res.status(200).send({
                    'id': 'api.report',
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
                    'result': text
                });
            }
        });
    }
}

module.exports.isValidSlug = isValidSlug
module.exports.azureBlobStream = azureBlobStream
