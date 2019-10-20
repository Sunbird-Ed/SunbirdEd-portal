/**
 * @name : uploadUserHelper.js
 * @description :: Responsible for generating, adding to registry , downloading certificates and uploading to azure for particular csv
 * @author      :: Ravinder Kumar
 */

const envHelper = require('../environmentVariablesHelper.js');
const csvjson = require('csvjson')
const _ = require('lodash')
const dateFormat = require('dateformat')
const uuidv1 = require('uuid/v1')
const path = require('path');
const azure = require('azure-storage');
const blobService = azure.createBlobService(envHelper.sunbird_azure_account_name, envHelper.sunbird_azure_account_key);
const fs = require('fs');
const { certAddRequestBody, certGenerateRequestBody } = require('./apiRequestBody');
const requestPromise = require("request-promise");
const { waterfall, constant } = require('async');
const https = require('https');
const baseDownloadDir = 'Downloads'

const isCsvFile = (req, res, next) => {
    const file = _.get(req, 'file');
    if (path.extname(_.get(file, 'originalname')) === '.csv' && _.get(file, 'mimetype') === 'text/csv') {
        next();
    } else {
        res.status(400)
        const response = {
            responseCode: "CLIENT_ERROR",
            params: {
                err: "INVALID_FILE_FORMAT",
                status: "INVALID_FILE_FORMAT",
                errmsg: "user upload failed due to invalid file format"
            },
            result: {}
        }
        res.send(apiResponse(response))
    }
}

const checkForErrors = () => {
    return function (req, res, next) {
        const fileDetails = _.get(req, 'file');
        const csvObj = fs.readFileSync(path.join(_.get(fileDetails, 'path')), { encoding: 'utf8' });
        const jsonObj = convertCsvToJson(csvObj);
        const errors = checkForFileErrors(jsonObj);
        if (_.isEmpty(errors)) {
            req.jsonObj = jsonObj;
            next();
        } else {
            res.status(400)
            const response = {
                responseCode: "CLIENT_ERROR",
                params: {
                    err: "CORRUPT_FILE",
                    status: "CORRUPT_FILE",
                    errmsg: _.join(errors, ',')
                },
                result: {}
            }
            res.send(apiResponse(response));
        }
    }
}

const checkForFileErrors = (jsonObj) => {
    if (jsonObj) {
        const err = [];
        _.each(jsonObj, function (value, key) {
            var isName = false;
            var error = ''
            for (var val in value) {
                if (val.toLowerCase() === 'name') {
                    isName = validateName(value[val]);
                }
            }
            if (!isName) {
                error = `Row ${(Number(key) + 1)} : Name is Empty`
            }
            if (error) {
                err.push(error);
            }
        });
        return err;
    } else {
        return [];
    }
}

const validateName = (name) => name ? true : false;

const convertCsvToJson = (csv) => csvjson.toObject(csv);

const uploadToAzure = (containerName) => {
    return async (req, res, next) => {
        let result = {}
        try {
            result = await new Promise((resolve, reject) => {
                //    
            });
        } catch (err) {
            console.log(err);
            result = err.message;
        }
        res.send(result);
    }
}

const apiResponse = ({ responseCode, result, params: { err, errmsg, status } }) => {
    return {
        'id': 'api.user.upload',
        'ver': '1.0',
        'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'),
        'params': {
            'resmsgid': uuidv1(),
            'msgid': null,
            'status': status,
            'err': err,
            'errmsg': errmsg
        },
        'responseCode': responseCode,
        'result': result
    }
}

const performDbQuery = () => {
    return (req, res, next) => {
        next();
    }
}

const generateAndAddCertificates = async (req, res, next) => {
    const jsonData = _.get(req, 'jsonObj');
    const certType = _.get(req, 'body.cert-type');
    const successRecords = [];
    const failureRecords = [];

    _.forEach(jsonData, (data, key) => {
        const name = _.get(data, 'name');
        waterfall([constant(name), generateCertificateApiCall, addCertificateApiCall, downloadCertificateApiCall, downloadCertificate], (err, result) => {
            if (!result && err) {
                console.log('Error : Record', key);
                failureRecords.push(key);
            } else {
                console.log('Success: Record', key)
                successRecords.push(key);
            }
        })
    })

    res.send({
        successRecords,
        failureRecords
    })
}

