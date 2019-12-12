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
    const request = _.pick(response, ['id', 'accessCode', 'jsonData', 'pdfUrl']);
    let recipient = {
        "name":_.get(input, 'name'),
        "id": _.get(input, 'name') + _.get(input, 'extId'),
        "type":""
    }
    if (_.get(input, 'rspObj.certType') === 'Best School Certificate') {
        related['type'] = 'best-school';
        related['extId']=_.get(input, 'extId');
        recipient['type'] = 'entity';
        request['recipientType'] = 'entity';
    } else {
        related['type'] = 'best-student';
        related['extId']=_.get(input, 'extId');
        recipient['type'] = 'individual';
        request['recipientType'] = 'individual';
    }
    request['userId'] = _.get(response, 'recipientId');
    request['related'] = related;
    request['recipient'] = recipient;
    //console.log("Add Cert Request obj--->", JSON.stringify(request));
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
    var cert = {
        certificate: {
            "htmlTemplate": template,
            "courseName": "new course may23",
            "issuedDate": dateFormat(new Date(), 'yyyy-mm-dd'),
            "data": [
                {
                    "recipientName": _.get(input, 'name'),
                    "recipientId": _.get(input, 'name') + _.get(input, 'extId')
                }
            ],
            "name": _.get(input, 'rspObj.certType'),
            "tag": "0125450863553740809",// TODO org id of the user who is creating the Cert 
            "issuer": issuer,
            "signatoryList": signatoryList,
            "criteria": {
                "narrative": "course completion certificate"
            },
            // "keys":{  // use the 1st element in the signed keys from the orgSearch api call
            //     "id": key
            // },
            "basePath": baseUrl+"/public/certs" 
        }
    }
    var certKey = _.get(input,'rspObj.userDetails.certKey')
    if(certKey && certKey !== 'undefined'){
        cert['certificate']['keys']= {
            'id': certKey
        }
    }
    //console.log("Generate Cert Request obj--->", JSON.stringify(cert));
    return cert;
}

module.exports = { certAddRequestBody, certGenerateRequestBody }