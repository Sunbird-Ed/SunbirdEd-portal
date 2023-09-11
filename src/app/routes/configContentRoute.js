const landingPageContent = require('./mockdata/landing-page-content.json');

module.exports = (app) => {
    app.get('/landingPageContent', (req, res) => {
            res.send(landingPageContent);
    })
}