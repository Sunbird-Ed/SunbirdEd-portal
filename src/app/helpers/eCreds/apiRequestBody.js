const envHelper = require('../environmentVariablesHelper.js');
const _ = require('lodash');
const dateFormat = require('dateformat');
const fs = require('fs');
const path = require('path');
const config = fs.readFileSync(path.join(__dirname,'./config.json'), {encoding: 'utf-8'});
const baseUrl = envHelper.sunbird_environment_base_url;

const certAddRequestBody = (response) => {
    const request = _.pick(response, ['id', 'accessCode', 'jsonData', 'pdfUrl']);
    request['userId'] = _.get(response, 'recipientId');
    request['recipientType'] = 'individual';
    return request;
}

const certGenerateRequestBody = (input) => {
    let template = "";
    let issuer = {};
    let signatoryList = [];
    let signatory = {};
    if (_.get(input, 'rspObj.certType') === 'Best School Certificate') {
        template = "https://drive.google.com/uc?export=download&id=1byiZwFwZv7u7o2PYTayV4tdsWH6w0e3X";
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
        template = "https://drive.google.com/uc?export=download&id=1WyTDLdUGwBf5zy3BgWrdMrPw_yvYbkU4";
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
            "basePath": baseUrl+"/public/certs" 
        }
    }
}

module.exports = { certAddRequestBody, certGenerateRequestBody }