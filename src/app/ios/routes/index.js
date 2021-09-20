const { IOSFormMiddleware } = require('../middleware/formMiddleware.js');
const bodyParser = require('body-parser');

module.exports = app => {
    app.use('/api/data/v1/form/read', bodyParser.json(), IOSFormMiddleware);
}