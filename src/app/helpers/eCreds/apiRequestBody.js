const _ = require('lodash');

const certAddRequestBody = (response) => {
    const request = _.pick(response, ['id', 'accessCode', 'jsonData', 'pdfUrl']);
    request['userId'] = _.get(response, 'recipientId');
    request['recipientType'] = 'individual';
    request['recipientName'] = 'ravinder kumar';
    return request;
}

const certGenerateRequestBody = (input) => {
    return {
        certificate: {
            "htmlTemplate": "https://drive.google.com/uc?authuser=1&id=1ryB71i0Oqn2c3aqf9N6Lwvet-MZKytoM&export=download",
            "courseName": "new course may23",
            "issuedDate": "2019-08-21",
            "data": [
                {
                    "recipientName": input,
                    "recipientId": "874ed8a5-782e-4f6c-8f36-e0288455901e"
                }
            ],
            "name": "100PercentCompletionCertificate",
            "tag": "0125450863553740809",
            "issuer": {
                "name": "Gujarat Council of Educational Research and Training",
                "url": "https://gcert.gujarat.gov.in/gcert/",
                "publicKey": ["1", "2"]
            },
            "orgId": "ORG_001",
            "signatoryList": [
                {
                    "name": "CEO Gujarat",
                    "id": "CEO",
                    "designation": "CEO",
                    "image": "https://cdn.pixabay.com/photo/2014/11/09/08/06/signature-523237__340.jpg"
                }
            ]
        }
    }
}

module.exports = { certAddRequestBody, certGenerateRequestBody }