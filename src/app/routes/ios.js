const bodyParser = require("body-parser");
const { IOSFormMiddleware } = require("../helpers/ios/middleware");

module.exports = function (app) {
    app.use('/api/data/v1/form/read', bodyParser.json(), IOSFormMiddleware)
}