var gmailOAuth = require('../interactions/wrappers/gmail/gmailOAuthWrappers');
var googleAppService = require('../interactions/services/GoogleAppAdminService');
var googleAppHelper = require('../interactions/util/GoogleAppHelper');
var iViewHelper = require('../interactions/view_helpers/InteractionViewHelper');
var ses = require('../interactions/wrappers/ses/sesWrapper.js');
var gmail = require('../interactions/wrappers/gmail/gmailWrapper.js');
var interaction = require('../interactions/services/InteractionService.js');
var playerUtil = require('../view_helpers/player/PlayerUtil.js');
var testDataUploader = require('../commons/TestDataUploader');
var enrollmentHelper = require('../view_helpers/player/LearnerEnrollmentHelper')

module.exports = function(app, dirname, passport) {

    app.all('/*', setUser);
    //OAuth2
    app.get('/v1/gmail/oauth2callback', function(req, res) {
        var err = 0;
        if(req.query.error) {
            err = 1;
        } else {
            gmailOAuth.saveAccessToken(req.query.code);
        }
        res.redirect('/private/player/dashboard#/?inboxId=' + req.session.inboxId + '&tab=courseSettings&err=' + err);
    });

    app.get('/v1/gmail/authorize/:emailId', function(req, res) {
        req.session.inboxId = req.params.emailId;
        var url = gmailOAuth.initiateAuthorization(req.params.emailId);
        res.redirect(url);
    });

    app.get('/v1/gmail/admin/authorize/:emailId', function(req, res) {
        var url = gmailOAuth.adminAuthorization(req.params.emailId);
        res.redirect(url);
    });

    //Interactions
    app.get('/private/interactions/:courseId', function(req, res) {
        res.locals.courseId = playerUtil.addFedoraPrefix(req.params.courseId);
        res.render('interactions/interactionsBrowser.ejs');
    });
    app.post('/private/v1/interactions', iViewHelper.postInteraction);
    app.post('/private/v1/interactions/comment', iViewHelper.comment);
    app.post('/private/v1/interactions/answer', iViewHelper.answer);
    app.post('/private/v1/interactions/list', iViewHelper.listInteractions);
    app.post('/private/v1/interactions/search', iViewHelper.searchInteractions);
    app.get('/private/v1/interactions/:interactionId/:courseId', enrollmentHelper.checkEnrollment, iViewHelper.getInteraction);
    app.post('/private/v1/interactions/action', iViewHelper.applyAction);
    app.post('/private/v1/interactions/tag', iViewHelper.applyTag);
    app.post('/private/v1/interactions/rate', iViewHelper.rate);
    app.post('/private/v1/interactions/follow', iViewHelper.follow);
    app.post('/private/v1/interactions/actionsMetadata', iViewHelper.getInteractionActions);
    app.post('/private/v1/interaction/upload/file/', iViewHelper.uploadFile);
    app.post('/private/v1/interaction/deleteuploadedFile/file/', iViewHelper.deleteuploadedFile);
    app.post('/private/v1/import/testdata/qa', testDataUploader.qaTestData);
    app.get('/private/v1/testdata/qa/:courseId', testDataUploader.getTestDataFromStackExchange);

    app.post('/private/v1/interactions/sets', iViewHelper.getSets);
    app.post('/private/v1/interactions/set', iViewHelper.getSet);
    app.get('/private/v1/course/publish/:courseId', googleAppHelper.createMailboxForCourse);

    app.post('/private/v1/interactions/checkRole', iViewHelper.checkRole);
    app.post('/private/v1/interactions/createSet', iViewHelper.createSet);
    app.post('/private/v1/interactions/updateSet', iViewHelper.updateSet);
    app.post('/private/v1/interactions/addInteractionToSet', iViewHelper.addInteractionToSet);
    app.post('/private/v1/interactions/removeInteractionFromSet', iViewHelper.removeInteractionFromSet);
    app.post('/private/v1/interactions/deleteSet', iViewHelper.deleteSet);

};

function setUser(req, res, next) {
    //console.log('Set user called: ' + req.path);
    if (!req.roles) {
        req.roles = ["public"];
    }
    if (req.user) {
        res.locals.user = req.user;
        req.roles = req.user.roles;
        req.roles.push("public");
    }
    next();
}