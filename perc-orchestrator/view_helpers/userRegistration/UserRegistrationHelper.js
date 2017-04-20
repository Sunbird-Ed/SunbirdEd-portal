/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * View Helper for User registration/single singon using social network ids like facebook/google/twitter etc
 *
 * @author Santhosh
 */
var promise_lib = require('when')
	, userHelper = require('../UserViewHelper')
	, enrollmentHelper = require('../player/LearnerEnrollmentHelper')
	, dashboardHelper = require('../player/DashboardViewHelper')
	, enrollmentImportHelper = require('../EnrollmentImportHelper')
	, awsHelper = require('../../interactions/wrappers/ses/sesWrapper')
	, S = require('string')
	, path = require('path')
  	, templatesDir = path.resolve(__dirname, '../..', 'email_templates')
  	, emailTemplates = require('email-templates');

exports.createUser = function(profile, accessToken, refreshToken) {

	var deferred = promise_lib.defer();
	promise_lib.resolve()
	.then(function() {
		var defer = promise_lib.defer();
		if(profile.provider == 'facebook') {
			MongoHelper.update('FacebookAccessToken', {facebook_id: profile.id}, {
				facebook_id: profile.id,
				access_token: accessToken,
				refresh_token: refreshToken
			}, {upsert: true}, function(err, obj) {
				defer.resolve();
			});
		} else {
			MongoHelper.update('GoogleAccessToken', {email_id: profile.id}, {
				email_id: profile.id,
				tokens: {
					access_token: accessToken,
					token_type: 'Bearer',
					refresh_token: refreshToken,
					expiry_date: 0
				},
				type: 'userLogin'
			}, {upsert: true}, function(err, obj) {
				defer.resolve();
			});
		}
		return defer.promise;
	})
	.then(function() {
		return getUserObject(profile, accessToken);
	})
	.then(function(user) {
		return createUnRegisterdUser(user);
	})
	.then(function(user) {
		deferred.resolve(user);
	})
	.catch(function(err) {
		console.log('Error in createUserFromGoogle - ', err);
		deferred.reject(err);
	})
	.done();
	return deferred.promise;
}

function getUserObject(profile, accessToken) {

	var user = {
		metadata: {
    		gender: profile.gender == 'male' ? 'M':'F'
    	},
    	uniqueId: profile.emails[0].value,
    	is_deleted: false,
    	local: {
    		password: 'Il1m1Dot1n'
    	},
		userType: 'student'
	};
	if(profile.provider == 'facebook') {
		user.facebookId = profile.id;
		user.metadata.facebook = profile.profileUrl;
	} else if(profile.provider == 'google') {
		user.googleId = profile.id;
		user.metadata.googleplus = profile._json ? profile._json.url : '';
	}
	var deferred = promise_lib.defer();
	promise_lib.resolve()
	.then(function() {
		var defer = promise_lib.defer();
		MongoHelper.findOne('UserModel', {'uniqueId': user.uniqueId}, function(err, userObj) {
			defer.resolve(userObj);
		});
		return defer.promise;
	})
	.then(function(userObj) {
		if(null == userObj) {
			user.name = {
	    		givenName: profile.name.givenName,
	    		familyName: profile.name.familyName,
	    		middleName: profile.name.middleName
	    	}
	    	user.metadata.email = user.uniqueId;
			var identifier = generateIdentifier(user.name.givenName, undefined, user.name.familyName);
			if(identifier == '' || identifier.length == 0) {
				identifier = user.uniqueId.match(/^([^@]*)@/)[1];
				identifier = S(identifier).strip(' ', '_', '-', '.').s;
			}
			var defer = promise_lib.defer();
		    MongoHelper.find('UserModel', {identifier: { $regex: new RegExp(identifier) }}, {identifier: 1}).toArray(function(err, users) {
		        if(err || users == null || typeof users == 'undefined' || users.length == 0) {
		            defer.resolve(identifier);
		        } else {
		            var tmpArray = [];
		            users.forEach(function(user) {
		                tmpArray.push(user.identifier);
		            });
		            if(tmpArray.indexOf(identifier) == -1) {
		                defer.resolve(identifier);
		            } else {
		                while(tmpArray.indexOf(identifier) != -1) {
		                    identifier = identifier + '' + Math.floor((Math.random() * 1000) + 1);
		                }
		                defer.resolve(identifier);
		            }
		        }
		    });
		    return defer.promise;
		} else {
			if((!user.metadata.image || user.metadata.image == null) && profile.photos && profile.photos.length > 0) {
				user.metadata.image = profile.photos[0].value;
			}
			return user.identifier;
		}
	})
	.then(function(id) {
		user.identifier = id;
		user.inboxEmailId = id + appConfig.USER_INBOX_DOMAIN;
		deferred.resolve(user);
	})
	.catch(function(err) {
		console.log('Error in getUserObjectUsingGoogle - ', err);
		deferred.reject(err);
	})
	.done();
	return deferred.promise;
}

function createUnRegisterdUser(user) {

	var deferred = promise_lib.defer();
	promise_lib.resolve()
	.then(function() {
		return userHelper.upsertUser(user, 'student', LoggerUtil.getConsoleLogger());
	})
	.then(function(resp) {
		userHelper.updateLearnerInfo(resp.user);
		deferred.resolve(resp.user);
	})
	.catch(function(err) {
		console.log('Error in createUnRegisterdUser - ', err);
		deferred.reject(user);
	})
	.done();
	return deferred.promise;
}

