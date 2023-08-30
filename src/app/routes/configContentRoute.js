const landingPageContent = require('./mockdata/landing-page-content.json');
const learnPageContent = require('./mockdata/learn-page-content.json');

module.exports = (app) => {
    app.get('/landingPageContent', (req, res) => {
            res.send(landingPageContent);
    });

    app.get('/learnLandingPageContent', (req, res) => {
        res.send(learnPageContent);
    })
}