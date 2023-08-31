const landingPageContent = require('./mockdata/landing-page-content.json');
const learnLandingPageContent = require('./mockdata/learn-page-content.json');
const learnPageContent = require('./mockdata/learn-page-content.json');
const coursePageContent = require('./mockdata/course-page-content.json');

module.exports = (app) => {
    app.get('/landingPageContent', (req, res) => {
            res.send(landingPageContent);
    });

    app.get('/learnLandingPageContent', (req, res) => {
        res.send(learnPageContent);
    });

    app.get('/coursePageContent', (req, res) => {
        res.send(coursePageContent);
    })
    app.get('/learnLandingPageContent', (req, res) => {
        console.log("hello");
        res.send(learnLandingPageContent);
})
}