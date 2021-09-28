const bodyParser = require("body-parser");
const { IOSFormMiddleware } = require("../helpers/ios/middleware");
const { appleSininHandler } = require("../helpers/ios/appleSignInHandler");


module.exports = function (app) {
    app.use('/api/data/v1/form/read', bodyParser.json(), IOSFormMiddleware)

    app.post('/apple/auth/ios', bodyParser.json(), appleSininHandler);
}