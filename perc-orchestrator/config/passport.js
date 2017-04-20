// config/passport.js
var promise_lib = require('when');
var userRegHelper = require('../view_helpers/userRegistration/UserRegistrationHelper');
// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

// load up the user model
var User = require('../models/UserModel');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, JSON.stringify(user));
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        done(null, JSON.parse(id));
    });

    var localResponse = function(req, email, password, done) {
        // callback with email and password from our form
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        MongoHelper.findOne('UserModel', {'$or': [{identifier :  email}, {'uniqueId': email}]}, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);
            // if no user is found, return the message
            if (!user || user.is_deleted)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!bcrypt.compareSync(password, user.local.password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
            // all is well, return successful user
            return done(null, user);
        });
    }

    var authResponse = function(accessToken, refreshToken, profile, done) {

        MongoHelper.findOne('UserModel', {googleId: profile.id}, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err || !user || null == user) {
                promise_lib.resolve()
                .then(function() {
                    return userRegHelper.createUser(profile, accessToken, refreshToken);
                })
                .then(function(user) {
                    return done(null, user);
                })
                .catch(function(err) {
                    return done(err);
                }).done();
            } else {
                // if no user is found, return the message
                if (user.is_deleted)
                    return done(null, false, req.flash('loginMessage', 'User is not active.')); // req.flash is the way to set flashdata using connect-flash
                // all is well, return successful user
                return done(null, user);
            }
        });
    }

    /** Local strategy - Login using email/password */
 	passport.use(
        'local-login',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        }, localResponse)
    );

    /** Google strategy - Login using google */
    passport.use(
        'google',
        new GoogleStrategy({
            clientID: appConfig.USER_REG.GOOGLE_CLIENT_ID,
            clientSecret: appConfig.USER_REG.GOOGLE_CLIENT_SECRET,
            callbackURL: appConfig.USER_REG.GOOGLE_REDIRECT_URI
        }, authResponse)
    );

    /** Facebook strategy - Login using facebook */
    passport.use(
        'facebook',
        new FacebookStrategy({
            clientID: appConfig.USER_REG.FACEBOOK_APP_ID,
            clientSecret: appConfig.USER_REG.FACEBOOK_APP_SECRET,
            callbackURL: appConfig.USER_REG.FACEBOOK_REDIRECT_URI,
            enableProof: false
        }, authResponse)
    );
};
