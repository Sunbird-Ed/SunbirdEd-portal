const envHelper = require('../environmentVariablesHelper.js');
const _ = require('lodash');
const dateFormat = require('dateformat');
const fs = require('fs');
const path = require('path');
const config = fs.readFileSync(path.join(__dirname,'./config.json'), {encoding: 'utf-8'});
const baseUrl = envHelper.sunbird_environment_base_url;
const key = envHelper.sunbird_cert_key;
const certAddRequestBody = (response,input) => {
    let related = {
        "type": ""
    };
    if (_.get(input, 'rspObj.certType') === 'Best School Certificate') {
        related['type'] = 'best-school';
        related['best-school']='best-school';
        related['key1']=_.get(input, 'extId');
    } else {
        related['type'] = 'best-student';
        related['best-student']='best-student';
        related['key1']=_.get(input, 'extId');
    }
    const request = _.pick(response, ['id', 'accessCode', 'jsonData', 'pdfUrl']);
    request['userId'] = _.get(response, 'recipientId');
    request['recipientType'] = 'individual';
    request['related'] = related;
    return request;
}

const certGenerateRequestBody = (input) => {
    let template = "";
    let issuer = {};
    let signatoryList = [];
    let signatory = {};
    if (_.get(input, 'rspObj.certType') === 'Best School Certificate') {
        template = "https://sunbirddev.blob.core.windows.net/certtemplate/cert_school1651.zip";
        issuer = {
            "name": "Gujarat Council of Educational Research and Training",
            "url": "https://gcert.gujarat.gov.in/gcert/"
        }
        signatory = {
            "name": "CEO Gujarat",
            "id": "CEO",
            "designation": "CEO",
            "image": "https://preprodall.blob.core.windows.net/e-credentials/signature-523237__340.jpg"
        }
        signatoryList.push(signatory);
    } else {
        template = "https://sunbirddev.blob.core.windows.net/certtemplate/cert_student1619.zip";
        issuer = {
            "name": "Gujarat Council of Educational Research and Training",
            "url": "https://gcert.gujarat.gov.in/gcert/"
        }
        signatory = {
            "name": "CEO Gujarat",
            "id": "CEO",
            "designation": "CEO",
            "image": "https://preprodall.blob.core.windows.net/e-credentials/signature-523237__340.jpg"
        }
        signatoryList.push(signatory);
    }
    return {
        certificate: {
            "htmlTemplate": template,
            "courseName": "new course may23",
            "issuedDate": dateFormat(new Date(), 'yyyy-mm-dd'),
            "data": [
                {
                    "recipientName": _.get(input, 'name'),
                    "recipientId": "874ed8a5-782e-4f6c-8f36-e0288455901e"
                }
            ],
            "name": _.get(input, 'rspObj.certType'),
            "tag": "0125450863553740809",
            "issuer": issuer,
            "signatoryList": signatoryList,
            "criteria": {
                "narrative": "course completion certificate"
            },
            // "keys":{
            //     "id": key
            // },
            "basePath": baseUrl+"/public/certs" 
        }
    }
}

module.exports = { certAddRequestBody, certGenerateRequestBody }