const prepareZip = () => {

}

const downloadCertificate = (signedUrl, folder, callback) => {
    const downloadDir = path.join(__dirname, `${baseDownloadDir}/${folder}`);
    if (!fs.existsSync(downloadDir)) {
        fs.mkdirSync(downloadDir, { recursive: true });
        const file = fs.createWriteStream(`${downloadDir}/aa.pdf`);
        https.get(signedUrl, response => {
            response.on('data', (val) => {
                file.write(val);
            });

            response.on('end', val => {
                file.end();
                callback(null, true)
            });

            response.on('error', err => {
                callback(true, null);
            })
        });
    }
}

const downloadCertificateApiCall = ({ downloadUrl, expiry = 3600 }, callback) => {
    const endPoint = 'certreg/v1/certs/download';
    const options = {
        method: 'POST',
        url: `${_.get(envHelper, 'LEARNER_URL')}/${endPoint}`,
        headers: {
            'Authorization': `Bearer ${_.get(envHelper, 'PORTAL_API_AUTH_TOKEN')}`,
            'Content-Type': 'application/json',
        },
        body: {
            params: {},
            request: {
                pdfUrl: downloadUrl,
                expiry
            }
        },
        json: true
    }
    return requestPromise(options).then(apiResponse => {
        if (_.get(apiResponse, 'responseCode') === 'OK') {
            const signedUrl = _.get(apiResponse, 'result.signedUrl');
            const folder = 'ORG_001'
            callback(null, signedUrl, folder);
        }
    }).catch(err => {
        console.log('error while downloading certificate', _.get(err, 'message'))
        callback(true, null);
    })
}

const addCertificateApiCall = (generateCertApiResponse, callback) => {
    const endPoint = 'certreg/v1/certs/add';
    const options = {
        method: 'POST',
        url: `${_.get(envHelper, 'LEARNER_URL')}/${endPoint}`,
        headers: {
            'Authorization': `Bearer ${_.get(envHelper, 'PORTAL_API_AUTH_TOKEN')}`,
            'Content-Type': 'application/json'
        },
        body: {
            params: {},
            request: certAddRequestBody(_.get(generateCertApiResponse, 'result.response')[0])
        },
        json: true
    }
    return requestPromise(options).then(apiResponse => {
        if (_.get(apiResponse, 'responseCode') === 'OK' && _.get(apiResponse, 'result.id')) {
            const response = {
                downloadUrl: _.get(generateCertApiResponse, 'result.response[0].pdfUrl')
            }
            callback(null, response);
        }
    }).catch(err => {
        console.log('Error while adding certificate to registry', _.get(err, 'message'))
        callback(true, null);
    })
}



const generateCertificateApiCall = (name, callback) => {
    const endPoint = 'v1/certs/generate';
    const request = certGenerateRequestBody(name); //send the name here ( missed )
    const options = {
        method: 'POST',
        url: `${_.get(envHelper, 'LEARNER_URL')}/cert/${endPoint}`,
        headers: {
            'Authorization': `Bearer ${_.get(envHelper, 'PORTAL_API_AUTH_TOKEN')}`,
            'Content-Type': 'application/json'
        },
        body: {
            params: {},
            request
        },
        json: true
    }
    return requestPromise(options).then(apiResponse => {
        if (_.get(apiResponse, 'responseCode') === 'OK' && _.get(apiResponse, 'result.response')) {
            callback(null, apiResponse);
        }
    }).catch(err => {
        console.log('Error while generating certificate', _.get(err, 'message'));
        callback(true, null)
    })
}

const validateRequestBody = (req, res, next) => {
    const file = _.get(req, 'file');
    const certType = _.get(req, 'body.cert-type');
    let err = [];
    if (!file) err.push('csv-file-missing');
    if (!certType) err.push('cert-type-missing')
    if (!file || !certType) {
        res.status(404);
        const response = {
            responseCode: "CLIENT_ERROR",
            params: {
                err: "INVALID_REQUEST",
                status: "INVALID_REQUEST",
                errmsg: _.join(err, ', ')
            },
            result: {}
        }
        res.send(apiResponse(response))
    } else {
        next();
    }
}

module.exports = {
    isCsvFile,
    checkForErrors,
    performDbQuery,
    generateAndAddCertificates,
    validateRequestBody
}