function generateIdentifier(givenName, middleName, familyName) {
    var userName = givenName.toLowerCase();
    if(middleName) {
        userName += middleName.toLowerCase().substr(0,1);
    }
    if(familyName) {
        userName += familyName.toLowerCase().substr(0,1);
    }
    userName = S(userName).strip(' ', '_', '-').s;
    return userName;
}

exports.userRegistered = function(req, res) {
	if(req.user.registered) {
		dashboardHelper.getCurrentCourseId(req.user.identifier)
		.then(function(courseId) {
			res.redirect('/private/player/course/' + encodeURIComponent(courseId) + '#/myCourses');
		})
		.catch(function(err) {
			res.redirect('/home');
		}).done();
	} else {
		res.redirect('/register');
	}
}

/**
 * Complete registration
 * 1. Save user profile
 * 2. Update user profile in Learner info
 * 3. Create default enrollments
 * 4. Update registered flag
 *
 * @param  {[Request]} req
 * @param  {[Response]} res
 * @return {[json]}
 */
exports.completeRegistration = function(req, res) {
	var metadata = req.body;
	var displayName = metadata.givenName;
    if (metadata.middleName && metadata.middleName != '') {
        displayName += ' ' + metadata.middleName;
    }
    if (metadata.familyName && metadata.familyName != '') {
        displayName += ' ' + metadata.familyName;
    }
	var updateUser = {
		'name.familyName': metadata.familyName,
		'name.givenName': metadata.givenName,
		'name.middleName': metadata.middleName,
		'displayName': displayName,
		'metadata': metadata,
		'registered': true
	}
	var user;
	promise_lib.resolve()
	.then(function() {
        var deferred = promise_lib.defer();
        MongoHelper.update('UserModel', {identifier: req.user.identifier}, {$set: updateUser}, function(err, user) {
            if(err)
                deferred.reject("Error while saving user details.")
            else
                deferred.resolve();
        });
        return deferred.promise;
    })
    .then(function(){
        var deferred = promise_lib.defer();
        MongoHelper.findOne('UserModel', {identifier: req.user.identifier}, function(err, user) {
            if(err) {
                deferred.reject("Error while updating Learner info.");
            } else {
                deferred.resolve(user);
            }
        });
        return deferred.promise;
    })
    .then(function(userObj) {
    	user = userObj;
    	req.user = userObj;
    	req.session.passport.user = JSON.stringify(userObj);
    	return userHelper.updateLearnerInfo(user);
    })
    .then(function() {
    	if(appConfig.USER_REG.DEFAULT_ENROLL_TO && appConfig.USER_REG.DEFAULT_ENROLL_TO.length > 0) {
    		var promises = [];
    		appConfig.USER_REG.DEFAULT_ENROLL_TO.forEach(function(courseId) {
    			promises.push(enrollmentHelper.enrollLearnerToCourse(true, req.user.identifier, courseId, 'none', 'student'));
    		});
    		return promise_lib.all(promises);
    	}
    })
    .then(function() {
    	// assign coaches
    	if(appConfig.USER_REG.DEFAULT_ENROLL_TO && appConfig.USER_REG.DEFAULT_ENROLL_TO.length > 0) {
    		var promises = [];
    		appConfig.USER_REG.DEFAULT_ENROLL_TO.forEach(function(courseId) {
    			promises.push(enrollmentImportHelper.allocateCoach(courseId, LoggerUtil.getConsoleLogger()));
    		});
    		return promise_lib.all(promises);
    	}
    })
    .then(function() {
    	// assign coaches
    	if(appConfig.USER_REG.DEFAULT_ENROLL_TO && appConfig.USER_REG.DEFAULT_ENROLL_TO.length > 0) {
    		var promises = [];
    		appConfig.USER_REG.DEFAULT_ENROLL_TO.forEach(function(courseId) {
    			promises.push(enrollmentImportHelper.resetCoachCommunities(courseId));
    		});
    		return promise_lib.all(promises);
    	}
    })
    .then(function() {
    	sendRegistrationMail(user);
    })
    .then(function() {
    	// Send registration info ilimi
    	var messageText = "New user registered with the following details:<br><br>"
    	messageText += "<ol>";
    	messageText += "<li>Name: " + user.displayName + "</li>";
    	messageText += "<li>Email: " + user.metadata.email + "</li>";
    	messageText += "<li>Registered Through: " + (user.googleId ? 'Google' : 'Facebook') + "</li>";
    	messageText += "</ol>";
    	var mailoptions = {
	        from: 'learner.support@stackroute.in',
	        to: appConfig.USER_REG.NOTIFY_EMAIL,
	        subject: 'New registration - ' + req.user.displayName, // Subject line
	        html: messageText
	    };
	    awsHelper.sendMail(mailoptions, function(err, data) {
	    	console.log('Send registration alert - ', 'err', err, 'data', data);
	    });
    })
    .then(function() {
    	res.json({registered: true});
    })
    .catch(function(err) {
    	res.json({registered: false, errorMsg: err});
    }).done();
}

function sendRegistrationMail(user) {
	emailTemplates(templatesDir, function(err, template) {
		if (err) {
	    	console.log(err);
	  	} else {
	    	var locals = {
	      		displayName: user.displayName,
    		};

		    // Send a single email
		    template('welcome', locals, function(err, html, text) {
		      	if (err) {
		        	console.log(err);
		      	} else {
			        var mailoptions = {
		        		from: 'learner.support@stackroute.in',
		        		to: user.metadata.email,
		        		subject: 'Welcome to SunBird!',
		        		html: html
	    			};
	    			awsHelper.sendMail(mailoptions, function(err, data) {
	    				console.log('Send welcome email - ', 'err', err, 'data', data);
	    			});
		      	}
		    });
		}
	});
}