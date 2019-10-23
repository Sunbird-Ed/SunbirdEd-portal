const proxyUtils = require('../proxy/proxyUtils.js')
const multer = require('multer');
const fileFieldName = 'users';
const { checkForErrors, isCsvFile, insertCsvIntoDB, generateAndAddCertificates, validateRequestBody, checkUploadStatus } = require('../helpers/eCreds/uploadUserHelper');
const _ = require('lodash');
const bodyParser = require('body-parser');

var storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, _.get(file, 'originalname'))
    }
})

const multerUpload = multer({
    storage: storage
});

module.exports = function (app) {
    app.post('/certificate/user/upload',
        bodyParser.urlencoded({ extended: true }),
        bodyParser.json(),
        proxyUtils.verifyToken(),
        multerUpload.single(fileFieldName),
        validateRequestBody,
        isCsvFile,
        checkForErrors(),
        insertCsvIntoDB(),
        generateAndAddCertificates
    )

    app.post('/certificate/user/upload/status',
        bodyParser.urlencoded({ extended: true }),
        bodyParser.json(),
        checkUploadStatus)
}
