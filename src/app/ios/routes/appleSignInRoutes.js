
const { IOSFormMiddleware } = require('../middleware/formMiddleware');
const { appleSininHandler } = require('../handlers/appleSignInHandler');

const bodyParser = require('body-parser');

module.exports = (app) => {

    app.use('/api/data/v1/form/read', bodyParser.json(), IOSFormMiddleware);

    app.post('/apple/auth/ios', bodyParser.json(), appleSininHandler);

}
