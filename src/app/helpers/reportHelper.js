const envHelper = require('./../helpers/environmentVariablesHelper.js')
const _ = require('lodash')
var azure = require('azure-storage')
const dateFormat = require('dateformat')
const uuidv1 = require('uuid/v1')
const blobService = azure.createBlobService(envHelper.sunbird_azure_account_name, envHelper.sunbird_azure_account_key);

function isValidSlug(allowedRoles) {
    return function (req, res, next) {
        const roles = _.get(req, 'session.roles');
        if ((_.get(req, 'session.rootOrg.slug') === req.params.slug || req.params.slug === 'public') &&
            ((_.intersection(roles, allowedRoles)).length > 0 )) {
            next()
        } else {
            res.status(403)
            res.send({
                'id': 'api.report',
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
        }
    }
}

function azureBlobStream() {
    return function (req, res, next) {
        let container = envHelper.sunbird_azure_report_container_name;
        let fileToGet = req.params.slug + '/' + req.params.filename;
        blobService.getBlobToText(container, fileToGet, function (error, text) {
            if (error && error.statusCode === 404) {
                console.log('Error with status code 404 - ', error);
                res.status(404).send({
                    'id': 'api.report',
                    'ver': '1.0',
                    'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'),
                    'params': {
                        'resmsgid': uuidv1(),
                        'msgid': null,
                        'status': 'failed',
                        'err': 'CLIENT_ERROR',
                        'errmsg': 'Blob not found'
                    },
                    'responseCode': 'CLIENT_ERROR',
                    'result': {}
                });
            } else if (error) {
                console.log('Error without status code 404 - ', error);
                res.status(500).send({
                    'id': 'api.report',
                    'ver': '1.0',
                    'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'),
                    'params': {
                        'resmsgid': uuidv1(),
                        'msgid': null,
                        'status': 'failed',
                        'err': 'SERVER_ERROR',
                        'errmsg': 'Failed to display blob'
                    },
                    'responseCode': 'SERVER_ERROR',
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
