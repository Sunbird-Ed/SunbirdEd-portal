const bodyParser = require("body-parser");
const { appleSininHandler } = require("../helpers/ios/appleSignInHandler");


module.exports = function (app) {
    app.post('/apple/auth/ios', bodyParser.json(), appleSininHandler);
}