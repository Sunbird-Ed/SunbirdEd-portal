var userRegHelper = require('../view_helpers/userRegistration/UserRegistrationHelper');

module.exports = function(app, dirname, passport, connectroles) {

    app.all('/*', setUser);

    /** Routes for user registration/login using social network ids */
    app.get('/user/google/login/request', passport.authenticate('google', {scope: appConfig.USER_REG.GOOGLE_AUTH_SCOPES, accessType: 'offline'}));
    app.get('/user/google/login/response', function(req, res, next) {
        passport.authenticate('google', {failureRedirect: '/home'}, function(err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.json({
                    status: 'failed',
                    message: 'User not Found'
                });
            }
            req.login(user, function(err) {
                if (err) { return next(err); }
                return next();
            });
        })(req, res, next);
    }, userRegHelper.userRegistered);

    app.get('/user/facebook/login/request', passport.authenticate('facebook', {scope: appConfig.USER_REG.FACEBOOK_AUTH_SCOPES}));
    app.get('/user/facebook/login/response', function(req, res, next) {
        passport.authenticate('facebook', {failureRedirect: '/home'}, function(err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.json({
                    status: 'failed',
                    message: 'User not Found'
                });
            }
            req.login(user, function(err) {
                if (err) { return next(err); }
                return next();
            });
        })(req, res, next);
    }, userRegHelper.userRegistered);

    app.post('/user/registration/complete', connectroles.can('user_write'), userRegHelper.completeRegistration);
};

function setUser(req, res, next) {
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